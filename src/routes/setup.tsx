import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/lume/AppHeader";

export const Route = createFileRoute("/setup")({
  component: SetupPage,
});

const SQL = `-- Run this in your Supabase SQL Editor at supabase.com → SQL Editor → New Query

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
$$;`;

function SetupPage() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 24px', animation: 'pageEnter 0.6s ease-out both' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
          <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: '32px', marginBottom: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>
            One-time setup needed
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
            Copy the SQL below and run it in your Supabase SQL editor. This creates all the tables Lume needs.
          </p>
        </div>
        
        <div className="glass-dark" style={{ borderRadius: '16px', padding: '24px', marginBottom: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', background: 'var(--text-primary)' }}>
          <pre style={{ color: '#A8F0C8', fontSize: '12px', lineHeight: 1.6, overflow: 'auto', margin: 0, fontFamily: 'monospace', maxHeight: '300px' }}>
            {SQL}
          </pre>
          <button onClick={() => { navigator.clipboard.writeText(SQL); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{
            position: 'absolute', top: '12px', right: '12px',
            padding: '6px 14px', borderRadius: '8px',
            background: copied ? 'var(--accent-green)' : 'rgba(255,255,255,0.1)',
            color: 'white', border: 'none', cursor: 'pointer',
            fontSize: '12px', fontWeight: 700, transition: 'all 0.2s'
          }}>
            {copied ? '✅ Copied!' : '📋 Copy SQL'}
          </button>
        </div>
        
        <div className="glass" style={{ borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', border: '1px solid white' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '15px', color: 'var(--text-primary)' }}>Steps:</h3>
          {[
            'Go to supabase.com → your project',
            'Click "SQL Editor" in the left sidebar',
            'Click "New Query"',
            'Paste the SQL above',
            'Click "Run" (green button)',
            'Come back here and refresh',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '8px', alignItems: 'flex-start' }}>
              <span style={{ background: 'var(--accent-green)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>{i+1}</span>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{step}</span>
            </div>
          ))}
        </div>
        
        <a href="/home" style={{ display: 'block', textAlign: 'center', padding: '14px', borderRadius: '14px', background: 'var(--accent-green)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '15px', boxShadow: '0 4px 15px rgba(45,74,62,0.2)', transition: 'transform 0.2s' }} className="hover:scale-[1.02] active:scale-[0.98]">
          I've run it — take me home →
        </a>
      </div>
    </div>
  );
}
