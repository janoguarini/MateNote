-- MateNote database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ============================================================================
-- analyses
-- Global, shareable cache of one analysis per YouTube video. Video metadata,
-- transcript, and AI insights all live on this row so a video only ever
-- needs to be fetched/transcribed/analyzed once, no matter how many users
-- look at it. Publicly readable by design — an analysis page is shareable
-- by link, the way the product spec calls for.
-- ============================================================================
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  video_id text not null unique,
  video_url text not null,
  title text not null,
  channel text not null,
  thumbnail_url text not null,
  duration_seconds integer,

  transcript jsonb not null,       -- { fullText, segments, wordCount }
  summary text not null,
  key_takeaways jsonb not null,    -- string[]
  hook jsonb not null,             -- { text, type, whyItWorks, strength, formula }
  structure jsonb not null,        -- { timestamp, title, description }[]
  key_moments jsonb not null,      -- { timestamp, title, description }[]
  content_ideas jsonb not null,    -- { title, hook, format, angle, explanation }[]
  creator_takeaways jsonb not null, -- string[]

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists analyses_video_id_idx on public.analyses (video_id);
create index if not exists analyses_created_at_idx on public.analyses (created_at desc);

-- ============================================================================
-- saved_items
-- A user's personal research library. Saving an (already-cached) analysis
-- to your account, and the backbone of "recent analyses" on the dashboard.
-- ============================================================================
create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, analysis_id)
);

create index if not exists saved_items_user_id_idx on public.saved_items (user_id, created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.analyses enable row level security;
alter table public.saved_items enable row level security;

-- Analyses are publicly readable (shareable by link). All writes happen
-- server-side through API routes using the service role key, so there is
-- intentionally no public insert/update/delete policy here.
create policy "Analyses are publicly readable"
  on public.analyses for select
  using (true);

-- Saved items are private to each user.
create policy "Users can view their own saved items"
  on public.saved_items for select
  using (auth.uid() = user_id);

create policy "Users can save items to their own library"
  on public.saved_items for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own saved items"
  on public.saved_items for delete
  using (auth.uid() = user_id);
