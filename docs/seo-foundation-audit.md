# DallasCircle SEO foundation audit

**Scope:** source-level review of branch `seo/technical-foundation` on 2026-10-28. This is not a production crawl.

## Current direction

The public proposition is now **“DallasCircle — Deep Ellum for the night out.”** Homepage, root metadata, navigation, About, FAQ, and sitemap are focused on the initial local-discovery product. The sitemap currently lists only `/`, `/about`, and `/faq`; it does not pretend that restaurant profiles or guides already exist.

Legacy service endpoints and the old business API routes have been removed from this branch pending a schema, authorization, and publication-state audit. The old route redirect is retained so an existing inbound link can land on the current product.

## Findings still requiring work

1. **No canonical place/guide route family exists yet.** Implement stable slugs and route contracts before publishing place or guide URLs.
2. **No publication-gated content pipeline exists yet.** Drafts, hidden records, duplicates, closed places, and published content must be treated distinctly.
3. **No database-backed public directory is wired yet.** Inspect the actual Supabase schema, data quality, grants, and RLS policies before implementing queries or migrations.
4. **Sitemap eligibility must share one source of truth with page rendering.** Only published, canonical, sufficiently complete pages returning 200 should be included.
5. **Primary content must be server-rendered.** Client-side fetching may support interaction but must not be the only way crawlers can discover essential content.
6. **Every indexable page needs unique metadata and a stable canonical.** Avoid thin filter combinations and duplicate query-string variants.
7. **Redirect behavior and the live domain remain unverified.** Test status codes, canonical host, redirect chains, robots, sitemap, and internal links against the deployed site.

## Validation status

The branch was edited through the GitHub integration. A local dependency install, lint, typecheck, production build, deployed HTTP crawl, and Supabase RLS inspection have not run in this environment. These changes are reviewable source changes, not a production-validated release.

## Next steps

1. Complete the source and route inventory.
2. Inspect actual Supabase tables, constraints, grants, RLS, and existing data.
3. Agree the canonical place, fact/source, guide, and publication-state contract.
4. Implement one server-rendered guide and a small number of individually researched place profiles.
5. Add page metadata, canonical URLs, structured data supported by visible content, and a publication-gated sitemap.
6. Automate route, link, metadata, sitemap, and redirect checks; then validate the deployed domain separately.
