-- Run in Supabase SQL Editor after the designated administrator confirms email.
begin;

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where lower(email) = 'hello@adab.ng' and email_confirmed_at is not null;

update public.profiles as profile
set role = 'admin'
from auth.users as account
where profile.id = account.id
  and lower(account.email) = 'hello@adab.ng'
  and account.email_confirmed_at is not null;

commit;
