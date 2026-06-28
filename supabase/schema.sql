-- =====================================================================
-- PlainRights Court — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL -> New query).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
--
-- Tables:
--   profiles          one row per auth user; auto-fills documents
--   documents         every generated document (metadata + storage URL + pay state)
--   workflows         multi-step process tracker (notice -> petition -> ...)
--   statutes          admin-managed catalog of cited laws + last-verified dates
--   law_review_log    audit trail of admin law-review actions (visible to users)
--   document_statutes which statutes each document type cites (drives banners)
-- =====================================================================

-- NOTE: the is_admin() helper is defined AFTER the profiles table below,
-- because a SQL-language function body is validated at creation time and
-- references public.profiles.

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  email               text,
  full_name           text,
  -- mailing / premises address
  address_line1       text,
  address_line2       text,
  unit_number         text,
  city                text,
  state               text default 'NY',
  zip                 text,
  borough             text,    -- Bronx/Brooklyn/Manhattan/Queens/Staten Island (NYC)
  county              text,    -- for outside-NYC courts
  -- intake answers
  role                text check (role in ('landlord','tenant')),
  location_type       text check (location_type in ('nyc','outside_nyc')),
  housing_type        text check (housing_type in (
                        'rent_stabilized','rent_controlled','market_rate',
                        'nycha','good_cause','not_sure')),
  -- counterparty (landlord stores tenant info & vice-versa; free-form here)
  landlord_name       text,
  landlord_address    text,
  -- case / lease facts
  court_index_number  text,
  lease_type          text,
  rent_amount         numeric(10,2),
  arrears_amount      numeric(10,2),
  -- prefs
  reminder_emails     boolean default true,
  is_admin            boolean default false,
  -- subscription (set by Stripe webhook; protected from user writes below)
  subscription_plan       text,        -- 'monthly' | 'annual' | null
  subscription_status     text,        -- 'active' | 'canceled' | 'past_due' | null
  subscription_period_end timestamptz,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ---------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------
