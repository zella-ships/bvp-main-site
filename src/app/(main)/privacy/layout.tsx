import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Black Veterans Project",
  description:
    "Read the Black Veterans Project's privacy policy. Learn how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | Black Veterans Project",
    description:
      "Learn how Black Veterans Project collects, uses, and protects your personal information.",
    url: "https://bvp-main-site.vercel.app/privacy",
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
    title: "Privacy Policy | Black Veterans Project",
    description:
      "Learn how Black Veterans Project collects, uses, and protects your personal information.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
