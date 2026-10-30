# DallasCircle — Draft place proposals: Brick & Bones and Ruins

**Prepared:** 30 October 2026  
**Status:** Draft-only editorial proposals; not production records  
**Scope:** Two candidate Deep Ellum place profiles for editorial review  
**Safety:** No Supabase writes, no publication, no deployment.

## Editorial decision

Prepare these two candidate profiles first because both are absent from the current canonical `places` inventory, have official business-owned location evidence, and plausibly serve the Deep Ellum night-out use case. Do not create live records until the exact location, current facts, editorial copy and source provenance are reviewed and approved.

The read-only production check found no place rows matching either candidate by name, known official domain or candidate street address. The existing Deep Ellum neighborhood is:
- `neighborhood_id`: `ee590d31-66bc-48f0-acdd-44b2577a7d5b`

Active category IDs:
- Restaurants: `4cf13076-d80f-4862-9bef-93432bc3239f`
- Bars: `d327bfe5-4871-4ff5-a279-876844527e4e`

These are proposed taxonomy associations, not saved rows.

---

## Proposal A — Brick & Bones

### Proposed canonical identity

| Field | Proposed value | Confidence / note |
|---|---|---|
| Name | Brick & Bones | Official site brand |
| Slug | `brick-and-bones-deep-ellum` | Proposed only; must pass unique-slug check immediately before insert |
| Address | 2651 Commerce St | Current official location page; explicitly relocated from Elm Street |
| City / region / postal | Dallas / TX / 75226 | Official location page |
| Phone | +1 469-914-6776 | Official location page |
| Website | https://bricknbones.com/location/ | Use official location page as location source |
| Neighborhood | Deep Ellum | Proposed existing neighborhood relation |
| Categories | Restaurants (primary), Bars (secondary) | Editorial classification; confirm category policy |
| Price level | `null` | Do not set from current evidence; see below |
| Publication status | `draft` | Must remain unpublished until acceptance gates pass |

### Draft public summary

> Brick & Bones is a Deep Ellum restaurant and bar serving Mexican-inspired Southern food, including fried chicken, wings and shareable sides, alongside cocktails. Its current location is on Commerce Street, and the venue lists daily late-night hours. Check the current menu and confirm kitchen availability before making a late-night trip.

This deliberately avoids saying the kitchen serves until 2 a.m.; the official location page publishes venue hours, not an explicit kitchen last-call time.

### Source register proposal

| Source URL | Type | Publisher | Supports |
|---|---|---|---|
| https://bricknbones.com/location/ | `official_website` | Brick & Bones | Current address, phone, move from Elm Street, published venue hours, parking/construction access note |
| https://bricknbones.com/menu/ | `official_menu` | Brick & Bones | Food and drink offering; listed menu prices |
| https://bricknbones.com/ | `official_website` | Brick & Bones | Business description and current brand/offer positioning |

Accessed/reviewed: 30 October 2026 (DallasCircle research pass). Refresh at record creation; record actual access timestamp in database.

### Candidate facts (draft only)

| fact_key | Proposed fact_value | Status |
|---|---|---|
| `address` | `{"street":"2651 Commerce St","city":"Dallas","region":"TX","postal_code":"75226"}` | Candidate verified from official location page; recheck on insert |
| `phone` | `{"value":"+1 469-914-6776"}` | Candidate verified from official location page; recheck on insert |
| `opening_hours` | `{"days":"daily","opens":"16:00","closes":"02:00","timezone":"America/Chicago","note":"Official venue hours; not confirmation of kitchen last call."}` | Candidate verified as venue hours only |
| `cuisine_or_food_style` | `{"description":"Mexican-inspired Southern cuisine; fried chicken, wings, bowls, sandwiches and sides."}` | Official menu and site |
| `parking_access` | `{"note":"Official location page notes nearby paid lots and limited street access during Commerce Street construction; recheck before publication."}` | Volatile; refresh before publishing |
| `kitchen_hours` | Not proposed | **Unknown.** Must not infer from venue hours. |

### Price-level assessment

Keep `places.price_level = null`. The current official menu lists individual dishes such as Naked Chicken ($12), BnB Bowl ($15), chicken sandwich ($15), wings ($10/$20), sides and cocktails. However, the current source review has not documented a representative individual meal plus typical non-alcoholic drink and serving assumptions under `docs/price-level-evidence-methodology.md`. Do not set a level based on one dish or cocktail prices.

### Publication blockers

1. Confirm the current official location page and exact operating entrance/address at the time of record creation.
2. Confirm kitchen last-call / final food order separately from venue closing.
3. Check whether the Commerce Street construction/access notice remains current.
4. Review current menu prices and serving context if price-level research is pursued.
5. Confirm proposed slug uniqueness and category associations.
6. Create source rows and fact rows only after editorial approval; keep all volatile facts on a short review interval.

---

## Proposal B — Ruins

### Proposed canonical identity

