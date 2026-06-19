-- ============================================================
--  NAKMA Realty — Supabase schema
--  Paste this whole file into:  Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1) Properties table -----------------------------------------
create table if not exists public.properties (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz default now(),
  code              text,
  slug              text unique not null,
  title             text not null,
  location          text,
  province          text,
  price             text,
  listing_type      text default 'sale',   -- 'sale' | 'rent'
  rent_price        text,
  bedrooms          int  default 0,
  bathrooms         int  default 0,
  land_size         text,
  construction_size text,
  year_built        text,
  hoa               text,
  image             text,
  gallery           jsonb default '[]'::jsonb,
  video             text,
  video_url         text,
  featured          boolean default false,
  exclusive         boolean default false,
  highlights        jsonb default '[]'::jsonb,
  features          jsonb,
  community_info    jsonb,
  geo               jsonb,                  -- { address, lat, lng } for the map
  agent_id          text,
  description       text
);

-- 2) Row Level Security ---------------------------------------
alter table public.properties enable row level security;

-- Anyone can READ listings (public site)
drop policy if exists "Public read properties" on public.properties;
create policy "Public read properties"
  on public.properties for select using (true);

-- Only logged-in admins can write
drop policy if exists "Auth insert properties" on public.properties;
create policy "Auth insert properties"
  on public.properties for insert to authenticated with check (true);

drop policy if exists "Auth update properties" on public.properties;
create policy "Auth update properties"
  on public.properties for update to authenticated using (true);

drop policy if exists "Auth delete properties" on public.properties;
create policy "Auth delete properties"
  on public.properties for delete to authenticated using (true);

-- 3) Storage bucket for photos/videos (public read) -----------
insert into storage.buckets (id, name, public)
values ('property-media', 'property-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select using (bucket_id = 'property-media');

drop policy if exists "Auth upload media" on storage.objects;
create policy "Auth upload media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'property-media');

drop policy if exists "Auth update media" on storage.objects;
create policy "Auth update media"
  on storage.objects for update to authenticated
  using (bucket_id = 'property-media');

drop policy if exists "Auth delete media" on storage.objects;
create policy "Auth delete media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'property-media');
