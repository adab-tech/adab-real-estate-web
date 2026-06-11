-- Align RLS is_admin() with JWT app_metadata (run if admins cannot see pending listings).
-- Prefer grant-full-admin.sql for hello@adab.ng — this only updates is_admin().

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
