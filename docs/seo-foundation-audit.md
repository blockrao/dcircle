# DallasCircle SEO foundation — first-pass audit

## Changes in this branch

- Added `app/robots.ts` with a crawl policy and a sitemap reference.
- Added `app/sitemap.ts` for public routes that currently exist in the repository: `/`, `/about`, `/faq`, and `/php-rescue`.
- Added `metadataBase`, a title template, and Open Graph/Twitter defaults in the root layout.

## Findings requiring product decisions or verification

1. **Product positioning is inconsistent.** The homepage H1 is “PHP Modernization for DFW,” while site metadata describes a hyperlocal business-discovery product. The homepage should express one primary proposition. Do not rewrite it until the target product and audience are confirmed.
2. **Unverified performance and trust claims.** The homepage contains quantified case-study claims (including revenue growth, speed, and hosting savings), and trust badges assert security/compliance attributes. Keep these only if the team can provide evidence and permission to publish it.
3. **Referenced routes need runtime checks.** Homepage links include routes such as `/articles/php-modernization-case-study`, `/search`, `/categories`, and `/business-signup`. Their absence from the inspected route tree means they need verification against the deployed application; it does not, by itself, prove the deployed URLs return 404.
4. **Directory SEO is not yet established.** The repository needs a verified URL/data contract for business profiles, category/location landing pages, and editorial content before those URL families can be safely added to the sitemap.
5. **Server-rendered content matters.** The feeds widget fetches data client-side. Important editorial titles, summaries, and crawlable links should be rendered server-side when they are intended to earn organic search traffic.
6. **Canonical strategy needs route-level implementation.** Once public route families exist, each indexable page should emit a self-referencing canonical URL and unique title/description. Do not generate indexable thin or duplicate pages just to increase URL count.

## Validation status

This branch was edited through the GitHub integration. A local install, typecheck, build, and deployed HTTP crawl have **not** been run in this environment. Treat the changes as a reviewable first pass, not a production-validated release.

## Recommended next sequence

1. Confirm the product's primary positioning and launch geography.
2. Run a route/status audit against the deployed site and compare it with the repository route tree.
3. Define canonical entity and URL contracts for business, category, location, and editorial pages.
4. Build useful server-rendered landing pages backed by verified business data.
5. Add structured data only where visible page content supports it; validate schema and canonical/indexability rules.
6. Add Search Console/Bing Webmaster Tools verification, sitemap submission, and ongoing crawl/index coverage checks.
