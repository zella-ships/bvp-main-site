/**
 * UTM Capture Utility
 *
 * Captures UTM parameters from URL and stores them for form submissions.
 * This helps track where supporters came from (email, social, ads, etc.)
 */

export interface UTMParams {
  utm_source?: string;    // Where traffic came from (instagram, newsletter, google)
  utm_medium?: string;    // Marketing medium (social, email, cpc)
  utm_campaign?: string;  // Campaign name (spring2026, monk-case-launch)
  utm_term?: string;      // Paid search keywords
  utm_content?: string;   // Differentiates similar content/links
}

const UTM_STORAGE_KEY = 'bvp_utm_params';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

/**
 * Captures UTM parameters from current URL and stores in sessionStorage.
 * Call this on app mount or page load.
 */
export function captureUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  const url = new URL(window.location.href);
  const params: UTMParams = {};
  let hasParams = false;

  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) {
      params[key] = value;
      hasParams = true;
    }
  }

  // Only store if we found UTM params
  if (hasParams) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify({
      ...params,
      captured_at: new Date().toISOString(),
      landing_page: window.location.pathname,
    }));
  }

  return hasParams ? params : null;
}

/**
 * Retrieves stored UTM parameters.
 * Returns null if none were captured this session.
 */
export function getStoredUTMParams(): (UTMParams & { captured_at?: string; landing_page?: string }) | null {
  if (typeof window === 'undefined') return null;

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Clears stored UTM parameters.
 * Call this after successful form submission if needed.
 */
export function clearUTMParams(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(UTM_STORAGE_KEY);
}

/**
 * Gets referrer information for attribution.
 */
export function getReferrerInfo(): { referrer: string; referrer_domain: string | null } {
  if (typeof window === 'undefined') {
    return { referrer: '', referrer_domain: null };
  }

  const referrer = document.referrer;
  let referrer_domain: string | null = null;

  if (referrer) {
    try {
      referrer_domain = new URL(referrer).hostname;
    } catch {
      // Invalid URL, ignore
    }
  }

  return { referrer, referrer_domain };
}
