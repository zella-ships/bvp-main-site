'use client';

import { useState, useId, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function NewsletterSection() {
  const prefersReducedMotion = useReducedMotion();

  // Refs for focus management on errors
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Generate unique IDs for accessibility
  const formId = useId();
  const nameInputId = `${formId}-name`;
  const emailInputId = `${formId}-email`;
  const nameErrorId = `${formId}-name-error`;
  const emailErrorId = `${formId}-email-error`;
  const substackId = `${formId}-substack`;
  const formStatusId = `${formId}-status`;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    errors: { name: '', email: '' },
    touched: { name: false, email: false },
    isSubmitting: false,
    isSuccess: false,
  });
  const [addToSubstack, setAddToSubstack] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = {
      name: formState.name.trim() === '' ? 'Please enter your name' : '',
      email: formState.email.trim() === ''
        ? 'Please enter your email'
        : !validateEmail(formState.email)
          ? 'Please enter a valid email'
          : '',
    };

    setFormState(prev => ({
      ...prev,
      errors,
      touched: { name: true, email: true }
    }));

    // Focus on first error field for accessibility
    if (errors.name) {
      nameInputRef.current?.focus();
    } else if (errors.email) {
      emailInputRef.current?.focus();
    }

    if (!errors.name && !errors.email) {
      setFormState(prev => ({ ...prev, isSubmitting: true }));
      // Simulate submission
      setTimeout(() => {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          isSuccess: true,
          name: '',
          email: '',
        }));
        // Reset success after 5s
        setTimeout(() => {
          setFormState(prev => ({ ...prev, isSuccess: false }));
        }, 5000);
      }, 1500);
    }
  };

  const handleInputChange = (field: 'name' | 'email', value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' },
    }));
  };

  const handleInputBlur = (field: 'name' | 'email') => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
      errors: {
        ...prev.errors,
        [field]: field === 'name'
          ? (prev.name.trim() === '' ? 'Please enter your name' : '')
          : (prev.email.trim() === ''
              ? 'Please enter your email'
              : !validateEmail(prev.email)
                ? 'Please enter a valid email'
                : ''),
      },
    }));
  };

  return (
    <section
      className="bg-[#FDC500] relative overflow-hidden"
      style={{
        paddingTop: 'clamp(4rem, 10vw, 8.75rem)',
        paddingBottom: 'clamp(4rem, 10vw, 8.75rem)',
        paddingLeft: 'clamp(1rem, 4vw, 5.75rem)',
        paddingRight: 'clamp(1rem, 4vw, 5.75rem)',
      }}
    >
      {/* Camo pattern — full width behind content */}
      <img
        src="/images/camo-footer.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-auto pointer-events-none select-none"
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="max-w-xl ml-auto">
            <h2
              id={`${formId}-heading`}
              className="font-display font-bold leading-[1.1] mb-4 text-black"
              style={{ fontSize: 'clamp(2rem, 1rem + 4vw, 3.5rem)' }}
            >
              Join the Fight for Repair
            </h2>
            <p id={`${formId}-description`} className="text-black/70 text-lg leading-relaxed mb-8">
              Get updates on our work, stories from the community, and ways to take action.
            </p>

          {/* Screen reader status announcements */}
          <div
            id={formStatusId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {formState.isSubmitting && 'Submitting your information, please wait.'}
            {formState.isSuccess && 'Success! You have been added to our newsletter.'}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
            aria-labelledby={`${formId}-heading`}
            aria-describedby={`${formId}-description`}
          >
          {/* Name and Email Fields - Pill style */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Name Input */}
            <div className="flex-1 relative">
              <label htmlFor={nameInputId} className="sr-only">
                Your name (required)
              </label>
              <input
                ref={nameInputRef}
                id={nameInputId}
                type="text"
                placeholder="Your name"
                value={formState.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleInputBlur('name')}
                aria-required="true"
                aria-invalid={formState.touched.name && !!formState.errors.name}
                aria-describedby={formState.errors.name ? nameErrorId : undefined}
                autoComplete="name"
                className={`
                  w-full px-6 py-4 min-h-[48px] bg-transparent border-2 rounded-full text-black placeholder:text-black/50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232651] transition-all duration-300
                  active:scale-[0.99]
                  ${formState.touched.name && formState.errors.name
                    ? 'border-[#A63D2F] focus:ring-[#A63D2F]'
                    : 'border-[#232651]/30 focus:border-[#232651]'
                  }
                `}
              />
              <AnimatePresence>
                {formState.touched.name && formState.errors.name && (
                  <motion.p
                    id={nameErrorId}
                    role="alert"
                    aria-live="assertive"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                    transition={prefersReducedMotion ? { duration: 0 } : undefined}
                    className="absolute left-6 -bottom-6 text-[#A63D2F] text-sm"
                  >
                    {formState.errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Input */}
            <div className="flex-1 relative">
              <label htmlFor={emailInputId} className="sr-only">
                Your email address (required)
              </label>
              <input
                ref={emailInputRef}
                id={emailInputId}
                type="email"
                placeholder="Your email"
                value={formState.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleInputBlur('email')}
                aria-required="true"
                aria-invalid={formState.touched.email && !!formState.errors.email}
                aria-describedby={formState.errors.email ? emailErrorId : undefined}
                autoComplete="email"
                inputMode="email"
                className={`
                  w-full px-6 py-4 min-h-[48px] bg-transparent border-2 rounded-full text-black placeholder:text-black/50
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232651] transition-all duration-300
                  active:scale-[0.99]
                  ${formState.touched.email && formState.errors.email
                    ? 'border-[#A63D2F] focus:ring-[#A63D2F]'
                    : 'border-[#232651]/30 focus:border-[#232651]'
                  }
                `}
              />
              <AnimatePresence>
                {formState.touched.email && formState.errors.email && (
                  <motion.p
                    id={emailErrorId}
                    role="alert"
                    aria-live="assertive"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                    transition={prefersReducedMotion ? { duration: 0 } : undefined}
                    className="absolute left-6 -bottom-6 text-[#A63D2F] text-sm"
                  >
                    {formState.errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Substack Checkbox */}
          <label
            htmlFor={substackId}
            className="flex items-center gap-3 cursor-pointer group mt-8 min-h-[44px] py-2 -ml-2 pl-2 rounded-lg active:bg-black/5 transition-colors"
          >
            <div className="relative flex items-center justify-center w-11 h-11">
              <input
                id={substackId}
                type="checkbox"
                checked={addToSubstack}
                onChange={(e) => setAddToSubstack(e.target.checked)}
                aria-describedby={`${substackId}-hint`}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 border-2 rounded transition-all ${addToSubstack ? 'bg-[#232651] border-[#232651]' : 'border-[#232651]/30 group-hover:border-[#232651]/60 group-active:border-[#232651]'}`}
                aria-hidden="true"
              >
                {addToSubstack && (
                  <svg className="w-full h-full text-white p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-base text-black/70 leading-relaxed">
              Add me to Substack
            </span>
          </label>
          <p id={`${substackId}-hint`} className="sr-only">
            Optional. Also receive updates via Substack newsletter.
          </p>

            {/* Button + Privacy note inline */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                aria-busy={formState.isSubmitting}
                aria-describedby={formStatusId}
                className={`
                  px-10 py-4 min-h-[52px] text-lg font-bold tracking-wide rounded-full border-2
                  transition-all duration-300 active:scale-95 flex-shrink-0
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDC500]
                  ${formState.isSuccess
                    ? 'bg-[#56C035] border-[#56C035] text-white'
                    : 'bg-black border-black text-white hover:bg-white hover:text-black active:bg-white active:text-black'
                  }
                  ${formState.isSubmitting ? 'cursor-wait' : ''}
                `}
              >
                {formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    {prefersReducedMotion ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    )}
                    Joining...
                  </span>
                ) : formState.isSuccess ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    You're In!
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>

              <p className="text-black/60 text-sm">
                By signing up, you agree to receive email updates from Black Veterans Project. Unsubscribe anytime.{' '}
                <Link href="/privacy" className="relative group">
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F44708] group-hover:w-full transition-all duration-300" />
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
