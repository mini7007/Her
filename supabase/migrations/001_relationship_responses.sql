-- ═══════════════════════════════════════════════════════════════════════════
-- 001_relationship_responses.sql
-- "If You Could Hear My Heart" — persistent response storage + rate limits
--
-- Apply with:  supabase db push        (if linked via Supabase CLI)
-- or paste into: Supabase Dashboard → SQL Editor → Run.
--
-- Security model:
--   • Row Level Security is ENABLED and NO public policies exist.
--   • Anonymous visitors can neither INSERT nor SELECT.
--   • All reads/writes happen server-side with the service-role key,
--     after validation, rate limiting and owner authorization.
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- ── Her responses ────────────────────────────────────────────────────────────
create table if not exists public.relationship_responses (
  id            uuid primary key default gen_random_uuid(),
  response      text not null,
  message       text,
  status        text not null default 'unread',
  submitted_at  timestamptz not null default now(),
  -- Nullable idempotency token from the sender's device; unique so an
  -- accidental double-tap can never create two rows.
  client_token  text
);

-- Restrict response values: yes / time / talk / no
alter table public.relationship_responses
  add constraint relationship_responses_response_check
  check (response in ('yes', 'time', 'talk', 'no'));

-- Restrict status values: unread / read
alter table public.relationship_responses
  add constraint relationship_responses_status_check
  check (status in ('unread', 'read'));

-- Keep messages within the enforced limit (belt and braces — the API validates too)
alter table public.relationship_responses
  add constraint relationship_responses_message_length_check
  check (char_length(message) <= 3000);

-- Only one row per client token (NULL tokens are exempt from UNIQUE)
alter table public.relationship_responses
  add constraint relationship_responses_client_token_key
  unique (client_token);

create index if not exists idx_relationship_responses_submitted_at
  on public.relationship_responses (submitted_at desc);

create index if not exists idx_relationship_responses_status
  on public.relationship_responses (status);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table public.relationship_responses enable row level security;

-- Deliberately NO policies:
--   • anon role  → no SELECT / INSERT / UPDATE / DELETE
--   • auth role  → no SELECT / INSERT / UPDATE / DELETE
-- Only the service-role connection (server-side, never exposed to the
-- browser) can touch this table.

-- ── Cross-instance rate limiting (salted IP hashes, never raw IPs) ──────────
create table if not exists public.response_rate_limits (
  client_hash   text primary key,
  window_start  timestamptz not null default now(),
  count         integer not null default 0
);

alter table public.response_rate_limits enable row level security;

-- Again: no policies. Server-side service-role access only.
