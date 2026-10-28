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

GitHub Actions passed locked dependency installation, lint, and the production build on branch head `2a8b531ca7b0b7a27739b73021f7f4b431957ec7` ([run](https://github.com/blockrao/dcircle/actions/runs/40715451368)). A deployed HTTP crawl remains outstanding. A live Supabase audit has now confirmed 14 public tables with RLS enabled and no policies; broad anon/authenticated table grants and public function execution were revoked in two recorded migrations. The `supabase_admin` default ACL remains unresolved, and no public data API should be restored until the final access model is complete. The passing build does not establish production routing or indexing behavior.

## Next steps

1. Complete the source and route inventory.
2. Inspect actual Supabase tables, constraints, grants, RLS, and existing data.
3. Agree the canonical place, fact/source, guide, and publication-state contract.
4. Implement one server-rendered guide and a small number of individually researched place profiles.
5. Add page metadata, canonical URLs, structured data supported by visible content, and a publication-gated sitemap.
6. Automate route, link, metadata, sitemap, and redirect checks; then validate the deployed domain separately.
