'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

/**
 * Hero V2 Component
 *
 * Updated version with:
 * - "Get Involved" CTA linking to /join-v2
 * - Consistent with BVP Membership 3.0 language
 */

interface HeroV2Props {
  headline?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function HeroV2({
  headline = "Defend the Legacy. Fight for Equity. Protect Democracy.",
  backgroundImage = "/images/hero-home.webp",
  ctaText = "Get Involved",
  ctaHref = "/join-v2",
}: HeroV2Props) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effect on background (disabled for reduced motion)
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['0%', '30%']
  );

  // Track viewport for responsive adjustments
  const [viewport, setViewport] = useState({ width: 0 });
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const update = () => setViewport({ width: window.innerWidth });
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(update, 150);
    };
    update();
    window.addEventListener('resize', debouncedUpdate);
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="
        relative
        h-screen
        min-h-[600px]
        max-h-[1200px]
        w-full
        overflow-hidden
        bg-black
      "
    >
      {/* Background Image with Parallax + Entrance Animation */}
      <motion.div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: backgroundY }}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            quality={85}
            className="object-cover object-[70%_center] md:object-bottom"
            sizes="100vw"
          />
        )}

        {!backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-bvp-navy" />
        )}

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)',
          }}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.3 }}
        />
      </motion.div>

      {/* Content Container */}
      <div
        className="
          relative z-10
          h-full
          max-w-[1400px]
          mx-auto
          flex flex-col justify-end
        "
        style={{
          paddingTop: 'clamp(5rem, 8vw, 8rem)',
          paddingBottom: 'clamp(7.5rem, 4vw + 99px, 12rem)',
          paddingLeft: 'clamp(1rem, 4vw, 5.75rem)',
          paddingRight: 'clamp(1rem, 4vw, 5.75rem)',
        }}
      >
        {/* Main Content */}
        <motion.div
          className="w-full mt-[40px]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Headline */}
          <h1
            className="
              font-gunterz
              font-bold
              text-white
              leading-[1.15]
            "
            style={{ fontSize: 'clamp(1.4rem, 0.85rem + 2.75vw, 3.5rem)' }}
          >
            {headline.split('. ').map((phrase, i, arr) => (
              <span key={i} className="block whitespace-nowrap">
                {phrase}{i < arr.length - 1 ? '.' : ''}
              </span>
            ))}
          </h1>

          {/* CTA Button - Updated to "Get Involved" */}
          <a
            href={ctaHref}
            className="
              inline-flex items-center gap-3
              mt-8 md:mt-10
              px-8 py-4
              bg-[#FDC500] text-black
              font-ontika font-medium text-base md:text-lg tracking-wide
              rounded-full
              transition-all duration-300
              hover:bg-black hover:text-[#FDC500] hover:scale-[1.02]
              active:scale-95
            "
          >
            {ctaText}
            <span className="text-xl">→</span>
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      {!prefersReducedMotion && (
        <motion.div
          className="hidden md:flex absolute z-10 flex-col items-center gap-2 pointer-events-none"
          style={{
            bottom: 'calc(clamp(2rem, 4vw, 4rem) + 65px)',
            right: 'clamp(4.75rem, 5vw, 5.125rem)',
            opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <span className="text-white/60 text-xs font-mono uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
