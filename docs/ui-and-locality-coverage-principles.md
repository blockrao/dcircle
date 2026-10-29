# DallasCircle — UI, Editorial Breadth & Locality Coverage Principles

**Status:** Product/architecture decision  
**Inspiration reference:** [DailyDFW](https://www.dailydfw.com/) — breadth of local topics, scannable editorial entry points, and locality discovery  
**Product identity:** DallasCircle's own design, content voice, editorial standards, and visual system  
**Initial complete coverage area:** Deep Ellum, Dallas

## Decision

DallasCircle should grow beyond a single-purpose nightlife guide into a broad, editorial-led local discovery platform. The UI should make a variety of useful local information easy to browse, while locality is a first-class way to navigate and filter that information.

DailyDFW is a reference for the *breadth and organization* of local information, not a pixel-copy target. DallasCircle should not replicate its design, wording, brand, or business model.

## Experience principles

1. **Editorial homepage, not a directory wall.** Use a clear lead story/guide, timely items only where freshness can be maintained, topic entry points, locality discovery, and curated collections.
2. **Topic breadth with a clear hierarchy.** Potential topic families include Food & Drink, Things to Do, Arts & Culture, Events, Neighborhood Guides, Parks & Outdoors, Family, Shopping, Local News & Updates, and Practical Local Information. These are taxonomy directions, not a statement that every section is live or staffed.
3. **Locality-aware browsing.** People should be able to choose a locality and see the relevant topics, guides, places, and timely information for that area.
4. **Consistent responsive navigation.** Primary topic and locality destinations must be easy to reach on mobile, keyboard accessible, and represented by ordinary crawlable links.
5. **Useful landing pages.** Topic and locality pages must provide meaningful local context, curated content, linked entities, and clear scope—not just a heading and a list of links.
6. **Trust cues are part of the UI.** Show source context, last-checked information, uncertainty, corrections, and sponsorship labels where relevant.
7. **No empty-shell indexing.** The ambition to cover every locality does not justify generating thin pages. A planned locality can be visible in navigation/coverage planning without being an indexable public landing page.

## Locality model

Treat locality as a canonical data entity, not a string copied into page code. The registry should eventually record:
- stable ID and canonical slug;
- display name and locality type (neighborhood, city, district, etc.);
- parent locality/municipality where appropriate;
- verified geographic reference or boundary where available;
- coverage status and supported topic areas;
- linked canonical places, venues, guides, events, and sources;
- source inventory, last reviewed date, and editorial review cadence.

Use consistent locality IDs across navigation, entity relationships, guide/profile pages, metadata, feeds, and future search/maps. Do not conflate neighborhood, city, district, and county concepts.

## Coverage planning and publication

Maintain a **locality × topic coverage matrix**. For each cell, record status (not planned, planned, researching, minimum coverage met, published, needs refresh), useful source inventory, linked entities, editorial owner, and review needs.

A locality/topic page becomes indexable only when it has enough verified inventory and unique useful content to meet its page-type publication threshold. A database record, URL, or planned launch wave is not sufficient. Use the same eligibility contract for rendering, canonical metadata, internal links, and sitemap inclusion.

Roll out in waves:
1. Prove the design system and editorial model with the Deep Ellum launch slice.
2. Establish the locality registry and topic taxonomy without publishing empty shells.
3. Expand into adjacent Dallas localities/topics where research sources and useful inventory are ready.
4. Measure user demand, content freshness, and maintenance effort; then broaden coverage systematically.

## UI building blocks

Implement reusable, responsive components within the existing Next.js, TypeScript, Tailwind, and Supabase architecture:
- editorial lead/feature block;
- story and guide cards with consistent metadata;
- topic navigation;
- locality selector and locality directory;
- curated topic/locality sections;
- related guides and places;
- source/freshness/correction/sponsorship cues;
- accessible mobile navigation and search entry point.

Do not introduce a second database, a generic directory template, or large new infrastructure just to support this direction. First design the page hierarchy and responsive visual system, then implement a small, testable vertical slice.

## Acceptance criteria

- Homepage communicates the breadth ambition and the first supported coverage area honestly.
- Main topic and locality navigation have a clear hierarchy and work on mobile.
- Locality type and parent relationships are explicit in the data model before broad rollout.
- Locality/topic coverage can be measured and gaps are visible to the team.
- No empty or thin locality/topic pages enter the sitemap.
- All published topic/locality pages have unique purpose, canonical URLs, relevant internal links, source-backed content, and correct metadata.
- The interface uses DallasCircle's own visual identity rather than copying DailyDFW.
