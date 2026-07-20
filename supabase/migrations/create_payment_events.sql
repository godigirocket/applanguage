-- ═══════════════════════════════════════════════════════════════
-- CREATE PAYMENT EVENTS TABLE
-- Tracks all payment webhooks from Cakto for idempotency and auditing
-- ═══════════════════════════════════════════════════════════════

-- Create payment_events table
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Provider info
  provider TEXT DEFAULT 'cakto' NOT NULL,
  
  -- Event identification
  event_id TEXT,
  event_type TEXT NOT NULL,
  
  -- Order/subscription info
  order_id TEXT,
  subscription_id TEXT,
  
  -- Customer info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Product info
  product_id TEXT,
  product_name TEXT,
  
  -- Payment info
  amount NUMERIC(10, 2),
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL,
  
  -- Raw data (for debugging)
  raw_payload JSONB NOT NULL,
  
  -- Processing status
  processed BOOLEAN DEFAULT FALSE,
  processing_error TEXT,
  user_id_matched UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ,
  
  -- Prevent duplicate event processing
  CONSTRAINT unique_event_id UNIQUE NULLS NOT DISTINCT (event_id, provider)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_events_customer_email ON public.payment_events(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON public.payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_subscription_id ON public.payment_events(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_status ON public.payment_events(status);
CREATE INDEX IF NOT EXISTS idx_payment_events_processed ON public.payment_events(processed);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type ON public.payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON public.payment_events(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only service role can access payment events
-- Users should NOT see payment events directly
CREATE POLICY "Service role can manage payment events"
  ON public.payment_events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT ALL ON public.payment_events TO service_role;
GRANT SELECT ON public.payment_events TO authenticated; -- Read-only for debugging

-- Comments
COMMENT ON TABLE public.payment_events IS 'Stores all payment webhook events from Cakto for idempotency and audit trail';
COMMENT ON COLUMN public.payment_events.event_id IS 'Unique event ID from payment provider (for idempotency)';
COMMENT ON COLUMN public.payment_events.processed IS 'Whether this event has been processed successfully';
COMMENT ON COLUMN public.payment_events.raw_payload IS 'Complete webhook payload for debugging';
COMMENT ON COLUMN public.payment_events.user_id_matched IS 'User ID matched by email (NULL if no account found yet)';

-- Function to find pending payments for a user
CREATE OR REPLACE FUNCTION public.claim_pending_payments(user_email TEXT, user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  claimed_count INTEGER := 0;
  event_record RECORD;
BEGIN
  -- Find unprocessed approved payment events for this email
  FOR event_record IN 
    SELECT id, order_id, subscription_id, amount, event_type, raw_payload
    FROM public.payment_events
    WHERE customer_email = LOWER(TRIM(user_email))
      AND processed = FALSE
      AND status IN ('paid', 'approved', 'active')
      AND event_type IN ('purchase_approved', 'subscription_created', 'subscription_renewed')
  LOOP
    -- Upgrade user to premium
    UPDATE public.profiles
    SET 
      plan = 'premium',
      upgraded_at = NOW(),
      cakto_customer_email = user_email,
      cakto_order_id = event_record.order_id,
      cakto_subscription_id = event_record.subscription_id,
      last_payment_status = event_record.event_type,
      premium_until = NULL -- Lifetime for now (can be adjusted)
    WHERE id = user_id;
    
    -- Mark event as processed
    UPDATE public.payment_events
    SET 
      processed = TRUE,
      processed_at = NOW(),
      user_id_matched = user_id
    WHERE id = event_record.id;
    
    claimed_count := claimed_count + 1;
  END LOOP;
  
  RETURN claimed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.claim_pending_payments(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_pending_payments(TEXT, UUID) TO service_role;

-- Verification
SELECT 
  'payment_events table created' as status,
  COUNT(*) as total_events
FROM public.payment_events;
