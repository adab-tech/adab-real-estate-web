-- Adab Real Estate Agency — Supabase schema
-- Run in Supabase SQL Editor after creating a project.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  property_id text,
  property_slug text,
  name text not null,
  phone text not null,
  email text,
  message text not null,
  source text not null default 'contact',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- Allow anonymous inserts from the public website (no read access)
create policy "Public can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

-- Optional: allow authenticated staff to read inquiries in Supabase dashboard
-- create policy "Staff can read inquiries"
--   on public.inquiries
--   for select
--   to authenticated
--   using (true);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);
