# DallasCircle SEO foundation audit

**Scope:** source-code and connected Supabase review, 29 October 2026. This is not a public production crawl. The current branch is `seo/technical-foundation`; PR #1 remains open, draft, and unmerged.

## Executive assessment

The foundation has moved beyond a static landing page. The branch contains a server-rendered homepage, About and FAQ pages, canonical place-profile and guide routes, page metadata, JSON-LD, source/correction context, and a database-backed sitemap. The connected Supabase project contains three published place profiles and one published guide.

The architecture is appropriate for the initial Deep Ellum product: Next.js App Router and TypeScript, PostgreSQL-backed canonical entities, source/fact records, normalized categories, publication controls, and a read-only anonymous access path. The next priority is proving behavior with repeatable checks, not adding more page types or scaling inventory.

## Confirmed in source or connected project

- Homepage positioning and navigation are focused on **DallasCircle — Deep Ellum for the night out**.
- Place pages use `/places/{slug}`; guides use `/guides/{slug}`. Pages load published records through the anonymous read-only Supabase client.
- Place pages include canonical metadata, business-type JSON-LD, official-source links, checked/review context, and correction contact.
- Guide pages include canonical metadata, Article JSON-LD, linked canonical place records, sources, and sponsorship disclosure where applicable.
- Categories are normalized through `categories` and `place_categories`.
- Sitemap generation includes static pages and published place/guide records. Place and guide pages have publication-state checks, and database publication gates are intended to enforce source and completeness requirements.
- `app/robots.ts` allows general crawlers and explicitly allows `OAI-SearchBot`; the sitemap and host use the canonical domain.
- Public write/API routes remain disconnected. No service-role key is used in browser code.
- The live database has nine canonical local-discovery tables with reviewed public-read policies. The 14 legacy business/service tables remain empty and access-restricted pending coordinated retirement.
- The security advisor still reports 14 informational RLS-enabled-without-policy findings on those legacy tables. The performance advisor reports 30 unused-index findings, mostly on legacy tables. These findings are not, by themselves, justification to remove indexes without checking table usage and query plans.

## Current validation and gaps

1. **Local HTTP validation has not yet been run from the developer's machine.** The route verifier has been strengthened to check HTTP statuses, canonical URLs, title/description presence, JSON-LD parseability and types, robots rules, sitemap uniqueness and route coverage, internal-link status, source/correction context, and the retired-path redirect. It now supports a local request origin while retaining the expected canonical production origin.
2. **CI validates code quality, not live SEO behavior.** The workflow runs locked dependency installation, lint, production build, and now a syntax check for the route verifier. It does not substitute for running the verifier against a locally running application.
3. **No staging or production crawl has been performed for this branch.** Hosting remains intentionally deferred. A passing build does not prove runtime route correctness, crawlability, canonical behavior, or indexing.
4. **Sitemap eligibility must remain coupled to publication quality.** Sitemap queries filter published records and required timestamps, while page handlers apply published-record checks. The database publication gates must continue to prevent incomplete or untraceable records from being published; add regression tests for that contract before expanding content.
5. **The editor workflow is not complete.** Source-backed records exist, but there is no full draft/review/publish console, due-for-review queue, correction-history workflow, or operational newsletter signup. Keep these as post-foundation priorities; do not add public write endpoints before the editorial authorization model is designed and tested.
6. **The underlying `supabase_admin` default-privilege ACL remains unresolved.** A fail-closed DDL event trigger mitigates future public objects, but the original role-owned default ACL requires an authorized role-owner/superuser path. Keep this documented and re-verify after any database-role or migration changes.
7. **Legacy database retirement is staged, not applied.** Do not drop the 14 legacy tables or six enum types until the new application is deployed and dependencies on old routes/forms are confirmed to be gone.
8. **Unused-index findings need a usage-aware review.** Do not drop indexes simply because the advisor has not observed usage during its measurement window; first confirm table lifecycle, query workload, and foreign-key needs.

## Local verification workflow

Start the app with `npm run dev`, then run from a second terminal:

```bash
SITE_URL=http://localhost:3000 CANONICAL_SITE_URL=https://dallascircle.com npm run check:live
```

The verifier fetches routes from `SITE_URL` but checks canonical URLs and sitemap entries against `CANONICAL_SITE_URL`. For a later preview environment, use the preview URL for `SITE_URL` and keep the intended public domain as `CANONICAL_SITE_URL`.

The verifier currently expects the initial vertical slice to contain the homepage, About, FAQ, one guide, and three place profiles. If the approved editorial inventory changes, update these explicit acceptance expectations intentionally rather than weakening the checks.

## Next execution sequence

1. Run CI on the updated branch and confirm syntax, lint, and build results.
2. Run the expanded route verifier against the local development server; fix any real defects it finds rather than bypassing assertions.
3. Add publication-integrity and anonymous-access regression tests for published versus draft/hidden records, private source/fact fields, and denied public writes.
4. Audit the place/guide publication gates and sitemap eligibility against the same page completeness contract.
5. Resolve the `supabase_admin` default-ACL blocker through an authorized path; re-run the Supabase security advisor and record the outcome.
6. Complete editorial correction/history and freshness operations before materially increasing the number of public pages.
7. Keep deployment and destructive legacy-table retirement gated until the local acceptance suite passes and the remaining security decisions are documented.

## Release rule

Do not call the site production-ready, deployed, crawl-verified, or AI-discovery-ready based on source review or a passing build alone. Keep source review, local runtime checks, staging/production HTTP checks, and search-engine indexing evidence as separate states. No architecture can guarantee Google rankings or AI citations; the goal is a technically accessible, source-backed, useful product that can be evaluated honestly.
