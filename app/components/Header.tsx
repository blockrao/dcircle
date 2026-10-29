import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-700/50 bg-slate-950/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 text-base font-bold text-white transition hover:text-amber-300 sm:gap-3 sm:text-lg">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-sm font-black text-slate-950">D</span>
          <span className="truncate">DallasCircle</span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-5">
          <Link href="/guides/three-deep-ellum-dinner-stops" className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:inline">First guide</Link>
          <Link href="/about" className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:inline">Our standards</Link>
          <a href="mailto:hello@dallascircle.com?subject=DallasCircle%20correction%20or%20source" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-amber-300 sm:px-4 sm:text-sm"><span className="sm:hidden">Corrections</span><span className="hidden sm:inline">Suggest a correction</span></a>
        </div>
      </nav>
    </header>
  );
}
