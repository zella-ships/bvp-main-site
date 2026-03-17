'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// ============================================
// OUR WORK PAGE
// Sections: Hero, Sticky Sub-Nav, Case for Repair,
// Impact Litigation, Narrative Hub, Mobilization
// ============================================

const sections = [
  { id: 'case-for-repair', label: 'The Case for Repair' },
  { id: 'litigation', label: 'Impact Litigation' },
  { id: 'narrative', label: 'Narrative Hub' },
  { id: 'mobilization', label: 'Mobilization' },
];

// Sticky Sub-Nav Component with scroll spy
function StickySubNav({
  activeSection,
  onSectionClick,
}: {
  activeSection: string;
  onSectionClick: (id: string) => void;
}) {
  const navRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active link into view on mobile
  useEffect(() => {
    if (navRef.current && window.innerWidth < 1024) {
      const activeLink = navRef.current.querySelector(`[data-section="${activeSection}"]`);
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeSection]);

  return (
    <nav
      className="sticky top-0 z-40 bg-white shadow-md flex flex-col"
      style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
    >
      {/* Spacer for header */}
      <div className="h-12 md:h-[60px] bg-white" />
      {/* Outer wrapper matches header padding */}
      <div style={{ padding: '0 clamp(1rem, 4vw, 5.75rem)' }}>
        <div
          ref={navRef}
          className="max-w-[900px] mx-auto w-full flex justify-start overflow-x-auto scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              data-section={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`relative px-3 lg:px-4 min-h-[56px] text-[13px] lg:text-[14px] font-gunterz font-bold tracking-[0.05em] uppercase whitespace-nowrap transition-colors flex-shrink-0 flex items-center ${
                index === 0 ? 'pl-0' : ''
              } ${activeSection === section.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              {section.label}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 transition-transform duration-200 ${
                  activeSection === section.id ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// CTA Box Component
function CTABox({
  title,
  buttonText,
  href,
  external,
  backgroundImage = '/images/camo-gold-bg.png',
}: {
  title: string;
  buttonText: string;
  href: string;
  external?: boolean;
  backgroundImage?: string;
}) {
  return (
    <div
      className="relative overflow-hidden text-white"
      style={{ padding: 'clamp(1.5rem, 4vw, 2rem)' }}
    >
      {/* Camo background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Content */}
      <div className="relative z-10">
        <h3
          className="font-gunterz font-bold"
          style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}
        >
          {title}
        </h3>
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold px-6 py-3 text-base tracking-wide rounded-full border-2 bg-white text-black border-white hover:bg-black hover:text-white transition-all duration-300 active:scale-95 min-h-[44px] whitespace-normal"
          >
            {buttonText}
          </a>
        ) : (
          <Button href={href} variant="white" size="md" className="whitespace-normal">
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}

// Theory of Change Venn Diagram Component
function VennDiagram({ onSectionClick }: { onSectionClick: (id: string) => void }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [repairActive, setRepairActive] = useState(false);

  const pillars = {
    narrative: {
      id: 'narrative',
      description: "Carries the evidence and stories into public understanding, shifting the nation's imagination so repair becomes thinkable.",
    },
    litigation: {
      id: 'litigation',
      description: 'Builds the case for repair through data and law, turning fragmented evidence into a shared record that compels accountability.',
    },
    movement: {
      id: 'mobilization',
      description: 'Organizes communities as stewards of repair, rebuilding collective power into coordinated action.',
    },
  };

  // Colors matching the pillar cards on home page exactly
  const colors = {
    narrative: { bg: '#1a1500', accent: '#FDC500' },
    litigation: { bg: '#720C0C', accent: '#F44708' },
    movement: { bg: '#143601', accent: '#56C035' },
  };

  const R = 222;
  const centers = {
    narrative: { cx: 620, cy: 270 },
    litigation: { cx: 500, cy: 470 },
    movement: { cx: 740, cy: 470 },
  };

  const handlePillarClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onSectionClick(id);
  };

  const getPillarOpacity = (key: string) => {
    if (repairActive) return 0.45;
    if (!activeKey) return 1;
    if (activeKey === key) return 1;
    return 0.25;
  };

  const getPillarScale = (key: string) => {
    if (activeKey === key && !repairActive) return 'scale(1.04)';
    return 'scale(1)';
  };

  const getCamoOpacity = (key: string) => {
    if (activeKey === key) return 0.4;
    return 0;
  };

  const resetState = () => {
    setActiveKey(null);
    setRepairActive(false);
  };

  return (
    <div
      className="w-full max-w-[1400px] mx-auto my-12"
      onMouseLeave={resetState}
    >
      <svg viewBox="0 0 1300 760" className="w-full h-auto">
        <defs>
          <pattern id="camo-yellow-venn" patternUnits="userSpaceOnUse" width="200" height="200">
            <image href="/images/camo-yellow.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="camo-red-venn" patternUnits="userSpaceOnUse" width="200" height="200">
            <image href="/images/camo-red.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="camo-green-venn" patternUnits="userSpaceOnUse" width="200" height="200">
            <image href="/images/camo-green.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>

          <clipPath id="clip-narrative">
            <circle cx={centers.narrative.cx} cy={centers.narrative.cy} r={R} />
          </clipPath>
          <clipPath id="clip-litigation">
            <circle cx={centers.litigation.cx} cy={centers.litigation.cy} r={R} />
          </clipPath>
          <clipPath id="clip-movement">
            <circle cx={centers.movement.cx} cy={centers.movement.cy} r={R} />
          </clipPath>
        </defs>

        {/* NARRATIVE CIRCLE */}
        <g
          className="cursor-pointer"
          style={{
            opacity: getPillarOpacity('narrative'),
            transform: getPillarScale('narrative'),
            transformOrigin: `${centers.narrative.cx}px ${centers.narrative.cy}px`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
          onMouseEnter={() => { setActiveKey('narrative'); setRepairActive(false); }}
          onClick={(e) => handlePillarClick(e, pillars.narrative.id)}
        >
          <circle cx={centers.narrative.cx} cy={centers.narrative.cy} r={R} fill={colors.narrative.bg} />
          <circle
            cx={centers.narrative.cx}
            cy={centers.narrative.cy}
            r={R}
            fill="url(#camo-yellow-venn)"
            style={{ opacity: getCamoOpacity('narrative'), transition: 'opacity 0.4s ease-out' }}
          />
          <text x={centers.narrative.cx} y={centers.narrative.cy - 50} textAnchor="middle" fill={colors.narrative.accent} style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.2em' }} className="uppercase pointer-events-none">
            <tspan x={centers.narrative.cx}>Narrative</tspan>
            <tspan x={centers.narrative.cx} dy="28">Hub</tspan>
          </text>
        </g>

        {/* MOVEMENT CIRCLE */}
        <g
          className="cursor-pointer"
          style={{
            opacity: getPillarOpacity('movement'),
            transform: getPillarScale('movement'),
            transformOrigin: `${centers.movement.cx}px ${centers.movement.cy}px`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
          onMouseEnter={() => { setActiveKey('movement'); setRepairActive(false); }}
          onClick={(e) => handlePillarClick(e, pillars.movement.id)}
        >
          <circle cx={centers.movement.cx} cy={centers.movement.cy} r={R} fill={colors.movement.bg} />
          <circle
            cx={centers.movement.cx}
            cy={centers.movement.cy}
            r={R}
            fill="url(#camo-green-venn)"
            style={{ opacity: getCamoOpacity('movement'), transition: 'opacity 0.4s ease-out' }}
          />
          <text x={centers.movement.cx + 75} y={centers.movement.cy + 30} textAnchor="middle" fill={colors.movement.accent} style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.2em' }} className="uppercase pointer-events-none">
            <tspan x={centers.movement.cx + 75}>Mobilization</tspan>
          </text>
        </g>

        {/* LITIGATION CIRCLE */}
        <g
          className="cursor-pointer"
          style={{
            opacity: getPillarOpacity('litigation'),
            transform: getPillarScale('litigation'),
            transformOrigin: `${centers.litigation.cx}px ${centers.litigation.cy}px`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
          onMouseEnter={() => { setActiveKey('litigation'); setRepairActive(false); }}
          onClick={(e) => handlePillarClick(e, pillars.litigation.id)}
        >
          <circle cx={centers.litigation.cx} cy={centers.litigation.cy} r={R} fill={colors.litigation.bg} />
          <circle
            cx={centers.litigation.cx}
            cy={centers.litigation.cy}
            r={R}
            fill="url(#camo-red-venn)"
            style={{ opacity: getCamoOpacity('litigation'), transition: 'opacity 0.4s ease-out' }}
          />
          <text x={centers.litigation.cx - 50} y={centers.litigation.cy + 30} textAnchor="middle" fill={colors.litigation.accent} style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.2em' }} className="uppercase pointer-events-none">
            <tspan x={centers.litigation.cx - 50}>Impact</tspan>
            <tspan x={centers.litigation.cx - 50} dy="28">Litigation</tspan>
          </text>
        </g>

        {/* PAIRWISE OVERLAPS */}
        <g clipPath="url(#clip-narrative)" className="pointer-events-none">
          <circle
            cx={centers.litigation.cx}
            cy={centers.litigation.cy}
            r={R}
            fill={activeKey === 'narrative' ? colors.narrative.bg : activeKey === 'litigation' ? colors.litigation.bg : '#2A1005'}
            style={{ transition: 'fill 0.4s ease-out' }}
          />
          <circle
            cx={centers.litigation.cx}
            cy={centers.litigation.cy}
            r={R}
            fill={activeKey === 'narrative' ? 'url(#camo-yellow-venn)' : activeKey === 'litigation' ? 'url(#camo-red-venn)' : 'none'}
            style={{ opacity: activeKey === 'narrative' || activeKey === 'litigation' ? 0.4 : 0, transition: 'opacity 0.4s ease-out' }}
          />
        </g>
        <g clipPath="url(#clip-narrative)" className="pointer-events-none">
          <circle
            cx={centers.movement.cx}
            cy={centers.movement.cy}
            r={R}
            fill={activeKey === 'narrative' ? colors.narrative.bg : activeKey === 'movement' ? colors.movement.bg : '#0F1A05'}
            style={{ transition: 'fill 0.4s ease-out' }}
          />
          <circle
            cx={centers.movement.cx}
            cy={centers.movement.cy}
            r={R}
            fill={activeKey === 'narrative' ? 'url(#camo-yellow-venn)' : activeKey === 'movement' ? 'url(#camo-green-venn)' : 'none'}
            style={{ opacity: activeKey === 'narrative' || activeKey === 'movement' ? 0.4 : 0, transition: 'opacity 0.4s ease-out' }}
          />
        </g>
        <g clipPath="url(#clip-litigation)" className="pointer-events-none">
          <circle
            cx={centers.movement.cx}
            cy={centers.movement.cy}
            r={R}
            fill={activeKey === 'litigation' ? colors.litigation.bg : activeKey === 'movement' ? colors.movement.bg : '#1A0A05'}
            style={{ transition: 'fill 0.4s ease-out' }}
          />
          <circle
            cx={centers.movement.cx}
            cy={centers.movement.cy}
            r={R}
            fill={activeKey === 'litigation' ? 'url(#camo-red-venn)' : activeKey === 'movement' ? 'url(#camo-green-venn)' : 'none'}
            style={{ opacity: activeKey === 'litigation' || activeKey === 'movement' ? 0.4 : 0, transition: 'opacity 0.4s ease-out' }}
          />
        </g>

        {/* TRIPLE INTERSECTION — Repair */}
        <g
          className="cursor-pointer"
          onMouseEnter={() => { setRepairActive(true); setActiveKey(null); }}
          style={{ opacity: activeKey ? 0.5 : 1, transition: 'opacity 0.4s ease-out' }}
        >
          <g clipPath="url(#clip-narrative)">
            <g clipPath="url(#clip-litigation)">
              <circle cx={centers.movement.cx} cy={centers.movement.cy} r={R} fill={repairActive ? '#B8894D' : '#C4985A'} className="transition-[fill] duration-300" />
            </g>
          </g>
        </g>

        {/* REPAIR label */}
        <text x="620" y="420" textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.2em' }} className="uppercase pointer-events-none">
          Repair
        </text>
        <circle
          cx="620" cy="415" r="55" fill="transparent"
          className="cursor-pointer"
          onMouseEnter={() => { setRepairActive(true); setActiveKey(null); }}
        />

        {/* CALLOUT: Narrative */}
        <g className={`transition-opacity duration-300 ${activeKey === 'narrative' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <circle cx="730" cy="210" r="4" fill={colors.narrative.accent} />
          <line x1="730" y1="210" x2="1040" y2="210" stroke={colors.narrative.accent} strokeWidth="1" />
          <line x1="1040" y1="210" x2="1040" y2="230" stroke={colors.narrative.accent} strokeWidth="1" />
          <foreignObject x="1040" y="235" width="280" height="200">
            <div>
              <p className="leading-[1.6] text-gray-700 mb-5" style={{ fontSize: '19px' }}>
                {pillars.narrative.description}
              </p>
              <button
                onClick={(e) => handlePillarClick(e, pillars.narrative.id)}
                className="text-base font-bold border-b-2 pb-1 transition-colors"
                style={{ color: colors.narrative.accent, borderColor: colors.narrative.accent }}
              >
                Learn more →
              </button>
            </div>
          </foreignObject>
        </g>

        {/* CALLOUT: Litigation */}
        <g className={`transition-opacity duration-300 ${activeKey === 'litigation' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <circle cx="365" cy="430" r="4" fill={colors.litigation.accent} />
          <line x1="365" y1="430" x2="10" y2="430" stroke={colors.litigation.accent} strokeWidth="1" />
          <line x1="10" y1="430" x2="10" y2="450" stroke={colors.litigation.accent} strokeWidth="1" />
          <foreignObject x="10" y="455" width="260" height="220">
            <div>
              <p className="leading-[1.6] text-gray-700 mb-5" style={{ fontSize: '19px' }}>
                {pillars.litigation.description}
              </p>
              <button
                onClick={(e) => handlePillarClick(e, pillars.litigation.id)}
                className="text-base font-bold border-b-2 pb-1 transition-colors"
                style={{ color: colors.litigation.accent, borderColor: colors.litigation.accent }}
              >
                Learn more →
              </button>
            </div>
          </foreignObject>
        </g>

        {/* CALLOUT: Movement */}
        <g className={`transition-opacity duration-300 ${activeKey === 'movement' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <circle cx="875" cy="430" r="4" fill={colors.movement.accent} />
          <line x1="875" y1="430" x2="1040" y2="430" stroke={colors.movement.accent} strokeWidth="1" />
          <line x1="1040" y1="430" x2="1040" y2="450" stroke={colors.movement.accent} strokeWidth="1" />
          <foreignObject x="1040" y="455" width="280" height="200">
            <div>
              <p className="leading-[1.6] text-gray-700 mb-5" style={{ fontSize: '19px' }}>
                {pillars.movement.description}
              </p>
              <button
                onClick={(e) => handlePillarClick(e, pillars.movement.id)}
                className="text-base font-bold border-b-2 pb-1 transition-colors"
                style={{ color: colors.movement.accent, borderColor: colors.movement.accent }}
              >
                Learn more →
              </button>
            </div>
          </foreignObject>
        </g>

        {/* CALLOUT: Repair */}
        <g className={`transition-opacity duration-300 ${repairActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <circle cx="660" cy="415" r="4" fill="#C4985A" />
          <line x1="660" y1="415" x2="1040" y2="415" stroke="#C4985A" strokeWidth="1" />
          <line x1="1040" y1="415" x2="1040" y2="435" stroke="#C4985A" strokeWidth="1" />
          <foreignObject x="1040" y="440" width="280" height="220">
            <div>
              <p className="font-bold tracking-[0.2em] uppercase text-[#C4985A] mb-3" style={{ fontSize: '15px' }}>Repair</p>
              <p className="leading-[1.6] italic text-black mb-4" style={{ fontSize: '19px' }}>
                Not a fourth pillar — the reason the other three exist.
              </p>
              <p className="leading-[1.6] text-gray-600" style={{ fontSize: '17px' }}>
                Each alone is insufficient. Repair requires all three working in concert.
              </p>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  );
}

// Pillar Card Component for Theory of Change
function PillarCard({
  title,
  description,
  href,
  accentColor,
}: {
  title: string;
  description: string;
  href: string;
  accentColor: string;
}) {
  return (
    <div className="border-l-4 pl-6 py-2" style={{ borderColor: accentColor }}>
      <h4
        className="font-gunterz font-bold uppercase mb-2"
        style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}
      >
        {title}
      </h4>
      <p
        className="leading-relaxed text-gray-700 mb-3"
        style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}
      >
        {description}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-1 font-bold text-sm hover:underline"
        style={{ color: accentColor }}
      >
        Learn more →
      </Link>
    </div>
  );
}

export default function OurWorkPage() {
  const [activeSection, setActiveSection] = useState('case-for-repair');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const trigger = window.innerWidth < 1024 ? 140 : 170;
      let current = 'case-for-repair';

      sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= trigger) {
            current = id;
          }
        }
      });

      // Force last section active at bottom of page
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        current = sections[sections.length - 1].id;
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle hash on page load
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        setTimeout(() => {
          const offset = window.innerWidth < 1024 ? 130 : 160;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'auto' });
          setActiveSection(targetId);
        }, 100);
      }
    }
  }, []);

  const handleSectionClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const offset = window.innerWidth < 1024 ? 130 : 160;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ============================================== */}
      {/* HERO */}
      {/* ============================================== */}
      <section
        className="relative flex items-end"
        style={{ height: 'clamp(55vh, 65vw, 75vh)' }}
      >
        <img
          src="/images/our-work-banner.jpg"
          alt="Navy sailors in formation representing the service and sacrifice of Black veterans"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div
          className="relative z-10 max-w-[1400px] mx-auto w-full"
          style={{ padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1rem, 4vw, 5.75rem)' }}
        >
          <p className="text-sm uppercase tracking-widest mb-4 text-white/60">Our Work</p>
          <h1
            className="font-gunterz font-bold text-white uppercase"
            style={{ fontSize: 'clamp(1.75rem, 1rem + 4vw, 3.75rem)' }}
          >
            The Case for Repair
          </h1>
        </div>
      </section>

      {/* ============================================== */}
      {/* STICKY SUB-NAV */}
      {/* ============================================== */}
      <StickySubNav activeSection={activeSection} onSectionClick={handleSectionClick} />

      {/* ============================================== */}
      {/* WORK CONTENT */}
      {/* ============================================== */}
      <section style={{ padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 5.75rem) clamp(3rem, 8vw, 5rem)' }}>
        <div className="max-w-[900px] mx-auto">
          {/* ============================================== */}
          {/* VIDEO EMBED */}
          {/* ============================================== */}
          <div style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/uLspZFLX23E?start=1"
                title="Black Veterans Project"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* ============================================== */}
          {/* CASE FOR REPAIR */}
          {/* ============================================== */}
          <div id="case-for-repair" className="scroll-mt-40" style={{ marginBottom: 'clamp(4rem, 10vw, 8rem)' }}>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              Since the Revolutionary War, Black Americans have served in our nation's military with honor and valor, only to face the indignity of unequal access to the wealth-generating veterans' benefits promised to those who fight our nation's wars.
            </p>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              Our government's history of failing Black veterans and their families spans generations. Through the widespread denial of Civil War pensions, the pervasive obstruction of World War II-era home loans and education benefits, and systemic disparities in disability pay spanning Vietnam through the post-9/11 conflicts, the cumulative impact of racial exclusion has reached crisis levels.
            </p>

            {/* Stats - 3 across with impact */}
            <div
              className="border-y-2 border-black py-8 md:py-12"
              style={{ marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {[
                  {
                    number: '$100B',
                    label: 'DENIED',
                    description: "Disparities in veterans' benefits have cost Black veterans and their families an estimated $100 Billion since WWII.",
                  },
                  {
                    number: '32X',
                    label: 'WEALTH GAP',
                    description: 'White veterans hold 32 times more wealth than Black veterans—a gap of $164,000.',
                  },
                  {
                    number: '33%',
                    label: 'HOMELESS',
                    description: "Black veterans account for 1/3 of our nation's homeless veteran population.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.number}
                    className={`text-center py-6 md:py-0 ${
                      index !== 2 ? 'border-b md:border-b-0 md:border-r border-black/20' : ''
                    }`}
                    style={{ padding: index === 1 ? '0 clamp(1rem, 3vw, 2rem)' : undefined }}
                  >
                    <p
                      className="font-gunterz font-black text-[#F94F36] leading-none"
                      style={{ fontSize: 'clamp(3rem, 2rem + 5vw, 4.5rem)' }}
                    >
                      {item.number}
                    </p>
                    <p
                      className="font-gunterz font-bold text-[#F94F36] uppercase tracking-wider mt-1 mb-4"
                      style={{ fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.125rem)' }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="leading-relaxed text-gray-700 max-w-[280px] mx-auto"
                      style={{ fontSize: 'clamp(0.875rem, 0.8rem + 0.25vw, 0.9375rem)' }}
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              Generations later, these exclusions have cost Black communities billions of dollars and continue to fuel the disproportionate rates of Black veteran homelessness, unemployment, and incarceration we're seeing today.
            </p>

            <p
              className="leading-relaxed font-bold"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              This denial is by design. We have the evidence to prove it.
            </p>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              Starting in 2020, BVP has been collecting the stories of Black veterans, government data, and historical records documenting America's legacy of mistreatment of Black veterans and their families, alongside a host of racially discriminatory policies and practices spanning decades.
            </p>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              This research equips educators, policymakers, artists, and the public with the facts, stories, and legal grounding needed to chart the path towards recompensation and repair.
            </p>

            <p
              className="leading-relaxed font-bold"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              As our nation's democracy reaches its tipping point, the fight for equity and the movement for repair are more urgent than ever.
            </p>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              In January 2025, the federal government instituted executive orders dismantling diversity, equity, and inclusion programs and revoking critical institutional infrastructure and protections meant to ebb racial discrimination.
            </p>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              Despite the federal government's role in designing and exacerbating racial inequality through policy and practices, there has been little accountability to redress the harm done. Now, the very systems built to measure and address racism in American life are being dismantled, threatening the promise of our multiracial democracy.
            </p>

            <p
              className="leading-relaxed font-bold"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              Black Veterans Project was built for this moment.
            </p>

            {/* ============================================== */}
            {/* HOW REPAIR HAPPENS */}
            {/* ============================================== */}
            <div style={{ marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
              <h2
                className="font-gunterz font-bold uppercase"
                style={{ fontSize: 'clamp(1.5rem, 1rem + 2vw, 2rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                How Repair Happens
              </h2>
              <p
                className="leading-relaxed mb-6"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)' }}
              >
                An approach to repair must be multi-pronged, including:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex gap-3">
                  <span className="text-[#F94F36] font-bold text-xl">•</span>
                  <p style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}>
                    Returning earned benefits to Black veterans and their families, including pensions, disability pay, housing, education, and survivor benefits.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F94F36] font-bold text-xl">•</span>
                  <p style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}>
                    Codifying federal reform and protections to foster greater accountability and prevent future harm.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F94F36] font-bold text-xl">•</span>
                  <p style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}>
                    Maintaining a historical record that is preserved and accessible to scholars, policymakers, and the general public.
                  </p>
                </li>
              </ul>
            </div>

            {/* ============================================== */}
            {/* OUR THEORY OF CHANGE */}
            {/* ============================================== */}
            <div style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
              <h2
                className="font-gunterz font-bold uppercase"
                style={{ fontSize: 'clamp(1.5rem, 1rem + 2vw, 2rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                Our Theory of Change
              </h2>
              <p
                className="leading-relaxed mb-8"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)' }}
              >
                Our Theory of Change centers on our priorities across three core pillars:
              </p>

              {/* Venn Diagram - Desktop */}
              <div className="hidden md:block mb-8">
                <VennDiagram onSectionClick={handleSectionClick} />
              </div>

              {/* Pillar Cards - Mobile */}
              <div className="md:hidden space-y-8">
                <PillarCard
                  title="Impact Litigation"
                  description="Builds the case for repair through data and law, turning fragmented evidence into a shared record that compels accountability."
                  href="#litigation"
                  accentColor="#F44708"
                />
                <PillarCard
                  title="Narrative Hub"
                  description="Carries the evidence and stories into public understanding, shifting the nation's consciousness to imagine and envision repair as achievable."
                  href="#narrative"
                  accentColor="#FDC500"
                />
                <PillarCard
                  title="Mobilization"
                  description="Organizes communities as stewards of repair, rebuilding collective power into coordinated action."
                  href="#mobilization"
                  accentColor="#56C035"
                />
              </div>
            </div>
          </div>

          {/* ============================================== */}
          {/* IMPACT LITIGATION */}
          {/* ============================================== */}
          <div id="litigation" className="scroll-mt-40" style={{ marginBottom: 'clamp(4rem, 10vw, 8rem)' }}>
            <h2
              className="font-gunterz font-bold uppercase"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              Impact Litigation
            </h2>

            {/* Video Embed for Litigation Section */}
            <div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/9XEj1AL9Bsw?start=1"
                  title="Impact Litigation - Black Veterans Project"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              Through coordinated impact litigation with a national network of legal partners, we are working to secure reparative justice and an equitable future for Black service members, veterans, and military families.
            </p>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              Since 2020, BVP has worked to hold the Department of Veteran Affairs federally liable for its discriminatory treatment of Black veterans, helping build the legal foundation for <strong>Monk v. United States</strong> – a landmark lawsuit against the Department of Veterans Affairs alleging systemic racial discrimination in the administration of veterans' benefits that seeks accountability for decades of unequal access to education, housing, and disability benefits.
            </p>

            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              The outcomes of Monk v. United States could set a precedent for Black veterans impacted by decades of racially-biased policies and practices dating back to World War II.{' '}
              <a href="https://blackveteransproject.substack.com/p/the-case-for-repair-for-black-veterans" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:no-underline">
                Learn More About Monk v. United States →
              </a>
            </p>

            <CTABox
              title="Want to remain updated about our legal work?"
              buttonText="Become a member →"
              href="/join"
              backgroundImage="/images/cta-camo-red.png"
            />
          </div>

          {/* ============================================== */}
          {/* NARRATIVE HUB */}
          {/* ============================================== */}
          <div id="narrative" className="scroll-mt-40" style={{ marginBottom: 'clamp(4rem, 10vw, 8rem)' }}>
            <h2
              className="font-gunterz font-bold uppercase"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              Narrative Hub
            </h2>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              BVP is working to raise a national consciousness in support of repair—ensuring that reparative justice is not only imaginable, but achievable.
            </p>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              Through our Narrative Hub, BVP collaborates with veteran-advocates, scholars, journalists, artists, communities, and cultural institutions to collect and preserve Black veterans' stories.
            </p>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              By championing the voices and lived experiences of Black veterans through art, education, and media, BVP is building a public body of evidence that will shape how future generations understand the history and legacy of Black military service in America.
            </p>

            <CTABox
              title="Are you a content creator, journalist, artist, scholar, or archivist?"
              buttonText="Contribute to our Substack →"
              href="https://blackveteransproject.substack.com"
              external
              backgroundImage="/images/cta-camo-yellow.png"
            />
          </div>

          {/* ============================================== */}
          {/* MOBILIZATION */}
          {/* ============================================== */}
          <div id="mobilization" className="scroll-mt-40">
            <h2
              className="font-gunterz font-bold uppercase"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              Mobilization
            </h2>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              Today, there are three million Black veterans in the United States, with an estimated 15 million Americans hailing from Black military families. BVP functions as a hub to mobilize Black service members, veterans, their families, and allies. By channeling our collective power as stewards of repair, we are building a national network of change-makers to drive advocacy that drives policy and resources to achieve repair, foster equity, and sustain democracy.
            </p>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
            >
              The strength of this work is further multiplied through collaboration with organizations at the intersection of civil rights, racial justice, disability justice, and veterans advocacy.
            </p>
            <p
              className="leading-relaxed"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
            >
              Veterans who share their stories join our membership corps, which can be activated to support future advocacy campaigns.
            </p>

            <CTABox
              title="Do you support repair, equity, and democracy?"
              buttonText="Join the movement →"
              href="/join"
              backgroundImage="/images/cta-camo-green.png"
            />
          </div>
        </div>
      </section>
    </>
  );
}
