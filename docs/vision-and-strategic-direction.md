# DallasCircle — Vision, Mission & Strategic Direction

**Status:** Active product and architecture decision baseline  
**Decision date:** 29 October 2026  
**Positioning:** **DallasCircle — local life, clearly discovered.**  
**Initial wedge:** Deep Ellum nightlife and night-out planning  
**Long-term scope:** A broad, locality-aware guide to places, topics, services, culture, events, and community information across Dallas and its localities  
**Operating model:** Remote-first, editorial-led digital product  
**Initial market:** Deep Ellum, Dallas, Texas; expansion is staged by verified coverage

This document records the strategic direction that all product, engineering, SEO, content, and infrastructure decisions must support. The long-form business strategy and product definition dated 23 October 2026 is a companion source artifact; this concise decision record is the repository's authoritative strategic baseline. The [Roadmap & Discoverability Operating Plan](./roadmap-and-discoverability-operating-plan.md) translates that strategy into phase gates, measurement, and immediate execution. Implementation requirements, delivery backlog, and audits must remain consistent with these records.

Related execution documents:
- [High-level product and architecture requirements](./high-level-product-and-architecture-requirements.md)
- [Prioritized delivery backlog](./prioritized-delivery-backlog.md)
- [SEO foundation audit](./seo-foundation-audit.md)
- [Route/data architecture audit](./route-data-architecture-audit.md)
- [Supabase security audit](./supabase-security-audit.md)

## 0. Project leadership mandate and decision rights

**Standing assistant role:** ChatGPT serves as DallasCircle's **lead internet architect and product manager** for this project. The role is to proactively lead product and technical decisions, challenge weak assumptions, maintain focus on the product mission, and guide implementation toward a scalable, secure, high-quality, SEO-first discovery platform. The user should not need to restate this role in each conversation within this project.

### Responsibilities

- Own the integrated product and architecture direction: translate the vision into prioritized requirements, decisions, acceptance criteria, and a sequenced execution plan.
- Treat organic discoverability as a core product and architecture requirement from initial design through launch and ongoing operations.
- Apply current, evidence-based best practices for Google Search and other relevant search engines, structured data, accessibility, performance, crawlability, canonicalization, information architecture, and trustworthy content.
- Design for discoverability by AI-assisted search and LLM-based discovery where technically appropriate, using accessible, well-structured, source-backed content and clear entity relationships. Do not promise rankings, indexing, citations, or special treatment by any search engine or model.
- Prefer official documentation and current primary sources when rules or recommendations may change; distinguish confirmed requirements from recommendations, hypotheses, and experiments.
- Keep canonical data, fact-level provenance, freshness, publication eligibility, internal linking, structured data, and sitemap generation consistent across the system.
- Review security, privacy, maintainability, reliability, performance, accessibility, operating cost, and migration risk alongside SEO. Do not sacrifice user trust or system integrity for short-term traffic tactics.
- Make recommendations and proceed with safe, reversible work without asking the user to re-approve the strategic direction each time. Ask for input when a decision requires a personal/business commitment, a material cost, an irreversible change, access or credentials, or a genuine product trade-off.
- Maintain a clear decision log, explicit acceptance criteria, measurable completion states, and honest reporting of what has and has not been implemented or verified.
- Prefer a focused execution path over repeated architecture debates. Avoid unnecessary rewrites, new services, repositories, databases, and dependencies unless evidence demonstrates a material benefit.

### Decision and quality standard

For each substantial change, consider: user value; search discoverability; source trust and freshness; crawl/render/index behavior; canonical entity integrity; accessibility and performance; security; maintainability; cost; reversibility; and how success will be measured. Use official search-engine guidance as the compliance baseline, not as a promise of ranking. Treat LLM discovery as an evolving ecosystem: prioritize accessible content, clear entities, reliable sources, crawl permissions, and user value instead of unsupported “AI SEO” tricks.

The assistant leads analysis, recommendations, planning, implementation support, and available connected-tool actions. It must not claim to have changed local files, run local tests, deployed production, or verified search-engine indexing unless that specific action or evidence is actually available and observed. The user retains control of credentials, approvals, financial commitments, and production cutover.

---

## 1. Vision

Become a trusted, easy-to-navigate guide to local life across Dallas and its distinct neighborhoods and localities. People should be able to discover what is happening, where to go, what matters locally, and how to make practical decisions—across a broad range of topics. Begin with a focused Deep Ellum night-out experience, but build the information architecture and visual language to expand responsibly into a city-wide, locality-aware editorial discovery platform.

## 2. Mission

Turn fragmented local information into useful, occasion-based recommendations that make planning an outing easier. Build a source-backed local knowledge system that helps people move from an intention—dinner before a show, food after 10 p.m., a date night within a budget—to a practical, explainable plan.

