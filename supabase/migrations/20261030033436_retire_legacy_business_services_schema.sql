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
