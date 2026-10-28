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
    default: "DallasCircle — Hyperlocal Business Discovery",
    template: "%s | DallasCircle",
  },
  description:
    "Discover local businesses, restaurants, and services in Dallas and the DFW community.",
  openGraph: {
    type: "website",
    siteName: "DallasCircle",
    locale: "en_US",
    title: "DallasCircle — Hyperlocal Business Discovery",
    description:
      "Discover local businesses, restaurants, and services in Dallas and the DFW community.",
    url: "https://dallascircle.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "DallasCircle — Hyperlocal Business Discovery",
    description:
      "Discover local businesses, restaurants, and services in Dallas and the DFW community.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <div style={{ paddingTop: '64px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
