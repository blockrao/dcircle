import Link from 'next/link';
import FeedsWidget from './components/FeedsWidget';
import AuditRequestForm from './components/AuditRequestForm';
import TestimonialsSection from './components/TestimonialsSection';
import DecisionMatrix from './components/DecisionMatrix';
import ProcessTimeline from './components/ProcessTimeline';
import TrustBadges from './components/TrustBadges';

export const metadata = {
  title: 'DallasCircle — Hyperlocal Business Discovery',
  description:
    'Discover the best local businesses in Dallas. Search restaurants, services, and local personalities. Built for Dallas, by Dallas.',
};

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 py-24 md:py-32 pt-32 md:pt-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl -z-10"></div>

        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/30 bg-blue-400/10">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-sm font-medium text-blue-300">Discover Local</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                PHP Modernization for DFW
              </h1>
              <p className="text-xl text-slate-200 leading-relaxed max-w-2xl">
                PHP 8.2 reaches end of life in 67 days. We've helped 40+ DFW businesses evaluate, plan, and migrate. Here's how we can help you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#discover"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Discover Businesses
              </a>
              <Link
                href="/php-rescue"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-500 text-white font-semibold hover:border-slate-400 hover:bg-slate-800/50 transition"
              >
                PHP Modernization
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Case Study Card - Proof of Success */}
      <section className="px-6 py-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 -mt-24 relative z-10 rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur p-8 md:p-10 shadow-2xl hover:border-blue-400/50 transition">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">$254K</div>
                <p className="text-sm text-blue-200">Revenue Growth</p>
                <p className="text-xs text-slate-400 mt-1">vs $200K baseline</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">12.5x</div>
                <p className="text-sm text-blue-200">Faster Load Time</p>
                <p className="text-xs text-slate-400 mt-1">PHP → Next.js upgrade</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">60%</div>
                <p className="text-sm text-blue-200">Lower Hosting</p>
                <p className="text-xs text-slate-400 mt-1">Monthly infrastructure cost</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/articles/php-modernization-case-study"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-sm"
              >
                See Full Case Study →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Trust & Security Badges */}
      <TrustBadges />

      {/* What is DallasCircle */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              What is DallasCircle?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              A hyperlocal discovery platform built specifically for the Dallas/DFW community. Find verified local businesses, explore local stories, and connect with the people shaping our city.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: '🔍',
                title: 'Discover',
                desc: 'Find the best restaurants, services, and businesses in your area with verified information and real reviews.',
              },
              {
                icon: '📍',
                title: 'Local Verified',
                desc: 'Every business is verified for accuracy. Know exactly what you\'re getting before you visit.',
              },
              {
                icon: '👥',
                title: 'Community',
                desc: 'Explore stories about local personalities, businesses, and what makes Dallas unique.',
              },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              Browse by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Explore local businesses across all categories
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {[
              { name: 'Restaurants', emoji: '🍽️' },
              { name: 'HVAC & Services', emoji: '🔧' },
              { name: 'Plumbing', emoji: '🚰' },
              { name: 'Electrical', emoji: '⚡' },
              { name: 'Construction', emoji: '🏗️' },
              { name: 'Healthcare', emoji: '⚕️' },
              { name: 'Retail', emoji: '🛍️' },
              { name: 'Professional', emoji: '💼' },
              { name: 'Education', emoji: '📚' },
            ].map((cat, i) => (
              <a
                key={i}
                href={`/search?category=${cat.name.toLowerCase().replace(/\s+/g, '_')}`}
                className="p-6 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition text-center"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="font-semibold text-slate-900 text-sm">{cat.name}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                For Local Businesses
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Get discovered by more customers. Manage your listing, understand your online presence, and grow your business.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Verified business profiles',
                  'Website audit & optimization',
                  'Local discovery tools',
                  'Customer reviews & ratings',
                  'Performance analytics',
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/business-signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Get Your Business Listed
              </Link>
            </div>
            <div className="bg-slate-100 rounded-xl h-64 flex items-center justify-center">
              <div className="text-slate-400">Business Dashboard Preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Matrix */}
      <DecisionMatrix />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Featured Articles Section */}
      <section id="articles" className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">
              Featured Articles
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Learn from real case studies and industry insights to grow your Dallas business online.
            </p>
          </div>

          <FeedsWidget />
        </div>
      </section>

      {/* PHP Modernization CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-slate-900 to-blue-900">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Running Legacy PHP?
              </h2>
              <p className="text-xl text-slate-200">
                We modernize old PHP sites to modern Next.js in 2 weeks for $999. Free audit included.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-white">12.5x Faster</p>
                    <p className="text-sm text-slate-300">Next.js vs legacy PHP performance</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-white">60% Cost Savings</p>
                    <p className="text-sm text-slate-300">Lower hosting and infrastructure costs</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-white">2 Week Turnaround</p>
                    <p className="text-sm text-slate-300">Fixed price, guaranteed timeline</p>
                  </div>
                </div>
              </div>
              <Link
                href="/php-rescue"
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition"
              >
                Learn More
              </Link>
            </div>

            <div>
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Request Free Audit</h3>
                <AuditRequestForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">DallasCircle</h3>
              <p className="text-sm">Hyperlocal business discovery for Dallas/DFW</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Discover</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/search" className="hover:text-white transition">Browse Businesses</a></li>
                <li><a href="/categories" className="hover:text-white transition">Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Business</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/business-signup" className="hover:text-white transition">Get Listed</a></li>
                <li><a href="/php-rescue" className="hover:text-white transition">PHP Modernization</a></li>
                <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:hello@dallascircle.com" className="hover:text-white transition">hello@dallascircle.com</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <p>&copy; 2026 DallasCircle. Built with ❤️ for Dallas.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
