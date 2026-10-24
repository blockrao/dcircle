'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  // Service Questions
  {
    category: 'Service Questions',
    question: 'What is included in the $999 package?',
    answer:
      'The $999 package includes complete site migration from PHP to Next.js, data migration, API integration, initial performance optimization, and post-launch support handoff. It covers discovery, planning, migration, testing, and launch—all 14-day process phases.',
  },
  {
    category: 'Service Questions',
    question: 'How long does migration actually take?',
    answer:
      'Our standard migration takes 14 days from start to finish. This includes site analysis (Day 1-2), planning (Day 3-5), migration build (Day 6-10), testing & optimization (Day 11-13), and production launch (Day 14). This is a fixed timeline for all projects.',
  },
  {
    category: 'Service Questions',
    question: 'Do you handle data migration?',
    answer:
      "Yes, complete data migration is included. We safely transfer all your data from your current PHP environment to the new Next.js stack, ensuring no data loss and maintaining referential integrity. Database structure is optimized for performance in the new architecture.",
  },
  {
    category: 'Service Questions',
    question: 'What about custom functionality?',
    answer:
      "We handle custom PHP functionality as part of the project scope. During the discovery phase, we document all custom features and integrate them into the Next.js build. Complex custom features may require extended timelines—we assess this during the free audit.",
  },
  {
    category: 'Service Questions',
    question: 'Do you provide post-launch support?',
    answer:
      "Yes, we include 30 days of post-launch support to monitor performance, fix any issues, and ensure smooth operation. After 30 days, we offer ongoing support packages starting at $299/month.",
  },

  // Technical Questions
  {
    category: 'Technical Questions',
    question: 'Will my site speed improve?',
    answer:
      'Yes, significantly. Next.js typically delivers 12.5x faster performance than legacy PHP, with better caching, code splitting, and optimized rendering. Average page load time drops from 3-5 seconds to 200-500ms.',
  },
  {
    category: 'Technical Questions',
    question: 'Is Next.js faster than PHP?',
    answer:
      "For modern web applications, yes—Next.js provides superior performance through server-side rendering, static site generation, automatic code splitting, and edge caching. It's designed for speed from the ground up, while PHP is older architecture not optimized for modern performance.",
  },
  {
    category: 'Technical Questions',
    question: 'Will my hosting costs change?',
    answer:
      'Typically yes—costs decrease by 40-60%. Next.js requires less server resources, enabling hosting on cheaper infrastructure. Instead of paying $50-100/month for shared PHP hosting, you might pay $10-20/month on modern platforms.',
  },
  {
    category: 'Technical Questions',
    question: 'What happens to my SSL/security?',
    answer:
      "SSL/security is maintained and enhanced. We ensure all existing SSL certificates transfer smoothly, implement modern security headers, add DDoS protection, and optimize security configuration. Your new site is more secure than before.",
  },
  {
    category: 'Technical Questions',
    question: 'Is SEO affected?',
    answer:
      "No negative impact. Next.js is excellent for SEO with server-side rendering, built-in meta tags, and structured data support. We preserve all existing URLs, implement 301 redirects for changed pages, and optimize metadata. Often SEO actually improves due to faster load times.",
  },

  // Risk Questions
  {
    category: 'Risk & Support',
    question: 'What if something breaks during migration?',
    answer:
      "We conduct thorough testing before launch and maintain your old site during the entire process. If issues appear during migration, we fix them before going live. You never lose access to your current site until we're 100% confident the new one works.",
  },
  {
    category: 'Risk & Support',
    question: 'Do you provide rollback if something goes wrong?',
    answer:
      "Yes. We maintain full backups throughout the process and can rollback to your original site within 24 hours if critical issues occur post-launch. However, this rarely happens due to our rigorous testing.",
  },
  {
    category: 'Risk & Support',
    question: "What if I'm not satisfied?",
    answer:
      "We offer a 14-day money-back guarantee if you're not satisfied with the migration results. If the new site doesn't meet performance, functionality, or design expectations, we either fix it or refund your $999 investment.",
  },
  {
    category: 'Risk & Support',
    question: 'What about ongoing maintenance?',
    answer:
      "We include 30 days of post-launch support at no extra cost. After that, ongoing maintenance packages are available starting at $299/month, which includes security updates, monitoring, and performance optimization.",
  },

  // Local DFW Questions
  {
    category: 'Local DFW',
    question: 'Do you serve businesses outside DFW?',
    answer:
      "Yes. While we're Dallas-based and specialize in DFW businesses, we work with clients nationwide. The migration process is the same regardless of location—we work fully remote.",
  },
  {
    category: 'Local DFW',
    question: 'What if I already have hosting?',
    answer:
      "That's fine. We can deploy the new Next.js site to your existing hosting provider if it supports Node.js, or we can recommend affordable alternatives like Vercel, Netlify, or AWS. Most migrations reduce hosting costs significantly.",
  },
  {
    category: 'Local DFW',
    question: 'Do you handle domain migrations?',
    answer:
      "Yes. We manage all DNS updates, domain transfers (if needed), and ensure zero downtime during the transition. Your site stays online throughout the entire migration process.",
  },
];

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqItems.map((item) => item.category)));
  const filteredItems = selectedCategory
    ? faqItems.filter((item) => item.category === selectedCategory)
    : faqItems;

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 py-24 md:py-32 pt-32 md:pt-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl -z-10"></div>

        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Everything you need to know about PHP modernization and our 2-week migration service.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-4xl">
          {/* Category Filter */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Filter by Category</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                }`}
              >
                All Questions
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-slate-50 hover:border-blue-400 transition"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === `faq-${idx}` ? null : `faq-${idx}`)
                  }
                  className="w-full px-6 py-4 flex items-start gap-4 text-left hover:bg-blue-50 transition"
                >
                  {/* Icon */}
                  <span className="text-lg font-bold text-blue-600 flex-shrink-0 mt-1">
                    Q
                  </span>

                  {/* Question */}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {item.question}
                    </h3>
                    {selectedCategory === null && (
                      <span className="text-xs text-blue-600 font-semibold mt-1">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Expand Icon */}
                  <svg
                    className={`w-6 h-6 text-slate-400 flex-shrink-0 mt-1 transition transform ${
                      expandedId === `faq-${idx}` ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Answer */}
                {expandedId === `faq-${idx}` && (
                  <div className="px-6 pb-6 border-t border-slate-200">
                    <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-16 rounded-lg border border-blue-300 bg-blue-50 p-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Still Have Questions?
            </h3>
            <p className="text-slate-700 mb-6">
              We're happy to help. Reach out with any questions about our migration service.
            </p>
            <a
              href="mailto:hello@dallascircle.com"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
