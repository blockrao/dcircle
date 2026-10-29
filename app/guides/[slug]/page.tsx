import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getEligiblePlaceIds } from "@/lib/publication-eligibility";
import { createPublicSupabaseClient } from "@/lib/supabase";


export const instant = false;

type PageProps = { params: Promise<{ slug: string }> };

async function getPublishedGuide(slug: string) {
  await connection();
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("guides")
    .select("id,slug,title,summary,body,author_name,published_at,reviewed_at")
    .eq("slug", slug)
    .eq("publication_status", "published")
    .not("published_at", "is", null)
    .not("reviewed_at", "is", null)
    .maybeSingle();

  if (error) throw new Error(`Unable to load guide: ${error.message}`);
  if (!data) return null;

  // A reviewed timestamp alone does not make a useful guide. Require at least
  // one visible source and one linked place that passes the shared place gate.
  const [sourcesResult, linksResult] = await Promise.all([
    supabase.from("guide_sources").select("id").eq("guide_id", data.id).limit(1),
    supabase.from("guide_places").select("place_id").eq("guide_id", data.id),
  ]);

  if (sourcesResult.error || linksResult.error) {
    throw new Error("Unable to verify the publication requirements for this guide.");
  }
  if (!sourcesResult.data?.length || !linksResult.data?.length) return null;

  const linkedPlaceIds = [...new Set(linksResult.data.map((link) => link.place_id))];
  const eligiblePlaceIds = await getEligiblePlaceIds(supabase, linkedPlaceIds);
  if (eligiblePlaceIds.size === 0) return null;

  return { ...data, eligiblePlaceIds: [...eligiblePlaceIds] };
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
  const guide = await getPublishedGuide(slug);
  if (!guide) return { title: "Guide not found" };

  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.summary,
      url: `/guides/${guide.slug}`,
      publishedTime: guide.published_at ?? undefined,
      modifiedTime: guide.reviewed_at ?? undefined,
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getPublishedGuide(slug);
  if (!guide) notFound();

  const supabase = createPublicSupabaseClient();
  const [linksResult, sourcesResult] = await Promise.all([
    supabase
      .from("guide_places")
      .select("place_id,position,editorial_rationale,is_sponsored,sponsorship_disclosure")
      .eq("guide_id", guide.id)
      .in("place_id", guide.eligiblePlaceIds)
      .order("position", { ascending: true }),
    supabase
      .from("guide_sources")
      .select("source_url,source_type,publisher_name,accessed_at")
      .eq("guide_id", guide.id)
      .order("accessed_at", { ascending: false }),
  ]);

  if (linksResult.error || sourcesResult.error) throw new Error("Unable to load guide sources and place links.");
  const placeIds = [...new Set((linksResult.data ?? []).map((link) => link.place_id))];
  const placesResult = placeIds.length
    ? await supabase
        .from("places")
        .select("id,slug,name,summary,address_line1,city,region,postal_code,website_url")
        .in("id", guide.eligiblePlaceIds)
        .eq("publication_status", "published")
    : { data: [], error: null };
  if (placesResult.error) throw new Error("Unable to load guide places.");

  const placesById = new Map((placesResult.data ?? []).map((place) => [place.id, place]));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://dallascircle.com/guides/${guide.slug}`,
    mainEntityOfPage: `https://dallascircle.com/guides/${guide.slug}`,
    headline: guide.title,
    description: guide.summary,
    datePublished: guide.published_at,
    dateModified: guide.reviewed_at,
    author: { "@type": "Organization", name: guide.author_name },
    publisher: { "@type": "Organization", name: "DallasCircle", url: "https://dallascircle.com" },
  };

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-14 text-slate-900 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-amber-800 underline underline-offset-4">DallasCircle</Link>
        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Deep Ellum · Planning guide</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{guide.summary}</p>
        <p className="mt-3 text-sm text-slate-500">By {guide.author_name} · Reviewed {guide.reviewed_at ? displayDate(guide.reviewed_at) : "date unavailable"}</p>

        <div className="mt-9 whitespace-pre-line text-base leading-8 text-slate-700">{guide.body}</div>

        {linksResult.data?.length ? (
          <section className="mt-12">
            <h2 className="text-2xl font-bold">The places in this guide</h2>
            <div className="mt-5 space-y-4">
              {linksResult.data.map((link) => {
                const place = placesById.get(link.place_id);
                if (!place) return null;
                return (
                  <article key={place.id} className="rounded-2xl border border-stone-200 bg-white p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Stop {link.position}</p>
                    <h3 className="mt-2 text-xl font-bold"><Link className="underline decoration-stone-300 underline-offset-4 hover:text-amber-800" href={`/places/${place.slug}`}>{place.name}</Link></h3>
                    {place.summary ? <p className="mt-3 leading-7 text-slate-600">{place.summary}</p> : null}
                    <p className="mt-3 text-sm text-slate-500">{[place.address_line1, place.city, place.region, place.postal_code].filter(Boolean).join(", ")}</p>
                    <p className="mt-4 leading-7 text-slate-700">{link.editorial_rationale}</p>
                    {link.is_sponsored ? <p className="mt-3 text-sm font-semibold text-amber-800">Sponsored placement: {link.sponsorship_disclosure}</p> : null}
                    {place.website_url ? <p className="mt-3"><a className="text-sm font-semibold text-amber-800 underline underline-offset-4" href={place.website_url} target="_blank" rel="noopener noreferrer">Official website</a></p> : null}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {sourcesResult.data?.length ? (
          <section className="mt-12 border-t border-stone-200 pt-8">
            <h2 className="text-xl font-bold">Research sources</h2>
            <ul className="mt-4 space-y-3">
              {sourcesResult.data.map((source) => (
                <li key={source.source_url}>
                  <a className="break-all text-amber-800 underline underline-offset-4" href={source.source_url} target="_blank" rel="noopener noreferrer">{source.publisher_name ?? source.source_url}</a>
                  <span className="ml-2 text-sm text-slate-500">checked {displayDate(source.accessed_at)}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-10 border-t border-stone-200 pt-6 text-sm leading-6 text-slate-600">
          Local hours and menus can change. Confirm details with the business before visiting. <a className="font-semibold text-amber-800 underline underline-offset-4" href={`mailto:hello@dallascircle.com?subject=${encodeURIComponent(`Correction for ${guide.title}`)}`}>Send a correction</a>.
        </p>
      </article>
    </main>
  );
}
