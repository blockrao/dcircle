# Deep Ellum content inventory and research queue

**Prepared:** 30 October 2026  
**Status:** Editorial planning artifact; no production data changes  
**Purpose:** Reconcile the live inventory, identify missing user decisions, and prioritize source-led venue research before creating new records or publishing additional guides.

## Executive decision

The production audit and a read-only query of the DallasCircle Supabase project confirm **8 published Deep Ellum place profiles, 2 published guides, and 1 published neighborhood**. The previously discussed idea of adding seven profiles should not be treated as an approved target: several venues in the earlier candidate queue are already published.

The immediate objective is not a page-count target. It is to create a coherent, sufficiently researched Deep Ellum night-out journey across four real decisions:

1. Where to eat before a show.
2. Where food is genuinely available after 10 p.m.
3. Where to plan a date night, with transparent budget assumptions.
4. How to plan a weekend evening around a specific event.

Only add a place after exact-location verification, duplicate detection, official-source review, and fact-level provenance. Never create a record from a directory listing alone.

## 1. Current published inventory

Read-only production inventory query, 30 October 2026:

| Place | Primary / linked categories | Current price level | Editorial note |
|---|---|---:|---|
| Armoury D.E. | Restaurants; Bars | Not set | Official site distinguishes venue hours from kitchen hours; limited menu Tuesday/Wednesday. Strong late-night candidate, but keep menu caveat visible. |
| Cane Rosso | Restaurants | $$ | Existing profile; official Deep Ellum location page is available. |
| Deep Ellum Art Co. | Entertainment; Live music | Not set | Gallery, live music and outdoor Art Yard; food-vendor availability is event-dependent. |
| Merit Coffee | Cafes | Not set | Existing profile; dedicated Deep Ellum location page. Useful for daytime discovery, less central to the night-out wedge. |
| Pecan Lodge | Restaurants | Not set | Existing profile; current individual dine-in menu pricing was not established by the earlier price-evidence review. |
| Serious Pizza | Restaurants | $ | Existing profile; venue hours must not be represented as a guarantee of full menu availability at closing. |
| Three Links | Live music | Not set | Venue profile; event-specific age rules, ticketing, seating and show times must be checked against the individual event. |
| Trees | Live music | Not set | Venue profile; show and door times, age limits and seating vary by event. |

**Coverage observations**
- Restaurant/cafe profiles: 5 (Armoury D.E., Cane Rosso, Merit Coffee, Pecan Lodge, Serious Pizza).
- Live-music / entertainment profiles: 3 (Deep Ellum Art Co., Three Links, Trees).
- The inventory has only three restaurant-first profiles that clearly support the core evening dining decision; Merit Coffee is a cafe and should not be counted as a dinner option.
- Six of eight profiles have no price level. Missing values are preferable to unsupported estimates. Apply `docs/price-level-evidence-methodology.md` before setting any level.
- The 8 published places all had source records, current verified facts and editorial review timestamps in the production audit. The coverage audit found 14 current verified facts and no overdue facts at the time of the run.
- This is a point-in-time snapshot. Re-run the read-only audits before publishing a new batch.

## 2. Current published guides

| Guide | Linked places | Primary intent | Editorial assessment |
|---|---:|---|---|
| [How to plan dinner and live music in Deep Ellum](/guides/deep-ellum-dinner-and-live-music-plan) | 4 | Pair dinner with a live-music event | Useful event-planning framing. Needs a stronger actionable sequence and clear event-specific checks; not a live event calendar. |
| [Three Deep Ellum dinner stops to consider before a night out](/guides/three-deep-ellum-dinner-stops) | 3 | Compare three dinner options | Useful practical shortlist, but overlaps materially with the dinner-before-a-show theme. Its differentiator should be restaurant timing and menu considerations, not another generic dinner list. |

Both guides are published, reviewed, source-backed and linked to existing place records. They are not evidence that the four intended use cases are complete.

### Guide gaps