create table if not exists public.documents (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  doc_type            text not null,            -- e.g. 'rent_demand_14day'
  title               text not null,
  status              text not null default 'draft'
                        check (status in ('draft','preview','paid')),
  paid                boolean not null default false,
  version             integer not null default 1,
  storage_path        text,                     -- path in 'documents' bucket
  download_url        text,                     -- signed/public URL (nullable)
  cited_statutes      text[] default '{}',      -- citations shown in footer
  field_data          jsonb default '{}'::jsonb,-- answers used to fill the doc
  stripe_session_id   text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create index if not exists documents_user_idx on public.documents (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- workflows  (e.g. "Notice served 6/1 -> Petition available after 6/15")
-- ---------------------------------------------------------------------
create table if not exists public.workflows (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  workflow_type          text not null,         -- e.g. 'nonpayment'
  stage                  text not null,         -- e.g. 'notice_served'
  notice_served_date     date,
  next_action_date       date,                  -- when next step unlocks / reminder fires
  next_action_label      text,
  reminder_sent          boolean default false,
  metadata               jsonb default '{}'::jsonb,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);
create index if not exists workflows_user_idx on public.workflows (user_id);
create index if not exists workflows_reminder_idx
  on public.workflows (next_action_date) where reminder_sent = false;

-- ---------------------------------------------------------------------
-- statutes  (admin-managed; readable by everyone for banners + log)
-- ---------------------------------------------------------------------
create table if not exists public.statutes (
  id                  uuid primary key default gen_random_uuid(),
  citation            text not null unique,     -- e.g. 'RPAPL § 711'
  name                text not null,            -- short human label
  category            text,                     -- grouping in admin UI
  description         text,
  last_verified_date  date,
  flagged_for_review  boolean default false,
  notes               text,                     -- admin notes
  updated_at          timestamptz default now()
);

-- ---------------------------------------------------------------------
-- law_review_log  (audit trail; "Law Update Log" visible to users)
-- ---------------------------------------------------------------------
create table if not exists public.law_review_log (
  id            uuid primary key default gen_random_uuid(),
  statute_id    uuid references public.statutes (id) on delete set null,
  citation      text,                  -- denormalized so log survives statute delete
  action        text not null,         -- 'verified' | 'flagged' | 'updated' | 'note'
  note          text,
  admin_email   text,
  created_at    timestamptz default now()
);
create index if not exists law_review_log_idx on public.law_review_log (created_at desc);

-- ---------------------------------------------------------------------
-- document_statutes  (which statutes a doc_type cites -> drives banners)
-- ---------------------------------------------------------------------
create table if not exists public.document_statutes (
  doc_type   text not null,
  citation   text not null,
  primary key (doc_type, citation)
);

-- ---------------------------------------------------------------------
-- Helper: is the current user an admin?  Defined here (after profiles
-- exists) because the SQL function body is validated at creation time.
-- SECURITY DEFINER avoids RLS recursion when policies check admin status.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------------
-- app_pricing — operator-editable prices (per doc_type + subscription plans).
-- Publicly readable (prices show on public pages); admin-writable only.
-- ---------------------------------------------------------------------
create table if not exists public.app_pricing (
  key          text primary key,           -- doc_type, or 'sub_monthly' / 'sub_annual'
  amount_cents integer not null check (amount_cents >= 0),
  updated_at   timestamptz default now()
);

-- ---------------------------------------------------------------------
-- law_sources — official NY law pages monitored by the law-watch function.
-- On content change, the related statute is flagged and the admin is emailed.
-- ---------------------------------------------------------------------
create table if not exists public.law_sources (
  id           uuid primary key default gen_random_uuid(),
  label        text not null,
  url          text not null,
  citation     text,            -- related statute citation to flag on change
  last_hash    text,
  last_checked timestamptz,
  last_changed timestamptz,
  created_at   timestamptz default now()
);

-- =====================================================================
-- updated_at triggers
-- =====================================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_documents_touch on public.documents;
create trigger trg_documents_touch before update on public.documents
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_workflows_touch on public.workflows;
create trigger trg_workflows_touch before update on public.workflows
  for each row execute function public.touch_updated_at();

-- =====================================================================
-- Auto-create a profile row when a new auth user signs up.
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Security: prevent normal users from granting themselves admin.
-- A logged-in user has JWT role 'authenticated'; the service_role key and the
-- SQL editor (postgres) do not, so admins can still be set out-of-band.
-- =====================================================================
create or replace function public.protect_is_admin()
returns trigger language plpgsql as $$
begin
  if auth.role() = 'authenticated' then
    if new.is_admin is distinct from old.is_admin then
      raise exception 'Only an administrator can change admin status';
    end if;
    -- Subscription state is set only by the Stripe webhook (service role).
    if new.subscription_plan is distinct from old.subscription_plan
       or new.subscription_status is distinct from old.subscription_status
       or new.subscription_period_end is distinct from old.subscription_period_end
       or new.stripe_customer_id is distinct from old.stripe_customer_id
       or new.stripe_subscription_id is distinct from old.stripe_subscription_id then
      raise exception 'Subscription status cannot be changed directly';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_is_admin on public.profiles;
create trigger trg_protect_is_admin before update on public.profiles
  for each row execute function public.protect_is_admin();

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles          enable row level security;
alter table public.documents         enable row level security;
alter table public.workflows         enable row level security;
alter table public.statutes          enable row level security;
alter table public.law_review_log    enable row level security;
alter table public.document_statutes enable row level security;
alter table public.app_pricing       enable row level security;
alter table public.law_sources       enable row level security;

-- app_pricing: anyone may read prices; only admins may change them.
drop policy if exists app_pricing_read on public.app_pricing;
create policy app_pricing_read on public.app_pricing for select using (true);
drop policy if exists app_pricing_admin on public.app_pricing;
create policy app_pricing_admin on public.app_pricing
  for all using (public.is_admin()) with check (public.is_admin());

-- law_sources: authenticated users may read; only admins manage. The law-watch
-- function writes with the service-role key (bypasses RLS).
drop policy if exists law_sources_read on public.law_sources;
create policy law_sources_read on public.law_sources for select using (auth.role() = 'authenticated');
drop policy if exists law_sources_admin on public.law_sources;
create policy law_sources_admin on public.law_sources
  for all using (public.is_admin()) with check (public.is_admin());

-- profiles: a user sees/edits only their own row
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists profiles_upsert_own on public.profiles;
create policy profiles_upsert_own on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- documents: per-user
drop policy if exists documents_all_own on public.documents;
create policy documents_all_own on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- workflows: per-user
drop policy if exists workflows_all_own on public.workflows;
create policy workflows_all_own on public.workflows
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- statutes: readable by any authenticated user; writable only by admins
drop policy if exists statutes_read_all on public.statutes;
create policy statutes_read_all on public.statutes
  for select using (auth.role() = 'authenticated');
drop policy if exists statutes_admin_write on public.statutes;
create policy statutes_admin_write on public.statutes
  for all using (public.is_admin()) with check (public.is_admin());

-- law_review_log: readable by authenticated users; writable by admins
drop policy if exists law_log_read_all on public.law_review_log;
create policy law_log_read_all on public.law_review_log
  for select using (auth.role() = 'authenticated');
drop policy if exists law_log_admin_write on public.law_review_log;
create policy law_log_admin_write on public.law_review_log
  for all using (public.is_admin()) with check (public.is_admin());

-- document_statutes: read-only catalog for all; admin-managed
drop policy if exists doc_statutes_read_all on public.document_statutes;
create policy doc_statutes_read_all on public.document_statutes
  for select using (auth.role() = 'authenticated');
drop policy if exists doc_statutes_admin_write on public.document_statutes;
create policy doc_statutes_admin_write on public.document_statutes
  for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Storage bucket for generated PDFs (private; users access own folder).
-- Path convention: documents/<user_id>/<document_id>.pdf
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

drop policy if exists storage_docs_select_own on storage.objects;
create policy storage_docs_select_own on storage.objects
  for select using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );
drop policy if exists storage_docs_insert_own on storage.objects;
create policy storage_docs_insert_own on storage.objects
  for insert with check (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );
drop policy if exists storage_docs_update_own on storage.objects;
create policy storage_docs_update_own on storage.objects
  for update using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );
drop policy if exists storage_docs_delete_own on storage.objects;
create policy storage_docs_delete_own on storage.objects
  for delete using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );
