-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (auto-created on signup)
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
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  topic_slug text not null,
  topic_title text,
  language text default 'en',
  mood text default 'calm',
  messages jsonb default '[]'::jsonb,
  duration_seconds integer default 0,
  xp_earned integer default 0,
  created_at timestamptz default now()
);

-- SAVED EXPRESSIONS
create table if not exists public.saved_expressions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  expression text not null,
  context text,
  topic_slug text,
  created_at timestamptz default now()
);

-- PROGRESS SNAPSHOTS
create table if not exists public.progress_snapshots (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  date date default current_date,
  speaking_confidence integer default 0,
  xp_total integer default 0,
  created_at timestamptz default now()
);

-- QUIZ ATTEMPTS
create table if not exists public.quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  mode text,
  language text,
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
drop policy if exists "own_profile" on public.profiles;
create policy "own_profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own_conversations" on public.conversations;
create policy "own_conversations" on public.conversations for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

drop policy if exists "own_expressions" on public.saved_expressions;
create policy "own_expressions" on public.saved_expressions for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

drop policy if exists "own_progress" on public.progress_snapshots;
create policy "own_progress" on public.progress_snapshots for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

drop policy if exists "own_quiz" on public.quiz_attempts;
create policy "own_quiz" on public.quiz_attempts for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

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

-- UPSERT EXISTING USER (for current logged-in user who has no profile yet)
insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;
