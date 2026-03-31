import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join | Black Veterans Project",
  description:
    "Become a member of the Black Veterans Project. Join as an Affiliate or Advocate to support reparative justice for Black veterans and military families.",
  openGraph: {
    title: "Join the Movement | Black Veterans Project",
    description:
      "Become a member of the Black Veterans Project. Support the fight for reparative justice for Black veterans.",
    url: "https://blackveteransproject.org/join",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/join-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Join the Black Veterans Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join the Movement | Black Veterans Project",
    description:
      "Become a member of the Black Veterans Project. Support the fight for reparative justice for Black veterans.",
    images: ["/images/join-banner.jpg"],
  },
};

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
