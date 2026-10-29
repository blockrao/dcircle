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

export const metadata: Metadata = {
  metadataBase: new URL("https://dallascircle.com"),
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
    url: "https://dallascircle.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DallasCircle — Deep Ellum for the Night Out",
    description:
      "Practical Deep Ellum night-out planning with source-backed local information.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
