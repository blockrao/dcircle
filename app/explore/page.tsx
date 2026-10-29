import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { getEligiblePlaceIds } from "@/lib/publication-eligibility";
import { createPublicSupabaseClient } from "@/lib/supabase";
import ExploreSearch, { type ExploreSearchItem } from "@/app/components/ExploreSearch";

const SITE_URL = "https://dallascircle.com";
const MINIMUM_ELIGIBLE_PLACES = 3;

export const metadata: Metadata = {
  title: "Explore Dallas | Neighborhoods, Guides & Local Places",
  description:
    "Explore DallasCircle's source-backed neighborhood guides, practical local guides, and place profiles. Coverage grows only when information meets our publication standards.",
  alternates: { canonical: "/explore" },
  openGraph: {
    type: "website",
    title: "Explore Dallas | Neighborhoods, Guides & Local Places",
    description:
      "Browse DallasCircle's source-backed neighborhood guides, practical local guides, and place profiles.",
    url: "/explore",
  },
};

type Neighborhood = {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  description: string | null;
  updated_at: string | null;
};

type Place = {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  neighborhood_id: string | null;
  price_level: number | null;
  categories: string[];
};

type Guide = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  reviewed_at: string | null;
};

async function getExploreData() {
  await connection();
  const supabase = createPublicSupabaseClient();
  const [neighborhoodsResult, placesResult, guidesResult] = await Promise.all([
    supabase
      .from("neighborhoods")
      .select("id,slug,name,city,region,description,updated_at")
      .eq("publication_status", "published")
      .order("name", { ascending: true }),
    supabase
      .from("places")
      .select("id,slug,name,summary,neighborhood_id,price_level")
      .eq("publication_status", "published")
      .not("published_at", "is", null)
      .order("name", { ascending: true }),
    supabase
      .from("guides")
      .select("id,slug,title,summary,reviewed_at")
      .eq("publication_status", "published")
      .not("published_at", "is", null)
      .not("reviewed_at", "is", null)
      .order("reviewed_at", { ascending: false }),
  ]);

  if (neighborhoodsResult.error || placesResult.error || guidesResult.error) {
    return { neighborhoods: [] as Neighborhood[], places: [] as Place[], guides: [] as Guide[], loadError: true };
  }

  const neighborhoods = (neighborhoodsResult.data ?? []) as Neighborhood[];
  const placeRows = (placesResult.data ?? []) as Place[];
  const guideRows = (guidesResult.data ?? []) as Guide[];
  let eligiblePlaceIds: Set<string>;

  try {
    eligiblePlaceIds = await getEligiblePlaceIds(supabase, placeRows.map((place) => place.id));
  } catch {
    return { neighborhoods: [] as Neighborhood[], places: [] as Place[], guides: [] as Guide[], loadError: true };
  }

  const places = placeRows.filter((place) => eligiblePlaceIds.has(place.id));
  const [placeCategoriesResult, categoriesResult] = places.length
    ? await Promise.all([
        supabase.from("place_categories").select("place_id,category_id").in("place_id", places.map((place) => place.id)),
        supabase.from("categories").select("id,name").eq("is_active", true),
      ])
    : [{ data: [], error: null }, { data: [], error: null }];
  if (placeCategoriesResult.error || categoriesResult.error) {
    return { neighborhoods: [] as Neighborhood[], places: [] as Place[], guides: [] as Guide[], loadError: true };
  }
  const categoryNames = new Map((categoriesResult.data ?? []).map((category) => [category.id, category.name]));
  const categoriesByPlace = new Map<string, string[]>();
  for (const link of placeCategoriesResult.data ?? []) {
    const name = categoryNames.get(link.category_id);
    if (!name) continue;
    categoriesByPlace.set(link.place_id, [...(categoriesByPlace.get(link.place_id) ?? []), name]);
  }
  const placesWithCategories = places.map((place) => ({
    ...place,
    categories: [...new Set(categoriesByPlace.get(place.id) ?? [])],
  }));
  const eligibleNeighborhoods = neighborhoods.filter(
    (neighborhood) =>
      placesWithCategories.filter((place) => place.neighborhood_id === neighborhood.id).length >= MINIMUM_ELIGIBLE_PLACES,
  );

  const guideIds = guideRows.map((guide) => guide.id);
  if (guideIds.length === 0) {
    return { neighborhoods: eligibleNeighborhoods, places: placesWithCategories, guides: [] as Guide[], loadError: false };
  }

  const [guideSourcesResult, guidePlacesResult] = await Promise.all([
    supabase.from("guide_sources").select("guide_id").in("guide_id", guideIds),
    supabase.from("guide_places").select("guide_id,place_id").in("guide_id", guideIds),
  ]);

  if (guideSourcesResult.error || guidePlacesResult.error) {
    return { neighborhoods: [] as Neighborhood[], places: [] as Place[], guides: [] as Guide[], loadError: true };
  }

  const sourcedGuideIds = new Set((guideSourcesResult.data ?? []).map((source) => source.guide_id));
  const guidesWithEligiblePlaces = new Set(
    (guidePlacesResult.data ?? [])
      .filter((link) => eligiblePlaceIds.has(link.place_id))
      .map((link) => link.guide_id),
  );
  const guides = guideRows.filter(
    (guide) => sourcedGuideIds.has(guide.id) && guidesWithEligiblePlaces.has(guide.id),
  );

  return { neighborhoods: eligibleNeighborhoods, places: placesWithCategories, guides, loadError: false };
}

