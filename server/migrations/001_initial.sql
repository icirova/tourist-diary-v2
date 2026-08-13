create extension if not exists pgcrypto;
create table if not exists users (
  id text primary key,
  email text not null,
  display_name text,
  role text not null default 'user' check (role in ('admin','user')),
  status text not null default 'active' check (status in ('active','quarantined')),
  last_active_at timestamptz not null default now(),
  warned_at timestamptz,
  scheduled_delete_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null references users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 3 and 80),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  description jsonb not null default '[]', notes jsonb not null default '[]',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists trips_owner_idx on trips(owner_id);
create table if not exists trip_tags (
  trip_id uuid not null references trips(id) on delete cascade,
  tag text not null check (tag in ('bag','bikini','bonfire','cafe','family','stroller','tent','glutenfree')),
  primary key(trip_id, tag)
);
create table if not exists trip_photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  owner_id text not null references users(id) on delete cascade,
  storage_path text not null unique, original_name text not null default '', caption text not null default '',
  position smallint not null check(position between 0 and 2), size_bytes integer not null check(size_bytes between 1 and 768000),
  mime_type text not null check(mime_type in ('image/jpeg','image/webp')), created_at timestamptz not null default now(),
  unique(trip_id, position)
);
create index if not exists trip_photos_owner_idx on trip_photos(owner_id);
