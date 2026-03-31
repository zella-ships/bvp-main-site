import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Black Veterans Project",
  description:
    "Get in touch with the Black Veterans Project. Reach out for press inquiries, partnerships, or general questions about our mission.",
  openGraph: {
    title: "Contact Us | Black Veterans Project",
    description:
      "Have questions? Get in touch with the Black Veterans Project team.",
    url: "https://bvp-main-site.vercel.app/contact",
    siteName: "Black Veterans Project",
    type: "website",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Black Veterans Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Black Veterans Project",
    description:
      "Have questions? Get in touch with the Black Veterans Project team.",
    images: ["/images/hero-bg.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
