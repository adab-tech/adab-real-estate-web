-- Adab.ng lister public profiles — idempotent
-- Adds public_username slug for shareable lister pages at https://adab.ng/l/[username]
-- Run in Supabase SQL Editor after portal-schema.sql. Safe to re-run.

-- ---------------------------------------------------------------------------
-- Columns
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists public_username text,
  add column if not exists username_changed_at timestamptz;

-- Unique index (allows multiple NULLs)
create unique index if not exists profiles_public_username_key
  on public.profiles (public_username)
  where public_username is not null;

-- Format: lowercase alphanumeric + hyphens, 3–30 chars, no leading/trailing hyphen
alter table public.profiles drop constraint if exists profiles_public_username_format;
alter table public.profiles add constraint profiles_public_username_format
  check (
    public_username is null
    or public_username ~ '^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?$'
  );

-- ---------------------------------------------------------------------------
-- RLS: public read for listers with a claimed username
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'profiles') then
    execute 'alter table public.profiles enable row level security';
    execute 'drop policy if exists "profiles_select_public_lister" on public.profiles';
    execute 'create policy "profiles_select_public_lister"
      on public.profiles for select
      using (
        public_username is not null
        and role in (''lister'', ''admin'')
      )';
  end if;
end $$;

-- Verify:
-- select id, email, public_username from public.profiles where public_username is not null;
