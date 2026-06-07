-- Adab Real Estate — Admin panel setup
-- Run once in Supabase SQL Editor AFTER schema.sql

-- ─── 1. Admin write access on properties ─────────────────────────────────────

drop policy if exists "Admins can insert properties" on public.properties;
create policy "Admins can insert properties"
  on public.properties
  for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update properties" on public.properties;
create policy "Admins can update properties"
  on public.properties
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete properties" on public.properties;
create policy "Admins can delete properties"
  on public.properties
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─── 2. Admin read access on inquiries ───────────────────────────────────────

drop policy if exists "Admins can read inquiries" on public.inquiries;
create policy "Admins can read inquiries"
  on public.inquiries
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ─── 3. Property images storage bucket ───────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-images',
  'property-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "Public read property images" on storage.objects;
create policy "Public read property images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'property-images');

drop policy if exists "Admins upload property images" on storage.objects;
create policy "Admins upload property images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'property-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins update property images" on storage.objects;
create policy "Admins update property images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'property-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins delete property images" on storage.objects;
create policy "Admins delete property images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'property-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ─── 4. Create your admin user (Dashboard steps) ─────────────────────────────
--
-- 1. Authentication → Users → Add user (email + password)
-- 2. Click the user → Raw App Meta Data → set: { "role": "admin" }
-- 3. Log in at https://adab.ng/admin/login
