# DallasCircle Supabase security baseline

**Audit date:** 2026-10-28  
**Project:** `dallas` (PostgreSQL 17.11)  
**Purpose:** Record the live database state and the least-privilege changes made while rebuilding DallasCircle as a hyperlocal discovery product.

## Confirmed live findings

- The `public` schema contained 14 tables and all 14 had RLS enabled.
- There were zero policies in `pg_policies` for the `public` schema. This means normal API roles had no row-level access through those tables.
- `anon` and `authenticated` nevertheless had broad table grants across all 14 tables: 98 table-level grants per role.
- Exact row counts were zero for all 14 tables at the time of the audit.
- The database had one pre-existing migration, `003_core_business_schema`.
- The public function `rls_auto_enable()` is a `SECURITY DEFINER` event-trigger function bound to the enabled `ensure_rls` event trigger. Before remediation, it was executable by `PUBLIC`, `anon`, and `authenticated`.
- Default privileges for both `postgres` and `supabase_admin` granted broad access to anonymous/authenticated roles on future public-schema objects.

These findings are a source of unnecessary exposure, but they do not establish that data was accessed or that a successful exploit occurred. With no policies and no rows, the tables were not functioning as a usable public data API.

## Changes applied and verified

Two migrations were applied to the live project and recorded in Supabase migration history:

1. `20261028152728_revoke_legacy_public_schema_grants`
   - Revoked all table privileges from `anon` and `authenticated` across existing public-schema tables.
   - Revoked their privileges on public-schema sequences.
   - Revoked function execution from `PUBLIC`, `anon`, and `authenticated`.

2. `20261028152750_revoke_default_public_grants_postgres`
   - Removed automatic table, sequence, and function grants to `anon` and `authenticated` for future public-schema objects created by `postgres`.

Verification after applying these migrations confirmed:
- zero table grants for `anon` across the current public-schema tables;
- zero table grants for `authenticated`;
- `anon` cannot execute `public.rls_auto_enable()`;
- `authenticated` cannot execute `public.rls_auto_enable()`;
- the `ensure_rls` event trigger remains enabled and bound to `rls_auto_enable()`.

The service role retains its function execution privilege. No rows or tables were deleted.

## Canonical local-discovery schema implemented

An additive migration created the new application model without dropping the empty legacy tables:

- `neighborhoods`: publication-controlled Dallas neighborhood records; seeded with the initial `deep-ellum` record.
- `places`: stable slug, local address, category, coordinates, neighborhood relation, price level, and publication state.
- `place_sources` and `place_facts`: source provenance, checked dates, verification status, and review-due dates. Facts must reference a source for the same place.
- `guides` and `guide_sources`: editorial guide content, review state, and sources.
- `guide_places`: stable guide/place relationships, editorial rationale, and explicit sponsorship disclosure.

All seven new tables have RLS enabled and one narrowly scoped public SELECT policy each. There are no anonymous/authenticated write grants. Source and fact tables use column-level SELECT grants that exclude internal notes.

Publication checks enforce:
- a place needs a published neighborhood, address, source, and at least one current verified fact before it can be published;
- volatile verified facts such as opening/kitchen hours, menu/pricing, booking links, and event dates require a review-due date;
- a guide needs a publication date, review date, at least one source, and at least one linked published place before publication;
- sponsored guide/place relationships must include a non-empty disclosure.

### Verification performed

Read-only and transaction-rollback checks confirmed:
- the seven new tables have RLS enabled and seven corresponding public-read policies;
- the anonymous role can read the published Deep Ellum neighborhood;
- a transaction-created published test place, source, and verified fact were visible to the anonymous role, while a draft place was not;
- the anonymous role has no INSERT privilege on places and cannot select internal notes from source/fact tables;
- a place cannot be published without a source and a current verified fact;
- a guide cannot be published without source records and a place relationship;
- all test rows were rolled back; no test place/guide data remains.

These are database-level checks using the actual `anon` role, not a full browser/API integration test. A deployed route crawl is still outstanding.

## Remaining blocker: default privileges owned by supabase_admin

The default ACL for objects created by `supabase_admin` still grants broad privileges to `anon` and `authenticated`. Attempting to change it failed with `permission denied to change default privileges`; the connected `postgres` role is not a superuser and cannot act as `supabase_admin`.

Do not describe the default-privilege hardening as complete. Resolve this using an authorized owner/admin path for `supabase_admin`, then verify the default ACL again. Until then, use explicit reviewed grants for new objects and avoid creating public-facing objects through a path that inherits the remaining defaults.

## Legacy schema still present

The database still contains empty legacy tables, including `service_leads`, `website_audits`, `leads`, `consultations`, `conversions`, merchant claims/permissions, and the older business/editorial tables. Their application routes/helpers were removed from the feature branch, but the tables have **not** been dropped. Keep this distinction explicit. Table removal should be part of a reviewed schema replacement after dependency and ownership checks, not an untracked destructive change.

## Advisor findings

- Supabase security advisor: 14 tables have RLS enabled but no policies. This is currently a closed posture, not a complete product access model. Add narrowly scoped policies only when the canonical place/guide model and intended roles are defined.
  - Remediation guidance: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- Supabase security advisor: `public.rls_auto_enable()` was executable by anonymous and authenticated roles. The current grants have been revoked and verified.
  - Remediation guidance: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
- Performance advisor reports unused indexes on the empty legacy schema. Do not prune them before the schema replacement plan is finalized.

## Rules for the new local-discovery schema

1. Keep source records, factual verification, publication status, and sponsorship status separate.
2. No public read/write grants by default. Explicitly grant only what a reviewed endpoint/view needs.
3. RLS must be enabled and the policy matrix tested for every exposed table.
4. Public place/guide reads must expose only published, canonical records.
5. Never expose internal editorial notes or correction workflow data through a broad `select *` query.
6. Public writes should use narrow validation and a specific use case; anonymous users must not create or edit canonical place/guide records.
7. Do not drop legacy tables until their dependencies and any non-database consumers have been checked.
8. Re-run Supabase security advisors after every schema/access migration and test intended anonymous/authenticated behavior.

## Related platform change

Supabase announced that new tables in the public schema will no longer be exposed to the Data and GraphQL APIs automatically, with enforcement on existing projects scheduled for 2026-10-30. The new model should use explicit, reviewed grants rather than relying on implicit API exposure: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically
