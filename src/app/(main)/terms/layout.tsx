import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Black Veterans Project",
  description:
    "Read the Black Veterans Project's terms of use. Understand the rules and guidelines for using our website and services.",
  openGraph: {
    title: "Terms of Use | Black Veterans Project",
    description:
      "Terms and conditions for using the Black Veterans Project website.",
    url: "https://blackveteransproject.org/terms",
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
    title: "Terms of Use | Black Veterans Project",
    description:
      "Terms and conditions for using the Black Veterans Project website.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
