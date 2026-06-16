-- Brand assets storage bucket (admin upload for template editor)
-- Run in Supabase SQL Editor after schema.sql / is_admin() is defined

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

drop policy if exists "Public read brand assets" on storage.objects;
create policy "Public read brand assets"
  on storage.objects
  for select
  to public
  using (bucket_id = 'brand-assets');

drop policy if exists "Admins upload brand assets" on storage.objects;
create policy "Admins upload brand assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'brand-assets'
    and public.is_admin()
  );

drop policy if exists "Admins update brand assets" on storage.objects;
create policy "Admins update brand assets"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'brand-assets' and public.is_admin())
  with check (bucket_id = 'brand-assets' and public.is_admin());

drop policy if exists "Admins delete brand assets" on storage.objects;
create policy "Admins delete brand assets"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'brand-assets' and public.is_admin());
