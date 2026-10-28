-- Additive, per-account cloud backup. No existing course or billing data is changed.
create table if not exists public.learning_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"attempts":[],"reviews":{},"words":{},"recentIds":[],"bestStreak":0}',
  updated_at timestamptz not null default now()
);
alter table public.learning_state enable row level security;
revoke all on public.learning_state from anon, authenticated;
grant select on public.learning_state to authenticated;
create policy learning_state_read_own on public.learning_state for select to authenticated using (user_id=auth.uid());

create or replace function public.sync_learning_state(p_state jsonb) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare
  uid uuid := auth.uid();
  old_state jsonb;
  result jsonb;
  merged_reviews jsonb;
  merged_words jsonb;
begin
  if uid is null then raise exception 'Authentication required' using errcode='28000'; end if;
  if p_state is null or jsonb_typeof(p_state)<>'object' or octet_length(p_state::text)>500000
    or jsonb_typeof(p_state->'attempts') is distinct from 'array'
    or jsonb_typeof(p_state->'reviews') is distinct from 'object'
    or jsonb_typeof(p_state->'words') is distinct from 'object'
    or jsonb_typeof(p_state->'recentIds') is distinct from 'array'
    or jsonb_array_length(p_state->'attempts')>100 or jsonb_array_length(p_state->'recentIds')>300
  then raise exception 'Invalid learning state' using errcode='22023'; end if;
  insert into public.learning_state(user_id) values(uid) on conflict do nothing;
  select state into old_state from public.learning_state where user_id=uid for update;
  select coalesce(jsonb_object_agg(key,value),'{}') into merged_reviews from (
    select distinct on(key) key,value from (
      select key,value,0 as origin from jsonb_each(old_state->'reviews')
      union all select key,value,1 from jsonb_each(p_state->'reviews')
    ) entries where jsonb_typeof(value)='object' and jsonb_typeof(value->'lastReview')='number'
    order by key, (value->>'lastReview')::numeric desc,origin asc
  ) selected;
  select coalesce(jsonb_object_agg(key,value),'{}') into merged_words from (
    select distinct on(key) key,value from (
      select key,value,0 as origin from jsonb_each(old_state->'words')
      union all select key,value,1 from jsonb_each(p_state->'words')
    ) entries where jsonb_typeof(value)='object' and jsonb_typeof(value->'term')='string'
    order by key,
      (value ? 'lastReviewedAt' or case when jsonb_typeof(value->'correctAnswers')='number' then (value->>'correctAnswers')::numeric>0 else false end or case when jsonb_typeof(value->'mistakes')='number' then (value->>'mistakes')::numeric>0 else false end) desc,
      coalesce(value->>'lastReviewedAt',value->>'updatedAt','') desc,origin asc
  ) selected;
  with attempts as (
    select distinct on(item->>'id') item from jsonb_array_elements((old_state->'attempts')||(p_state->'attempts')) item
    where jsonb_typeof(item)='object' and jsonb_typeof(item->'id')='string'
      and jsonb_typeof(item->'date')='string' and jsonb_typeof(item->'score')='number' and jsonb_typeof(item->'total')='number'
      and (item->>'total')::numeric>0 and (item->>'score')::numeric between 0 and (item->>'total')::numeric
    order by item->>'id'
  ), recent as (select item from attempts order by item->>'date' desc,item->>'id' desc limit 100)
  select jsonb_build_object(
    'attempts',coalesce((select jsonb_agg(item order by item->>'date',item->>'id') from recent),'[]'),
    'reviews',merged_reviews,'words',merged_words,
    'recentIds',coalesce((select jsonb_agg(value order by idx) from (
      select value,max(idx) as idx from jsonb_array_elements((old_state->'recentIds')||(p_state->'recentIds')) with ordinality as ids(value,idx)
      where jsonb_typeof(value)='string' group by value order by max(idx) desc limit 300
    ) ids),'[]'),
    'bestStreak',greatest(coalesce((old_state->>'bestStreak')::integer,0),case when jsonb_typeof(p_state->'bestStreak')='number' then least(100000,greatest(0,(p_state->>'bestStreak')::integer)) else 0 end)
  ) into result;
  if octet_length(result::text)>1000000 then raise exception 'Learning backup limit reached' using errcode='22023'; end if;
  update public.learning_state set state=result,updated_at=now() where user_id=uid;
  return result;
end;
$$;
revoke all on function public.sync_learning_state(jsonb) from public,anon;
grant execute on function public.sync_learning_state(jsonb) to authenticated;
