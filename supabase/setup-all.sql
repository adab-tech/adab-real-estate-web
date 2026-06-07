-- Adab Real Estate — full Supabase setup (schema + seed)
-- Run once in Supabase SQL Editor

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

drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);

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
  price_period text check (price_period in ('year', 'month')),
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

drop policy if exists "Public can read properties" on public.properties;
create policy "Public can read properties"
  on public.properties
  for select
  to anon, authenticated
  using (true);

create index if not exists properties_slug_idx on public.properties (slug);
create index if not exists properties_type_idx on public.properties (type);
create index if not exists properties_featured_idx on public.properties (featured);
create index if not exists properties_published_at_idx on public.properties (published_at desc);

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

insert into public.properties (
  id, slug, title, description, type, category, price_ngn, price_period,
  location, beds, baths, sqm, features, images, status, featured, published_at
) values
(
  'prop-001',
  '3-bed-apartment-lekki-phase-1',
  '3-Bedroom Apartment in Lekki Phase 1',
  'Spacious 3-bedroom apartment with ensuite masters, fitted kitchen, 24-hour security, and dedicated parking. Ideal for professionals and small families seeking premium living on the Lekki corridor.',
  'rent', 'apartment', 4500000, 'year',
  '{"city":"Lagos","area":"Lekki Phase 1","state":"Lagos","address":"Admiralty Way","lat":6.4474,"lng":3.4723}'::jsonb,
  3, 3, 165,
  '["24/7 security","Fitted kitchen","Dedicated parking","Backup power","Swimming pool"]'::jsonb,
  '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80","https://images.unsplash.com/photo-1560448204-e02f11c457d2?w=1200&q=80"]'::jsonb,
  'available', true, '2026-05-12'
),
(
  'prop-002',
  '4-bed-duplex-gwarinpa',
  '4-Bedroom Duplex in Gwarinpa',
  'Modern duplex in a serene Gwarinpa estate with boys'' quarters, landscaped compound, and proximity to schools and shopping. Perfect for family ownership in Abuja.',
  'sale', 'duplex', 185000000, null,
  '{"city":"Abuja","area":"Gwarinpa","state":"FCT","lat":9.1087,"lng":7.3946}'::jsonb,
  4, 5, 320,
  '["Boys'' quarters","Landscaped compound","POP ceiling","Tarred estate roads","Borehole water"]'::jsonb,
  '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"]'::jsonb,
  'available', true, '2026-05-18'
),
(
  'prop-003',
  'commercial-plot-victoria-island',
  'Commercial Plot on Victoria Island',
  'Prime commercial land suitable for mixed-use development on Victoria Island. Excellent visibility and access for corporate or retail projects in Lagos''s central business district.',
  'sale', 'commercial', 950000000, null,
  '{"city":"Lagos","area":"Victoria Island","state":"Lagos","lat":6.4281,"lng":3.4219}'::jsonb,
  null, null, 1200,
  '["C of O","High foot traffic zone","Mixed-use zoning","Paved access road"]'::jsonb,
  '["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"]'::jsonb,
  'available', false, '2026-04-30'
),
(
  'prop-004',
  '2-bed-flat-maitama',
  '2-Bedroom Flat in Maitama',
  'Elegant 2-bedroom flat in a secure Maitama block with concierge, standby generator, and underground parking. Walking distance to diplomatic zones and premium dining.',
  'rent', 'apartment', 6000000, 'year',
  '{"city":"Abuja","area":"Maitama","state":"FCT","lat":9.0833,"lng":7.4951}'::jsonb,
  2, 2, 120,
  '["Concierge","Standby generator","Underground parking","Elevator"]'::jsonb,
  '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"]'::jsonb,
  'available', true, '2026-05-22'
),
(
  'prop-005',
  '5-bed-mansion-banana-island',
  '5-Bedroom Mansion on Banana Island',
  'Ultra-luxury waterfront mansion with private cinema, smart home systems, infinity pool, and dedicated staff quarters. One of Lagos''s most exclusive addresses.',
  'sale', 'house', 2800000000, null,
  '{"city":"Lagos","area":"Banana Island","state":"Lagos","lat":6.4541,"lng":3.4186}'::jsonb,
  5, 7, 850,
  '["Waterfront","Smart home","Infinity pool","Private cinema","Staff quarters"]'::jsonb,
  '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"]'::jsonb,
  'under_offer', true, '2026-03-15'
),
(
  'prop-006',
  'studio-apartment-wuse-2',
  'Studio Apartment in Wuse 2',
  'Compact studio ideal for young professionals. Fully serviced building with reliable power, security, and easy access to Wuse markets and CBD offices.',
  'rent', 'apartment', 1200000, 'year',
  '{"city":"Abuja","area":"Wuse 2","state":"FCT","lat":9.0765,"lng":7.4856}'::jsonb,
  1, 1, 45,
  '["Serviced building","Security","Backup power"]'::jsonb,
  '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80"]'::jsonb,
  'available', false, '2026-06-01'
),
(
  'prop-007',
  'residential-land-lekki-500sqm',
  'Residential Land — 500 sqm in Lekki',
  'Dry residential plot in a gated Lekki community with good road network and documented title. Ready for immediate development.',
  'sale', 'land', 75000000, null,
  '{"city":"Lagos","area":"Lekki","state":"Lagos","lat":6.435,"lng":3.5}'::jsonb,
  null, null, 500,
  '["Gated community","Dry land","Survey plan","Registered title"]'::jsonb,
  '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"]'::jsonb,
  'available', false, '2026-05-08'
),
(
  'prop-008',
  '3-bed-terrace-port-harcourt',
  '3-Bedroom Terrace in Port Harcourt',
  'Well-maintained terrace home in a quiet GRA extension with modern finishes, ample parking, and easy access to schools and major roads.',
  'sale', 'house', 95000000, null,
  '{"city":"Port Harcourt","area":"GRA Phase 2","state":"Rivers","lat":4.8156,"lng":7.0114}'::jsonb,
  3, 4, 210,
  '["Modern finishes","Ample parking","Quiet estate"]'::jsonb,
  '["https://images.unsplash.com/photo-1605276374101-dee2a0ed3cd6?w=1200&q=80"]'::jsonb,
  'available', false, '2026-05-25'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  price_ngn = excluded.price_ngn,
  status = excluded.status,
  featured = excluded.featured,
  updated_at = now();
