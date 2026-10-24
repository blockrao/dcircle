'use client';

interface TimelinePhase {
  number: number;
  name: string;
  duration: string;
  deliverables: string[];
  icon: string;
  days: string;
}

const phases: TimelinePhase[] = [
  {
    number: 1,
    name: 'Discovery',
    duration: 'Day 1-2',
    days: '2',
    icon: '🔍',
    deliverables: [
      'Site audit & analysis',
      'Custom functionality mapping',
      'Technical requirements assessment',
      'Project scope confirmation',
    ],
  },
  {
    number: 2,
    name: 'Planning',
    duration: 'Day 3-5',
    days: '3',
    icon: '📋',
    deliverables: [
      'Architecture design',
      'Data migration strategy',
      'Integration roadmap',
      'Timeline & milestones',
    ],
  },
  {
    number: 3,
    name: 'Migration',
    duration: 'Day 6-10',
    days: '5',
    icon: '⚙️',
    deliverables: [
      'Next.js build & setup',
      'Code migration & refactoring',
      'Database migration',
      'API integration',
    ],
  },
  {
    number: 4,
    name: 'Testing',
    duration: 'Day 11-13',
    days: '3',
    icon: '✅',
    deliverables: [
      'Quality assurance testing',
      'Performance optimization',
      'Security review',
      'Bug fixes & refinement',
    ],
  },
  {
    number: 5,
    name: 'Launch',
    duration: 'Day 14',
    days: '1',
    icon: '🚀',
    deliverables: [
      'Production deployment',
      'DNS & domain configuration',
      'Monitoring setup',
      'Post-launch support handoff',
    ],
  },
];

export default function ProcessTimeline() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">
            Our 2-Week Migration Process
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            A structured, predictable path from legacy PHP to modern Next.js. Here's exactly what happens and when.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:grid grid-cols-5 gap-4 mb-12">
          {phases.map((phase) => (
            <div key={phase.number} className="relative">
              {/* Phase Card */}
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6 h-full flex flex-col hover:border-blue-400 transition">
                {/* Phase Number and Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex-shrink-0">
                    {phase.number}
                  </div>
                  <div className="text-3xl">{phase.icon}</div>
                </div>

                {/* Phase Name */}
                <h3 className="text-lg font-bold text-slate-900 mb-1">{phase.name}</h3>

                {/* Duration */}
                <p className="text-sm font-semibold text-blue-600 mb-4">{phase.duration}</p>

                {/* Deliverables */}
                <ul className="space-y-2 flex-grow">
                  {phase.deliverables.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-blue-600 mt-1 flex-shrink-0">•</span>
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector Line (not on last item) */}
              {phase.number < 5 && (
                <div className="absolute top-1/2 -right-2 w-4 h-0.5 bg-blue-400 transform translate-y-0"></div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-6">
          {phases.map((phase) => (
            <div
              key={phase.number}
              className="flex gap-6"
            >
              {/* Left Column - Timeline Marker */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                  {phase.number}
                </div>
                {phase.number < 5 && (
                  <div className="w-0.5 h-24 bg-blue-300"></div>
                )}
              </div>

              {/* Right Column - Content */}
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{phase.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900">{phase.name}</h3>
                    <p className="text-sm font-semibold text-blue-600">{phase.duration}</p>
                  </div>
                </div>

                <ul className="space-y-2 ml-0">
                  {phase.deliverables.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-blue-600 flex-shrink-0">•</span>
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Every project follows this exact timeline. Fixed price of $999 covers all 5 phases.
            Ready to get started? Request your free audit today.
          </p>
          <a
            href="mailto:hello@dallascircle.com"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Request Free Audit
          </a>
        </div>
      </div>
    </section>
  );
}
