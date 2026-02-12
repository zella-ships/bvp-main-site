import type { Metadata } from "next";
import "./globals.css";
import { DebugOverlay } from "@/components/ui/DebugOverlay";
import { CookieConsent } from "@/components/ui/CookieConsent";
import FeedbackWidget from "@/components/FeedbackWidget";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";

export const metadata: Metadata = {
  title: "Black Veterans Project — Reparative Justice for Black Veterans",
  description:
    "Advancing reparative justice for Black veterans and military families through litigation, narrative, and mobilization.",
  openGraph: {
    title: "Black Veterans Project",
    description: "Advancing reparative justice for Black veterans and military families.",
    type: "website",
  },
  // Preconnect to CDN for faster resource loading
  other: {
    "link": [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
    ].map(l => JSON.stringify(l)).join(","),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white text-black">
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <CookieConsent />
        <DebugOverlay />
        <FeedbackWidget />
      </body>
    </html>
  );
}