export default async function ExplorePage() {
  const data = await getExploreData();
  const canonical = `${SITE_URL}/explore`;
  const searchItems: ExploreSearchItem[] = [
    ...data.neighborhoods.map((item) => ({
      id: `neighborhood:${item.id}`,
      kind: "Neighborhood" as const,
      title: item.name,
      description: item.description?.trim() || `Explore source-backed place profiles in ${item.name}.`,
      href: `/neighborhoods/${item.slug}`,
      context: item.city,
    })),
    ...data.guides.map((item) => ({
      id: `guide:${item.id}`,
      kind: "Guide" as const,
      title: item.title,
      description: item.summary,
      href: `/guides/${item.slug}`,
      context: "Reviewed guide",
    })),
    ...data.places.map((item) => ({
      id: `place:${item.id}`,
      kind: "Place" as const,
      title: item.name,
      description: item.summary?.trim() || "Source-backed local place profile and official links.",
      href: `/places/${item.slug}`,
      context: data.neighborhoods.find((neighborhood) => neighborhood.id === item.neighborhood_id)?.name,
      categories: item.categories,
      priceLevel: item.price_level,
    })),
  ];
  const items = [
    ...data.neighborhoods.map((item) => ({
      "@type": "ListItem",
      name: item.name,
      url: `${SITE_URL}/neighborhoods/${item.slug}`,
    })),
    ...data.guides.map((item) => ({
      "@type": "ListItem",
      name: item.title,
      url: `${SITE_URL}/guides/${item.slug}`,
    })),
    ...data.places.map((item) => ({
      "@type": "ListItem",
      name: item.name,
      url: `${SITE_URL}/places/${item.slug}`,
    })),
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    url: canonical,
    name: "Explore Dallas",
    description: "Source-backed Dallas neighborhood guides, practical local guides, and place profiles.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({ ...item, position: index + 1 })),
    },
  };

  return (
    <main className="min-h-screen bg-stone-50 px-6 pb-20 pt-28 text-slate-900 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
          <Link href="/" className="underline underline-offset-4">DallasCircle</Link>
          <span aria-hidden="true"> / </span>
          <span>Explore</span>
        </nav>

        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Local discovery, built on evidence</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">Explore Dallas</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Start with a neighborhood, a practical guide, or a specific place. We publish pages only when the underlying information meets our sourcing and review standards—not just to fill a directory.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Hours, menus, and other local details can change. Use official links on each profile to confirm time-sensitive information before you go.
          </p>
        </header>

        {data.loadError ? (
          <section className="mt-12 rounded-2xl border border-amber-300 bg-amber-50 p-6" role="status">
            <h2 className="text-lg font-bold">Current inventory is temporarily unavailable</h2>
            <p className="mt-2 leading-7 text-slate-700">We couldn’t load the latest published inventory. Please try again shortly; we won’t substitute unverified listings.</p>
          </section>
        ) : (
          <>
            <ExploreSearch items={searchItems} />
            <section aria-labelledby="neighborhoods-heading" className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Browse by place</p>
                  <h2 id="neighborhoods-heading" className="mt-2 text-2xl font-bold md:text-3xl">Neighborhoods</h2>
                </div>
                <p className="text-sm text-slate-500">{data.neighborhoods.length} areas meet our coverage threshold</p>
              </div>
              {data.neighborhoods.length ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.neighborhoods.map((neighborhood) => {
                    const count = data.places.filter((place) => place.neighborhood_id === neighborhood.id).length;
                    return (
                      <article key={neighborhood.id} className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">{neighborhood.city}, {neighborhood.region}</p>
                        <h3 className="mt-2 text-xl font-bold">{neighborhood.name}</h3>
                        <p className="mt-3 flex-1 leading-7 text-slate-600">{neighborhood.description?.trim() || `Explore source-backed place profiles in ${neighborhood.name}.`}</p>
                        <p className="mt-4 text-sm text-slate-500">{count} eligible place profiles</p>
                        <Link href={`/neighborhoods/${neighborhood.slug}`} className="mt-5 inline-flex font-semibold text-amber-800 underline underline-offset-4">Explore neighborhood</Link>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 max-w-2xl leading-7 text-slate-600">We add a neighborhood here only when at least three place profiles meet the current source and publication checks. Our first area is being built carefully.</p>
              )}
            </section>

            <section aria-labelledby="guides-heading" className="mt-14 border-t border-stone-200 pt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Browse by need</p>
                  <h2 id="guides-heading" className="mt-2 text-2xl font-bold md:text-3xl">Practical guides</h2>
                </div>
                <p className="text-sm text-slate-500">{data.guides.length} reviewed guides</p>
              </div>
              {data.guides.length ? (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {data.guides.map((guide) => (
                    <article key={guide.id} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-bold">{guide.title}</h3>
                      <p className="mt-3 leading-7 text-slate-600">{guide.summary}</p>
                      <p className="mt-4 text-sm text-slate-500">Reviewed {guide.reviewed_at ? new Date(guide.reviewed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "date unavailable"}</p>
                      <Link href={`/guides/${guide.slug}`} className="mt-5 inline-flex font-semibold text-amber-800 underline underline-offset-4">Read guide</Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 max-w-2xl leading-7 text-slate-600">Guides appear here when they have a review date, visible source records, and links to eligible place profiles.</p>
              )}
            </section>

            <section aria-labelledby="places-heading" className="mt-14 border-t border-stone-200 pt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Browse profiles</p>
                  <h2 id="places-heading" className="mt-2 text-2xl font-bold md:text-3xl">Local places</h2>
                </div>
                <p className="text-sm text-slate-500">{data.places.length} eligible profiles</p>
              </div>
              {data.places.length ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.places.map((place) => (
                    <article key={place.id} className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-bold">{place.name}</h3>
                      <p className="mt-3 flex-1 leading-7 text-slate-600">{place.summary || "Open the profile for source-backed details and official links."}</p>
                      <Link href={`/places/${place.slug}`} className="mt-5 inline-flex font-semibold text-amber-800 underline underline-offset-4">View place profile</Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-4 max-w-2xl leading-7 text-slate-600">Place profiles appear after source, fact freshness, and publication checks pass.</p>
              )}
            </section>
          </>
        )}

        <section className="mt-14 rounded-2xl bg-slate-950 p-7 text-white md:p-9">
          <h2 className="text-2xl font-bold">Why our coverage is selective</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">We want DallasCircle to become a broad local discovery platform, but breadth has to be earned. Every public profile and guide should help with a real decision, make its evidence visible, and provide a clear route for corrections.</p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Link href="/about" className="font-semibold text-amber-300 underline underline-offset-4">Research and correction standards</Link>
            <a href="mailto:hello@dallascircle.com?subject=DallasCircle%20correction%20or%20source" className="font-semibold text-amber-300 underline underline-offset-4">Suggest a correction</a>
          </div>
        </section>
      </div>
    </main>
  );
}
