# DallasCircle — Roadmap & Discoverability Operating Plan

**Status:** Active execution plan  
**Decision date:** 29 October 2026  
**Owner:** Product and architecture direction led by the project's lead internet architect / product manager  
**Branch:** `seo/technical-foundation`  
**Authority:** Subordinate to `vision-and-strategic-direction.md`; operationalizes the strategy/product definition dated 23 October 2026.

## 1. Executive decision

DallasCircle will be designed as a broad, editorial-led local discovery platform, with a focused first release around Deep Ellum night-out planning. The strategy document's deal-led proposition is retained as a **hypothesis for recurring consumer use**, not as a permanent restriction on product identity. Deals are useful only when current, clearly described, genuinely worthwhile, and connected to a trusted merchant entity. The durable platform is a source-backed local knowledge system connecting merchants/locations, localities, topics, guides, collections, offers, and (optionally) consented founder profiles.

The objective is to earn an advantage through compounding quality—not a promise of guaranteed Google rankings or LLM citations. The advantage should come from:
- Canonical entities with stable identifiers and one public profile per eligible merchant/location.
- Fact-level provenance, verification state, freshness, correction history, and source attribution.
- Useful editorial answers to specific local decisions and occasions.
- Crawlable server-rendered pages, coherent internal links, accurate metadata, canonicalization, structured data, sitemap eligibility, and automated checks.
- Broad planned locality/topic coverage, published only when each page has enough distinctive verified value.
- A repeatable remote editorial/merchant workflow that keeps facts current without uneconomic effort.

## 2. Product hierarchy: wedge versus platform

### First wedge
Help someone make a practical decision for a night out in Deep Ellum: where to eat before a show, find food after an event, plan a date night within a budget, or choose a relevant option near a venue. Start with a small, source-backed set of guides and place profiles.

### Durable foundation
The same canonical records support profile pages, guide recommendations, topic and locality browsing, offer pages, source/freshness operations, metadata, structured data, analytics, and future merchant workflows. Do not create duplicate business facts in article text, route code, and separate listings.

### Long-term platform
Expand into broader local topics and localities—such as food and drink, arts and culture, events, family activities, shopping, outdoors, and practical local information—as inventory and editorial capacity support them. The UI and data model should accommodate breadth from the beginning, but breadth in the taxonomy does not justify publishing empty pages.

## 3. Roadmap and phase gates

### Phase 0 — Prove the current foundation (active; release blocker)
1. Reconcile local Git state safely; do not discard uncommitted work.
2. Run current branch install, lint/type checks, and production build.
3. Run the live-route verifier against a local server and fix actual failures: HTTP status, canonical URLs, title/description uniqueness, JSON-LD parity, robots, sitemap eligibility, internal links, redirects, source/correction context.
4. Verify the supported Supabase permission posture: confirm the `supabase_admin` default ACL is platform-managed and not changeable through the project `postgres` role; verify the enabled fail-closed DDL trigger, `postgres` defaults, canonical-table RLS/policies, and actual anonymous grants. Current catalog checks passed on 29 October 2026. Keep the ACL limitation documented, recheck after platform/schema changes, and do not treat an unsupported role-owner/superuser change as a required release task.
5. Keep the legacy-table retirement migration staged until route/form/dependency checks and release gates pass.
6. Do not deploy or merge based solely on a successful build.

**Exit criteria:** reproducible local checks pass; failures are fixed or explicitly recorded; security blocker is resolved or formally accepted; PR evidence distinguishes local, CI, preview, and production results.

### Phase 1 — Canonical content and publication integrity
1. Lock canonical merchant/location URL conventions after auditing existing routes.
2. Use stable internal entity IDs and stable structured-data `@id` values.
3. Ensure guide/article/collection/locality/topic pages reference canonical entity IDs and resolve them to one canonical profile URL.
4. Maintain fact/source provenance, freshness/review-due state, correction workflow, and clear separation of verified facts, merchant-supplied claims, editorial judgement, and sponsorship.
5. Share publication eligibility logic across page rendering, internal linking, metadata/robots, structured data, and sitemap generation.
6. Add tests for duplicate URLs, slug redirects, orphan entities, invalid/unsupported schema fields, and withdrawn/unreviewed records.

**Exit criteria:** one source of truth for each published entity; every public factual profile meets completeness/evidence gates; no duplicate merchant profile variants; automated checks protect the contract.

### Phase 2 — Integrated discovery MVP
1. Align the homepage with editorial entry points, topic navigation, and locality discovery.
2. Deliver the first useful Deep Ellum night-out landing page and core occasion guides.
3. Connect guides to canonical place profiles and profiles back to relevant guides, venues, and locality/topic contexts.
4. Provide a clear source/correction/sponsorship policy and useful empty states.
5. Instrument guide-to-profile clicks, official outbound actions, newsletter opt-ins, and key discovery interactions.
6. Keep the web experience responsive, accessible, fast, server-rendered, and usable without client-side-only content.

**Exit criteria:** a visitor can complete a practical local discovery journey; the core pages work on mobile; important pages are linked and crawlable; event data and offer claims are not fabricated.

