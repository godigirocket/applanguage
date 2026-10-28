create table if not exists public.push_subscriptions (
  endpoint text primary key check(length(endpoint)<=2048),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription jsonb not null check(octet_length(subscription::text)<12000),
  language text not null default 'pt' check(language in ('pt','en','es')),
  enabled boolean not null default true,
  last_activity_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  last_sent_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon,authenticated;
grant all on public.push_subscriptions to service_role;
create index if not exists push_reminders_due on public.push_subscriptions(last_activity_at,last_attempt_at) where enabled;
create or replace function public.claim_due_reminders(p_limit integer default 100)
returns table(endpoint text,subscription jsonb,language text)
language sql security definer set search_path=public,pg_temp as $$
  with due as (
    select s.endpoint from public.push_subscriptions s
    where enabled and last_activity_at<now()-interval '24 hours'
      and (last_attempt_at is null or last_attempt_at<now()-interval '20 hours')
      and (last_sent_at is null or last_sent_at<now()-interval '20 hours')
    order by last_attempt_at nulls first,created_at
    for update skip locked limit greatest(0,least(p_limit,100))
  )
  update public.push_subscriptions s set last_attempt_at=now() from due
  where s.endpoint=due.endpoint returning s.endpoint,s.subscription,s.language;
$$;
revoke all on function public.claim_due_reminders(integer) from public,anon,authenticated;
grant execute on function public.claim_due_reminders(integer) to service_role;
