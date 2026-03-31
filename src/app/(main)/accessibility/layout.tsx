import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | Black Veterans Project",
  description:
    "Learn about the Black Veterans Project's commitment to digital accessibility. We strive to meet WCAG 2.1 Level AA standards.",
  openGraph: {
    title: "Accessibility Statement | Black Veterans Project",
    description:
      "Our commitment to digital accessibility for people with disabilities.",
    url: "https://blackveteransproject.org/accessibility",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Black Veterans Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Statement | Black Veterans Project",
    description:
      "Our commitment to digital accessibility for people with disabilities.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function AccessibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
