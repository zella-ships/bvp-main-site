import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route: /api/advocate-signup
 *
 * Proxies form submissions to Action Network to avoid CORS issues.
 * Action Network's API doesn't allow direct browser requests.
 */

const ACTION_NETWORK_ENDPOINT =
  'https://actionnetwork.org/api/v2/forms/e454170c-9cfe-47df-bed7-7a5ece7c7bd9/submissions';

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
  const payload: Record<string, unknown> = {
    person: {
      given_name: formData.firstName,
      family_name: formData.lastName,

      email_addresses: [
        { address: formData.email }
      ],

      postal_addresses: [
        {
          address_lines: formData.address ? [formData.address] : [],
          postal_code: formData.zipCode || '',
        }
      ],

      custom_fields: {
        ...(formData.phone && { phone_number: formData.phone }),
        ...(formData.titleAffiliation && { title_affiliation: formData.titleAffiliation }),
        ...(formData.linkedin && { linkedin: formData.linkedin }),
        ...(formData.signupAs && { signup_type: formData.signupAs }),
        ...(formData.race && { race: formData.race }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.currentEmployment && { current_employment: formData.currentEmployment }),
        ...(formData.branch && { military_branch: formData.branch }),
        ...(formData.serviceEra && { service_era: formData.serviceEra }),
        ...(formData.payGrade && { pay_grade_at_separation: formData.payGrade }),
        ...(formData.dischargeStatus && { discharge_status: formData.dischargeStatus }),
        ...(formData.barriers && { barriers_to_benefits: formData.barriers }),
        ...(formData.experiences && formData.experiences.length > 0 && {
          experiences: formData.experiences.join('; ')
        }),
        ...(formData.storyTypes && formData.storyTypes.length > 0 && {
          story_types: formData.storyTypes.join('; ')
        }),
        ...(formData.interestStatement && { interest_in_bvp: formData.interestStatement }),
      }
    },

    add_tags: [
      'Website Signup',
      'Advocate',
      ...(formData.signupAs ? [`Type: ${formData.signupAs}`] : []),
      ...((['veteran', 'active', 'reservist', 'guard'].includes(formData.signupAs || ''))
        ? ['Military Connected'] : []),
    ]
  };

  if (formData.phone) {
    (payload.person as Record<string, unknown>).phone_numbers = [
      { number: formData.phone }
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

    console.log('=== ACTION NETWORK SUBMISSION ===');
    console.log('Endpoint:', ACTION_NETWORK_ENDPOINT);
    console.log('API Key present:', !!process.env.ACTION_NETWORK_API_KEY);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(ACTION_NETWORK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OSDI-API-Token': process.env.ACTION_NETWORK_API_KEY || '',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);

    if (!response.ok) {
      console.error('Action Network error:', response.status, responseText);
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
