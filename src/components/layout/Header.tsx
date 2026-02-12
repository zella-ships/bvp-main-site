"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// ============================================
// BVP HEADER COMPONENT
// Fixed header with dropdown nav (desktop)
// Hamburger menu with slide-out (mobile)
// Full ARIA support + Focus Trap for iOS Accessibility
// ============================================

const navigation = [
  {
    name: "About Us",
    href: "/about",
    children: [
      { name: "Mission & Vision", href: "/about#mission" },
      { name: "Founders", href: "/about#founders" },
      { name: "Team", href: "/about#team" },
      { name: "Board", href: "/about#board" },
      { name: "Partners", href: "/about#partners" },
    ],
  },
  {
    name: "Our Work",
    href: "/our-work",
    children: [
      { name: "The Case for Repair", href: "/our-work#case-for-repair" },
      { name: "Impact Litigation", href: "/our-work#litigation" },
      { name: "Narrative Building", href: "/our-work#narrative" },
      { name: "Mobilization", href: "/our-work#mobilization" },
    ],
  },
  { name: "Join Us", href: "/join" },
];

// Dropdown animation variants
const dropdownVariants = {
  hidden: {
    opacity: 1,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15 }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const }
  }
};

// Mobile menu animation variants
const mobileMenuVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "tween" as const, duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: {
    x: "100%",
    transition: { type: "tween" as const, duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const mobileNavContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 }
  }
};

const mobileNavItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
  }
};

