import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Skies Ready | Drone Flight Forecast",
    template: "%s | Skies Ready",
  },
  description:
    "Skies Ready helps drone pilots make safer go or no-go decisions with live forecast search, saved launch planning, and Pro-grade billing-ready account tooling.",
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
      </body>
    </html>
  );
}
