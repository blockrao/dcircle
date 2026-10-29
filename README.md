# DallasCircle

**DallasCircle — Deep Ellum for the night out.**

DallasCircle is a remote-first, editorial-led local discovery platform for Dallas and its localities. The long-term experience will cover a broad range of local topics, with clear editorial navigation and locality-aware browsing. Deep Ellum nightlife and night-out planning are the first complete launch slice—not the permanent product boundary.

The product must not imply firsthand visits or publish unsupported claims. Use reliable public sources, prefer official business and venue information, record verification dates for changing facts, and label paid placements clearly.

## Strategic baseline

The product and architecture decision record is [`docs/vision-and-strategic-direction.md`](docs/vision-and-strategic-direction.md). The staged roadmap, discoverability standards, phase gates, metrics, and immediate execution queue are in [`docs/roadmap-and-discoverability-operating-plan.md`](docs/roadmap-and-discoverability-operating-plan.md). UI and locality coverage principles are documented in [`docs/ui-and-locality-coverage-principles.md`](docs/ui-and-locality-coverage-principles.md). Canonical merchant profiles and opt-in founder profiles are specified in [`docs/canonical-merchant-and-founder-architecture.md`](docs/canonical-merchant-and-founder-architecture.md). It defines the vision, mission, intended SEO/discoverability advantage, architecture choice, repository reuse policy, release priorities, and the standing mandate for ChatGPT to act as lead internet architect and product manager. The detailed requirements and delivery documents must remain consistent with it.

## Product boundaries

- Design the navigation and UI for broad topic coverage and locality-aware browsing from the beginning.
- Make Deep Ellum the first complete, useful, source-backed launch area; expand other localities and topics in coverage-qualified waves.
- Keep place facts, source provenance, editorial content, publication state, and sponsorship status distinct.
- Do not build merchant dashboards, claims workflows, marketplace features, or broad directory coverage before demand justifies them.
- Do not include technical consulting, software services, or agency offerings in the product.

## Technology

- Next.js App Router and TypeScript
- Tailwind CSS
- Supabase/PostgreSQL, with schema, RLS, grants, and publication rules validated
- Hosting provider to be finalized before launch; no deployment is required during local development

## Development

Install dependencies, configure the public Supabase client, and run the available checks:

```bash
npm ci
cp .env.example .env.local
# Edit .env.local with the project's Supabase URL and public anon key.
npm run lint
npm run build
npm run dev
```

Only use the Supabase publishable/anon key in `NEXT_PUBLIC_SUPABASE_ANON_KEY`; never place a service-role key in a `NEXT_PUBLIC_*` variable or commit real credentials.

With the local development server running, use a second terminal for the route/SEO check:

```bash
SITE_URL=http://localhost:3000 CANONICAL_SITE_URL=https://dallascircle.com npm run check:live
```

The verifier checks HTTP status, canonical URLs, titles/descriptions, JSON-LD parsing and page types, sitemap uniqueness and coverage, robots rules, internal links and redirect chains/loops, source/correction context, and the retired-path redirect. It fetches pages from `SITE_URL` but expects public canonical URLs to use `CANONICAL_SITE_URL`, allowing local validation without changing the production canonical host.

When a staging environment is eventually available, run the same verifier against it:

```bash
SITE_URL=https://your-preview-domain.example CANONICAL_SITE_URL=https://dallascircle.com npm run check:live
```

Do not run the route verifier against an old production deployment and interpret its failures as regressions in this branch. Do not deploy until local quality gates pass and the remaining database/security blockers are resolved or explicitly accepted.

Read `AGENTS.md` and the matching Next.js documentation available in the installed package before making framework changes. Check `package.json` for the scripts actually available in this checkout.

## Architecture and delivery

- `docs/vision-and-strategic-direction.md` is the authoritative strategic direction and architecture decision baseline.
- `docs/high-level-product-and-architecture-requirements.md` defines detailed product and technical requirements consistent with that baseline.
- `docs/prioritized-delivery-backlog.md` defines sequencing and acceptance gates.
- `docs/route-data-architecture-audit.md` and `docs/seo-foundation-audit.md` record the current source-level findings and outstanding verification.
- `docs/supabase-security-audit.md` records the live database findings, applied access-hardening migrations, and remaining permissions blocker.

The public write/API surface remains disconnected. Server-rendered place and guide pages use the anonymous read-only client and explicit RLS/grant contracts; no browser service-role key or public write helpers exist. The live audit and grant-hardening migrations are documented in `docs/supabase-security-audit.md`. Migration `20261029014857_require_reviewed_guides_and_preserve_publication_integrity` tightens anonymous visibility for reviewed guides and prevents published guides/places from losing required sources, linked places, or current verified facts through row changes. The rollback-only regression script is `supabase/tests/publication-integrity.sql`. The historical migration baseline has been recovered from the live Supabase migration record and restored to the repository. The `supabase_admin` default ACL remains unchanged, but the existing DDL event trigger now fails closed and removes broad grants from new public objects; this was tested live. An authorized superuser/role-owner path is still needed to correct the underlying default ACL itself.

## Release rule

A successful build is not proof of correct SEO behavior or production readiness. Keep source-level checks, local HTTP checks, live preview checks, security checks, and launch approval distinct. Do not describe a feature as deployed or verified unless the corresponding check actually ran, and keep unrun checks visible in the pull request.
