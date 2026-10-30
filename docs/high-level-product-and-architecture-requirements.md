# DallasCircle — High-Level Product & Internet Architecture Requirements

**Status:** Active implementation requirements; subordinate to the strategic baseline  
**Strategic baseline:** [`docs/vision-and-strategic-direction.md`](./vision-and-strategic-direction.md)  
**Mandatory pre-execution review:** [`docs/architecture-and-product-review-gate.md`](./architecture-and-product-review-gate.md)  
**Execution sequence:** [`docs/roadmap-and-discoverability-operating-plan.md`](./roadmap-and-discoverability-operating-plan.md)  
**Original vision source:** *DallasCircle.com — Vision, Business Strategy & Execution Plan*, dated 22 October 2026  
**Repository:** `blockrao/dcircle`  
**Initial launch wedge:** Deep Ellum nightlife and night-out planning  
**Long-term product:** Editorial-led local discovery across Dallas localities and a broad range of topics  
**Operating model:** Remote-first, editorial-led digital product

---

## 1. Executive direction

The strategic baseline is now explicit: DallasCircle is a custom SEO-first local-discovery product built on proven foundations. Search discoverability is paramount, but the intended advantage comes from canonical local entities, fact-level provenance, freshness controls, useful occasion-based recommendations, editorial integrity, and crawlable connected architecture—not from schema tricks, page count, or wholesale adoption of a starter repository. Keep Next.js App Router, TypeScript, Tailwind CSS, and Supabase/PostgreSQL as the current foundation. Do not lock hosting until runtime/SEO verification and security gates are addressed. Any change to this direction requires a written product and architecture rationale.

DallasCircle should not launch as a generic directory that competes on listing volume alone. The intended long-term experience is a broad, editorial-led local guide with topic breadth and locality-aware browsing, inspired by DailyDFW's scannable information architecture but using DallasCircle's own visual identity. Its first complete wedge is to help people plan a real evening in Deep Ellum with reliable facts and occasion-based answers. The UI and locality model should support future expansion without publishing empty locality/topic pages.

The technical advantage should be a **trustworthy, structured, freshness-aware local knowledge system** underneath a genuinely useful editorial product. The same source-backed records should support the website, guides, search metadata, structured data, newsletter production, corrections, and eventually merchant tools. Do not create separate inconsistent copies of business facts in page code, articles, spreadsheets, and marketing tools.

The vision document is explicit that the first milestone is a credible, useful Deep Ellum product—not a large platform. Build the minimum architecture that makes the initial product reliable and creates a clean path to later expansion. Defer complex platform features until audience behavior and willingness to pay justify them.

## 2. Mandatory pre-execution product and architecture review

Before a material product, code, content, SEO, database, security, infrastructure, or release step is executed, the lead internet architect/product manager must vet it against the strategy, exceptional discoverability goals, user outcome, evidence quality, canonical entity integrity, publication rules, security/privacy, performance, maintainability, cost, and rollback risk. The review must establish the recommended approach, alternatives where relevant, acceptance criteria, verification plan, and whether explicit user approval is required. This is a required gate, not an optional review after implementation. Follow [`docs/architecture-and-product-review-gate.md`](./architecture-and-product-review-gate.md). Safe and reversible work may proceed after review; production cutovers, destructive migrations, high-impact permission changes, material costs, and irreversible actions require the appropriate explicit approval.

## 3. Product principles and hard constraints

1. **Build for breadth, launch with depth:** design topic/locality navigation for the long-term product, but prove quality with Deep Ellum and the night-out use case first.
2. **Usefulness over page count:** A small set of high-quality, complete pages beats thousands of thin programmatic pages.
3. **Evidence before claims:** Important facts need a source and a checked date; never invent firsthand visits, reviews, quotes, popularity, or local experience.
4. **Freshness is a product feature:** Hours, late-night kitchen availability, menus, prices, event times, booking links, and venue relationships can change.
5. **Editorial independence:** Free editorial inclusion is not payment for favorable coverage. Sponsored placements must be clearly labelled and separated from editorial decisions.
6. **Remote-first operation:** The product and workflows must work without requiring a physical Dallas presence.
7. **Merchant-first commercial learning, not merchant-first editorial bias:** Build useful coverage and notify relevant businesses; test paid distribution only when the audience and deliverable can be described honestly.
8. **One canonical data source:** Business and venue facts should live in structured records, not hard-coded page content.
9. **Search is an acquisition channel, not the product itself:** Optimize for real user decisions; do not promise rankings or AI citations.
10. **Expand coverage in measured waves:** the product is intended to cover Dallas localities and many local topics, but indexable pages require meaningful, source-backed inventory and repeatable freshness operations. Merchant software, rewards, apps, and marketplaces require separate evidence.

