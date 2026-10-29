import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getEligiblePlaceIds } from "@/lib/publication-eligibility";
import { createPublicSupabaseClient } from "@/lib/supabase";

const SITE_URL = "https://dallascircle.com";

// The same place-quality gate is used by the canonical place route and sitemap.
// Guide URLs require a reviewed guide, at least one visible source, and at least
// one linked place that itself passes the public place-quality gate.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const supabase = createPublicSupabaseClient();

  const [placesResult, guidesResult] = await Promise.all([
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
  ]);

  if (placesResult.error || guidesResult.error) {
    throw new Error("Unable to build sitemap from published content.");
  }

  const places = placesResult.data ?? [];
  const guides = guidesResult.data ?? [];
  const eligiblePlaceIds = await getEligiblePlaceIds(
    supabase,
    places.map((place) => place.id),
  );
  const guideIds = guides.map((guide) => guide.id);

  const [guideSourcesResult, guidePlacesResult] = await Promise.all([
    guideIds.length
      ? supabase.from("guide_sources").select("guide_id").in("guide_id", guideIds)
      : Promise.resolve({ data: [], error: null }),
    guideIds.length
      ? supabase.from("guide_places").select("guide_id,place_id").in("guide_id", guideIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (guideSourcesResult.error || guidePlacesResult.error) {
    throw new Error("Unable to verify guide publication completeness for the sitemap.");
  }

  const guidesWithSources = new Set((guideSourcesResult.data ?? []).map((source) => source.guide_id));
  const guidesWithEligiblePlaces = new Set(
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
    .filter((guide) => guidesWithSources.has(guide.id) && guidesWithEligiblePlaces.has(guide.id))
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
