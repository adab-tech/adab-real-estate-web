-- Adab.ng tenant / property-management portal — Phase 1 (idempotent)
-- Run in Supabase SQL Editor after fix-all.sql and cms-posts.sql.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Extend profiles for tenant / client roles
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists kyc_status text not null default 'pending';

alter table public.profiles
  add column if not exists kyc_notes text;

alter table public.profiles
  add column if not exists verified_at timestamptz;

alter table public.profiles
  add column if not exists verified_by uuid references public.profiles (id) on delete set null;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('lister', 'admin', 'tenant', 'client'));

alter table public.profiles drop constraint if exists profiles_kyc_status_check;
alter table public.profiles add constraint profiles_kyc_status_check
  check (kyc_status in ('pending', 'submitted', 'verified', 'rejected'));

alter table public.profiles alter column lister_type drop not null;

-- ---------------------------------------------------------------------------
-- Property management flag
-- ---------------------------------------------------------------------------
alter table public.properties
  add column if not exists under_management boolean not null default false;

create index if not exists properties_under_management_idx
  on public.properties (under_management)
  where under_management = true;

-- ---------------------------------------------------------------------------
-- PM applications (rental, management onboarding, land purchase)
-- ---------------------------------------------------------------------------
create table if not exists public.pm_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references public.profiles (id) on delete set null,
  application_type text not null check (
    application_type in ('rental', 'management_onboarding', 'land_purchase')
  ),
  full_name text not null,
  email text not null,
  phone text not null,
  property_interest text,
  message text,
  status text not null default 'submitted' check (
    status in ('submitted', 'reviewing', 'approved', 'rejected', 'withdrawn', 'retired')
  ),
  admin_notes text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pm_applications_applicant_id_idx
  on public.pm_applications (applicant_id);
create index if not exists pm_applications_status_idx
  on public.pm_applications (status);

