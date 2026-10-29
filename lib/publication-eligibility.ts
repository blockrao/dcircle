import type { createPublicSupabaseClient } from "@/lib/supabase";

type PublicSupabaseClient = ReturnType<typeof createPublicSupabaseClient>;

/**
 * Returns the IDs of published place records that have enough current,
 * publicly visible evidence to be indexed: a current verified fact, a source
 * exposed by its own RLS policy, and one active primary category.
 *
 * Candidate records must already come from the public published-place query.
 * This helper adds the content-quality gate shared by page rendering and the
 * sitemap; it does not replace database RLS.
 */
export async function getEligiblePlaceIds(
  supabase: PublicSupabaseClient,
  candidatePlaceIds: string[],
): Promise<Set<string>> {
  if (candidatePlaceIds.length === 0) return new Set();

  const now = new Date().toISOString();
  const [factsResult, sourcesResult, categoryLinksResult, activeCategoriesResult] =
    await Promise.all([
      supabase
        .from("place_facts")
        .select("place_id")
        .in("place_id", candidatePlaceIds)
        .eq("verification_status", "verified")
        .or(`review_due_at.is.null,review_due_at.gte.${now}`),
      supabase
        .from("place_sources")
        .select("place_id")
        .in("place_id", candidatePlaceIds),
      supabase
        .from("place_categories")
        .select("place_id,category_id,is_primary")
        .in("place_id", candidatePlaceIds),
      supabase
        .from("categories")
        .select("id")
        .eq("is_active", true),
    ]);

  if (
    factsResult.error ||
    sourcesResult.error ||
    categoryLinksResult.error ||
    activeCategoriesResult.error
  ) {
    throw new Error("Unable to verify current publication evidence for places.");
  }

  const placesWithCurrentFacts = new Set((factsResult.data ?? []).map((fact) => fact.place_id));
  const placesWithVisibleSources = new Set((sourcesResult.data ?? []).map((source) => source.place_id));
  const activeCategoryIds = new Set((activeCategoriesResult.data ?? []).map((category) => category.id));
  const placesWithActivePrimaryCategory = new Set(
    (categoryLinksResult.data ?? [])
      .filter((link) => link.is_primary && activeCategoryIds.has(link.category_id))
      .map((link) => link.place_id),
  );

  return new Set(
    candidatePlaceIds.filter((id) =>
      placesWithCurrentFacts.has(id) &&
      placesWithVisibleSources.has(id) &&
      placesWithActivePrimaryCategory.has(id),
    ),
  );
}
