-- Fix: tenant portal code referenced public.tenant_applications but the
-- canonical table is public.pm_applications (see tenant-portal.sql).
--
-- Run in Supabase SQL Editor NOW if tenants see:
--   "Could not find the table 'public.tenant_applications' in the schema cache"
--
-- Safe to re-run (idempotent).

create extension if not exists "pgcrypto";

-- Remove legacy orphan table name if it was ever created
drop table if exists public.tenant_applications cascade;

-- Ensure pm_applications exists
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

alter table public.pm_applications enable row level security;

drop policy if exists "pm_applications_select" on public.pm_applications;
create policy "pm_applications_select"
  on public.pm_applications for select
  using (auth.uid() = applicant_id or public.is_admin());

drop policy if exists "pm_applications_insert" on public.pm_applications;
create policy "pm_applications_insert"
  on public.pm_applications for insert
  with check (applicant_id is null or auth.uid() = applicant_id);

drop policy if exists "pm_applications_public_insert" on public.pm_applications;
create policy "pm_applications_public_insert"
  on public.pm_applications for insert
  to anon, authenticated
  with check (true);

drop policy if exists "pm_applications_admin" on public.pm_applications;
create policy "pm_applications_admin"
  on public.pm_applications for all
  using (public.is_admin())
  with check (public.is_admin());

-- leases: tenant dashboard reads property_title (not tenant_leases)
alter table public.leases
  add column if not exists property_title text not null default '';
