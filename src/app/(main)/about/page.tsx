'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

// ============================================
// TEAM DATA
// ============================================
const team = [
  {
    name: 'Richard Brookshire',
    role: 'Co-CEO + Co-Founder',
    bio: 'Richard Brookshire is a multi-hyphenate storyteller and reparationist working at the intersection of politics and culture. A nationally recognized political communications strategist, writer, director, and filmmaker, he\'s held previous leadership roles in communications strategy at Iraq & Afghanistan Veterans of America, the Human Rights Campaign, and The New School.\n\nHe is a former U.S. Army Combat Medic and a veteran of the War in Afghanistan. He is an alumnus of Fordham University, Columbia University School of International & Public Affairs, and New York Film Academy\'s Documentary Filmmaking School.',
    image: null,
    initials: 'RB',
    linkedin: 'https://www.linkedin.com/in/richardbrookshire/',
  },
  {
    name: 'Kyle Bibby',
    role: 'Co-CEO + Co-Founder',
    bio: 'Kyle Bibby is one of the co-founders of the Black Veterans Project. He also serves as the Chief of Campaigns at Color of Change, and as a Political Partner with the Truman National Security Project.\n\nAs a former Marine Corps infantry captain and Afghanistan War veteran, Kyle is a proven leader dedicated to equal rights, social justice, and ending wars. He served as a Presidential Management Fellow at the Office of Management and Budget during the Obama Administration.\n\nKyle holds a Master in Public Administration from Columbia University\'s School of International and Public Affairs, and a Bachelor of Science in Political Science from the United States Naval Academy.',
    image: null,
    initials: 'KB',
    linkedin: 'https://www.linkedin.com/in/kylebibby/',
  },
  {
    name: 'Zella Vanié',
    role: 'Co-Founder + Board Chair',
    bio: 'Zella Vanié is a multidisciplinary artist and designer whose work is at the intersection of strategy and design. Zella has spent their career helping organizations build inclusive products, craft stories, and push creative ideas to their highest potential.\n\nMost recently they worked as a Staff Product Designer at the Chan Zuckerberg Initiative. Zella is a veteran of the U.S. Army and earned an MFA in Interaction Design from the School of Visual Arts.',
    image: null,
    initials: 'ZV',
    linkedin: 'https://www.linkedin.com/in/zellavanie/',
  },
  {
    name: 'Daniele Anderson',
    role: 'Co-Founder & Board Member',
    bio: 'Daniele is a nationally recognized strategist, historian, and researcher focused on strengthening healthcare access, data-informed advocacy, and institutional accountability. She is deeply committed to building more humane, effective, and equitable systems, particularly for veterans and historically underserved communities.\n\nShe has held senior leadership roles in research, policy, and strategy at Color of Change and Black Economic Alliance Foundation, where she helped translate data and community insight into institutional reform and public impact.\n\nA former Surface Warfare Officer, Daniele served five years in the U.S. Navy. She is a graduate of the United States Naval Academy and holds a Master of Arts from Columbia University.',
    image: '/images/team/daniele-anderson.jpg',
    initials: 'DA',
    linkedin: 'https://www.linkedin.com/in/danieleanderson/',
  },
  {
    name: 'MaCherie Dunbar',
    role: 'Board Member',
    bio: 'MaCherie Dunbar brings policy and legislative expertise to advance BVP\'s organizational objectives. A retired Air Force veteran, she served as a combat engineer with two tours to Iraq during Operation Iraqi Freedom.\n\nShe was featured in Google Doodle\'s military voices initiative, has contributed to VA budget recommendations, and served as keynote speaker for VA\'s first LGBTQ+ Veteran Town Hall. She is a political appointee on the Washington DC Mayor\'s Advisory Committee for LGBTQ Affairs.',
    image: '/images/team/macherie-dunbar.jpg',
    initials: 'MD',
    linkedin: 'https://www.linkedin.com/in/macheriedunbar/',
  },
  {
    name: 'Mary L. Tobin',
    role: 'Board Member',
    bio: 'Mary L. Tobin is Director of Brickyard Chapters and Programs at More Perfect Union. She previously served in the Biden-Harris administration as Senior Advisor for Wounded Warrior, Veteran, and Military Family Initiatives at AmeriCorps.\n\nA West Point graduate, Mary served 10 years in the United States Army as a communications officer with two combat tours in Iraq. She serves as Vice President of the West Point Women Alumni Organization and Co-Founder of the West Point African-American Alumni Association.',
    image: null,
    initials: 'MT',
    linkedin: 'https://www.linkedin.com/in/maryltobin/',
  },
  {
    name: 'Dr. Ravi K. Perry',
    role: 'Board Member',
    bio: 'Dr. Ravi K. Perry is a Professor of Political Science at Howard University, holding a B.A. from the University of Michigan and M.A. and Ph.D. from Brown University.\n\nAn expert on Black politics, minority representation, urban politics, and LGBT candidates of color, he is finishing a book on Black lesbian and gay elected officials in the United States. He is the proud descendant of generations of Armed Forces family members across World War I, World War II, Korean and Vietnam Wars.',
    image: null,
    initials: 'RP',
    linkedin: 'https://www.linkedin.com/in/ravikperry/',
  },
];