- **After 10 p.m.:** No dedicated guide. This is the highest-priority gap because late-night kitchen availability is a consequential, volatile fact and a clear user decision.
- **Date night:** No dedicated guide with transparent budget assumptions, atmosphere/occasion rationale, reservation links and current menu evidence.
- **Weekend planning:** No dedicated guide with a responsible event-to-dinner planning workflow. Avoid publishing a static event schedule unless it is maintained against official event sources.
- **Before a show:** Existing guides partially cover this. Improve and differentiate them before creating a third overlapping dinner list.

## 3. Prioritized candidate research queue

Candidates below are **not yet DallasCircle records** unless already listed in the published inventory above. The cited official pages establish an initial research lead only; they do not constitute a completed editorial review or approval to publish.

| Priority | Candidate | Official evidence located | Potential use case | Research blockers / next action |
|---|---|---|---|---|
| P1 | Ruins | [Official site](https://www.ruinsdeepellum.com/) lists 2653 Commerce St and describes food, cocktails and a restaurant/bar/venue concept. It publishes kitchen hours separately: Tue–Thu 4–10 p.m.; Fri 4 p.m.–2 a.m.; Sat/Sun 2 p.m.–2 a.m. | Dinner; late-night food, particularly Fri–Sun | Recheck exact current hours and menu immediately before fact entry. The official site states 21+ after 9 p.m.; preserve this as a clear access caveat and verify its current wording. |
| P1 | Brick & Bones — Deep Ellum | [Official location page](https://bricknbones.com/location/) says it moved from Elm Street after 10 years and identifies 2651 Commerce St, Dallas, TX 75226; it lists 4 p.m.–2 a.m. daily. [Official menu](https://bricknbones.com/menu/) exposes individual menu items and prices. | Dinner; late-night food; groups | Important address-change trap: older directories still show the former Elm Street address. Use 2651 Commerce only after checking the live location page at record creation. Confirm whether current kitchen service continues until stated closing time; venue hours alone are insufficient. |
| P1 | Off The Cuff | [Official contact page](https://www.otcdallas.com/contact-us-off-the-cuff-dallas/) identifies 2901 Elm Street and claims kitchen open until 2 a.m. daily. [Official homepage](https://www.otcdallas.com/) describes late-night food but says until 12 a.m. | Late-night food; sports/event night | **Conflicting official claims:** contact page says kitchen to 2 a.m.; homepage and late-night page say 12 a.m. Do not claim verified 2 a.m. kitchen service until the business confirms the discrepancy or the official pages are reconciled. Record the conflict internally. |
| P2 | Angry Dog | [Official site](https://www.angrydog.com/) identifies 2726 Commerce Street and publishes daily hours. [Official menu](https://www.angrydog.com/menu) provides menu items and prices. | Pre-show meal; casual dinner | Published hours currently show earlier closing than the late-night candidates; likely more useful for pre-show than after-10 p.m. Recheck menu and exact location before entry. |
| P3 | Nowhere | [Official visit page](https://www.nowheredtx.com/visit) identifies 2826 Elm St, offers Resy booking, and lists day-specific opening hours. | Possible date-night candidate | The initial official evidence is insufficient to characterize its food offering, typical spend or suitability. Review current menu and booking conditions before deciding whether to include it. |

### Discovery-only sources

The [Deep Ellum business directory](https://deepellum.com/restaurants/) and [Deep Ellum Texas explore page](https://www.deepellumtexas.com/explore/) are useful for finding candidates and cross-checking neighborhood association. They are not substitutes for a business-owned location page, current menu, or fact source. Do not copy their listings, opening hours, ratings or price labels into DallasCircle as verified facts.

## 4. Recommended first research batch

Research the first three P1 candidates in this order:

1. **Brick & Bones:** the documented move makes location accuracy especially important; official menu evidence also makes a useful profile and price-evidence review possible.
2. **Ruins:** the official site publishes separate kitchen hours and meaningful age/access caveats; it may add strong late-night coverage.
3. **Off The Cuff:** potentially valuable for the after-10 p.m. guide, but its own pages disagree on kitchen closing time. Resolve this before using it as a verified late-night recommendation.

Research Angry Dog in the next pre-show batch. Keep Nowhere in the queue until its menu and dining proposition are established.

For each candidate, the editor must:
- Confirm the exact operating Deep Ellum location and canonical business name.
- Search the live database for duplicate names, aliases, old addresses, moved locations and existing slugs.
- Prefer the business-owned location page for address and the business-owned menu/ordering page for menu claims.
- Record actual source URL, publisher, access timestamp and the specific fact supported.
- Keep unknown or conflicting fields null; do not infer.
- Mark facts verified only after reviewing the source and recording checked/review-due timestamps.
- Distinguish venue hours from kitchen hours and event-specific rules from permanent venue facts.
- Keep price level null unless the official-menu evidence satisfies `docs/price-level-evidence-methodology.md`.
- Draft public copy that explains why the place fits a decision, without rankings, invented first-hand experience or unsupported superlatives.
- Leave the record in draft until source linkage, taxonomy, duplicate checks and publication eligibility pass.

## 5. Guide production sequence

| Sequence | Guide / work item | Why this order | Minimum editorial bar |
|---|---|---|---|
| 1 | Differentiate the two existing pre-show guides | Avoid cannibalistic near-duplicates and improve the pages already indexed | Each page has a distinct intent, practical decision criteria, source-backed claims and contextual links to eligible profiles. |
| 2 | Where to eat in Deep Ellum after 10 p.m. | Strongest uncovered use case and clearest need for kitchen-hour provenance | Only include venues with verified kitchen availability for the stated time/day; show checked date and explicit uncertainty. |
| 3 | Deep Ellum date-night planning | Adds a different occasion rather than another generic list | Explain spend assumptions, menu evidence, reservation requirements and why each option suits the occasion. Do not imply guaranteed total bills. |
| 4 | Plan a weekend night in Deep Ellum | Connects dining with event intent and builds a repeat-use editorial format | Link to official event listings; event date, door time, age and ticket details are checked per event. No stale evergreen event schedule. |

## 6. Publication and discovery acceptance criteria

A new place or guide is not ready merely because it exists in Supabase.

**Place profile**
- One canonical place entity and stable slug; no duplicate location.
- Correct locality and taxonomy.
- Public facts have matching source records and current verification state.
- Unknown, conflicting and volatile facts are handled honestly.
- Profile answers a real local decision and links to official next steps.
- Publication eligibility passes; internal links and structured data are valid.

**Guide**
- Distinct searcher intent and substantial original decision-helping value.
- Every named venue links to its canonical place profile.
- Every factual/volatile claim has an appropriate source; source list is not a substitute for claim-level support.
- Sponsored status is false unless there is a real, disclosed sponsorship; payment must never determine editorial inclusion.
- Server-rendered content, canonical metadata, Article structured data, contextual internal links and sitemap eligibility pass the production route verifier.
- No unsupported claims of firsthand visits, rankings, popularity or guaranteed service.

After an approved content batch, run:
- `node scripts/audit-publication-integrity.mjs`
- `node scripts/audit-discovery-data-coverage.mjs`
- `node scripts/verify-live-routes.mjs` against the production site after deployment.

These are read-only verification steps; this document authorizes no production data writes or deployment.

## 7. Explicit decisions and non-goals

- Do not set an arbitrary target such as 15 profiles just to increase page count. Expand only when the four use cases have enough verified choices to help a user make a real decision.
- Do not create new place records for Cane Rosso, Merit Coffee, Trees, Three Links or Deep Ellum Art Co.; all are already published.
- Do not create a second canonical record for Brick & Bones because older directories show the previous Elm Street address. Verify whether any existing record or alias exists before creation.
- Do not use generic directory data, review-site ratings, scraped menus or old PDFs as the sole evidence for a current fact.
- Do not bulk-fill price levels.
- Do not create a calendar, merchant dashboard, marketplace, mobile app, or broad Dallas inventory as part of this editorial batch.
- Do not expand beyond Deep Ellum until the initial night-out product is useful and repeatable.

**Next execution step:** Complete source-by-source review of Brick & Bones, Ruins and Off The Cuff, then prepare draft-only record changes with exact provenance for editorial review. No live write is implied by this queue.
