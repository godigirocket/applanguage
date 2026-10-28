BEGIN;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_plan text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS billing_event_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.billing_offers (
  id text PRIMARY KEY, product_id text NOT NULL, plan text NOT NULL,
  price numeric NOT NULL, days integer
);
INSERT INTO public.billing_offers VALUES
 ('t3z3hhs','d796ae06-6ae5-4efc-8e84-b087aee194d7','premium_monthly',9.9,30),
 ('g3hm6pm','d796ae06-6ae5-4efc-8e84-b087aee194d7','premium_quarterly',25.9,90),
 ('wf6iugo','d796ae06-6ae5-4efc-8e84-b087aee194d7','premium_annual',65.9,365),
 ('33vgk53','d796ae06-6ae5-4efc-8e84-b087aee194d7','premium_lifetime',110,null),
 ('y7y2kbh','a29c1259-f930-44e6-b5a3-b2603501d8d7','premium_monthly',9.9,30),
 ('323bbhy','40362e5c-d96b-46d2-bc80-0297866c9609','premium_monthly',9.9,30),
 ('36ifrqs','a29c1259-f930-44e6-b5a3-b2603501d8d7','premium_lifetime',119,null),
 ('odipwwf','a29c1259-f930-44e6-b5a3-b2603501d8d7','premium_annual',63.9,365)
ON CONFLICT(id) DO UPDATE SET product_id=excluded.product_id, plan=excluded.plan, price=excluded.price, days=excluded.days;
ALTER TABLE public.billing_offers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.billing_offers FROM anon, authenticated;

-- Older webhook versions stored the shared secret in the raw body. It is
-- not needed for audit after verification and must not remain in the ledger.
UPDATE public.payment_events SET raw_payload=raw_payload-'secret' WHERE raw_payload ? 'secret';
-- Preserve pending purchases made before this revision, with their original
-- delivery date. Unknown offers stay pending for manual reconciliation.
WITH legacy AS (
 SELECT e.id,e.event_id,e.event_type,e.order_id,e.subscription_id,e.customer_email,e.amount,e.currency,e.status,e.created_at,
   CASE WHEN jsonb_typeof(raw_payload->'data')='array' THEN raw_payload->'data'->0 ELSE coalesce(raw_payload->'data',raw_payload) END AS payload
 FROM public.payment_events e WHERE NOT processed AND NOT(raw_payload ? 'offer_id')
)
UPDATE public.payment_events e SET raw_payload=jsonb_build_object(
 'event_id','legacy:'||l.id::text,'event_type',l.event_type,'order_id',l.order_id,'subscription_id',l.subscription_id,
 'email',l.customer_email,'offer_id',l.payload->'offer'->>'id','product_id',l.payload->'product'->>'id',
 'amount',l.amount,'currency',coalesce(l.currency,'BRL'),'status',l.status,'occurred_at',l.created_at,
 'action',CASE WHEN lower(l.event_type) IN ('refund','chargeback','payment_refunded') THEN 'revoke'
   WHEN lower(l.event_type) IN ('subscription_canceled','subscription_cancelled','subscription_renewal_refused') THEN 'cancel'
   WHEN lower(l.event_type) IN ('purchase_approved','payment_approved','subscription_renewed') AND lower(l.status) IN ('paid','approved','active','completed') THEN 'approve' ELSE 'ignore' END)
FROM legacy l WHERE e.id=l.id AND EXISTS(SELECT 1 FROM public.billing_offers b WHERE b.id=l.payload->'offer'->>'id' AND b.product_id=l.payload->'product'->>'id');

-- These fields represent verified payment state, never client preferences.
CREATE OR REPLACE FUNCTION public.protect_billing_profile() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='INSERT' THEN
   IF current_user IN ('authenticated','anon') AND (coalesce(NEW.plan,'free')<>'free' OR NEW.premium_until IS NOT NULL OR NEW.subscription_plan IS NOT NULL) THEN
     RAISE EXCEPTION 'billing_fields_are_server_only' USING ERRCODE='42501';
   END IF;
   RETURN NEW;
 END IF;
 IF current_user IN ('authenticated','anon') AND (
   NEW.plan IS DISTINCT FROM OLD.plan OR NEW.premium_until IS DISTINCT FROM OLD.premium_until OR
   NEW.subscription_plan IS DISTINCT FROM OLD.subscription_plan OR NEW.billing_event_at IS DISTINCT FROM OLD.billing_event_at OR
   NEW.cancel_at_period_end IS DISTINCT FROM OLD.cancel_at_period_end
 ) THEN RAISE EXCEPTION 'billing_fields_are_server_only' USING ERRCODE='42501'; END IF;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_billing_profile ON public.profiles;
CREATE TRIGGER protect_billing_profile BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_billing_profile();