## 4. Users and jobs to be done

### Primary consumer

A person planning an evening in or around Deep Ellum who needs a practical decision, not another unfiltered list.

Jobs:
- Find somewhere to eat before a show.
- Find food still serving after 10 p.m. or after an event.
- Plan a date night under a defined budget per person.
- Find suitable options near a named venue.
- Combine dinner, a show, and a post-event option into a feasible plan.
- Confirm key details and move to the official restaurant, venue, menu, booking, or directions page.

### Secondary user: local business

A restaurant or venue owner/manager who wants accurate representation, a way to correct facts, relevant exposure, and eventually measurable commercial opportunities.

Jobs:
- Understand why the business is included.
- Request a correction or claim management of its profile.
- Provide authoritative current information.
- Receive clear, transparent information about paid sponsorship options.
- Understand what was delivered for a paid placement without being promised unsupported outcomes.

### Internal operator/editor

A remote researcher/editor who needs to create trustworthy pages efficiently, record sources, revisit stale facts, correct errors, publish guides, and measure audience and merchant response.

## 5. Canonical merchant and founder profiles

Every eligible published merchant must have one stable, permanent canonical profile URL backed by one canonical entity record. All guides, articles, locality/topic pages, collections, and ranked lists must reference that same merchant identity and URL. Merchant categories and locality memberships are structured relationships used for browsing and filters; filter variants must not create duplicate merchant profiles. Stable entity IDs, source-backed facts, freshness, corrections, publication state, and structured data must be generated from the same canonical source. Slug changes require permanent redirects and consistent internal links, canonicals, and sitemap updates.

