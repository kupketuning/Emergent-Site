-- Kupke-Tuning / Motorsport-Ersatzteilshop – Supabase Schema
-- Idempotent: kann mehrfach ausgeführt werden.

create extension if not exists pgcrypto;

-- ============================================================
-- 2. EXPLOSION_DRAWINGS (zuerst, wird von products referenziert)
-- ============================================================
create table if not exists explosion_drawings (
  id uuid primary key default gen_random_uuid(),
  vehicle text,
  assembly_group text,
  image_url text,
  title text
);

-- ============================================================
-- 1. PRODUCTS
-- ============================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text not null,
  description text,
  vehicle text check (vehicle in ('TRABANT','WARTBURG','B1000','VW','OPEL')),
  product_type text check (product_type in ('ORIGINAL','TUNING','RENNSPORT')),
  assembly_group text check (assembly_group in ('MOTOR','BREMSE','FAHRWERK','ABGAS','ELEKTRIK','KAROSSERIE')),
  price_net numeric(10,2) not null,
  tax_rate numeric(4,2) default 19.00,
  is_set boolean default false,
  images text[],
  explosion_drawing_id uuid references explosion_drawings(id) on delete set null,
  dekra_certified boolean default false,
  stock_quantity integer default 0,
  stock_min_alert integer default 5,
  weight_grams integer default 0,
  is_active boolean default true,
  sort_order integer default 100,
  youtube_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Erweiterung: Fahrzeug-Typ (nur Trabant) und fahrzeugunabhängige Sonderkategorien
alter table products add column if not exists vehicle_model text;
alter table products add column if not exists special_category text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_vehicle_model_check') then
    alter table products add constraint products_vehicle_model_check
      check (vehicle_model is null or vehicle_model in ('P601','1.1'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_special_category_check') then
    alter table products add constraint products_special_category_check
      check (special_category is null or special_category in ('NORMTEIL','ABVERKAUF'));
  end if;
end $$;

-- ============================================================
-- 3. CUSTOMERS
-- ============================================================
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text,
  last_name text,
  company text,
  street text,
  zip text,
  city text,
  country text default 'DE',
  phone text,
  created_at timestamptz default now()
);

-- ============================================================
-- 5. INVOICES (vor orders angelegt; cross-FK unten via ALTER)
-- ============================================================
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  order_id uuid,
  customer_id uuid references customers(id),
  type text check (type in ('AUTO','MANUELL')),
  items jsonb,
  subtotal_net numeric(10,2),
  tax_total numeric(10,2),
  total_gross numeric(10,2),
  discount_percent numeric(5,2) default 0,
  discount_amount numeric(10,2) default 0,
  payment_method text,
  pdf_url text,
  issued_at timestamptz default now(),
  is_cancelled boolean default false,
  cancellation_invoice_number text
);

-- ============================================================
-- 4. ORDERS
-- ============================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id),
  status text default 'NEU' check (status in ('NEU','BEZAHLT','IN_BEARBEITUNG','VERSENDET','ABGEHOLT','STORNIERT')),
  items jsonb,
  shipping_method text check (shipping_method in ('HERMES','ABHOLUNG')),
  shipping_cost_gross numeric(10,2) default 0,
  subtotal_net numeric(10,2),
  tax_total numeric(10,2),
  total_gross numeric(10,2),
  stripe_payment_intent_id text,
  stripe_payment_status text,
  sendcloud_parcel_id text,
  tracking_number text,
  tracking_url text,
  invoice_id uuid,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Cross-Foreign-Keys (orders <-> invoices)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'fk_invoices_order') then
    alter table invoices add constraint fk_invoices_order
      foreign key (order_id) references orders(id) on delete set null;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'fk_orders_invoice') then
    alter table orders add constraint fk_orders_invoice
      foreign key (invoice_id) references invoices(id) on delete set null;
  end if;
end $$;

-- ============================================================
-- 6. COUNTERS
-- ============================================================
create table if not exists counters (
  id text primary key,
  last_number integer default 0
);

-- ============================================================
-- Atomare Nummern-Funktion (keine Race Condition dank UPSERT)
-- ============================================================
create or replace function get_next_number(counter_id text)
returns integer as $$
declare
  v_number integer;
begin
  insert into counters (id, last_number)
    values (counter_id, 1)
  on conflict (id) do update
    set last_number = counters.last_number + 1
  returning last_number into v_number;
  return v_number;
end;
$$ language plpgsql;

-- ============================================================
-- updated_at Trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();

-- ============================================================
-- Indizes
-- ============================================================
create index if not exists idx_products_vehicle on products(vehicle);
create index if not exists idx_products_assembly on products(assembly_group);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_sort on products(sort_order);
create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_invoices_customer on invoices(customer_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table products          enable row level security;
alter table explosion_drawings enable row level security;
alter table customers         enable row level security;
alter table orders            enable row level security;
alter table invoices          enable row level security;
alter table counters          enable row level security;

-- products: SELECT für alle, Änderungen nur authenticated
drop policy if exists products_select_all on products;
create policy products_select_all on products
  for select to anon, authenticated using (true);
drop policy if exists products_modify_auth on products;
create policy products_modify_auth on products
  for all to authenticated using (true) with check (true);

-- explosion_drawings: SELECT für alle, Änderungen nur authenticated
drop policy if exists ed_select_all on explosion_drawings;
create policy ed_select_all on explosion_drawings
  for select to anon, authenticated using (true);
drop policy if exists ed_modify_auth on explosion_drawings;
create policy ed_modify_auth on explosion_drawings
  for all to authenticated using (true) with check (true);

-- customers / orders / invoices / counters: nur authenticated (Admin)
drop policy if exists customers_auth on customers;
create policy customers_auth on customers
  for all to authenticated using (true) with check (true);

drop policy if exists orders_auth on orders;
create policy orders_auth on orders
  for all to authenticated using (true) with check (true);

drop policy if exists invoices_auth on invoices;
create policy invoices_auth on invoices
  for all to authenticated using (true) with check (true);

drop policy if exists counters_auth on counters;
create policy counters_auth on counters
  for all to authenticated using (true) with check (true);
