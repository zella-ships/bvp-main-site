import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/advocate-signup
 *
 * Proxies form submissions to Action Network to avoid CORS issues.
 * Action Network's API doesn't allow direct browser requests.
 */

const ACTION_NETWORK_ENDPOINT =
  'https://actionnetwork.org/api/v2/forms/e454170c-9cfe-47df-bed7-7a5ece7c7bd9/submissions';

// Basic HTML sanitization to prevent XSS
function sanitize(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  zipCode?: string;
  phone?: string;
  titleAffiliation?: string;
  linkedin?: string;
  signupAs?: string;
  race?: string;
  gender?: string;
  currentEmployment?: string;
  branch?: string;
  serviceEra?: string;
  payGrade?: string;
  dischargeStatus?: string;
  barriers?: string;
  experiences?: string[];
  storyTypes?: string[];
  interestStatement?: string;
}

function buildPayload(formData: FormData) {
  // Sanitize all string inputs
  const clean = {
    firstName: sanitize(formData.firstName),
    lastName: sanitize(formData.lastName),
    email: sanitize(formData.email),
    address: sanitize(formData.address),
    zipCode: sanitize(formData.zipCode),
    phone: sanitize(formData.phone),
    titleAffiliation: sanitize(formData.titleAffiliation),
    linkedin: sanitize(formData.linkedin),
    signupAs: sanitize(formData.signupAs),
    race: sanitize(formData.race),
    gender: sanitize(formData.gender),
    currentEmployment: sanitize(formData.currentEmployment),
    branch: sanitize(formData.branch),
    serviceEra: sanitize(formData.serviceEra),
    payGrade: sanitize(formData.payGrade),
    dischargeStatus: sanitize(formData.dischargeStatus),
    barriers: sanitize(formData.barriers),
    interestStatement: sanitize(formData.interestStatement),
  };

  const payload: Record<string, unknown> = {
    person: {
      given_name: clean.firstName,
      family_name: clean.lastName,

      email_addresses: [
        { address: clean.email }
      ],

      postal_addresses: [
        {
          address_lines: clean.address ? [clean.address] : [],
          postal_code: clean.zipCode,
        }
      ],

      custom_fields: {
        ...(clean.phone && { phone_number: clean.phone }),
        ...(clean.titleAffiliation && { title_affiliation: clean.titleAffiliation }),
        ...(clean.linkedin && { linkedin: clean.linkedin }),
        ...(clean.signupAs && { signup_type: clean.signupAs }),
        ...(clean.race && { race: clean.race }),
        ...(clean.gender && { gender: clean.gender }),
        ...(clean.currentEmployment && { current_employment: clean.currentEmployment }),
        ...(clean.branch && { military_branch: clean.branch }),
        ...(clean.serviceEra && { service_era: clean.serviceEra }),
        ...(clean.payGrade && { pay_grade_at_separation: clean.payGrade }),
        ...(clean.dischargeStatus && { discharge_status: clean.dischargeStatus }),
        ...(clean.barriers && { barriers_to_benefits: clean.barriers }),
        ...(formData.experiences && formData.experiences.length > 0 && {
          experiences: formData.experiences.map(e => sanitize(e)).join('; ')
        }),
        ...(formData.storyTypes && formData.storyTypes.length > 0 && {
          story_types: formData.storyTypes.map(s => sanitize(s)).join('; ')
        }),
        ...(clean.interestStatement && { interest_in_bvp: clean.interestStatement }),
      }
    },

    add_tags: [
      'Website Signup',
      'Advocate',
      ...(clean.signupAs ? [`Type: ${clean.signupAs}`] : []),
      ...((['veteran', 'active', 'reservist', 'guard'].includes(clean.signupAs))
        ? ['Military Connected'] : []),
    ]
  };

  if (clean.phone) {
    (payload.person as Record<string, unknown>).phone_numbers = [
      { number: clean.phone }
    ];
  }

  return payload;
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email' },
        { status: 400 }
      );
    }

    const payload = buildPayload(formData);

    const response = await fetch(ACTION_NETWORK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OSDI-API-Token': process.env.ACTION_NETWORK_API_KEY || '',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to submit to Action Network', details: responseText },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log('=== SUCCESS ===');
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
