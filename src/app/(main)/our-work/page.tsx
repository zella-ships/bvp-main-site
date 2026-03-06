'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// ============================================
// OUR WORK PAGE
// Sections: Hero, Sticky Sub-Nav, Case for Repair (with Venn diagram),
// Impact Litigation, Narrative Hub, Movement Building
// ============================================

const sections = [
  { id: 'case-for-repair', label: 'The Case for Repair' },
  { id: 'litigation', label: 'Impact Litigation' },
  { id: 'narrative', label: 'Narrative Hub' },
  { id: 'movement-building', label: 'Movement Building' },
];

// Stats data
const stats = [
  {
    line1: '$100B',
    line2: 'DENIED',
    description:
      "Since World War II, disparities in veterans' benefits have cost Black veterans and their families an estimated $100 Billion.",
  },
  {
    line1: '32X',
    line2: 'WEALTH GAP',
    description:
      'White veterans hold 32 times more wealth than Black veterans—a gap of $164,000.',
  },
  {
    line1: '33%',
    line2: 'HOMELESS',
    description:
      "An alarming 33% of Black veterans account for 1/3 of our nation's homeless veteran population and face a 44% greater likelihood of unemployment.",
  },
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
    if (navRef.current && window.innerWidth <= 960) {
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

// Theory of Change Venn Diagram Component
function VennDiagram() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [repairActive, setRepairActive] = useState(false);

  const pillars = {
    narrative: {
      href: '#narrative',
      description: "Carries the evidence and stories into public understanding, shifting the nation's imagination so repair becomes thinkable.",
    },
    litigation: {
      href: '#litigation',
      description: 'Builds the case for repair through data and law, turning fragmented evidence into a shared record that compels accountability.',
    },
    movement: {
      href: '#movement-building',
      description: 'Organizes communities as stewards of repair, rebuilding collective power into coordinated action.',
    },
  };

  // Colors matching the pillar cards on home page exactly
  const colors = {
    narrative: { bg: '#1a1500', accent: '#FDC500' },     // Dark yellow-brown / gold
    litigation: { bg: '#720C0C', accent: '#F44708' },    // Dark red / orange
    movement: { bg: '#143601', accent: '#56C035' },      // Dark green / bright green
  };

  // 20% larger radius: 185 * 1.2 = 222
  const R = 222;
  // Circle centers (adjusted for larger size)
  const centers = {
    narrative: { cx: 620, cy: 270 },
    litigation: { cx: 500, cy: 470 },
    movement: { cx: 740, cy: 470 },
  };

  const handlePillarClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      const offset = window.innerWidth <= 960 ? 130 : 160;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
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

  // Camo only shows on hover
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
          {/* Camo patterns - using objectBoundingBox for seamless fill */}
          <pattern id="camo-yellow-venn" patternUnits="userSpaceOnUse" width="200" height="200">
            <image href="/images/camo-yellow.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="camo-red-venn" patternUnits="userSpaceOnUse" width="200" height="200">
            <image href="/images/camo-red.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>
          <pattern id="camo-green-venn" patternUnits="userSpaceOnUse" width="200" height="200">
            <image href="/images/camo-green.png" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
          </pattern>

          {/* Clip paths for overlaps */}
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

        {/* NARRATIVE CIRCLE (top - dark yellow/brown with gold text) */}
        <g
          className="cursor-pointer"
          style={{
            opacity: getPillarOpacity('narrative'),
            transform: getPillarScale('narrative'),
            transformOrigin: `${centers.narrative.cx}px ${centers.narrative.cy}px`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
          onMouseEnter={() => { setActiveKey('narrative'); setRepairActive(false); }}
          onClick={(e) => handlePillarClick(e, pillars.narrative.href)}
        >
          {/* Solid base color */}
          <circle cx={centers.narrative.cx} cy={centers.narrative.cy} r={R} fill={colors.narrative.bg} />
          {/* Camo overlay - only visible on hover */}
          <circle
            cx={centers.narrative.cx}
            cy={centers.narrative.cy}
            r={R}
            fill="url(#camo-yellow-venn)"
            style={{ opacity: getCamoOpacity('narrative'), transition: 'opacity 0.4s ease-out' }}
          />
          <text x={centers.narrative.cx} y={centers.narrative.cy - 50} textAnchor="middle" fill={colors.narrative.accent} style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.2em' }} className="uppercase pointer-events-none">
            <tspan x={centers.narrative.cx}>Narrative</tspan>
            <tspan x={centers.narrative.cx} dy="28">Building</tspan>
          </text>
        </g>

        {/* MOVEMENT CIRCLE (bottom right - dark green with green text) */}
        <g
          className="cursor-pointer"
          style={{
            opacity: getPillarOpacity('movement'),
            transform: getPillarScale('movement'),
            transformOrigin: `${centers.movement.cx}px ${centers.movement.cy}px`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
          onMouseEnter={() => { setActiveKey('movement'); setRepairActive(false); }}
          onClick={(e) => handlePillarClick(e, pillars.movement.href)}
        >
          <circle cx={centers.movement.cx} cy={centers.movement.cy} r={R} fill={colors.movement.bg} />
          <circle
            cx={centers.movement.cx}
            cy={centers.movement.cy}
            r={R}
            fill="url(#camo-green-venn)"
            style={{ opacity: getCamoOpacity('movement'), transition: 'opacity 0.4s ease-out' }}
          />
          <text x={centers.movement.cx + 50} y={centers.movement.cy + 30} textAnchor="middle" fill={colors.movement.accent} style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.2em' }} className="uppercase pointer-events-none">
            <tspan x={centers.movement.cx + 50}>Movement</tspan>
            <tspan x={centers.movement.cx + 50} dy="28">Building</tspan>
          </text>
        </g>

        {/* LITIGATION CIRCLE (bottom left - dark red with orange text) */}
        <g
          className="cursor-pointer"
          style={{
            opacity: getPillarOpacity('litigation'),
            transform: getPillarScale('litigation'),
            transformOrigin: `${centers.litigation.cx}px ${centers.litigation.cy}px`,
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
          onMouseEnter={() => { setActiveKey('litigation'); setRepairActive(false); }}
          onClick={(e) => handlePillarClick(e, pillars.litigation.href)}
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

        {/* PAIRWISE OVERLAPS - show active pillar's camo when hovered */}
        {/* Narrative + Litigation overlap */}
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
        {/* Narrative + Movement overlap */}
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
        {/* Litigation + Movement overlap */}
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

        {/* TRIPLE INTERSECTION — Repair (subdued when pillar is hovered) */}
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
          <foreignObject x="1040" y="235" width="260" height="180">
            <div>
              <p className="text-base leading-relaxed text-gray-600 mb-4">
                {pillars.narrative.description}
              </p>
              <a
                href={pillars.narrative.href}
                onClick={(e) => handlePillarClick(e, pillars.narrative.href)}
                className="text-sm font-bold border-b pb-0.5 transition-colors"
                style={{ color: colors.narrative.accent, borderColor: colors.narrative.accent }}
              >
                Learn more →
              </a>
            </div>
          </foreignObject>
        </g>

        {/* CALLOUT: Litigation */}
        <g className={`transition-opacity duration-300 ${activeKey === 'litigation' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <circle cx="365" cy="430" r="4" fill={colors.litigation.accent} />
          <line x1="365" y1="430" x2="30" y2="430" stroke={colors.litigation.accent} strokeWidth="1" />
          <line x1="30" y1="430" x2="30" y2="450" stroke={colors.litigation.accent} strokeWidth="1" />
          <foreignObject x="30" y="455" width="260" height="200">
            <div>
              <p className="text-base leading-relaxed text-gray-600 mb-4">
                {pillars.litigation.description}
              </p>
              <a
                href={pillars.litigation.href}
                onClick={(e) => handlePillarClick(e, pillars.litigation.href)}
                className="text-sm font-bold border-b pb-0.5 transition-colors"
                style={{ color: colors.litigation.accent, borderColor: colors.litigation.accent }}
              >
                Learn more →
              </a>
            </div>
          </foreignObject>
        </g>

        {/* CALLOUT: Movement */}
        <g className={`transition-opacity duration-300 ${activeKey === 'movement' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <circle cx="875" cy="430" r="4" fill={colors.movement.accent} />
          <line x1="875" y1="430" x2="1040" y2="430" stroke={colors.movement.accent} strokeWidth="1" />
          <line x1="1040" y1="430" x2="1040" y2="450" stroke={colors.movement.accent} strokeWidth="1" />
          <foreignObject x="1040" y="455" width="260" height="180">
            <div>
              <p className="text-base leading-relaxed text-gray-600 mb-4">
                {pillars.movement.description}
              </p>
              <a
                href={pillars.movement.href}
                onClick={(e) => handlePillarClick(e, pillars.movement.href)}
                className="text-sm font-bold border-b pb-0.5 transition-colors"
                style={{ color: colors.movement.accent, borderColor: colors.movement.accent }}
              >
                Learn more →
              </a>
            </div>
          </foreignObject>
        </g>

        {/* CALLOUT: Repair */}
        <g className={`transition-opacity duration-300 ${repairActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <circle cx="660" cy="415" r="4" fill="#C4985A" />
          <line x1="660" y1="415" x2="1040" y2="415" stroke="#C4985A" strokeWidth="1" />
          <line x1="1040" y1="415" x2="1040" y2="435" stroke="#C4985A" strokeWidth="1" />
          <foreignObject x="1040" y="440" width="260" height="200">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#C4985A] mb-2">Repair</p>
              <p className="text-base leading-relaxed italic text-black mb-3">
                Not a fourth pillar — the reason the other three exist.
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                Each alone is insufficient. Repair requires all three working in concert.
              </p>
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
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

export default function OurWorkPage() {
  const [activeSection, setActiveSection] = useState('case-for-repair');

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const trigger = window.innerWidth <= 960 ? 140 : 170;
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
          const offset = window.innerWidth <= 960 ? 130 : 160;
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
      const offset = window.innerWidth <= 960 ? 130 : 160;
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
              className="font-gunterz font-bold text-white"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 4vw, 3.75rem)' }}
            >
              Research. Litigation. Narrative. Movement Building.
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
            {/* CASE FOR REPAIR */}
            {/* ============================================== */}
            <div id="case-for-repair" className="scroll-mt-40" style={{ marginBottom: 'clamp(4rem, 10vw, 8rem)' }}>
              <h2
                className="font-gunterz font-bold uppercase"
                style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
              >
                The Case for Repair
              </h2>

              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
              >
                Since the Revolutionary War, Black veterans have been serving this country with honor
                and courage. Yet today, despite unyielding loyalty and patriotism, they continue to be
                systematically shut out from the very benefits and opportunities they fought for:
              </p>

              {/* Stats Data Vis */}
              <div style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
                {stats.map((stat, index) => (
                  <div
                    key={stat.line1}
                    className="bg-[#F94F36]"
                    style={{
                      marginBottom: index !== stats.length - 1 ? '4px' : '0',
                    }}
                  >
                    <div
                      className="flex flex-col sm:grid sm:grid-cols-[minmax(140px,200px)_1fr] sm:items-center"
                      style={{
                        padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 3rem)',
                        gap: 'clamp(1rem, 3vw, 2rem)',
                      }}
                    >
                      <div>
                        <p
                          className="font-gunterz font-black text-white leading-[0.95] uppercase"
                          style={{ fontSize: 'clamp(1.75rem, 1.25rem + 2.5vw, 2.75rem)' }}
                        >
                          {stat.line1}
                          <br />
                          {stat.line2}
                        </p>
                      </div>
                      <div>
                        <p
                          className="leading-relaxed text-white italic"
                          style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}
                        >
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                After World War II, Jim Crow policies, redlining, and discriminatory college admissions
                blocked Black military members from receiving GI Bill benefits like disability
                compensation, home loans, and academic opportunity. Years later these exclusions have
                cost Black communities billions of dollars and continue to fuel the disproportionate
                rates of Black veteran homelessness, unemployment, and incarceration we're seeing today.
              </p>

              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                <span className="font-bold">This denial is by design.</span> We have the evidence to
                prove it.
              </p>

              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                Starting in 2020, BVP has been collecting millions of government records documenting
                America's mistreatment of Black veterans, alongside a host of racially discriminatory
                policies and practices spanning decades. This research equips educators, policymakers,
                artists, and the public with the facts, stories, and legal grounding needed to chart the
                path towards recompensation and repair.
              </p>

              <p
                className="leading-relaxed font-bold"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                America's democracy has reached its tipping point, making the fight for Black veterans'
                rights more urgent than ever.
              </p>

              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                In January 2025, the federal government instituted executive orders that dismantled
                equity programs and revoked critical protections. At the U.S. Department of Veteran
                Affairs (VA), offices that monitored racial disparities in veterans' benefits were
                completely eliminated. The very systems built to measure inequity are being stripped at
                a time when they are most needed.
              </p>

              <p
                className="leading-relaxed font-bold"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}
              >
                The Black Veterans Project was built for this moment.
              </p>

              {/* Theory of Change */}
              <div style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
                <h3
                  className="font-gunterz font-bold uppercase"
                  style={{ fontSize: 'clamp(1.25rem, 0.9rem + 1.5vw, 1.5rem)', marginBottom: '0.25rem' }}
                >
                  How Repair Happens
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
                >
                  The Black Veterans Project's approach to repair is multi-pronged and includes:
                </p>

                <ul
                  className="list-disc list-inside pl-4"
                  style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
                >
                  <li
                    className="leading-relaxed"
                    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', marginBottom: '1rem' }}
                  >
                    Returning benefits to veterans and military families – including housing, education,
                    disability compensation, home loans and survivor benefits.
                  </li>
                  <li
                    className="leading-relaxed"
                    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', marginBottom: '1rem' }}
                  >
                    Ensuring transparent reporting, measurable standards, and protections codified in
                    law.
                  </li>
                  <li
                    className="leading-relaxed"
                    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}
                  >
                    Maintaining a historical record that is preserved and accessible to scholars,
                    policymakers, and the general public.
                  </li>
                </ul>

                <p
                  className="leading-relaxed"
                  style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
                >
                  BVP's "Theory of Change" centers on our five year priorities along three core pillars:
                </p>

                {/* Theory of Change Diagram */}
                <div className="hidden md:block mb-8">
                  <VennDiagram />
                </div>

                {/* Mobile: Pillar cards with camo backgrounds */}
                <div className="md:hidden space-y-3 mb-8">
                  {[
                    { name: 'Narrative Building', href: '#narrative', bg: '#1a1500', camo: '/images/camo-yellow.png', accent: '#FDC500' },
                    { name: 'Impact Litigation', href: '#litigation', bg: '#720C0C', camo: '/images/camo-red.png', accent: '#F44708' },
                    { name: 'Movement Building', href: '#movement-building', bg: '#143601', camo: '/images/camo-green.png', accent: '#56C035' },
                  ].map((pillar) => (
                    <a
                      key={pillar.name}
                      href={pillar.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSectionClick(pillar.href.substring(1));
                      }}
                      className="block relative overflow-hidden rounded-lg"
                      style={{ backgroundColor: pillar.bg }}
                    >
                      {/* Camo background */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${pillar.camo})`,
                          backgroundSize: '150px',
                          backgroundRepeat: 'repeat',
                          opacity: 0.3,
                        }}
                      />
                      {/* Content */}
                      <div className="relative z-10 p-5 flex items-center justify-between">
                        <span className="font-gunterz font-bold text-white text-lg">{pillar.name}</span>
                        <span className="text-xl" style={{ color: pillar.accent }}>→</span>
                      </div>
                    </a>
                  ))}
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
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                Since 2020, BVP has been working to hold the Department of Veteran Affairs federally
                liable for its racist and discriminatory treatment of Black service members. We are
                using coordinated impact litigation to secure reparations for Black veterans and their
                families.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                Through collaborative partnerships with Yale Law School, Harvard Law School, and Quinn
                Emanuel LLP, we help prepare Black veterans to participate in reparative litigation. BVP
                functions as a hub for community movement building and uses a membership-based model to
                organize Black veterans, maximizing their ability to pursue legal recourse.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
              >
                In 2021, BVP built the legal foundation for Monk v. United States, a landmark lawsuit
                against the VA that alleges systemic racial discrimination and seeks accountability for
                decades of unequal access to education, housing, and disability benefits. The outcomes
                of Monk v United States could set a precedent for Black veterans impacted by decades of
                racially-biased practices and policies dating back to World War II.{' '}
                <Link href="/faq" className="font-bold underline hover:no-underline">
                  Learn More About Monk v. U.S. →
                </Link>
              </p>

              <CTABox
                title="Are you a veteran who's experienced benefit barriers or delays?"
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
                At BVP, one of our "North Star" goals is to shift national consciousness towards
                believing that true repair is not only imaginable, but achievable.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                Through our Narrative Hub, BVP works with advocates, scholars, artists, communities and
                cultural institutions to collect and preserve Black veterans' stories.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
              >
                By championing the voices and lived experiences of Black veterans through art, education
                and the media, we are building a public body of evidence that will shape how future
                generations understand the history and legacy of Black military service in America.
              </p>

              <CTABox
                title="Connect with stories, research, and dispatches from the movement for reparative justice"
                buttonText="Explore/Sign up to our Substack →"
                href="https://blackveteransproject.substack.com"
                external
                backgroundImage="/images/cta-camo-yellow.png"
              />
            </div>

            {/* ============================================== */}
            {/* MOVEMENT BUILDING */}
            {/* ============================================== */}
            <div id="movement-building" className="scroll-mt-40">
              <h2
                className="font-gunterz font-bold uppercase"
                style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
              >
                Movement Building
              </h2>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                There are three million Black veterans in the U.S. today, and an estimated 15 million
                Americans come from Black military families. BVP is channeling this collective power to
                build a national network that drives advocacy and advances racial equity within and
                outside of the Armed forces.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                BVP maintains critical relationships with key members of the House and Senate Veterans
                Affairs Committees and provides routine expert testimony at hearings. The strength of
                this work is further multiplied through our relationships with organizations at the
                intersection of civil rights, racial justice, disability justice, and veterans advocacy.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                By mobilizing our communities as stewards of repair, we can translate collective power
                into coordinated action that grows leadership, drives policy, and redirects resources.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
              >
                Veterans who share their stories join our membership corps, which can be activated to
                support future advocacy campaigns.
              </p>

              <CTABox
                title="Are you a veteran or from a military family?"
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
