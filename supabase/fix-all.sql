-- Adab.ng portal — ONE-PASTE full database fix (legacy + fresh)
-- Project: iprtopzajjdqowgjvwhi
-- Run entire file in Supabase SQL Editor, or:
--   npx supabase login
--   npx supabase link --project-ref iprtopzajjdqowgjvwhi
--   npx supabase db query --linked -f supabase/fix-all.sql
--
-- Fixes ERROR 23514 (properties_status_check / properties_type_check) by dropping
-- ALL check constraints on properties before rewriting legacy rows.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles + properties columns (legacy upgrade)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  phone text,
  lister_type text not null check (lister_type in ('owner', 'landlord', 'agency')),
  role text not null default 'lister' check (role in ('lister', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties
  add column if not exists owner_id uuid references public.profiles (id) on delete cascade,
  add column if not exists slug text,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists type text,
  add column if not exists category text,
  add column if not exists price_ngn bigint,
  add column if not exists price_period text,
  add column if not exists location jsonb default '{}'::jsonb,
  add column if not exists beds integer,
  add column if not exists baths integer,
  add column if not exists sqm numeric,
  add column if not exists features text[] default '{}',
  add column if not exists images text[] default '{}',
  add column if not exists status text default 'draft',
  add column if not exists featured boolean default false,
  add column if not exists rejection_reason text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles (id),
  add column if not exists published_at timestamptz,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'properties' and column_name = 'location'
      and udt_name = 'text'
  ) then
    alter table public.properties
      alter column location type jsonb
      using case
        when location is null or btrim(location) = '' then '{}'::jsonb
        when btrim(location) ~ '^\s*\{' then location::jsonb
        else jsonb_build_object('address', location)
      end;
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'properties' and column_name = 'features'
      and data_type = 'text'
  ) then
    alter table public.properties
      alter column features type text[]
      using case
        when features is null or btrim(features) = '' then '{}'::text[]
        else array[features]
      end;
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'properties' and column_name = 'images'
      and data_type = 'text'
  ) then
    alter table public.properties
      alter column images type text[]
      using case
        when images is null or btrim(images) = '' then '{}'::text[]
        else array[images]
      end;
  end if;
end $$;

update public.properties set location = '{}'::jsonb where location is null;
update public.properties set features = '{}' where features is null;
update public.properties set images = '{}' where images is null;
update public.properties set featured = false where featured is null;
update public.properties set created_at = now() where created_at is null;
update public.properties set updated_at = now() where updated_at is null;

-- Pause triggers so review logic cannot block legacy rewrites
alter table public.properties disable trigger user;

-- Drop named + any other CHECK constraints on properties
alter table public.properties drop constraint if exists properties_status_check;
alter table public.properties drop constraint if exists properties_type_check;

do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where n.nspname = 'public'
      and t.relname = 'properties'
      and c.contype = 'c'
  loop
    execute format('alter table public.properties drop constraint if exists %I', r.conname);
  end loop;
end $$;

-- Diagnostic (results appear in SQL Editor result grid):
-- select status, count(*) as rows from public.properties group by status order by rows desc;
-- select type, count(*) as rows from public.properties group by type order by rows desc;

-- ---------------------------------------------------------------------------
-- Normalize status (must run with no CHECK on status)
-- ---------------------------------------------------------------------------
update public.properties set status = lower(trim(status)) where status is not null;
update public.properties set status = 'published' where status is null or status = '';
update public.properties set status = case
  when status in ('draft', 'pending_review', 'published', 'unavailable', 'rejected') then status
  when status in ('active', 'available', 'live', 'listed', 'open', 'public') then 'published'
  when status in ('sold', 'rented', 'taken', 'closed', 'leased', 'off_market', 'off-market') then 'unavailable'
  when status in ('pending', 'review', 'submitted', 'pending review', 'awaiting_review', 'awaiting review', 'under_review', 'under review') then 'pending_review'
  when status in ('inactive', 'archived', 'hidden', 'drafts', 'private') then 'draft'
  when status in ('reject', 'declined', 'denied') then 'rejected'
  else 'published'
end;

-- ---------------------------------------------------------------------------
-- Normalize type
-- ---------------------------------------------------------------------------
update public.properties set type = lower(trim(type)) where type is not null;
update public.properties set type = case
  when type in ('sale', 'rent') then type
  when type in ('buy', 'purchase', 'for_sale', 'for sale', 'for-sale') then 'sale'
  when type in ('rental', 'lease', 'for_rent', 'for rent', 'for-rent') then 'rent'
  when type is null or type = '' then null
  else null
end;

-- ---------------------------------------------------------------------------
-- Verify before re-adding constraints
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1 from public.properties
    where status is null
       or status not in ('draft', 'pending_review', 'published', 'unavailable', 'rejected')
  ) then
    raise exception 'Still invalid status values: %', (
      select string_agg(distinct coalesce(status, '<null>'), ', ')
      from public.properties
      where status is null
         or status not in ('draft', 'pending_review', 'published', 'unavailable', 'rejected')
    );
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from public.properties
    where type is not null and type not in ('sale', 'rent')
  ) then
    raise exception 'Still invalid type values: %', (
      select string_agg(distinct type, ', ')
      from public.properties
      where type is not null and type not in ('sale', 'rent')
    );
  end if;