## 3. Product goal

Build a broad local discovery experience that feels like a useful local publication and guide, not a bare directory. Visitors should be able to browse a range of relevant local topics and switch context by neighborhood/locality. Earn repeat use and search visibility through useful editorial coverage, reliable local information, source transparency, and a strong browsing experience—not page volume alone. Deep Ellum is the first launch wedge and quality proving ground, not the permanent geographic limit.

## 4. The intended unfair advantage

DallasCircle's advantage must compound through a system competitors cannot reproduce simply by installing a template or generating many pages:

1. **Canonical local entities.** Every published merchant has one stable, permanent public profile URL and canonical record. Guides, articles, locality/topic pages, collections, and ranked lists reference that same merchant entity. Stable records also cover localities, venues, guides, founders (when consented), and, later when justified, events. Relationships are explicit and facts are not copied inconsistently across pages.
2. **Fact-level provenance.** Important claims have source records, verification method/status, checked timestamps, and review expectations. Unknown, stale, conflicting, and verified information are distinct states.
3. **Freshness operations.** Volatile details—especially kitchen hours, menus, prices, booking links and event information—have appropriate review cadences. Old data is never presented as newly verified.
4. **A validated recurring-use hook.** Deals and time-sensitive picks are a candidate reason for people to return, not the permanent limit of DallasCircle's identity. Test whether genuinely worthwhile, current offers drive repeat use and merchant participation; retain broader local editorial discovery as the durable platform. Do not force artificial merchant posting cadence or allow offer scarcity to hollow out the experience.
4. **Occasion-based discovery.** Content and future retrieval answer practical needs: pre-show dining, late-night food, date nights within a defined budget, and relevant options near a venue. Each recommendation should explain why it qualifies.
5. **Editorial integrity.** Inclusion is based on usefulness and evidence. Paid placements are disclosed and separated from editorial decisions. No fabricated reviews, firsthand claims, popularity, partnerships or unsupported local experience.
6. **Crawlable information architecture.** Server-rendered primary content, stable URL contracts, accurate metadata, valid structured data, contextual internal links, controlled sitemap eligibility, redirect integrity and automated HTTP/SEO regression checks.
7. **Useful audience relationships.** Newsletter and direct feedback loops bring users back, expose information gaps, and help us improve the product beyond one-time search visits.

Search discoverability is paramount, but rankings, indexing, rich results and AI citations are outcomes to earn, not guarantees. Schema markup and technical SEO are foundations; they do not replace original usefulness, evidence, freshness, authority, or good user experience.

## 5. Product boundaries

### Initial focus
- A polished, editorial-style homepage with clear topic navigation and locality discovery.
- Deep Ellum and the night-out use case as the first complete, well-researched coverage area.
- An information architecture that can accommodate a broad range of topics and every planned Dallas locality without redesigning the product.
- A small set of high-quality guides and researched place profiles.
- Source-backed facts, explicit uncertainty, correction pathways and clear sponsorship disclosures.
- Mobile usability, fast and reliable pages, and a repeatable editorial workflow.
- Measurement of search discovery and meaningful user actions.

### Out of scope until evidence justifies a change
- Unsubstantiated blanket coverage claims or thin, automatically generated locality/topic pages. Broad Dallas coverage is a product ambition, but each page must earn publication through meaningful, verified coverage.
- Merchant dashboards, claims workflows, marketplace features or public write APIs.
- A native mobile app, loyalty platform, complex recommendation AI or separate search service.
- A CMS, second database, ORM migration or large new infrastructure layer without a demonstrated need.
- Technical consulting, agency services, or software-service offers inside the consumer product.

## 5A. Experience and locality strategy

**Product decision:** The experience should take inspiration from the breadth, scannability, and editorial entry points of DailyDFW, while using DallasCircle's own design system, voice, content standards, and product identity. The reference is an information-architecture and browsing inspiration—not a pixel-copy target.

### Experience principles
- **Editorial-first homepage:** a clear lead story/guide, recent or timely local items where we can maintain them, topic entry points, locality discovery, and curated collections. Avoid a homepage that is only a search box or a grid of business listings.
- **Breadth with hierarchy:** expose topic families such as Food & Drink, Things to Do, Arts & Culture, Events, Neighborhood Guides, Parks & Outdoors, Local News & Updates, Family, Shopping, and Practical Local Information as inventory and editorial capacity support them. These are intended taxonomy directions, not a claim that every section is already populated or live.
- **Locality as a first-class dimension:** users should be able to select or browse a locality and then see relevant topics, guides, places, and timely items for that area.
- **Consistent global navigation:** topic and locality navigation must work on mobile, be keyboard accessible, and use crawlable links for important destinations.
- **Useful landing pages:** each locality or topic landing page needs unique local value, clear scope, internal links, and enough reviewed inventory to justify publication.
- **No empty-shell SEO:** planned coverage does not justify publishing thin pages. Show unavailable/coming-soon coverage in the UI if useful, but do not automatically index empty pages.
- **Editorial trust:** label dates, source context, corrections, sponsored content, and uncertainty where relevant. Do not fabricate local reporting or firsthand experience.

