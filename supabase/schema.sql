-- Run once in Supabase → SQL Editor
create table artisans (
  id uuid primary key references auth.users on delete cascade,
  name text not null, phone text, village text, craft text, bio text, photo_url text,
  created_at timestamptz default now()
);
create table products (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references artisans on delete cascade,
  title text not null, price int not null, craft_type text, description text,
  materials text, time_taken text, story text, voice_url text,
  images text[] default '{}', created_at timestamptz default now()
);
create table orders (
  id uuid primary key, buyer_name text not null, buyer_phone text not null, address text not null,
  total int not null, created_at timestamptz default now()
);
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders on delete cascade,
  product_id uuid, artisan_id uuid not null references artisans,
  title text not null, price int not null, qty int not null default 1,
  status text not null default 'Placed' check (status in ('Placed','Accepted','Completed')),
  created_at timestamptz default now()
);

alter table artisans enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "artisans read" on artisans for select using (true);
create policy "artisan insert own" on artisans for insert with check (auth.uid() = id);
create policy "artisan update own" on artisans for update using (auth.uid() = id);

create policy "products read" on products for select using (true);
create policy "products insert own" on products for insert with check (auth.uid() = artisan_id);
create policy "products update own" on products for update using (auth.uid() = artisan_id);
create policy "products delete own" on products for delete using (auth.uid() = artisan_id);

-- Prototype: guest checkout. Order ids are random UUIDs, so confirmation links are unguessable.
create policy "orders insert" on orders for insert with check (true);
create policy "orders read" on orders for select using (true);
create policy "items insert" on order_items for insert with check (true);
create policy "items read" on order_items for select using (true);
create policy "items update by artisan" on order_items for update using (auth.uid() = artisan_id);

insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;
create policy "images public read" on storage.objects for select using (bucket_id = 'images');
create policy "images upload" on storage.objects for insert to authenticated with check (bucket_id = 'images');
