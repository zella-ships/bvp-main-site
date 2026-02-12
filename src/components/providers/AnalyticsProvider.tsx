'use client';

import { useEffect } from 'react';
import { captureUTMParams } from '@/lib/utm';
import { initScrollTracking } from '@/lib/analytics';

/**
 * Analytics Provider
 *
 * Handles:
 * - UTM parameter capture on page load
 * - Scroll depth tracking
 * - Future: GA4 initialization
 *
 * Wrap your app with this provider to enable tracking.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Capture UTM parameters from URL
    captureUTMParams();

    // Initialize scroll depth tracking
    const cleanupScroll = initScrollTracking();

    return () => {
      cleanupScroll();
    };
  }, []);

  return <>{children}</>;
}
