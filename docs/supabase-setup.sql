-- =============================================================================
-- SnapLink — Production Supabase schema
-- =============================================================================
-- Run once in: Supabase Dashboard → SQL Editor
--
-- Matches client/src/services/api (auth, urls, clicks) as of current app:
--   • Signup/login (auth.users + user_metadata.name)
--   • Link CRUD (urls) + QR images (storage bucket: qrs)
--   • Public redirect slug lookup (anon SELECT on urls)
--   • Click analytics insert on redirect (anon INSERT on clicks)
--   • Dashboard analytics (authenticated SELECT own clicks)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Extensions
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Tables
-- -----------------------------------------------------------------------------

create table if not exists public.urls (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null,
  original_url  text not null,
  short_url     text not null,
  custom_url    text,
  qr            text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint urls_title_not_empty
    check (char_length(trim(title)) > 0),
  constraint urls_original_url_not_empty
    check (char_length(trim(original_url)) > 0),
  constraint urls_short_url_not_empty
    check (char_length(trim(short_url)) > 0),
  constraint urls_short_url_unique
    unique (short_url),
  constraint urls_custom_url_unique
    unique (custom_url)
);

comment on table public.urls is 'Short links owned by authenticated users';
comment on column public.urls.user_id is 'Owner; must match auth.uid() on write';
comment on column public.urls.short_url is 'Auto-generated slug used in /:id redirect';
comment on column public.urls.custom_url is 'Optional vanity slug; unique when set';
comment on column public.urls.qr is 'Public URL of PNG in storage bucket qrs';
comment on column public.urls.original_url is 'Destination URL opened after redirect';

create table if not exists public.clicks (
  id         uuid primary key default gen_random_uuid(),
  url_id     uuid not null references public.urls (id) on delete cascade,
  city       text not null default 'Unknown',
  country    text not null default 'Unknown',
  device     text not null default 'desktop',
  created_at timestamptz not null default now()
);

comment on table public.clicks is 'Append-only click events for analytics charts';

-- -----------------------------------------------------------------------------
-- 2. Indexes
-- -----------------------------------------------------------------------------

-- urls: dashboard list, slug resolution, vanity lookup
create index if not exists urls_user_id_idx
  on public.urls (user_id);

create index if not exists urls_user_id_created_at_idx
  on public.urls (user_id, created_at desc);

create index if not exists urls_short_url_idx
  on public.urls (short_url);

create index if not exists urls_custom_url_idx
  on public.urls (custom_url)
  where custom_url is not null;

-- clicks: per-link stats + dashboard aggregates
create index if not exists clicks_url_id_idx
  on public.clicks (url_id);

create index if not exists clicks_url_id_created_at_idx
  on public.clicks (url_id, created_at desc);

create index if not exists clicks_created_at_idx
  on public.clicks (created_at desc);

create index if not exists clicks_device_idx
  on public.clicks (device);

create index if not exists clicks_country_idx
  on public.clicks (country);

-- -----------------------------------------------------------------------------
-- 3. Triggers
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists urls_set_updated_at on public.urls;
create trigger urls_set_updated_at
  before update on public.urls
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. Row Level Security
-- -----------------------------------------------------------------------------

alter table public.urls enable row level security;
alter table public.urls force row level security;

alter table public.clicks enable row level security;
alter table public.clicks force row level security;

-- ─── urls ───────────────────────────────────────────────────────────────────

-- SELECT (authenticated): dashboard, link detail — own rows only
drop policy if exists "urls_select_own" on public.urls;
create policy "urls_select_own"
  on public.urls
  for select
  to authenticated
  using (auth.uid() = user_id);

-- SELECT (anon): redirect page resolves short_url / custom_url
-- Important: do NOT grant this to authenticated (would expose all links).
drop policy if exists "urls_select_public_resolve" on public.urls;
create policy "urls_select_public_resolve"
  on public.urls
  for select
  to anon
  using (true);

-- INSERT (authenticated): createUrl — user_id must match JWT
drop policy if exists "urls_insert_own" on public.urls;
create policy "urls_insert_own"
  on public.urls
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- UPDATE (authenticated): future edits; same ownership
drop policy if exists "urls_update_own" on public.urls;
create policy "urls_update_own"
  on public.urls
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE (authenticated): deleteUrl — RLS enforces owner even if client omits user_id filter
drop policy if exists "urls_delete_own" on public.urls;
create policy "urls_delete_own"
  on public.urls
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ─── clicks ─────────────────────────────────────────────────────────────────

-- SELECT (authenticated): analytics for links you own
drop policy if exists "clicks_select_own_urls" on public.clicks;
create policy "clicks_select_own_urls"
  on public.clicks
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.urls
      where urls.id = clicks.url_id
        and urls.user_id = auth.uid()
    )
  );

-- INSERT (anon + authenticated): storeClicks on redirect
drop policy if exists "clicks_insert_public" on public.clicks;
create policy "clicks_insert_public"
  on public.clicks
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from public.urls
      where urls.id = clicks.url_id
    )
  );

-- No UPDATE / DELETE policies on clicks → denied (append-only analytics)

-- -----------------------------------------------------------------------------
-- 5. Privileges (API roles)
-- -----------------------------------------------------------------------------

revoke all on table public.urls from anon, authenticated;
revoke all on table public.clicks from anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;

grant select on table public.urls to anon;
grant select, insert, update, delete on table public.urls to authenticated;

grant select, insert on table public.clicks to anon, authenticated;

-- service_role bypasses RLS (Supabase dashboard / server-side jobs only)

-- -----------------------------------------------------------------------------
-- 6. Storage — QR codes (bucket: qrs)
-- -----------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'qrs',
  'qrs',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- SELECT — anyone can load QR <img src=".../qrs/...">
drop policy if exists "qrs_public_read" on storage.objects;
create policy "qrs_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'qrs');

-- INSERT — authenticated users uploading canvas blob on link create
drop policy if exists "qrs_auth_insert" on storage.objects;
create policy "qrs_auth_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'qrs');

-- UPDATE — replace QR file if you add re-generate later
drop policy if exists "qrs_auth_update" on storage.objects;
create policy "qrs_auth_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'qrs')
  with check (bucket_id = 'qrs');

-- DELETE — manual cleanup or via urls delete trigger
drop policy if exists "qrs_auth_delete" on storage.objects;
create policy "qrs_auth_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'qrs');

-- -----------------------------------------------------------------------------
-- 7. Auth dashboard checklist (not SQL)
-- -----------------------------------------------------------------------------
-- • Authentication → Providers: Email (+ Google for OAuth)
-- • URL config: Site URL + redirect allowlist including /dashboard
-- • Sign-up metadata: { "name": "..." } only
-- • client/.env:
--     VITE_SUPABASE_URL=https://<ref>.supabase.co
--     VITE_SUPABASE_KEY=<anon-key>
-- =============================================================================
