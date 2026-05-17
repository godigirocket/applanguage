-- Run this in your Supabase SQL Editor at supabase.com → SQL Editor → New Query

-- PROFILES
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text default 'Friend',
  language text default 'en',
  level text default 'beginner',
  preferred_mood text default 'calm',
  onboarding_done boolean default false,
  xp integer default 0,
  streak integer default 0,
  last_session_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CONVERSATIONS
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  topic_slug text not null default 'free-talk',
  topic_title text default 'Free Talk',
  language text default 'en',
  mood text default 'calm',
  messages jsonb default '[]'::jsonb,
  duration_seconds integer default 0,
  xp_earned integer default 0,
  created_at timestamptz default now()
);

-- SAVED EXPRESSIONS
create table if not exists public.saved_expressions (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  expression text not null,
  context text default '',
  topic_slug text default '',
  created_at timestamptz default now()
);

-- PROGRESS SNAPSHOTS
create table if not exists public.progress_snapshots (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  date date default current_date,
  speaking_confidence integer default 0,
  xp_total integer default 0,
  created_at timestamptz default now()
);

-- QUIZ ATTEMPTS
create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  mode text default 'quick-quiz',
  language text default 'en',
  score integer default 0,
  total integer default 0,
  xp_earned integer default 0,
  streak_best integer default 0,
  completed_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.saved_expressions enable row level security;
alter table public.progress_snapshots enable row level security;
alter table public.quiz_attempts enable row level security;

-- POLICIES
do $$ begin
  if not exists (select 1 from pg_policies where tablename='profiles' and policyname='own_profile') then
    create policy "own_profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename='conversations' and policyname='own_conversations') then
    create policy "own_conversations" on public.conversations for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='saved_expressions' and policyname='own_expressions') then
    create policy "own_expressions" on public.saved_expressions for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='progress_snapshots' and policyname='own_progress') then
    create policy "own_progress" on public.progress_snapshots for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='quiz_attempts' and policyname='own_quiz') then
    create policy "own_quiz" on public.quiz_attempts for all using (auth.uid() = student_id) with check (auth.uid() = student_id);
  end if;
end $$;

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SAFE CREATE PROFILE FOR EXISTING LOGGED-IN USERS
do $$
begin
  insert into public.profiles (id, email, full_name)
  select 
    u.id,
    u.email,
    coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1))
  from auth.users u
  on conflict (id) do nothing;
exception when others then
  raise notice 'Could not automatically migrate existing auth users (non-fatal): %', SQLERRM;
end;
$$;
