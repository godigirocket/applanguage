-- ═══════════════════════════════════════════════════════════════
-- FIX: avatar_url column missing on the live profiles table
--
-- The app's code (AvatarPicker.tsx, profile.tsx) reads and writes
-- `profiles.avatar_url` to sync the chosen avatar across devices, but the
-- live database returns PostgREST error 42703 ("column profiles.avatar_url
-- does not exist") on every read and write — confirmed live via a fresh
-- signup + /profile visit. AvatarPicker.tsx swallows the write error and
-- silently falls back to a "this device only" toast, and profile.tsx's read
-- ignores the error entirely, so this has been failing silently for every
-- user: avatar choice never actually persists server-side. Same failure
-- class as the target_language column fixed in
-- 20260721000000_add_target_language_to_profiles.sql.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

COMMENT ON COLUMN public.profiles.avatar_url IS 'Selected built-in avatar, stored as "lume-avatar:<id>" (see AvatarPicker.tsx).';
