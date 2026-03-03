'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// ============================================
// TEAM FLIP CARD COMPONENT
// ============================================
interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  image: string | null;
  linkedin?: string;
}

function TeamCard({ name, role, bio, image, linkedin }: TeamCardProps) {
  const [showBio, setShowBio] = useState(false);

  return (
    <article className="group">
      {/* Card Container */}
      <div className="bg-white border-2 border-black overflow-hidden" style={{ maxWidth: '340px' }}>
        {/* Photo / Bio Area */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {!showBio ? (
              <motion.div
                key="photo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-sm">[HEADSHOT]</span>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="bio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 p-6 overflow-y-auto bg-gray-50"
              >
                <p className="text-[15px] leading-relaxed text-gray-700 whitespace-pre-line">
                  {bio}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black">
          <h3 className="font-bold text-lg mb-0.5">{name}</h3>
          <p className="text-sm text-gray-500 mb-4">{role}</p>

          {/* Actions Row */}
          <div className="flex items-center justify-between">
            {/* LinkedIn */}
            {linkedin ? (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            ) : (
              <div className="w-10 h-10" />
            )}

            {/* Bio Toggle */}
            <button
              onClick={() => setShowBio(!showBio)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full
                transition-all duration-200
                ${showBio
                  ? 'bg-[#FDC500] text-black border-2 border-black'
                  : 'bg-white text-black border-2 border-gray-300 hover:border-black'
                }
              `}
              aria-expanded={showBio}
              aria-label={showBio ? 'Hide bio' : 'Show bio'}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${showBio ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Bio
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ============================================
// ABOUT PAGE — WHO WE ARE
// Sections: Hero, Mission, Timeline, Founders, Team, Board, Partners, Press CTA
// ============================================

// Timeline data
const timelineData = [
  {
    year: '2020',
    title: 'Yale Law School collaboration begins',
    summary: 'Yale Law School collaboration begins',
    image: null, // placeholder for future image
    details: [
      '<strong>Yale Law School</strong> collaboration to obtain decades of data proving sustained and <strong>systemic racial inequities in veterans disability compensation</strong> going since 2001',
    ],
  },
  {
    year: '2021',
    title: 'GAO study & coalition building',
    summary: 'GAO study & coalition building',
    image: null,
    details: [
      'Advanced a <strong>Government Accountability Office study of racial disparities in disability compensation</strong>',
      'Helped <strong>organize a national coalition of Black veterans organizations</strong> to interface with the 117th Congress',
    ],
  },
  {
    year: '2022',
    title: 'Congressional testimony',
    summary: 'Congressional testimony',
    image: null,
    details: [
      'Raised national visibility on the <strong>Sgt. Isaac Woodard, Jr. and Sgt. Joseph H. Maddox GI Bill Restoration Act</strong> as central to the coalition\'s policy agenda',
      'Testified before the House Veterans Affairs Committee to support the <strong>VA Housing Loan Forever Act</strong>, draft legislation to extend unused VA home loans to descendants',
    ],
  },
  {
    year: '2023',
    title: 'Monk v. United States filed',
    summary: 'Monk v. United States filed',
    image: null,
    details: [
      '<strong>Monk v. United States</strong> is filed, becoming the first landmark case leveraging internal VA data to allege racial discrimination in the allocation of veterans benefits since 1945',
      'Collaborated with <strong>NBC News</strong> on investigative reporting for the <strong>case for reparations for Black veterans</strong>',
    ],
  },
  {
    year: '2024',
    title: 'Harvard & Quinn Emanuel partnership',
    summary: 'Harvard & Quinn Emanuel partnership',
    image: null,
    details: [
      'Established an impact litigation partnership with <strong>Harvard Law School and Quinn Emanuel LLP</strong>',
      'Began working with <strong>Harvard Kennedy School\'s Trotter Collaborative for Social Justice</strong> formulating a repair and reform legislative strategy',
    ],
  },
];

// Founders data
const founders = [
  {
    name: 'Richard Brookshire',
    role: 'Co-CEO + Co-Founder',
    bio: 'Richard Brookshire is a multi-hyphenate storyteller and reparationist working at the intersection of politics and culture. A nationally recognized political communications strategist, writer, director, and filmmaker, he\'s held previous leadership roles in communications strategy at Iraq & Afghanistan Veterans of America, the Human Rights Campaign, and The New School. He is a former U.S. Army Combat Medic and a veteran of the War in Afghanistan. He is an alumnus of Fordham University, Columbia University School of International & Public Affairs, and New York Film Academy\'s Documentary Filmmaking School.',
    image: null,
    linkedin: 'https://www.linkedin.com/in/richardbrookshire/',
  },
  {
    name: 'Kyle Bibby',
    role: 'Co-CEO + Co-Founder',
    bio: 'Kyle Bibby is one of the co-founders of the Black Veterans Project. He also serves as the Chief of Campaigns at Color of Change, and as a Political Partner with the Truman National Security Project. As a former Marine Corps infantry captain and Afghanistan War veteran, Kyle is a proven leader dedicated to equal rights, social justice, and ending wars. Prior to his role at Color of Change, Kyle served as a Deputy Political Director for Common Defense. Previously, Kyle was a Director at the New Jersey Reentry Corporation (NJRC). He\'s served as a Presidential Management Fellow (PMF) assigned to the Office of Management and Budget (OMB) in the Executive Office of the President during the Obama Administration. Kyle has received a Master in Public Administration from Columbia University\'s School of International and Public Affairs, and a Bachelor of Science in Political Science from the United States Naval Academy.',
    image: null,
    linkedin: 'https://www.linkedin.com/in/kylebibby/',
  },
  {
    name: 'Zella Vanié',
    role: 'Co-Founder + Board Chair',
    bio: 'Zella Vanié is a multidisciplinary artist and designer whose work is at the intersection of strategy and design. Zella has spent their career helping organizations build inclusive products, craft stories, and push creative ideas to their highest potential. Most recently they worked as a Staff Product Designer at the Chan Zuckerberg Initiative. Zella is a veteran of the U.S. Army and earned an MFA in Interaction Design from the School of Visual Arts.',
    image: null,
    linkedin: 'https://www.linkedin.com/in/zellavanie/',
  },
  {
    name: 'Daniele Anderson',
    role: 'Co-Founder & Board Member',
    bio: 'Daniele is a nationally recognized strategist, historian, and researcher focused on strengthening healthcare access, data-informed advocacy, and institutional accountability. She is deeply committed to building more humane, effective, and equitable systems, particularly for veterans and historically underserved communities. She has held senior leadership roles in research, policy, and strategy at Color of Change and Black Economic Alliance Foundation, where she helped translate data and community insight into institutional reform and public impact.\n\nA former Surface Warfare Officer, Daniele served five years in the U.S. Navy. She is a graduate of the United States Naval Academy and holds a Master of Arts from Columbia University.',
    image: '/images/team/daniele-anderson.jpg',
    linkedin: 'https://www.linkedin.com/in/danieleanderson/',
  },
  {
    name: 'MaCherie Dunbar',
    role: 'Board Member',
    bio: '',
    image: '/images/team/macherie-dunbar.jpg',
    linkedin: 'https://www.linkedin.com/in/macheriedunbar/',
  },
  {
    name: 'Mary L. Tobin',
    role: 'Board Member',
    bio: '',
    image: null,
    linkedin: 'https://www.linkedin.com/in/maryltobin/',
  },
  {
    name: 'Dr. Ravi K. Perry',
    role: 'Board Member',
    bio: '',
    image: null,
    linkedin: 'https://www.linkedin.com/in/ravikperry/',
  },
];

// Partners data - scale adjusts individual logo sizes for visual balance
const partners = [
  { name: 'Robert Wood Johnson Foundation', logo: '/images/partners/rwjf.png', scale: 1 },
  { name: 'Liberation Ventures', logo: '/images/partners/lv.png', scale: 1.6 },
  { name: 'National Veterans Council for Legal Redress', logo: '/images/partners/nvclr.png', scale: 1 },
  { name: 'May & Stanley Smith Charitable Trust', logo: '/images/partners/mssct.png', scale: 1 },
  { name: 'Legal Services Corporation', logo: '/images/partners/lsc.png', scale: 1.5 },
  { name: 'Connecticut Veterans Legal Center', logo: '/images/partners/cvlc.png', scale: 1 },
];

// Timeline Component with mobile scroll tracking
function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 280 + 16; // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(newIndex, timelineData.length - 1));
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollEl.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section
      className="bg-gray-100"
      style={{
        padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 6rem)',
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <h2
          className="font-display font-bold uppercase"
          style={{
            fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)',
            marginBottom: 'clamp(2rem, 5vw, 4rem)',
          }}
        >
          Our History
        </h2>

        {/* Mobile Timeline */}
        <div className="block lg:hidden">
          {/* Timeline dots */}
          <div className="relative mb-8">
            <div className="absolute top-[10px] left-4 right-4 h-[2px] bg-gray-300" />
            <div className="flex justify-between px-4">
              {timelineData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (scrollRef.current) {
                      scrollRef.current.scrollTo({
                        left: index * (280 + 16),
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className={`relative z-10 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-5 h-5 bg-black'
                      : 'w-4 h-4 bg-gray-400 mt-0.5'
                  }`}
                  aria-label={`Go to year ${timelineData[index].year}`}
                />
              ))}
            </div>
          </div>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide"
          >
            {timelineData.map((item, index) => (
              <article
                key={item.year}
                className="flex-shrink-0 w-[280px] bg-white rounded-2xl p-8 shadow-sm snap-start"
              >
                <p className="text-4xl font-bold text-black mb-4">{item.year}</p>
                <p className="text-xl font-bold mb-4">{item.title}</p>
                <p className="text-base text-gray-600 leading-relaxed">
                  {item.details[0]?.replace(/<[^>]*>/g, '')}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Timeline Line */}
          <div className="absolute top-[6px] left-0 right-0 h-[1px] bg-black" />

          {/* Timeline Items */}
          <div className="grid grid-cols-5 gap-8">
            {timelineData.map((item, index) => (
              <div
                key={item.year}
                className="relative cursor-pointer group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                tabIndex={0}
                role="button"
                aria-expanded={hoveredIndex === index}
                aria-label={`${item.year}: ${item.title}`}
              >
                <div className="w-3 h-3 bg-black rounded-full mb-6 relative z-10" />
                <p className="text-2xl font-bold mb-2">{item.year}</p>
                <p className="text-sm leading-snug text-gray-600">{item.summary}</p>

                {/* Hover Content - appears ABOVE the timeline */}
                <div
                  className={`absolute bottom-full mb-6 bg-white border-l-4 border-black w-[min(520px,calc(100vw-3rem))] z-20 shadow-lg transition-all duration-200 ${
                    index >= 3 ? 'right-0' : 'left-0'
                  } ${
                    hoveredIndex === index
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  {/* Image area */}
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={`${item.year} - ${item.title}`}
                        width={520}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">[IMAGE]</span>
                    )}
                  </div>
                  <div className="p-8 space-y-4">
                    {item.details.map((detail, i) => (
                      <p
                        key={i}
                        className="text-base leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: detail }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
        {/* ============================================== */}
        {/* HERO */}
        {/* ============================================== */}
        <section
          id="mission"
          className="relative flex items-end scroll-mt-20"
          style={{ height: 'clamp(50vh, 60vw, 70vh)' }}
        >
          <img
            src="/images/who-we-are.jpg"
            alt="Black Army veterans proudly waving American flag"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
          <div
            className="relative z-10 max-w-[1400px] mx-auto w-full"
            style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem)' }}
          >
            <p className="text-sm uppercase tracking-widest mb-4 text-white/60">Who We Are</p>
            <h1
              className="font-gunterz font-bold text-white"
              style={{ fontSize: 'clamp(2rem, 1.5rem + 4vw, 3.75rem)' }}
            >
              Building the Case for Repair
            </h1>
          </div>
        </section>

        {/* ============================================== */}
        {/* MISSION */}
        {/* ============================================== */}
        <section style={{ padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 6rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-4xl">
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                The Black Veterans Project leverages research, narrative storytelling, public
                advocacy, and impact litigation to redress the federal government's long history of
                racism and discrimination against Black veterans and their families.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                BVP represents the first comprehensive effort to pursue reparative justice for Black
                service members who have been unjustly denied their civil rights and benefits.
              </p>
              <p
                className="leading-relaxed"
                style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
              >
                Join us as we build the collective power to demand accountability, advance policy
                change, and achieve reparations for Black veterans in America.
              </p>
              <p
                className="text-gray-600"
                style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)' }}
              >
                BVP is a 501(c)(3) nonprofit organization.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* TIMELINE */}
        {/* ============================================== */}
        <Timeline />

        {/* ============================================== */}
        {/* TEAM */}
        {/* ============================================== */}
        <section
          id="founders"
          className="bg-gray-100 scroll-mt-20"
          style={{ padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 6rem)' }}
        >
          <div className="max-w-[1400px] mx-auto">
            <h2
              className="font-display font-bold uppercase"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}
            >
              Our Team
            </h2>
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              {founders.map((founder) => (
                <TeamCard
                  key={founder.name}
                  name={founder.name}
                  role={founder.role}
                  bio={founder.bio}
                  image={founder.image}
                  linkedin={founder.linkedin}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* PARTNERS */}
        {/* ============================================== */}
        <section
          id="partners"
          className="scroll-mt-20"
          style={{ padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 6rem)' }}
        >
          <div className="max-w-[1400px] mx-auto">
            <h2
              className="font-display font-bold uppercase text-center"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}
            >
              Our Partners
            </h2>
            <p
              className="text-gray-600 text-center"
              style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}
            >
              Organizations advancing the work alongside us.
            </p>

            <div
              className="grid grid-cols-2 md:grid-cols-3 items-center justify-items-center"
              style={{ gap: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              {partners.map((partner) => (
                <div key={partner.name} className="flex items-center justify-center h-28 w-full">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={280}
                    height={120}
                    className="w-auto object-contain brightness-[1.08] contrast-[1.1] mix-blend-multiply hover:brightness-100 hover:contrast-100 transition-all duration-300"
                    style={{
                      maxHeight: `${100 * (partner.scale || 1)}px`,
                      maxWidth: `${220 * (partner.scale || 1)}px`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================== */}
        {/* PRESS CTA */}
        {/* ============================================== */}
        <section
          className="bg-black text-white"
          style={{ padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 6rem)' }}
        >
          <div className="max-w-[1400px] mx-auto">
            <div
              className="grid items-center"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'clamp(2rem, 5vw, 4rem)',
              }}
            >
              <div>
                <h2
                  className="font-display font-bold"
                  style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}
                >
                  Press & Media
                </h2>
                <p
                  className="leading-relaxed opacity-80"
                  style={{ fontSize: 'clamp(1.125rem, 0.9rem + 1vw, 1.25rem)', marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}
                >
                  For press inquiries, interview requests, or media resources.
                </p>
                <Button href="/contact" variant="white" size="lg">
                  Contact Us →
                </Button>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide mb-6 opacity-60">Featured In</p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  <span className="text-white/70 font-bold text-lg tracking-tight">BBC</span>
                  <span className="text-white/70 font-serif text-xl italic">The New York Times</span>
                  <span className="text-white/70 font-bold text-lg uppercase tracking-wider">Politico</span>
                  <span className="text-white/70 font-serif text-lg italic">The Washington Post</span>
                  <span className="text-white/70 font-bold text-xl">CBS</span>
                  <span className="text-white/70 font-bold text-xl tracking-tight">CNN</span>
                  <span className="text-white/70 font-bold text-lg">TheGrio</span>
                  <span className="text-white/70 font-bold text-lg uppercase tracking-widest">Reuters</span>
                  <span className="text-white/70 font-bold text-lg italic">The Root</span>
                  <span className="text-white/70 font-bold text-lg uppercase">USA Today</span>
                </div>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
