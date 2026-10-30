# DallasCircle — Canonical Merchant & Founder Entity Architecture

**Status:** Product and architecture decision  
**Applies to:** Merchant/place profiles, editorial pages, localities, topics, collections, structured data, internal linking, filters, and optional founder profiles

## 1. Core decision

A canonical merchant profile is a foundational entity in DallasCircle, not merely a listing template.

Every merchant that qualifies for public publication must have:
- one stable internal merchant/entity ID;
- one permanent public profile URL;
- one canonical URL and self-referencing canonical tag;
- one authoritative structured profile record;
- one consistent, immutable entity identifier for structured data and cross-page references, derived from the internal UUID rather than the mutable slug;
- explicit category, locality, source, fact, freshness, correction, and publication relationships.

The same merchant record and canonical URL must be reused in all DallasCircle guides, articles, locality pages, topic pages, curated collections, and ranked lists. Do not create separate merchant copies for different editorial contexts.

Google treats canonicalization as a signal-based process, not a guarantee. Align redirects, canonical tags, sitemap inclusion, and internal links around the same preferred URL. References: [Google canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization) and [canonical URL best practices](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## 2. Merchant profile URL contract

Choose one route pattern before broad inventory creation and keep it stable. The exact route must be checked against existing routes and slug conventions before implementation; a suitable candidate is:

`/places/{merchant-slug}`

The route should not encode a mutable category or locality in a way that forces a URL change when a business is reclassified or relocates. The profile should contain canonical locality/category relationships as data.

Rules:
- Unique current slug and immutable internal ID.
- Stable place entity URI: `https://dallascircle.com/id/place/{uuid}`. This identifier is not a navigational profile route and must not change when the public slug changes.
- The canonical profile URL remains `https://dallascircle.com/places/{current-slug}`; emit it as the page URL and `mainEntityOfPage`, separately from the stable entity `@id`.
- Reserve historical slugs permanently for the same place entity. A historical profile URL must issue a permanent 308 redirect to the current canonical profile. Never let a historical slug silently resolve to a different place.
- One canonical URL per merchant entity; no category/locality/filter-specific duplicate profile URLs.
- If a slug changes, preserve the old slug in `place_slug_history`, issue a permanent 308 redirect from the old URL, update internal links, canonical metadata, and sitemap. Historical slugs cannot be reassigned to another place.
- If a merchant closes, handle closure status and the page according to evidence and user value; do not automatically recycle the URL for another merchant.
- Distinguish one business/brand from multiple physical locations. When branches have materially different addresses or customer-facing details, model the business/organization and location entities appropriately rather than merging them into one misleading listing.
- Never publish a profile solely because a row exists; apply explicit completeness, evidence, and editorial thresholds.

## 3. Merchant page content and data contract

The profile should provide genuine decision value, with fields populated only when available and supported:

### Identity and classification
- Display name, stable ID, slug, business type and most specific supported category.
- Physical location/address and locality relationship, where applicable.
- Official website and verified official contact, booking, menu, or reservation links where relevant.
- Distinction between business/brand and individual location where required.
- Operating status, including closed/temporarily unavailable states where verified.

### Practical decision facts
- Source-backed summary and what the business offers.
- Relevant hours versus kitchen/service hours, where reliably sourced.
- Price/budget information with clear meaning and checked date.
- Accessibility, dietary, family/group, late-night, and occasion-fit details only when verified and useful.
- Nearby venues, locality, and relevant guides/collections.
- Official next-step links, not fabricated links or unsupported availability claims.

### Trust and operations
- Source references and verification status for important facts.
- Last-checked/review-due context for volatile facts.
- Clear correction/report-an-issue path.
- Editorial inclusion rationale where useful.
- Visible sponsorship disclosure kept separate from factual verification and editorial ranking.
- Optional founder section only under the opt-in rules below.

The page should be useful to a person before it is optimized for machine extraction. Avoid generic AI filler, unsupported superlatives, fabricated reviews, ratings, popularity, awards, or firsthand claims.

## 4. Structured data and search/LLM discoverability

Generate structured data from the same canonical record used to render the page, not from a separately hard-coded JSON blob.

- Select the most specific truthful Schema.org subtype (for example, `Restaurant` when the entity is actually a restaurant; otherwise a suitable `LocalBusiness` subtype).
- Use a stable entity `@id` that remains consistent wherever the merchant is referenced.
- Ensure `url`, canonical URL, entity ID, visible name, address, official website, and other emitted facts agree.
- Use properties such as `sameAs` only for genuine official/identity links, not arbitrary directory URLs.
- Include founder relationships only when verified and supported by visible page content.
- Do not invent aggregate ratings, reviews, opening hours, prices, geo-coordinates, awards, ownership, or founder claims.
- Validate JSON-LD syntax, expected entity types, required/recommended properties where applicable, and parity between structured data and visible content.
- Use the same merchant identity in article/guide references, breadcrumbs, related-entity links, and page metadata where appropriate.

Primary references: [Google Local Business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business) and [Schema.org LocalBusiness](https://schema.org/LocalBusiness). Structured data may improve machine understanding and eligibility for supported search features, but it does not guarantee rich results, rankings, indexing, or citations by AI systems.

## 5. Cross-page entity graph and directory behavior

All content must reference canonical merchant IDs, then resolve those IDs to canonical public URLs at render time.

Expected relationships include:
- merchant ↔ locality;
- merchant ↔ category/topic;
- merchant ↔ guide/article;
- merchant ↔ collection/ranked list;
- merchant ↔ venue/event where evidence supports it;
- merchant ↔ founder Person, only where consented and verified;
- founder Person ↔ multiple businesses, with a distinct relationship role and evidence for each.

Filters and groupings should query structured fields and relationships. They must not create new merchant entities or duplicate profiles. Filter states can be useful to visitors, but do not make every query combination an indexable page by default. Only curated, genuinely useful category/locality/occasion landing pages that meet publication thresholds should be indexed.

## 6. Founder profiles — a distinctive opt-in feature

DallasCircle may offer a founder profile that highlights the person behind a business, making the platform more human and editorially distinctive than a conventional directory.

This must be a separate, canonical Person entity—not a text field copied into every business page.

### Consent and verification rules
1. The founder or an authorized representative explicitly opts in to the profile.
2. Identity and the claimed founder/co-founder relationship are verified using reliable sources and/or authorized confirmation.
3. Consent and scope for publishing biography, portrait, quotes, and supplied materials are recorded.
4. The person reviews factual claims and can request corrections; editorial independence and correction policy remain intact.
5. The page has a real editorial purpose and enough verified content to meet a publication threshold.
6. If consent is absent or withdrawn, do not publish or continue using the person's optional profile material; follow the documented review/removal workflow.
7. Never infer that a promoter, current owner, CEO, manager, or operator is the founder. Record roles precisely, including multiple founders where verified.

### Possible profile content
- Name and approved portrait.
- Founder/co-founder role and the specific business(es) connected to the person.
- Verified founding story, motivation, timeline, and approved quotations.
- How the business serves its locality or community, with source context.
- Links to the canonical merchant profiles.
- Clear correction/contact information.

Do not fabricate an interview, quote, first-person account, or personal history. Founder participation does not buy favorable editorial coverage or guaranteed inclusion in guides.

### Structured data
Use Schema.org `Person` for a qualifying founder profile and link it to the merchant/organization with a truthful `founder` relationship. The merchant's structured data may also express `founder` where the relationship is verified and visible. Keep a stable `@id` for the person and distinct entity IDs for the person and business. See [Schema.org LocalBusiness](https://schema.org/LocalBusiness), which supports a `founder` relationship to a Person or Organization.

## 7. Publication, indexing, and quality gates

A merchant profile is eligible for public indexing only when:
- identity and location/operating context are sufficiently clear;
- the page contains meaningful, source-backed information;
- required category/locality and publication relationships are valid;
- key facts meet freshness and evidence requirements;
- canonical URL, metadata, structured data, and internal links are consistent;
- the page is server-rendered, returns the correct status, and passes automated checks.

A founder profile additionally requires recorded opt-in, verified identity/role, approved profile material, and its own completeness threshold.

Rendering, internal links, structured data, and sitemap generation must share the same publication eligibility contract. Unpublished, duplicate, thin, withdrawn, or unreviewed entities must not leak into the public sitemap.

## 8. Acceptance criteria for implementation

- Every published merchant resolves to exactly one stable canonical profile URL.
- Guides/articles/collections link to that URL and do not create duplicate merchant copies.
- Merchant ID and structured-data `@id` are stable across content contexts and slug changes; the canonical profile URL and `mainEntityOfPage` use the current slug.
- A slug change creates a historical alias and a permanent redirect; old slugs cannot be reused by another place.
- Guides and neighborhood ItemLists reference the exact same immutable place `@id` emitted by the canonical profile.
- Slug-change redirects and canonical/sitemap updates are tested.
- Merchant category/locality filters use canonical relations and do not generate indexable thin variants.
- JSON-LD matches visible content and uses an appropriate business subtype.
- No unsupported ratings, reviews, opening hours, coordinates, founder, or ownership claims are emitted.
- Founder profiles require explicit opt-in and verified relationship evidence; roles remain distinct.
- Corrections, consent status, source provenance, freshness, and sponsorship disclosures are operationally represented.
- Automated tests cover canonical URL, redirect behavior, sitemap eligibility, JSON-LD, entity links, and founder consent/publication rules.
