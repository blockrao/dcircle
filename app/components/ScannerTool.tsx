'use client';

import { useState } from 'react';

type ScannerResult =
  | 'loading'
  | 'unable-to-detect'
  | 'critical'
  | 'medium'
  | 'low'
  | 'error';

interface ScanState {
  status: ScannerResult;
  url: string;
  phpVersion?: string;
  eolDays?: number;
}

export default function ScannerTool() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanState | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setScanning(true);
    setResult({ status: 'loading', url });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock logic for demo purposes
      // In production, this would call an actual PHP version detection API
      if (
        url.includes('cloudflare') ||
        url.includes('cdn') ||
        Math.random() > 0.6
      ) {
        setResult({
          status: 'unable-to-detect',
          url,
        });
      } else if (Math.random() > 0.5) {
        setResult({
          status: 'critical',
          url,
          phpVersion: '7.2',
          eolDays: -90,
        });
      } else {
        setResult({
          status: 'low',
          url,
          phpVersion: '8.2',
          eolDays: 67,
        });
      }
    } catch {
      setResult({
        status: 'error',
        url,
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        PHP Version Scanner
      </h3>
      <p className="text-slate-600 mb-6">
        Check if your site is running an unsupported or at-risk PHP version.
      </p>

      {/* Scan Form */}
      <form onSubmit={handleScan} className="mb-8">
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://yoursite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            required
          />
          <button
            type="submit"
            disabled={scanning}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-slate-400 transition"
          >
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>
      </form>

      {/* Result Messages */}
      {result && (
        <div>
          {result.status === 'loading' && (
            <div className="rounded-lg border border-slate-300 bg-slate-50 p-6 text-center">
              <div className="inline-block mb-4">
                <div className="w-8 h-8 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin"></div>
              </div>
              <p className="text-slate-700">
                Scanning <span className="font-semibold">{result.url}</span>...
              </p>
            </div>
          )}

          {result.status === 'unable-to-detect' && (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-6">
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">⚠️</div>
                <div>
                  <h4 className="font-bold text-yellow-900 mb-2">
                    Unable to Detect PHP Version
                  </h4>
                  <p className="text-sm text-yellow-800 mb-4">
                    We couldn't detect your PHP version (common if you use a CDN or WAF).
                    This is actually a good sign—your server is protected. Request a free audit
                    so we can analyze your site in detail.
                  </p>
                  <a
                    href="mailto:hello@dallascircle.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700 transition"
                  >
                    Request Free Audit
                  </a>
                </div>
              </div>
            </div>
          )}

          {result.status === 'critical' && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-6">
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">🚨</div>
                <div>
                  <h4 className="font-bold text-red-900 mb-1">
                    Critical Risk: Unsupported PHP Version
                  </h4>
                  <p className="text-sm text-red-800 mb-2">
                    PHP {result.phpVersion} is no longer supported (EOL).
                  </p>
                  <p className="text-sm text-red-800 mb-4">
                    Your site poses serious security and performance risks. We recommend
                    immediate migration—our 2-week turnaround means you're protected by{' '}
                    <span className="font-bold">
                      {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )}
                    </span>
                    .
                  </p>
                  <a
                    href="mailto:hello@dallascircle.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Request Free Audit
                  </a>
                </div>
              </div>
            </div>
          )}

          {result.status === 'medium' && (
            <div className="rounded-lg border border-orange-300 bg-orange-50 p-6">
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">⚡</div>
                <div>
                  <h4 className="font-bold text-orange-900 mb-1">
                    Approaching End of Life
                  </h4>
                  <p className="text-sm text-orange-800 mb-2">
                    Your PHP version is getting close to end of life ({result.eolDays} days
                    remaining).
                  </p>
                  <p className="text-sm text-orange-800 mb-4">
                    You have options: patch for short-term stability, or migrate for long-term
                    modernization. Let's discuss which makes sense for your business.
                  </p>
                  <a
                    href="mailto:hello@dallascircle.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-semibold hover:bg-orange-700 transition"
                  >
                    Request Free Audit
                  </a>
                </div>
              </div>
            </div>
          )}

          {result.status === 'low' && (
            <div className="rounded-lg border border-green-300 bg-green-50 p-6">
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">✓</div>
                <div>
                  <h4 className="font-bold text-green-900 mb-1">
                    Good Shape For Now
                  </h4>
                  <p className="text-sm text-green-800 mb-2">
                    Your site is running PHP {result.phpVersion}, which is in good shape.
                  </p>
                  <p className="text-sm text-green-800 mb-4">
                    But PHP 8.2 reaches EOL in {result.eolDays} days. Request a free audit to
                    plan ahead and ensure you're not caught off guard.
                  </p>
                  <a
                    href="mailto:hello@dallascircle.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                  >
                    Request Free Audit
                  </a>
                </div>
              </div>
            </div>
          )}

          {result.status === 'error' && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-6">
              <div className="flex gap-4">
                <div className="text-3xl flex-shrink-0">❌</div>
                <div>
                  <h4 className="font-bold text-red-900 mb-2">
                    Error Scanning Site
                  </h4>
                  <p className="text-sm text-red-800 mb-4">
                    We encountered an error scanning your site. Please check the URL is
                    correct and try again, or contact us for a manual audit.
                  </p>
                  <a
                    href="mailto:hello@dallascircle.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
