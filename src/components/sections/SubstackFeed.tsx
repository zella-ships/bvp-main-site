'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Dark Green Report brand colors
const CREAM = "#F0E8D0";
const CREAM_DARK = "#E5DCBF";
const GREEN_DARK = "#1A3A1A";
const GREEN_MID = "#2D5A2D";
const GREEN_LIGHT = "#4A8A4A";

// Dark Green Report Logo Component
function DarkGreenReportLogo({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/images/dgr-logo.webp"
      alt="Dark Green Report"
      style={{ width: size, height: 'auto' }}
      className="object-contain"
    />
  );
}

interface SubstackPost {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl: string | null;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  } catch {
    return dateString;
  }
}

export function SubstackFeed() {
  const prefersReducedMotion = useReducedMotion();
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalPost, setModalPost] = useState<SubstackPost | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/substack');
        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Show loading skeleton
  if (loading) {
    return (
      <section
        className="border-t-4 border-[#FDC500] bg-white"
        style={{ padding: 'clamp(3rem, 8vw, 8rem) clamp(1rem, 4vw, 5.75rem)' }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="h-1 bg-[#FDC500]" />
                <div className="h-56 bg-gray-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error fallback
  if (error || posts.length === 0) {
    return (
      <section
        className="border-t-4 border-[#FDC500] bg-white"
        style={{ padding: 'clamp(3rem, 8vw, 8rem) clamp(1rem, 4vw, 5.75rem)' }}
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            From Our Substack
          </p>
          <h2 className="font-gunterz font-bold text-2xl mb-4">
            Stories from the Movement
          </h2>
          <a
            href="https://blackveteransproject.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-2.5 text-base font-bold tracking-wide rounded-full border-2 border-black bg-white text-black transition-all duration-300 hover:bg-black hover:text-[#FDC500]"
          >
            Visit Our Substack
            <svg className="w-4 h-4 ml-2 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    );
  }

  // Fallback images for posts that might not have images in RSS
  const getFallbackImage = (title: string): string | null => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('congressional') || lowerTitle.includes('testimony') || lowerTitle.includes('testifies')) {
      return 'https://substack-video.s3.amazonaws.com/video_upload/post/189895249/bfad24c4-b3be-422f-b983-393f3840145c/transcoded-00001.png';
    }
    return null;
  };

  // Get the image for a post with fallback support
  const getPostImage = (post: SubstackPost): string | null => {
    return post.imageUrl || getFallbackImage(post.title);
  };

  // Prioritize specific posts in preferred order
  const sortPosts = (posts: SubstackPost[]) => {
    const priority = [
      'case for repair',      // Featured (main)
      'reckoning in mississippi', // Secondary 1
      'congressional testimony',  // Secondary 2
    ];

    return [...posts].sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();

      const aIndex = priority.findIndex(p => aTitle.includes(p));
      const bIndex = priority.findIndex(p => bTitle.includes(p));

      // If both have priority, sort by priority order
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      // If only a has priority, a comes first
      if (aIndex !== -1) return -1;
      // If only b has priority, b comes first
      if (bIndex !== -1) return 1;
      // Otherwise keep original order
      return 0;
    });
  };

  const sortedPosts = sortPosts(posts);
  const [featured, ...rest] = sortedPosts;
  const secondaryPosts = rest.slice(0, 2);

  return (
    <>
      <section
        className="border-t-4 border-[#FDC500] bg-white"
        style={{ padding: 'clamp(3rem, 8vw, 8rem) clamp(1rem, 4vw, 5.75rem)' }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Featured Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-center">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                From Our Substack
              </p>
              <h2
                className="font-gunterz font-bold leading-tight mb-3"
                style={{ fontSize: 'clamp(1.5rem, 0.75rem + 3vw, 2.5rem)' }}
              >
                {featured.title}
              </h2>
              <p className="text-gray-600 mb-4" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)' }}>
                {featured.description}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setModalPost(featured)}
                  className="inline-flex items-center px-6 py-2.5 text-base font-bold tracking-wide rounded-full border-2 border-black bg-white text-black transition-all duration-300 hover:bg-black hover:text-[#FDC500] hover:border-black active:scale-95"
                >
                  Read Article
                  <svg className="w-4 h-4 ml-2 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                <span className="text-sm text-gray-400">{formatDate(featured.pubDate)}</span>
              </div>
            </div>

            {/* Featured Image */}
            <button
              onClick={() => setModalPost(featured)}
              className="relative group cursor-pointer text-left"
            >
              <div className="relative aspect-[16/10] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                {featured.imageUrl ? (
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center transition-all duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundColor: CREAM }}
                  >
                    <DarkGreenReportLogo size={100} />
                    <p
                      className="text-xs tracking-[3px] uppercase font-bold mt-5"
                      style={{ color: GREEN_DARK }}
                    >
                      Dark Green Report
                    </p>
                    <p
                      className="text-[10px] mt-1.5 opacity-50"
                      style={{ color: GREEN_MID }}
                    >
                      by Black Veterans Project
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FDC500] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          </div>

          {/* Secondary Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryPosts.map((post, index) => (
              <button
                key={post.link || index}
                onClick={() => setModalPost(post)}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden text-left transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-1 bg-[#FDC500] rounded-t-2xl" />
                <div className="h-72 overflow-hidden" style={{ backgroundColor: CREAM }}>
                  {getPostImage(post) ? (
                    <img
                      src={getPostImage(post)!}
                      alt={post.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center transition-all duration-500 group-hover:scale-105"
                      style={{ backgroundColor: CREAM }}
                    >
                      <DarkGreenReportLogo size={80} />
                      <p
                        className="text-[10px] tracking-[2px] uppercase font-bold mt-4"
                        style={{ color: GREEN_DARK }}
                      >
                        Dark Green Report
                      </p>
                      <p
                        className="text-[9px] mt-1 opacity-50"
                        style={{ color: GREEN_MID }}
                      >
                        by Black Veterans Project
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FDC500]">
                    Substack
                  </span>
                  <h3 className="font-ontika font-medium text-xl text-black leading-tight mt-3 mb-3 group-hover:text-[#FDC500] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-400">{formatDate(post.pubDate)}</span>
                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-black group-hover:text-[#FDC500] transition-colors">
                      Read More
                      <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-8">
            <a
              href="https://blackveteransproject.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-bold uppercase tracking-wide text-gray-500 hover:text-black transition-colors"
            >
              View all posts on Substack
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Dark Green Report Modal */}
      <AnimatePresence>
        {modalPost && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setModalPost(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full rounded-xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: CREAM,
                boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${CREAM_DARK}`,
              }}
            >
              {/* Top green gradient bar */}
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${GREEN_DARK}, ${GREEN_MID}, ${GREEN_DARK})` }}
              />

              <div className="p-8 md:p-10">
                {/* Close button */}
                <button
                  onClick={() => setModalPost(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ color: GREEN_MID }}
                >
                  <svg className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Logo + Publication */}
                <motion.div
                  initial={prefersReducedMotion ? false : { scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", damping: 20 }}
                  className="flex flex-col items-center mb-6"
                >
                  <DarkGreenReportLogo size={60} />
                  <p
                    className="text-[11px] tracking-[3px] uppercase font-bold mt-3"
                    style={{ color: GREEN_DARK }}
                  >
                    Dark Green Report
                  </p>
                  <p
                    className="text-[11px] mt-1 opacity-60"
                    style={{ color: GREEN_MID }}
                  >
                    by Black Veterans Project
                  </p>
                </motion.div>

                {/* Divider */}
                <div
                  className="w-10 h-px mx-auto mb-6"
                  style={{ backgroundColor: GREEN_DARK, opacity: 0.15 }}
                />

                {/* Article title */}
                <h2
                  className="text-center text-2xl md:text-[26px] leading-tight mb-3"
                  style={{
                    color: GREEN_DARK,
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontWeight: 400,
                  }}
                >
                  {modalPost.title}
                </h2>

                {/* Description */}
                <p
                  className="text-center text-sm leading-relaxed mb-8 opacity-70"
                  style={{ color: GREEN_MID }}
                >
                  This article lives on our Substack publication.
                  <br />
                  You'll be taken there to continue reading.
                </p>

                {/* Actions */}
                <div className="flex flex-col items-center gap-3">
                  <a
                    href={modalPost.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setModalPost(null)}
                    className="w-full px-8 py-4 text-base font-bold tracking-wide rounded-full inline-flex items-center justify-center gap-3 transition-all duration-300 active:scale-95"
                    style={{
                      backgroundColor: GREEN_DARK,
                      color: CREAM,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = GREEN_MID}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = GREEN_DARK}
                  >
                    Read on Dark Green Report
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>

                  <button
                    onClick={() => setModalPost(null)}
                    className="px-6 py-3 text-sm transition-all duration-300"
                    style={{ color: GREEN_MID, opacity: 0.5 }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; e.currentTarget.style.color = GREEN_DARK; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = GREEN_MID; }}
                  >
                    Stay on BVP
                  </button>
                </div>
              </div>

              {/* Bottom subtle gradient */}
              <div
                className="h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${GREEN_DARK}15, transparent)` }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
