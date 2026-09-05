alter table public.analyses
  add column if not exists view_count bigint,
  add column if not exists like_count bigint,
  add column if not exists comment_count bigint,
  add column if not exists tags jsonb,
  add column if not exists category text;
