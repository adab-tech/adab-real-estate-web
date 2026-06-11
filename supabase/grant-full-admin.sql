-- One-paste full admin grant for hello@adab.ng
-- Run in Supabase SQL Editor AFTER hello@adab.ng has registered and confirmed email.
-- Safe to re-run (idempotent).

-- 1. Profile row: role admin, lister_type optional for admins
alter table public.profiles alter column lister_type drop not null;

update public.profiles
set
  role = 'admin',
  lister_type = null
where lower(email) = 'hello@adab.ng';

-- 2. Auth JWT: app_metadata.role = admin (used by /admin panel + RLS is_admin())
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where lower(email) = 'hello@adab.ng';

-- 3. RLS helper: profiles.role OR JWT app_metadata.role
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin';
$$;

-- 4. Backfill any auth users missing profiles (fixes pm_applications FK)
insert into public.profiles (id, email, full_name, company_name, phone, lister_type, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  nullif(u.raw_user_meta_data->>'company_name', ''),
  nullif(u.raw_user_meta_data->>'phone', ''),
  case
    when coalesce(u.raw_user_meta_data->>'portal_role', 'lister') in ('tenant', 'client')
      then null
    else coalesce(u.raw_user_meta_data->>'lister_type', 'owner')
  end,
  case
    when lower(u.email) = 'hello@adab.ng' then 'admin'
    when coalesce(u.raw_user_meta_data->>'portal_role', 'lister') in ('tenant', 'client')
      then u.raw_user_meta_data->>'portal_role'
    else 'lister'
  end
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;

-- Verify:
-- select id, email, role, lister_type from public.profiles where lower(email) = 'hello@adab.ng';
-- select id, email, raw_app_meta_data->>'role' as jwt_role from auth.users where lower(email) = 'hello@adab.ng';
