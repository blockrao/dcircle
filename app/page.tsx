import Link from "next/link";

export const metadata = {
  title: "Deep Ellum for the Night Out",
  description:
    "A practical guide to planning a night in Deep Ellum, Dallas: places to eat before a show, late-night options, and date-night ideas backed by public sources.",
  alternates: { canonical: "/" },
};

const guideIdeas = [
  {
    number: "01",
    title: "Before the show",
    description:
      "Plan dinner around your venue and start time. We’ll prioritize official menus, booking links, and practical details you can verify.",
  },
  {
    number: "02",
    title: "After 10 p.m.",
    description:
      "Find options for later in the evening, with opening hours and kitchen service treated as separate details whenever sources make that distinction.",
  },
  {
    number: "03",
    title: "Date night, thoughtfully planned",
    description:
      "Compare options by the occasion and your budget—not by unsupported rankings or claims that we visited a place.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white md:py-32">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-700/30 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
            DallasCircle · Deep Ellum, Dallas
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Deep Ellum for the night out.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            A more practical way to plan your evening: where to eat before a show,
            what may still be serving late, and how to choose a date-night spot.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#planning-guides" className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300">
              Explore the planning ideas
            </a>
            <a href="#our-approach" className="inline-flex items-center justify-center rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-slate-400">
              How we research
            </a>
          </div>
          <p className="mt-8 max-w-xl text-sm leading-6 text-slate-400">
            We’re building this guide carefully. We won’t pretend to have visited a
            business or publish unverified hours, prices, reviews, or rankings.
          </p>
        </div>
      </section>

      <section id="planning-guides" className="px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Start with the occasion</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">A night out is a series of small decisions.</h2>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              The right choice depends on timing, budget, location, and what you need next.
              Our guides are being built around those real-world constraints.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {guideIdeas.map((guide) => (
              <article key={guide.number} className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
                <p className="text-sm font-semibold text-amber-700">{guide.number}</p>
                <h3 className="mt-4 text-xl font-bold">{guide.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{guide.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800">Our first published guide</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">Three Deep Ellum dinner stops to consider before a night out</h3>
            <p className="mt-2 leading-7 text-slate-700">Compare three options by the timing details their own websites publish—without unsupported rankings or made-up first-hand reviews.</p>
            <Link href="/guides/three-deep-ellum-dinner-stops" className="mt-4 inline-flex rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">Read the first guide</Link>
          </div>
        </div>
      </section>

      <section id="our-approach" className="border-y border-stone-200 bg-white px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Our standard</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Useful details. Clear sources. No made-up reviews.</h2>
          </div>
          <div className="space-y-5 text-slate-600">
            <p className="leading-7">We aim to use official restaurant websites, menus, venue information, and other reliable public sources. Time-sensitive details should be checked and dated, and uncertain information should be presented as uncertain.</p>
            <p className="leading-7">Editorial inclusion is not for sale. If we ever publish a paid placement, it will be clearly labelled and separated from editorial decisions.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/about" className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-900 transition hover:bg-stone-50">Our research policy</Link>
              <a href="mailto:hello@dallascircle.com?subject=DallasCircle%20correction%20or%20source" className="rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">Suggest a correction</a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 rounded-2xl bg-amber-100 p-8 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-bold">Know a detail we should verify?</h2>
            <p className="mt-2 max-w-2xl leading-7 text-slate-700">Share an official menu, current hours, accessibility information, or a correction. We’ll review it before changing published information.</p>
          </div>
          <a href="mailto:hello@dallascircle.com?subject=DallasCircle%20local%20information" className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">Contact the editor</a>
        </div>
      </section>
    </main>
  );
}
