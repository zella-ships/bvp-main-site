'use client';

import { useState } from 'react';

/**
 * Newsletter Strip V2
 *
 * Per BVP Membership 3.0 strategy:
 * - Collects: name, email, zip (simplified from v1)
 * - Submits to: Action Network (as Basic Member) + Substack (via Zapier sync)
 * - CTA: "Stay Connected"
 * - Tags: Basic Member, Newsletter, Substack Interest
 */

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

interface NewsletterStripV2Props {
  headline?: string;
  subheadline?: string;
}

export function NewsletterStripV2({
  headline = 'Stay connected to the movement.',
  subheadline = 'Updates on the case, the archive, and the organizing.',
}: NewsletterStripV2Props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter-signup-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', zipCode: '' });
      setErrors({});
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const clearError = (field: keyof FieldErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputBaseClass = "px-5 py-4 min-h-[56px] bg-white/10 border rounded-2xl text-white placeholder:text-white/70 text-base focus:outline-none transition-colors";
  const inputNormalClass = "border-white/20 focus:border-[#FDC500]";
  const inputErrorClass = "border-[#F87171] focus:border-[#F87171]";

  return (
    <section className="bg-black text-white">
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          padding: 'clamp(3.5rem, 8vw, 6rem) clamp(1rem, 4vw, 5.75rem)',
        }}
      >
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Left: Copy */}
          <div className="lg:pt-2">
            <h2 className="font-gunterz font-bold text-2xl lg:text-3xl text-white mb-3">
              {headline}
            </h2>
            <p className="text-white/70 text-base lg:text-lg">
              {subheadline}
            </p>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Input Fields */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-1">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="First name"
                  aria-label="First name"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData({ ...formData, firstName: e.target.value });
                    clearError('firstName');
                  }}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  className={`w-full ${inputBaseClass} ${errors.firstName ? inputErrorClass : inputNormalClass}`}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-[#F87171] text-xs pl-1">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Last name"
                  aria-label="Last name"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    clearError('lastName');
                  }}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  className={`w-full ${inputBaseClass} ${errors.lastName ? inputErrorClass : inputNormalClass}`}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-[#F87171] text-xs pl-1">{errors.lastName}</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    clearError('email');
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full ${inputBaseClass} ${errors.email ? inputErrorClass : inputNormalClass}`}
                />
                {errors.email && (
                  <p id="email-error" className="text-[#F87171] text-xs pl-1">{errors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Zip code"
                  aria-label="Zip code"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className={`w-full ${inputBaseClass} ${inputNormalClass}`}
                />
              </div>
            </div>

            {/* Footer Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Legal */}
              <p className="text-white/70 text-xs leading-relaxed max-w-md">
                By signing up, you agree to receive email updates from Black Veterans Project.
                Unsubscribe anytime.{' '}
                <a href="/privacy" className="underline hover:text-white">
                  Privacy Policy
                </a>
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-10 py-4 min-h-[56px] bg-[#FDC500] text-black text-lg font-bold rounded-full hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {status === 'loading' ? 'Connecting...' : status === 'success' ? 'Connected!' : 'Stay Connected →'}
              </button>
            </div>

            {status === 'error' && (
              <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
