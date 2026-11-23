-- Align RLS is_admin() with JWT app_metadata (run if admins cannot see pending listings).
-- Verify trusted administrators have app_metadata.role before applying.

begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- Authenticated profile writes may set a non-admin role on creation.
-- Role changes after creation require a trusted database or service operation.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.role = 'admin' then
        raise insufficient_privilege using message = 'Profile role is managed by the server';
      end if;
    elsif new.role is distinct from old.role then
      raise insufficient_privilege using message = 'Profile role is managed by the server';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_role on public.profiles;
create trigger profiles_guard_role
before insert or update on public.profiles
for each row execute function public.guard_profile_role();

commit;
