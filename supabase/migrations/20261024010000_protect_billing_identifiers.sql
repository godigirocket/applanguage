BEGIN;
-- Refund/cancellation matching depends on these identifiers. Clients must not
-- be able to replace them to prevent a verified provider event taking effect.
CREATE OR REPLACE FUNCTION public.protect_billing_profile()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    IF coalesce(NEW.plan, 'free') <> 'free'
      OR NEW.premium_until IS NOT NULL OR NEW.subscription_plan IS NOT NULL
      OR NEW.billing_event_at IS NOT NULL OR NEW.cancel_at_period_end
      OR NEW.upgraded_at IS NOT NULL OR NEW.cakto_customer_email IS NOT NULL
      OR NEW.cakto_order_id IS NOT NULL OR NEW.cakto_subscription_id IS NOT NULL
      OR NEW.last_payment_status IS NOT NULL THEN
      RAISE EXCEPTION 'billing_fields_are_server_only' USING ERRCODE = '42501';
    END IF;
  ELSIF NEW.plan IS DISTINCT FROM OLD.plan
    OR NEW.premium_until IS DISTINCT FROM OLD.premium_until
    OR NEW.subscription_plan IS DISTINCT FROM OLD.subscription_plan
    OR NEW.billing_event_at IS DISTINCT FROM OLD.billing_event_at
    OR NEW.cancel_at_period_end IS DISTINCT FROM OLD.cancel_at_period_end
    OR NEW.upgraded_at IS DISTINCT FROM OLD.upgraded_at
    OR NEW.cakto_customer_email IS DISTINCT FROM OLD.cakto_customer_email
    OR NEW.cakto_order_id IS DISTINCT FROM OLD.cakto_order_id
    OR NEW.cakto_subscription_id IS DISTINCT FROM OLD.cakto_subscription_id
    OR NEW.last_payment_status IS DISTINCT FROM OLD.last_payment_status THEN
    RAISE EXCEPTION 'billing_fields_are_server_only' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
COMMIT;
