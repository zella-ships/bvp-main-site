import { HeroV2 } from '@/components/sections/HeroV2';
import PillarsSection from '@/components/sections/PillarsSection';
import { SubstackFeed } from '@/components/sections/SubstackFeed';
import { DonatePopup } from '@/components/ui/DonatePopup';
import { safeFetch } from '@/sanity/lib/client';
import { homepageSettingsQuery } from '@/sanity/lib/queries';
import type { SanityHomepageSettings } from '@/sanity/lib/types';

export const revalidate = 60;

async function getHomepageSettings(): Promise<SanityHomepageSettings | null> {
  return safeFetch<SanityHomepageSettings>(homepageSettingsQuery);
}

/**
 * HOMEPAGE V2
 *
 * Updated version with:
 * - "Get Involved" CTA linking to /join-v2
 * - Pillar links pointing to /our-work-v2
 * - NewsletterStripV2 (via layout)
 * - Donate popup on scroll
 */

// V2 Pillars - linking to /our-work-v2
const v2Pillars = [
  {
    title: 'Narrative Hub',
    description: 'We collect, preserve, and amplify the records that prove what happened—millions of documents spanning decades of exclusion. Scholars, artists, and archivists turn evidence into public memory.',
    cta: 'Learn more about what we\'re preserving',
    href: '/our-work-v2#narrative',
    image: '/images/narrative-hub.jpg',
    imageAlt: 'Elderly veteran in conversation',
  },
  {
    title: 'Movement Building',
    description: "We're organizing Black veterans and military families into a national network with real power on the Hill. Stories become testimony. Members become advocates.",
    cta: 'See how we organize',
    href: '/our-work-v2#movement-building',
    image: '/images/movement-building.jpg',
    imageAlt: 'Community gathering and organizing',
  },
  {
    title: 'Impact Litigation',
    description: 'We work with legal partners to turn evidence into legal precedent. Monk v. United States is one of the first reparative justice cases to survive a motion to dismiss.',
    cta: 'See the legal strategy',
    href: '/our-work-v2#litigation',
    image: '/images/impact-litigation.jpg',
    imageAlt: 'Veterans embracing at community event',
  },
];

export default async function HomeV2() {
  const settings = await getHomepageSettings();

  const heroHeadline = settings?.heroHeadline || "Defend the Legacy. Fight for Equity. Protect Democracy.";
  const heroImage = settings?.heroImage || "/images/hero-home.webp";

  return (
    <>
      {/* Hero Section - V2 with "Get Involved" CTA */}
      <HeroV2
        headline={heroHeadline}
        backgroundImage={heroImage}
        ctaText="Get Involved"
        ctaHref="/join-v2"
      />

      {/* Our Work / Pillars Section - V2 links */}
      <PillarsSection
        title={settings?.ourWorkTitle || 'Our Work'}
        intro={settings?.ourWorkIntro || "BVP is the first comprehensive effort to build the collective power to demand federal accountability, advance policy change, and redress America's legacy of racism and discrimination against Black veterans and military families."}
        pillars={v2Pillars}
      />

      {/* Substack Feed */}
      <SubstackFeed />

      {/* Donate Popup - triggers after scrolling 200px */}
      <DonatePopup scrollThreshold={200} />
    </>
  );
}
