import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-700/50 bg-slate-950/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold text-white transition hover:text-amber-300">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-sm font-black text-slate-950">D</span>
          <span>DallasCircle</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/#planning-guides" className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:inline">Planning guides</Link>
          <Link href="/about" className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:inline">Our standards</Link>
          <a href="mailto:hello@dallascircle.com?subject=DallasCircle%20correction%20or%20source" className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Suggest a correction</a>
        </div>
      </nav>
    </header>
  );
}
