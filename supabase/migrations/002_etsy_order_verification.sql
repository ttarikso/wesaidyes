-- Migration: Etsy Order Verification & Token Storage
-- the shop's Etsy tokens; one row; only the server (service role) reads it
create table if not exists public.etsy_auth (
  id int primary key default 1 check (id = 1),
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);
alter table public.etsy_auth enable row level security; -- no policies: anon/auth roles get nothing

-- what Etsy said about each verified order
alter table public.licenses add column if not exists source text not null default 'manual'; -- 'manual' | 'etsy' | 'legacy'
alter table public.licenses add column if not exists etsy_quantity int not null default 1;
alter table public.licenses add column if not exists etsy_status text;
alter table public.licenses add column if not exists verified_at timestamptz;
update public.licenses set source = 'legacy' where status = 'claimed' and source = 'manual';
