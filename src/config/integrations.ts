/**
 * Integration Spec Configuration
 *
 * Documents the site's integration architecture for:
 * - Internal reference (admin panel)
 * - External partners (MissionWired, etc.)
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type IntegrationStatus = 'connected' | 'ready' | 'planned' | 'not-needed';

export interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  category: 'crm' | 'payments' | 'analytics' | 'content' | 'email';
  url?: string;
  notes?: string;
}

export interface FormIntegration {
  id: string;
  name: string;
  path: string;
  fields: string[];
  destination: string;
  status: IntegrationStatus;
  tagsGenerated: string[];
  notes?: string;
}

export interface AnalyticsEvent {
  name: string;
  description: string;
  trigger: string;
  params: string[];
  isConversion: boolean;
}

export interface DataFlowStep {
  from: string;
  to: string;
  data: string[];
  status: IntegrationStatus;
}

// ─── Integration Status ──────────────────────────────────────────────────────

export const integrations: Integration[] = [
  {
    id: 'action-network',
    name: 'Action Network',
    description: 'CRM, email automation, supporter management',
    status: 'ready',
    category: 'crm',
    url: 'https://actionnetwork.org',
    notes: 'Forms structured for AN API. Needs API key to connect.',
  },
  {
    id: 'donately',
    name: 'Donately',
    description: 'Donation processing and management',
    status: 'planned',
    category: 'payments',
    url: 'https://donately.com',
    notes: 'Donate page ready. Needs embed code or redirect URL.',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    description: 'Site analytics, conversion tracking, audience insights',
    status: 'ready',
    category: 'analytics',
    url: 'https://analytics.google.com',
    notes: 'Event helpers built. Needs GA4 measurement ID.',
  },
  {
    id: 'sanity',
    name: 'Sanity CMS',
    description: 'Content management for team, press, FAQs',
    status: 'planned',
    category: 'content',
    url: 'https://sanity.io',
    notes: 'Currently using hardcoded content. Migrate when ready.',
  },
  {
    id: 'substack',
    name: 'Substack',
    description: 'Newsletter and blog content',
    status: 'planned',
    category: 'email',
    url: 'https://substack.com',
    notes: 'Can integrate via RSS or redirect to Substack signup.',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Hosting, deployments, edge functions',
    status: 'connected',
    category: 'analytics',
    url: 'https://vercel.com',
    notes: 'Site deployed and live.',
  },
];

// ─── Form Integrations ───────────────────────────────────────────────────────

export const formIntegrations: FormIntegration[] = [
  {
    id: 'join-form',
    name: 'Join / Story Submission',
    path: '/join',
    fields: ['email', 'first_name', 'last_name', 'supporter_type', 'story', 'consent'],
    destination: 'Action Network',
    status: 'ready',
    tagsGenerated: [
      'source:website',
      'form:join',
      'type:[veteran|family|descendant|ally]',
      'has_story:[true|false]',
      'utm_source:[value]',
      'campaign:[value]',
    ],
    notes: 'Captures supporter type for segmentation. Story field optional but valuable.',
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    path: '/contact',
    fields: ['email', 'first_name', 'last_name', 'topic', 'message'],
    destination: 'Action Network',
    status: 'ready',
    tagsGenerated: [
      'source:website',
      'form:contact',
      'topic:[press|partnership|speaking|general|other]',
      'utm_source:[value]',
    ],
    notes: 'Routes inquiries by topic. Press inquiries can trigger different automation.',
  },
  {
    id: 'newsletter-form',
    name: 'Newsletter Signup',
    path: '(multiple pages)',
    fields: ['email'],
    destination: 'Action Network',
    status: 'ready',
    tagsGenerated: [
      'source:website',
      'form:newsletter',
      'signup_page:[path]',
      'utm_source:[value]',
    ],
    notes: 'Appears in footer and homepage. Tracks which page converted.',
  },
];

// ─── Analytics Events ────────────────────────────────────────────────────────

export const analyticsEvents: AnalyticsEvent[] = [
  // Form Events
  {
    name: 'form_start',
    description: 'User focused on first form field',
    trigger: 'Focus on form input',
    params: ['form_name', 'form_location'],
    isConversion: false,
  },
  {
    name: 'form_submit',
    description: 'User submitted a form successfully',
    trigger: 'Form submission success',
    params: ['form_name', 'supporter_type', 'topic'],
    isConversion: true,
  },
  {
    name: 'form_error',
    description: 'Form submission failed',
    trigger: 'Validation or submission error',
    params: ['form_name', 'error_type'],
    isConversion: false,
  },

  // CTA Events
  {
    name: 'cta_click',
    description: 'User clicked a call-to-action button',
    trigger: 'Button/link click',
    params: ['cta_text', 'cta_location', 'cta_destination'],
    isConversion: false,
  },
  {
    name: 'donate_click',
    description: 'User clicked a donate button',
    trigger: 'Donate CTA click',
    params: ['cta_location', 'suggested_amount'],
    isConversion: true,
  },
  {
    name: 'join_click',
    description: 'User clicked a join/signup button',
    trigger: 'Join CTA click',
    params: ['cta_location'],
    isConversion: false,
  },

  // Engagement Events
  {
    name: 'scroll_depth',
    description: 'User scrolled to a depth threshold',
    trigger: '25%, 50%, 75%, or 100% scroll',
    params: ['percent_scrolled', 'page_path'],
    isConversion: false,
  },
  {
    name: 'outbound_click',
    description: 'User clicked an external link',
    trigger: 'External link click',
    params: ['outbound_url', 'link_text'],
    isConversion: false,
  },

  // Conversion Events
  {
    name: 'join_complete',
    description: 'User completed the join flow',
    trigger: 'Join form success',
    params: ['supporter_type', 'conversion_type'],
    isConversion: true,
  },
  {
    name: 'newsletter_signup',
    description: 'User signed up for newsletter',
    trigger: 'Newsletter form success',
    params: ['signup_location', 'conversion_type'],
    isConversion: true,
  },
  {
    name: 'donation_complete',
    description: 'User completed a donation',
    trigger: 'Donately callback or thank you page',
    params: ['donation_amount', 'is_recurring', 'conversion_type'],
    isConversion: true,
  },
];

// ─── Data Flow ───────────────────────────────────────────────────────────────

export const dataFlows: DataFlowStep[] = [
  {
    from: 'Website Forms',
    to: 'Action Network',
    data: ['email', 'name', 'supporter_type', 'story', 'tags', 'UTM params'],
    status: 'ready',
  },
  {
    from: 'Website',
    to: 'Google Analytics',
    data: ['page views', 'events', 'conversions', 'scroll depth'],
    status: 'ready',
  },
  {
    from: 'Donate Button',
    to: 'Donately',
    data: ['campaign', 'amount', 'source'],
    status: 'planned',
  },
  {
    from: 'Action Network',
    to: 'Email Automation',
    data: ['welcome series', 'segmented campaigns', 'action alerts'],
    status: 'planned',
  },
];

// ─── UTM Strategy ────────────────────────────────────────────────────────────

export const utmStrategy = {
  description: 'Standard UTM parameters captured on all form submissions',
  parameters: [
    {
      name: 'utm_source',
      description: 'Traffic source',
      examples: ['instagram', 'twitter', 'newsletter', 'google', 'partner-org'],
    },
    {
      name: 'utm_medium',
      description: 'Marketing medium',
      examples: ['social', 'email', 'cpc', 'referral', 'organic'],
    },
    {
      name: 'utm_campaign',
      description: 'Campaign identifier',
      examples: ['monk-case-launch', 'spring2026', 'giving-tuesday', 'partner-collab'],
    },
  ],
  exampleUrls: [
    'blackveteransproject.org/join?utm_source=instagram&utm_medium=social&utm_campaign=monk-case-launch',
    'blackveteransproject.org/donate?utm_source=newsletter&utm_medium=email&utm_campaign=spring2026',
  ],
};

// ─── Summary Stats ───────────────────────────────────────────────────────────

export const integrationSummary = {
  total: integrations.length,
  connected: integrations.filter(i => i.status === 'connected').length,
  ready: integrations.filter(i => i.status === 'ready').length,
  planned: integrations.filter(i => i.status === 'planned').length,
  formsReady: formIntegrations.filter(f => f.status === 'ready').length,
  formsTotal: formIntegrations.length,
  eventsTracked: analyticsEvents.length,
  conversions: analyticsEvents.filter(e => e.isConversion).length,
};