Use the most specific truthful Schema.org LocalBusiness subtype and a stable entity `@id`, with JSON-LD matching visible, verified page content. Follow [Google's Local Business structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business) and canonicalization guidance. Do not invent ratings, reviews, founder claims, hours, prices, coordinates, or other unsupported fields.

Founder profiles are a distinct, optional canonical Person entity. Publish only with explicit opt-in from the founder or an authorized representative, verified identity and founder/co-founder relationship, recorded consent for biography/photo use, and a meaningful editorial profile. Founder, current owner, promoter, CEO, and operator are distinct roles. Link a founder to one or more merchant entities with explicit relationship roles and evidence. Participation does not buy favorable coverage or inclusion. Full rules and acceptance criteria: `docs/canonical-merchant-and-founder-architecture.md`.

## 6. Differentiation: where the technical advantage comes from

The advantage is not a particular framework, a schema markup trick, or an AI-generated page count. It comes from compounding data quality and decision usefulness.

### 6.1 Source-backed fact ledger

Store critical facts as facts with provenance, not merely fields with values. Each fact should be traceable to a source URL or source record, source type, checked timestamp, verification method, confidence/status, and next review date where relevant. The system must distinguish “not known” from “false” and “not checked recently” from “verified.”

Examples:
- Restaurant hours versus kitchen closing time.
- Late-night service on a specific weekday.
- Price range or explicit budget fit.
- Distance/walking time to a venue, with a documented calculation method.
- Menu or booking URL.
- Event date and event venue.

### 6.2 Occasion and constraint model

Support structured attributes that answer user intent, such as:
- occasion: pre-show, post-show, date night, group dinner;
- time: open at a target time, kitchen serving after 10 p.m.;
- budget: stated range and what it represents;
- proximity: venue relationship and walking-distance band;
- practical fit: quick meal, reservation recommended, dietary information only when source-backed.

Do not infer suitability from vibes or unsupported copy. Each recommendation should explain why it fits the request using facts and editorial judgment that can be defended.

### 6.3 Canonical local entity graph

Model places, venues, events (later), guides, neighborhoods, and sources as linked entities. A guide should reference canonical business IDs; business pages should link to relevant guides and nearby venues; venue pages can eventually link to practical dining options. Avoid duplicate business records and inconsistent spellings across content.

### 6.4 Freshness and correction workflow

Make stale facts visible to operators. Provide a lightweight correction path for businesses and readers. Log corrections, source changes, timestamps, and review outcomes. Time-sensitive fields need shorter review intervals than stable facts. Do not silently display old hours as current facts indefinitely.

### 6.5 Editorial utility

Create content that solves a decision: “where to eat before a show at [venue],” not generic “best restaurants in Dallas” filler. Each guide needs a clear purpose, meaningful selection criteria, useful comparisons, source attribution, last-checked context for volatile facts, and official next-step links.

---

## 7. Prioritized requirements

Priority definitions:
- **P0 — Foundation / launch blocker:** required for a trustworthy initial product.
- **P1 — Early advantage:** implement after core pages and publishing work reliably.
- **P2 — Conditional expansion:** only after evidence supports further investment.

### P0-A. Product identity and information architecture

- The homepage must consistently express the approved positioning and initial geography.
- Navigation must lead to real, functioning pages. No placeholder or sample feed links may be published as real articles.
- The initial information architecture must support the core guide, individual place profiles, About/trust statement, newsletter signup, and correction/contact route, while establishing reusable topic navigation and locality browsing for future breadth. See `docs/ui-and-locality-coverage-principles.md`.
- Each public page must have a single primary purpose and clear next action.
- Mobile experience, accessibility, performance, and simple navigation are launch requirements.

**Acceptance:** DallasCircle presents a coherent Dallas hyperlocal discovery experience. Every visible link leads to a real, relevant local-discovery route.

### P0-B. Canonical data model

Define the minimum entities:
- **Business/place:** stable internal ID, stable public slug, display name, category, address/locality, coordinates if verified, official website, phone where public, status, created/updated timestamps.
- **Fact/source:** entity ID, field/key, value, source URL/type, observed/checked time, verification status/method, confidence or review state, editor/automation provenance, next review date.
- **Guide/article:** stable slug, title, summary, body, author/editor, publish/update times, publication status, sources, linked business IDs, sponsorship disclosures.
- **Venue:** stable ID/slug, official website, address/location, event relevance, source-backed relationships to businesses.
- **Correction/review task:** target entity/fact, issue, reporter, status, resolution, timestamps.
- **Commercial placement:** sponsor, placement type, issue/guide, dates, disclosure, price, delivery evidence; separate from editorial inclusion decisions.

Do not require every optional field before a profile can exist. Instead, define explicit publication-quality thresholds by page type.

**Acceptance:** No duplicate public business slugs; no page relies on a mutable display name as its only identity; each published factual claim can be traced to its source record or clearly marked editorial interpretation.

### P0-C. Publication and indexing quality gate

Each page/entity needs an explicit state such as draft, needs-review, published, hidden, duplicate, closed, or archived. Publication status is separate from merchant-claimed status and from factual verification.

A page may enter the sitemap and be indexable only if:
- it returns HTTP 200;
- it has a unique, stable canonical URL;
- it contains meaningful, source-backed information;
- it passes its page-type completeness threshold;
- it is not a duplicate, thin search state, draft, or hidden record;
- its primary content is server-rendered and available without client interaction;
- its title, description, and internal links are present.

**Acceptance:** Sitemap generation uses the same publication/canonical rules as page rendering. No sitemap entry is emitted solely because a database row exists.

### P0-D. Core editorial product

Deliver:
- A useful Deep Ellum night-out landing page.
- Core occasion guides: pre-show dining, late-night food, and date night within a defined budget.
- The first 15 individually researched restaurant profiles.
- A visible About/trust statement describing research methods, sourcing limitations, corrections, and sponsorship policy.
- A working newsletter signup and a repeatable weekly publishing workflow.

Every profile and guide should answer “why is this useful for the specific Deep Ellum use case?” It should not imitate a firsthand review. Use official websites, menus, venue pages, and other reliable public sources; attribute facts and date-check volatile details.

**Acceptance:** The initial editorial checklist is complete; all 15 profiles meet the same standard; correction and update ownership is clear; the newsletter can be produced without manually re-creating the underlying business facts.

### P0-E. Technical SEO and crawlability

- Establish one canonical host and HTTPS policy.
- Implement metadata defaults and page-specific titles/descriptions.
- Emit self-referencing canonicals for indexable pages.
- Generate `robots.txt` and a sitemap containing only published canonical pages.
- Use ordinary crawlable links for important navigation and related entities.
- Ensure meaningful primary content is rendered in the server response.
- Implement redirect mapping and 301 redirects for any changed public URLs.
- Check status codes, redirect chains, canonical targets, sitemap coverage, orphan pages, and internal broken links in CI or scheduled audits.
- Use structured data only where it accurately represents the visible page and the entity represented. A directory must not impersonate a restaurant.
- Avoid creating indexable pages for every filter, parameter, neighborhood/category combination, or keyword variant.

**Acceptance:** Automated checks verify HTTP status, canonical consistency, sitemap eligibility, required metadata, and internal-link integrity on a representative set of pages. Search-engine eligibility is not represented as a guarantee of ranking or indexing.

### P0-F. Analytics and evidence tracker

Measure:
- Search impressions/clicks and landing pages.
- Guide-to-profile clicks and official outbound clicks.
- Newsletter signup conversion and subscriber growth.
- Returning visitors where consent and analytics configuration allow.
- Business notifications, responses, corrections, and opt-ins.
- Sponsorship inquiries, paid conversion, delivery evidence, and repeat purchase.
- Time/cost to research and maintain each profile/guide.

**Acceptance:** The team can distinguish attention from useful action, and compliments from actual commercial demand. Phase 1 success is defined by a credible usable product and completed learning loop, not an arbitrary traffic promise.

### P1-A. Local intent retrieval

Build lightweight filtering over the structured data for:
- time and kitchen availability;
- occasion and budget;
- proximity to selected venues;
- profile completeness/freshness;
- explicit editorial inclusion criteria.

Start with PostgreSQL queries and simple deterministic ranking. Do not introduce a separate search service until observed data volume or latency justifies it.

**Acceptance:** For a small benchmark set of real user questions, results are explainable and each recommendation can show the facts that caused it to qualify.

### P1-B. Internal entity graph and contextual links

Build reusable relations among:
- restaurant ↔ venue;
- restaurant ↔ guide;
- guide ↔ occasion;
- place ↔ neighborhood;
- event ↔ venue (when events become part of the validated product).

Generate useful related links from these relationships, not from arbitrary keyword matching. Provide breadcrumbs and clear links between guides and profiles.

**Acceptance:** No important published profile is orphaned; links are relevant and lead to canonical pages.

### P1-C. Operational freshness and trust tooling

Add a simple editorial workspace or admin workflow to:
- see facts due for re-check;
- record source links and dates;
- flag conflicts between sources;
- process corrections;
- mark businesses closed or temporarily unavailable;
- review page completeness and stale content.

**Acceptance:** An operator can identify and update stale high-risk facts without searching through source code or editing duplicated copies.

### P1-D. Search/AI retrieval readiness

Optimize for clear, extractable, attributable information:
- descriptive headings and concise answers to specific planning questions;
- entity names, locations, relevant attributes, and source context in visible HTML;
- accurate metadata and supported structured data;
- consistent entity references across profiles and guides;
- clear authorship/editorial standards and correction policy;
- crawlable links and valid status/canonical behavior.

Treat search engines and AI answer systems as external consumers of public information. Do not assume special markup guarantees citation or visibility, and do not publish content merely to target a chatbot.

### P1-E. Merchant correction and relationship loop

Start with a low-friction contact/correction workflow, not a full merchant dashboard. Track profile notification, response, corrections, and permission to use supplied media. Keep merchant-claimed status distinct from independent verification.

**Acceptance:** A business can request an accurate correction without buying anything; commercial status never changes editorial facts or guarantees inclusion.

### P1-F. Newsletter sponsorship experiment

Support a clearly labelled, one-time sponsorship with a defined deliverable and transparent reporting. The vision document proposes testing one-time newsletter sponsorships only when audience and deliverables can be described honestly. Record delivery and actual willingness to pay; do not promise outcomes that have not been measured.

**Acceptance:** Paid placement is visibly disclosed; editorial inclusion remains independent; delivery is documented; the team records whether the business would pay again.

### P2-A. Replicable neighborhood model

Only after Deep Ellum shows useful audience behavior, manageable maintenance cost, and a repeatable editorial/commercial process, add another neighborhood using the same data, publication, and quality rules.

### P2-B. Events and itinerary planning

Add events and multi-stop night plans only when official source availability and maintenance workflows can keep event dates, venue details, and practical timing accurate.

### P2-C. Merchant software and broader platform

Consider lightweight business correction tools, paid recurring merchant products, additional local categories, or a broader marketplace only after repeat use and willingness to pay demonstrate a real need. These are not launch blockers.

---

## 8. Technical architecture principles

Use the current repository's Next.js/TypeScript and Supabase/PostgreSQL direction as a pragmatic starting point, subject to compatibility and security validation.

### Application layer
- Server-render public content by default; use client components only for interaction that needs them.
- Keep route rendering, data access, and editorial logic separated into maintainable modules.
- Use a single shared page-data contract for visible content, metadata, structured data, and sitemap eligibility.
- Add automated route, metadata, and link tests.

### Data layer
- PostgreSQL is the source of truth for canonical business/place and editorial records.
- Use stable IDs and unique slugs; model provenance and status explicitly.
- Use database constraints for uniqueness and referential integrity.
- Use row-level security and least-privilege access; public reads must be intentionally scoped, and public write paths must not trust submitted JSON.
- Keep secrets out of client bundles; the public Supabase anon key is not a substitute for RLS.
- Consider PostGIS or geospatial indexes when real proximity queries need them, not as a premature dependency.

### Content operations
- Separate editorial body content from normalized entity facts while linking both to canonical IDs.
- Store source references and correction history.
- Avoid hard-coded sample feeds in production.
- Keep content publishing, indexability, and sponsorship status as separate concepts.

### Reliability and cost
- Avoid unnecessary API requests and duplicated page-data fetches.
- Cache only where freshness rules allow; stale opening hours and event details need explicit handling.
- Monitor errors, build failures, crawl errors, and query performance.
- Prefer a modular monolith until independent scaling or team ownership makes service separation worthwhile.

---

## 9. Explicit non-goals for the first release

Do not build these before the initial product demonstrates demand:
- mass-generating thin or empty locality/topic pages to simulate coverage;
- hundreds of thin programmatic SEO pages;
- an app, rewards system, loyalty program, or marketplace;
- a complex merchant dashboard;
- an independent search engine or vector database;
- a broad event database without reliable sources and freshness operations;
- automated reviews, fabricated popularity signals, or unverified AI-written descriptions;
- guarantees of rankings, traffic, AI citations, revenue, or performance outcomes.

## 10. Phase gates and definition of done

### Gate 1 — Credible product
- Positioning is consistent.
- Core site pages work on mobile.
- Core guide and three occasion guides are published.
- First 15 profiles are researched and source-backed.
- Trust statement, newsletter signup, correction path, analytics, and evidence tracker work.
- No knowingly broken internal links or unsupported first-person claims.

### Gate 2 — Audience evidence
- Distribution experiments are attempted and recorded.
- Search and audience behavior can be reviewed.
- Newsletter signups and engagement are measured.
- User feedback informs the next editorial iteration.

### Gate 3 — Commercial evidence
- Relevant businesses have been notified and responses tracked.
- A clearly defined, labelled sponsorship offer is tested when it can be honestly delivered.
- Actual payment, delivery effort, and repeat intent are recorded.

### Gate 4 — Repeatability
- Editorial and fact-maintenance workflows are repeatable.
- The first neighborhood's audience and commercial signals justify continued investment.
- Only then decide whether to add another neighborhood or product capability.

Phase 1 does not require a predetermined traffic number or revenue outcome. The objective is to create a credible product and make an evidence-based decision about the next investment.

## 11. Immediate engineering sequence

1. Align the editorial homepage, topic navigation, locality discovery, and initial Deep Ellum content with the approved product direction.
2. Audit existing routes and remove or repair links to non-existent article/category/search destinations.
3. Define the canonical business, fact/source, guide, venue, correction, and publication-state model.
4. Implement the first public restaurant profile route and the initial guide templates.
5. Add server-rendered page data, page-specific metadata, canonical URLs, and publication-gated sitemap entries.
6. Add a source/freshness editorial workflow and the correction path.
7. Instrument the funnel and newsletter.
8. Run typecheck/build, route tests, sitemap/robots tests, and a live crawl before merge/deployment.
9. Publish the first 15 profiles and the three core guides only after editorial verification.
10. Review evidence before building further platform features.

## 12. Architectural success metric

The long-term technical moat is a compounding, trusted local dataset and editorial workflow that can answer a specific local decision better than a generic list. Measure it by:
- source coverage and freshness of critical facts;
- low correction/error rates;
- proportion of published pages that meet quality gates;
- useful guide/profile/outbound interactions;
- repeat audience behavior and newsletter engagement;
- editorial maintenance cost per useful page;
- actual sponsor delivery and repeat purchase.

Do not measure success by URL count, schema count, AI-generated word count, or the number of technologies adopted.
