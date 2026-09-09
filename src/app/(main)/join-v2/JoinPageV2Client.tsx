'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface JoinPageV2ClientProps {
  content: {
    heroSubtitle: string;
    heroTitle: string;
    heroDescription: string;
  };
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type SignupType = 'supporter' | 'military_family' | 'veteran' | 'active_duty' | 'reservist' | 'national_guard' | '';
type Race = 'black' | 'indigenous' | 'asian' | 'pacific_islander' | 'white' | 'hispanic' | 'other' | 'prefer_not' | '';
type Gender = 'male' | 'female' | 'nonbinary' | 'trans' | 'lgbtq' | 'prefer_not' | '';
type Branch = 'army' | 'marine_corps' | 'air_force' | 'navy' | 'coast_guard' | 'space_force' | 'air_national_guard' | 'army_national_guard' | 'reservist' | '';
type ServiceEra = 'wwi' | 'wwii' | 'korea' | 'vietnam' | 'persian_gulf' | 'gulf_war' | 'gulf_war_other' | 'post_911' | 'other' | '';
type DischargeStatus = 'honorable' | 'dishonorable' | 'other_than_honorable' | '';
type Barrier = 'healthcare' | 'disability' | 'housing_loan' | 'education' | 'financial_instability' | 'housing_instability' | 'food_insecurity' | 'unemployment' | 'mental_health' | 'addiction' | 'probation' | 'incarceration';
type StoryInterest = 'injustice' | 'heroism' | 'benefits_access' | 'post_service' | 'other';

interface FormData {
  // Basic Info
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  title: string;
  linkedin: string;

  // Signup Type
  signupType: SignupType;

  // Military Info (conditional)
  branch: Branch;
  serviceEra: ServiceEra;
  payGrade: string;
  dischargeStatus: DischargeStatus;
  barriers: Barrier[];

  // Demographics
  race: Race;
  ethnicity: string;
  raceOther: string;
  gender: Gender;
  employment: string;

  // Engagement
  storyInterests: StoryInterest[];
  storyOther: string;
  interestInBVP: string;

  // Consent (now implicit via submission)
  subscribeSubstack: boolean;
  emailConsent: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  zipCode?: string;
  signupType?: string;
  branch?: string;
  serviceEra?: string;
}

// ============================================================================
// DROPDOWN OPTIONS
// ============================================================================

const SIGNUP_OPTIONS: { value: SignupType; label: string }[] = [
  { value: 'supporter', label: 'Supporter' },
  { value: 'military_family', label: 'Military Family Member' },
  { value: 'veteran', label: 'Veteran' },
  { value: 'active_duty', label: 'Active Duty' },
  { value: 'reservist', label: 'Reservist' },
  { value: 'national_guard', label: 'National Guard' },
];

