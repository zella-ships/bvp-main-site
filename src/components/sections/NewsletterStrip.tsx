'use client';

import { useState } from 'react';

export function NewsletterStrip() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    zipCode: '',
    substack: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Add your newsletter signup API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', zipCode: '', substack: false });
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="bg-black text-white">
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 4vw, 5.75rem)',
        }}
      >
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Left: Copy */}
          <div>
            <h4 className="font-gunterz font-bold text-xl lg:text-2xl text-white mb-2">
              Stay connected to the movement.
            </h4>
            <p className="text-white/70 text-sm lg:text-base">
              Updates on the case, the archive, and the organizing.
            </p>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Fields */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 text-base focus:outline-none focus:border-[#FDC500] transition-colors"
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 text-base focus:outline-none focus:border-[#FDC500] transition-colors"
              />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 text-base focus:outline-none focus:border-[#FDC500] transition-colors"
              />
              <input
                type="text"
                placeholder="Zip code"
                inputMode="numeric"
                maxLength={10}
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="px-4 py-3 min-h-[44px] bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 text-base focus:outline-none focus:border-[#FDC500] transition-colors"
              />
            </div>

            {/* Footer Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                {/* Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={formData.substack}
                    onChange={(e) => setFormData({ ...formData, substack: e.target.checked })}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-[#FDC500] focus:ring-[#FDC500] focus:ring-offset-0"
                  />
                  <span className="text-white/80">Add me to Substack</span>
                </label>

                {/* Legal */}
                <p className="text-white/50 text-xs leading-relaxed max-w-md">
                  By signing up, you agree to receive email updates from Black Veterans Project.
                  Unsubscribe anytime.{' '}
                  <a href="/privacy" className="underline hover:text-white/70">
                    Privacy Policy
                  </a>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-3 min-h-[44px] bg-[#FDC500] text-black font-bold rounded-full hover:bg-white transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe →'}
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
