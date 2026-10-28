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
```

Read `AGENTS.md` and the matching Next.js documentation available in the installed package before making framework changes. Check `package.json` for the scripts actually available in this checkout.

## Architecture and delivery

- `docs/high-level-product-and-architecture-requirements.md` defines the product and technical direction.
- `docs/prioritized-delivery-backlog.md` defines sequencing and acceptance gates.
- `docs/route-data-architecture-audit.md` and `docs/seo-foundation-audit.md` record the current source-level findings and outstanding verification.
- `docs/supabase-security-audit.md` records the live database findings, applied access-hardening migrations, and remaining permissions blocker.

The public database/API surface is intentionally disconnected. The live audit and the grant-hardening migrations are documented in `docs/supabase-security-audit.md`; public data routes must remain disabled until the unresolved default privileges and final RLS/public-read contract are addressed. Do not add public writes or schema migrations before that review.

## Release rule

Do not describe changes as production-ready or deployed unless type/lint/build checks, route/link checks, security checks, and live HTTP validation have actually run. Keep unrun checks visible in the pull request.
