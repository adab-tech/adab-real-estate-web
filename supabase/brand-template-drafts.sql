-- Brand template drafts (saved editor state per admin user)
-- Run in Supabase SQL Editor after schema.sql / is_admin() is defined

create table if not exists public.brand_template_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  template_type text not null,
  name text,
  payload jsonb not null default '{}'::jsonb,
  preview_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brand_template_drafts_user_id_idx
  on public.brand_template_drafts (user_id, updated_at desc);

alter table public.brand_template_drafts enable row level security;

drop policy if exists "Admins manage own brand drafts" on public.brand_template_drafts;
create policy "Admins manage own brand drafts"
  on public.brand_template_drafts
  for all
  to authenticated
  using (auth.uid() = user_id and public.is_admin())
  with check (auth.uid() = user_id and public.is_admin());

create or replace function public.set_brand_draft_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists brand_template_drafts_updated_at on public.brand_template_drafts;
create trigger brand_template_drafts_updated_at
  before update on public.brand_template_drafts
  for each row
  execute function public.set_brand_draft_updated_at();