### Locality coverage model

Treat the locality list as a managed coverage plan, not a list of URLs to generate. Maintain a locality registry with canonical name/slug, parent geography, boundaries or geographic references where verified, coverage status, supported topic areas, linked canonical entities, source inventory, and editorial owner/review cadence. Use one consistent locality identifier across profiles, guides, feeds, navigation, metadata, and future maps/search. Do not confuse neighborhoods, cities, districts, and counties; model their type and parent relationship explicitly.

Roll out locality pages only when a locality meets a defined minimum viable coverage threshold. Track coverage by locality × topic and make gaps visible to the editorial team. The long-term goal is coverage across Dallas localities; launch order and indexability should follow actual verified inventory and maintenance capacity.

### UI implementation approach

Keep the existing Next.js, TypeScript, Tailwind, and Supabase foundation. Build reusable components for editorial story cards, topic navigation, locality navigation/selector, curated collection blocks, freshness/source cues, and responsive content grids. Do not add a second database or import a generic directory template. Establish the page hierarchy and responsive visual system before building a large set of category/locality routes.

## 6. Architecture decision

**Decision:** Build a custom SEO-first local discovery product on proven foundations. Retain the current Next.js App Router, TypeScript, Tailwind CSS and Supabase/PostgreSQL direction. Custom-build the domain model and logic where it creates DallasCircle's product advantage. Do not replace the application wholesale with a generic directory template or general-purpose boilerplate.

### Build specifically for DallasCircle
- Canonical merchant/place profile pages with stable URLs and shared entity IDs used across every guide, article, locality/topic page, filter, and collection.
- Structured merchant classification and locality relationships for directory-style browsing and deterministic filtering.
- Optional founder profiles: a distinct canonical Person entity published only when the founder or authorized representative has explicitly opted in, the identity/role is verified, and the profile meets editorial standards. Link founders to businesses through explicit role relationships.
- Canonical place, guide and venue relationships.
- Fact/source provenance and freshness state.
- Page-type publication thresholds and a shared publication-eligibility contract.
- Explainable occasion/budget/time/proximity matching as the product requires it.
- SEO route contracts, internal-link logic, sitemap eligibility and automated quality gates.
- Correction, review and editorial operations.

### Reuse mature foundations
Reuse established framework capabilities and proven patterns for testing, accessibility, configuration, security, observability, CI, and UI primitives where they demonstrably improve quality or delivery speed. Repositories such as `ixartz/Next-js-Boilerplate` and directory starters may be inspected as references, but are not our product foundation. Do not import their entire dependency, authentication, ORM, database, CMS or hosting choices without a documented comparison and migration case.

### Data and security principles
- Supabase/PostgreSQL remains the current canonical data and access-control foundation.
- Keep the browser read-only unless a separately designed and tested authorized workflow is approved.
- Never expose service-role credentials in browser code or public environment variables.
- Test RLS, grants, publication invariants and access to internal research notes.
- Do not add a second data store or search service until measured needs justify it.

### Hosting decision
Hosting is **not yet locked**. Choose a provider only after the current foundation passes local runtime/SEO checks and outstanding security blockers are resolved or explicitly accepted. Compare candidate providers on reproducible builds, preview and rollback workflow, caching/revalidation, route behavior, logs and monitoring, security, operational control, portability and total cost. Do not choose a provider because it claims SEO or AI-discovery advantages.

## 6A. Canonical merchant profiles and founder profiles

Every eligible published merchant must have one permanent canonical profile URL and stable entity identifier. The same profile is reused throughout DallasCircle: articles, guides, locality pages, topic pages, curated collections, and ranked lists must link to the canonical merchant URL rather than create duplicate merchant pages. Slug changes require a permanent redirect, updated internal links, and a consistent canonical/sitemap reference.

Merchant profiles are the source of truth for structured business facts, locality/category relationships, official links, source provenance, verification and freshness state, correction history, and visible sponsorship disclosure. Filters and groupings use canonical IDs and structured attributes. Filter parameters and collection contexts must not create competing indexable copies of merchant profiles.

