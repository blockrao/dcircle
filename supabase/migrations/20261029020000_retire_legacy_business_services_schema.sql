-- Retire the empty legacy business-services schema after the application cutover.
--
-- SAFETY GATE:
-- Apply this migration only after the hyperlocal-only application version is deployed
-- and the old production routes/forms are confirmed no longer to reference these tables.
-- The live audit on 2026-10-28 found all 14 listed tables empty and inaccessible to anon.
-- The new canonical model uses places, place_sources, place_facts, categories,
-- place_categories, guides, guide_sources, and guide_places instead.

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
