import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Black Veterans Project",
  description:
    "Learn about the Black Veterans Project's mission to advance reparative justice for Black veterans and military families through research, litigation, and mobilization.",
  openGraph: {
    title: "About Us | Black Veterans Project",
    description:
      "Learn about the Black Veterans Project's mission to advance reparative justice for Black veterans and military families.",
    url: "https://bvp-main-site.vercel.app/about",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/who-we-are.jpg",
        width: 1200,
        height: 630,
        alt: "About Black Veterans Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Black Veterans Project",
    description:
      "Learn about the Black Veterans Project's mission to advance reparative justice for Black veterans and military families.",
    images: ["/images/who-we-are.jpg"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
