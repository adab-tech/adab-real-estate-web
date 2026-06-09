-- Adab Real Estate — CMS posts & media (idempotent)
-- Run in Supabase SQL Editor after schema.sql / admin-setup.sql

-- ─── Posts table ─────────────────────────────────────────────────────────────

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  body_html text not null default '',
  tags text[] not null default '{}',
  cover_image text,
  gallery jsonb not null default '[]'::jsonb,
  post_type text not null default 'blog' check (
    post_type in ('blog', 'promo', 'announcement', 'release')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'scheduled', 'archived')
  ),
  featured boolean not null default false,
  author_id uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Public: read published posts (respect published_at for scheduled releases)
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (
    status = 'published'
    and (published_at is null or published_at <= now())
  );

-- Admins: full CRUD
drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts"
  on public.posts
  for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
  on public.posts
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
  on public.posts
  for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admins can read drafts/scheduled
drop policy if exists "Admins can read all posts" on public.posts;
create policy "Admins can read all posts"
  on public.posts
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_status_idx on public.posts (status);
create index if not exists posts_post_type_idx on public.posts (post_type);
create index if not exists posts_published_at_idx on public.posts (published_at desc nulls last);
create index if not exists posts_tags_idx on public.posts using gin (tags);
create index if not exists posts_featured_idx on public.posts (featured) where featured = true;

-- Idempotent upgrades for existing deployments
alter table public.posts
  add column if not exists featured boolean not null default false;

alter table public.posts drop constraint if exists posts_status_check;
alter table public.posts add constraint posts_status_check
  check (status in ('draft', 'published', 'scheduled', 'archived'));

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ─── CMS media storage bucket ────────────────────────────────────────────────
-- Default 50 MB per file. On paid Supabase plans, raise file_size_limit in the
-- Dashboard (Storage → cms-media → Settings) up to 5 GB for large video assets.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read cms media" on storage.objects;
create policy "Public read cms media"
  on storage.objects
  for select
  to public
  using (bucket_id = 'cms-media');

drop policy if exists "Admins upload cms media" on storage.objects;
create policy "Admins upload cms media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'cms-media'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins update cms media" on storage.objects;
create policy "Admins update cms media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'cms-media'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins delete cms media" on storage.objects;
create policy "Admins delete cms media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'cms-media'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
