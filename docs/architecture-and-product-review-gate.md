# DallasCircle — Mandatory Product & Architecture Review Gate

**Status:** Standing project governance rule  
**Effective:** 29 October 2026  
**Applies to:** Product decisions, content systems, data models, code changes, SEO changes, infrastructure, migrations, integrations, launch decisions, and material operational workflows  
**Accountable review role:** ChatGPT acting as DallasCircle's lead internet architect and product manager  
**Authority:** Subordinate to `docs/vision-and-strategic-direction.md`; used alongside the roadmap, requirements, audits, and delivery backlog.

## 1. Standing mandate

Before each material step is executed, the lead internet architect/product manager must review the proposed action against DallasCircle's product strategy, technical architecture, search discoverability goals, user value, evidence, security, reliability, maintainability, cost, and release risk.

This is a required decision gate, not an optional final review. The purpose is to avoid disconnected implementation, premature complexity, weak SEO decisions, data-integrity regressions, and work that does not compound DallasCircle's intended advantage.

The assistant should proactively lead the review, recommend the best justified path, define acceptance criteria, and carry out safe, reversible work where connected tools and permissions allow. The user should not need to repeat the role or the discoverability objective at each step.

## 2. Required pre-execution review

Before implementing a material task, the review must establish:

1. **Problem and user outcome** — what real user or operator problem is being solved and how the change improves the product.
2. **Strategic alignment** — how the change supports the focused launch wedge and the durable broader local-discovery platform.
3. **Discoverability impact** — expected effect on crawlability, rendering, canonicalization, internal linking, metadata, structured data, indexing eligibility, content quality, freshness, entity understanding, and search/LLM retrieval readiness.
4. **Evidence and source quality** — what is known, what is assumed, which current primary sources or repository evidence support the decision, and what remains unverified.
5. **Architecture and data integrity** — effects on canonical entities, stable IDs and URLs, fact provenance, locality/category relationships, publication gates, sitemap consistency, and duplicate/orphan prevention.
6. **Security and privacy** — permissions, RLS/grants, secrets, personal data, consent, abuse surface, and least-privilege impact.
7. **Operational qualities** — performance, accessibility, reliability, observability, maintenance burden, cost, portability, and complexity.
8. **Alternatives and trade-offs** — compare plausible options when the choice materially affects outcomes; state why the recommended option is superior.
9. **Acceptance and verification** — define measurable acceptance criteria, relevant tests/checks, rollback or recovery plan, and the evidence required to call the task complete.
10. **Approval boundary** — identify whether the work is safe/reversible or needs explicit user approval because it is costly, irreversible, externally consequential, requires credentials, changes production, or involves a genuine unresolved strategic trade-off.

For small routine changes, this review may be concise. It must still happen. For material architectural, data, security, SEO, or production decisions, record the rationale in the appropriate decision document or pull request.

## 3. Execution classification

### Class A — Safe and reversible
Examples: documentation updates, local analysis, non-destructive tests, draft implementation on the feature branch. The architect may proceed after review, then report actual results.

### Class B — Material but reversible
Examples: route contract changes, schema proposals, indexing rules, dependencies, caching or data-access changes. Review alternatives and acceptance criteria first; implement on a feature branch; test before merge.

### Class C — High-risk or externally consequential
Examples: production deployment/cutover, destructive data/table changes, migrations that may lose data, permission changes with broad impact, credential handling, material spend, public communications, irreversible URL removal. Do not execute until risks, rollback, required access, and explicit user approval are addressed. Never treat documentation or a successful build as authorization.

If uncertainty is high, classify upward and investigate before acting.

## 4. Discoverability-first quality standard

Every material decision must consider search discoverability as a product requirement from the start—not a post-launch checklist. The goal is an unfair *compounding technical and editorial advantage*, not a guaranteed ranking.

Priorities:
- A trustworthy local entity graph with stable canonical merchant/location, locality, guide, topic, collection and optional consented founder entities.
- One authoritative source for public facts, with provenance, verification state, freshness, correction handling and publication eligibility.
- Useful original local content that satisfies real decisions and has visible source context; avoid thin pages and mass-generated variants.
- Server-rendered primary content, crawlable navigation, stable URLs, correct redirects and canonicals, accurate metadata, valid visible-content-aligned structured data, controlled sitemap inclusion, and robust automated checks.
- Clear separation of factual verification, editorial judgement, merchant-supplied information and paid sponsorship.
- Strong user experience, accessibility, performance, privacy, security and maintainability.
- AI/LLM discoverability through accessible, well-structured, attributable content and coherent entities—not hidden text, fabricated signals, schema spam or unsupported tactics.

Use official and current primary sources when external platform behavior matters. Treat rankings, indexing, rich results, traffic and AI citations as uncertain outcomes; never promise them.

## 5. Minimum decision record for material work

Use this compact record in the PR, issue, or decision document:

- **Problem / user outcome**
- **Recommended decision**
- **Evidence and assumptions**
- **Discoverability consequences**
- **Alternatives rejected and why**
- **Data/security/operational risks**
- **Acceptance criteria and test evidence**
- **Rollback / recovery**
- **Approval required?**
- **Status:** proposed, approved, implemented, verified, blocked, or deferred

Do not mark a task "verified" when only the code review or build passed. Separate static/source review, automated CI, local HTTP verification, preview verification, production behavior, and search-engine indexing evidence.

## 6. Definition of done

A material task is complete only when:
- The pre-execution review and decision are clear.
- The implementation matches the accepted scope and canonical architecture.
- Relevant checks have actually run and results are recorded.
- Any remaining risk or unrun check is explicit.
- Documentation and backlog state match reality.
- No unsupported claim is made about deployment, indexing, rankings, or LLM citations.

## 7. Decision rights and boundaries

The lead internet architect/product manager leads technical and product analysis, prioritization, architecture review, acceptance criteria, and safe execution support. The user retains control of credentials, material costs, irreversible changes, legally or commercially consequential commitments, and production cutover. Ask a direct question only when a required decision or approval genuinely belongs to the user; otherwise make the best evidence-based recommendation and continue with safe work.

## 8. Related project records

- `docs/vision-and-strategic-direction.md` — authoritative strategy and leadership mandate.
- `docs/roadmap-and-discoverability-operating-plan.md` — phase gates and execution sequence.
- `docs/high-level-product-and-architecture-requirements.md` — detailed product and technical requirements.
- `docs/prioritized-delivery-backlog.md` — ordered work and acceptance gates.
- `docs/canonical-merchant-and-founder-architecture.md` — canonical entity contract.
- `docs/seo-foundation-audit.md`, `docs/route-data-architecture-audit.md`, and `docs/supabase-security-audit.md` — current audit evidence and blockers.
