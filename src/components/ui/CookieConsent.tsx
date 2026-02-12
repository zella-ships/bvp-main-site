"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ============================================
// BVP COOKIE CONSENT BANNER + PREFERENCES DRAWER
// Full ARIA support + Focus Trap for iOS Accessibility
// ============================================

const COOKIE_CONSENT_KEY = "bvp-cookie-consent";

type ConsentPreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

// Focus Trap Hook for modals
function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when modal opens
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes modal
      if (e.key === "Escape") {
        container.dispatchEvent(new CustomEvent("escape-pressed"));
        return;
      }

      // Tab key handling for focus trap
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  return containerRef;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  const focusTrapRef = useFocusTrap(isVisible);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const existingConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (existingConsent) {
      // User has already accepted/declined - don't show again
      return;
    }

    // Show consent banner after 1 second delay for new visitors
    const timer = setTimeout(() => {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle escape key
  useEffect(() => {
    const container = focusTrapRef.current;
    if (!container) return;

    const handleEscape = () => handleClose();
    container.addEventListener("escape-pressed", handleEscape);
    return () => container.removeEventListener("escape-pressed", handleEscape);
  }, []);

  // Return focus when modal closes
  useEffect(() => {
    if (!isVisible && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isVisible]);

  // Announce to screen readers when modal opens
  useEffect(() => {
    if (isVisible) {
      const announcement = document.createElement("div");
      announcement.setAttribute("role", "status");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = "Cookie consent dialog opened. We use cookies to enhance your experience.";
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    }
  }, [isVisible]);

  const handleAccept = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ ...preferences, analytics: true, marketing: true }));
    setIsVisible(false);
  }, [preferences]);

  const handleRejectAll = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    setIsVisible(false);
  }, []);

  const handleSaveChoices = useCallback(() => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    setIsVisible(false);
  }, [preferences]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  }, []);

  const togglePreference = useCallback((key: keyof ConsentPreferences) => {
    if (key === "necessary") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={focusTrapRef}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
          }}
          className="fixed bottom-0 left-0 right-0 z-50"
          // ARIA: Dialog role with proper labeling
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          {/* Main Banner — text/Accept hide when expanded, bar + X stay */}
          <div
            className={cn(
              "bg-white/50 backdrop-blur-md border-t border-white/40",
              "px-4 md:px-12 py-4",
              "flex flex-col md:flex-row items-center justify-between gap-3 md:gap-8"
            )}
          >
            {!isExpanded && (
              <>
                <motion.p
                  id="cookie-consent-description"
                  className="text-black text-sm md:text-base text-center md:text-left"
                  animate={{
                    opacity: isClosing ? 0 : 1,
                    x: isClosing ? -20 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <span id="cookie-consent-title" className="sr-only">Cookie Consent</span>
                  We use cookies to enhance your experience.{" "}
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-black underline underline-offset-2 hover:text-[#FDC500] active:text-[#FDC500] transition-colors font-bold"
                    aria-expanded={isExpanded}
                    aria-controls="cookie-preferences-panel"
                  >
                    Manage my choices
                  </button>
                </motion.p>

                <motion.div
                  className="flex items-center gap-3"
                  animate={{
                    opacity: isClosing ? 0 : 1,
                    x: isClosing ? 20 : 0,
                  }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                >
                  <button
                    onClick={handleAccept}
                    className={cn(
                      "px-6 py-3 md:py-2.5 text-sm font-bold tracking-wide rounded-full",
                      "min-h-[44px] md:min-h-0",
                      "bg-white text-black border-2 border-black",
                      "hover:bg-black hover:border-black hover:text-[#FDC500]",
                      "active:bg-black active:text-[#FDC500]",
                      "transition-all duration-200",
                      "whitespace-nowrap"
                    )}
                    aria-label="Accept all cookies"
                  >
                    Accept
                  </button>

                  <button
                    onClick={handleClose}
                    className="relative p-3 group min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Dismiss cookie consent banner"
                  >
                    <span className="absolute inset-0 rounded-full border-2 border-[#FDC500] scale-0 group-hover:scale-100 group-active:scale-100 transition-transform duration-200" />
                    <svg
                      className="w-5 h-5 text-black relative z-10 group-hover:text-black transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              </>
            )}

            {isExpanded && <div className="flex-1" />}

            {isExpanded && (
              <motion.button
                onClick={handleClose}
                className="relative p-3 group min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close privacy preferences"
                whileTap={{ scale: 0.85, rotate: 90 }}
                animate={{
                  opacity: isClosing ? 0 : 1,
                  rotate: isClosing ? 90 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="absolute inset-0 rounded-full border-2 border-[#FDC500] scale-0 group-hover:scale-100 group-active:scale-100 transition-transform duration-200" />
                <svg
                  className="w-5 h-5 text-black relative z-10 group-hover:text-black transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Expanded Preferences Panel */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                id="cookie-preferences-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  opacity: { duration: 0.2 }
                }}
                className="bg-white/50 backdrop-blur-md border-t border-white/40 overflow-hidden"
                role="region"
                aria-label="Cookie preferences"
              >
                <div className="px-6 md:px-12 py-8 max-w-4xl mx-auto">
                  {/* Header */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-bold text-black">
                      Your Privacy Choices
                    </h2>
                  </motion.div>

                  <motion.p
                    className="text-sm text-black/60 mb-8 max-w-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    You can customize your consent preferences for tracking technologies below.
                    Toggle options on or off, then save your choices.
                    {" "}
                    <Link
                      href="/privacy"
                      className="text-black underline underline-offset-2 hover:text-[#FDC500] active:text-[#FDC500] transition-colors font-bold"
                    >
                      See full Cookie Policy
                    </Link>
                  </motion.p>

                  {/* Toggles */}
                  <motion.div
                    className="space-y-4 mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    role="group"
                    aria-label="Cookie preferences toggles"
                  >
                    <ToggleRow
                      id="analytics-toggle"
                      label="Analytics"
                      description="Help us understand how visitors interact with our website."
                      checked={preferences.analytics}
                      onChange={() => togglePreference("analytics")}
                    />
                    <ToggleRow
                      id="marketing-toggle"
                      label="Marketing"
                      description="Used to deliver relevant content and measure campaign effectiveness."
                      checked={preferences.marketing}
                      onChange={() => togglePreference("marketing")}
                    />
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col md:flex-row flex-wrap gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    role="group"
                    aria-label="Cookie consent actions"
                  >
                    <button
                      onClick={handleRejectAll}
                      className={cn(
                        "px-6 py-3 md:py-2.5 text-sm font-bold tracking-wide rounded-full",
                        "min-h-[44px] md:min-h-0",
                        "bg-white text-black border-2 border-black",
                        "hover:bg-black hover:border-black hover:text-[#FDC500]",
                        "active:bg-black active:text-[#FDC500]",
                        "transition-all duration-200",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject all
                    </button>
                    <button
                      onClick={handleAccept}
                      className={cn(
                        "px-6 py-3 md:py-2.5 text-sm font-bold tracking-wide rounded-full",
                        "min-h-[44px] md:min-h-0",
                        "bg-white text-black border-2 border-black",
                        "hover:bg-black hover:border-black hover:text-[#FDC500]",
                        "active:bg-black active:text-[#FDC500]",
                        "transition-all duration-200",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Accept all
                    </button>
                    <button
                      onClick={handleSaveChoices}
                      className={cn(
                        "px-6 py-3 md:py-2.5 text-sm font-bold tracking-wide rounded-full",
                        "min-h-[44px] md:min-h-0",
                        "bg-[#FDC500] text-black border-2 border-black",
                        "hover:bg-black hover:text-white hover:border-black",
                        "active:bg-black active:text-white",
                        "transition-all duration-200",
                        "w-full md:w-auto md:ml-auto"
                      )}
                    >
                      Save and continue
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toggle Row Component with full ARIA support
function ToggleRow({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  const descriptionId = `${id}-description`;

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-black/10">
      <div className="flex-1">
        <label htmlFor={id} className="text-base font-bold text-black cursor-pointer">
          {label}
        </label>
        <p id={descriptionId} className="text-sm text-black/50">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            checked ? "text-black" : "text-black/40"
          )}
          aria-hidden="true"
        >
          {disabled ? "Always on" : checked ? "On" : "Off"}
        </span>
        <button
          id={id}
          onClick={onChange}
          disabled={disabled}
          role="switch"
          aria-checked={checked}
          aria-describedby={descriptionId}
          aria-label={`${label} cookies: ${checked ? "enabled" : "disabled"}`}
          className={cn(
            "relative w-[52px] h-[32px] rounded-full transition-colors duration-200",
            "min-h-[44px] min-w-[44px]", // Apple HIG touch target
            checked ? "bg-[#FDC500]" : "bg-gray-300",
            disabled && "cursor-not-allowed opacity-50",
            "active:opacity-80", // Touch feedback
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FDC500]"
          )}
        >
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 border-2",
              checked ? "translate-x-5 border-[#FDC500]" : "translate-x-0 border-gray-400"
            )}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
