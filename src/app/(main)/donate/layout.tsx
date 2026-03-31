import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate | Black Veterans Project",
  description:
    "Support the Black Veterans Project with a tax-deductible donation. Your contribution advances reparative justice for Black veterans and military families.",
  openGraph: {
    title: "Donate | Black Veterans Project",
    description:
      "Support reparative justice for Black veterans. Every donation helps build the case for repair.",
    url: "https://bvp-main-site.vercel.app/donate",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Support Black Veterans Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donate | Black Veterans Project",
    description:
      "Support reparative justice for Black veterans. Every donation helps build the case for repair.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
