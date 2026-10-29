# DallasCircle — Vision, Mission & Strategic Direction

**Status:** Active product and architecture decision baseline  
**Decision date:** 29 October 2026  
**Positioning:** **DallasCircle — Deep Ellum for the night out.**  
**Operating model:** Remote-first, editorial-led digital product  
**Initial market:** Deep Ellum, Dallas, Texas

This document records the strategic direction that all product, engineering, SEO, content, and infrastructure decisions must support. The long-form business strategy and execution plan is maintained as a companion project artifact; this concise decision record is the repository's authoritative strategic baseline. Implementation requirements, delivery backlog, and audits must remain consistent with it.

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

Become a trusted digital guide to experiencing Dallas, helping people discover places, plan activities, and make better local decisions—beginning with the practical needs of a night out in Deep Ellum.

## 2. Mission

Turn fragmented local information into useful, occasion-based recommendations that make planning an outing easier. Build a source-backed local knowledge system that helps people move from an intention—dinner before a show, food after 10 p.m., a date night within a budget—to a practical, explainable plan.

## 3. Product goal

Build the most useful, trustworthy discovery experience for the specific Deep Ellum night-out use cases we choose to serve. Earn repeat use and search visibility through better information, decision usefulness, reliable technical delivery, and a maintained relationship with the audience—not through page volume alone.

## 4. The intended unfair advantage

DallasCircle's advantage must compound through a system competitors cannot reproduce simply by installing a template or generating many pages:

1. **Canonical local entities.** Stable records for places, venues, guides and, later when justified, events. Relationships are explicit and facts are not copied inconsistently across pages.
2. **Fact-level provenance.** Important claims have source records, verification method/status, checked timestamps, and review expectations. Unknown, stale, conflicting, and verified information are distinct states.
3. **Freshness operations.** Volatile details—especially kitchen hours, menus, prices, booking links and event information—have appropriate review cadences. Old data is never presented as newly verified.
4. **Occasion-based discovery.** Content and future retrieval answer practical needs: pre-show dining, late-night food, date nights within a defined budget, and relevant options near a venue. Each recommendation should explain why it qualifies.
5. **Editorial integrity.** Inclusion is based on usefulness and evidence. Paid placements are disclosed and separated from editorial decisions. No fabricated reviews, firsthand claims, popularity, partnerships or unsupported local experience.
6. **Crawlable information architecture.** Server-rendered primary content, stable URL contracts, accurate metadata, valid structured data, contextual internal links, controlled sitemap eligibility, redirect integrity and automated HTTP/SEO regression checks.
7. **Useful audience relationships.** Newsletter and direct feedback loops bring users back, expose information gaps, and help us improve the product beyond one-time search visits.

Search discoverability is paramount, but rankings, indexing, rich results and AI citations are outcomes to earn, not guarantees. Schema markup and technical SEO are foundations; they do not replace original usefulness, evidence, freshness, authority, or good user experience.

## 5. Product boundaries

### Initial focus
- Deep Ellum and the night-out use case.
- A small set of high-quality guides and researched place profiles.
- Source-backed facts, explicit uncertainty, correction pathways and clear sponsorship disclosures.
- Mobile usability, fast and reliable pages, and a repeatable editorial workflow.
- Measurement of search discovery and meaningful user actions.

### Out of scope until evidence justifies a change
- A broad Dallas directory or thin programmatic SEO.
- Merchant dashboards, claims workflows, marketplace features or public write APIs.
- A native mobile app, loyalty platform, complex recommendation AI or separate search service.
- A CMS, second database, ORM migration or large new infrastructure layer without a demonstrated need.
- Technical consulting, agency services, or software-service offers inside the consumer product.

## 6. Architecture decision

**Decision:** Build a custom SEO-first local discovery product on proven foundations. Retain the current Next.js App Router, TypeScript, Tailwind CSS and Supabase/PostgreSQL direction. Custom-build the domain model and logic where it creates DallasCircle's product advantage. Do not replace the application wholesale with a generic directory template or general-purpose boilerplate.

### Build specifically for DallasCircle
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

The immediate priority is to prove and finish the current foundation—not restart the repository or continue debating starter templates.

## 10. Definition of progress

Progress means demonstrable improvement in one or more of these areas:

- The user can make a better, more confident local decision.
- Important facts have better provenance, freshness or correction handling.
- Search engines can crawl, understand and correctly canonicalize useful pages.
- Relevant pages are linked and discoverable without creating thin inventory.
- The application is more secure, reliable, testable or economical to operate.
- The team learns something measurable about audience demand or commercial viability.

**Strategic principle:** Build the useful product. Establish trust. Make the knowledge discoverable. Measure real behavior. Expand only when justified.
