import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About & Research Standards",
  description:
    "How DallasCircle researches Deep Ellum dining information, handles corrections, and separates editorial coverage from sponsorship.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-slate-900 md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">About DallasCircle</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">A more useful way to plan a night in Deep Ellum.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          DallasCircle is a focused local discovery guide for Deep Ellum, Dallas. Our first published shortlist helps people compare practical dinner options around a night out using details sourced from the businesses themselves—not by publishing the biggest possible directory.
        </p>

        <section className="mt-12 border-t border-stone-200 pt-8">
          <h2 className="text-2xl font-bold">How we research</h2>
          <p className="mt-4 leading-7 text-slate-600">We prioritize official restaurant websites and menus, venue information, and other reliable public sources. When a detail changes often—such as opening hours, kitchen hours, menus, prices, or booking availability—we aim to record when it was checked and revisit it as appropriate.</p>
          <p className="mt-4 leading-7 text-slate-600">We do not claim to have visited a business unless that is genuinely true and explicitly documented. We do not invent customer reviews, quotations, popularity claims, rankings, or personal recommendations.</p>
        </section>

        <section className="mt-10 border-t border-stone-200 pt-8">
          <h2 className="text-2xl font-bold">Corrections and uncertainty</h2>
          <p className="mt-4 leading-7 text-slate-600">Local information can become outdated. If you notice an error or can point us to a more authoritative source, please contact us. We will review the evidence before changing the information; submitting a correction does not guarantee that it will be accepted without review.</p>
          <a className="mt-5 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800" href="mailto:hello@dallascircle.com?subject=DallasCircle%20correction%20or%20source">Send a correction or source</a>
        </section>

        <section className="mt-10 border-t border-stone-200 pt-8">
          <h2 className="text-2xl font-bold">Editorial independence and sponsorship</h2>
          <p className="mt-4 leading-7 text-slate-600">Editorial inclusion is not a paid endorsement. If DallasCircle offers sponsorship in the future, paid placements will be clearly labelled. Payment will not buy a favourable editorial assessment, verified status, or a guarantee of audience results.</p>
        </section>

        <section className="mt-10 border-t border-stone-200 pt-8">
          <h2 className="text-2xl font-bold">A focused start</h2>
          <p className="mt-4 leading-7 text-slate-600">We are starting with Deep Ellum and a small set of planning needs. We will expand only when we can maintain the quality and usefulness of the information.</p>
          <Link href="/" className="mt-6 inline-flex font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-950">Back to DallasCircle</Link>
        </section>
      </article>
    </main>
  );
}
