-- Promote the first Adab admin after portal signup.
-- Run once in Supabase SQL Editor AFTER hello@adab.ng has registered and confirmed email.
-- Dashboard: https://supabase.com/dashboard/project/<your-project-id>/sql/new

-- Verify the profile exists (optional):
-- select id, email, role from public.profiles where email = 'hello@adab.ng';

update public.profiles
set role = 'admin'
where email = 'hello@adab.ng';

-- Confirm:
-- select id, email, role from public.profiles where email = 'hello@adab.ng';
