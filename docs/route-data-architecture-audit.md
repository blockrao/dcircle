# DallasCircle route and data architecture audit

**Scope:** source-code review of `seo/technical-foundation` on 2026-10-28. Not a live production crawl or database audit.

## Executive assessment

DallasCircle is positioned as a focused local discovery product for Deep Ellum, Dallas. The branch includes the homepage, About, FAQ, a canonical place-profile route, and a guide route. The place/guide schema is wired to these server-rendered pages through a read-only anonymous Supabase client; the live database currently contains three published profiles and one published guide.

The former business API routes and service-specific API routes have been removed from this branch. This is intentional: the source code alone did not establish that the actual Supabase schema, row-level security (RLS), or public write policies were safe. Reintroduce data routes only after the live schema and policies have been inspected and an explicit read/write contract has been agreed.

## Current route inventory from source

- `/`
- `/about`
- `/faq`
- `/places/{place-slug}` — published place profiles
- `/guides/{guide-slug}` — published editorial guides
- A permanent redirect from the retired legacy service path to `/`

The sitemap now derives canonical place and guide URLs from published database records, alongside `/`, `/about`, and `/faq`. Category and neighborhood landing pages remain deferred until there is enough useful inventory.

## Target canonical URL contract

Do not publish these URL families until the corresponding pages, records, and publication rules exist.

| Page type | Proposed pattern | Indexing rule |
|---|---|---|
| Home | `/` | Index when it clearly describes the product |
| Place profile | `/places/{place-slug}` | Published, sufficiently complete, canonical, and source-backed |
| Neighborhood page | `/neighborhoods/{neighborhood-slug}` | Supported geography with useful local inventory |
| Category page | `/categories/{category-slug}` | Curated inventory and distinct editorial context |
| Editorial guide | `/guides/{guide-slug}` | Published, original, attributed, and useful |
| Guide/place relationship | Canonical links, not duplicate pages | Relationship must be useful and based on stable IDs |

Avoid indexable query-string filters by default. Promote a filter to a landing page only when it serves a distinct user need and has enough useful, maintainable content.

## Canonical place contract

The target application model should include:

- Immutable internal ID and unique, stable public slug.
- Name, category, locality, neighborhood relation, and verified address.
- Optional coordinates, website, contact details, price context, and other relevant public facts.
- Explicit publication status, separate from factual verification and any future business relationship.
- Field-level source reference, verification state, checked timestamp, and review-due date for changing facts.
- Source records with canonical URL, publisher/type, access date, and notes.
- Editorial guides linked to place IDs rather than copied facts.
- Sponsorship disclosure as a separate commercial property, never as a verification signal.

The core schema now exists in Supabase and is represented by `lib/local-discovery-database.types.ts`; application queries should use this narrow type contract. Legacy tables are still present but empty and access-restricted pending coordinated retirement after application cutover.

## Supabase and API risks to verify

Previously inspected routes accepted broad client-supplied data for inserts or updates. Those routes are now removed from this branch. The live audit found 14 legacy tables with RLS enabled and no policies, all empty; broad anon/authenticated table grants and public function execution were revoked. The new schema has narrow read policies and no public write grants. Place/guide pages query only published records; source/fact visibility is constrained by RLS and column-level grants. Public API write routes remain removed. This was a source-level/configuration risk, not proof of a deployed exploit.

Before restoring public database access:

1. Inventory tables, columns, constraints, indexes, views, grants, and functions.
2. Inspect RLS enablement and policies table by table.
3. Check whether anonymous users can read non-public records or write arbitrary values.
4. Separate public reads from authenticated editorial writes.
5. Define validation, rate limiting, error handling, and field projection.
6. Test with anonymous and authenticated roles using the real project configuration.
7. Add migrations only after preserving existing data and confirming backward compatibility.

Never expose a service-role secret in browser code. A public anonymous key is only appropriate when RLS and grants correctly constrain it.

## Rendering and indexing requirements

- Render meaningful place/guide facts and links in the initial server response.
- Use the same canonical record for visible facts, metadata, structured data, and sitemap eligibility.
- Include only published canonical pages that return 200 and pass page-type completeness checks.
- Exclude drafts, hidden records, duplicates, internal search states, and empty category pages.
- Add self-referencing canonical metadata and unique title/description for indexable pages.
- Use structured data only when it accurately represents the visible content and page entity.
- Keep a durable redirect map; test old URLs, chains, and loops.
- Ensure primary navigation and related links are ordinary crawlable anchors.

## Validation status

GitHub Actions passed locked dependency installation, lint, and production build on implementation head `d763f7163eaea91a7bb8f5ccbc1f1e1878e724df` ([run](https://github.com/blockrao/dcircle/actions/runs/40721850685)). Added `scripts/verify-live-routes.mjs` (`npm run check:live`) to check status codes, canonical links, JSON-LD, correction/source context, sitemap membership, and the retired-path redirect. It has not been run against a preview because this branch is not deployed; broader internal-link/robots checks and the deployed HTTP crawl remain outstanding. The live Supabase audit is documented in `docs/supabase-security-audit.md`: broad current grants were revoked and postgres-owned default grants were hardened, but `supabase_admin` default privileges remain unresolved. No public data API should be restored until that access model is complete. The passing build does not establish production safety or SEO behavior.

## Recommended sequence

1. Complete the source/reference scan and route/link audit.
2. Resolve the `supabase_admin` default-privilege blocker through an authorized superuser/role-owner path. The missing historical baseline has now been restored from the live migration record.
3. Add repeatable route, canonical, structured-data, and sitemap assertions.
4. Verify the three place profiles and guide through the deployed site before merging/deploying.
5. Add a low-friction correction workflow and newsletter only when their handling is operationally ready.
