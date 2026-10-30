# DallasCircle — Correction Workflow Architecture Decision

**Status:** Accepted operating decision; structured intake intentionally deferred  
**Date:** 29 October 2026  
**Scope:** Canonical place facts, reader/business correction intake, editorial review, and public freshness/correction context  
**Related issue:** [#4 — Complete canonical place model, correction history, and publication integration](https://github.com/blockrao/dcircle/issues/4)  
**Strategic authority:** `docs/vision-and-strategic-direction.md` and `docs/architecture-and-product-review-gate.md`

## 1. Problem and user outcome

DallasCircle's published place profiles show verified facts, source links, checked dates, and a correction contact link. The current correction link opens an email draft; it is not a structured submission workflow, does not create a trackable queue by itself, and does not provide a durable, queryable record of how a factual value changed.

Readers and businesses need a low-friction way to flag errors. Editors need to investigate each report, preserve source evidence, decide whether a fact should change, and ensure the visible profile, metadata, structured data, related content, and sitemap remain consistent.

## 2. Decision

Adopt a **private, editor-controlled correction workflow**. Keep public place and guide access read-only. Do not add anonymous database writes, expose editorial notes, or create a public endpoint that accepts arbitrary fact updates.

Separate three concepts:

1. **Correction report** — a reader/business claim that something may be wrong. It is untrusted input, not a verified fact.
2. **Editorial decision** — an editor's disposition of the report, with rationale and evidence.
3. **Canonical fact change** — a source-backed change to `place_facts`, performed only through an authorized trusted path after verification.

A correction report must never directly publish or mutate a canonical fact. Payment, sponsorship, or merchant status must not influence the factual review outcome.

## 3. Proposed minimum architecture

### A. Intake: retain the existing email route for the first safe release

The current `mailto:` correction link is a no-backend fallback. Keep it until a real submission service is available and tested. Improve its subject/body prefill only if needed; do not describe it as a submitted or tracked correction.

A structured public form is a later implementation step, not a prerequisite for the first internal audit trail. Before enabling one, select and configure a server-side delivery/queue mechanism, spam/rate-limit controls, validation, retention rules, and a monitored failure path. No credentials or private editorial data may be sent to the browser.

### B. Private correction queue

Introduce a private correction-request record only when the trusted intake path is ready. The record should include:

- stable request ID and canonical target place ID;
- optional fact key, current public URL, reporter category (reader/business/other), and reporter contact only when supplied voluntarily and needed for follow-up;
- concise proposed correction and supporting source URL(s);
- received, reviewed, and resolved timestamps;
- status: `received`, `triaged`, `investigating`, `accepted`, `rejected`, or `duplicate`;
- reviewer/disposition and a short internal rationale;
- privacy/retention handling for contact details.

Do not store unnecessary personal information. Do not expose the queue, reporter details, or internal rationale through anonymous/authenticated public reads. Use least-privilege access and verify RLS, grants, and function execution before enabling intake.

### C. Fact change history

Preserve an audit trail when a canonical fact is changed or retired. History should identify the affected place and fact, the before/after values, source reference, verification state, timestamp, and trusted actor/reason where available. The current fact model already records source, verification status, checked time, review due date, and update timestamps, but it does not by itself provide a dedicated before/after history interface.

History must be append-only to ordinary application workflows; routine public roles must not be able to edit or delete it. Avoid duplicating full source material or reporter personal data in the fact history.

Do not silently overwrite an uncertain or disputed value as though it were verified. Use the existing verification states (`verified`, `unverified`, `conflicting`, `stale`) until a separately reviewed migration establishes any additional state needed. Any new state must be reflected consistently in schema constraints, TypeScript contracts, public eligibility, page rendering, sitemap generation, and tests.

### D. Review and publication behavior

- Editors validate the claim against official/current sources or other suitable public evidence.
- If accepted, the editor changes the canonical fact through an authorized trusted path, records the supporting source and checked date, and records the disposition of the correction report.
- If rejected or unresolved, keep the canonical verified value unchanged; record the decision and reason internally. Where evidence conflicts, mark the fact conflicting or stale rather than presenting certainty.
- Public pages display only facts that pass the current shared eligibility gate. An accepted report is not sufficient evidence on its own.
- Public source links and checked dates must correspond to the fact shown.
- Correction reports must not create new indexable pages or URLs.
- A correction that changes a public URL or slug must follow the existing redirect/canonical/sitemap rules; correction handling must not silently create duplicate entities.

## 4. Alternatives considered

### Alternative 1 — Continue email-only forever

**Rejected as the complete solution.** It is a safe fallback but does not produce structured status tracking or a durable correction queue. Retain it temporarily because there is no evidenced, configured delivery service in the current application.

### Alternative 2 — Allow anonymous direct writes to `place_facts`

**Rejected.** This would let untrusted input bypass source verification and editorial review, threaten data integrity, expose an abuse surface, and potentially change public content or indexing eligibility.

### Alternative 3 — Build a full merchant dashboard/CMS now

**Deferred.** It adds authentication, authorization, operational burden, and scope before there is evidence it is needed. A narrow editor-controlled queue is sufficient for the current launch wedge.

### Alternative 4 — Add a third-party form/CRM without an explicit privacy and reliability review

**Deferred.** No provider, credentials, retention terms, or failure behavior are established in the current project evidence. Select one only if the operating need justifies it and the data/privacy/security review passes.

## 5. Discoverability and trust consequences

This workflow supports DallasCircle's intended advantage: a canonical local entity with source-backed facts, freshness state, correction handling, and consistent public output. It reduces the risk that stale or disputed facts remain presented as current, and makes future editorial maintenance measurable.

It does **not** guarantee search ranking, indexing, rich results, or AI citations. Search-facing output must remain aligned with visible, verified page content. Correction-request records and internal audit records must never be added to the public sitemap.

## 6. Security, privacy, and operations

- Public Supabase access remains read-only.
- No service-role key or privileged credential is exposed to a client.
- Any future submission route validates input server-side, limits abuse, and fails safely if persistence or notification fails.
- Reporter contact is optional and minimized; define access and retention before launch.
- Private editorial notes and reporter data are never returned by public queries.
- Database changes require a tracked migration, least-privilege review, rollback plan, and regression tests.
- Do not apply a destructive legacy-retirement migration as part of this work.

## 7. Delivery sequence

1. **Design gate (this record):** agree the separation of report, editorial decision, and canonical fact change.
2. **Fact-history foundation:** design a tracked, additive migration and regression tests for before/after history on authorized fact changes; preserve existing public behavior.
3. **Private correction queue:** add only after the trusted intake mechanism and access model are selected. Keep public roles unable to read or write the queue.
4. **Editorial processing:** document triage, source verification, accepted/rejected/conflicting outcomes, and how the editor records the canonical update.
5. **Public UX:** retain the mailto fallback until structured intake is operational; then provide a simple accessible form with clear privacy language and confirmation/failure states.
6. **End-to-end verification:** test valid and invalid reports, abuse controls, private-data isolation, fact history, canonical profile rendering, JSON-LD consistency, sitemap exclusion, and rollback/recovery. Run live HTTP checks separately from build/CI.

## 8. Acceptance criteria

- [ ] Public roles cannot create, read, update, or delete private correction requests or fact-history records.
- [ ] Every authorized canonical fact change has a recoverable before/after audit record and a reason/source context where available.
- [ ] A correction report never directly changes a published fact.
- [ ] Accepted corrections require evidence and a trusted editor action.
- [ ] Unresolved/conflicting evidence cannot be represented as newly verified.
- [ ] Public pages show only currently eligible facts with matching source context.
- [ ] No correction queue/history route is public, indexable, or included in the sitemap.
- [ ] Existing canonical IDs, slugs, guide relationships, and publication eligibility remain intact.
- [ ] Migration and regression tests are committed before any production application.
- [ ] Build, route/SEO tests, database security tests, and live/preview checks are reported separately.

## 9. Rollback and approval boundary

This is a design decision record only. It does not apply a database migration, change production data, enable a public write route, configure an external provider, or deploy the application.

For the fact-history foundation, prefer an additive migration with a rollback plan and no destructive legacy-table changes. Do not enable structured public intake until the delivery mechanism, spam controls, privacy behavior, and authorization model are explicitly reviewed and tested.


## 10. Launch-scope disposition — 30 October 2026

The design has been accepted and the following launch-scope decision is recorded:

- The private before/after fact-history foundation is implemented, migrated to production, and covered by isolated PostgreSQL regression tests.
- The public correction contact remains the existing `mailto:` flow. It is explicitly a contact mechanism, not a tracked submission or confirmation service.
- A public database write endpoint, correction queue, reviewer dashboard, and external form/CRM integration are **deferred**. The current product is a small, editor-maintained local guide; no operational evidence yet justifies introducing a public write surface, reporter-data retention, spam infrastructure, and a new authenticated editorial console.
- A correction received by email is treated as an unverified report. The editor independently checks official/current evidence, updates the source and fact through the existing trusted editorial process only when substantiated, and relies on the private fact-history trigger to preserve before/after values. An email or merchant assertion alone never changes a published fact.
- Public roles remain read-only. No anonymous or authenticated user can mutate canonical places, sources, facts, guides, or private audit history.
- Reopen structured intake as a separate product issue only when correction volume, response-time expectations, or multiple-editor operations make a tracked queue necessary. That future work must include server-side abuse controls, privacy/retention rules, reviewer authentication/authorization, status tracking, and end-to-end audit tests before enablement.

This is an intentional scope decision, not a claim that a structured correction queue has been built. It closes the launch-critical canonical model/fact-history requirement while preserving the safer email fallback.