### Phase 3 — Focused demand and offer pilot
1. Select the initial compact geography and two or three candidate categories based on merchant density, consumer use cases, access, and the ability to maintain facts.
2. Interview or observe real users about recent decisions; test with real offers and a small manually onboarded merchant cohort.
3. Track offer validity, clarity, expiry accuracy, meaningful actions, repeat visits, merchant response/repeat participation, and operating effort.
4. Treat social media as distribution to a useful owned destination, not as a substitute for the product.
5. Set success/stop/change thresholds before reviewing results. Do not retroactively invent targets.

**Exit criteria:** enough evidence to decide whether the offer-led loop deserves more investment, which categories work, what users actually do, and whether maintenance is operationally sustainable.

### Phase 4 — Differentiation and controlled expansion
1. Introduce optional founder profiles only with explicit opt-in, verified identity/role, approved materials, and correction/withdrawal handling.
2. Add locality/topic pages in waves only when each meets a meaningful coverage threshold.
3. Improve freshness operations and low-friction business correction handling before building a complex merchant dashboard.
4. Test monetization only when audience, deliverable, and outcomes can be described honestly; label sponsorship and preserve editorial independence.
5. Defer native app, loyalty, marketplace, broad DFW rollout, advanced personalization, and a separate search service until evidence warrants them.

**Exit criteria:** repeatable content/maintenance process, measurable user value, and evidence that the next locality/category/product investment is justified.

## 4. Non-negotiable discoverability requirements

- Every eligible merchant/location has one stable canonical entity record and one canonical public profile URL.
- Business/brand and physical branch are distinguished when needed.
- All guides, articles, collections, topic/locality pages, and lists link to canonical profiles rather than create context-specific copies.
- Use the most specific truthful Schema.org subtype; JSON-LD must agree with visible, sourced facts. Never fabricate ratings, reviews, hours, prices, coordinates, awards, founder relationships, or popularity.
- Primary content is accessible in the server-rendered HTML. Important navigation uses crawlable links.
- Titles, descriptions, canonicals, robots directives, redirects, structured data, internal links, and sitemap inclusion follow shared publication/canonical rules.
- Query/filter variants are not indexable by default; only genuinely useful, curated landing pages that pass quality thresholds are eligible.
- Page existence is not the same as indexability. Draft, thin, duplicate, withdrawn, unreviewed, and unsupported pages stay out of the public sitemap.
- AI-assisted discovery is served by useful, well-structured, attributable content and clear entity relationships—not hidden text, special “AI SEO” tricks, or guarantees of citations.
- Correctness, user value, trust, accessibility, security, performance, maintainability, and cost are considered alongside search visibility.

## 5. Measurement

### Technical and content integrity
- Share of published facts with traceable sources and review dates.
- Stale/expired fact exposure and correction/error rate.
- Page-type completeness and publication-gate pass rate.
- HTTP, canonical, sitemap, metadata, structured-data, broken-link, and redirect regression results.
- Important pages that are orphaned or lack relevant internal links.

### Audience usefulness
- Search impressions/clicks and landing pages (when Search Console is available).
- Guide-to-profile clicks, official outbound clicks, calls/directions/booking actions where supported.
- Returning visits and newsletter opt-in/engagement, measured with appropriate privacy/consent.
- User feedback on whether a discovery helped make a decision.

### Merchant and operating viability
- Merchant outreach/response and correction turnaround.
- Offer publication, current-valid-offer rate, and repeat merchant participation.
- Research/verification time and maintenance cost per useful page.
- Actual sponsorship conversion, delivery, and repeat willingness to pay.

Do not use raw URL count, schema count, AI-generated word count, or social follower count as stand-alone success metrics.

## 6. Immediate work queue

1. **First:** close the local verification and Supabase permission release gates; no deployment shortcut.
2. **Second:** reconcile route/data implementation with the canonical merchant contract and shared publication eligibility.
3. **Third:** run and record route/SEO checks, fix actual defects, and update the PR with verified evidence.
4. **Fourth:** complete the first integrated Deep Ellum discovery journey and core editorial inventory.
5. **Fifth:** instrument baseline behavior and run the focused user/merchant pilot.
6. **Later:** founder profiles, broader locality/topic expansion, monetization experiments, and advanced features.

## 7. Mandatory pre-execution review and decision discipline

Before any material step is implemented, apply [`docs/architecture-and-product-review-gate.md`](./architecture-and-product-review-gate.md). Review user outcome, strategy, discoverability, evidence, canonical/data integrity, security/privacy, operational qualities, alternatives, acceptance criteria, verification and rollback. Safe reversible work may proceed after review; high-risk, destructive, costly or externally consequential actions require the appropriate explicit user approval.



For each material change, record the problem, user benefit, options considered, evidence, decision, acceptance criteria, risk/rollback, and verification. Prefer small, reversible changes. Do not add infrastructure, dependencies, or new product surfaces without a clear need. Do not claim work is complete until the relevant evidence exists.

## 8. Reference standards

- [Google Search Central: Local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google Search Central: Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Google Search Central: Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)

These references are implementation guidance, not promises of rankings, indexing, rich results, traffic, or AI citations.
