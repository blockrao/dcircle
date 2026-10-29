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
const now = new Date();

async function fetchAll(table, columns, configure = (query) => query) {
  const rows = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    let query = supabase.from(table).select(columns);
    query = configure(query);
    const { data, error } = await query.range(offset, offset + PAGE_SIZE - 1);
    if (error) {
      throw new Error(`Read-only discovery coverage audit failed on ${table}: ${error.message}`);
    }
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) return rows;
  }
}

const [
  places,
  categoryLinks,
  categories,
  sources,
  facts,
] = await Promise.all([
  fetchAll("places", "id,slug,name,price_level,last_editorial_review_at,publication_status", (q) =>
    q.eq("publication_status", "published"),
  ),
  fetchAll("place_categories", "place_id,category_id,is_primary"),
  fetchAll("categories", "id,name,is_active"),
  fetchAll("place_sources", "id,place_id,accessed_at"),
  fetchAll("place_facts", "id,place_id,source_id,verification_status,checked_at,review_due_at"),
]);

const activeCategoryIds = new Set(categories.filter((category) => category.is_active).map((category) => category.id));
const activeCategoryNames = new Map(categories.filter((category) => category.is_active).map((category) => [category.id, category.name]));
const placeCategories = new Map();
for (const link of categoryLinks) {
  if (!activeCategoryIds.has(link.category_id)) continue;
  const names = placeCategories.get(link.place_id) ?? [];
  names.push(activeCategoryNames.get(link.category_id));
  placeCategories.set(link.place_id, names);
}

const sourcesByPlace = new Map();
for (const source of sources) {
  const list = sourcesByPlace.get(source.place_id) ?? [];
  list.push(source);
  sourcesByPlace.set(source.place_id, list);
}

const factsByPlace = new Map();
for (const fact of facts) {
  const list = factsByPlace.get(fact.place_id) ?? [];
  list.push(fact);
  factsByPlace.set(fact.place_id, list);
}

function latestDate(rows, field) {
  const values = rows.map((row) => row[field]).filter(Boolean).map((value) => new Date(value).getTime());
  return values.length ? new Date(Math.max(...values)).toISOString() : null;
}

const records = places.map((place) => {
  const placeSources = sourcesByPlace.get(place.id) ?? [];
  const placeFacts = factsByPlace.get(place.id) ?? [];
  const currentVerifiedFacts = placeFacts.filter(
    (fact) =>
      fact.verification_status === "verified" &&
      (!fact.review_due_at || new Date(fact.review_due_at).getTime() >= now.getTime()),
  );
  const overdueFacts = placeFacts.filter(
    (fact) => fact.review_due_at && new Date(fact.review_due_at).getTime() < now.getTime(),
  );
  return {
    slug: place.slug,
    name: place.name,
    hasActiveCategory: (placeCategories.get(place.id) ?? []).length > 0,
    categories: [...new Set(placeCategories.get(place.id) ?? [])].sort(),
    hasPriceLevel: place.price_level !== null && place.price_level !== undefined,
    priceLevel: place.price_level ?? null,
    hasSource: placeSources.length > 0,
    latestSourceAccessedAt: latestDate(placeSources, "accessed_at"),
    factCount: placeFacts.length,
    currentVerifiedFactCount: currentVerifiedFacts.length,
    latestFactCheckedAt: latestDate(placeFacts, "checked_at"),
    overdueFactCount: overdueFacts.length,
    hasEditorialReviewTimestamp: Boolean(place.last_editorial_review_at),
    lastEditorialReviewAt: place.last_editorial_review_at ?? null,
  };
});

const countWhere = (predicate) => records.filter(predicate).length;
const coverage = {
  publishedPlaces: records.length,
  withActiveCategory: countWhere((record) => record.hasActiveCategory),
  withPriceLevel: countWhere((record) => record.hasPriceLevel),
  withSource: countWhere((record) => record.hasSource),
  withCurrentVerifiedFact: countWhere((record) => record.currentVerifiedFactCount > 0),
  withEditorialReviewTimestamp: countWhere((record) => record.hasEditorialReviewTimestamp),
  withAnyFact: countWhere((record) => record.factCount > 0),
  withOverdueFacts: countWhere((record) => record.overdueFactCount > 0),
  totalFacts: records.reduce((total, record) => total + record.factCount, 0),
  totalCurrentVerifiedFacts: records.reduce((total, record) => total + record.currentVerifiedFactCount, 0),
};

const report = {
  audit: "public-discovery-data-coverage",
  readOnly: true,
  generatedAt: now.toISOString(),
  interpretation: "Coverage gaps are reported for prioritization; this audit does not infer missing values or fail publication solely because optional price-level data is absent.",
  coverage,
  gaps: {
    missingActiveCategory: records.filter((record) => !record.hasActiveCategory).map((record) => record.slug),
    missingPriceLevel: records.filter((record) => !record.hasPriceLevel).map((record) => record.slug),
    missingSource: records.filter((record) => !record.hasSource).map((record) => record.slug),
    missingCurrentVerifiedFact: records.filter((record) => record.currentVerifiedFactCount === 0).map((record) => record.slug),
    missingEditorialReviewTimestamp: records.filter((record) => !record.hasEditorialReviewTimestamp).map((record) => record.slug),
    overdueFacts: records.filter((record) => record.overdueFactCount > 0).map((record) => ({ slug: record.slug, count: record.overdueFactCount })),
  },
  places: records,
};

console.log(JSON.stringify(report, null, 2));
