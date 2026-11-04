-- Ever After Invites schema. Run once in the Supabase SQL editor.
create extension if not exists pgcrypto;

create table if not exists licenses (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  email text,
  key text unique,
  status text not null default 'available' check (status in ('available','claimed','revoked')),
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references licenses(id) on delete cascade,
  slug text not null unique,
  theme text not null,
  music text not null default 'none',
  published boolean not null default false,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists invitations_license_idx on invitations(license_id);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references invitations(id) on delete cascade,
  name text not null,
  email text not null default '',
  attending boolean not null,
  guests int not null default 0,
  guest_names text not null default '',
  meal text not null default '',
  diet text not null default '',
  song text not null default '',
  message text not null default '',
  custom text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists rsvps_invitation_idx on rsvps(invitation_id);

-- Only the server (service role) touches these tables. Browsers never read them directly.
alter table licenses enable row level security;
alter table invitations enable row level security;
alter table rsvps enable row level security;

-- Public bucket for couple photos (uploads go through the server with the service role).
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do nothing;
