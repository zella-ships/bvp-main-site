/**
 * GA4 Event Helpers
 *
 * Consistent event tracking across the site.
 * All events follow a standard structure for easy analysis.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

export interface FormEventParams extends EventParams {
  form_name: string;
  form_location?: string;
}

export interface CTAEventParams extends EventParams {
  cta_text: string;
  cta_location: string;
  cta_destination?: string;
}

export interface ScrollEventParams extends EventParams {
  percent_scrolled: number;
  page_path: string;
}

// ─── Core Tracking Function ──────────────────────────────────────────────────

/**
 * Send an event to Google Analytics 4.
 * Safe to call even if GA isn't loaded yet.
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;

  // Add common params
  const enrichedParams = {
    ...params,
    page_path: window.location.pathname,
    page_title: document.title,
    timestamp: new Date().toISOString(),
  };

  // Send to GA4 if available
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, enrichedParams);
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, enrichedParams);
  }
}

// ─── Form Events ─────────────────────────────────────────────────────────────

/**
 * Track when user starts filling out a form (focus on first field)
 */
export function trackFormStart(formName: string, location?: string): void {
  trackEvent('form_start', {
    form_name: formName,
    form_location: location || 'page',
  });
}

/**
 * Track successful form submission
 */
export function trackFormSubmit(formName: string, params?: EventParams): void {
  trackEvent('form_submit', {
    form_name: formName,
    ...params,
  });
}

/**
 * Track form errors
 */
export function trackFormError(formName: string, errorType: string): void {
  trackEvent('form_error', {
    form_name: formName,
    error_type: errorType,
  });
}

// ─── CTA Events ──────────────────────────────────────────────────────────────

/**
 * Track CTA button clicks
 */
export function trackCTAClick(text: string, location: string, destination?: string): void {
  trackEvent('cta_click', {
    cta_text: text,
    cta_location: location,
    cta_destination: destination,
  });
}

/**
 * Track donate button clicks specifically (key conversion)
 */
export function trackDonateClick(location: string, amount?: number): void {
  trackEvent('donate_click', {
    cta_location: location,
    ...(amount && { suggested_amount: amount }),
  });
}

/**
 * Track join/signup button clicks
 */
export function trackJoinClick(location: string): void {
  trackEvent('join_click', {
    cta_location: location,
  });
}

// ─── Engagement Events ───────────────────────────────────────────────────────

/**
 * Track scroll depth (call at 25%, 50%, 75%, 100%)
 */
export function trackScrollDepth(percent: 25 | 50 | 75 | 100): void {
  trackEvent('scroll_depth', {
    percent_scrolled: percent,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
}

/**
 * Track time spent on page
 */
export function trackTimeOnPage(seconds: number): void {
  trackEvent('time_on_page', {
    seconds_on_page: seconds,
  });
}

/**
 * Track external link clicks
 */
export function trackOutboundClick(url: string, linkText?: string): void {
  trackEvent('outbound_click', {
    outbound_url: url,
    link_text: linkText,
  });
}

// ─── Page Events ─────────────────────────────────────────────────────────────

/**
 * Track virtual pageviews (for SPAs or modal opens)
 */
export function trackPageView(path?: string, title?: string): void {
  trackEvent('page_view', {
    page_path: path || window.location.pathname,
    page_title: title || document.title,
  });
}

// ─── Conversion Events ───────────────────────────────────────────────────────

/**
 * Track when someone completes the join flow
 */
export function trackJoinComplete(supporterType: string): void {
  trackEvent('join_complete', {
    supporter_type: supporterType,
    conversion_type: 'join',
  });
}

/**
 * Track when someone completes a donation (call from thank you page or callback)
 */
export function trackDonationComplete(amount?: number, recurring?: boolean): void {
  trackEvent('donation_complete', {
    conversion_type: 'donation',
    ...(amount && { donation_amount: amount }),
    ...(recurring !== undefined && { is_recurring: recurring }),
  });
}

/**
 * Track newsletter signup completion
 */
export function trackNewsletterSignup(location: string): void {
  trackEvent('newsletter_signup', {
    signup_location: location,
    conversion_type: 'newsletter',
  });
}

// ─── Scroll Depth Observer ───────────────────────────────────────────────────

/**
 * Sets up automatic scroll depth tracking.
 * Call once on page mount.
 */
export function initScrollTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  const thresholds = [25, 50, 75, 100] as const;
  const triggered = new Set<number>();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    for (const threshold of thresholds) {
      if (scrollPercent >= threshold && !triggered.has(threshold)) {
        triggered.add(threshold);
        trackScrollDepth(threshold);
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// ─── TypeScript Global Declaration ───────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
