-- Do not expose development or demonstration accounts in the public ranking.
-- The function intentionally returns only public display fields.
create or replace function public.get_leaderboard(limit_count int default 20)
returns table (id uuid, full_name text, xp int, avatar_url text)
language sql
security definer
set search_path = public
stable
as $$
  select id, full_name, xp, avatar_url
  from public.profiles
  where xp > 0
    and coalesce(full_name, '') !~* '(^|\\s)(lume|langlume)\\s*(demo|test)'
    and coalesce(full_name, '') !~* '^(demo|test|placeholder)(\\s|$)'
  order by xp desc
  limit greatest(1, least(coalesce(limit_count, 20), 100));
$$;

revoke all on function public.get_leaderboard(int) from public;
grant execute on function public.get_leaderboard(int) to authenticated;