// Focus Trap Hook for mobile menu
function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when menu opens
    setTimeout(() => firstElement?.focus(), 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape]);

  return containerRef;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    // Return focus to menu button when closing
    setTimeout(() => menuButtonRef.current?.focus(), 100);
  }, []);

  const focusTrapRef = useFocusTrap(mobileMenuOpen, closeMobileMenu);

  // Handle scroll - hide header when scrolling, show at top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setAtTop(currentScrollY < 20);
      setHidden(currentScrollY > 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Announce to screen readers when menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      const announcement = document.createElement("div");
      announcement.setAttribute("role", "status");
      announcement.setAttribute("aria-live", "polite");
      announcement.className = "sr-only";
      announcement.textContent = "Navigation menu opened";
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Skip to main content link for keyboard users - Apple HIG compliant */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-6 focus:py-3 focus:min-h-[44px] focus:text-base focus:font-bold focus:bg-black focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FDC500] focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
          atTop ? "bg-transparent py-6" : "bg-transparent py-6"
        )}
        role="banner"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-[92px] flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="relative hover:opacity-80 transition-opacity"
            aria-label="Black Veterans Project - Home"
          >
            <Image
              src="/images/BVP-logo.png"
              alt="Black Veterans Project"
              width={132}
              height={66}
              className="h-11 md:h-[52px] w-auto brightness-0 invert"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative px-5 py-3 text-base font-medium text-white hover:text-bvp-gold transition-colors flex items-center gap-2 group/link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bvp-gold focus-visible:rounded",
                    pathname === item.href && "text-bvp-gold"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                  aria-haspopup={item.children ? "true" : undefined}
                  aria-expanded={item.children ? activeDropdown === item.name : undefined}
                >
                  {item.name}
                  {item.children ? (
                    <motion.span
                      animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs"
                      aria-hidden="true"
                    >
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.span>
                  ) : (
                    <span className="absolute bottom-1.5 left-5 right-5 h-[2px] bg-[#FDC500] origin-left scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300" aria-hidden="true" />
                  )}
                </Link>

                {/* Enhanced Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.name && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 pt-3"
                      role="menu"
                      aria-label={`${item.name} submenu`}
                    >
                      {/* Dropdown arrow */}
                      <div className="absolute top-3 left-8 w-3 h-3 bg-white/50 backdrop-blur-md rotate-45 -translate-y-1/2 z-10" aria-hidden="true" />

                      <div className="relative bg-white/50 backdrop-blur-md rounded-lg shadow-xl min-w-[240px] overflow-hidden border border-white/20">
                        {/* Gold accent bar at top */}
                        <div className="h-1 bg-bvp-gold" aria-hidden="true" />

                        <div className="py-2">
                          {item.children.map((child, idx) => (
                            <motion.div key={child.name} variants={itemVariants}>
                              <Link
                                href={child.href}
                                className="group/item relative block px-5 py-3 transition-all duration-200 hover:bg-[#FDC500] active:bg-[#FDC500] min-h-[44px] flex items-center"
                                onClick={() => setActiveDropdown(null)}
                                role="menuitem"
                              >
                                <div className="flex items-center justify-between gap-4 w-full">
                                  <span className="text-base font-medium text-gray-700 group-hover/item:text-black transition-colors duration-200">
                                    {child.name}
                                  </span>

                                  {/* Arrow */}
                                  <svg
                                    className="w-4 h-4 text-gray-300 group-hover/item:text-black group-hover/item:translate-x-1 transition-all duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                  </svg>
                                </div>
                              </Link>

                              {/* Divider */}
                              {idx !== item.children!.length - 1 && (
                                <div className="mx-5 border-b border-gray-100" aria-hidden="true" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Donate Button */}
            <Link href="/donate" className="ml-4">
              <Button variant="accent" size="sm">
                Donate
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button — Animated Hamburger ↔ X */}
          <button
            ref={menuButtonRef}
            className="lg:hidden relative w-11 h-11 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <motion.span
              className="absolute block h-[2px] w-6 bg-white rounded-full"
              animate={mobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -7 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              aria-hidden="true"
            />
            <motion.span
              className="absolute block h-[2px] w-6 bg-white rounded-full"
              animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
              aria-hidden="true"
            />
            <motion.span
              className="absolute block h-[2px] w-6 bg-white rounded-full"
              animate={mobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 7 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      {/* Sticky Side Donate — slides in when header hides */}
      <AnimatePresence>
        {hidden && (
          <motion.div
            className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <Link
              href="/donate"
              className={cn(
                "flex items-center justify-center",
                "bg-[#F44708] text-white font-bold text-sm tracking-widest uppercase",
                "w-[55px] h-[116px] rounded-l-[24px] shadow-lg",
                "hover:bg-white hover:text-[#F44708]",
                "active:bg-white active:text-[#F44708]",
                "border-2 border-[#F44708] border-r-0",
                "transition-all duration-300 active:scale-95"
              )}
              style={{ writingMode: "vertical-rl" }}
              aria-label="Donate to Black Veterans Project"
            >
              <span style={{ transform: "rotate(180deg)", display: "block" }}>Donate</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop — blurred */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Slide-out Menu — Frosted Glass */}
            <motion.div
              ref={focusTrapRef}
              id="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white/50 backdrop-blur-md z-50 lg:hidden border-l border-white/20 flex flex-col overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Close Button — Animated X with spin on hover */}
              <div className="flex justify-end px-4 pt-3 pb-2">
                <motion.button
                  onClick={closeMobileMenu}
                  className="relative w-11 h-11 flex items-center justify-center text-black active:text-[#FDC500] focus-visible:ring-2 focus-visible:ring-[#FDC500] focus-visible:ring-offset-2 rounded-full"
                  aria-label="Close navigation menu"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  transition={{ duration: 0.25 }}
                >
                  <motion.span
                    className="absolute block h-[2px] w-6 bg-current rounded-full"
                    style={{ rotate: 45 }}
                    aria-hidden="true"
                  />
                  <motion.span
                    className="absolute block h-[2px] w-6 bg-current rounded-full"
                    style={{ rotate: -45 }}
                    aria-hidden="true"
                  />
                </motion.button>
              </div>

              {/* Mobile Nav Links — Staggered entrance */}
              <motion.nav
                className="px-6 flex-1 overflow-y-auto min-h-0"
                style={{
                  paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
                  WebkitOverflowScrolling: 'touch'
                }}
                variants={mobileNavContainerVariants}
                initial="hidden"
                animate="visible"
                role="navigation"
                aria-label="Mobile navigation"
              >
                {navigation.map((item) => (
                  <motion.div
                    key={item.name}
                    className="border-b border-black/10"
                    variants={mobileNavItemVariants}
                  >
                    <Link
                      href={item.href}
                      className="block py-3 text-[17px] font-bold text-black hover:text-[#FDC500] active:text-[#FDC500] transition-colors"
                      onClick={closeMobileMenu}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>

                    {/* Mobile Dropdown Children - Apple HIG: 17px minimum */}
                    {item.children && (
                      <div className="pb-3 pl-4 -mt-1 space-y-0" role="list" aria-label={`${item.name} pages`}>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block py-2 text-[17px] text-black/60 hover:text-black hover:font-semibold active:text-black active:font-semibold transition-all"
                            onClick={closeMobileMenu}
                            role="listitem"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Mobile Donate Button */}
                <motion.div className="mt-4" variants={mobileNavItemVariants}>
                  <Link href="/donate" className="block" onClick={closeMobileMenu}>
                    <Button variant="accent" fullWidth>
                      Donate
                    </Button>
                  </Link>
                </motion.div>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
