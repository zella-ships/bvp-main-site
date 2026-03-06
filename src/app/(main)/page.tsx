import { Hero } from '@/components/sections/Hero';
import PillarsSection from '@/components/sections/PillarsSection';
import { SubstackFeed } from '@/components/sections/SubstackFeed';

/**
 * HOMEPAGE SPECIFICATIONS
 * =======================
 *
 * SECTIONS:
 * 1. Hero (100vh) - Mission, CTAs
 * 2. Pillars - Our Work
 * 3. Blog Feed (white bg) - Substack RSS, dynamic
 * 4. Footer
 */

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        headline="Defend the Legacy. Fight for Equity. Protect Democracy."
        showDebugSpacing={false}
      />

      {/* Our Work / Pillars Section */}
      <PillarsSection />

      {/* Substack Feed - Dynamic RSS */}
      <SubstackFeed />
    </>
  );
}
