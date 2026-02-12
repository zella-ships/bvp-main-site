/**
 * Form Data Layer
 *
 * Standardizes form data packaging for consistent submission to Action Network
 * and other backends. Automatically includes UTM params, page info, and timestamps.
 */

import { getStoredUTMParams, getReferrerInfo, type UTMParams } from './utm';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SupporterType = 'veteran' | 'family' | 'descendant' | 'ally' | '';
export type ContactTopic = 'press' | 'partnership' | 'speaking' | 'general' | 'other' | '';
export type FormType = 'join' | 'contact' | 'newsletter' | 'donate';

export interface BaseFormData {
  email: string;
  source: 'website';
  form: FormType;
  page: string;
  timestamp: string;
  utm?: UTMParams;
  referrer?: string;
  referrer_domain?: string | null;
}

export interface JoinFormData extends BaseFormData {
  form: 'join';
  first_name?: string;
  last_name?: string;
  supporter_type: SupporterType;
  story?: string;
  consent: boolean;
  tags: string[];
}

export interface ContactFormData extends BaseFormData {
  form: 'contact';
  first_name?: string;
  last_name?: string;
  topic: ContactTopic;
  message?: string;
  tags: string[];
}

export interface NewsletterFormData extends BaseFormData {
  form: 'newsletter';
  tags: string[];
}

export interface DonateClickData extends BaseFormData {
  form: 'donate';
  amount_preset?: number;
  campaign?: string;
  tags: string[];
}

export type FormDataPackage = JoinFormData | ContactFormData | NewsletterFormData | DonateClickData;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBaseData(formType: FormType): BaseFormData {
  const utm = getStoredUTMParams();
  const { referrer, referrer_domain } = getReferrerInfo();

  return {
    email: '',
    source: 'website',
    form: formType,
    page: typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp: new Date().toISOString(),
    ...(utm && { utm }),
    ...(referrer && { referrer, referrer_domain }),
  };
}

function buildTags(formType: FormType, extras: string[] = []): string[] {
  const tags = ['source:website', `form:${formType}`];

  const utm = getStoredUTMParams();
  if (utm?.utm_source) tags.push(`utm_source:${utm.utm_source}`);
  if (utm?.utm_campaign) tags.push(`campaign:${utm.utm_campaign}`);

  return [...tags, ...extras];
}

// ─── Form Data Builders ──────────────────────────────────────────────────────

/**
 * Package data from the Join form (/join page)
 */
export function packageJoinData(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  supporterType: SupporterType;
  story?: string;
  consent: boolean;
}): JoinFormData {
  const extraTags: string[] = [];
  if (data.supporterType) extraTags.push(`type:${data.supporterType}`);
  if (data.story && data.story.length > 0) extraTags.push('has_story:true');

  return {
    ...getBaseData('join'),
    form: 'join' as const,
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    supporter_type: data.supporterType,
    story: data.story,
    consent: data.consent,
    tags: buildTags('join', extraTags),
  };
}

/**
 * Package data from the Contact form (/contact page)
 */
export function packageContactData(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  topic: ContactTopic;
  message?: string;
}): ContactFormData {
  const extraTags: string[] = [];
  if (data.topic) extraTags.push(`topic:${data.topic}`);

  return {
    ...getBaseData('contact'),
    form: 'contact' as const,
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    topic: data.topic,
    message: data.message,
    tags: buildTags('contact', extraTags),
  };
}

/**
 * Package data from the Newsletter signup form
 */
export function packageNewsletterData(data: {
  email: string;
}): NewsletterFormData {
  const page = typeof window !== 'undefined' ? window.location.pathname : '';
  const extraTags = [`signup_page:${page || 'unknown'}`];

  return {
    ...getBaseData('newsletter'),
    form: 'newsletter' as const,
    email: data.email,
    tags: buildTags('newsletter', extraTags),
  };
}

/**
 * Package data when user clicks donate (for tracking)
 */
export function packageDonateClick(data: {
  amountPreset?: number;
  campaign?: string;
}): DonateClickData {
  const extraTags: string[] = [];
  if (data.amountPreset) extraTags.push(`amount:${data.amountPreset}`);
  if (data.campaign) extraTags.push(`campaign:${data.campaign}`);

  return {
    ...getBaseData('donate'),
    form: 'donate' as const,
    email: '', // Not captured at click time
    amount_preset: data.amountPreset,
    campaign: data.campaign,
    tags: buildTags('donate', extraTags),
  };
}

// ─── Action Network Format ───────────────────────────────────────────────────

/**
 * Converts our form data to Action Network's expected format.
 * Use this when you're ready to POST to Action Network.
 */
export function toActionNetworkFormat(data: FormDataPackage): Record<string, unknown> {
  const person: Record<string, unknown> = {
    email_addresses: [{ address: data.email }],
    custom_fields: {
      source: data.source,
      form: data.form,
      page: data.page,
      ...(data.utm?.utm_source && { utm_source: data.utm.utm_source }),
      ...(data.utm?.utm_medium && { utm_medium: data.utm.utm_medium }),
      ...(data.utm?.utm_campaign && { utm_campaign: data.utm.utm_campaign }),
    },
  };

  // Add name if present
  if ('first_name' in data && data.first_name) {
    person.given_name = data.first_name;
  }
  if ('last_name' in data && data.last_name) {
    person.family_name = data.last_name;
  }

  // Add supporter type for join forms
  if (data.form === 'join' && 'supporter_type' in data) {
    (person.custom_fields as Record<string, unknown>).supporter_type = data.supporter_type;
    if (data.story) {
      (person.custom_fields as Record<string, unknown>).story = data.story;
    }
  }

  // Add topic for contact forms
  if (data.form === 'contact' && 'topic' in data) {
    (person.custom_fields as Record<string, unknown>).topic = data.topic;
    if (data.message) {
      (person.custom_fields as Record<string, unknown>).message = data.message;
    }
  }

  return {
    person,
    add_tags: data.tags,
  };
}
