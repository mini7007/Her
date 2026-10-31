-- ═══════════════════════════════════════════════════════════════════════════
-- 002_response_message_option.sql
-- Adds the free-voice option: Bacha can write what's in her heart WITHOUT
-- choosing one of the four buttons. Those submissions are stored with
-- response = 'message'.
--
-- Apply after 001: Supabase Dashboard → SQL Editor → paste → Run.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.relationship_responses
  drop constraint if exists relationship_responses_response_check;

alter table public.relationship_responses
  add constraint relationship_responses_response_check
  check (response in ('yes', 'time', 'talk', 'no', 'message'));
