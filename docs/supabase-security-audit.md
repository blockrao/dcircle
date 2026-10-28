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

Fourteen migration versions are now represented in the live project and branch. The historical baseline `20261023040126_003_core_business_schema.sql` was recovered from `supabase_migrations.schema_migrations.statements` and verified against the live record; its SQL content matches exactly (the repository file adds only a final newline). The thirteen subsequent applied migrations are also represented under `supabase/migrations/`; the legacy-retirement migration is staged but not yet applied.

1. `20261028152728_revoke_legacy_public_schema_grants`
   - Revoked all table privileges from `anon` and `authenticated` across existing public-schema tables.
   - Revoked their privileges on public-schema sequences.
   - Revoked function execution from `PUBLIC`, `anon`, and `authenticated`.

2. `20261028152750_revoke_default_public_grants_postgres`
   - Removed automatic table, sequence, and function grants to `anon` and `authenticated` for future public-schema objects created by `postgres`.
3. `20261028153125_create_canonical_local_discovery_schema`
   - Added the seven canonical neighborhood/place/source/fact/guide relationship tables, safe public read grants, RLS policies, and the initial Deep Ellum neighborhood row.
4. `20261028153221_strengthen_publication_integrity`
   - Enforced source/place referential integrity and restricted public visibility to published neighborhoods and current verified facts.
5. `20261028153246_require_source_backed_publication`
   - Added publication gates for places/guides and required review dates for volatile verified facts.
6. `20261028153544_revoke_public_trigger_function_execution`
   - Revoked direct API execution of database trigger functions from `PUBLIC`, `anon`, and `authenticated`.
7. `20261028153642_revoke_global_public_function_default`
   - Removed PostgreSQL's global default `PUBLIC EXECUTE` grant for future functions created by `postgres`.
8. `20261028155106_normalize_place_categories`
   - Added `categories` and `place_categories`, backfilled any legacy values, removed the single-category column, and added category publication guards.
9. `20261028155132_defer_category_integrity_checks`
   - Made published-place category integrity checks deferred until transaction commit and prevented deactivating categories linked to published places.
10. `20261028155220_avoid_category_policy_recursion`
   - Replaced a recursive category read policy with a non-recursive active-category policy.
11. `20261028155434_index_local_discovery_foreign_keys`
   - Added indexes for the composite place-fact/source foreign key and neighborhood foreign key.
12. `20261028155619_seed_first_deep_ellum_editorial_slice`
   - Seeded three source-backed place profiles, verified hours/kitchen facts with review dates, one guide, source records, and guide/place relationships.

Verification after applying these migrations confirmed:
- no table-level INSERT/UPDATE/DELETE grants for `anon` or `authenticated` on the canonical content tables; explicit SELECT grants are limited to public content, with column-level projections for source/fact/relationship tables;
- `anon` and `authenticated` cannot execute `public.rls_auto_enable()` or the new trigger functions;
- the `ensure_rls` event trigger remains enabled and bound to `rls_auto_enable()`;
- all nine new tables have RLS enabled and one public-read policy each;
- public reads work for a published test place/source/verified fact while a draft place remains invisible to `anon`;
- `anon` cannot insert places and cannot select internal notes from source/fact tables;
- place and guide publication gates passed positive and negative checks using temporary rows that were rolled back.

The service role retains the required function privileges. No legacy rows or tables were deleted. The canonical schema now contains the published Deep Ellum neighborhood, three published place profiles, one published guide, and their source/fact/category/guide relationships.

## Canonical local-discovery schema implemented

An additive migration created the new application model without dropping the empty legacy tables:

- `neighborhoods`: publication-controlled Dallas neighborhood records; seeded with the initial `deep-ellum` record.
- `places`: stable slug, local address, coordinates, neighborhood relation, price level, and publication state; normalized categories live in `categories` and `place_categories`.
- `place_sources` and `place_facts`: source provenance, checked dates, verification status, and review-due dates. Facts must reference a source for the same place.
- `guides` and `guide_sources`: editorial guide content, review state, and sources.
- `guide_places`: stable guide/place relationships, editorial rationale, and explicit sponsorship disclosure.

All nine new tables have RLS enabled and one narrowly scoped public SELECT policy each. There are no anonymous/authenticated write grants. Source and fact tables use column-level SELECT grants that exclude internal notes.

Publication checks enforce:
- a place needs a published neighborhood, address, source, and at least one current verified fact before it can be published;
- volatile verified facts such as opening/kitchen hours, menu/pricing, booking links, and event dates require a review-due date;
- a guide needs a publication date, review date, at least one source, and at least one linked published place before publication;
- sponsored guide/place relationships must include a non-empty disclosure.

