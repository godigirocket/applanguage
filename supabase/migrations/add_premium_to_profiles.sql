-- ═══════════════════════════════════════════════════════════════
-- ADD PREMIUM FIELDS TO PROFILES
-- Adds subscription fields to existing profiles table
-- ═══════════════════════════════════════════════════════════════

-- Add premium subscription fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS upgraded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cakto_customer_email TEXT,
  ADD COLUMN IF NOT EXISTS cakto_order_id TEXT,
  ADD COLUMN IF NOT EXISTS cakto_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS last_payment_status TEXT;

-- Create index for faster premium checks
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_premium_until ON public.profiles(premium_until);
CREATE INDEX IF NOT EXISTS idx_profiles_cakto_email ON public.profiles(cakto_customer_email);

-- Add comments
COMMENT ON COLUMN public.profiles.plan IS 'User subscription plan: free or premium';
COMMENT ON COLUMN public.profiles.premium_until IS 'Premium expiration date (NULL = lifetime/permanent)';
COMMENT ON COLUMN public.profiles.upgraded_at IS 'When user upgraded to premium';
COMMENT ON COLUMN public.profiles.cakto_customer_email IS 'Email used in Cakto purchase';
COMMENT ON COLUMN public.profiles.cakto_order_id IS 'Cakto order/transaction ID';
COMMENT ON COLUMN public.profiles.cakto_subscription_id IS 'Cakto subscription ID (if recurring)';
COMMENT ON COLUMN public.profiles.last_payment_status IS 'Last payment event status';

-- Function to check if user has active premium
CREATE OR REPLACE FUNCTION public.has_active_premium(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan TEXT;
  expiry_date TIMESTAMPTZ;
BEGIN
  SELECT plan, premium_until 
  INTO user_plan, expiry_date
  FROM public.profiles 
  WHERE id = user_id;
  
  -- If no plan found, return false
  IF user_plan IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- If not premium, return false
  IF user_plan != 'premium' THEN
    RETURN FALSE;
  END IF;
  
  -- If premium_until is NULL, it's lifetime premium
  IF expiry_date IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if premium hasn't expired
  RETURN expiry_date > NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.has_active_premium(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_premium(UUID) TO service_role;

-- Verification query
SELECT 
  'Premium fields added' as status,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE plan = 'premium') as premium_users,
  COUNT(*) FILTER (WHERE plan = 'free') as free_users
FROM public.profiles;
