alter table public.analyses
  add column if not exists published_at timestamptz,
  add column if not exists channel_id text,
  add column if not exists subscriber_count bigint;
