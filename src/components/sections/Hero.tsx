'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                         HERO SECTION SPECS                                ║
 * ╠═══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                           ║
 * ║  HEIGHT: 100vh (min: 600px, max: 1200px)                                 ║
 * ║  CONTAINER: max-width 1400px, centered                                    ║
 * ║                                                                           ║
 * ║  ┌─────────────────────────────────────────────────────────────────────┐ ║
 * ║  │                                                                     │ ║
 * ║  │  PADDING TOP (header clearance):                                    │ ║
 * ║  │    Mobile:  120px (pt-[120px])                                      │ ║
 * ║  │    Tablet:  140px (md:pt-[140px])                                   │ ║
 * ║  │    Desktop: 160px (lg:pt-[160px])                                   │ ║
 * ║  │                                                                     │ ║
 * ║  │  PADDING HORIZONTAL:                                                │ ║
 * ║  │    Mobile:  24px  (px-6)                                            │ ║
 * ║  │    Desktop: 48px  (md:px-12)                                        │ ║
 * ║  │                                                                     │ ║
 * ║  │  PADDING BOTTOM:                                                    │ ║
 * ║  │    Mobile:  48px  (pb-12)                                           │ ║
 * ║  │    Tablet:  64px  (md:pb-16)                                        │ ║
 * ║  │    Desktop: 96px  (lg:pb-24)                                        │ ║
 * ║  │                                                                     │ ║
 * ║  │  HEADLINE:                                                          │ ║
 * ║  │    Max width: 896px (max-w-4xl)                                     │ ║
 * ║  │    Font sizes: 30→36→48→60→72px (text-3xl to xl:text-7xl)          │ ║
 * ║  │    Line height: 1.1                                                 │ ║
 * ║  │                                                                     │ ║
 * ║  │  HEADLINE → CTAs GAP:                                               │ ║
 * ║  │    Mobile:  32px  (mt-8)                                            │ ║
 * ║  │    Tablet:  40px  (md:mt-10)                                        │ ║
 * ║  │    Desktop: 48px  (lg:mt-12)                                        │ ║
 * ║  │                                                                     │ ║
 * ║  │  CTA BUTTONS GAP: 16px (gap-4)                                      │ ║
 * ║  │                                                                     │ ║
 * ║  └─────────────────────────────────────────────────────────────────────┘ ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

interface HeroProps {
  headline?: string;
  backgroundImage?: string;
  showDebugSpacing?: boolean;
}

