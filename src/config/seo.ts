/**
 * SEO Configuration
 * Complete source of truth for all page metadata
 * This file documents exactly what meta tags exist on each page
 */

export const siteConfig = {
  name: "Black Veterans Project",
  url: "https://blackveteransproject.org",
  description:
    "Advancing reparative justice for Black veterans and military families through litigation, narrative, and mobilization.",
  twitter: "@BlackVetProject",
  ogImage: null, // TODO: Create default OG image at /public/og-default.jpg
};

export interface PageSEO {
  path: string;
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    image: string | null;
  };
  twitter: {
    card: "summary" | "summary_large_image";
    title: string;
    description: string;
  };
  status: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasOgTags: boolean;
    hasTwitterTags: boolean;
    hasOgImage: boolean;
  };
}

export const pagesSEO: PageSEO[] = [
  {
    path: "/",
    title: "Black Veterans Project — Reparative Justice for Black Veterans",
    description: "Advancing reparative justice for Black veterans and military families through litigation, narrative, and mobilization.",
    openGraph: {
      title: "Black Veterans Project",
      description: "Advancing reparative justice for Black veterans and military families.",
      url: "https://blackveteransproject.org",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "Black Veterans Project",
      description: "Advancing reparative justice for Black veterans and military families.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: false, // Using defaults from OG
      hasOgImage: false,
    },
  },
  {
    path: "/about",
    title: "About Us | Black Veterans Project",
    description: "Learn about the Black Veterans Project's mission to advance reparative justice for Black veterans and military families through research, litigation, and mobilization.",
    openGraph: {
      title: "About Us | Black Veterans Project",
      description: "Learn about the Black Veterans Project's mission to advance reparative justice for Black veterans and military families.",
      url: "https://blackveteransproject.org/about",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "About Us | Black Veterans Project",
      description: "Learn about the Black Veterans Project's mission to advance reparative justice for Black veterans and military families.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/our-work",
    title: "Our Work | Black Veterans Project",
    description: "Explore how BVP advances reparative justice through impact litigation, narrative building, and community mobilization. Learn about the case for repair and our theory of change.",
    openGraph: {
      title: "Our Work | Black Veterans Project",
      description: "Research. Litigation. Narrative. Mobilization. Discover how BVP is building the case for repair.",
      url: "https://blackveteransproject.org/our-work",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "Our Work | Black Veterans Project",
      description: "Research. Litigation. Narrative. Mobilization. Discover how BVP is building the case for repair.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/join",
    title: "Join | Black Veterans Project",
    description: "Become a member of the Black Veterans Project. Join as a Basic Member or Advocate to support reparative justice for Black veterans and military families.",
    openGraph: {
      title: "Join the Movement | Black Veterans Project",
      description: "Become a member of the Black Veterans Project. Support the fight for reparative justice for Black veterans.",
      url: "https://blackveteransproject.org/join",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "Join the Movement | Black Veterans Project",
      description: "Become a member of the Black Veterans Project. Support the fight for reparative justice for Black veterans.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/donate",
    title: "Donate | Black Veterans Project",
    description: "Support the Black Veterans Project with a tax-deductible donation. Your contribution advances reparative justice for Black veterans and military families.",
    openGraph: {
      title: "Donate | Black Veterans Project",
      description: "Support reparative justice for Black veterans. Every donation helps build the case for repair.",
      url: "https://blackveteransproject.org/donate",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "Donate | Black Veterans Project",
      description: "Support reparative justice for Black veterans. Every donation helps build the case for repair.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/press",
    title: "Press | Black Veterans Project",
    description: "Media coverage and press releases from the Black Veterans Project. Read about our impact litigation, research findings, and advocacy efforts.",
    openGraph: {
      title: "Press & Media | Black Veterans Project",
      description: "News and media coverage of the Black Veterans Project's work advancing reparative justice.",
      url: "https://blackveteransproject.org/press",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "Press & Media | Black Veterans Project",
      description: "News and media coverage of the Black Veterans Project's work advancing reparative justice.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/contact",
    title: "Contact | Black Veterans Project",
    description: "Get in touch with the Black Veterans Project. Reach out for press inquiries, partnerships, or general questions about our mission.",
    openGraph: {
      title: "Contact Us | Black Veterans Project",
      description: "Have questions? Get in touch with the Black Veterans Project team.",
      url: "https://blackveteransproject.org/contact",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact Us | Black Veterans Project",
      description: "Have questions? Get in touch with the Black Veterans Project team.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/faq",
    title: "FAQ | Black Veterans Project",
    description: "Frequently asked questions about the Black Veterans Project, our mission, membership, and the fight for reparative justice for Black veterans.",
    openGraph: {
      title: "Frequently Asked Questions | Black Veterans Project",
      description: "Get answers to common questions about BVP's mission, membership, and advocacy work.",
      url: "https://blackveteransproject.org/faq",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "FAQ | Black Veterans Project",
      description: "Get answers to common questions about BVP's mission, membership, and advocacy work.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/financials",
    title: "Financials & 990 | Black Veterans Project",
    description: "View the Black Veterans Project's annual reports, financial statements, and IRS Form 990 filings. We are committed to transparency and accountability.",
    openGraph: {
      title: "Financials & Transparency | Black Veterans Project",
      description: "Access BVP's annual reports and Form 990 filings. Committed to transparency and accountability.",
      url: "https://blackveteransproject.org/financials",
      image: null,
    },
    twitter: {
      card: "summary_large_image",
      title: "Financials & Transparency | Black Veterans Project",
      description: "Access BVP's annual reports and Form 990 filings. Committed to transparency and accountability.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Black Veterans Project",
    description: "Read the Black Veterans Project's privacy policy. Learn how we collect, use, and protect your personal information.",
    openGraph: {
      title: "Privacy Policy | Black Veterans Project",
      description: "Learn how Black Veterans Project collects, uses, and protects your personal information.",
      url: "https://blackveteransproject.org/privacy",
      image: null,
    },
    twitter: {
      card: "summary",
      title: "Privacy Policy | Black Veterans Project",
      description: "Learn how Black Veterans Project collects, uses, and protects your personal information.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/terms",
    title: "Terms of Use | Black Veterans Project",
    description: "Read the Black Veterans Project's terms of use. Understand the rules and guidelines for using our website and services.",
    openGraph: {
      title: "Terms of Use | Black Veterans Project",
      description: "Terms and conditions for using the Black Veterans Project website.",
      url: "https://blackveteransproject.org/terms",
      image: null,
    },
    twitter: {
      card: "summary",
      title: "Terms of Use | Black Veterans Project",
      description: "Terms and conditions for using the Black Veterans Project website.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
  {
    path: "/accessibility",
    title: "Accessibility | Black Veterans Project",
    description: "Learn about the Black Veterans Project's commitment to digital accessibility. We strive to meet WCAG 2.2 Level AA standards.",
    openGraph: {
      title: "Accessibility Statement | Black Veterans Project",
      description: "Our commitment to digital accessibility for people with disabilities.",
      url: "https://blackveteransproject.org/accessibility",
      image: null,
    },
    twitter: {
      card: "summary",
      title: "Accessibility Statement | Black Veterans Project",
      description: "Our commitment to digital accessibility for people with disabilities.",
    },
    status: {
      hasTitle: true,
      hasDescription: true,
      hasOgTags: true,
      hasTwitterTags: true,
      hasOgImage: false,
    },
  },
];

// Summary stats for admin dashboard
export const seoSummary = {
  totalPages: pagesSEO.length,
  pagesWithTitle: pagesSEO.filter(p => p.status.hasTitle).length,
  pagesWithDescription: pagesSEO.filter(p => p.status.hasDescription).length,
  pagesWithOgTags: pagesSEO.filter(p => p.status.hasOgTags).length,
  pagesWithTwitterTags: pagesSEO.filter(p => p.status.hasTwitterTags).length,
  pagesWithOgImage: pagesSEO.filter(p => p.status.hasOgImage).length,
};
