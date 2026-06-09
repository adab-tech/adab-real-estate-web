-- Run once in Supabase SQL Editor if portal listing fails with:
-- null value in column "id" of relation "properties"
-- Project: iprtopzajjdqowgjvwhi

create extension if not exists "pgcrypto";

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
  else
    raise notice 'properties.id column type is % — set default manually if needed', col_udt;
  end if;
end $$;
