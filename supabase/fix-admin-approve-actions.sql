-- Fix admin approve/deny actions not persisting (run in Supabase SQL Editor).
-- Root cause: is_admin() missing JWT checks and/or enforce_property_review
-- reverting published → pending_review when is_admin() is false during UPDATE.
-- Safe to re-run.

-- 1. Align is_admin() with app auth (profiles.role OR JWT metadata)
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

-- 2. Only non-admin listers get review enforcement; service-role / admin path may publish
create or replace function public.enforce_property_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.status = 'published' then
      new.status := 'pending_review';
    end if;
    new.published_at := null;
    new.reviewed_at := null;
    new.reviewed_by := null;
    if new.status <> 'rejected' then
      new.rejection_reason := null;
    end if;
  else
    if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
      new.published_at := coalesce(new.published_at, now());
      new.reviewed_at := now();
      new.reviewed_by := coalesce(new.reviewed_by, auth.uid());
      new.rejection_reason := null;
    elsif new.status = 'rejected' then
      new.published_at := null;
      new.reviewed_at := now();
      new.reviewed_by := coalesce(new.reviewed_by, auth.uid());
    end if;
  end if;
  return new;
end;
$$;

-- 3. Ensure pm_applications admin policy exists for updates
drop policy if exists "pm_applications_admin" on public.pm_applications;
create policy "pm_applications_admin"
  on public.pm_applications for all
  using (public.is_admin())
  with check (public.is_admin());
