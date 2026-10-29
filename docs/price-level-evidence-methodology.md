# DallasCircle — Price-Level Evidence and Editorial Method

**Status:** Adopted editorial operating standard for the existing `places.price_level` field  
**Scope:** Published place profiles and Explore filtering  
**Safety rule:** This process is read-only until a separately reviewed content update is approved. Never infer or write a price level from a venue category, neighborhood, reputation, or a single non-representative menu item.

## Purpose

The price-level filter should help a person compare likely spend, not imply that DallasCircle knows an exact bill. Price levels are editorial summaries derived from current, attributable menu evidence. They are not a guarantee, and tax, tip, alcohol, special events, and changing menu prices can affect the final spend.

## Adopted level bands

Use the approximate expected spend for one adult ordering a representative individual meal, before tax and tip:

| Stored level | Display | Typical spend per adult |
| --- | --- | --- |
| 1 | $ | Up to $15 |
| 2 | $$ | More than $15 and up to $30 |
| 3 | $$$ | More than $30 and up to $60 |
| 4 | $$$$ | More than $60 |

These bands are an internal editorial convention, not a claim that every customer or order falls within the range. If the restaurant is primarily shared-plate, tasting-menu, event-based, or otherwise cannot be fairly represented by a typical individual meal, leave the field null until a suitable rule and evidence are documented.

## Evidence standard before setting a value

1. Prefer the official venue menu or official ordering page for the exact Dallas location.
2. Record the exact source URL and the date accessed. For a menu price, capture the item name, listed price, portion/serving context, and any visible location or menu applicability.
3. Use a representative individual order, not catering, bulk products, a whole pizza intended to be shared, retail merchandise, an outlier premium item, or an outdated third-party menu.
4. Where possible, check at least two representative individual options and a typical non-alcoholic drink. Estimate typical pre-tax, pre-tip spend using a reasonable solo order; document the calculation.
5. If the source has no prices, prices are ambiguous, or portion/serving assumptions materially change the level, keep `price_level` null. A missing value is better than false precision.
6. Re-check when a venue changes its menu or when existing evidence becomes stale. Do not extend the existing general fact-review timestamp to menu prices unless the menu itself was checked.
7. Do not describe the level as an exact price, guaranteed budget, or user-specific bill estimate.

## Current published inventory — research register

Research performed 29 October 2026. These findings are research notes, not database writes.

| Place | Public official evidence found | Evidence conclusion | Database action |
| --- | --- | --- | --- |
| Serious Pizza | [Official menu](https://www.seriouspizza.com/menus/) lists a huge slice at $5.75, build-your-own pizzas at $16.75 / $24.25 / $32.50 by size, specialty pizzas at $21.25 / $32.75 / $43.50 by size, and fountain drinks at $3. The official Dallas location page is [here](https://www.seriouspizza.com/location/dallas/). | A huge slice plus a $3 fountain drink totals $8.75 before tax/tip, which fits Level 1 under the adopted bands. This is a plausible solo-order example, not proof of average spend; check whether the menu is current and applicable to the Dallas location and document the chosen representative order before editorial approval. Whole-pie prices are not individual portions. | Keep null pending reviewed content update and provenance recording. |
| Pecan Lodge | [Official website](https://pecanlodge.com/) and [official in-house menu PDF](https://pecanlodge.com/wp-content/uploads/2024/09/PCL-menu-sep-24-2024.pdf) provide venue/menu context, but the located in-house menu is dated September 2024. Current official shop/catering prices are not equivalent to a current individual dine-in meal. | No sufficiently current, representative dine-in price evidence confirmed in this research pass. | Keep null. Find current official dine-in menu/ordering prices before review. |
| Armoury D.E. | [Official website](https://armouryde.com/) and [official menus page](https://armouryde.com/home/menus/) establish the food/drink offering, but a complete current priced menu could not be verified from the official pages in this pass. | Menu prices and a representative solo spend remain unverified. | Keep null. Seek a current official menu or direct confirmation before review. |

## Canonical evidence record contract

Use the existing canonical tables; no schema migration is required for the current workflow:

- Create or refresh a `place_sources` row for the exact official menu URL, with `source_type = official_menu`, publisher name, and current `accessed_at`.
- Store the reviewed estimate in `place_facts` using `fact_key = menu_price`, referencing that same source and place. Set `verification_status = verified` only after an editor confirms the representative order and level; set `checked_at` to the menu review time and `review_due_at` to the next scheduled review.
- Use a compact structured `fact_value` that records the proposed level, currency, before-tax/tip basis, representative order items and prices, total, and assumptions. Do not place private editorial notes in `fact_value`; keep those in `internal_notes`.
- The public price-level label and Explore price filter must require both a non-null `places.price_level` and a current verified `menu_price` fact backed by an `official_menu` source. If the evidence expires or is absent, do not expose a price level in Explore.
- The place profile should link the visible estimate directly to the official menu and show when the menu evidence was checked. The generic verified-fact list may also show the evidence details, so keep its structured value reader-friendly.

## Data and release safeguards

- This method does not change schema, row-level security, grants, publication eligibility, or live records.
- The read-only `npm run audit:coverage` command reports price-level coverage; absence of a price level is a prioritization signal, not an automatic publication failure.
- Do not expose price-level filtering as a reliable comparison until values are editorially reviewed against this method. Missing values must remain excluded from level-specific results rather than assigned a default.
- Any actual record update must be separately reviewed, source-linked, timestamped, and checked after saving. Do not bulk-populate levels from category names or scraped third-party snippets.

## Follow-up work

1. Review the Serious Pizza solo-order evidence and source it in the canonical record if accepted.
2. Obtain current official individual-meal pricing for Pecan Lodge and Armoury D.E.
3. Add an explicit menu-price fact/source record if the current schema supports it; otherwise propose a schema change separately rather than hiding menu-price evidence in unrelated fact fields.
4. After approved updates, rerun the read-only coverage audit and confirm the Explore filter displays only evidence-backed values.
