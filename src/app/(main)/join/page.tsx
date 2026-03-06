"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// TYPES
// ============================================
type ViewType = "main" | "advocate" | "success";
type MemberType = "veteran" | "family" | "descendant" | "ally" | "";
type SignUpAs = "" | "supporter" | "family" | "veteran" | "active" | "reservist" | "guard";
type Race = "" | "black" | "indigenous" | "asian" | "pacific" | "white" | "hispanic" | "other" | "prefer-not";
type Gender = "" | "male" | "female" | "nonbinary" | "trans" | "lgbtq" | "prefer-not";
type Branch = "" | "army" | "marines" | "airforce" | "navy" | "coastguard" | "spaceforce" | "air-guard" | "army-guard" | "reservist";
type ServiceEra = "" | "wwi" | "wwii" | "korea" | "vietnam" | "gulf1" | "gulf2" | "gulf-other" | "post911" | "other";
type DischargeStatus = "" | "honorable" | "dishonorable" | "other-than-honorable";
type BenefitsBarrier = "" | "healthcare" | "disability" | "housing" | "education" | "multiple" | "none";

interface BasicFormData {
  firstName: string;
  lastName: string;
  email: string;
  zipCode: string;
  memberType: MemberType;
  receiveUpdates: boolean;
}

interface AdvocateFormData {
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  title: string;
  linkedin: string;
  signUpAs: SignUpAs;
  race: Race;
  gender: Gender;
  employment: string;
  branch: Branch;
  serviceEra: ServiceEra;
  payGrade: string;
  dischargeStatus: DischargeStatus;
  benefitsBarrier: BenefitsBarrier;
  experiences: {
    financial: boolean;
    housing: boolean;
    food: boolean;
    unemployment: boolean;
    mentalHealth: boolean;
    addiction: boolean;
    probation: boolean;
    incarceration: boolean;
  };
  storyInterests: {
    injustice: boolean;
    heroism: boolean;
    inaccessibility: boolean;
    achievement: boolean;
    other: boolean;
  };
  interest: string;
}

// ============================================
// FORM FIELD COMPONENTS
// ============================================
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  id: string;
  autoComplete?: string;
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  id,
  autoComplete,
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
      >
        {label}
        {required && " *"}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="w-full bg-white border border-gray-300 text-black font-body text-base px-3.5 py-3 min-h-[44px] transition-colors focus:border-black focus:outline-none placeholder:text-gray-400"
        aria-required={required}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  id: string;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  id,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
      >
        {label}
        {required && " *"}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full bg-white border border-gray-300 text-black font-body text-base px-3.5 py-3 min-h-[44px] appearance-none transition-colors focus:border-black focus:outline-none pr-10"
          aria-required={required}
        >
          <option value="">Select one</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-2.5 h-1.5 pointer-events-none"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="#999"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

