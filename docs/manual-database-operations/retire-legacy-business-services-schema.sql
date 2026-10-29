-- MANUAL, DESTRUCTIVE DATABASE OPERATION — NOT AN ACTIVE SUPABASE MIGRATION.
--
-- This script is deliberately stored outside supabase/migrations so a routine
-- `supabase db push` cannot apply it as part of the pending migration queue.
--
-- DO NOT RUN until all of the following are evidenced:
-- 1. The production application deployment is confirmed on the hyperlocal-only version.
-- 2. A repository and live consumer audit confirms no route, function, scheduled task,
--    integration, or operator workflow reads/writes the listed legacy objects.
-- 3. A fresh live database audit confirms exact row counts, grants, dependencies,
--    foreign keys, triggers, views, functions, and types that would be affected.
-- 4. A recoverable backup/restore path and explicit release approval are recorded.
-- 5. The cutover is reviewed as a separate operation, not bundled with unrelated migrations.
--
-- The original staged migration was not present in live migration history as of
-- 2026-10-29 and has NOT been applied. This is a safeguard, not evidence of completion.
--
-- The historical audit reported the listed tables empty and inaccessible to anon,
-- but that alone is not sufficient to authorize dropping them.
--
-- Canonical local-discovery model: places, place_sources, place_facts, categories,
-- place_categories, guides, guide_sources, guide_places.
--
-- Original destructive statements retained for a future, separately approved cutover.

DROP TABLE IF EXISTS
  public.business_claims,
  public.business_field_history,
  public.business_field_values,
  public.businesses,
  public.consultations,
  public.conversions,
  public.editorial_business_mentions,
  public.editorial_content,
  public.leads,
  public.merchant_accounts,
  public.merchant_permissions,
  public.messages,
  public.service_leads,
  public.website_audits
CASCADE;

DROP TYPE IF EXISTS
  public.audit_status,
  public.business_category,
  public.field_source,
  public.merchant_claim_status,
  public.merchant_role,
  public.verification_method;
