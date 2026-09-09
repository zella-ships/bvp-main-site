import type { Metadata } from "next";
import { NewsletterStripV2 } from "@/components/sections/NewsletterStripV2";

export const metadata: Metadata = {
  title: "Black Veterans Project | Reparative Justice for Black Veterans",
  description:
    "BVP advances reparative justice for Black veterans and military families through litigation, narrative, and mobilization.",
  openGraph: {
    title: "Black Veterans Project",
    description:
      "Defending the legacy. Fighting for equity. Protecting democracy.",
    url: "https://blackveteransproject.org",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/hero-home.webp",
        width: 1200,
        height: 630,
        alt: "Black Veterans Project",
      },
    ],
  },
};

export default function HomeV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <NewsletterStripV2 />
    </>
  );
}
