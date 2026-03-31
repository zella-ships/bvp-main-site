import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press | Black Veterans Project",
  description:
    "Media coverage and press releases from the Black Veterans Project. Read about our impact litigation, research findings, and advocacy efforts.",
  openGraph: {
    title: "Press & Media | Black Veterans Project",
    description:
      "News and media coverage of the Black Veterans Project's work advancing reparative justice.",
    url: "https://bvp-main-site.vercel.app/press",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/narrative-hub.jpg",
        width: 1200,
        height: 630,
        alt: "Black Veterans Project Press & Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Media | Black Veterans Project",
    description:
      "News and media coverage of the Black Veterans Project's work advancing reparative justice.",
    images: ["/images/narrative-hub.jpg"],
  },
};

export default function PressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
