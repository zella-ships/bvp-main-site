import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://blackveteransproject.org';

  // Core pages with high priority
  const corePages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/our-work', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/join', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/donate', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  // Secondary pages
  const secondaryPages = [
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/press', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/financials', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  // Legal pages (lower priority, rarely change)
  const legalPages = [
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const allPages = [...corePages, ...secondaryPages, ...legalPages];

  return allPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
