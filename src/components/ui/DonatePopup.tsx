'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Donate Popup Component
 *
 * Shows a donation modal when user scrolls down on the homepage.
 * - Preloads iframe in background for instant display
 * - Triggers after scrolling ~200px
 * - Only shows once per session
 * - Can be closed via X button or clicking backdrop
 */

interface DonatePopupProps {
  /** Scroll threshold in pixels before showing popup */
  scrollThreshold?: number;
  /** Donation form URL */
  donationFormUrl?: string;
}

const DEFAULT_DONATION_URL = 'https://cdn.donately.com/core/6.0/donate-form.html?form_id=frm_17bf7d7efced&account_id=act_1c9da0501869&stripe_key=pk_live_51EciVsFvVHN4GQU4Cyxh9ZfzIYeJQ9VXDHj4LqCHlU4XCB2cDI8vxhDzxXOJwCw5TjK89kwvuDuXEz3XeugfdcSr00nNgvHMYd';

// Full height of the Donately form (same as donate page)
const IFRAME_HEIGHT = 1335;

export function DonatePopup({
  scrollThreshold = 200,
  donationFormUrl = DEFAULT_DONATION_URL,
}: DonatePopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);

  // Check if popup was already shown this session
  useEffect(() => {
    const wasShown = sessionStorage.getItem('donatePopupShown');
    if (wasShown) {
      setHasTriggered(true);
    } else {
      // Start preloading iframe after a short delay (don't block initial page load)
      const preloadTimer = setTimeout(() => {
        setShouldPreload(true);
      }, 1000);
      return () => clearTimeout(preloadTimer);
    }
  }, []);

  // Scroll listener
  useEffect(() => {
    if (hasTriggered) return;

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem('donatePopupShown', 'true');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTriggered, scrollThreshold]);

  // Close handler
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  // Prevent body scroll when open
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

  // Loading skeleton that mimics the form layout
  const LoadingSkeleton = () => (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Amount header */}
      <div className="h-4 bg-gray-200 rounded w-40" />
      {/* Amount buttons row */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {/* Custom amount input */}
      <div className="h-14 bg-gray-200 rounded" />
      {/* Round up checkbox */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-64" />
      </div>
      {/* Frequency header */}
      <div className="h-4 bg-gray-200 rounded w-24 mt-4" />
      {/* Frequency buttons */}
      <div className="flex gap-3">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-6 bg-gray-200 rounded w-40" />
      </div>
      {/* Payment method header */}
      <div className="h-4 bg-gray-200 rounded w-32 mt-4" />
      {/* Payment card */}
      <div className="h-14 bg-gray-200 rounded" />
      {/* Card number input */}
      <div className="h-12 bg-gray-200 rounded" />
      {/* Expiry / CVC row */}
      <div className="flex gap-3">
        <div className="h-12 bg-gray-200 rounded flex-1" />
        <div className="h-12 bg-gray-200 rounded flex-1" />
      </div>
    </div>
  );

  return (
    <>
      {/* Hidden preload iframe - loads in background before popup opens */}
      {shouldPreload && !hasTriggered && (
        <iframe
          src={donationFormUrl}
          width="1"
          height="1"
          frameBorder="0"
          title="Donation Form Preload"
          onLoad={() => setIsFormLoaded(true)}
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
              aria-hidden="true"
            />

            {/* Modal Wrapper - centers and constrains the modal */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-start justify-center p-3 sm:p-4 md:p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  ref={modalRef}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-2xl bg-white rounded-xl sm:rounded-2xl shadow-2xl my-4"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="donate-popup-title"
                >
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-20 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2 shadow-md border border-gray-200"
                    aria-label="Close donation popup"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Header */}
                  <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                      Support Our Mission
                    </p>
                    <h2
                      id="donate-popup-title"
                      className="font-gunterz font-bold text-base sm:text-lg md:text-xl leading-tight text-gray-900 pr-12"
                    >
                      Help Us Secure the Legacy for Black Veterans
                    </h2>
                  </div>

                  {/* Form Container */}
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                    <div className="relative" style={{ minHeight: isFormLoaded ? 'auto' : '400px' }}>
                      {/* Loading skeleton - shows form-like placeholder */}
                      {!isFormLoaded && (
                        <div className="absolute inset-0 bg-gray-50 rounded-lg overflow-hidden">
                          <LoadingSkeleton />
                        </div>
                      )}

                      {/* Actual iframe - immediately visible if preloaded */}
                      <iframe
                        src={donationFormUrl}
                        width="100%"
                        height={IFRAME_HEIGHT}
                        frameBorder="0"
                        allow="payment *"
                        title="Donation Form"
                        onLoad={() => setIsFormLoaded(true)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          display: 'block',
                          opacity: isFormLoaded ? 1 : 0,
                          transition: 'opacity 0.15s ease',
                        }}
                      />
                    </div>

                    {/* Footer row - Tax notice and link */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-500">
                        <strong>Tax Deductible:</strong> BVP is a 501(c)(3) nonprofit.
                      </p>
                      <a
                        href="/donate"
                        className="text-xs text-gray-600 hover:text-gray-900 hover:underline"
                        onClick={handleClose}
                      >
                        View full donation page →
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
