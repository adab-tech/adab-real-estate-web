-- Adab Real Estate Agency — Supabase schema
-- Run in Supabase SQL Editor after creating a project.

-- ─── Inquiries (lead capture) ───────────────────────────────────────────────

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

create policy "Public can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

-- ─── Properties (CMS) ───────────────────────────────────────────────────────

create table if not exists public.properties (
  id text primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  type text not null check (type in ('sale', 'rent')),
  category text not null check (
    category in ('apartment', 'house', 'duplex', 'land', 'commercial')
  ),
  price_ngn bigint not null,
  price_period text check (price_period is null or price_period in ('year', 'month', 'negotiable')),
  location jsonb not null,
  beds smallint,
  baths smallint,
  sqm integer,
  features jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  status text not null default 'available' check (
    status in ('available', 'under_offer', 'sold', 'rented')
  ),
  featured boolean not null default false,
  published_at date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

-- Website visitors can read listings; edits happen in Supabase Table Editor
create policy "Public can read properties"
  on public.properties
  for select
  to anon, authenticated
  using (true);

create index if not exists properties_slug_idx on public.properties (slug);
create index if not exists properties_type_idx on public.properties (type);
create index if not exists properties_featured_idx on public.properties (featured);
create index if not exists properties_published_at_idx on public.properties (published_at desc);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists properties_updated_at on public.properties;
create trigger properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();
