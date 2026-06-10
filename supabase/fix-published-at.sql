-- Fix ERROR 23502 on portal listing save (published_at NOT NULL)
--
-- Symptom: "A required field is missing" when a lister saves a listing.
-- Cause: legacy properties.published_at was NOT NULL; enforce_property_review
-- clears published_at for non-admin listers awaiting review.
--
-- Run in Supabase SQL Editor (safe to re-run).

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'properties'
      and column_name = 'published_at'
      and udt_name = 'date'
  ) then
    alter table public.properties
      alter column published_at type timestamptz
      using published_at::timestamptz;
  end if;
end $$;

alter table public.properties alter column published_at drop not null;
