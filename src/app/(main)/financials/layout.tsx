import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financials & 990 | Black Veterans Project",
  description:
    "View the Black Veterans Project's annual reports, financial statements, and IRS Form 990 filings. We are committed to transparency and accountability.",
  openGraph: {
    title: "Financials & Transparency | Black Veterans Project",
    description:
      "Access BVP's annual reports and Form 990 filings. Committed to transparency and accountability.",
    url: "https://blackveteransproject.org/financials",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Black Veterans Project Financials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financials & Transparency | Black Veterans Project",
    description:
      "Access BVP's annual reports and Form 990 filings. Committed to transparency and accountability.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function FinancialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