-- ---------------------------------------------------------------------------
-- Leases
-- ---------------------------------------------------------------------------
create table if not exists public.leases (
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

create index if not exists leases_tenant_id_idx on public.leases (tenant_id);
create index if not exists leases_status_idx on public.leases (status);

-- ---------------------------------------------------------------------------
-- Management agreements (owner ↔ Adab)
-- ---------------------------------------------------------------------------
create table if not exists public.management_agreements (
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

create index if not exists management_agreements_property_id_idx
  on public.management_agreements (property_id);
create index if not exists management_agreements_status_idx
  on public.management_agreements (status);

-- ---------------------------------------------------------------------------
-- Maintenance requests
-- ---------------------------------------------------------------------------
create table if not exists public.maintenance_requests (
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
    status in ('submitted', 'assigned', 'in_progress', 'resolved', 'closed', 'cancelled')
  ),
  photo_urls text[] not null default '{}',
  assigned_to text,
  resolution_notes text,
  admin_notes text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists maintenance_requests_tenant_id_idx
  on public.maintenance_requests (tenant_id);
create index if not exists maintenance_requests_status_idx
  on public.maintenance_requests (status);

-- ---------------------------------------------------------------------------
-- Rent payments (Paystack stub — Phase 1 manual + pending records)
-- ---------------------------------------------------------------------------
create table if not exists public.rent_payments (
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

create index if not exists rent_payments_tenant_id_idx on public.rent_payments (tenant_id);
create index if not exists rent_payments_status_idx on public.rent_payments (status);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
drop trigger if exists pm_applications_set_updated_at on public.pm_applications;
create trigger pm_applications_set_updated_at
  before update on public.pm_applications
  for each row execute function public.set_updated_at();

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
-- Auth trigger: tenant vs lister signup via user_metadata.portal_role
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_portal_role text := coalesce(new.raw_user_meta_data->>'portal_role', 'lister');
  v_role text;
  v_lister_type text;
begin
  if v_portal_role in ('tenant', 'client') then
    v_role := v_portal_role;
    v_lister_type := null;
  else
    v_role := 'lister';
    v_lister_type := coalesce(new.raw_user_meta_data->>'lister_type', 'owner');
  end if;

  insert into public.profiles (id, email, full_name, company_name, phone, lister_type, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'company_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    v_lister_type,
    v_role
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.pm_applications enable row level security;
alter table public.leases enable row level security;
alter table public.management_agreements enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.rent_payments enable row level security;

-- pm_applications
drop policy if exists "pm_applications_select" on public.pm_applications;
create policy "pm_applications_select"
  on public.pm_applications for select
  using (auth.uid() = applicant_id or public.is_admin());

drop policy if exists "pm_applications_insert" on public.pm_applications;
create policy "pm_applications_insert"
  on public.pm_applications for insert
  with check (applicant_id is null or auth.uid() = applicant_id);

drop policy if exists "pm_applications_update" on public.pm_applications;
create policy "pm_applications_update"
  on public.pm_applications for update
  using (auth.uid() = applicant_id or public.is_admin());

-- leases
drop policy if exists "leases_select_own" on public.leases;
create policy "leases_select_own"
  on public.leases for select
  using (auth.uid() = tenant_id or public.is_admin());

drop policy if exists "leases_admin_write" on public.leases;
create policy "leases_admin_write"
  on public.leases for all
  using (public.is_admin())
  with check (public.is_admin());

-- management_agreements
drop policy if exists "management_agreements_admin" on public.management_agreements;
create policy "management_agreements_admin"
  on public.management_agreements for all
  using (public.is_admin())
  with check (public.is_admin());

-- maintenance_requests
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

-- rent_payments
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

-- Storage bucket for tenant documents
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'tenant-documents',
  'tenant-documents',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "tenant_docs_owner_upload" on storage.objects;
create policy "tenant_docs_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'tenant-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "tenant_docs_owner_read" on storage.objects;
create policy "tenant_docs_owner_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'tenant-documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );

-- ---------------------------------------------------------------------------
-- PM admin tables (Next.js /admin/pm panel)
-- ---------------------------------------------------------------------------

alter table public.properties
  add column if not exists under_management boolean not null default false;

alter table public.maintenance_requests
  add column if not exists assigned_to text;
alter table public.maintenance_requests
  add column if not exists resolution_notes text;

alter table public.maintenance_requests drop constraint if exists maintenance_requests_status_check;
alter table public.maintenance_requests add constraint maintenance_requests_status_check
  check (status in (
    'open', 'submitted', 'assigned', 'in_progress', 'resolved', 'closed', 'cancelled'
  ));

create table if not exists public.pm_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid references public.profiles (id) on delete set null,
  application_type text not null check (
    application_type in ('rental', 'management_onboarding', 'land_purchase')
  ),
  full_name text not null,
  email text not null,
  phone text not null,
  property_interest text,
  message text,
  status text not null default 'submitted' check (
    status in ('submitted', 'reviewing', 'approved', 'rejected', 'withdrawn', 'retired')
  ),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pm_applications_status_idx on public.pm_applications (status);
create index if not exists pm_applications_type_idx on public.pm_applications (application_type);

create table if not exists public.tenant_profiles (
  id uuid primary key references public.profiles (id) on delete cascade,
  kyc_status text not null default 'pending' check (
    kyc_status in ('pending', 'submitted', 'verified', 'rejected')
  ),
  kyc_notes text,
  verified_at timestamptz,
  verified_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles (id) on delete cascade,
  property_id text references public.properties (id) on delete set null,
  property_title text not null default '',
  rent_ngn bigint,
  rent_period text check (rent_period is null or rent_period in ('month', 'year')),
  lease_start date,
  lease_end date,
  status text not null default 'draft' check (
    status in ('draft', 'pending_signature', 'active', 'expired', 'terminated', 'retired')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leases_tenant_id_idx on public.leases (tenant_id);
create index if not exists leases_status_idx on public.leases (status);

create table if not exists public.rent_payments (
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
  paid_at timestamptz,
  notes text,
  recorded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rent_payments_tenant_id_idx on public.rent_payments (tenant_id);

create table if not exists public.management_agreements (
  id uuid primary key default gen_random_uuid(),
  property_id text references public.properties (id) on delete set null,
  owner_id uuid references public.profiles (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'paused', 'terminated', 'retired')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create tenant_profiles when a tenant registers
create or replace function public.ensure_tenant_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'tenant' then
    insert into public.tenant_profiles (id)
    values (new.id)
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_ensure_tenant_profile on public.profiles;
create trigger profiles_ensure_tenant_profile
  after insert on public.profiles
  for each row execute function public.ensure_tenant_profile();

-- RLS for PM admin tables
alter table public.pm_applications enable row level security;
alter table public.tenant_profiles enable row level security;
alter table public.leases enable row level security;
alter table public.rent_payments enable row level security;
alter table public.management_agreements enable row level security;

drop policy if exists "pm_applications_public_insert" on public.pm_applications;
create policy "pm_applications_public_insert"
  on public.pm_applications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "pm_applications_select" on public.pm_applications;
create policy "pm_applications_select"
  on public.pm_applications for select
  using (applicant_id = auth.uid() or public.is_admin());

drop policy if exists "pm_applications_admin" on public.pm_applications;
create policy "pm_applications_admin"
  on public.pm_applications for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "tenant_profiles_select" on public.tenant_profiles;
create policy "tenant_profiles_select"
  on public.tenant_profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "tenant_profiles_admin" on public.tenant_profiles;
create policy "tenant_profiles_admin"
  on public.tenant_profiles for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "leases_select_own" on public.leases;
create policy "leases_select_own"
  on public.leases for select
  using (tenant_id = auth.uid() or public.is_admin());

drop policy if exists "leases_admin" on public.leases;
create policy "leases_admin"
  on public.leases for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "rent_payments_select_own" on public.rent_payments;
create policy "rent_payments_select_own"
  on public.rent_payments for select
  using (tenant_id = auth.uid() or public.is_admin());

drop policy if exists "rent_payments_admin" on public.rent_payments;
create policy "rent_payments_admin"
  on public.rent_payments for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "management_agreements_admin" on public.management_agreements;
create policy "management_agreements_admin"
  on public.management_agreements for all
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists pm_applications_set_updated_at on public.pm_applications;
create trigger pm_applications_set_updated_at
  before update on public.pm_applications
  for each row execute function public.set_updated_at();

drop trigger if exists tenant_profiles_set_updated_at on public.tenant_profiles;
create trigger tenant_profiles_set_updated_at
  before update on public.tenant_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists leases_set_updated_at on public.leases;
create trigger leases_set_updated_at
  before update on public.leases
  for each row execute function public.set_updated_at();

drop trigger if exists rent_payments_set_updated_at on public.rent_payments;
create trigger rent_payments_set_updated_at
  before update on public.rent_payments
  for each row execute function public.set_updated_at();

drop trigger if exists management_agreements_set_updated_at on public.management_agreements;
create trigger management_agreements_set_updated_at
  before update on public.management_agreements
  for each row execute function public.set_updated_at();
