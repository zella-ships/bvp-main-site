'use client';

import { useState } from 'react';
import { packageNewsletterData, toActionNetworkFormat } from '@/lib/form-data';
import { trackFormStart, trackFormSubmit, trackNewsletterSignup } from '@/lib/analytics';

export function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Honeypot field
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleFocus = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackFormStart('newsletter', 'banner');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Honeypot check - if filled, silently reject (bot detected)
    if (honeypot) {
      // Fake success to fool bots
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setEmail('');
        setTimeout(() => setIsSuccess(false), 3000);
      }, 1000);
      return;
    }

    setIsSubmitting(true);

    // Package the form data with UTM params and tags
    const formData = packageNewsletterData({ email });
    const actionNetworkData = toActionNetworkFormat(formData);

    // Log for development (replace with actual API call)
    console.log('[Newsletter] Form data:', formData);
    console.log('[Newsletter] Action Network format:', actionNetworkData);

    // TODO: POST to /api/newsletter or Action Network directly
    // await fetch('/api/newsletter', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(actionNetworkData),
    // });

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Track successful submission
    trackFormSubmit('newsletter', { signup_location: 'banner' });
    trackNewsletterSignup('banner');

    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail('');
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section className="bg-[#FDC500] py-16 md:py-20 lg:py-24 px-6 md:px-[92px]">
      <div className="max-w-[800px] mx-auto text-center">
        <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4">
          Stay in the loop
        </h3>
        <p className="text-black/70 text-lg mb-8">
          No spam. Only updates on our work, stories from the community, and ways to take action.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
          {/* Honeypot field - hidden from humans, bots will fill it */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="nl-website">Website</label>
            <input
              type="text"
              id="nl-website"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={handleFocus}
            required
            autoComplete="email"
            className="w-full sm:flex-1 px-6 py-4 rounded-full border-2 border-black/20 bg-white text-black placeholder:text-black/50 focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-bold transition-all ${
              isSuccess
                ? 'bg-[#56C035] text-white'
                : 'bg-black text-white hover:bg-white hover:text-black border-2 border-black'
            }`}
          >
            {isSubmitting ? '...' : isSuccess ? 'Subscribed!' : 'Sign up'}
          </button>
        </form>
      </div>
    </section>
  );
}
