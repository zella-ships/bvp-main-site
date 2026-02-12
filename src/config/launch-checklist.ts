// Launch Checklist Configuration
// Update this file as you complete items

export interface ChecklistItem {
  id: string;
  category: 'seo' | 'security' | 'accessibility' | 'integrations' | 'assets';
  label: string;
  description: string;
  status: 'done' | 'pending' | 'in-progress';
  link?: string; // Optional link to relevant file or docs
}

export const launchChecklist: ChecklistItem[] = [
  // SEO
  {
    id: 'meta-tags',
    category: 'seo',
    label: 'Meta tags on all pages',
    description: 'Title, description, OG tags for each page',
    status: 'done',
    link: '/admin#seo',
  },
  {
    id: 'robots-txt',
    category: 'seo',
    label: 'robots.txt',
    description: 'Search engine crawl instructions',
    status: 'done',
    link: '/robots.txt',
  },
  {
    id: 'sitemap',
    category: 'seo',
    label: 'sitemap.xml',
    description: 'XML sitemap for search engines',
    status: 'done',
    link: '/sitemap.xml',
  },
  {
    id: 'og-images',
    category: 'seo',
    label: 'OG images',
    description: 'Social share preview images (1200x630)',
    status: 'pending',
  },

  // Security
  {
    id: 'https',
    category: 'security',
    label: 'HTTPS / SSL',
    description: 'Secure connection via Vercel',
    status: 'done',
  },
  {
    id: 'security-headers',
    category: 'security',
    label: 'Security headers',
    description: 'CSP, HSTS, X-Frame-Options, etc.',
    status: 'done',
    link: '/src/app/next.config.ts',
  },
  {
    id: 'honeypot',
    category: 'security',
    label: 'Form honeypot protection',
    description: 'Spam protection on contact & newsletter forms',
    status: 'done',
  },
  {
    id: 'npm-audit',
    category: 'security',
    label: 'npm audit clean',
    description: 'No known vulnerabilities in dependencies',
    status: 'done',
  },

  // Assets
  {
    id: 'favicon',
    category: 'assets',
    label: 'Favicon',
    description: 'Browser tab icon (32x32 .ico)',
    status: 'done',
    link: '/src/app/favicon.ico',
  },
  {
    id: 'apple-touch-icon',
    category: 'assets',
    label: 'Apple touch icon',
    description: 'iOS bookmark icon (180x180 .png)',
    status: 'pending',
  },

  // Integrations
  {
    id: 'google-analytics',
    category: 'integrations',
    label: 'Google Analytics',
    description: 'GA4 tracking for visitor analytics',
    status: 'pending',
  },
  {
    id: 'action-network',
    category: 'integrations',
    label: 'Action Network',
    description: 'Contact & Join form submissions',
    status: 'pending',
  },
  {
    id: 'newsletter',
    category: 'integrations',
    label: 'Newsletter signup',
    description: 'Substack or Mailchimp integration',
    status: 'pending',
  },
  {
    id: 'donately',
    category: 'integrations',
    label: 'Donately',
    description: 'Donation processing on /donate',
    status: 'pending',
  },

  // Accessibility
  {
    id: 'wcag-audit',
    category: 'accessibility',
    label: 'WCAG 2.2 AA audit',
    description: 'Accessibility compliance review',
    status: 'done',
  },
  {
    id: 'keyboard-nav',
    category: 'accessibility',
    label: 'Keyboard navigation',
    description: 'All interactive elements keyboard accessible',
    status: 'done',
  },
  {
    id: 'skip-link',
    category: 'accessibility',
    label: 'Skip to main content',
    description: 'Skip link for screen reader users',
    status: 'done',
  },
  {
    id: 'color-contrast',
    category: 'accessibility',
    label: 'Color contrast',
    description: 'WCAG AA contrast ratios (4.5:1 text, 3:1 UI)',
    status: 'done',
  },
  {
    id: 'aria-labels',
    category: 'accessibility',
    label: 'ARIA labels',
    description: 'Screen reader labels on icons & interactive elements',
    status: 'done',
  },
  {
    id: 'focus-visible',
    category: 'accessibility',
    label: 'Focus indicators',
    description: 'Visible focus states on all interactive elements',
    status: 'done',
  },
];

// Summary stats
export const checklistSummary = {
  total: launchChecklist.length,
  done: launchChecklist.filter(i => i.status === 'done').length,
  pending: launchChecklist.filter(i => i.status === 'pending').length,
  inProgress: launchChecklist.filter(i => i.status === 'in-progress').length,
  byCategory: {
    seo: {
      total: launchChecklist.filter(i => i.category === 'seo').length,
      done: launchChecklist.filter(i => i.category === 'seo' && i.status === 'done').length,
    },
    security: {
      total: launchChecklist.filter(i => i.category === 'security').length,
      done: launchChecklist.filter(i => i.category === 'security' && i.status === 'done').length,
    },
    accessibility: {
      total: launchChecklist.filter(i => i.category === 'accessibility').length,
      done: launchChecklist.filter(i => i.category === 'accessibility' && i.status === 'done').length,
    },
    integrations: {
      total: launchChecklist.filter(i => i.category === 'integrations').length,
      done: launchChecklist.filter(i => i.category === 'integrations' && i.status === 'done').length,
    },
    assets: {
      total: launchChecklist.filter(i => i.category === 'assets').length,
      done: launchChecklist.filter(i => i.category === 'assets' && i.status === 'done').length,
    },
  },
};
