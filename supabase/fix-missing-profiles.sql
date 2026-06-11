-- Backfill public.profiles for auth users missing a profile row.
-- Fixes: pm_applications_applicant_id_fkey on tenant application submit.
-- Run after tenant-portal.sql. Safe to re-run.

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
