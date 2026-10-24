'use client';

import { useState } from 'react';

interface Badge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
}

const badges: Badge[] = [
  {
    id: 'ssl',
    title: '256-bit SSL/TLS',
    subtitle: 'SSL Certified',
    icon: '🔒',
    description:
      'Industry-standard 256-bit encryption protects all data transmission. Your customers\' information is secure throughout the migration process.',
  },
  {
    id: 'gdpr',
    title: 'GDPR Compliant',
    subtitle: 'Privacy Protected',
    icon: '✓',
    description:
      'Full compliance with General Data Protection Regulation. We handle all data with strict privacy protocols and transparent consent management.',
  },
  {
    id: 'security',
    title: 'Security Certified',
    subtitle: 'Secure Handling',
    icon: '🛡️',
    description:
      'Adherence to OWASP security standards and best practices. All migrations include security reviews and vulnerability assessments.',
  },
  {
    id: 'pci',
    title: 'PCI DSS Compatible',
    subtitle: 'Payment Safe',
    icon: '💳',
    description:
      'Payment Card Industry Data Security Standard compliance. If your site handles payments, we ensure full PCI DSS compatibility.',
  },
];

export default function TrustBadges() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section className="px-6 py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Trust & Security
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your data and security are our top priority. We maintain industry certifications and compliance standards.
          </p>
        </div>

        {/* Badge Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {badges.map((badge) => (
            <div
              key={badge.id}
              onClick={() =>
                setExpandedId(expandedId === badge.id ? null : badge.id)
              }
              className="relative group cursor-pointer"
            >
              {/* Badge Card */}
              <div className="h-full rounded-lg border border-slate-200 bg-white p-6 hover:border-blue-400 hover:shadow-lg transition transform hover:scale-105">
                {/* Icon */}
                <div className="text-4xl mb-4">{badge.icon}</div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-sm mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-blue-600 font-semibold mb-4">
                  {badge.subtitle}
                </p>

                {/* Info Indicator */}
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Click for details
                </div>
              </div>

              {/* Tooltip/Details */}
              {expandedId === badge.id && (
                <div className="absolute top-full mt-2 left-0 right-0 z-20 rounded-lg border border-blue-400/50 bg-white shadow-xl p-4">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {badge.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(null);
                    }}
                    className="mt-3 text-xs text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            All certifications are current and verified. For detailed compliance documentation, <a href="mailto:hello@dallascircle.com" className="text-blue-600 font-semibold hover:text-blue-700">contact us</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
