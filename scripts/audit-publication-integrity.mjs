import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

assert.ok(supabaseUrl, "NEXT_PUBLIC_SUPABASE_URL is required.");
assert.ok(anonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required.");

const supabase = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
const PAGE_SIZE = 500;
const now = new Date().toISOString();

async function fetchAll(table, columns, configure = (query) => query) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    let query = supabase.from(table).select(columns);
    query = configure(query);
    const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(`Read-only publication audit failed on ${table}: ${error.message}`);
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
}

const [
  places,
  facts,
  sources,
  categoryLinks,
  activeCategories,
  guides,
  guideSources,
  guidePlaces,
  neighborhoods,
] = await Promise.all([
  fetchAll("places", "id,slug,name,published_at,publication_status,neighborhood_id", (q) => q.eq("publication_status", "published")),
  fetchAll("place_facts", "place_id", (q) => q.eq("verification_status", "verified").or(`review_due_at.is.null,review_due_at.gte.${now}`)),
  fetchAll("place_sources", "place_id"),
  fetchAll("place_categories", "place_id,category_id,is_primary"),
  fetchAll("categories", "id", (q) => q.eq("is_active", true)),
  fetchAll("guides", "id,slug,title,published_at,reviewed_at,publication_status", (q) => q.eq("publication_status", "published")),
  fetchAll("guide_sources", "guide_id"),
  fetchAll("guide_places", "guide_id,place_id"),
  fetchAll("neighborhoods", "id,slug,name,publication_status", (q) => q.eq("publication_status", "published")),
]);

const currentFactPlaceIds = new Set(facts.map((row) => row.place_id));
const sourcedPlaceIds = new Set(sources.map((row) => row.place_id));
const activeCategoryIds = new Set(activeCategories.map((row) => row.id));
const primaryCategoryPlaceIds = new Set(
  categoryLinks
    .filter((row) => row.is_primary && activeCategoryIds.has(row.category_id))
    .map((row) => row.place_id),
);
const eligiblePlaceIds = new Set(
  places
    .filter((place) =>
      Boolean(place.published_at) &&
      currentFactPlaceIds.has(place.id) &&
      sourcedPlaceIds.has(place.id) &&
      primaryCategoryPlaceIds.has(place.id),
    )
    .map((place) => place.id),
);

const issues = [];
const duplicateGroups = (rows, key) => {
  const grouped = new Map();
  for (const row of rows) {
    const value = row[key];
    if (!value) continue;
    grouped.set(value, [...(grouped.get(value) ?? []), row]);
  }
  return [...grouped.entries()].filter(([, group]) => group.length > 1);
};

for (const place of places) {
  if (!place.slug?.trim()) issues.push(`Published place ${place.name} (${place.id}) has no slug.`);
  if (!place.published_at) issues.push(`Published place ${place.name} (${place.id}) has no published_at timestamp.`);
  if (!currentFactPlaceIds.has(place.id)) issues.push(`Published place ${place.name} (${place.slug}) has no current verified fact.`);
  if (!sourcedPlaceIds.has(place.id)) issues.push(`Published place ${place.name} (${place.slug}) has no visible source.`);
  if (!primaryCategoryPlaceIds.has(place.id)) issues.push(`Published place ${place.name} (${place.slug}) has no active primary category.`);
}

for (const [slug, group] of duplicateGroups(places, "slug")) {
  issues.push(`Duplicate published place slug "${slug}" across ${group.length} records.`);
}

const guideSourceIds = new Set(guideSources.map((row) => row.guide_id));
const guideEligiblePlaceIds = new Map();
for (const link of guidePlaces) {
  if (!eligiblePlaceIds.has(link.place_id)) continue;
  guideEligiblePlaceIds.set(link.guide_id, [...(guideEligiblePlaceIds.get(link.guide_id) ?? []), link.place_id]);
}

for (const guide of guides) {
  if (!guide.slug?.trim()) issues.push(`Published guide ${guide.title} (${guide.id}) has no slug.`);
  if (!guide.published_at) issues.push(`Published guide ${guide.title} (${guide.slug}) has no published_at timestamp.`);
  if (!guide.reviewed_at) issues.push(`Published guide ${guide.title} (${guide.slug}) has no review timestamp.`);
  if (!guideSourceIds.has(guide.id)) issues.push(`Published guide ${guide.title} (${guide.slug}) has no visible source.`);
  if (!(guideEligiblePlaceIds.get(guide.id)?.length)) issues.push(`Published guide ${guide.title} (${guide.slug}) has no linked eligible place.`);
}

for (const [slug, group] of duplicateGroups(guides, "slug")) {
  issues.push(`Duplicate published guide slug "${slug}" across ${group.length} records.`);
}

const eligibleNeighborhoods = neighborhoods.filter(
  (neighborhood) => places.filter((place) => place.neighborhood_id === neighborhood.id && eligiblePlaceIds.has(place.id)).length >= 3,
);

const report = {
  audit: "public-publication-integrity",
  readOnly: true,
  generatedAt: now,
  counts: {
    publishedPlaces: places.length,
    eligiblePlaces: eligiblePlaceIds.size,
    publishedGuides: guides.length,
    publishedNeighborhoods: neighborhoods.length,
    neighborhoodsMeetingThreePlaceThreshold: eligibleNeighborhoods.length,
  },
  issues,
};

console.log(JSON.stringify(report, null, 2));
if (issues.length > 0) {
  console.error(`Publication integrity audit found ${issues.length} issue(s).`);
  process.exitCode = 1;
} else {
  console.log("Publication integrity audit passed.");
}
