import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { Json } from "@/lib/local-discovery-database.types";
import { getEligiblePlaceIds } from "@/lib/publication-eligibility";
import { createPublicSupabaseClient } from "@/lib/supabase";


export const instant = false;

type PageProps = { params: Promise<{ slug: string }> };

async function getPublishedPlace(slug: string) {
  await connection();
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("places")
    .select("id,slug,name,summary,website_url,phone,address_line1,address_line2,city,region,postal_code,published_at,last_editorial_review_at,neighborhood_id")
    .eq("slug", slug)
    .eq("publication_status", "published")
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) throw new Error(`Unable to load place: ${error.message}`);
  if (!data) return null;

  const eligiblePlaceIds = await getEligiblePlaceIds(supabase, [data.id]);
  return eligiblePlaceIds.has(data.id) ? data : null;
}

function formatFactValue(value: Json): string {
  if (value === null) return "Not listed";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(formatFactValue).join(", ");
  return Object.entries(value)
    .filter((entry): entry is [string, Json] => entry[1] !== undefined)
    .map(([key, entry]) => `${key.replaceAll("_", " ")}: ${formatFactValue(entry)}`)
    .join("; ");
}

function displayDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPublishedPlace(slug);
  if (!place) return { title: "Place not found" };

  return {
    title: place.name,
    description: place.summary ?? `Source-backed information for ${place.name} in Deep Ellum, Dallas.`,
    alternates: { canonical: `/places/${place.slug}` },
    openGraph: {
      type: "website",
      title: place.name,
      description: place.summary ?? `Source-backed information for ${place.name} in Deep Ellum, Dallas.`,
      url: `/places/${place.slug}`,
    },
  };
}

export default async function PlacePage({ params }: PageProps) {
  const { slug } = await params;
  const place = await getPublishedPlace(slug);
  if (!place) notFound();

  const supabase = createPublicSupabaseClient();
  const [factsResult, sourcesResult, linksResult] = await Promise.all([
    supabase
      .from("place_facts")
      .select("fact_key,fact_value,checked_at,review_due_at")
      .eq("place_id", place.id)
      .eq("verification_status", "verified")
      .or(`review_due_at.is.null,review_due_at.gte.${new Date().toISOString()}`)
      .order("checked_at", { ascending: false }),
    supabase
      .from("place_sources")
      .select("source_url,source_type,publisher_name,accessed_at")
      .eq("place_id", place.id)
      .order("accessed_at", { ascending: false }),
    supabase
      .from("place_categories")
      .select("category_id,is_primary")
      .eq("place_id", place.id),
  ]);

  if (factsResult.error || sourcesResult.error || linksResult.error) {
    throw new Error("Unable to load the published place details.");
  }

  const categoryIds = [...new Set((linksResult.data ?? []).map((item) => item.category_id))];
  const categoriesResult = categoryIds.length
    ? await supabase.from("categories").select("id,slug,name").in("id", categoryIds).eq("is_active", true)
    : { data: [], error: null };
  if (categoriesResult.error) throw new Error("Unable to load place categories.");

  const categories = (categoriesResult.data ?? []).map((category) => ({
    ...category,
    isPrimary: (linksResult.data ?? []).some((link) => link.category_id === category.id && link.is_primary),
  }));
  const primaryCategory = categories.find((category) => category.isPrimary);
  const schemaType = primaryCategory?.slug === "restaurant"
    ? "Restaurant"
    : primaryCategory?.slug === "bar"
      ? "BarOrPub"
      : "LocalBusiness";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `https://dallascircle.com/places/${place.slug}`,
    name: place.name,
    url: place.website_url ?? `https://dallascircle.com/places/${place.slug}`,
    description: place.summary ?? undefined,
    telephone: place.phone ?? undefined,
    address: place.address_line1
      ? {
          "@type": "PostalAddress",
          streetAddress: [place.address_line1, place.address_line2].filter(Boolean).join(", "),
          addressLocality: place.city,
          addressRegion: place.region,
          postalCode: place.postal_code ?? undefined,
          addressCountry: "US",
        }
      : undefined,
  };

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-14 text-slate-900 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-amber-800 underline underline-offset-4">DallasCircle</Link>
        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Deep Ellum · Place profile</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{place.name}</h1>
        {place.summary ? <p className="mt-5 text-lg leading-8 text-slate-600">{place.summary}</p> : null}

        <section className="mt-9 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-bold">Visit details</h2>
          <dl className="mt-4 space-y-3 text-slate-700">
            {place.address_line1 ? <div><dt className="font-semibold">Address</dt><dd>{[place.address_line1, place.address_line2, place.city, place.region, place.postal_code].filter(Boolean).join(", ")}</dd></div> : null}
            {place.phone ? <div><dt className="font-semibold">Phone</dt><dd><a className="underline underline-offset-4" href={`tel:${place.phone.replace(/[^+0-9]/g, "")}`}>{place.phone}</a></dd></div> : null}
            {place.website_url ? <div><dt className="font-semibold">Official website</dt><dd><a className="break-all text-amber-800 underline underline-offset-4" href={place.website_url} target="_blank" rel="noopener noreferrer">{place.website_url}</a></dd></div> : null}
            {categories.length ? <div><dt className="font-semibold">Categories</dt><dd>{categories.map((category) => category.name).join(" · ")}</dd></div> : null}
          </dl>
        </section>

        {factsResult.data?.length ? (
          <section className="mt-9">
            <h2 className="text-2xl font-bold">Verified details</h2>
            <p className="mt-2 leading-7 text-slate-600">Time-sensitive information can change. Confirm directly with the business before travelling.</p>
            <div className="mt-4 divide-y divide-stone-200 border-y border-stone-200">
              {factsResult.data.map((fact) => (
                <div key={fact.fact_key} className="py-5">
                  <h3 className="font-bold capitalize">{fact.fact_key.replaceAll("_", " ")}</h3>
                  <p className="mt-2 leading-7 text-slate-700">{formatFactValue(fact.fact_value)}</p>
                  <p className="mt-2 text-xs text-slate-500">Checked {displayDate(fact.checked_at)}{fact.review_due_at ? ` · Review due ${displayDate(fact.review_due_at)}` : ""}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {sourcesResult.data?.length ? (
          <section className="mt-9">
            <h2 className="text-2xl font-bold">Sources</h2>
            <ul className="mt-4 space-y-3">
              {sourcesResult.data.map((source) => (
                <li key={source.source_url} className="rounded-xl border border-stone-200 bg-white p-4">
                  <a className="break-all font-semibold text-amber-800 underline underline-offset-4" href={source.source_url} target="_blank" rel="noopener noreferrer">
                    {source.publisher_name ?? "Official source"}
                  </a>
                  <p className="mt-1 text-sm text-slate-500">Source checked {displayDate(source.accessed_at)}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {place.last_editorial_review_at ? <p className="mt-8 text-sm text-slate-500">Editorial review: {displayDate(place.last_editorial_review_at)}.</p> : null}
        <p className="mt-8 border-t border-stone-200 pt-6 text-sm leading-6 text-slate-600">
          Notice an error or have a better source? <a className="font-semibold text-amber-800 underline underline-offset-4" href={`mailto:hello@dallascircle.com?subject=${encodeURIComponent(`Correction for ${place.name}`)}`}>Send a correction</a>.
        </p>
      </article>
    </main>
  );
}
