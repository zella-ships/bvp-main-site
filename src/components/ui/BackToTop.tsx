'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Back to Top Button
 * - Appears after scrolling down 400px
 * - Smooth scroll to top on click
 * - Respects reduced motion preference
 * - 44px touch target (Apple HIG)
 * - Keyboard accessible
 * - Throttled scroll handler for performance
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  const toggleVisibility = useCallback(() => {
    // Show button after scrolling 400px
    const shouldShow = window.scrollY > 400;
    if (shouldShow !== (lastScrollY.current > 400)) {
      setIsVisible(shouldShow);
    }
    lastScrollY.current = window.scrollY;
    rafRef.current = null;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Throttle with requestAnimationFrame for smooth 60fps updates
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(toggleVisibility);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [toggleVisibility]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
          onClick={scrollToTop}
          className="
            fixed bottom-6 right-6 z-50
            w-11 h-11 min-w-[44px] min-h-[44px]
            flex items-center justify-center
            bg-black text-white
            border-2 border-white/20
            rounded-full
            shadow-lg
            hover:bg-[#FDC500] hover:text-black hover:border-[#FDC500]
            focus-visible:ring-2 focus-visible:ring-[#FDC500] focus-visible:ring-offset-2 focus-visible:ring-offset-black
            transition-colors duration-200
            active:scale-95
          "
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
