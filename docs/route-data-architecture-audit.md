# DallasCircle route and data architecture audit

**Scope:** source-code review of `seo/technical-foundation` on 2026-10-28. Not a live production crawl or database audit.

## Executive assessment

DallasCircle is now positioned as a focused local discovery product for Deep Ellum, Dallas. The current public pages are the homepage, About, and FAQ. A canonical public place/guide system has not yet been implemented.

The former business API routes and service-specific API routes have been removed from this branch. This is intentional: the source code alone did not establish that the actual Supabase schema, row-level security (RLS), or public write policies were safe. Reintroduce data routes only after the live schema and policies have been inspected and an explicit read/write contract has been agreed.

## Current route inventory from source

- `/`
- `/about`
- `/faq`
- A permanent redirect from the retired legacy service path to `/`

The sitemap currently lists only `/`, `/about`, and `/faq`. No public place profile or guide route is currently present.

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

The TypeScript contracts describe the target domain model only. They do not prove the production database schema matches. Inspect the real schema and data before migrations or queries.

## Supabase and API risks to verify

Previously inspected routes accepted broad client-supplied data for inserts or updates, and several routes exposed operational records. Those routes are now removed from this branch pending a proper replacement. This was a source-level risk, not proof of a deployed exploit.

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

Not yet run: local install, lint, typecheck, production build, full route/link tests, deployed HTTP crawl, or live Supabase schema/RLS inspection. No production safety or SEO result should be inferred from the current source edits alone.

## Recommended sequence

1. Finish full source and route cleanup.
2. Audit the actual Supabase schema, RLS, grants, and existing data.
3. Finalize and implement the canonical place/source/fact/guide model.
4. Build the first server-rendered Deep Ellum guide and a few source-backed place profiles.
5. Add publication quality gates, metadata, canonical URLs, and sitemap generation.
6. Add a low-friction correction path and newsletter only when their handling is operationally ready.
7. Run automated checks and a separate live crawl before merging or deploying.
