-- ═══════════════════════════════════════════════════════════════
-- Real community stats + leaderboard, replacing hardcoded/simulated
-- numbers in the UI (fake "2,847 members online", fake rival XP growth
-- on the leaderboard, etc).
--
-- profiles and lesson_progress are intentionally locked to owner-only
-- SELECT (profiles holds email/billing fields) — a plain client query
-- only ever sees the current user's own row, never the platform total.
-- These SECURITY DEFINER functions return only an aggregate count or a
-- narrow, non-sensitive column set (name/xp/avatar), never raw rows
-- with sensitive fields, so they're safe to expose to any authenticated
-- user without loosening the underlying table's RLS.
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count int DEFAULT 20)
RETURNS TABLE (id uuid, full_name text, xp int, avatar_url text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id, full_name, xp, avatar_url
  FROM public.profiles
  WHERE xp > 0
  ORDER BY xp DESC
  LIMIT limit_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS TABLE (member_count bigint, posts_today bigint, lessons_completed bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    (SELECT count(*) FROM public.profiles),
    (SELECT count(*) FROM public.community_posts WHERE created_at >= date_trunc('day', now())),
    (SELECT count(*) FROM public.lesson_progress WHERE status = 'completed');
$$;

GRANT EXECUTE ON FUNCTION public.get_community_stats() TO authenticated;
