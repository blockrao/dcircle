# DallasCircle — Canonical Dallas Entity Model

**Status:** Proposed architecture decision for review  
**Date:** 30 October 2026  
**Workstream:** [Issue #56](https://github.com/blockrao/dcircle/issues/56)  
**Scope:** Canonical business identity, physical locations, locality/category graph, evidence, inventory ingestion, and public discoverability.

## 1. Decision summary

DallasCircle's existing `places` records are **physical, customer-facing business locations** and remain the canonical public profile entities for the current product.

Introduce a distinct **Organization (business/brand) identity** only to represent the business that operates or brands one or more locations. A location may belong to one organization; an organization may have one or many locations. Independent single-location businesses are supported without forcing a public organization page.

Preserve all existing place UUIDs, slugs, profile URLs, stable place entity IDs, guide references, and published content. The initial schema change must be additive and backward-compatible.

**Public URL contract remains:** `/places/{slug}`  
**Current stable location entity ID remains:** `https://dallascircle.com/id/place/{uuid}`

An organization gets its own immutable internal UUID and stable entity identifier if/when emitted in structured data. It does not automatically get an indexable public page. The first implementation should not create public organization pages, brand landing pages, or duplicate profile URLs.

## 2. Evidence from the current system

Read-only inspection of repository `main` and live Supabase on 30 October 2026 found:

- Live schema has 10 `public.places` rows: 8 published and 2 draft; all currently assigned to the single Deep Ellum neighborhood.
- Seven normalized categories exist: Restaurants, Bars, Cafes, Entertainment, Live music, Attractions, and Other places.
- The live inventory has 17 source records and 18 facts, all currently marked verified.
- The canonical schema has `places`, `neighborhoods`, `categories`, `place_categories`, `place_sources`, `place_facts`, `guides`, `guide_places`, `guide_sources`, and `place_slug_history`, plus private `dcircle_private.place_fact_history`.
- `places` currently stores name, slug, website, phone, address, city/region/postal code, optional coordinates, neighborhood, price level, and publication state together. It has no organization/business parent identity.
- Source and fact rows are currently place-scoped. A fact's source must belong to the same place.
- Guides reference places by immutable place UUID.
- `/places/{slug}` resolves a published, evidence-eligible place. Historical slugs permanently redirect to the current slug. `/id/place/{uuid}` resolves to the canonical profile with HTTP 308.
- Place profile JSON-LD uses a stable UUID-derived `@id`, current profile URL as `mainEntityOfPage`, and currently selects `Restaurant`, `BarOrPub`, or generic `LocalBusiness` based on primary category. Guide and neighborhood structured data reference the same place ID.
- Publication eligibility is shared between the place route and sitemap and requires a current verified fact, visible source, and active primary category. Database publication guards add address, locality, source, fact, and category requirements.
- The old business-services schema was retired. It is not a foundation to reuse for the local discovery model.
- The security advisor currently reports one informational private-table RLS-without-policy notice for `dcircle_private.place_fact_history`; public roles remain read-only.

This is a source/schema audit, not a claim that all 10 records have been independently re-researched today.

## 3. Entity definitions and identity boundaries

### 3.1 Organization — business / operating brand

Represents the business identity that operates, owns, or brands one or more public-facing locations.

Examples:
- A restaurant brand with several branches.
- An independent restaurant operating one location.
- A venue operator where the operator identity is distinct from the building or event venue.
- A business that relocates while retaining its operating identity.

Organization fields should be conservative and evidence-backed: immutable ID, canonical name, legal/trading name only where relevant, official website/domain, verified identity links, lifecycle status, and timestamps. Do not infer legal entity identity from a brand name.

An Organization is not the same as a founder, owner, manager, landlord, venue property, or tenant. Those are different entities/relationships and are out of scope unless a real product need and reliable evidence justify them.

### 3.2 Place — physical customer-facing location

The current `places` table remains the canonical physical location entity and public profile target.

It represents one specific address/customer-facing operation, not an abstract brand with multiple branches. It retains:
- immutable existing UUID;
- unique current slug and permanent slug history;
- address and locality;
- location-specific phone, website, hours, menus, access, and other facts when verified;
- category relationships;
- source/fact provenance and publication state.

A multi-location brand has one Organization linked to multiple Place rows. Each location can have its own address, hours, contact details, menu/pricing evidence, operational state, and canonical profile URL.

A single-location independent business can have one Organization linked to one Place. This creates a clean identity boundary without requiring an Organization page.

### 3.3 Neighborhood / locality

Neighborhoods remain geographic entities. A Place belongs to its best-supported locality relationship. Do not infer neighborhood boundaries from postal code alone. Dallas city/region/country scope remains explicit.

### 3.4 Category / topic

Categories remain normalized many-to-many classifications with exactly one primary category per published place. Categories describe what a place is or offers; they are not separate business identities. Topic pages and curated editorial collections are separate content/navigation constructs and should not create new Place rows.

### 3.5 Editorial content

Guides and future articles/collections reference canonical Place IDs and, where useful, Organization IDs. They must not copy business identity into independent listing records.

## 4. Relationship contract

Initial relationships:

- Organization 1 → N Places.
- Place N → 1 Organization, nullable only during migration/reconciliation or where the operating business identity is genuinely unresolved.
- Place N ↔ N Categories, exactly one active primary category for a published Place.
- Place N → 1 Neighborhood where locality is known and required for publication.
- Place 1 → N Sources and Facts, retaining current source/fact history and same-place source integrity.
- Guide N ↔ N Places through `guide_places`.

Do not introduce a generic polymorphic entity/relationship framework, graph database, or arbitrary relationship table at this stage. Add a specific relationship only when a demonstrated use case needs it and the relationship can be evidenced and tested.

If one physical address contains multiple distinct customer-facing businesses, create separate Place records only when they are genuinely distinct visitor destinations. If a venue is merely the building and several independent tenants operate there, do not merge the tenants into the building's business identity. A venue/tenant relationship is a later, evidence-led extension.

## 5. URL and structured-data contract

### Place profile

- Keep `/places/{slug}` as the one public canonical profile URL for a physical operating location.
- Keep current `placeEntityId(place.id)` stable URI unchanged for existing records.
- Keep self-referencing canonical, sitemap URL, visible profile, and `mainEntityOfPage` aligned.
- A slug change preserves old slugs and returns a permanent 308 to the current URL.
- Never recycle a closed business's slug for a different business.
- Category, neighborhood, and filter variants do not create alternate Place profile URLs.

### Organization identity

- Give each Organization an immutable UUID.
- If the Organization is referenced in structured data, use one stable organization `@id` derived from that UUID, consistently across all its branch profiles.
- A location-specific LocalBusiness node remains the primary entity of the place profile. Where Organization and location are distinct, connect them with a truthful Schema.org relationship (normally `branchOf` for a branch of a larger business); validate exact property semantics before implementation.
- Do not emit a parent/brand relationship merely because two places share a similar name or domain. Require evidence of the shared operating brand.
- Do not emit unsupported `sameAs`, ratings, review counts, hours, prices, coordinates, founders, ownership, awards, or popularity claims.
- Select the most specific truthful Schema.org type from the verified category and actual business function. Do not equate a taxonomy label automatically with a Schema.org type; e.g. a music venue, cafe, attraction, restaurant, and bar need distinct mapping decisions.
- JSON-LD must be generated from the same canonical records as visible page content and must not create a parallel source of truth.

### Indexing policy

Organization records are not automatically indexable. A public Organization/brand page is a separate product decision requiring distinct user value, enough original verified information, a canonical URL, cross-links to eligible branches, and a quality gate. Do not publish empty brand shells.

## 6. Source, fact, provenance, and lifecycle rules

Retain the existing evidence-first model and extend it only where required:

- A factual claim has a source, source type, publisher, access/check timestamp, verification state, and review deadline where facts are volatile.
- Location-specific facts belong to the Place. Brand-wide facts belong to Organization only when genuinely shared and sourced.
- Never copy a brand-wide fact onto a location if it may vary by branch.
- If an official source is a brand-wide menu, it does not prove that every location serves every item or the same prices; location-specific confirmation is required where material.
- Record provenance at fact level; a generic source list alone is insufficient for high-value volatile claims.
- Keep merchant-supplied information, independent verification, editorial interpretation, and sponsorship distinct.
- A move, closure, rebrand, ownership change, or branch opening is a lifecycle event to reconcile—not an excuse to overwrite identity history or recycle URLs.
- Merge/split operations must be explicit, reviewed, auditable, and reversible where feasible. Never auto-merge solely on fuzzy name similarity.

## 7. Inventory discovery and ingestion architecture

### Discovery is not publication

Maintain three distinct states in the operating process:

1. **Discovered candidate:** a lead that may or may not be a real, current Dallas business/location.
2. **Verified entity/location:** identity, address and relevant facts reconciled against reliable evidence.
3. **Published profile:** verified record passes editorial completeness, user-value, canonical, structured-data and publication gates.

The count of discovered candidates is not a directory size or SEO coverage metric.

### Source hierarchy

1. Official business website and location pages.
2. Official menu, booking, event, contact, and social channels when demonstrably controlled by the business.
3. Public agency records for facts they are authoritative to establish (e.g. licensing/registered business identity), not for claims outside their remit.
4. Direct business confirmation, with date and scope recorded.
5. Reputable third-party directories and neighborhood/tourism sources as discovery or cross-check leads only—not as the sole authority for business claims.

Do not copy third-party descriptions, photos, reviews, rankings, or editorial content. Record source URL, publisher, source type, access time, and exact fact supported. Respect access restrictions and terms; use a permitted collection method rather than assuming bulk scraping is allowed.

### Deduplication and match review

Candidate matching may use normalized name, address, phone, official domain, sourced coordinates, and brand/branch evidence. No single field is sufficient for all cases.

- Exact strong matches may be queued as likely existing records.
- Conflicting or ambiguous matches require human review.
- Same name at a different address is not automatically a duplicate.
- Same domain does not prove two locations are the same Place; it may indicate one Organization with multiple Places.
- Similar names, shared building addresses, and third-party listing IDs are not sufficient to merge entities.
- Imports must be idempotent: reprocessing the same candidate/source must not create duplicate source or entity rows.
- Staging data must remain private and must not leak into public APIs, routes, or sitemap.

### Pilot before scale

Start with a small, varied batch that includes independent single-location businesses and at least one multi-location brand with multiple Dallas locations. Reconcile every match and field before any expansion.

Measure:
- candidate-to-verified conversion;
- duplicate and ambiguous-match rates;
- identity/address match precision from manual review;
- official-source coverage by field;
- current-fact coverage and review-due compliance;
- time spent per verified candidate;
- percentage passing publication gate;
- correction rate after publication.

Only scale categories/localities where facts can be maintained at a sustainable cost.

## 8. Initial schema direction — proposal, not migration

After the ADR and repository/database audit are accepted, propose an additive schema migration with:

- `organizations`: immutable organization UUID, canonical name, official website/domain, lifecycle state, timestamps, and only other justified verified fields.
- `places.organization_id`: nullable FK to `organizations.id`, indexed. Existing place rows remain valid and retain all current IDs/URLs.
- Constraints and indexes that prevent invalid identity relationships without assuming one Organization has only one Place.
- RLS and grants matching the current private/editorial write posture. No public write grants or public staging access.
- Optional private import-candidate staging only after ingestion workflow, retention, source rights, and access model are decided.
- Tests for one-to-one single-location businesses, one-to-many multi-location brands, unresolved identity, slug preservation, deletion restrictions, and publication behavior.

Before a production migration:
1. Verify current live schema and migration history.
2. Build the migration on an isolated/replayable database.
3. Define how existing 10 places receive Organization links. Do not guess organization matches or bulk-create rows without a deterministic reviewed mapping.
4. Run full-schema replay, rollback-only regression tests, publication audits, security advisors, and generated type checks.
5. Deploy additively; verify live behavior; only then enable new code paths.
6. Keep rollback/recovery steps explicit. Do not drop or repurpose the existing `places` table.

## 9. Acceptance criteria

- All existing published place UUIDs, slugs, canonical URLs, guide references, and public page behavior remain intact.
- Business/Organization and physical Place identity boundaries are explicit and documented.
- One Organization can own/operate multiple Place locations without duplicate business identity.
- A single-location independent business is modeled cleanly.
- Every published Place has one canonical profile URL and one stable Place entity ID.
- Organization references use one stable ID across all branch profiles.
- Category/locality and guide relationships point to canonical IDs, never duplicated profile records.
- Ambiguous candidates cannot auto-merge or auto-publish.
- Import is idempotent and private.
- Every published factual field has attributable evidence and an appropriate freshness rule.
- Structured data is truthful, type-appropriate, consistent across profiles/guides/locality pages, and matches visible content.
- Draft/unverified/duplicate/closed records cannot leak into public index or sitemap.
- Migration replay, rollback-only regression, RLS/grant checks, route/redirect tests, sitemap tests, and JSON-LD/entity-graph assertions pass.

## 10. Explicit non-goals

- No raw-count target as a success metric.
- No mass publication of every discovered candidate.
- No public merchant dashboard, claims workflow, write API, or open ingestion endpoint.
- No general-purpose graph database or polymorphic relationship engine.
- No automatic founder/owner identity collection or public person profiles.
- No separate public Organization page until user demand and editorial value justify it.
- No indexable thin category/neighborhood/filter permutations.
- No claim that structured data guarantees rankings, indexing, rich results, or LLM citations.

## 11. Open decisions before implementation

1. Confirm the exact meaning of current `places` records as physical location entities (current code and data strongly indicate yes).
2. Define how to resolve Organization identity for existing records: create a 1:1 Organization only when supported by official evidence, otherwise leave nullable pending review.
3. Define permitted Dallas-wide discovery sources and collection methods before any automated acquisition.
4. Choose private staging and import execution mechanism after a pilot design (do not expose service-role credentials to browser code).
5. Finalize Schema.org type mapping for every active category and the distinction between LocalBusiness location node and parent Organization node.

**Next step:** review this proposal, then implement only the additive Organization identity slice and private ingestion pilot infrastructure that are justified by the accepted contract. No production DDL or bulk import is included in this decision document.
