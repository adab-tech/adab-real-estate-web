-- Fix: property_id uuid vs properties.id text mismatch
--
-- Symptom: tenant-portal.sql fails with FK type error when creating leases,
-- management_agreements, maintenance_requests, or tenant_applications.
--
-- Run in Supabase SQL Editor (safe for partial/failed tenant-portal runs):
--   1. supabase/fix-tenant-portal-fk.sql   (this file)
--   OR run the full updated supabase/tenant-portal.sql
--
-- Drops dependent tables first, then recreates with property_id text.

create extension if not exists "pgcrypto";

-- Triggers (ignore if tables missing)
drop trigger if exists rent_payments_set_updated_at on public.rent_payments;
drop trigger if exists maintenance_requests_set_updated_at on public.maintenance_requests;
drop trigger if exists leases_set_updated_at on public.leases;
drop trigger if exists management_agreements_set_updated_at on public.management_agreements;

-- Child tables first (FK to leases / properties)
drop table if exists public.rent_payments cascade;
drop table if exists public.maintenance_requests cascade;
drop table if exists public.leases cascade;
drop table if exists public.management_agreements cascade;
drop table if exists public.tenant_applications cascade;

-- ---------------------------------------------------------------------------
-- Leases
-- ---------------------------------------------------------------------------
create table public.leases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles (id) on delete cascade,
  property_id text references public.properties (id) on delete set null,
  property_title text not null default '',
  rent_ngn bigint,
  rent_period text check (rent_period is null or rent_period in ('month', 'year')),
  deposit_ngn bigint,
  lease_start date,
  lease_end date,
  status text not null default 'draft' check (
    status in ('draft', 'pending_signature', 'active', 'expired', 'terminated', 'retired')
  ),
  document_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leases_tenant_id_idx on public.leases (tenant_id);
create index leases_status_idx on public.leases (status);

-- ---------------------------------------------------------------------------
-- Management agreements (owner ↔ Adab)
-- ---------------------------------------------------------------------------
create table public.management_agreements (
  id uuid primary key default gen_random_uuid(),
  property_id text references public.properties (id) on delete set null,
  owner_id uuid references public.profiles (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'paused', 'terminated', 'retired')
  ),
  start_date date,
  end_date date,
  fee_percent numeric(5, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index management_agreements_property_id_idx
  on public.management_agreements (property_id);
create index management_agreements_status_idx
  on public.management_agreements (status);

-- ---------------------------------------------------------------------------
-- Maintenance requests
-- ---------------------------------------------------------------------------
create table public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles (id) on delete cascade,
  lease_id uuid references public.leases (id) on delete set null,
  property_id text references public.properties (id) on delete set null,
  title text not null,
  description text not null,
  category text not null default 'general' check (
    category in ('general', 'plumbing', 'electrical', 'hvac', 'structural', 'pest', 'other')
  ),
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'urgent', 'emergency')
  ),
  status text not null default 'submitted' check (
    status in ('open', 'submitted', 'assigned', 'in_progress', 'resolved', 'closed', 'cancelled')
  ),
  photo_urls text[] not null default '{}',
  assigned_to text,
  resolution_notes text,
  admin_notes text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index maintenance_requests_tenant_id_idx
  on public.maintenance_requests (tenant_id);
create index maintenance_requests_status_idx
  on public.maintenance_requests (status);

-- ---------------------------------------------------------------------------
-- Rent payments (recreated — depends on leases)
-- ---------------------------------------------------------------------------
create table public.rent_payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles (id) on delete cascade,
  lease_id uuid references public.leases (id) on delete set null,
  amount_ngn bigint not null,
  payment_type text not null default 'rent' check (
    payment_type in ('rent', 'deposit', 'service_charge', 'other')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'failed', 'refunded', 'manual')
  ),
  paystack_reference text,
  notes text,
  paid_at timestamptz,
  recorded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index rent_payments_tenant_id_idx on public.rent_payments (tenant_id);
create index rent_payments_status_idx on public.rent_payments (status);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists leases_set_updated_at on public.leases;
create trigger leases_set_updated_at
  before update on public.leases
  for each row execute function public.set_updated_at();

drop trigger if exists management_agreements_set_updated_at on public.management_agreements;
create trigger management_agreements_set_updated_at
  before update on public.management_agreements
  for each row execute function public.set_updated_at();

drop trigger if exists maintenance_requests_set_updated_at on public.maintenance_requests;
create trigger maintenance_requests_set_updated_at
  before update on public.maintenance_requests
  for each row execute function public.set_updated_at();

drop trigger if exists rent_payments_set_updated_at on public.rent_payments;
create trigger rent_payments_set_updated_at
  before update on public.rent_payments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.leases enable row level security;
alter table public.management_agreements enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.rent_payments enable row level security;

drop policy if exists "leases_select_own" on public.leases;
create policy "leases_select_own"
  on public.leases for select
  using (auth.uid() = tenant_id or public.is_admin());

drop policy if exists "leases_admin_write" on public.leases;
create policy "leases_admin_write"
  on public.leases for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "leases_admin" on public.leases;
create policy "leases_admin"
  on public.leases for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "management_agreements_admin" on public.management_agreements;
create policy "management_agreements_admin"
  on public.management_agreements for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "maintenance_requests_select" on public.maintenance_requests;
create policy "maintenance_requests_select"
  on public.maintenance_requests for select
  using (auth.uid() = tenant_id or public.is_admin());

drop policy if exists "maintenance_requests_insert" on public.maintenance_requests;
create policy "maintenance_requests_insert"
  on public.maintenance_requests for insert
  with check (auth.uid() = tenant_id);

drop policy if exists "maintenance_requests_update" on public.maintenance_requests;
create policy "maintenance_requests_update"
  on public.maintenance_requests for update
  using (auth.uid() = tenant_id or public.is_admin());

drop policy if exists "rent_payments_select" on public.rent_payments;
create policy "rent_payments_select"
  on public.rent_payments for select
  using (auth.uid() = tenant_id or public.is_admin());

drop policy if exists "rent_payments_insert" on public.rent_payments;
create policy "rent_payments_insert"
  on public.rent_payments for insert
  with check (auth.uid() = tenant_id or public.is_admin());

drop policy if exists "rent_payments_update_admin" on public.rent_payments;
create policy "rent_payments_update_admin"
  on public.rent_payments for update
  using (public.is_admin());

drop policy if exists "rent_payments_select_own" on public.rent_payments;
create policy "rent_payments_select_own"
  on public.rent_payments for select
  using (tenant_id = auth.uid() or public.is_admin());

drop policy if exists "rent_payments_admin" on public.rent_payments;
create policy "rent_payments_admin"
  on public.rent_payments for all
  using (public.is_admin())
  with check (public.is_admin());
