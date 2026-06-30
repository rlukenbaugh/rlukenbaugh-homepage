import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { isClerkConfigured } from "@/lib/site";
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
  metadataBase: new URL("https://skiesready.com"),
  applicationName: "Skies Ready",
  title: {
    default: "Skies Ready | Drone Flight Forecast",
    template: "%s | Skies Ready",
  },
  description:
    "Skies Ready is a drone weather checker and drone flight forecast tool for wind, gusts, visibility, cloud cover, rain risk, and safer preflight planning.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://skiesready.com",
    siteName: "Skies Ready",
    title: "Skies Ready | Drone Flight Forecast",
    description:
      "Check drone flight weather, wind, gusts, visibility, cloud cover, and rain risk before you launch.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skies Ready | Drone Flight Forecast",
    description:
      "Check drone flight weather, wind, gusts, visibility, cloud cover, and rain risk before you launch.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkConfigured = isClerkConfigured();
  let content = children;

  if (clerkConfigured) {
    const { ClerkProvider } = await import("@clerk/nextjs");
    content = <ClerkProvider>{children}</ClerkProvider>;
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full">
        {content}
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