end $$;

alter table public.properties add constraint properties_status_check
  check (status in ('draft', 'pending_review', 'published', 'unavailable', 'rejected'));

alter table public.properties add constraint properties_type_check
  check (type is null or type in ('sale', 'rent'));

alter table public.properties enable trigger user;

create index if not exists properties_owner_id_idx on public.properties (owner_id);
create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_location_idx on public.properties using gin (location);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'profiles') then
    execute 'drop trigger if exists profiles_set_updated_at on public.profiles';
    execute 'create trigger profiles_set_updated_at
      before update on public.profiles
      for each row execute function public.set_updated_at()';
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'properties') then
    execute 'drop trigger if exists properties_set_updated_at on public.properties';
    execute 'create trigger properties_set_updated_at
      before update on public.properties
      for each row execute function public.set_updated_at()';
  end if;
end $$;

create or replace function public.enforce_property_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
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
      new.reviewed_by := auth.uid();
      new.rejection_reason := null;
    elsif new.status = 'rejected' then
      new.published_at := null;
      new.reviewed_at := now();
      new.reviewed_by := auth.uid();
    end if;
  end if;
  return new;
end;
$$;

do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'properties') then
    execute 'drop trigger if exists properties_enforce_review on public.properties';
    execute 'create trigger properties_enforce_review
      before insert or update on public.properties
      for each row execute function public.enforce_property_review()';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'profiles') then
    execute 'alter table public.profiles enable row level security';
    execute 'drop policy if exists "profiles_select_own" on public.profiles';
    execute 'create policy "profiles_select_own"
      on public.profiles for select
      using (auth.uid() = id or public.is_admin())';
    execute 'drop policy if exists "profiles_insert_own" on public.profiles';
    execute 'create policy "profiles_insert_own"
      on public.profiles for insert
      with check (auth.uid() = id)';
    execute 'drop policy if exists "profiles_update_own" on public.profiles';
    execute 'create policy "profiles_update_own"
      on public.profiles for update
      using (auth.uid() = id)';
  end if;
end $$;

do $$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'properties') then
    execute 'alter table public.properties enable row level security';
    execute 'drop policy if exists "properties_select_own" on public.properties';
    execute 'create policy "properties_select_own"
      on public.properties for select
      using (auth.uid() = owner_id or public.is_admin())';
    execute 'drop policy if exists "properties_insert_own" on public.properties';
    execute 'create policy "properties_insert_own"
      on public.properties for insert
      with check (auth.uid() = owner_id)';
    execute 'drop policy if exists "properties_update_own" on public.properties';
    execute 'create policy "properties_update_own"
      on public.properties for update
      using (auth.uid() = owner_id or public.is_admin())';
    execute 'drop policy if exists "properties_delete_own" on public.properties';
    execute 'create policy "properties_delete_own"
      on public.properties for delete
      using (auth.uid() = owner_id or public.is_admin())';
    execute 'drop policy if exists "properties_public_published" on public.properties';
    execute 'create policy "properties_public_published"
      on public.properties for select
      using (status = ''published'')';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Auth trigger
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company_name, phone, lister_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'company_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'lister_type', 'owner')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Storage bucket for property images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "property_images_public_read" on storage.objects;
create policy "property_images_public_read"
  on storage.objects for select
  using (bucket_id = 'property-images');

drop policy if exists "property_images_owner_upload" on storage.objects;
create policy "property_images_owner_upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "property_images_owner_update" on storage.objects;
create policy "property_images_owner_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "property_images_owner_delete" on storage.objects;
create policy "property_images_owner_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- CMS posts: featured + archived status
-- ---------------------------------------------------------------------------
alter table public.posts
  add column if not exists featured boolean not null default false;

alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts add constraint posts_status_check
  check (status in ('draft', 'published', 'scheduled', 'archived'));

create index if not exists posts_featured_idx on public.posts (featured)
  where featured = true;

-- ---------------------------------------------------------------------------
-- Properties: optional price_period (land / one-time sales)
-- ---------------------------------------------------------------------------
alter table public.properties drop constraint if exists properties_price_period_check;
alter table public.properties add constraint properties_price_period_check
  check (price_period is null or price_period in ('year', 'month', 'negotiable'));

-- ---------------------------------------------------------------------------
-- Properties: id default when client omits id (legacy text PK has no default)
-- ---------------------------------------------------------------------------
do $$
declare
  col_udt text;
begin
  select udt_name into col_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'properties'
    and column_name = 'id';

  if col_udt = 'uuid' then
    alter table public.properties alter column id set default gen_random_uuid();
  elsif col_udt in ('text', 'varchar', 'character varying') then
    alter table public.properties alter column id set default gen_random_uuid()::text;
  end if;
end $$;
