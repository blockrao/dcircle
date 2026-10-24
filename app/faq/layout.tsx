import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - DallasCircle PHP Modernization',
  description:
    "Frequently asked questions about DallasCircle's PHP to Next.js migration service. Learn about our 2-week process, pricing, and security.",
  openGraph: {
    title: 'FAQ - DallasCircle PHP Modernization',
    description:
      "Frequently asked questions about DallasCircle's PHP to Next.js migration service.",
    url: 'https://dallascircle.com/faq',
    type: 'website',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