// ============================================
// TEAM CARD COMPONENT
// ============================================
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string | null;
  initials: string;
  linkedin?: string;
}

function TeamCard({
  member,
  index,
  onClick,
  isActive
}: {
  member: TeamMember;
  index: number;
  onClick: () => void;
  isActive: boolean;
}) {
  const teaser = member.bio.split('\n\n')[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${member.name}, ${member.role} — tap to read full bio`}
      className={`
        relative aspect-[2/3] md:aspect-[3/4] overflow-hidden cursor-pointer bg-black
        group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDC500] focus-visible:ring-inset
        ${isActive ? 'ring-2 ring-[#FDC500] ring-inset' : ''}
      `}
    >
      {/* Photo */}
      <div className="absolute inset-0 overflow-hidden">
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-[600ms] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#141414]">
            <span className="font-gunterz text-[clamp(36px,8vw,80px)] text-[#252525] tracking-wider">
              {member.initials}
            </span>
          </div>
        )}
      </div>

      {/* Number */}
      <div className={`
        absolute top-3 right-3.5 font-display font-bold text-[11px] tracking-widest z-10
        transition-colors duration-300
        ${isActive ? 'text-[#FDC500]' : 'text-white/20 group-hover:text-[#FDC500]'}
      `}>
        0{index + 1}
      </div>

      {/* Info Panel */}
      <div className="
        absolute bottom-0 left-0 right-0 bg-black z-10
        p-4 md:p-5
        md:translate-y-[calc(100%-110px)] md:group-hover:translate-y-0
        transition-transform duration-500 ease-out
      ">
        <h3 className="font-display font-bold text-white text-[clamp(17px,3.5vw,22px)] uppercase tracking-wide leading-tight">
          {member.name}
        </h3>
        <div className="w-6 h-px bg-[#FDC500]/60 my-1.5 md:my-2" />
        <p className="text-[clamp(8px,1.6vw,10px)] md:text-[10px] uppercase tracking-[0.13em] text-[#FDC500] leading-tight md:mb-3">
          {member.role}
        </p>

        {/* Desktop teaser - hidden on mobile */}
        <p className="hidden md:block text-[12px] leading-[1.65] text-gray-500 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 line-clamp-2 mb-3">
          {teaser}
        </p>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-[#FDC500] opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
          <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          Full bio
        </div>

        {/* Mobile tap hint */}
        <div className="flex md:hidden items-center gap-1 mt-1.5 text-[8px] uppercase tracking-widest text-[#FDC500]/40">
          <svg className="w-[9px] h-[9px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
          Tap for bio
        </div>
      </div>

      {/* Gold accent bar */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-[3px] bg-[#FDC500] z-20
        origin-left transition-transform duration-400 ease-out
        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
      `} />
    </motion.article>
  );
}