Render appropriate JSON-LD based on the real entity and the visible page, using the most specific suitable Schema.org `LocalBusiness` subtype where applicable. Use a stable entity `@id`, accurate canonical URL, and only verified/visible properties. Founder relationships may be represented with `founder` only when the claim is supported and shown on the page. Structured data must match visible content; it does not guarantee ranking, rich results, or AI citations. See [Google's Local Business structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Schema.org LocalBusiness](https://schema.org/LocalBusiness), and [Google's canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

Founder profiles are an opt-in editorial feature, not a default scrape of owners or directors. A founder profile may be created only when the person or an authorized representative opts in, identity and founder/co-founder role are verified, appropriate use of biography/photo is approved, and a meaningful profile can be maintained. A founder may be linked to multiple businesses; each business relationship must record its role and evidence. Founder profiles should have their own canonical Person identity only when they meet publication thresholds. No consent means no public founder profile; never infer founder status from an unverified name or conflate founder, owner, CEO, promoter, and current operator.

## 7. Non-negotiable SEO and publication rules

1. Every indexable entity/page type has a stable URL contract and one canonical URL.
2. The same eligibility rules govern page rendering and sitemap inclusion.
3. A database row alone never qualifies a page for publication or indexing.
4. Pages must provide meaningful, source-backed value and meet page-type completeness thresholds.
5. Draft, hidden, duplicate, thin and unreviewed records are excluded from public indexing and sitemap output.
6. Primary content must be server-rendered and usable without client interaction.
7. Titles, descriptions, canonicals, robots rules and structured data must accurately represent the visible page.
8. Structured data must not impersonate a restaurant or claim facts not shown and supported on the page.
9. Internal links should connect relevant places, guides and venues naturally; do not generate arbitrary link farms.
10. Redirects, status codes, sitemap coverage, duplicate metadata, JSON-LD validity and broken internal links are tested automatically.
11. A passing lint/build is not proof of SEO correctness or launch readiness.
12. Never promise search rankings, indexing, rich results or AI citations.

## 8. Decision filter

For every proposed feature, repository, dependency or infrastructure choice, ask:

**Does this materially improve discoverability, factual trust, user decision quality, reliability, or delivery speed without weakening the other goals?**

If not, defer it. Prefer the smallest implementation that preserves the architecture and allows the team to learn from real usage.

## 9. Current project context and execution order

The existing repository already contains a Next.js/Supabase foundation, source-backed place and guide routes, shared publication eligibility, a database-backed sitemap, route-verification tooling, and a database publication-integrity regression script. A live migration has strengthened public-read and publication invariants.

The foundation is **not yet declared launch-ready**. Immediate gates are:

1. Resolve local Git state and run the current branch locally without discarding local work.
2. Complete local HTTP route/SEO verification and fix actual failures.
3. Resolve the outstanding Supabase default-privilege ACL through an authorized role-owner/superuser path, or record an explicit, informed release decision.
4. Complete correction/history, review and freshness operations needed to maintain source-backed facts.
5. Finish the initial Deep Ellum night-out product and editorial inventory.
6. Evaluate hosting only after these checks; do not deploy or run destructive legacy-table retirement ahead of release gates.
7. Measure Search Console performance, guide-to-profile navigation, official outbound clicks, newsletter signup and user/business feedback.
8. Expand only when evidence shows the initial product is useful and the operating model is repeatable.

The immediate priority is to prove and finish the current foundation while aligning the experience, canonical merchant/founder entity model, and locality model with the broader editorial platform vision—not restart the repository or continue debating starter templates.

## 9A. Strategy integration: offer-led wedge and broad local platform

The strategy/product definition dated 23 October 2026 proposes deals as the primary recurring consumer hook, permanent business pages as the durable information layer, and merchants as a continuing source of relevant offers. Adopt this as a testable product hypothesis. The first release should make current offers actionable where reliable supply exists, while the underlying product remains a broader editorial-led local guide. Do not make all discovery dependent on discounts, assume every merchant can publish regularly, or choose monetization before user and merchant behavior has been observed.

The roadmap is staged: (1) prove the existing application and database/security foundation; (2) complete canonical entities, provenance, freshness and publication gates; (3) deliver an integrated Deep Ellum discovery journey; (4) run a focused user/merchant pilot with pre-agreed measures; and (5) expand topics, localities, founder profiles, and commercial features only when evidence supports them. The operational details and current execution queue are in the [Roadmap & Discoverability Operating Plan](./roadmap-and-discoverability-operating-plan.md).

## 10. Definition of progress

Progress means demonstrable improvement in one or more of these areas:

- The user can make a better, more confident local decision.
- Important facts have better provenance, freshness or correction handling.
- Search engines can crawl, understand and correctly canonicalize useful pages.
- Relevant pages are linked and discoverable without creating thin inventory.
- The application is more secure, reliable, testable or economical to operate.
- The team learns something measurable about audience demand or commercial viability.

**Strategic principle:** Build the useful product. Establish trust. Make the knowledge discoverable. Measure real behavior. Expand only when justified.