| Field | Proposed value | Confidence / note |
|---|---|---|
| Name | Ruins | Official site brand |
| Slug | `ruins-deep-ellum` | Proposed only; must pass unique-slug check immediately before insert |
| Address | 2653 Commerce St | Official site |
| City / region / postal | Dallas / TX / 75226 | Official site |
| Phone | +1 972-707-0607 | Official site |
| Website | https://www.ruinsdeepellum.com/ | Official site |
| Neighborhood | Deep Ellum | Proposed existing neighborhood relation |
| Categories | Restaurants (primary), Bars (secondary) | Proposed; confirm taxonomy policy |
| Price level | `null` | Official menu is image-led; no reliable representative pricing established |
| Publication status | `draft` | Must remain unpublished until acceptance gates pass |

### Draft public summary

> Ruins is a Deep Ellum restaurant, cocktail bar and music venue serving Mexican-focused food with Oaxacan influences, alongside dishes drawing on Central and South American and Caribbean cuisines. Its official site publishes separate kitchen hours by day and states that the venue is 21+ after 9 p.m. Check the day-specific kitchen schedule before visiting.

### Source register proposal

| Source URL | Type | Publisher | Supports |
|---|---|---|---|
| https://www.ruinsdeepellum.com/ | `official_website` | Ruins | Address, phone, cuisine positioning, day-specific kitchen hours, walk-in policy, access/age restriction |
| https://www.ruinsdeepellum.com/menu | `official_menu` | Ruins | Menu source; page is image-led and does not currently expose reliable menu pricing as text |
| https://www.ruinsdeepellum.com/food-and-drink | `official_menu` | Ruins | Food and drink imagery / offering context |

Accessed/reviewed: 30 October 2026 (DallasCircle research pass). Refresh at record creation; record actual access timestamp in database.

### Candidate facts (draft only)

| fact_key | Proposed fact_value | Status |
|---|---|---|
| `address` | `{"street":"2653 Commerce St","city":"Dallas","region":"TX","postal_code":"75226"}` | Candidate verified from official site; recheck on insert |
| `phone` | `{"value":"+1 972-707-0607"}` | Candidate verified from official site; recheck on insert |
| `kitchen_hours` | `{"tuesday_thursday":"16:00-22:00","friday":"16:00-02:00","saturday_sunday":"14:00-02:00","timezone":"America/Chicago"}` | Explicit official statement, but source header also has abbreviated hours that may be confusing; recheck directly before publication |
| `age_restriction` | `{"after":"21:00","minimum_age":21}` | Official site states venue is 21+ after 9 p.m.; verify whether this applies to all areas/events and retain exact wording |
| `walk_in_policy` | `{"note":"Official site says reservations are not required and walk-ins are welcome."}` | Candidate verified; recheck on insert |
| `food_style` | `{"description":"Mexican-focused cuisine with Oaxacan twists and dishes from Central and South America and the Caribbean."}` | Official site |
| `price_level` | Not proposed | Keep null; menu page is image-led and price evidence is not sufficiently readable/representative. |

### Hours interpretation and risk

The current official homepage body explicitly says:
- Tuesday–Thursday: kitchen 4 p.m.–10 p.m.
- Friday: kitchen 4 p.m.–2 a.m.
- Saturday–Sunday: kitchen 2 p.m.–2 a.m.

The page header also contains a compressed display resembling “4P–2A WedS–Fri / 2P–2A Sat–Sun,” which is less precise and appears to omit Tuesday. Use the explicit kitchen-hours paragraph only after direct recheck; if the inconsistency persists, ask the venue to confirm. Do not publish a simplified “open until 2 a.m. every day” claim.

### Publication blockers

1. Reconfirm kitchen hours with the official page immediately before fact entry; resolve header/body discrepancy if still present.
2. Confirm whether 21+ after 9 p.m. applies to the entire venue and all areas.
3. Confirm current address/phone and walk-in policy.
4. Keep price level null unless a readable current official menu and representative order evidence are available.
5. Confirm proposed slug uniqueness and category associations.
6. Record exact source URLs, access timestamps and fact-level links; set volatile kitchen-hours review due within 7 days.

---

## Proposed editorial role in the after-10 p.m. guide

| Candidate | Potential inclusion | Guardrail |
|---|---|---|
| Brick & Bones | Potential late-night food option | The official 4 p.m.–2 a.m. statement is venue hours. Do not claim food service until 2 a.m. without kitchen cutoff confirmation. |
| Ruins | Strong late-night kitchen candidate Friday/Saturday/Sunday | Publish day-specific kitchen hours and prominent 21+ after 9 p.m. caveat. Confirm the hours discrepancy first. |

Do not yet publish either as an after-10 p.m. guarantee. The guide should distinguish “venue open” from “kitchen serving,” show the relevant day, and give a clear “check before you go” note for volatile service details.

## Proposed database workflow (not executed)

After approval:
1. Re-run exact duplicate/slug/address checks.
2. Create each `places` row with `publication_status='draft'`, `price_level=null`, and existing Deep Ellum `neighborhood_id`.
3. Create `place_categories` associations using existing category IDs only after editorial category review.
4. Create `place_sources` rows for official location and menu pages with actual access timestamps.
5. Create `place_facts` only for facts whose source and exact meaning have been reviewed; use `verified` only for stable facts confirmed by the official source. Keep conflicting or unconfirmed kitchen claims unverified or absent.
6. Verify draft visibility and publication eligibility using read-only audit scripts.
7. Keep records unpublished until all profile, source, fact, internal-link, structured-data and route checks pass.

**No production database writes, publication, deployment, or configuration changes are authorized by this document.**