CREATE OR REPLACE FUNCTION public.process_cakto_event(p_event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
 event_row public.payment_events%ROWTYPE;
 customer_id uuid;
 profile_row public.profiles%ROWTYPE;
 offer_row public.billing_offers%ROWTYPE;
 action text := p_event->>'action';
 event_time timestamptz := (p_event->>'occurred_at')::timestamptz;
 expires timestamptz;
BEGIN
 IF event_time IS NULL THEN RAISE EXCEPTION 'invalid_event_timestamp'; END IF;
 IF coalesce(p_event->>'event_id','')='' OR coalesce(p_event->>'email','')='' THEN RAISE EXCEPTION 'invalid_payment_event'; END IF;
 IF action NOT IN ('approve','revoke','cancel','ignore') THEN RAISE EXCEPTION 'invalid_payment_action'; END IF;
 SELECT * INTO offer_row FROM public.billing_offers WHERE id=p_event->>'offer_id' AND product_id=p_event->>'product_id';
 IF NOT FOUND THEN RAISE EXCEPTION 'unknown_product_or_offer'; END IF;
 IF action='approve' AND ((p_event->>'amount') IS NULL OR (p_event->>'amount')::numeric < offer_row.price OR coalesce(p_event->>'currency','')<>'BRL') THEN
   RAISE EXCEPTION 'payment_amount_or_currency_mismatch';
 END IF;
 INSERT INTO public.payment_events(provider,event_id,event_type,order_id,subscription_id,customer_email,product_id,amount,currency,status,raw_payload,processed)
 VALUES ('cakto',p_event->>'event_id',p_event->>'event_type',p_event->>'order_id',p_event->>'subscription_id',lower(p_event->>'email'),p_event->>'product_id',(p_event->>'amount')::numeric,p_event->>'currency',p_event->>'status',p_event,false)
 ON CONFLICT(event_id,provider) DO NOTHING;
 SELECT * INTO event_row FROM public.payment_events WHERE event_id=p_event->>'event_id' AND provider='cakto' FOR UPDATE;
 IF event_row.processed THEN RETURN jsonb_build_object('processed',true,'duplicate',true); END IF;
 SELECT id INTO customer_id FROM auth.users WHERE lower(email)=lower(p_event->>'email') AND email_confirmed_at IS NOT NULL;
 IF customer_id IS NULL THEN RETURN jsonb_build_object('processed',false,'pendingSignup',true); END IF;
 SELECT * INTO profile_row FROM public.profiles WHERE id=customer_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('processed',false,'pendingProfile',true); END IF;

 -- Delivery order must not reactivate a refunded subscription with old events.
 IF profile_row.billing_event_at IS NULL OR event_time >= profile_row.billing_event_at THEN
   IF action='approve' THEN
     IF offer_row.days IS NULL THEN expires:=NULL;
     ELSIF nullif(p_event->>'period_end','') IS NOT NULL THEN expires:=(p_event->>'period_end')::timestamptz;
     ELSE expires:=greatest(event_time, CASE WHEN profile_row.cakto_subscription_id=p_event->>'subscription_id' THEN profile_row.premium_until ELSE event_time END) + make_interval(days=>offer_row.days); END IF;
     UPDATE public.profiles SET plan='premium',subscription_plan=offer_row.plan,premium_until=expires,
       upgraded_at=event_time,cakto_customer_email=p_event->>'email',cakto_order_id=p_event->>'order_id',
       cakto_subscription_id=p_event->>'subscription_id',last_payment_status=p_event->>'event_type',
       billing_event_at=event_time,cancel_at_period_end=false WHERE id=customer_id;
   ELSIF action='revoke' THEN
     -- Refunds of an older order must not revoke a newer paid order.
     IF profile_row.cakto_order_id IS NULL OR profile_row.cakto_order_id=p_event->>'order_id' THEN
       UPDATE public.profiles SET plan='free',premium_until=NULL,subscription_plan=NULL,
         billing_event_at=event_time,last_payment_status=p_event->>'event_type',cancel_at_period_end=false WHERE id=customer_id;
     END IF;
   ELSIF action='cancel' THEN
     IF profile_row.cakto_subscription_id IS NOT NULL AND profile_row.cakto_subscription_id=p_event->>'subscription_id' THEN
       UPDATE public.profiles SET cancel_at_period_end=true,billing_event_at=event_time,last_payment_status=p_event->>'event_type'
       WHERE id=customer_id;
     END IF;
   END IF;
 END IF;
 UPDATE public.payment_events SET processed=true,processed_at=now(),user_id_matched=customer_id,processing_error=NULL WHERE id=event_row.id;
 RETURN jsonb_build_object('processed',true,'duplicate',false);
END;
$$;
REVOKE ALL ON FUNCTION public.process_cakto_event(jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_cakto_event(jsonb) TO service_role;

CREATE OR REPLACE FUNCTION public.claim_pending_payments(user_email text,user_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE actual_email text; event_row record; claimed integer:=0; result jsonb;
BEGIN
 IF auth.uid() IS NULL OR auth.uid()<>user_id THEN RAISE EXCEPTION 'not_authorized' USING ERRCODE='42501'; END IF;
 SELECT email INTO actual_email FROM auth.users WHERE id=auth.uid() AND email_confirmed_at IS NOT NULL;
 IF actual_email IS NULL OR lower(actual_email)<>lower(user_email) THEN RAISE EXCEPTION 'email_mismatch' USING ERRCODE='42501'; END IF;
 FOR event_row IN SELECT id,order_id,created_at,raw_payload FROM public.payment_events
   WHERE customer_email=lower(actual_email) AND processed=false AND raw_payload ? 'offer_id' ORDER BY created_at
 LOOP
   IF EXISTS(SELECT 1 FROM public.payment_events r WHERE r.order_id=event_row.order_id AND r.customer_email=lower(actual_email)
       AND lower(r.event_type) IN ('refund','chargeback','payment_refunded') AND r.created_at>=event_row.created_at) THEN
     UPDATE public.payment_events SET processed=true,processed_at=now(),user_id_matched=user_id WHERE id=event_row.id;
     CONTINUE;
   END IF;
   result:=public.process_cakto_event(event_row.raw_payload);
   IF result->>'processed'='true' THEN claimed:=claimed+1; END IF;
   UPDATE public.payment_events SET processed=true,processed_at=now(),user_id_matched=user_id WHERE id=event_row.id AND result->>'processed'='true';
 END LOOP;
 RETURN claimed;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_pending_payments(text,uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_pending_payments(text,uuid) TO authenticated;
COMMIT;
