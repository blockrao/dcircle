"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type ExploreSearchItem = {
  id: string;
  kind: "Place" | "Guide" | "Neighborhood";
  title: string;
  description: string;
  href: string;
  context?: string;
  categories?: string[];
  priceLevel?: number | null;
};

type Props = { items: ExploreSearchItem[] };

const filters = [
  { value: "all", label: "Everything" },
  { value: "Place", label: "Places" },
  { value: "Guide", label: "Guides" },
  { value: "Neighborhood", label: "Neighborhoods" },
] as const;

export default function ExploreSearch({ items }: Props) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof filters)[number]["value"]>("all");
  const [category, setCategory] = useState("all");
  const [priceLevel, setPriceLevel] = useState("all");
  const categoryOptions = useMemo(
    () => [...new Set(items.flatMap((item) => item.kind === "Place" ? item.categories ?? [] : []))].sort((a, b) => a.localeCompare(b)),
    [items],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase("en-US");

  const results = useMemo(() => {
    if (!normalizedQuery && kind === "all" && category === "all" && priceLevel === "all") return [];
    return items
      .filter((item) => kind === "all" || item.kind === kind)
      .filter((item) => category === "all" || (item.kind === "Place" && item.categories?.includes(category)))
      .filter((item) => priceLevel === "all" || (item.kind === "Place" && item.priceLevel === Number(priceLevel)))
      .filter((item) => {
        if (!normalizedQuery) return true;
        const searchable = [item.title, item.description, item.context, item.kind]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("en-US");
        return normalizedQuery.split(/\s+/).every((term) => searchable.includes(term));
      })
      .slice(0, 12);
  }, [items, kind, category, priceLevel, normalizedQuery]);

  const active = normalizedQuery.length > 0 || kind !== "all" || category !== "all" || priceLevel !== "all";

  return (
    <section aria-labelledby="explore-search-heading" className="mt-10 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm md:p-7">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Find something specific</p>
        <h2 id="explore-search-heading" className="mt-2 text-2xl font-bold">Search the verified collection</h2>
        <p className="mt-2 leading-7 text-slate-600">Search eligible place profiles, reviewed guides, and covered neighborhoods. Results come only from the published collection below.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="block">
          <span className="sr-only">Search places, guides, and neighborhoods</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try a place name, neighborhood, or planning need"
            className="w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
          />
        </label>
        <div aria-label="Filter result type" className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={kind === filter.value}
              onClick={() => setKind(filter.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${kind === filter.value ? "border-slate-950 bg-slate-950 text-white" : "border-stone-300 bg-white text-slate-700 hover:border-slate-500"}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Place category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3 font-normal focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200">
            <option value="all">All categories</option>
            {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          <span className="mb-1 block">Price level</span>
          <select value={priceLevel} onChange={(event) => setPriceLevel(event.target.value)} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-3 font-normal focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-200">
            <option value="all">Any price level</option>
            {[1, 2, 3, 4].map((level) => <option key={level} value={level}>{"$".repeat(level)} · Level {level}</option>)}
          </select>
          <span className="mt-1 block text-xs font-normal text-slate-500">Uses the profile’s recorded price level; missing values are not guessed.</span>
        </label>
      </div>
      {active ? (
        <div className="mt-5" aria-live="polite" aria-atomic="true">
          <p className="text-sm text-slate-600">{results.length ? `Showing ${results.length} matching ${results.length === 1 ? "result" : "results"}${results.length === 12 ? " (up to 12)" : ""}.` : "No matching published items. Try another term or choose Everything."}</p>
          {results.length ? (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <li key={item.id} className="rounded-xl border border-stone-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{item.kind}{item.context ? ` · ${item.context}` : ""}{item.kind === "Place" && item.priceLevel ? ` · ${"$".repeat(item.priceLevel)}` : ""}</p>
                  <h3 className="mt-2 font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  <Link href={item.href} className="mt-3 inline-flex font-semibold text-amber-800 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Open {item.kind.toLowerCase()}</Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Start typing or select a content type to filter the collection.</p>
      )}
    </section>
  );
}
