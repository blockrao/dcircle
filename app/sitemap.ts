import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase";

const SITE_URL = "https://dallascircle.com";

// Sitemap eligibility follows the same published-record contract as the pages.
export const instant = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const supabase = createPublicSupabaseClient();
  const [placesResult, guidesResult] = await Promise.all([
    supabase
      .from("places")
      .select("slug,updated_at")
      .eq("publication_status", "published")
      .not("published_at", "is", null),
    supabase
      .from("guides")
      .select("slug,updated_at")
      .eq("publication_status", "published")
      .not("published_at", "is", null)
      .not("reviewed_at", "is", null),
  ]);

  if (placesResult.error || guidesResult.error) {
    throw new Error("Unable to build sitemap from published content.");
  }

  const staticRoutes = [
    { route: "", priority: 1, changeFrequency: "weekly" as const },
    { route: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { route: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
  ];
  const placeRoutes = (placesResult.data ?? []).map((place) => ({
    route: `/places/${place.slug}`,
    lastModified: place.updated_at,
    priority: 0.7,
    changeFrequency: "weekly" as const,
  }));
  const guideRoutes = (guidesResult.data ?? []).map((guide) => ({
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
