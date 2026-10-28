# DallasCircle

**DallasCircle — Deep Ellum for the night out.**

DallasCircle is a remote-first, editorial-led local discovery platform for Dallas, Texas. The initial product focuses on Deep Ellum: practical guides and researched place profiles that help people plan dinner before a show, find late-night options, and plan date nights.

The product must not imply firsthand visits or publish unsupported claims. Use reliable public sources, prefer official business and venue information, record verification dates for changing facts, and label paid placements clearly.

## Product boundaries

- Start with Deep Ellum and the night-out use case.
- Build a small, useful, source-backed product before expanding geography or categories.
- Keep place facts, source provenance, editorial content, publication state, and sponsorship status distinct.
- Do not build merchant dashboards, claims workflows, marketplace features, or broad directory coverage before demand justifies them.
- Do not include technical consulting, software services, or agency offerings in the product.

## Technology

- Next.js App Router and TypeScript
- Tailwind CSS
- Supabase/PostgreSQL, after schema and RLS validation
- Vercel deployment

## Development

Install dependencies and run the available checks:

```bash
npm ci
npm run lint
npm run build
npm run dev
# After deploying a preview or production build:
SITE_URL=https://your-preview-domain.example npm run check:live
```

Read `AGENTS.md` and the matching Next.js documentation available in the installed package before making framework changes. Check `package.json` for the scripts actually available in this checkout.

## Architecture and delivery

- `docs/high-level-product-and-architecture-requirements.md` defines the product and technical direction.
- `docs/prioritized-delivery-backlog.md` defines sequencing and acceptance gates.
- `docs/route-data-architecture-audit.md` and `docs/seo-foundation-audit.md` record the current source-level findings and outstanding verification.
- `docs/supabase-security-audit.md` records the live database findings, applied access-hardening migrations, and remaining permissions blocker.

The public write/API surface remains disconnected. Server-rendered place and guide pages now use the anonymous read-only client and explicit RLS/grant contracts; no browser service-role key or public write helpers exist. The live audit and grant-hardening migrations are documented in `docs/supabase-security-audit.md`. The `supabase_admin` default-privilege blocker and missing historical migration baseline still require authorized resolution before treating database administration and future migration deployment as fully safe.

## Release rule

Use `scripts/verify-live-routes.mjs` via `npm run check:live` against a deployed preview or production URL to check HTTP status, canonical tags, JSON-LD, source/correction context, sitemap inclusion, and the retired-path redirect. Do not run it against the old production deployment and treat failure as a code regression before deploying this branch.

Do not describe changes as production-ready or deployed unless type/lint/build checks, route/link checks, security checks, and live HTTP validation have actually run. Keep unrun checks visible in the pull request.
