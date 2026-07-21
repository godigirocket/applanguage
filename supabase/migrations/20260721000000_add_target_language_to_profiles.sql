-- ═══════════════════════════════════════════════════════════════
-- FIX: target_language column never existed on profiles
--
-- The app's code (LanguageSwitcher.tsx, settings.tsx, onboarding.tsx) has
-- always written the user's target/learning language to a `target_language`
-- column that was never actually created by any migration — only `language`
-- (used elsewhere as the *interface* language) exists. Every write to
-- target_language has been silently failing with PostgREST error PGRST204
-- ("Could not find the 'target_language' column of 'profiles' in the schema
-- cache"), so target-language choices never persisted across sessions/devices
-- — a returning user on a fresh browser always fell back to the default "en".
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS target_language TEXT DEFAULT 'en' CHECK (target_language IN ('en', 'es', 'pt'));

COMMENT ON COLUMN public.profiles.target_language IS 'Language the user is learning (distinct from `language`, the interface/UI language).';
