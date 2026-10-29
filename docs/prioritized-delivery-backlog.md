# DallasCircle — Prioritized Delivery Backlog

**Baseline:** Strategy & Product Definition dated 23 October 2026; authoritative strategic baseline in `docs/vision-and-strategic-direction.md`; execution sequence in `docs/roadmap-and-discoverability-operating-plan.md`.  
**Working branch:** `seo/technical-foundation`  
**Product boundary:** DallasCircle is an editorial-led local discovery platform for Dallas localities and a broad range of local topics. Deep Ellum is the first complete launch area, not the permanent geographic boundary. No technical consulting, software modernization, or agency services belong in the product.  
**Delivery principle:** one small, verifiable vertical slice at a time. Do not merge or deploy until build, route, security, and SEO checks have been run.

## P0 — Foundation gates

**Execution order:** close current local verification and Supabase permission release blockers first; then complete the canonical entity/publication contracts and first integrated discovery journey. Do not deploy or merge merely because the build passes. See the [Roadmap & Discoverability Operating Plan](./roadmap-and-discoverability-operating-plan.md) for phase exit criteria, measurement, and decision discipline.

- [ ] **DC-00A — Canonical merchant profile contract.** Define the permanent merchant URL, stable entity ID/`@id`, source-backed fact model, categories/locality relationships, profile completeness/publication gate, redirects on slug changes, JSON-LD contract, and shared linking contract for all articles/guides/collections. Every eligible published merchant must have one canonical profile; no duplicate profile variants.
- [ ] **DC-00B — Optional founder profile and consent workflow.** Model founders as separate Person entities with explicit verified founder/co-founder relationships to merchant entities. Publish only when the person or authorized representative opts in, identity/role and supplied claims are verified, consent for bio/photo use is recorded, and editorial publication criteria are met. Keep founder, owner, promoter, CEO, and operator roles distinct.

- [ ] **DC-00 — Align the product experience and locality information architecture.** Shape the homepage as an editorial local guide inspired by DailyDFW's breadth and scannability, with DallasCircle's own visual identity. Define global topic navigation, locality browsing, locality/topic page hierarchy, mobile behavior, and a coverage matrix. Build reusable UI components, but publish/index only localities and topics that meet meaningful coverage thresholds.

- [ ] **DC-01 — Complete product identity and route cleanup.** Align homepage, metadata, navigation, About, FAQ, and sitemap with the Deep Ellum local-discovery proposition. Remove legacy service pages, components, endpoints, lead capture, unsupported claims, and orphaned links. Keep only redirects needed to retire old inbound URLs safely. Initial cleanup is committed; full source/link and live-route validation remains outstanding.
- [ ] **DC-02 — Audit the real Supabase schema, RLS, grants, and existing data.** Inspect tables, policies, grants, constraints, and public access with the actual project. Do not claim a deployed vulnerability until verified. Do not restore public data APIs or add migrations before this audit.
- [x] **DC-03 — Establish canonical place and source-backed fact model.** Implemented in the live database and `supabase/migrations/`: stable IDs/slugs, publication state, source provenance, checked time, verification state, review-due dates, source/place integrity, sponsorship disclosure, publication guards, and normalized `categories` / `place_categories` with one primary category per published place. Added a narrow app-facing type contract. Database RLS/grant and publication-gate checks passed; the `supabase_admin` default-privilege issue remains under DC-02.
- [ ] **DC-04 — Implement the first server-rendered editorial vertical slice.** The branch now includes server-rendered guide/place routes and a published first guide with three source-backed profiles, official-source links, review-due context for volatile facts, profile-to-guide links, and visible correction contact. Build passes; route-level and deployed HTTP verification remain before this gate can close. Never imply firsthand experience that did not occur.
- [ ] **DC-05 — Publication/indexing quality gate.** Draft/published/hidden/closed states; sitemap includes only published canonical pages that meet completeness rules. Rendering, metadata, structured data, internal links, and sitemap must share the same canonical source of truth.
- [ ] **DC-06 — Technical SEO verification.** Added `npm run check:live` (`scripts/verify-live-routes.mjs`) to check route status, canonical tags, JSON-LD, correction/source context, sitemap inclusion, and the retired-path redirect. Run it against the deployed preview after deployment; add broader internal-link and robots checks as needed.
- [ ] **DC-07 — Trust, newsletter, and learning loop.** Publish sourcing/correction/sponsorship policy; implement a working newsletter signup only with appropriate consent and reliable handling; track useful actions, business corrections/responses, research effort, and sponsorship interest.
- [ ] **DC-07A — Offer lifecycle and pilot measurement contract.** Before a deal-led pilot, define offer states (draft, review, scheduled, active, expired, withdrawn, archived), source/merchant authority, validity window, eligibility and redemption terms, quality review, expired-feed exclusion, and measurable next actions. Set pilot success/stop/change thresholds before interpreting results; do not force artificial merchant posting cadence.

## P1 — After the first complete vertical slice

- [ ] **DC-08 — Lightweight editorial operations.** Draft/review/publish workflow, source ledger, due-for-review list, correction queue, audit trail, and preview. No complex merchant dashboard.
- [ ] **DC-09 — Occasion/constraint retrieval.** Deterministic filters for pre-show, post-show/late-night, budget, venue proximity, and data freshness; every result must explain its fit with source-backed facts.
- [ ] **DC-10 — Entity graph and contextual internal links.** Canonical relationships between merchant profiles, founders (where opted in), guides, articles, venues, topics, collections, and Dallas localities; prevent orphaned public profiles. All contextual references resolve to the same canonical merchant URL.
- [ ] **DC-11 — Business correction loop.** Low-friction corrections and response tracking; factual corrections remain free and separate from paid placements.
- [ ] **DC-12 — One-time newsletter sponsorship experiment.** Only when audience and deliverable can be honestly described; label sponsorship and track delivery and repeat willingness to pay.

## P2 — Deferred until evidence supports it

- [ ] **DC-13 — Expand locality and topic coverage in controlled waves.** Add additional Dallas neighborhoods/localities and topic hubs based on the coverage matrix, verified inventory, audience demand, and editorial maintenance capacity. Do not mass-generate empty locality/topic pages.
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
- Public write/API endpoints remain disconnected. The new server-rendered place and guide pages use a read-only anonymous Supabase client constrained by RLS and explicit grants. Initial live audit found 14 empty legacy tables with RLS enabled but no policies; current anon/authenticated grants and postgres-owned defaults were hardened. The historical baseline has been restored from the live migration record. The `supabase_admin` default ACL remains broad, but the live DDL event trigger now applies fail-closed RLS/grant hardening to newly created public objects; its rollback test passed. An authorized superuser/role-owner fix for the underlying ACL remains desirable. See `docs/supabase-security-audit.md`.
- Place and guide routes now exist on the branch. Supabase contains three published place profiles and one published guide, each with official source records; live-domain verification and deployment remain outstanding. Categories are normalized. The homepage and locality/topic navigation architecture should be designed for future breadth, but category/locality landing pages must wait until there is enough useful, verified inventory to support them. Canonical merchant profiles are a core platform contract; optional founder profiles require opt-in and verified relationships.
- GitHub Actions passed locked dependency installation, lint, and production build on implementation head `d763f7163eaea91a7bb8f5ccbc1f1e1878e724df` ([run](https://github.com/blockrao/dcircle/actions/runs/40721850685)). Full route/link tests and deployed HTTP crawl remain outstanding.
