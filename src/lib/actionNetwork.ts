/**
 * BVP Advocate Signup — Action Network Integration
 *
 * Submits form data to our API route, which proxies to Action Network.
 * This avoids CORS issues with direct browser-to-Action Network requests.
 */

interface ActionNetworkFormData {
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

/**
 * Submit form data to Action Network via our API route.
 * Returns a promise — handle success/error in your UI.
 */
export async function submitToActionNetwork(formData: ActionNetworkFormData): Promise<unknown> {
  const response = await fetch('/api/advocate-signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Submission failed: ${response.status}`);
  }

  return response.json();
}

export type { ActionNetworkFormData };
