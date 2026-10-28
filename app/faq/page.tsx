import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers about DallasCircle's Deep Ellum guides, source standards, corrections, and sponsorship policy.",
  alternates: { canonical: "/faq" },
};

const questions = [
  {
    question: "What is DallasCircle?",
    answer:
      "DallasCircle is being developed as a focused local discovery guide for planning a night out in Deep Ellum, Dallas. The initial topics are dining before a show, late-night food, and date-night planning.",
  },
  {
    question: "How do you choose which businesses to include?",
    answer:
      "We aim to select places based on how useful they are for a specific planning need and what reliable public information supports. Inclusion is not a paid endorsement, and we do not promise that a business will be included.",
  },
  {
    question: "Do you visit every restaurant?",
    answer:
      "We do not claim firsthand visits unless a visit genuinely happened and is explicitly documented. We use source-backed information and distinguish published facts from editorial interpretation.",
  },
  {
    question: "How do you verify opening hours, menus, and prices?",
    answer:
      "We prioritize official restaurant websites, menus, venue information, and other reliable public sources. These details can change, so we aim to record when volatile facts were checked. Please confirm time-sensitive details with the business before making a trip.",
  },
  {
    question: "What if something is wrong or outdated?",
    answer:
      "Please email hello@dallascircle.com with the page or detail and, if possible, a reliable source. We review corrections before changing published information.",
  },
  {
    question: "Can a business pay to be featured?",
    answer:
      "Editorial inclusion is not for sale. If we offer sponsorships, the paid placement will be clearly labelled and kept separate from editorial decisions. We will not guarantee outcomes that have not been measured.",
  },
  {
    question: "Why start with Deep Ellum?",
    answer:
      "A focused area makes it possible to build genuinely useful guides and maintain the details that matter to a night out. Expansion should follow evidence that the approach is useful and sustainable.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 text-slate-900 md:py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">DallasCircle</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">Frequently asked questions</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">How our Deep Ellum guides work, where information comes from, and how we handle corrections.</p>
        <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
          {questions.map((item) => (
            <section key={item.question} className="py-6">
              <h2 className="text-lg font-bold">{item.question}</h2>
              <p className="mt-3 leading-7 text-slate-600">{item.answer}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 leading-7 text-slate-600">
          Have a source or correction to share?{" "}
          <a className="font-semibold text-amber-800 underline underline-offset-4" href="mailto:hello@dallascircle.com?subject=DallasCircle%20correction%20or%20source">Contact the editor</a>.
          {" "}Read more about our <Link className="font-semibold text-amber-800 underline underline-offset-4" href="/about">research standards</Link>.
        </p>
      </div>
    </main>
  );
}