const RACE_OPTIONS: { value: Race; label: string }[] = [
  { value: 'black', label: 'Black' },
  { value: 'indigenous', label: 'American Indigenous' },
  { value: 'asian', label: 'Asian' },
  { value: 'pacific_islander', label: 'Native Hawaiian or Other Pacific Islander' },
  { value: 'white', label: 'White / European' },
  { value: 'hispanic', label: 'Hispanic / Latinx' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not', label: 'Prefer not to answer' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'nonbinary', label: 'Nonbinary' },
  { value: 'trans', label: 'Trans' },
  { value: 'lgbtq', label: 'LGBTQ+' },
  { value: 'prefer_not', label: 'Prefer not to answer' },
];

const BRANCH_OPTIONS: { value: Branch; label: string }[] = [
  { value: 'army', label: 'Army' },
  { value: 'marine_corps', label: 'Marine Corps' },
  { value: 'air_force', label: 'Air Force' },
  { value: 'navy', label: 'Navy' },
  { value: 'coast_guard', label: 'Coast Guard' },
  { value: 'space_force', label: 'Space Force' },
  { value: 'air_national_guard', label: 'Air National Guard' },
  { value: 'army_national_guard', label: 'Army National Guard' },
  { value: 'reservist', label: 'Reservist' },
];

const SERVICE_ERA_OPTIONS: { value: ServiceEra; label: string }[] = [
  { value: 'wwi', label: 'World War I (4/6/1917 - 11/11/1918)' },
  { value: 'wwii', label: 'World War II (12/7/1941 - 12/31/1946)' },
  { value: 'korea', label: 'Korean Conflict (10/7/1950 - 10/20/1954)' },
  { value: 'vietnam', label: 'Vietnam Era (2/28/1961 - 5/7/1975)' },
  { value: 'persian_gulf', label: 'Persian Gulf War (8/2/1990 - 10/6/2001)' },
  { value: 'gulf_war', label: 'Gulf War (8/2/1990 - 10/6/2001)' },
  { value: 'gulf_war_other', label: 'Gulf War (Other) (8/2/1990 - 10/6/2001)' },
  { value: 'post_911', label: 'Post 9/11 (OIF, OEF, OND) (9/11/2001 - ongoing)' },
  { value: 'other', label: 'Other Era of Service' },
];

const DISCHARGE_OPTIONS: { value: DischargeStatus; label: string }[] = [
  { value: 'honorable', label: 'Honorable' },
  { value: 'dishonorable', label: 'Dishonorable' },
  { value: 'other_than_honorable', label: 'Other than Honorable' },
];

const BARRIERS_OPTIONS: { value: Barrier; label: string }[] = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'disability', label: 'Disability' },
  { value: 'housing_loan', label: 'Housing / VA Home Loan' },
  { value: 'education', label: 'Education' },
  { value: 'financial_instability', label: 'Financial Instability' },
  { value: 'housing_instability', label: 'Housing Instability' },
  { value: 'food_insecurity', label: 'Food Insecurity' },
  { value: 'unemployment', label: 'Chronic Unemployment / Underemployment' },
  { value: 'mental_health', label: 'Mental Health Crisis' },
  { value: 'addiction', label: 'Addiction' },
  { value: 'probation', label: 'Probation / Pre-Trial Deferral' },
  { value: 'incarceration', label: 'Jail or Prison' },
];

const STORY_INTEREST_OPTIONS: { value: StoryInterest; label: string }[] = [
  { value: 'injustice', label: 'Stories of injustice in service' },
  { value: 'heroism', label: 'Stories of heroism/achievement in service' },
  { value: 'benefits_access', label: 'Stories of inaccessibility to veterans\' benefits' },
  { value: 'post_service', label: 'Stories of achievement post-service' },
  { value: 'other', label: 'Other' },
];

