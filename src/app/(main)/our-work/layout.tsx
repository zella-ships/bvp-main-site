import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | Black Veterans Project",
  description:
    "Explore how BVP advances reparative justice through impact litigation, narrative building, and community mobilization. Learn about the case for repair and our theory of change.",
  openGraph: {
    title: "Our Work | Black Veterans Project",
    description:
      "Research. Litigation. Narrative. Mobilization. Discover how BVP is building the case for repair.",
    url: "https://blackveteransproject.org/our-work",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/our-work-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Our Work - Black Veterans Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Work | Black Veterans Project",
    description:
      "Research. Litigation. Narrative. Mobilization. Discover how BVP is building the case for repair.",
    images: ["/images/our-work-banner.jpg"],
  },
};

export default function OurWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
