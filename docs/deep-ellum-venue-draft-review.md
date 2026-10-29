# Deep Ellum venue records — editorial preparation

Prepared 2026-10-29. This is a review artifact, not a database seed or publication instruction. Venue records must be duplicate-checked and reviewed against current official sources before any live write.

## 1. Trees

- Canonical candidate slug: `trees-deep-ellum`
- Name: Trees
- Primary category: `live-music`
- Address: 2709 Elm Street, Dallas, TX 75226
- Phone: (214) 741-1122
- Official source: https://treesdallas.com/about/
- Stable supported facts: venue is a live-entertainment space; official FAQ says show and door times are listed per event and seating varies by show.
- Keep event schedule, age limits and seating arrangements event-specific. Official site states some shows have 18+/21+ restrictions and policies may vary.
- Suggested source facts: address/phone from official About page; event-policy caveat from official FAQ.
- Do not set price level without representative current food/menu evidence.

## 2. Three Links

- Canonical candidate slug: `three-links-deep-ellum`
- Name: Three Links
- Primary category: `live-music`
- Address: 2704 Elm Street, Dallas, TX 75226
- Phone: +1 214-484-6011
- Official source: https://www.threelinksdeepellum.com/about
- Officially listed general hours: Monday–Thursday 2 PM–2 AM; Friday–Sunday noon–2 AM (America/Chicago). Re-check before any publication because hours may change.
- Stable supported facts: venue hosts live events; age policy, ticket requirements, seating and show times vary by event. The official page directs visitors to each event listing for restrictions.
- Important discrepancy: a third-party AXS listing surfaced a different street number (3704 Elm Street) than the venue's own page (2704 Elm Street). Prefer the venue-owned address for the draft and flag the third-party discrepancy for manual resolution; do not let third-party data override the official source.

## 3. Deep Ellum Art Co.

- Canonical candidate slug: `deep-ellum-art-company`
- Name: Deep Ellum Art Co.
- Primary category: `entertainment` (keep live music and art-gallery concepts in editorial attributes/copy; existing category taxonomy supports one primary category plus linked categories).
- Address: 3200 Commerce Street, Dallas, TX 75226
- Official source: https://www.deepellumart.co/about
- Stable supported facts: mixed-use creative venue with an art gallery, music venue and outdoor Art Yard; official page says it is open seven days a week.
- Food-vendor availability is event-dependent; never present food trucks as guaranteed every day. Seating and bag policies can be event-dependent.
- Suggested fact: `venue_features` JSON listing gallery, live music, outdoor Art Yard, with the official source. Do not create an unsupported generic daily-hours fact from third-party pages.

## Shared data rules

1. Draft status only until duplicate detection, fact verification and editorial review are complete.
2. Create official source rows with actual canonical source URL, publisher name and access timestamp.
3. Mark facts verified only when the exact claim is supported by the cited source. Give each fact a review deadline.
4. Keep optional fields null if not confirmed; don't guess prices, coordinates, photos, category taxonomy, or opening hours.
5. Never copy third-party ratings or rankings into DallasCircle's own editorial claims.
6. Do not publish event-specific schedule, age policy or seating as a permanent venue guarantee.
7. After draft creation, verify category linkage, source linkage, no duplicate slug/name, and that public reads do not expose draft records.
8. Run publication integrity and discovery coverage audits before publication. No production deployment is implied by this research.
