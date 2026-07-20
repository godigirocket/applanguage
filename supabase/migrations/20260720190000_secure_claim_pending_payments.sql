-- ═══════════════════════════════════════════════════════════════
-- SECURITY FIX: claim_pending_payments privilege escalation
--
-- The original function (create_payment_events.sql) is SECURITY DEFINER
-- and granted to `authenticated`, but never checked that the caller
-- actually owns the user_id/email being claimed for. Any logged-in user
-- could call the RPC directly with someone else's email + their own
-- user_id and steal that person's unclaimed Cakto purchase.
--
-- Fix: derive identity from auth.uid() and the caller's own profile
-- email; reject if the supplied user_id/user_email don't match.
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.claim_pending_payments(user_email TEXT, user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed_count INTEGER := 0;
  event_record RECORD;
  own_email TEXT;
BEGIN
  -- A caller may only claim payments for their own authenticated account.
  IF auth.uid() IS NULL OR auth.uid() <> user_id THEN
    RAISE EXCEPTION 'not_authorized' USING ERRCODE = '42501';
  END IF;

  SELECT email INTO own_email FROM public.profiles WHERE id = auth.uid();

  IF own_email IS NULL OR LOWER(TRIM(own_email)) <> LOWER(TRIM(user_email)) THEN
    RAISE EXCEPTION 'email_mismatch' USING ERRCODE = '42501';
  END IF;

  FOR event_record IN
    SELECT id, order_id, subscription_id, amount, event_type, raw_payload
    FROM public.payment_events
    WHERE customer_email = LOWER(TRIM(user_email))
      AND processed = FALSE
      AND status IN ('paid', 'approved', 'active')
      AND event_type IN ('purchase_approved', 'subscription_created', 'subscription_renewed')
  LOOP
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
$$;

GRANT EXECUTE ON FUNCTION public.claim_pending_payments(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_pending_payments(TEXT, UUID) TO service_role;