function CheckboxField({ label, checked, onChange, id }: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2.5 cursor-pointer group"
    >
      <span className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <span
          className="block w-[18px] h-[18px] border border-gray-300 bg-white peer-checked:bg-black peer-checked:border-black transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-bvp-gold peer-focus-visible:ring-offset-2"
          aria-hidden="true"
        >
          {checked && (
            <svg
              className="w-full h-full text-white p-0.5"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 7L6 10L11 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>
      <span className="text-[17px] text-gray-600 leading-snug group-hover:text-gray-800 transition-colors">
        {label}
      </span>
    </label>
  );
}

// ============================================
// MEMBERSHIP CARD COMPONENT
// ============================================
interface MembershipCardProps {
  title: string;
  description: string;
  linkText: string;
  onClick: () => void;
  expanded?: boolean;
  children?: React.ReactNode;
  id: string;
}

function MembershipCard({
  title,
  description,
  linkText,
  onClick,
  expanded,
  children,
  id,
}: MembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      id={id}
      role={expanded ? undefined : "button"}
      tabIndex={expanded ? undefined : 0}
      onClick={!expanded ? onClick : undefined}
      onKeyDown={
        !expanded
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`border-2 border-black p-8 transition-all duration-300 group/card ${
        !expanded
          ? "cursor-pointer hover:border-bvp-gold hover:shadow-lg hover:shadow-bvp-gold/10 focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2"
          : "cursor-default border-bvp-gold"
      }`}
      aria-expanded={expanded}
    >
      <h2 className="text-[22px] font-bold text-black mb-3 font-gunterz group-hover/card:text-bvp-navy transition-colors">
        {title}
      </h2>
      <p className="text-[15px] leading-relaxed text-gray-600 mb-5">
        {description}
      </p>

      {!expanded && (
        <span className="relative inline-flex items-center gap-2 text-[15px] font-bold text-black group-hover/card:text-bvp-gold transition-colors">
          {linkText}
          <span
            className="inline-block transition-all duration-300 group-hover/card:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bvp-gold group-hover/card:w-[calc(100%-1.5rem)] transition-all duration-300" />
        </span>
      )}

      <AnimatePresence>
        {expanded && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 pt-7 mt-7">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN JOIN PAGE
// ============================================
export default function JoinPage() {
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const [basicExpanded, setBasicExpanded] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Basic member form state
  const [basicForm, setBasicForm] = useState<BasicFormData>({
    firstName: "",
    lastName: "",
    email: "",
    zipCode: "",
    memberType: "",
    receiveUpdates: true,
  });

  // Advocate form state
  const [advocateForm, setAdvocateForm] = useState<AdvocateFormData>({
    firstName: "",
    lastName: "",
    address: "",
    zipCode: "",
    phone: "",
    email: "",
    title: "",
    linkedin: "",
    signUpAs: "",
    race: "",
    gender: "",
    employment: "",
    branch: "",
    serviceEra: "",
    payGrade: "",
    dischargeStatus: "",
    benefitsBarrier: "",
    experiences: {
      financial: false,
      housing: false,
      food: false,
      unemployment: false,
      mentalHealth: false,
      addiction: false,
      probation: false,
      incarceration: false,
    },
    storyInterests: {
      injustice: false,
      heroism: false,
      inaccessibility: false,
      achievement: false,
      other: false,
    },
    interest: "",
  });

  // Focus first input when basic card expands
  useEffect(() => {
    if (basicExpanded && firstInputRef.current) {
      const timeout = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [basicExpanded]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentView]);

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    if (view === "main") {
      setBasicExpanded(false);
    }
  }, []);

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, submit to API
    handleViewChange("success");
  };

  const handleAdvocateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, submit to API
    handleViewChange("success");
  };

  // Member type options
  const memberTypeOptions = [
    { value: "veteran", label: "Veteran" },
    { value: "family", label: "Military family member" },
    { value: "descendant", label: "Descendant of a veteran" },
    { value: "ally", label: "Ally / Supporter" },
  ];

  // Sign up as options
  const signUpAsOptions = [
    { value: "supporter", label: "Supporter" },
    { value: "family", label: "Military Family Member" },
    { value: "veteran", label: "Veteran" },
    { value: "active", label: "Active Duty" },
    { value: "reservist", label: "Reservist" },
    { value: "guard", label: "National Guard" },
  ];

  // Race options
  const raceOptions = [
    { value: "black", label: "Black" },
    { value: "indigenous", label: "American Indigenous" },
    { value: "asian", label: "Asian" },
    { value: "pacific", label: "Native Hawaiian or Other Pacific Islander" },
    { value: "white", label: "White / European" },
    { value: "hispanic", label: "Hispanic / Latinx" },
    { value: "other", label: "Other" },
    { value: "prefer-not", label: "Prefer not to answer" },
  ];

  // Gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "nonbinary", label: "Nonbinary" },
    { value: "trans", label: "Trans" },
    { value: "lgbtq", label: "LGBTQ+" },
    { value: "prefer-not", label: "Prefer not to answer" },
  ];

  // Branch options
  const branchOptions = [
    { value: "army", label: "Army" },
    { value: "marines", label: "Marine Corps" },
    { value: "airforce", label: "Air Force" },
    { value: "navy", label: "Navy" },
    { value: "coastguard", label: "Coast Guard" },
    { value: "spaceforce", label: "Space Force" },
    { value: "air-guard", label: "Air National Guard" },
    { value: "army-guard", label: "Army National Guard" },
    { value: "reservist", label: "Reservist" },
  ];

  // Service era options
  const serviceEraOptions = [
    { value: "wwi", label: "World War I (4/6/1917 - 11/11/1918)" },
    { value: "wwii", label: "World War II (12/7/1941 - 12/31/1946)" },
    { value: "korea", label: "Korean Conflict (10/7/1950 - 10/20/1954)" },
    { value: "vietnam", label: "Vietnam Era (2/28/1961 - 5/7/1975)" },
    { value: "gulf1", label: "Persian Gulf War (8/2/1990 - 10/6/2001)" },
    { value: "gulf2", label: "Gulf War (8/2/1990 - 10/6/2001)" },
    { value: "gulf-other", label: "Gulf War (Other) (8/2/1990 - 10/6/2001)" },
    { value: "post911", label: "Post 9/11 (OIF, OEF, OND) (9/11/2001 - ongoing)" },
    { value: "other", label: "Other Era of Service" },
  ];

  // Discharge status options
  const dischargeStatusOptions = [
    { value: "honorable", label: "Honorable" },
    { value: "dishonorable", label: "Dishonorable" },
    { value: "other-than-honorable", label: "Other than Honorable" },
  ];

  // Benefits barrier options
  const benefitsBarrierOptions = [
    { value: "healthcare", label: "Healthcare" },
    { value: "disability", label: "Disability" },
    { value: "housing", label: "Housing / VA Home Loan" },
    { value: "education", label: "Education" },
    { value: "multiple", label: "Multiple barriers" },
    { value: "none", label: "None" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================
          VIEW: MAIN (Membership Options)
          ============================================ */}
      <AnimatePresence mode="wait">
        {currentView === "main" && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero */}
            <section
              className="relative flex items-end"
              style={{ height: 'clamp(40vh, 50vw, 60vh)' }}
            >
              <img
                src="/images/join-banner.jpg"
                alt="Vietnam veteran and U.S. Army veteran walking together at a parade"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
              <div
                className="relative z-10 max-w-[1400px] mx-auto w-full"
                style={{ padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 4vw, 5.75rem)' }}
              >
                <p className="text-sm uppercase tracking-widest mb-4 text-white/60">
                  Join the Movement
                </p>
                <h1
                  className="font-gunterz font-bold text-white"
                  style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
                >
                  Join Our Movement
                </h1>
              </div>
            </section>

            {/* Two-Column Layout */}
            <section className="border-b border-gray-200">
              <div
                className="max-w-[1400px] mx-auto grid"
                style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))' }}
              >
                {/* Left Column - Description */}
                <div
                  className="md:border-r border-gray-200"
                  style={{ padding: 'clamp(1rem, 4vw, 5.75rem)' }}
                >
                  <div className="space-y-5">
                    <p className="text-[17px] leading-relaxed text-gray-700">
                      BVP is building the first comprehensive movement for
                      reparative justice for Black veterans and military
                      families through impact litigation, narrative work, and
                      movement-building. This work only moves when the people
                      most affected, and those who stand with them, are
                      organized.
                    </p>
                    <p className="text-[17px] leading-relaxed text-gray-700">
                      Our membership corps is the foundation of that movement: a
                      growing body of veterans, families, advocates, and allies
                      whose voices we carry into Congress, into the courts, and
                      into public memory.
                    </p>
                    <p className="text-[17px] leading-relaxed text-gray-700">
                      When you join BVP, you are becoming{" "}
                      <strong>a steward of repair</strong>: someone who helps
                      safeguard the truth, advance accountability, and ensure
                      this history cannot be erased or ignored. Together, we're
                      building the case, telling the story, and organizing the
                      movement to make repair real. If you're a veteran or
                      military family member with a story about VA benefits or
                      discrimination, you may also want to{" "}
                      <a
                        href="/contact"
                        className="text-black font-semibold underline underline-offset-[3px] hover:text-bvp-navy transition-colors"
                      >
                        share your story with BVP
                      </a>{" "}
                      — that's a separate process from membership.
                    </p>
                  </div>
                </div>

                {/* Right Column - Membership Cards */}
                <div
                  className="flex flex-col gap-6"
                  style={{ padding: 'clamp(1rem, 4vw, 5.75rem)' }}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-gray-400">
                    Membership Categories
                  </p>

                  {/* Advocate Card */}
                  <MembershipCard
                    id="advocate-card"
                    title="Advocate"
                    description="As a full advocate, you're part of the community organizing corps — we train you to help us lead petition drives, call campaigns, town halls, and rapid-response moments. We'll plan assignments based on your location, service background, and interests. When we mobilize, you're in the room. When we need voices in a specific district, you'll hear from us directly. This is where membership becomes action."
                    linkText="Become an Advocate"
                    onClick={() => handleViewChange("advocate")}
                  />

                  {/* Affiliate Card */}
                  <MembershipCard
                    id="affiliate-card"
                    title="Affiliate"
                    description="You stand with the movement. Your membership adds to the collective strength BVP represents when we testify before Congress, convene coalitions, or speak to the press. You'll receive updates on the fight: what's happening in the courts, on the Hill, and at the VA."
                    linkText="Become an Affiliate"
                    onClick={() => setBasicExpanded(true)}
                    expanded={basicExpanded}
                  >
                    <form
                      onSubmit={handleBasicSubmit}
                      className="flex flex-col gap-5"
                      aria-label="Basic membership form"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label
                            htmlFor="basic-firstName"
                            className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                          >
                            First Name
                          </label>
                          <input
                            ref={firstInputRef}
                            type="text"
                            id="basic-firstName"
                            placeholder="First name"
                            value={basicForm.firstName}
                            onChange={(e) =>
                              setBasicForm((f) => ({
                                ...f,
                                firstName: e.target.value,
                              }))
                            }
                            autoComplete="given-name"
                            className="w-full bg-white border border-gray-300 text-black font-body text-base px-3.5 py-3 min-h-[44px] transition-colors focus:border-black focus:outline-none placeholder:text-gray-400"
                            required
                          />
                        </div>
                        <InputField
                          id="basic-lastName"
                          label="Last Name"
                          placeholder="Last name"
                          value={basicForm.lastName}
                          onChange={(v) =>
                            setBasicForm((f) => ({ ...f, lastName: v }))
                          }
                          required
                          autoComplete="family-name"
                        />
                      </div>

                      <InputField
                        id="basic-email"
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        value={basicForm.email}
                        onChange={(v) =>
                          setBasicForm((f) => ({ ...f, email: v }))
                        }
                        required
                        autoComplete="email"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          id="basic-zipCode"
                          label="Zip Code"
                          placeholder="00000"
                          value={basicForm.zipCode}
                          onChange={(v) =>
                            setBasicForm((f) => ({ ...f, zipCode: v }))
                          }
                          autoComplete="postal-code"
                        />
                        <SelectField
                          id="basic-memberType"
                          label="I am a…"
                          value={basicForm.memberType}
                          onChange={(v) =>
                            setBasicForm((f) => ({
                              ...f,
                              memberType: v as MemberType,
                            }))
                          }
                          options={memberTypeOptions}
                        />
                      </div>

                      <CheckboxField
                        id="basic-updates"
                        label="Send me updates on the fight — courts, Congress, and the VA."
                        checked={basicForm.receiveUpdates}
                        onChange={(v) =>
                          setBasicForm((f) => ({ ...f, receiveUpdates: v }))
                        }
                      />

                      <button
                        type="submit"
                        className="w-full py-4 bg-black text-white font-bold text-[17px] hover:bg-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2"
                      >
                        Join BVP →
                      </button>

                      <p className="text-[13px] text-gray-400 text-center">
                        We'll never share your information.
                      </p>
                    </form>
                  </MembershipCard>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    Not sure? Start as an Affiliate.
                  </p>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ============================================
            VIEW: ADVOCATE FORM
            ============================================ */}
        {currentView === "advocate" && (
          <motion.div
            key="advocate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero */}
            <section
              className="border-b border-gray-200"
              style={{ padding: 'clamp(6rem, 10vw, 8rem) clamp(1rem, 4vw, 5.75rem) clamp(2rem, 4vw, 3rem)' }}
            >
              <div className="max-w-[1400px] mx-auto">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4">
                  Join Us
                </p>
                <h1
                  className="font-gunterz font-bold text-black leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
                >
                  Become an Advocate
                </h1>
              </div>
            </section>

            {/* Form Container */}
            <section
              className="max-w-3xl"
              style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 5.75rem)' }}
            >
              <button
                onClick={() => handleViewChange("main")}
                className="text-[17px] font-semibold text-gray-400 hover:text-black transition-colors mb-8 flex items-center gap-1 min-h-[44px]"
                type="button"
              >
                <span aria-hidden="true">←</span> Back to membership options
              </button>

              <p className="text-base text-gray-600 leading-relaxed mb-9">
                Black Veterans Project is building the first comprehensive
                movement for reparative justice for Black veterans and military
                families. Your information helps us build the case for repair.
              </p>

              <form
                onSubmit={handleAdvocateSubmit}
                className="flex flex-col gap-5"
                aria-label="Advocate membership form"
              >
                {/* Contact Information */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Contact Information
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="adv-firstName"
                    label="First Name"
                    placeholder="First name"
                    value={advocateForm.firstName}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, firstName: v }))
                    }
                    required
                    autoComplete="given-name"
                  />
                  <InputField
                    id="adv-lastName"
                    label="Last Name"
                    placeholder="Last name"
                    value={advocateForm.lastName}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, lastName: v }))
                    }
                    required
                    autoComplete="family-name"
                  />
                </div>

                <InputField
                  id="adv-address"
                  label="Address"
                  placeholder="Street address"
                  value={advocateForm.address}
                  onChange={(v) =>
                    setAdvocateForm((f) => ({ ...f, address: v }))
                  }
                  autoComplete="street-address"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="adv-zipCode"
                    label="Zip Code"
                    placeholder="00000"
                    value={advocateForm.zipCode}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, zipCode: v }))
                    }
                    required
                    autoComplete="postal-code"
                  />
                  <InputField
                    id="adv-phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="(000) 000-0000"
                    value={advocateForm.phone}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, phone: v }))
                    }
                    autoComplete="tel"
                  />
                </div>

                <InputField
                  id="adv-email"
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={advocateForm.email}
                  onChange={(v) =>
                    setAdvocateForm((f) => ({ ...f, email: v }))
                  }
                  required
                  autoComplete="email"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="adv-title"
                    label="Title / Affiliation"
                    placeholder="e.g., Retired Sergeant"
                    value={advocateForm.title}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, title: v }))
                    }
                  />
                  <InputField
                    id="adv-linkedin"
                    label="LinkedIn (optional)"
                    placeholder="linkedin.com/in/..."
                    value={advocateForm.linkedin}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, linkedin: v }))
                    }
                  />
                </div>

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Sign Up As */}
                <SelectField
                  id="adv-signUpAs"
                  label="I would like to sign up as"
                  value={advocateForm.signUpAs}
                  onChange={(v) =>
                    setAdvocateForm((f) => ({ ...f, signUpAs: v as SignUpAs }))
                  }
                  options={signUpAsOptions}
                />

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Demographics */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Demographic
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    id="adv-race"
                    label="Race"
                    value={advocateForm.race}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, race: v as Race }))
                    }
                    options={raceOptions}
                  />
                  <SelectField
                    id="adv-gender"
                    label="Gender"
                    value={advocateForm.gender}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, gender: v as Gender }))
                    }
                    options={genderOptions}
                  />
                </div>

                <InputField
                  id="adv-employment"
                  label="Current Employment"
                  placeholder="Current job or status"
                  value={advocateForm.employment}
                  onChange={(v) =>
                    setAdvocateForm((f) => ({ ...f, employment: v }))
                  }
                />

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Military Connected */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Military Connected
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    id="adv-branch"
                    label="Branch"
                    value={advocateForm.branch}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, branch: v as Branch }))
                    }
                    options={branchOptions}
                    required
                  />
                  <SelectField
                    id="adv-serviceEra"
                    label="Service Era"
                    value={advocateForm.serviceEra}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({
                        ...f,
                        serviceEra: v as ServiceEra,
                      }))
                    }
                    options={serviceEraOptions}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="adv-payGrade"
                    label="Pay Grade at Separation"
                    placeholder="e.g., E-5, O-3"
                    value={advocateForm.payGrade}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({ ...f, payGrade: v }))
                    }
                  />
                  <SelectField
                    id="adv-dischargeStatus"
                    label="Discharge Status"
                    value={advocateForm.dischargeStatus}
                    onChange={(v) =>
                      setAdvocateForm((f) => ({
                        ...f,
                        dischargeStatus: v as DischargeStatus,
                      }))
                    }
                    options={dischargeStatusOptions}
                  />
                </div>

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Experiences */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Have you experienced the following?
                </p>

                <SelectField
                  id="adv-benefitsBarrier"
                  label="Barriers to Accessing Veterans Benefits"
                  value={advocateForm.benefitsBarrier}
                  onChange={(v) =>
                    setAdvocateForm((f) => ({
                      ...f,
                      benefitsBarrier: v as BenefitsBarrier,
                    }))
                  }
                  options={benefitsBarrierOptions}
                />

                <fieldset>
                  <legend className="sr-only">
                    Select any experiences that apply
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CheckboxField
                      id="exp-financial"
                      label="Financial Instability"
                      checked={advocateForm.experiences.financial}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, financial: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="exp-housing"
                      label="Housing Instability"
                      checked={advocateForm.experiences.housing}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, housing: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="exp-food"
                      label="Food Insecurity"
                      checked={advocateForm.experiences.food}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, food: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="exp-unemployment"
                      label="Chronic Unemployment / Underemployment"
                      checked={advocateForm.experiences.unemployment}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, unemployment: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="exp-mentalHealth"
                      label="Mental Health Crisis"
                      checked={advocateForm.experiences.mentalHealth}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, mentalHealth: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="exp-addiction"
                      label="Addiction"
                      checked={advocateForm.experiences.addiction}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, addiction: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="exp-probation"
                      label="Probation / Pre-Trial Deferral"
                      checked={advocateForm.experiences.probation}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, probation: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="exp-incarceration"
                      label="Jail or Prison"
                      checked={advocateForm.experiences.incarceration}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          experiences: { ...f.experiences, incarceration: v },
                        }))
                      }
                    />
                  </div>
                </fieldset>

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Story Sharing */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Are you interested in sharing details about your military
                  experience?
                </p>

                <fieldset>
                  <legend className="sr-only">
                    Select story types you're interested in sharing
                  </legend>
                  <div className="flex flex-col gap-3">
                    <CheckboxField
                      id="story-injustice"
                      label="Stories of injustice in service"
                      checked={advocateForm.storyInterests.injustice}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          storyInterests: { ...f.storyInterests, injustice: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="story-heroism"
                      label="Stories of heroism/achievement in service"
                      checked={advocateForm.storyInterests.heroism}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          storyInterests: { ...f.storyInterests, heroism: v },
                        }))
                      }
                    />
                    <CheckboxField
                      id="story-inaccessibility"
                      label="Stories of inaccessibility to veterans' benefits"
                      checked={advocateForm.storyInterests.inaccessibility}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          storyInterests: {
                            ...f.storyInterests,
                            inaccessibility: v,
                          },
                        }))
                      }
                    />
                    <CheckboxField
                      id="story-achievement"
                      label="Stories of achievement post-service"
                      checked={advocateForm.storyInterests.achievement}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          storyInterests: {
                            ...f.storyInterests,
                            achievement: v,
                          },
                        }))
                      }
                    />
                    <CheckboxField
                      id="story-other"
                      label="Other"
                      checked={advocateForm.storyInterests.other}
                      onChange={(v) =>
                        setAdvocateForm((f) => ({
                          ...f,
                          storyInterests: { ...f.storyInterests, other: v },
                        }))
                      }
                    />
                  </div>
                </fieldset>

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Interest */}
                <div className="flex flex-col">
                  <label
                    htmlFor="adv-interest"
                    className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                  >
                    Please tell us about your interest in Black Veterans Project
                  </label>
                  <textarea
                    id="adv-interest"
                    placeholder="Share why you're interested in joining BVP..."
                    value={advocateForm.interest}
                    onChange={(e) =>
                      setAdvocateForm((f) => ({
                        ...f,
                        interest: e.target.value,
                      }))
                    }
                    className="w-full bg-white border border-gray-300 text-black font-body text-base px-3.5 py-3 min-h-[120px] resize-y transition-colors focus:border-black focus:outline-none placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black text-white font-bold text-[17px] hover:bg-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2 mt-2"
                >
                  Join as Advocate →
                </button>
              </form>
            </section>
          </motion.div>
        )}

        {/* ============================================
            VIEW: SUCCESS
            ============================================ */}
        {currentView === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hero */}
            <section
              className="border-b border-gray-200"
              style={{ padding: 'clamp(6rem, 10vw, 8rem) clamp(1rem, 4vw, 5.75rem) clamp(2rem, 4vw, 3rem)' }}
            >
              <div className="max-w-[1400px] mx-auto">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-4">
                  Join Us
                </p>
                <h1
                  className="font-gunterz font-bold text-black leading-tight"
                  style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
                >
                  Welcome to the Movement
                </h1>
              </div>
            </section>

            {/* Success Message */}
            <section style={{ padding: 'clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 5.75rem)' }}>
              <div className="max-w-xl">
                <div className="mb-8">
                  <svg
                    className="w-16 h-16 text-bvp-green"
                    viewBox="0 0 64 64"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      d="M20 32L28 40L44 24"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[17px] text-gray-700 leading-relaxed mb-8">
                  You're now a member of Black Veterans Project. We'll be in
                  touch with updates on the fight — what's happening in the
                  courts, on the Hill, and at the VA. Thank you for standing
                  with us.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 text-[17px] font-bold text-black hover:text-bvp-navy transition-colors min-h-[44px]"
                >
                  Return to Homepage
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
