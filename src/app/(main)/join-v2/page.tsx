import { Metadata } from 'next';
import { Suspense } from 'react';
import { JoinPageV2Client } from './JoinPageV2Client';
import { safeFetch } from '@/sanity/lib/client';
import { joinPageSettingsQuery } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  title: 'Get Involved | Black Veterans Project',
  description: 'Join the movement for repair, equity, and justice. Whether you\'re a Black veteran, military family member, or ally — your voice matters.',
};

// Revalidate every 60 seconds
export const revalidate = 60;

interface JoinPageSettings {
  heroSubtitle?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: {
    asset: { _ref: string };
  };
}

async function getJoinPageSettings(): Promise<JoinPageSettings | null> {
  return await safeFetch<JoinPageSettings>(joinPageSettingsQuery);
}

export default async function JoinPageV2() {
  const settings = await getJoinPageSettings();

  const content = {
    heroSubtitle: settings?.heroSubtitle || 'Join Our Movement',
    heroTitle: settings?.heroTitle || 'Build With Us',
    heroDescription: settings?.heroDescription ||
      "All Americans are needed in the fight for repair, equity, and justice. Whether you're a Black veteran, military family member, descendant, or ally — your voice is wanted in this fight.",
  };

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <JoinPageV2Client content={content} />
    </Suspense>
  );
}