export function Hero({
  headline = "We advance reparative justice for Black veterans and military families through litigation, narrative, and mobilization.",
  backgroundImage = "/images/hero-home.png",
  showDebugSpacing = false,
}: HeroProps) {
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

  // Track viewport for debug (debounced for performance)
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
        {/* Next.js Image for better loading */}
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            quality={85}
            className="object-cover object-bottom"
            sizes="100vw"
          />
        )}

        {/* Fallback gradient if no image */}
        {!backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-bvp-navy" />
        )}

        {/* Gradient Overlay - fades in slightly after image */}
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
        {/* Debug: Show padding markers */}
        {showDebugSpacing && (
          <>
            {/* Top padding marker */}
            <div className="absolute top-0 left-6 md:left-12 right-6 md:right-12 h-24 md:h-28 lg:h-32 bg-orange-500/20 border-b-2 border-orange-500 flex items-center justify-center">
              <span className="bg-orange-500 text-white text-xs font-mono px-2 py-1">
                pt: {viewport.width >= 1024 ? '128px' : viewport.width >= 768 ? '112px' : '96px'}
              </span>
            </div>
            {/* Bottom padding marker */}
            <div className="absolute bottom-0 left-6 md:left-12 right-6 md:right-12 h-12 md:h-16 lg:h-24 bg-blue-500/20 border-t-2 border-blue-500 flex items-center justify-center">
              <span className="bg-blue-500 text-white text-xs font-mono px-2 py-1">
                pb: {viewport.width >= 1024 ? '96px' : viewport.width >= 768 ? '64px' : '48px'}
              </span>
            </div>
            {/* Left padding marker */}
            <div className="absolute top-24 md:top-28 lg:top-32 bottom-12 md:bottom-16 lg:bottom-24 left-0 w-6 md:w-[92px] bg-green-500/20 border-r-2 border-green-500 flex items-center justify-center">
              <span className="bg-green-500 text-white text-xs font-mono px-1 py-0.5 -rotate-90 whitespace-nowrap">
                px: {viewport.width >= 768 ? '92px' : '24px'}
              </span>
            </div>
            {/* Right padding marker */}
            <div className="absolute top-24 md:top-28 lg:top-32 bottom-12 md:bottom-16 lg:bottom-24 right-0 w-6 md:w-[92px] bg-green-500/20 border-l-2 border-green-500 flex items-center justify-center">
              <span className="bg-green-500 text-white text-xs font-mono px-1 py-0.5 -rotate-90 whitespace-nowrap">
                px: {viewport.width >= 768 ? '92px' : '24px'}
              </span>
            </div>
          </>
        )}

        {/* Main Content - Full width */}
        <motion.div
          className="w-full mt-[40px]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Headline - Full width, each phrase on its own line */}
          <h1
            className="
              font-gunterz
              font-bold
              text-white
              leading-[1.15]
            "
            style={{ fontSize: 'clamp(1.5rem, 1rem + 3vw, 3.5rem)' }}
          >
            {headline.split('. ').map((phrase, i, arr) => (
              <span key={i} className="block">
                {phrase}{i < arr.length - 1 ? '.' : ''}
              </span>
            ))}
          </h1>

          {/* CTA Button */}
          <a
            href="/join"
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
            Become a member
            <span className="text-xl">→</span>
          </a>

          {/* Debug: Show content specs */}
          {showDebugSpacing && (
            <div className="mt-8 p-4 bg-black/90 border-2 border-bvp-gold font-mono text-xs text-white space-y-2">
              <p className="text-bvp-gold font-bold mb-2">📐 HERO SPECS (Current: {viewport.width}px)</p>
              <p>Container: <span className="text-bvp-gold">max-w-[1400px]</span></p>
              <p>Headline max-width: <span className="text-bvp-gold">896px (max-w-4xl)</span></p>
              <p>
                Headline size: <span className="text-bvp-gold">
                  {viewport.width >= 1280 ? '72px (xl:text-7xl)' : 
                   viewport.width >= 1024 ? '60px (lg:text-6xl)' :
                   viewport.width >= 768 ? '48px (md:text-5xl)' :
                   viewport.width >= 640 ? '36px (sm:text-4xl)' : '30px (text-3xl)'}
                </span>
              </p>
              <p>Line-height: <span className="text-bvp-gold">1.1</span></p>
              <p>
                Headline → CTA gap: <span className="text-bvp-gold">
                  {viewport.width >= 1024 ? '48px (lg:mt-12)' : 
                   viewport.width >= 768 ? '40px (md:mt-10)' : '32px (mt-8)'}
                </span>
              </p>
              <p>CTA buttons gap: <span className="text-bvp-gold">16px (gap-4)</span></p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator — fades out on scroll, stays gone */}
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

      {/* Debug: Container and breakpoint info */}
      {showDebugSpacing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-mono px-4 py-2 z-50 border-2 border-bvp-gold">
          <span className="text-bvp-gold">{viewport.width}px</span> · Container: 1400px · 
          Content padding: {viewport.width >= 768 ? '48px' : '24px'}
        </div>
      )}
    </section>
  );
}

/**
 * RESPONSIVE BREAKPOINT SUMMARY
 * =============================
 * 
 * Default (< 640px) - Mobile:
 *   - Headline: text-3xl (30px)
 *   - Padding: pt-[120px] pb-12 px-6
 *   - CTAs: Full width, stacked
 * 
 * sm (640px+) - Large Mobile:
 *   - Headline: text-4xl (36px)
 *   - CTAs: Inline
 * 
 * md (768px+) - Tablet:
 *   - Headline: text-5xl (48px)
 *   - Padding: pt-[140px] pb-16 px-12
 * 
 * lg (1024px+) - Laptop:
 *   - Headline: text-6xl (60px)
 *   - Padding: pt-[160px] pb-24
 * 
 * xl (1280px+) - Desktop:
 *   - Headline: text-7xl (72px)
 * 
 * 2xl (1536px+) - Large Desktop:
 *   - No additional changes (content maxes at 1400px)
 */
