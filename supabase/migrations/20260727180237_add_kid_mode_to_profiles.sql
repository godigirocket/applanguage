-- ═══════════════════════════════════════════════════════════════
-- Kid Mode — a profile created as a kid account (ages 4-10) gets a
-- restricted experience: no Community access, simpler lesson content.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_kid_account BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS kid_age SMALLINT CHECK (kid_age IS NULL OR (kid_age BETWEEN 4 AND 10));

COMMENT ON COLUMN public.profiles.is_kid_account IS 'Set at onboarding when the account is created for a child (4-10). Gates community access and simplifies lesson content client-side.';
COMMENT ON COLUMN public.profiles.kid_age IS 'Child age (4-10), only meaningful when is_kid_account is true.';
