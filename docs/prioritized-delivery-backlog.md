# DallasCircle — Prioritized Delivery Backlog

**Baseline:** Vision & Business Strategy dated 22 October 2026; High-Level Product & Architecture Requirements.
**Working branch:** `seo/technical-foundation`
**Delivery principle:** one small, verifiable vertical slice at a time. Do not merge or deploy until build, route, security, and SEO checks have been run.

## Priority order

### P0 — Must be done before positioning this as the new product

- [ ] **DC-01 — Resolve and implement the product identity / homepage IA.** Make the public site consistently about “DallasCircle — Deep Ellum for the night out”; remove contradictory PHP-modernization positioning, unsupported performance/revenue claims, and non-working placeholder links from consumer-facing pages. Keep any agency/service offer out of the consumer discovery experience unless it is explicitly re-approved as a separate brand/area.
- [ ] **DC-02 — Audit database schema, RLS, and public write paths.** Inspect the actual Supabase schema/policies and existing production data before changing tables. Verify public reads are intentionally scoped and public POST endpoints cannot insert arbitrary records. Do not claim a vulnerability until policies are checked.
- [ ] **DC-03 — Establish canonical place and source-backed fact model.** Stable IDs/slugs, publication state, canonical URL rules, fact provenance (source URL/type, checked time, verification state, review due date), and integrity constraints. Preserve existing tables/data; use additive migrations only after schema audit.
- [ ] **DC-04 — Implement the first server-rendered editorial vertical slice.** One Deep Ellum guide plus 3–5 researched restaurant profiles, with official-source links, last-checked context for volatile facts, profile-to-guide links, and visible correction contact. Do not invent firsthand experience.
- [ ] **DC-05 — Publication/indexing quality gate.** Draft/published/hidden/closed states; sitemap includes only published canonical pages that meet the page-type completeness rules. Page rendering, metadata, structured data, internal links, and sitemap must share the same canonical source of truth.
- [ ] **DC-06 — Technical SEO verification.** Check route status, canonical tags, title/description, sitemap/robots, redirects, server-rendered main content, and internal links. Add repeatable automated checks; verify live deployment separately from source code.
- [ ] **DC-07 — Trust, newsletter, and learning loop.** Publish sourcing/correction/sponsorship policy; implement a working newsletter signup; track useful actions, business corrections/responses, research effort, and sponsorship interest.

### P1 — Build after the core slice works

- [ ] **DC-08 — Lightweight editorial operations.** Draft/review/publish workflow, source ledger, due-for-review list, correction queue, audit trail, and preview. No complex merchant dashboard.
- [ ] **DC-09 — Occasion/constraint retrieval.** Deterministic filters for pre-show, post-show/late-night, budget, venue proximity, and data freshness; every result must explain its fit with source-backed facts.
- [ ] **DC-10 — Entity graph and contextual internal links.** Canonical relationships between restaurants, guides, venues, and Deep Ellum; prevent orphaned public profiles.
- [ ] **DC-11 — Merchant correction loop.** Low-friction corrections and business response tracking; free accuracy corrections remain separate from paid placements.
- [ ] **DC-12 — One-time newsletter sponsorship experiment.** Only when audience and deliverable can be honestly described; label sponsorship and track delivery and repeat willingness to pay.

### P2 — Explicitly deferred until evidence supports it

- [ ] **DC-13 — Replicate the model into another neighborhood.**
- [ ] **DC-14 — Events and itinerary planning with dependable official-source freshness.**
- [ ] **DC-15 — Merchant software, memberships, marketplace, rewards, or broad DFW directory.**

## Execution sequence and gates

1. **Gate A — Product identity:** DC-01; inventory every route and visible link. No public release while consumer pages contradict the vision.
2. **Gate B — Safe foundation:** DC-02; document schema/RLS findings before migrations.
3. **Gate C — Canonical content:** DC-03; migration reviewed against existing schema/data; no duplicate slugs or untraceable published facts.
4. **Gate D — Vertical slice:** DC-04 and DC-05; guide and profiles server-render correctly, with accurate metadata and sitemap eligibility.
5. **Gate E — Verification:** DC-06; build/type/lint checks plus route, link, canonical, sitemap, and security checks. Live HTTP checks are separately recorded.
6. **Gate F — Learn:** DC-07; collect audience and merchant evidence before investing in P1/P2.

## Definition of done for every issue

- Acceptance criteria are written before implementation.
- Change stays on a feature branch and is linked to a PR.
- Existing data/schema and security assumptions are checked before migration.
- Build/type/lint/tests are run where available; unrun checks are explicitly reported.
- Public claims and structured data are supported by visible, source-backed content.
- No change is described as deployed or verified unless the corresponding check actually ran.

## Current known blockers

- Homepage and About currently contain PHP-modernization positioning that conflicts with the approved Deep Ellum discovery vision.
- Homepage links reference routes not found in the inspected App Router source tree; verify full route inventory before release.
- Existing business model lacks a public stable slug and explicit publication state in the inspected TypeScript types.
- The API POST handler inserts request JSON into `businesses`; inspect actual Supabase RLS and schema before determining exploitability or choosing a fix.
- No local build/typecheck or live crawl has been run in this workflow so far.
