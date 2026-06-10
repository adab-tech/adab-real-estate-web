-- Adab Real Estate — anonymous site analytics (page views)
-- Run once in Supabase SQL Editor. Idempotent.
--
-- Geo fields are populated from Vercel headers in production:
--   x-vercel-ip-country, x-vercel-ip-country-region, x-vercel-ip-city
-- On Cloudflare: cf-ipcountry, cf-region, cf-ipcity
-- Local dev returns null geo — expected.

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  referrer_source text not null default 'direct',
  country text,
  region text,
  city text,
  device_type text not null default 'unknown',
  browser text not null default 'unknown',
  visitor_id text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

create index if not exists page_views_country_idx
  on public.page_views (country);

create index if not exists page_views_visitor_id_idx
  on public.page_views (visitor_id);

alter table public.page_views enable row level security;

-- Inserts happen server-side via SUPABASE_SERVICE_ROLE_KEY (no public insert policy).

drop policy if exists "Admins can read page_views" on public.page_views;
create policy "Admins can read page_views"
  on public.page_views
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