### Verification performed

Read-only and transaction-rollback checks confirmed:
- the nine new tables have RLS enabled and nine corresponding public-read policies;
- the anonymous role can read the published Deep Ellum neighborhood;
- a transaction-created published test place, source, and verified fact were visible to the anonymous role, while a draft place was not;
- the anonymous role has no INSERT privilege on places and cannot select internal notes from source/fact tables;
- a place cannot be published without a source and a current verified fact;
- a guide cannot be published without source records and a place relationship;
- all test rows were rolled back; no test place/guide data remains.

These are database-level checks using the actual `anon` role, not a full browser/API integration test. A deployed route crawl is still outstanding.

## Remaining configuration issue: default privileges owned by supabase_admin

The default ACL for objects created by `supabase_admin` still grants broad privileges to `anon` and `authenticated`. The connected role is `postgres`, not a superuser, and cannot `SET ROLE supabase_admin`; direct changes to that role's default ACL are therefore not possible through this connection.

**Mitigation applied and tested:** migration `20261028161824_harden_public_ddl_default_grants` changed the existing `ensure_rls` event-trigger function to `SECURITY INVOKER` and fail closed. When new public tables, views, sequences, functions, or procedures are created, the DDL creator (the object owner) now revokes `PUBLIC`, `anon`, and `authenticated` privileges; new tables also receive RLS. Reviewed migrations can then apply explicit, narrow grants. A live rollback test verified RLS and denied anonymous table, sequence, and function access. The event trigger remains enabled.

This compensates for broad future-object defaults, but does not alter the underlying `supabase_admin` ACL. Do not claim the ACL itself is fixed. Resolve the underlying default ACL through an authorized superuser/role-owner path when available, and retain the fail-closed trigger as defense in depth.

## Legacy schema still present

The database still contains empty legacy tables, including `service_leads`, `website_audits`, `leads`, `consultations`, `conversions`, merchant claims/permissions, and the older business/editorial tables. Their application routes/helpers were removed from the feature branch, but the tables have **not** been dropped. Keep this distinction explicit. Table removal should be part of a reviewed schema replacement after dependency and ownership checks, not an untracked destructive change.

## Advisor findings

- Supabase security advisor still reports 14 legacy tables with RLS enabled but no policies. This is a closed posture, not a complete product access model. The nine new local-discovery tables have reviewed public-read policies; retire the legacy tables after the application cutover.
  - Remediation guidance: https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy
- Supabase security advisor: `public.rls_auto_enable()` was executable by anonymous and authenticated roles. Its grants are revoked; it is now `SECURITY INVOKER`, and the `ensure_rls` event trigger is enabled.
  - Remediation guidance: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
- Performance advisor reports unused indexes on the empty legacy schema. Do not prune them before the schema replacement plan is finalized.

## Migration-history drift

The original migration-history mismatch is resolved: the baseline SQL was recovered from the live `supabase_migrations.schema_migrations` record and checked against the repository file. The current branch has a local file for each remote migration version. Four additional empty legacy tables (`leads`, `consultations`, `conversions`, and `messages`) were created outside the tracked migration chain; a staged retirement migration now removes all 14 empty legacy business/service tables and their unused enum types so fresh and live databases can converge.

The retirement migration has been committed to the branch but has **not** been applied to the live project. Apply it only after the hyperlocal-only application version is deployed and the old production route/form dependency check is complete. The underlying `supabase_admin` default ACL remains unresolved even though the new-object DDL guard mitigates its effective impact.

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


## Category normalization — 28 October 2026

- Added `categories` and `place_categories`; seeded the seven existing category concepts as normalized category records.
- Backfilled any existing `places.category` values to the relationship table, then removed the legacy single-value column. The live `places` table was empty at migration time, so no place assignments were lost.
- Added public read policies that expose active categories and place-category relationships only when attached to published content; writes remain unavailable to `anon` and `authenticated`.
- Publication guards now require an active primary category. A deferred constraint trigger validates that published places retain at least one active category and exactly one primary category at transaction commit, allowing a primary-category swap within one transaction.
- Categories are data-model support only; do not publish category landing pages until the inventory and editorial value justify them.

- Follow-up hardening: category SELECT policy is deliberately non-recursive (`is_active` only); place-category visibility still requires the associated place and neighborhood to be published. This avoids cyclic RLS policy evaluation between the two tables.

- Added covering indexes for the composite `place_facts(source_id, place_id)` foreign key and `places.neighborhood_id` after the Supabase performance advisor identified the missing coverage. The advisor still reports unused indexes on empty legacy/new tables; do not prune those until the legacy schema retirement and real query patterns are known.
