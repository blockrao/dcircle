import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "How DallasCircle researches local places, handles corrections, and separates editorial coverage from clearly labelled sponsorships.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions | DallasCircle",
    description:
      "How DallasCircle researches local places, handles corrections, and separates editorial coverage from clearly labelled sponsorships.",
    url: "https://dallascircle.com/faq",
    type: "website",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
