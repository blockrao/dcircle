# DallasCircle route and data architecture audit

**Scope:** source-code review of `main` as inspected on 2026-10-28. This is not a live production crawl; the browsing tool could not retrieve the production domain, and a local build was not run.

## Executive assessment

The repository has the beginnings of a business directory data model, but the public URL architecture is not yet implemented as a crawlable directory. The existing pages are primarily a PHP-modernization marketing site, while homepage metadata and content also describe hyperlocal discovery. This mismatch is a product/IA problem before it is a metadata problem.

The `Business` interface includes `id`, `name`, `category`, `address`, `latitude`, `longitude`, `verified`, and timestamps. However, it does not define a stable public slug, city/neighborhood relations, opening hours, media, source attribution, review provenance, or a clear published/indexable status. The `EditorialContent` interface includes `slug`, but no public editorial route was found in the inspected route tree.

## Observed route and data findings

### Public routes found in source

- `/`
- `/about`
- `/faq`
- `/php-rescue`

### Homepage links requiring route verification

The homepage links to paths such as `/search?category=...`, `/categories`, `/business-signup`, and `/articles/php-modernization-case-study`. Corresponding page files were not found at the expected App Router paths on `main`. That means these routes are absent from the inspected source tree at those locations; only a deployed HTTP test can determine whether they are currently served by rewrites or another deployment configuration.

The feed API returns six hard-coded article entries whose `/articles/...` links do not correspond to an article route in the inspected tree. This risks sending users and crawlers to missing pages and makes the feed a non-authoritative content source.

### Business data and API risks

- `Business` has no stable public slug; using a mutable business name or opaque database UUID as the main public URL would create poor usability and migration risk.
- `/api/businesses` returns up to 50 rows from `businesses`, optionally filtering by name substring and category. It does not show explicit public-publication filtering, pagination, stable sorting, or field-level projection in the inspected code.
- The same API exposes a POST insert of the submitted JSON into `businesses`. The route itself does not demonstrate validation, authentication, or authorization checks. Confirm Supabase Row Level Security and server-side policies before treating this endpoint as safe.
- `lib/supabase.ts` uses the public anon key, which is normal only when database policies correctly enforce access. The source code alone does not establish whether the deployed database policies are safe.
- `verified` is a boolean on the business record, but field-level provenance and verification history are separate structures. Public trust labels should only be shown when the verification process is defined, auditable, and accurately represented.
- No public business-profile page or category landing page was found in the inspected route tree.

## Proposed public URL contract — subject to product confirmation

For a hyperlocal discovery product, prefer durable, readable URLs based on public entities. Do not publish these routes until their corresponding pages and data rules exist.

| Page type | Proposed pattern | Indexing rule |
|---|---|---|
| Home | `/` | Index if it clearly communicates the product |
| Business profile | `/businesses/{business-slug}` | Index only if the listing is real, sufficiently complete, and publicly viewable |
| Category landing page | `/categories/{category-slug}` | Index only when it has useful curated results and unique intro/context |
| Neighborhood landing page | `/neighborhoods/{neighborhood-slug}` | Index only for supported geographies with useful local inventory |
| Category + neighborhood | `/neighborhoods/{neighborhood-slug}/{category-slug}` | Add selectively; avoid creating every possible thin combination |
| Editorial guide | `/guides/{article-slug}` | Index only when the article is published, original, attributed, and useful |

Do not use both query-string and path variants as competing indexable pages. Search/filter result states should generally be non-indexable unless promoted into a deliberately designed landing page with stable canonical rules.

## Minimum data contract before generating SEO pages

For business profiles, establish:
- immutable internal ID and unique normalized public slug;
- name, primary category, full address, supported locality/neighborhood, and map coordinates;
- canonical business website and contact details where permitted;
- opening hours and special hours only when source-backed;
- image/media rights and meaningful alt text;
- record status: draft, published, hidden, duplicate, closed, or under review;
- field-level source, last-checked timestamp, and verification method for factual claims;
- merchant-claim status distinct from factual verification;
- review source and permission/provenance if reviews are ever displayed.

For editorial content, establish:
- unique slug, title, summary, body, author/editor, publish and modified timestamps;
- explicit status and publication date policy;
- source citations and editorial review process for factual claims;
- related business entities through stable IDs, with sponsorship disclosure where applicable.

## Rendering and search-engine requirements

- Render primary business facts and meaningful internal links in the initial server response. Client-side API fetching may support interactive filters, but should not be the only way crawlers discover core content.
- Generate page-specific titles, descriptions, canonical URLs, Open Graph metadata, and appropriate structured data from the same authoritative record used for visible content.
- Only emit `LocalBusiness` or a more specific subtype when the page actually represents that business and its visible content supports the properties. A directory page should not impersonate the listed business.
- Add dynamic sitemap entries only for published, canonical pages that return 200. Exclude drafts, duplicates, internal search states, empty categories, and unavailable/closed records unless there is a deliberate useful closure page.
- Use 301 redirects when changing established public URLs; keep a durable old-to-new mapping and test for chains and loops.
- Ensure page links are ordinary crawlable anchors and that important links do not depend solely on click handlers.

## Recommended order of work

1. Confirm one primary product proposition and launch geography; remove the current PHP-service/discovery ambiguity.
2. Crawl the deployed domain and test every internal link, redirect, canonical, robots, and sitemap response. The current environment could not fetch the live domain, so this remains outstanding.
3. Audit Supabase schema, RLS policies, data completeness, duplicates, provenance, and public publication state.
4. Define and implement stable slugs plus business-profile pages before expanding the sitemap.
5. Build category/neighborhood landing pages only where inventory and editorial context justify them.
6. Add server-rendered editorial pages and remove hard-coded feed links until the linked routes exist.
7. Add structured data and sitemap generation from published canonical entities, then validate with build checks and external rich-result/schema tools.

## Current confidence boundaries

Confirmed by repository source inspection: listed routes and interfaces, hard-coded feed records, API query shape, and the absence of the expected page files on `main`.

Not yet verified: production HTTP status codes, deployed Supabase RLS policies, real data quality/counts, indexation state, Search Console performance, and whether hosting rewrites serve paths not represented in the repository route tree.
