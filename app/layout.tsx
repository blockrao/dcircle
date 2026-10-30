import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://dallascircle.com";
const organizationId = `${siteUrl}/#organization`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DallasCircle — Deep Ellum for the Night Out",
    template: "%s | DallasCircle",
  },
  description:
    "Plan a night in Deep Ellum, Dallas with practical dining guides, source-backed local details, and clear editorial standards.",
  openGraph: {
    type: "website",
    siteName: "DallasCircle",
    locale: "en_US",
    title: "DallasCircle — Deep Ellum for the Night Out",
    description:
      "Practical Deep Ellum night-out planning with source-backed local information.",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DallasCircle — Deep Ellum for the Night Out",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DallasCircle — Deep Ellum for the Night Out",
    description:
      "Practical Deep Ellum night-out planning with source-backed local information.",
    images: ["/opengraph-image"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: "DallasCircle",
      url: siteUrl,
      description:
        "A focused local discovery guide for Deep Ellum, Dallas, with source-backed place information and practical planning guides.",
      areaServed: {
        "@type": "Place",
        name: "Deep Ellum, Dallas, Texas",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "DallasCircle",
      description:
        "Practical Deep Ellum night-out planning with source-backed local information.",
      inLanguage: "en-US",
      publisher: { "@id": organizationId },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
