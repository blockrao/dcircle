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

Fourteen migration versions are now represented in the live project and branch. The historical baseline `20261023040126_003_core_business_schema.sql` was recovered from `supabase_migrations.schema_migrations.statements` and verified against the live record; its SQL content matches exactly (the repository file adds only a final newline). The twelve subsequent migrations through `20261029014857_require_reviewed_guides_and_preserve_publication_integrity` are represented under `supabase/migrations/`. The live retirement migration `20261030033436_retire_legacy_business_services_schema` was applied directly to the project and recorded in Supabase migration history, but its matching SQL file is not yet present in this repository branch. Do not describe it as staged in the repository.

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

The service role retains the required function privileges. The 14 retired tables were confirmed to contain zero rows before removal and have since been dropped from the live database. The canonical schema now contains the published Deep Ellum neighborhood, three published place profiles, one published guide, and their source/fact/category/guide relationships.

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

## Supabase-managed default ACL for supabase_admin — reviewed 29 October 2026

The live `pg_default_acl` catalog confirms that the platform-managed `supabase_admin` role has broad defaults for objects it creates in `public`. This is a documented Supabase-managed default, not an ACL that the project `postgres` role can repair: Supabase's current guidance says project users cannot change this internal role's default privileges, and role membership is reserved to Supabase. Do not pursue an unsupported superuser/role-owner workaround or describe the ACL itself as fixable through the project SQL connection.

References:
- Supabase Knowledge Base: https://supabase.com/kb/troubleshooting/cant-change-the-default-privileges-of-supabase_admin-in-the-public-schema
- Supabase roles and superuser limitations: https://supabase.com/docs/guides/database/postgres/roles-superuser

### Verified mitigation and current state

- The `ensure_rls` DDL event trigger is enabled for `ddl_command_end`.
- `public.rls_auto_enable()` is owned by `postgres` and runs as `SECURITY INVOKER`, not `SECURITY DEFINER`.
- The trigger applies fail-closed hardening to new objects created in `public`: new tables get RLS enabled; tables, views, materialized views, foreign tables, sequences, functions, and procedures have privileges revoked from `PUBLIC`, `anon`, and `authenticated`. Reviewed migrations then add only explicit grants required by the product.
- A live catalog query confirms that the `postgres`-owned defaults for public tables, sequences, and functions do not grant privileges to `anon` or `authenticated`. `service_role` retains its server-side grants.
- A live catalog query confirms all nine canonical local-discovery tables have RLS enabled and one policy each. `anon` has no INSERT, UPDATE, or DELETE privilege on those tables; public SELECT is available on the intended published content tables. Source and relationship tables use column-level SELECT grants, so table-level `has_table_privilege(..., 'SELECT')` can be false even when approved columns are readable.
- Earlier transaction-rollback regression tests verified that anonymous writes and internal-note reads are denied, publication integrity checks reject invalid changes, and test rows are rolled back.

The underlying `supabase_admin` default ACL remains broad by platform design, but current Supabase guidance does not provide a supported project-level fix. **It is not a standalone release blocker after the trigger and actual object grants are verified.** Keep the fail-closed trigger, re-run catalog/advisor checks after database/platform changes, and explicitly review extension-created objects. Do not claim the underlying ACL has been changed or disable the trigger. The legacy-table retirement has since been applied and verified separately; the repository migration-history synchronization remains outstanding.

## Current database state

The canonical local-discovery schema is the active application data model. The obsolete business-services tables and their unused enum types have been removed from the live Dallas database by migration `20261030033436_retire_legacy_business_services_schema`. An exact pre-removal count confirmed zero rows in each of the 14 retired tables. Catalog review found no dependent views, triggers, policies, or external foreign-key references requiring migration.

The original applied migration remains in the repository as immutable migration history; it is not part of the current runtime data model. New databases apply the historical baseline and then the retirement migration, resulting in the same canonical local-discovery schema.

## Advisor findings

- The canonical local-discovery tables retain reviewed RLS policies and least-privilege grants. Continue to review advisor findings against the active schema rather than obsolete application concepts.
- Supabase security advisor: `public.rls_auto_enable()` was executable by anonymous and authenticated roles. Its grants are revoked; it is now `SECURITY INVOKER`, and the `ensure_rls` event trigger is enabled.
  - Remediation guidance: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable

## Rules for the active local-discovery schema

1. Keep source records, factual verification, publication status, and sponsorship status separate.
2. Use explicit least-privilege grants and RLS for exposed tables.
3. Public place/guide reads expose only published, canonical records.
4. Never expose internal editorial notes or correction workflow data through broad queries.
5. Anonymous users cannot create or edit canonical place/guide records.
6. Re-run Supabase security advisors after schema/access changes and verify intended anonymous/authenticated behavior.

## Related platform change

Supabase announced that new tables in the public schema will no longer be exposed to the Data and GraphQL APIs automatically, with enforcement on existing projects scheduled for 2026-10-30. The new model should use explicit, reviewed grants rather than relying on implicit API exposure: https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically


## Category normalization — 28 October 2026

- Added `categories` and `place_categories`; seeded the seven existing category concepts as normalized category records.
- Backfilled any existing `places.category` values to the relationship table, then removed the legacy single-value column. The live `places` table was empty at migration time, so no place assignments were lost.
- Added public read policies that expose active categories and place-category relationships only when attached to published content; writes remain unavailable to `anon` and `authenticated`.
- Publication guards now require an active primary category. A deferred constraint trigger validates that published places retain at least one active category and exactly one primary category at transaction commit, allowing a primary-category swap within one transaction.
- Categories are data-model support only; do not publish category landing pages until the inventory and editorial value justify them.

- Follow-up hardening: category SELECT policy is deliberately non-recursive (`is_active` only); place-category visibility still requires the associated place and neighborhood to be published. This avoids cyclic RLS policy evaluation between the two tables.

- Added covering indexes for the composite `place_facts(source_id, place_id)` foreign key and `places.neighborhood_id` after the Supabase performance advisor identified the missing coverage. Reassess index usage against real local-discovery query patterns before pruning.


## Publication integrity hardening — 29 October 2026

Applied live migration `20261029014857_require_reviewed_guides_and_preserve_publication_integrity` and committed the matching migration file.

- Public guide reads and their related source/place rows now require `publication_status = 'published'`, a non-null `published_at`, and a non-null `reviewed_at`.
- Trigger checks prevent a published guide from losing its final source or final place relationship. They also reject a published guide if a linked place is no longer published.
- A place cannot be unpublished while a currently published/reviewed guide still depends on it; unpublish or revise the guide first.
- A published place cannot lose its last current verified fact through an insert/update/delete operation. Runtime page and sitemap checks also reject places with no current fact, no visible source, or no active primary category.
- The shared application helper `lib/publication-eligibility.ts` is used by place routes, guide routes, and the sitemap to keep indexability decisions aligned.
- Rollback-only regression checks were executed against the live project. Publication without source evidence was rejected; deleting the last current fact/source/place relationship and unpublishing a place still used by a published guide were rejected. All test records were rolled back and a follow-up query confirmed zero test records remained.
- Verified via catalog privilege checks that anonymous users cannot insert/update/delete place records and cannot select `internal_notes` from place sources, place facts, or guide sources. The four new trigger helper functions are not executable by `anon`.

This does not resolve the separate underlying `supabase_admin` default-ACL issue. The legacy-table retirement was subsequently applied and verified; its SQL migration file still needs repository synchronization.