// ============================================
// TEAM DRAWER COMPONENT
// ============================================
function TeamDrawer({
  member,
  index,
  totalCount,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: {
  member: TeamMember | null;
  index: number;
  totalCount: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

  // Horizontal swipe state
  const swipeStartX = useRef(0);
  const swipeStartY = useRef(0);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && index > 0) onPrev();
      if (e.key === 'ArrowRight' && index < totalCount - 1) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, index, totalCount, onClose, onPrev, onNext]);

  // Reset scroll when member changes
  useEffect(() => {
    if (bodyRef.current && isOpen) {
      bodyRef.current.scrollTop = 0;
    }
  }, [member, isOpen]);

  // Mobile drag handlers
  const handleDragStart = useCallback((clientY: number) => {
    if (window.innerWidth >= 768) return;
    setIsDragging(true);
    dragStartY.current = clientY;
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging || window.innerWidth >= 768) return;
    const delta = Math.max(0, clientY - dragStartY.current);
    setDragY(delta > 60 ? 60 + (delta - 60) * 0.4 : delta);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || window.innerWidth >= 768) return;
    setIsDragging(false);
    if (dragY > 100) {
      onClose();
    }
    setDragY(0);
  }, [isDragging, dragY, onClose]);

  // Horizontal swipe handlers for navigation
  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    swipeStartX.current = e.touches[0].clientX;
    swipeStartY.current = e.touches[0].clientY;
  }, []);

  const handleSwipeEnd = useCallback((e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - swipeStartY.current);
    // Only horizontal swipes (not vertical scrolling) - dx > 60px, dy < 40px
    if (Math.abs(dx) > 60 && dy < 40) {
      if (dx < 0 && index < totalCount - 1) onNext(); // swipe left = next
      if (dx > 0 && index > 0) onPrev(); // swipe right = prev
    }
  }, [index, totalCount, onNext, onPrev]);

  if (!member) return null;

  const bioParagraphs = member.bio.split('\n\n');

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[8px] md:backdrop-blur-none"
          />
        )}
      </AnimatePresence>

      {/* Drawer - Right side panel on desktop, bottom sheet on mobile */}
      <div
        ref={drawerRef}
        onTouchStart={handleSwipeStart}
        onTouchEnd={handleSwipeEnd}
        className={`
          fixed z-[100] bg-black flex flex-col overflow-hidden
          transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          left-0 right-0 bottom-0 h-[88vh] rounded-t-[20px]
          shadow-[0_-4px_40px_rgba(0,0,0,0.4)]
          md:left-auto md:top-0 md:right-0 md:bottom-0 md:h-auto md:w-[480px] md:max-w-[95vw] md:rounded-none md:shadow-xl
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}
        `}
        style={{
          transform: isDragging ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : undefined,
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Team member bio"
      >
        {/* Mobile drag handle */}
        <div
          className="flex md:hidden justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-9 h-1 bg-white/10 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 md:top-5 right-4 md:right-5 w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Photo */}
        <div
          className="relative w-full h-[200px] md:h-[320px] bg-[#181818] shrink-0 overflow-hidden"
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
        >
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-gunterz text-[clamp(64px,14vw,110px)] text-[#222]">
                {member.initials}
              </span>
            </div>
          )}
          {/* Gold accent line under photo */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-[#FDC500]" />
        </div>

        {/* Header */}
        <div className="px-5 md:px-7 py-4 md:py-5 border-b border-[#1c1c1c] shrink-0">
          <h2 className="font-display font-bold text-white text-[clamp(24px,5vw,32px)] uppercase tracking-wide leading-tight mb-2">
            {member.name}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#FDC500]">
            {member.role}
          </p>
        </div>

        {/* Scrollable body */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto px-5 md:px-7 py-5 md:py-6 overscroll-contain"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}
        >
          <div className="space-y-4">
            {bioParagraphs.map((p, i) => (
              <p key={i} className="text-[16px] leading-[1.75] text-gray-400">
                {p}
              </p>
            ))}
          </div>

          {/* LinkedIn */}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-7 text-[11px] uppercase tracking-[0.13em] text-[#FDC500] border-b border-[#FDC500]/25 hover:border-[#FDC500] pb-0.5 transition-colors"
            >
              <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-2 mt-6 pt-5 border-t border-[#1c1c1c]">
            <button
              onClick={onPrev}
              disabled={index === 0}
              className="w-10 h-10 border border-[#252525] hover:border-[#FDC500] hover:bg-[#FDC500]/5 disabled:opacity-30 disabled:hover:border-[#252525] disabled:hover:bg-transparent rounded-full flex items-center justify-center transition-all"
              aria-label="Previous"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              onClick={onNext}
              disabled={index === totalCount - 1}
              className="w-10 h-10 border border-[#252525] hover:border-[#FDC500] hover:bg-[#FDC500]/5 disabled:opacity-30 disabled:hover:border-[#252525] disabled:hover:bg-transparent rounded-full flex items-center justify-center transition-all"
              aria-label="Next"
            >
              <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
            <span className="text-[11px] tracking-widest text-[#3a3a3a] ml-2">
              {index + 1} of {totalCount}
            </span>
          </div>

          {/* Mobile swipe hint - fades out after 3 seconds */}
          <div
            className="flex md:hidden items-center justify-center gap-1.5 pt-4 text-[10px] uppercase tracking-[0.12em] text-[#2a2a2a]"
            style={{
              animation: 'fadeHint 3s ease 1s forwards',
            }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 8l-6 6-6-6"/>
            </svg>
            Swipe down to close
          </div>
          <style jsx>{`
            @keyframes fadeHint {
              0% { opacity: 1; }
              70% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

// ============================================
// TEAM SECTION COMPONENT
// ============================================
function TeamSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openDrawer = (index: number) => setActiveIndex(index);
  const closeDrawer = () => setActiveIndex(null);
  const prevMember = () => {
    if (activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  const nextMember = () => {
    if (activeIndex !== null && activeIndex < team.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <section
      id="founders"
      className="bg-[#f0ede8] scroll-mt-20"
      style={{ padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2.5rem)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-12 px-2 md:px-4">
          <h2
            className="font-display font-bold uppercase"
            style={{ fontSize: 'clamp(1.75rem, 1rem + 3vw, 2.5rem)' }}
          >
            Our Team
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
          {team.map((member, index) => (
            <TeamCard
              key={member.name}
              member={member}
              index={index}
              onClick={() => openDrawer(index)}
              isActive={activeIndex === index}
            />
          ))}
        </div>
      </div>

      {/* Drawer */}
      <TeamDrawer
        member={activeIndex !== null ? team[activeIndex] : null}
        index={activeIndex ?? 0}
        totalCount={team.length}
        isOpen={activeIndex !== null}
        onClose={closeDrawer}
        onPrev={prevMember}
        onNext={nextMember}
      />
    </section>
  );
}


// ============================================
// ABOUT PAGE — WHO WE ARE
// ============================================

// Timeline data
const timelineData = [
  {
    year: '2020',
    title: 'Yale Law School collaboration begins',
    summary: 'Yale Law School collaboration begins',
    image: null,
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

// Partners data
const partners = [
  { name: 'Robert Wood Johnson Foundation', logo: '/images/partners/rwjf.png', scale: 1 },
  { name: 'Liberation Ventures', logo: '/images/partners/lv.png', scale: 1.6 },
  { name: 'National Veterans Council for Legal Redress', logo: '/images/partners/nvclr.png', scale: 1 },
  { name: 'May & Stanley Smith Charitable Trust', logo: '/images/partners/mssct.png', scale: 1 },
  { name: 'Legal Services Corporation', logo: '/images/partners/lsc.png', scale: 1.5 },
  { name: 'Connecticut Veterans Legal Center', logo: '/images/partners/cvlc.png', scale: 1 },
];

// Timeline Component
function Timeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 280 + 16;
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

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide"
          >
            {timelineData.map((item) => (
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
          <div className="absolute top-[6px] left-0 right-0 h-[1px] bg-black" />

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

                <div
                  className={`absolute bottom-full mb-6 bg-white border-l-4 border-black w-[min(520px,calc(100vw-3rem))] z-20 shadow-lg transition-all duration-200 ${
                    index >= 3 ? 'right-0' : 'left-0'
                  } ${
                    hoveredIndex === index
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
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
      {/* HERO */}
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

      {/* MISSION */}
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

      {/* TIMELINE */}
      <Timeline />

      {/* TEAM */}
      <TeamSection />

      {/* PARTNERS */}
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
              <div key={partner.name} className="flex items-center justify-center h-28 w-full group">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={280}
                  height={120}
                  className="w-auto object-contain opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300 ease-out"
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

      {/* PRESS CTA */}
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
