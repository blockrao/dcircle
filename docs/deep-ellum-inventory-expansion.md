# Deep Ellum inventory expansion — research queue

**Prepared:** 2026-10-29  
**Purpose:** Build a prioritized, source-led queue for expanding DallasCircle's initial Deep Ellum inventory. This is a research and editorial queue, not an instruction to auto-publish. No venue in this document has been added to the live database by this file.

## Operating rule

Create a place record only after confirming the exact Dallas/Deep Ellum location, canonical name, category, address, official website, current source, and at least one useful fact. Keep uncertain fields null. Use the business's own location/menu/event page for venue-specific claims; use the neighborhood association or tourism directories only for discovery and cross-checking. Do not copy third-party ratings, rankings, opening hours, or claims of firsthand experience. Record source URL, access date, fact check date, and review due date. Avoid duplicate places and closed/moved locations.

## Candidate queue

| Priority | Candidate | Category | Official source | Initial verified details from source | Next editorial action |
|---|---|---|---|---|---|
| P1 | Cane Rosso — Deep Ellum | restaurant | https://canerosso.com/deep-ellum/ | Location page identifies 2612 Commerce St, Dallas, TX 75226; publishes location-specific hours and menus. | Verify address/category against existing records; extract a small set of stable facts and current menu evidence. Price level can be assessed from representative individual orders, not shared pizza assumptions. |
| P1 | Merit Coffee — Deep Ellum | cafe | https://meritcoffee.com/pages/deep-ellum | Location page identifies 2639 Main Street, Suite 140, Dallas, TX 75226; publishes hours and location information. | Verify exact canonical location and current hours; capture official source and useful café attributes without adopting promotional superlatives as independent editorial claims. |
| P1 | Trees | live_music | https://treesdallas.com/about/ | Venue page identifies 2709 Elm St, Dallas, TX 75226 and describes its live-entertainment role. | Verify current official venue page and current event/calendar URL; distinguish stable venue facts from changing show listings. |
| P1 | Three Links | live_music | https://www.threelinksdeepellum.com/about | Venue page identifies 2704 Elm Street, Dallas, TX and publishes general hours and event age-policy caveats. | Store only general venue facts; event-specific age restrictions and set times must link to/check the individual event. |
| P1 | Deep Ellum Art Co. | live_music | https://www.deepellumart.co/about | Official about page identifies 3200 Commerce St, Dallas, TX 75226 and describes a combined art-gallery, music-venue, and outdoor-yard concept. | Decide primary category according to DallasCircle taxonomy; if taxonomy only allows one category, use the principal discovery intent and preserve other attributes in factual copy. Verify hours on a current official page before recording. |
| P2 | Cane Rosso / dinner-before-a-show guide candidate | guide concept | https://canerosso.com/deep-ellum/ and https://treesdallas.com/ | Official sources establish a restaurant location and a live music venue. | Build a practical guide only after both place records are eligible and the walk/drive and show timing are checked. Do not imply a guaranteed route or current show. |
| P2 | Coffee before exploring Deep Ellum guide candidate | guide concept | https://meritcoffee.com/pages/deep-ellum and https://www.deepellumtexas.com/explore/ | Official café page plus neighborhood discovery source. | Publish only when several eligible cafés/attractions support a genuinely useful choice, not a thin two-link page. |

## Discovery sources (not substitutes for business-owned evidence)

- Deep Ellum Texas neighborhood association: https://www.deepellumtexas.com/explore/
- Deep Ellum directory: https://deepellum.com/venues/
- Deep Ellum Foundation neighborhood guide: https://deepellumfoundation.org/explore
- Visit Dallas neighborhood guide: https://www.visitdallas.com/neighborhoods/deep-ellum/

These sources are useful for discovering candidates and checking that a venue is associated with the neighborhood. The official business source remains preferred for the individual place's current details.

## Suggested batch

1. Research and prepare Cane Rosso and Merit Coffee as first additions because each has a dedicated official location page with useful stable facts.
2. Prepare Trees, Three Links, and Deep Ellum Art Co. as the entertainment batch after exact category and publication facts are checked.
3. Only after the place records are eligible, build one strong dinner-and-live-music guide linking to verified place pages.
4. Run the publication-integrity and discovery-coverage audits after any approved content writes.
5. Verify production deployment separately; a GitHub build passing does not prove the Cloudflare production release is active.

## Acceptance checklist for every candidate

- [ ] Not already present under another slug/name; not a duplicate or moved/closed location.
- [ ] Official location page confirms the specific Dallas/Deep Ellum venue.
- [ ] Canonical name, slug, category, address and official website checked.
- [ ] At least one useful factual item supported by a current official source.
- [ ] Source row has the actual official URL and current access timestamp.
- [ ] Fact is linked to that source, marked verified only after review, and given a review deadline.
- [ ] Optional price level remains null without sufficient current menu evidence.
- [ ] Public copy avoids unsupported rankings, reviews, and claims of personal experience.
- [ ] Internal notes are private and contain no secrets or personal data.
- [ ] Publication eligibility and internal links are audited before release.
