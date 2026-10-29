import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase";

const SITE_URL = "https://dallascircle.com";

// Keep sitemap eligibility aligned with the requirements enforced by each page:
// current verified fact + visible source + active primary category for places;
// reviewed publication + visible source + at least one visible published place
// for guides. Public RLS policies remain the final data-access boundary.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const supabase = createPublicSupabaseClient();
  const now = new Date().toISOString();

  const [placesResult, guidesResult, activeCategoriesResult] = await Promise.all([
    supabase
      .from("places")
      .select("id,slug,updated_at")
      .eq("publication_status", "published")
      .not("published_at", "is", null),
    supabase
      .from("guides")
      .select("id,slug,updated_at")
      .eq("publication_status", "published")
      .not("published_at", "is", null)
      .not("reviewed_at", "is", null),
    supabase
      .from("categories")
      .select("id")
      .eq("is_active", true),
  ]);

  if (placesResult.error || guidesResult.error || activeCategoriesResult.error) {
    throw new Error("Unable to build sitemap from published content.");
  }

  const places = placesResult.data ?? [];
  const guides = guidesResult.data ?? [];
  const placeIds = places.map((place) => place.id);
  const guideIds = guides.map((guide) => guide.id);

  const [
    currentFactsResult,
    visibleSourcesResult,
    placeCategoriesResult,
    guideSourcesResult,
    guidePlacesResult,
  ] = await Promise.all([
    placeIds.length
      ? supabase
          .from("place_facts")
          .select("place_id")
          .in("place_id", placeIds)
          .eq("verification_status", "verified")
          .or(`review_due_at.is.null,review_due_at.gte.${now}`)
      : Promise.resolve({ data: [], error: null }),
    placeIds.length
      ? supabase.from("place_sources").select("place_id").in("place_id", placeIds)
      : Promise.resolve({ data: [], error: null }),
    placeIds.length
      ? supabase
          .from("place_categories")
          .select("place_id,category_id,is_primary")
          .in("place_id", placeIds)
      : Promise.resolve({ data: [], error: null }),
    guideIds.length
      ? supabase.from("guide_sources").select("guide_id").in("guide_id", guideIds)
      : Promise.resolve({ data: [], error: null }),
    guideIds.length
      ? supabase.from("guide_places").select("guide_id,place_id").in("guide_id", guideIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (
    currentFactsResult.error ||
    visibleSourcesResult.error ||
    placeCategoriesResult.error ||
    guideSourcesResult.error ||
    guidePlacesResult.error
  ) {
    throw new Error("Unable to verify publication completeness for the sitemap.");
  }

  const activeCategoryIds = new Set((activeCategoriesResult.data ?? []).map((category) => category.id));
  const placesWithCurrentFacts = new Set((currentFactsResult.data ?? []).map((fact) => fact.place_id));
  const placesWithVisibleSources = new Set((visibleSourcesResult.data ?? []).map((source) => source.place_id));
  const placesWithActivePrimaryCategory = new Set(
    (placeCategoriesResult.data ?? [])
      .filter((link) => link.is_primary && activeCategoryIds.has(link.category_id))
      .map((link) => link.place_id),
  );
  const eligiblePlaceIds = new Set(
    places
      .filter((place) =>
        placesWithCurrentFacts.has(place.id) &&
        placesWithVisibleSources.has(place.id) &&
        placesWithActivePrimaryCategory.has(place.id),
      )
      .map((place) => place.id),
  );

  const guidesWithSources = new Set((guideSourcesResult.data ?? []).map((source) => source.guide_id));
  const guidesWithVisiblePlaces = new Set(
    (guidePlacesResult.data ?? [])
      .filter((link) => eligiblePlaceIds.has(link.place_id))
      .map((link) => link.guide_id),
  );

  const staticRoutes = [
    { route: "", priority: 1, changeFrequency: "weekly" as const },
    { route: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { route: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  const placeRoutes = places
    .filter((place) => eligiblePlaceIds.has(place.id))
    .map((place) => ({
      route: `/places/${place.slug}`,
      lastModified: place.updated_at,
      priority: 0.7,
      changeFrequency: "weekly" as const,
    }));

  const guideRoutes = guides
    .filter((guide) => guidesWithSources.has(guide.id) && guidesWithVisiblePlaces.has(guide.id))
    .map((guide) => ({
      route: `/guides/${guide.slug}`,
      lastModified: guide.updated_at,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    }));

  const routes: MetadataRoute.Sitemap = [];
  for (const item of [...staticRoutes, ...placeRoutes, ...guideRoutes]) {
    const lastModified =
      "lastModified" in item && typeof item.lastModified === "string"
        ? item.lastModified
        : undefined;
    routes.push({
      url: `${SITE_URL}${item.route}`,
      lastModified,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    });
  }

  return routes;
}
