# DallasCircle — Prioritized Delivery Backlog

**Baseline:** Vision & Business Strategy dated 22 October 2026; High-Level Product & Architecture Requirements.  
**Working branch:** `seo/technical-foundation`  
**Product boundary:** DallasCircle is exclusively a hyperlocal discovery platform for Dallas, beginning with Deep Ellum. No technical consulting, software modernization, or agency services belong in the product.  
**Delivery principle:** one small, verifiable vertical slice at a time. Do not merge or deploy until build, route, security, and SEO checks have been run.

## P0 — Foundation gates

- [ ] **DC-01 — Complete product identity and route cleanup.** Align homepage, metadata, navigation, About, FAQ, and sitemap with the Deep Ellum local-discovery proposition. Remove legacy service pages, components, endpoints, lead capture, unsupported claims, and orphaned links. Keep only redirects needed to retire old inbound URLs safely. Initial cleanup is committed; full source/link and live-route validation remains outstanding.
- [ ] **DC-02 — Audit the real Supabase schema, RLS, grants, and existing data.** Inspect tables, policies, grants, constraints, and public access with the actual project. Do not claim a deployed vulnerability until verified. Do not restore public data APIs or add migrations before this audit.
- [ ] **DC-03 — Establish canonical place and source-backed fact model.** Stable IDs/slugs, publication state, canonical URL rules, source provenance, checked time, verification state, review due dates, and integrity constraints. TypeScript contracts are only a target model until reconciled with the actual database.
- [ ] **DC-04 — Implement the first server-rendered editorial vertical slice.** One Deep Ellum guide plus 3–5 researched place profiles, official-source links, last-checked context for volatile facts, profile-to-guide links, and visible correction contact. Never imply firsthand experience that did not occur.
- [ ] **DC-05 — Publication/indexing quality gate.** Draft/published/hidden/closed states; sitemap includes only published canonical pages that meet completeness rules. Rendering, metadata, structured data, internal links, and sitemap must share the same canonical source of truth.
- [ ] **DC-06 — Technical SEO verification.** Check route status, canonical tags, title/description, sitemap/robots, redirects, server-rendered main content, and internal links. Add repeatable automated checks; verify live deployment separately.
- [ ] **DC-07 — Trust, newsletter, and learning loop.** Publish sourcing/correction/sponsorship policy; implement a working newsletter signup only with appropriate consent and reliable handling; track useful actions, business corrections/responses, research effort, and sponsorship interest.

## P1 — After the first complete vertical slice

- [ ] **DC-08 — Lightweight editorial operations.** Draft/review/publish workflow, source ledger, due-for-review list, correction queue, audit trail, and preview. No complex merchant dashboard.
- [ ] **DC-09 — Occasion/constraint retrieval.** Deterministic filters for pre-show, post-show/late-night, budget, venue proximity, and data freshness; every result must explain its fit with source-backed facts.
- [ ] **DC-10 — Entity graph and contextual internal links.** Canonical relationships between places, guides, venues, and Dallas neighborhoods; prevent orphaned public profiles.
- [ ] **DC-11 — Business correction loop.** Low-friction corrections and response tracking; factual corrections remain free and separate from paid placements.
- [ ] **DC-12 — One-time newsletter sponsorship experiment.** Only when audience and deliverable can be honestly described; label sponsorship and track delivery and repeat willingness to pay.

## P2 — Deferred until evidence supports it

- [ ] **DC-13 — Replicate the model into another Dallas neighborhood.**
- [ ] **DC-14 — Events and itinerary planning with dependable official-source freshness.**
- [ ] **DC-15 — Merchant software, memberships, marketplace, rewards, or broad DFW directory.**

## Execution gates

1. **Gate A — Product identity:** complete DC-01 and verify no technical-service content remains in the public product or active code paths.
2. **Gate B — Safe data foundation:** complete DC-02 and document actual schema/RLS findings before migrations or API restoration.
3. **Gate C — Canonical content:** complete DC-03; review migration plan against existing schema/data; no duplicate slugs or untraceable published facts.
4. **Gate D — Vertical slice:** complete DC-04/DC-05; guide and profiles server-render correctly with accurate metadata and sitemap eligibility.
5. **Gate E — Verification:** complete DC-06; run lint/type/build, route/link, canonical, sitemap, and security checks. Record live HTTP checks separately.
6. **Gate F — Learning:** complete DC-07; collect audience and business evidence before investing in P1/P2.

## Definition of done

- Acceptance criteria exist before implementation.
- Change is made on a feature branch and linked to a PR.
- Existing database schema/data and security assumptions are checked before migrations.
- Build/type/lint/tests are run where available; unrun checks are explicitly reported.
- Public claims and structured data are supported by visible, source-backed content.
- No change is described as deployed or verified unless the corresponding check actually ran.

## Current blockers

- Legacy public service pages, service-specific endpoints, scanner component, and generic business API routes have been removed from this branch. Full repository reference scan and live-route checks remain outstanding.
- The public data layer remains intentionally disconnected. Initial live audit found 14 public tables with RLS enabled but no policies; current anon/authenticated grants and postgres-owned default grants were hardened. The `supabase_admin` default ACL still needs an authorized fix before the access model is complete. See `docs/supabase-security-audit.md`.
- Place and editorial routes do not yet exist.
- GitHub Actions passed locked dependency installation, lint, and production build on branch head; full route/link tests, deployed HTTP crawl, and live Supabase schema/RLS audit remain outstanding.