// Helper to check if signup type is military-connected
const isMilitaryConnected = (type: SignupType): boolean => {
  return ['veteran', 'active_duty', 'reservist', 'national_guard'].includes(type);
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

// Styled Select Dropdown
function SelectDropdown<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  error,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
        {label} {required && <span className="text-bvp-navy">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className={`w-full appearance-none bg-white border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-900 px-4 py-3 pr-10 min-h-[48px] focus:outline-none focus:border-bvp-navy focus:ring-1 focus:ring-bvp-navy transition-colors cursor-pointer`}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Text Input
function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
        {label} {required && <span className="text-bvp-navy">*</span>}
        {optional && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-900 px-4 py-3 min-h-[48px] focus:outline-none focus:border-bvp-navy focus:ring-1 focus:ring-bvp-navy transition-colors placeholder:text-gray-400`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Multi-Select Dropdown (for Barriers)
function MultiSelectDropdown({
  label,
  selected,
  onChange,
  options,
  placeholder = 'Select all that apply',
}: {
  label: string;
  selected: string[];
  onChange: (selected: string[]) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 text-left px-4 py-3 min-h-[48px] focus:outline-none focus:border-bvp-navy focus:ring-1 focus:ring-bvp-navy transition-colors flex items-center justify-between"
      >
        <span className={selected.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
          {selected.length === 0 ? placeholder : `${selected.length} selected`}
        </span>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleOption(option.value)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    isSelected ? 'bg-bvp-navy/5' : ''
                  }`}
                >
                  <div className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-bvp-navy border-bvp-navy' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-800 text-sm">{option.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selected.map((value) => {
            const option = options.find((o) => o.value === value);
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-bvp-navy/10 text-bvp-navy text-xs rounded"
              >
                {option?.label}
                <button
                  type="button"
                  onClick={() => toggleOption(value)}
                  className="hover:text-bvp-navy/70"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Section Header
function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-gray-200 pb-3 mb-5">
      <h3 className="font-display text-base uppercase tracking-wide text-bvp-navy">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function JoinPageV2Client({ content }: JoinPageV2ClientProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    address: '',
    zipCode: '',
    phone: '',
    email: '',
    title: '',
    linkedin: '',
    signupType: '',
    branch: '',
    serviceEra: '',
    payGrade: '',
    dischargeStatus: '',
    barriers: [],
    race: '',
    ethnicity: '',
    raceOther: '',
    gender: '',
    employment: '',
    storyInterests: [],
    storyOther: '',
    interestInBVP: '',
    subscribeSubstack: true,
    emailConsent: true, // Implied by form submission now
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close multi-select when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // This will close dropdowns when clicking outside
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleStoryInterest = (interest: StoryInterest) => {
    setFormData((prev) => ({
      ...prev,
      storyInterests: prev.storyInterests.includes(interest)
        ? prev.storyInterests.filter((i) => i !== interest)
        : [...prev.storyInterests, interest],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.signupType) newErrors.signupType = 'Please select how you would like to sign up';

    // Military-specific validation
    if (isMilitaryConnected(formData.signupType)) {
      if (!formData.branch) newErrors.branch = 'Branch is required';
      if (!formData.serviceEra) newErrors.serviceEra = 'Service era is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[class*="border-red-500"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        // Basic Info
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address || undefined,
        zipCode: formData.zipCode,
        phone: formData.phone || undefined,
        title: formData.title || undefined,
        linkedin: formData.linkedin || undefined,

        // Signup Type
        signupType: formData.signupType,
        isMilitaryConnected: isMilitaryConnected(formData.signupType),

        // Military Info
        branch: formData.branch || undefined,
        serviceEra: formData.serviceEra || undefined,
        payGrade: formData.payGrade || undefined,
        dischargeStatus: formData.dischargeStatus || undefined,
        barriers: formData.barriers.length > 0 ? formData.barriers.join(', ') : undefined,

        // Demographics
        race: formData.race || undefined,
        ethnicity: formData.ethnicity || undefined,
        raceOther: formData.raceOther || undefined,
        gender: formData.gender || undefined,
        employment: formData.employment || undefined,

        // Engagement
        storyInterests: formData.storyInterests.length > 0 ? formData.storyInterests.join(', ') : undefined,
        storyOther: formData.storyOther || undefined,
        interestInBVP: formData.interestInBVP || undefined,

        // Legacy field for backward compatibility
        membershipType: formData.signupType,
      };

      const response = await fetch('/api/advocate-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Submission failed');

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ email: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success View
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden bg-black">
          <img
            src="/images/join-us-hero.jpg"
            alt="Black veterans standing together"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
          <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-[5.75rem] pb-12 md:pb-16">
            <h1 className="font-display font-bold text-white uppercase text-4xl md:text-5xl lg:text-6xl">
              Welcome to the Movement
            </h1>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
            <div className="w-20 h-20 bg-bvp-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-6">Thank You</h2>
            <p className="font-body text-xl text-gray-600 leading-relaxed mb-8">
              Thank you for joining us. Together, we&apos;re building a more equitable future for Black veterans and their families.
            </p>
            <Button href="/" variant="primary" size="lg">
              Return Home
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const showMilitarySection = isMilitaryConnected(formData.signupType);
  const showExpandedSections = formData.signupType !== '';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] max-h-[500px] flex items-end overflow-hidden bg-black">
        <img
          src="/images/join-us-hero.jpg"
          alt="Black veterans standing together"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 md:px-12 lg:px-[5.75rem] pb-10 md:pb-14">
          <p className="text-sm uppercase tracking-widest mb-3 text-white/60">
            {content.heroSubtitle}
          </p>
          <h1 className="font-display font-bold text-white uppercase text-3xl md:text-4xl lg:text-5xl">
            {content.heroTitle}
          </h1>
        </div>
      </section>

      {/* Form Section - Two Column Layout */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[5.75rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* LEFT COLUMN - Body Copy */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wide text-bvp-navy mb-6">
                Get Involved
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="font-body text-gray-600 leading-relaxed mb-6">
                  {content.heroDescription}
                </p>
                <p className="font-body text-gray-600 leading-relaxed mb-6">
                  Black Veterans Project is building a movement for repair, equity, and justice. When you sign up, you join a growing network of advocates fighting for accountability and change.
                </p>
                <div className="bg-gray-50 border-l-4 border-bvp-gold p-6 mt-8">
                  <h3 className="font-display text-sm uppercase tracking-wider text-bvp-navy mb-3">
                    What to Expect
                  </h3>
                  <ul className="space-y-2 text-gray-600 font-body">
                    <li className="flex items-start gap-2">
                      <span className="text-bvp-gold mt-1">→</span>
                      Updates on our campaigns and legal efforts
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bvp-gold mt-1">→</span>
                      Opportunities to share your story
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bvp-gold mt-1">→</span>
                      Invitations to events and community gatherings
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bvp-gold mt-1">→</span>
                      The Dark Green Report newsletter
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8">

                {/* ============================================================ */}
                {/* PHASE 1: ESSENTIAL FIELDS (Always Visible) */}
                {/* ============================================================ */}
                <div className="bg-white">
                  <SectionHeader title="Start Here" />

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextInput
                        label="First Name"
                        value={formData.firstName}
                        onChange={(v) => updateField('firstName', v)}
                        placeholder="Your first name"
                        required
                        error={errors.firstName}
                      />
                      <TextInput
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(v) => updateField('lastName', v)}
                        placeholder="Your last name"
                        required
                        error={errors.lastName}
                      />
                    </div>

                    <TextInput
                      label="Email Address"
                      value={formData.email}
                      onChange={(v) => updateField('email', v)}
                      placeholder="you@example.com"
                      type="email"
                      required
                      error={errors.email}
                    />

                    <TextInput
                      label="Zip Code"
                      value={formData.zipCode}
                      onChange={(v) => updateField('zipCode', v)}
                      placeholder="12345"
                      required
                      error={errors.zipCode}
                    />

                    <SelectDropdown
                      label="I would like to sign up as"
                      value={formData.signupType}
                      onChange={(v) => updateField('signupType', v)}
                      options={SIGNUP_OPTIONS}
                      placeholder="Select your connection"
                      required
                      error={errors.signupType}
                    />
                  </div>
                </div>

                {/* ============================================================ */}
                {/* PHASE 2: EXPANDED SECTIONS (After Signup Type Selected) */}
                {/* ============================================================ */}
                <AnimatePresence>
                  {showExpandedSections && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="space-y-8"
                    >
                      {/* MILITARY SECTION (Conditional) */}
                      <AnimatePresence>
                        {showMilitarySection && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <SectionHeader
                              title="Military Information"
                              description="Help us understand your service background"
                            />

                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SelectDropdown
                                  label="Branch"
                                  value={formData.branch}
                                  onChange={(v) => updateField('branch', v)}
                                  options={BRANCH_OPTIONS}
                                  placeholder="Select branch"
                                  required
                                  error={errors.branch}
                                />
                                <SelectDropdown
                                  label="Service Era"
                                  value={formData.serviceEra}
                                  onChange={(v) => updateField('serviceEra', v)}
                                  options={SERVICE_ERA_OPTIONS}
                                  placeholder="Select era"
                                  required
                                  error={errors.serviceEra}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextInput
                                  label="Pay Grade at Separation"
                                  value={formData.payGrade}
                                  onChange={(v) => updateField('payGrade', v)}
                                  placeholder="e.g., E-5, O-3"
                                  optional
                                />
                                <SelectDropdown
                                  label="Discharge Status"
                                  value={formData.dischargeStatus}
                                  onChange={(v) => updateField('dischargeStatus', v)}
                                  options={DISCHARGE_OPTIONS}
                                  placeholder="Select status"
                                />
                              </div>

                              <MultiSelectDropdown
                                label="Have you experienced barriers to accessing veterans benefits?"
                                selected={formData.barriers}
                                onChange={(v) => updateField('barriers', v as Barrier[])}
                                options={BARRIERS_OPTIONS}
                                placeholder="Select all that apply"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* ADDITIONAL INFO SECTION */}
                      <div>
                        <SectionHeader
                          title="Additional Information"
                          description="Optional — helps us better serve you"
                        />

                        <div className="space-y-4">
                          <TextInput
                            label="Phone Number"
                            value={formData.phone}
                            onChange={(v) => updateField('phone', v)}
                            placeholder="(555) 123-4567"
                            type="tel"
                            optional
                          />

                          <TextInput
                            label="Address"
                            value={formData.address}
                            onChange={(v) => updateField('address', v)}
                            placeholder="Street address"
                            optional
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TextInput
                              label="Title / Affiliation"
                              value={formData.title}
                              onChange={(v) => updateField('title', v)}
                              placeholder="Your title or organization"
                              optional
                            />
                            <TextInput
                              label="LinkedIn"
                              value={formData.linkedin}
                              onChange={(v) => updateField('linkedin', v)}
                              placeholder="linkedin.com/in/yourprofile"
                              optional
                            />
                          </div>
                        </div>
                      </div>

                      {/* DEMOGRAPHICS SECTION */}
                      <div>
                        <SectionHeader
                          title="Demographics"
                          description="Optional — helps us understand our community"
                        />

                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <SelectDropdown
                                label="Race"
                                value={formData.race}
                                onChange={(v) => {
                                  updateField('race', v);
                                  if (v !== 'black') updateField('ethnicity', '');
                                  if (v !== 'other') updateField('raceOther', '');
                                }}
                                options={RACE_OPTIONS}
                                placeholder="Select race"
                              />

                              {/* Conditional: Ethnicity for Black */}
                              <AnimatePresence>
                                {formData.race === 'black' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3"
                                  >
                                    <TextInput
                                      label="Ethnicity"
                                      value={formData.ethnicity}
                                      onChange={(v) => updateField('ethnicity', v)}
                                      placeholder="e.g., African American, Caribbean, African"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Conditional: Other race text field */}
                              <AnimatePresence>
                                {formData.race === 'other' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-3"
                                  >
                                    <TextInput
                                      label="Please specify"
                                      value={formData.raceOther}
                                      onChange={(v) => updateField('raceOther', v)}
                                      placeholder="Your race/ethnicity"
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <SelectDropdown
                              label="Gender"
                              value={formData.gender}
                              onChange={(v) => updateField('gender', v)}
                              options={GENDER_OPTIONS}
                              placeholder="Select gender"
                            />
                          </div>

                          <TextInput
                            label="Current Employment"
                            value={formData.employment}
                            onChange={(v) => updateField('employment', v)}
                            placeholder="Your current occupation or employment status"
                            optional
                          />
                        </div>
                      </div>

                      {/* STORY SHARING SECTION */}
                      <div>
                        <SectionHeader
                          title="Share Your Story"
                          description="Are you interested in sharing details about your experience?"
                        />

                        <div className="space-y-3 mb-6">
                          {STORY_INTEREST_OPTIONS.map((option) => {
                            const isSelected = formData.storyInterests.includes(option.value);
                            return (
                              <motion.label
                                key={option.value}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 p-3 border cursor-pointer transition-all duration-200 bg-white ${
                                  isSelected
                                    ? 'border-bvp-navy bg-bvp-navy/5'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                              >
                                <motion.div
                                  animate={{
                                    backgroundColor: isSelected ? '#232651' : 'transparent',
                                    borderColor: isSelected ? '#232651' : '#d1d5db',
                                  }}
                                  transition={{ duration: 0.2 }}
                                  className="w-5 h-5 border-2 flex items-center justify-center flex-shrink-0"
                                >
                                  <AnimatePresence>
                                    {isSelected && (
                                      <motion.svg
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="w-3 h-3 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </motion.svg>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                                <span className="font-body text-gray-800 text-sm">{option.label}</span>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleStoryInterest(option.value)}
                                  className="sr-only"
                                />
                              </motion.label>
                            );
                          })}
                        </div>

                        {/* Conditional: Other story interest */}
                        <AnimatePresence>
                          {formData.storyInterests.includes('other') && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mb-6"
                            >
                              <TextInput
                                label="Other story interest"
                                value={formData.storyOther}
                                onChange={(v) => updateField('storyOther', v)}
                                placeholder="Please describe your interest"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Tell us about your interest in Black Veterans Project
                          </label>
                          <textarea
                            value={formData.interestInBVP}
                            onChange={(e) => updateField('interestInBVP', e.target.value)}
                            className="w-full bg-white border border-gray-300 text-gray-900 px-4 py-3 min-h-[100px] focus:outline-none focus:border-bvp-navy focus:ring-1 focus:ring-bvp-navy transition-colors placeholder:text-gray-400 resize-y"
                            placeholder="What brings you to BVP? How would you like to get involved?"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button & Whisper Text */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    className="font-display uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      <>Get Involved <span className="ml-2">→</span></>
                    )}
                  </Button>

                  {/* Whisper Text - Consent Notice */}
                  <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                    By signing up, you agree to receive email communications from Black Veterans Project,
                    including The Dark Green Report newsletter. You can unsubscribe at any time.
                    See our <a href="/privacy" className="underline hover:text-bvp-navy">Privacy Policy</a>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
