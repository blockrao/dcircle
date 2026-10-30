import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getEligiblePlaceIds } from "@/lib/publication-eligibility";
import { createPublicSupabaseClient } from "@/lib/supabase";

type PageProps = { params: Promise<{ slug: string }> };
const SITE_URL = "https://dallascircle.com";
const MINIMUM_ELIGIBLE_PLACES = 3;

async function getNeighborhoodPageData(slug: string) {
  await connection();
  const supabase = createPublicSupabaseClient();
  const { data: neighborhood, error: neighborhoodError } = await supabase
    .from("neighborhoods")
    .select("id,slug,name,city,region,description,updated_at")
    .eq("slug", slug)
    .eq("publication_status", "published")
    .maybeSingle();

  if (neighborhoodError) throw new Error("Unable to load neighborhood.");
  if (!neighborhood) return null;

  const { data: placeRows, error: placesError } = await supabase
    .from("places")
    .select("id,slug,name,summary,updated_at")
    .eq("neighborhood_id", neighborhood.id)
    .eq("publication_status", "published")
    .not("published_at", "is", null)
    .order("name", { ascending: true });

  if (placesError) throw new Error("Unable to load neighborhood places.");
  if (!placeRows?.length) return null;

  const eligibleIds = await getEligiblePlaceIds(supabase, placeRows.map((place) => place.id));
  const places = placeRows.filter((place) => eligibleIds.has(place.id));
  // A locality URL is public only when it offers a useful, evidence-gated set
  // of canonical profiles. This prevents thin or empty indexable pages.
  if (places.length < MINIMUM_ELIGIBLE_PLACES) return null;

  return { neighborhood, places };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getNeighborhoodPageData(slug);
  if (!data) return { title: "Neighborhood guide not found" };

  const title = `${data.neighborhood.name}, Dallas: Local Places`;
  const description = data.neighborhood.description?.trim()
    || `Explore source-backed place profiles in ${data.neighborhood.name}, Dallas, with official links and details you can check.`;

  return {
    title,
    description,
    alternates: { canonical: `/neighborhoods/${data.neighborhood.slug}` },
    openGraph: { type: "website", title, description, url: `/neighborhoods/${data.neighborhood.slug}` },
  };
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getNeighborhoodPageData(slug);
  if (!data) notFound();

  const canonical = `${SITE_URL}/neighborhoods/${data.neighborhood.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    url: canonical,
    name: `${data.neighborhood.name}, Dallas: Local Places`,
    description: data.neighborhood.description?.trim()
      || `Source-backed place profiles in ${data.neighborhood.name}, Dallas.`,
    about: {
      "@type": "Place",
      "@id": `${canonical}#place`,
      name: data.neighborhood.name,
      address: { "@type": "PostalAddress", addressLocality: data.neighborhood.city, addressRegion: data.neighborhood.region, addressCountry: "US" },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: data.places.map((place, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "LocalBusiness",
          // Reuse the immutable place entity ID used by its profile and guides.
          "@id": `${SITE_URL}/id/place/${place.id}`,
          url: `${SITE_URL}/places/${place.slug}`,
          name: place.name,
        },
      })),
    },
  };

  return (
    <main className="min-h-screen bg-stone-50 px-6 pb-20 pt-28 text-slate-900 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-600">
          <Link href="/" className="underline underline-offset-4">DallasCircle</Link>
          <span aria-hidden="true"> / </span>
          <span>{data.neighborhood.name}</span>
        </nav>
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Neighborhood guide · {data.neighborhood.city}, {data.neighborhood.region}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">{data.neighborhood.name}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            {data.neighborhood.description?.trim() || `Explore ${data.neighborhood.name} through local place profiles with source-backed details, official links, and clear correction pathways.`}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">Profiles are included only when they meet DallasCircle’s current publication and evidence checks. Confirm time-sensitive details with the business before you go.</p>
        </header>

        <section aria-labelledby="places-heading" className="mt-12">
          <h2 id="places-heading" className="text-2xl font-bold md:text-3xl">Explore local places</h2>
          <p className="mt-2 text-slate-600">{data.places.length} published profiles currently meet our evidence checks.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.places.map((place) => (
              <article key={place.id} className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold">{place.name}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-600">{place.summary || "Open the profile for source-backed details and official links."}</p>
                <Link href={`/places/${place.slug}`} className="mt-5 inline-flex font-semibold text-amber-800 underline underline-offset-4">View verified details</Link>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-12 text-sm text-slate-600">See an outdated detail? <a className="font-semibold underline underline-offset-4" href="mailto:hello@dallascircle.com?subject=DallasCircle%20correction%20or%20source">Suggest a correction</a>.</p>
      </div>
    </main>
  );
}
