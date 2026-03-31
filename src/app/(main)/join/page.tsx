"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitToActionNetwork } from "@/lib/actionNetwork";
import { Button } from "@/components/ui/Button";

// ============================================
// TYPES
// ============================================
type ViewType = "main" | "veteran" | "advocate" | "success";
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

interface VeteranFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  branch: Branch;
  serviceEra: ServiceEra;
  payGrade: string;
  dischargeStatus: DischargeStatus;
  benefitsBarrier: BenefitsBarrier;
  vaClaimStatus: "" | "never-filed" | "pending" | "denied" | "approved" | "appealing";
  shareStory: boolean;
  storyBrief: string;
  contactForLegal: boolean;
  alsoAffiliate: boolean;
  alsoAdvocate: boolean;
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
  error?: string;
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
  error,
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
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full bg-white border text-black font-body text-base px-3.5 py-3 min-h-[44px] transition-colors focus:outline-none placeholder:text-gray-400 ${
          error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1">{error}</p>
      )}
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
  error?: string;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  id,
  error,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || "Select one";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
      >
        {label}
        {required && " *"}
      </label>
      <div className="relative" ref={dropdownRef}>
        {/* Hidden native select for form submission */}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        >
          <option value="">Select one</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full bg-white border text-left font-body text-base px-3.5 py-3 min-h-[44px] transition-colors focus:outline-none pr-10 ${
            error ? "border-red-500 focus:border-red-500" : isOpen ? "border-black" : "border-gray-300 focus:border-black"
          } ${!value ? "text-gray-400" : "text-black"}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={id}
        >
          {displayText}
        </button>

        {/* Dropdown arrow */}
        <svg
          className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-2.5 h-1.5 pointer-events-none transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
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

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
            aria-labelledby={id}
          >
            <div
              className={`px-3.5 py-3 cursor-pointer transition-colors hover:bg-gray-100 ${
                !value ? "bg-gray-50 font-medium" : ""
              }`}
              role="option"
              aria-selected={!value}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              Select one
            </div>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`px-3.5 py-3 cursor-pointer transition-colors hover:bg-gray-100 ${
                  value === opt.value ? "bg-gray-50 font-medium" : ""
                }`}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1">{error}</p>
      )}
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
      className={`relative border-2 border-black rounded-2xl overflow-hidden p-8 transition-all duration-300 group/card ${
        !expanded
          ? "cursor-pointer hover:border-bvp-gold hover:shadow-lg hover:shadow-bvp-gold/10 focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2"
          : "cursor-default border-bvp-gold"
      }`}
      aria-expanded={expanded}
    >
      {/* Gold bar at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FDC500]" />
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
type BasicFormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

type AdvocateFormErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  zipCode?: string;
  branch?: string;
  serviceEra?: string;
};

export default function JoinPage() {
  const [currentView, setCurrentView] = useState<ViewType>("main");
  const [basicExpanded, setBasicExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [basicErrors, setBasicErrors] = useState<BasicFormErrors>({});
  const [advocateErrors, setAdvocateErrors] = useState<AdvocateFormErrors>({});
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

  // Veteran form state
  const [veteranForm, setVeteranForm] = useState<VeteranFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zipCode: "",
    branch: "",
    serviceEra: "",
    payGrade: "",
    dischargeStatus: "",
    benefitsBarrier: "",
    vaClaimStatus: "",
    shareStory: false,
    storyBrief: "",
    contactForLegal: false,
    alsoAffiliate: true,
    alsoAdvocate: false,
  });

  const [veteranErrors, setVeteranErrors] = useState<Record<string, string>>({});

  const clearVeteranError = (field: string) => {
    setVeteranErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

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

  const validateBasicForm = (): boolean => {
    const errors: BasicFormErrors = {};

    if (!basicForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!basicForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!basicForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicForm.email)) {
      errors.email = 'Please enter a valid email';
    }

    setBasicErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearBasicError = (field: keyof BasicFormErrors) => {
    if (basicErrors[field]) {
      setBasicErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateBasicForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitToActionNetwork({
        firstName: basicForm.firstName,
        lastName: basicForm.lastName,
        email: basicForm.email,
        zipCode: basicForm.zipCode,
        signupAs: basicForm.memberType || 'affiliate',
      });

      handleViewChange("success");
      setBasicErrors({});
    } catch (error) {
      console.error('Action Network submission failed:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAdvocateForm = (): boolean => {
    const errors: AdvocateFormErrors = {};

    if (!advocateForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!advocateForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!advocateForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(advocateForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!advocateForm.zipCode.trim()) {
      errors.zipCode = 'Zip code is required';
    }

    // Military-specific validation
    const isMilitary = ["veteran", "active", "reservist", "guard"].includes(advocateForm.signUpAs);
    if (isMilitary) {
      if (!advocateForm.branch) {
        errors.branch = 'Branch is required';
      }
      if (!advocateForm.serviceEra) {
        errors.serviceEra = 'Service era is required';
      }
    }

    setAdvocateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearAdvocateError = (field: keyof AdvocateFormErrors) => {
    if (advocateErrors[field]) {
      setAdvocateErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAdvocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAdvocateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map form data to Action Network format
      const experiences: string[] = [];
      if (advocateForm.experiences.financial) experiences.push('Financial hardship');
      if (advocateForm.experiences.housing) experiences.push('Housing insecurity');
      if (advocateForm.experiences.food) experiences.push('Food insecurity');
      if (advocateForm.experiences.unemployment) experiences.push('Unemployment');
      if (advocateForm.experiences.mentalHealth) experiences.push('Mental health challenges');
      if (advocateForm.experiences.addiction) experiences.push('Addiction');
      if (advocateForm.experiences.probation) experiences.push('Probation');
      if (advocateForm.experiences.incarceration) experiences.push('Incarceration');

      const storyTypes: string[] = [];
      if (advocateForm.storyInterests.injustice) storyTypes.push('Injustice');
      if (advocateForm.storyInterests.heroism) storyTypes.push('Heroism');
      if (advocateForm.storyInterests.inaccessibility) storyTypes.push('Inaccessibility');
      if (advocateForm.storyInterests.achievement) storyTypes.push('Achievement');
      if (advocateForm.storyInterests.other) storyTypes.push('Other');

      await submitToActionNetwork({
        firstName: advocateForm.firstName,
        lastName: advocateForm.lastName,
        email: advocateForm.email,
        address: advocateForm.address,
        zipCode: advocateForm.zipCode,
        phone: advocateForm.phone,
        titleAffiliation: advocateForm.title,
        linkedin: advocateForm.linkedin,
        signupAs: advocateForm.signUpAs,
        race: advocateForm.race,
        gender: advocateForm.gender,
        currentEmployment: advocateForm.employment,
        branch: advocateForm.branch,
        serviceEra: advocateForm.serviceEra,
        payGrade: advocateForm.payGrade,
        dischargeStatus: advocateForm.dischargeStatus,
        barriers: advocateForm.benefitsBarrier,
        experiences,
        storyTypes,
        interestStatement: advocateForm.interest,
      });

      handleViewChange("success");
    } catch (error) {
      console.error('Action Network submission failed:', error);
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Veteran form validation
  const validateVeteranForm = () => {
    const errors: Record<string, string> = {};
    if (!veteranForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!veteranForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!veteranForm.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(veteranForm.email)) errors.email = 'Please enter a valid email';
    if (!veteranForm.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    if (!veteranForm.branch) errors.branch = 'Branch is required';
    if (!veteranForm.serviceEra) errors.serviceEra = 'Service era is required';

    setVeteranErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Veteran form submission
  const handleVeteranSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateVeteranForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitToActionNetwork({
        firstName: veteranForm.firstName,
        lastName: veteranForm.lastName,
        email: veteranForm.email,
        phone: veteranForm.phone,
        zipCode: veteranForm.zipCode,
        branch: veteranForm.branch,
        serviceEra: veteranForm.serviceEra,
        payGrade: veteranForm.payGrade,
        dischargeStatus: veteranForm.dischargeStatus,
        barriers: veteranForm.benefitsBarrier,
        vaClaimStatus: veteranForm.vaClaimStatus,
        shareStory: veteranForm.shareStory ? 'Yes' : 'No',
        storyBrief: veteranForm.storyBrief,
        contactForLegal: veteranForm.contactForLegal ? 'Yes' : 'No',
        membershipType: 'Veteran' + (veteranForm.alsoAdvocate ? ', Advocate' : '') + (veteranForm.alsoAffiliate ? ', Affiliate' : ''),
      });

      handleViewChange("success");
    } catch (error) {
      console.error('Action Network submission failed:', error);
      setSubmitError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // VA claim status options
  const vaClaimStatusOptions = [
    { value: "never-filed", label: "Never filed a claim" },
    { value: "pending", label: "Claim pending" },
    { value: "denied", label: "Claim denied" },
    { value: "approved", label: "Claim approved" },
    { value: "appealing", label: "Currently appealing" },
  ];

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
              className="relative h-screen min-h-[600px] max-h-[1200px] flex items-end overflow-hidden bg-black"
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
                  className="font-gunterz font-bold text-white uppercase"
                  style={{ fontSize: 'clamp(2rem, 1.5rem + 4vw, 3.75rem)' }}
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
                      BVP is building the first comprehensive movement for reparative justice for Black veterans and military families. This work only moves when the people most affected, and those who stand with them, are organized.
                    </p>
                    <p className="text-[17px] leading-relaxed text-gray-700">
                      Our membership corps is the foundation of our work: a growing body of veterans, families, advocates, allies, artists, scholars, and content-creators whose voices we carry into Congress, into the courts, and into public memory.
                    </p>
                    <p className="text-[17px] leading-relaxed text-gray-700">
                      When you join BVP, you become <strong>a steward of repair</strong>: someone who helps safeguard the truth, advance accountability, and ensure Black history cannot be erased or ignored.
                    </p>
                    <p className="text-[17px] leading-relaxed text-gray-700">
                      Together, we're building the case, telling the story, and organizing to make repair, equity, and democracy real.
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

                  {/* Veteran Card */}
                  <MembershipCard
                    id="veteran-card"
                    title="Veteran"
                    description="As a Veteran member, your experiences with the VA, your service, and your voice are central to building the case for repair."
                    linkText="Register as a Veteran"
                    onClick={() => handleViewChange("veteran")}
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
                      noValidate
                      className="flex flex-col gap-5"
                      aria-label="Basic membership form"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label
                            htmlFor="basic-firstName"
                            className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                          >
                            First Name *
                          </label>
                          <input
                            ref={firstInputRef}
                            type="text"
                            id="basic-firstName"
                            placeholder="First name"
                            value={basicForm.firstName}
                            onChange={(e) => {
                              setBasicForm((f) => ({
                                ...f,
                                firstName: e.target.value,
                              }));
                              clearBasicError('firstName');
                            }}
                            autoComplete="given-name"
                            aria-invalid={!!basicErrors.firstName}
                            aria-describedby={basicErrors.firstName ? "basic-firstName-error" : undefined}
                            className={`w-full bg-white border text-black font-body text-base px-3.5 py-3 min-h-[44px] transition-colors focus:outline-none placeholder:text-gray-400 ${
                              basicErrors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-black"
                            }`}
                          />
                          {basicErrors.firstName && (
                            <p id="basic-firstName-error" className="text-red-500 text-xs mt-1">{basicErrors.firstName}</p>
                          )}
                        </div>
                        <InputField
                          id="basic-lastName"
                          label="Last Name"
                          placeholder="Last name"
                          value={basicForm.lastName}
                          onChange={(v) => {
                            setBasicForm((f) => ({ ...f, lastName: v }));
                            clearBasicError('lastName');
                          }}
                          required
                          autoComplete="family-name"
                          error={basicErrors.lastName}
                        />
                      </div>

                      <InputField
                        id="basic-email"
                        label="Email"
                        type="email"
                        placeholder="your@email.com"
                        value={basicForm.email}
                        onChange={(v) => {
                          setBasicForm((f) => ({ ...f, email: v }));
                          clearBasicError('email');
                        }}
                        required
                        autoComplete="email"
                        error={basicErrors.email}
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

                      {submitError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                          {submitError}
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        variant="secondary"
                        fullWidth
                      >
                        {isSubmitting ? 'Submitting...' : 'Join BVP →'}
                      </Button>

                      <p className="text-[13px] text-gray-400 text-center">
                        We'll never share your information.
                      </p>
                    </form>
                  </MembershipCard>

                  {/* Advocate Card */}
                  <MembershipCard
                    id="advocate-card"
                    title="Advocate"
                    description="As a full advocate, you're part of the community organizing corps — we train you to help us lead petition drives, call campaigns, town halls, and rapid-response moments. We'll plan assignments based on your location, service background, and interests. When we mobilize, you're in the room. When we need voices in a specific district, you'll hear from us directly. This is where membership becomes action."
                    linkText="Become an Advocate"
                    onClick={() => handleViewChange("advocate")}
                  />

                  <p className="text-sm text-gray-400 leading-relaxed">
                    Not sure? Start as an Affiliate. Veterans can join any category — the Veteran path simply streamlines your registration and connects you more directly to potential resources and storytelling opportunities.
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
                noValidate
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
                    onChange={(v) => {
                      setAdvocateForm((f) => ({ ...f, firstName: v }));
                      clearAdvocateError('firstName');
                    }}
                    required
                    autoComplete="given-name"
                    error={advocateErrors.firstName}
                  />
                  <InputField
                    id="adv-lastName"
                    label="Last Name"
                    placeholder="Last name"
                    value={advocateForm.lastName}
                    onChange={(v) => {
                      setAdvocateForm((f) => ({ ...f, lastName: v }));
                      clearAdvocateError('lastName');
                    }}
                    required
                    autoComplete="family-name"
                    error={advocateErrors.lastName}
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
                    onChange={(v) => {
                      setAdvocateForm((f) => ({ ...f, zipCode: v }));
                      clearAdvocateError('zipCode');
                    }}
                    required
                    autoComplete="postal-code"
                    error={advocateErrors.zipCode}
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
                  onChange={(v) => {
                    setAdvocateForm((f) => ({ ...f, email: v }));
                    clearAdvocateError('email');
                  }}
                  required
                  autoComplete="email"
                  error={advocateErrors.email}
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

                {/* Military-specific sections - only show for veterans/active duty/reservist/guard */}
                {(advocateForm.signUpAs === "veteran" ||
                  advocateForm.signUpAs === "active" ||
                  advocateForm.signUpAs === "reservist" ||
                  advocateForm.signUpAs === "guard") && (
                  <>
                    <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                    {/* Military Connected */}
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                      Military Service
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        id="adv-branch"
                        label="Branch"
                        value={advocateForm.branch}
                        onChange={(v) => {
                          setAdvocateForm((f) => ({ ...f, branch: v as Branch }));
                          clearAdvocateError('branch');
                        }}
                        options={branchOptions}
                        required
                        error={advocateErrors.branch}
                      />
                      <SelectField
                        id="adv-serviceEra"
                        label="Service Era"
                        value={advocateForm.serviceEra}
                        onChange={(v) => {
                          setAdvocateForm((f) => ({
                            ...f,
                            serviceEra: v as ServiceEra,
                          }));
                          clearAdvocateError('serviceEra');
                        }}
                        options={serviceEraOptions}
                        required
                        error={advocateErrors.serviceEra}
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

                    {/* Veteran Experiences */}
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
                  </>
                )}

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

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="secondary"
                  fullWidth
                  className="mt-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Join as Advocate →'}
                </Button>
              </form>
            </section>
          </motion.div>
        )}

        {/* ============================================
            VIEW: VETERAN FORM
            ============================================ */}
        {currentView === "veteran" && (
          <motion.div
            key="veteran"
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
                  Register as a Veteran
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
                Your service matters. Your story matters. As a Veteran member, you're central to BVP's mission —
                your experiences help us build the case for repair, shape our Narrative Hub, and inform our legal strategy.
              </p>

              <form
                onSubmit={handleVeteranSubmit}
                noValidate
                className="flex flex-col gap-5"
                aria-label="Veteran membership form"
              >
                {/* Contact Information */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Contact Information
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="vet-firstName"
                    label="First Name"
                    placeholder="First name"
                    value={veteranForm.firstName}
                    onChange={(v) => {
                      setVeteranForm((f) => ({ ...f, firstName: v }));
                      clearVeteranError('firstName');
                    }}
                    required
                    autoComplete="given-name"
                    error={veteranErrors.firstName}
                  />
                  <InputField
                    id="vet-lastName"
                    label="Last Name"
                    placeholder="Last name"
                    value={veteranForm.lastName}
                    onChange={(v) => {
                      setVeteranForm((f) => ({ ...f, lastName: v }));
                      clearVeteranError('lastName');
                    }}
                    required
                    autoComplete="family-name"
                    error={veteranErrors.lastName}
                  />
                </div>

                <InputField
                  id="vet-email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={veteranForm.email}
                  onChange={(v) => {
                    setVeteranForm((f) => ({ ...f, email: v }));
                    clearVeteranError('email');
                  }}
                  required
                  autoComplete="email"
                  error={veteranErrors.email}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="vet-phone"
                    label="Phone"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={veteranForm.phone}
                    onChange={(v) => setVeteranForm((f) => ({ ...f, phone: v }))}
                    autoComplete="tel"
                  />
                  <InputField
                    id="vet-zipCode"
                    label="ZIP Code"
                    placeholder="12345"
                    value={veteranForm.zipCode}
                    onChange={(v) => {
                      setVeteranForm((f) => ({ ...f, zipCode: v }));
                      clearVeteranError('zipCode');
                    }}
                    required
                    autoComplete="postal-code"
                    error={veteranErrors.zipCode}
                  />
                </div>

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Military Service */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Military Service
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    id="vet-branch"
                    label="Branch"
                    value={veteranForm.branch}
                    onChange={(v) => {
                      setVeteranForm((f) => ({ ...f, branch: v as Branch }));
                      clearVeteranError('branch');
                    }}
                    options={branchOptions}
                    required
                    error={veteranErrors.branch}
                  />
                  <SelectField
                    id="vet-serviceEra"
                    label="Service Era"
                    value={veteranForm.serviceEra}
                    onChange={(v) => {
                      setVeteranForm((f) => ({ ...f, serviceEra: v as ServiceEra }));
                      clearVeteranError('serviceEra');
                    }}
                    options={serviceEraOptions}
                    required
                    error={veteranErrors.serviceEra}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="vet-payGrade"
                    label="Pay Grade at Separation"
                    placeholder="e.g., E-5, O-3"
                    value={veteranForm.payGrade}
                    onChange={(v) => setVeteranForm((f) => ({ ...f, payGrade: v }))}
                  />
                  <SelectField
                    id="vet-dischargeStatus"
                    label="Discharge Status"
                    value={veteranForm.dischargeStatus}
                    onChange={(v) => setVeteranForm((f) => ({ ...f, dischargeStatus: v as DischargeStatus }))}
                    options={dischargeStatusOptions}
                  />
                </div>

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* VA Experience */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  VA Benefits Experience
                </p>

                <SelectField
                  id="vet-benefitsBarrier"
                  label="Barriers to Accessing Veterans Benefits"
                  value={veteranForm.benefitsBarrier}
                  onChange={(v) => setVeteranForm((f) => ({ ...f, benefitsBarrier: v as BenefitsBarrier }))}
                  options={benefitsBarrierOptions}
                />

                <SelectField
                  id="vet-vaClaimStatus"
                  label="VA Claim Status"
                  value={veteranForm.vaClaimStatus}
                  onChange={(v) => setVeteranForm((f) => ({ ...f, vaClaimStatus: v as VeteranFormData['vaClaimStatus'] }))}
                  options={vaClaimStatusOptions}
                />

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Story & Legal */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Share Your Story
                </p>

                <CheckboxField
                  id="vet-shareStory"
                  label="I'm interested in sharing my story for BVP's Narrative Hub"
                  checked={veteranForm.shareStory}
                  onChange={(v) => setVeteranForm((f) => ({ ...f, shareStory: v }))}
                />

                {veteranForm.shareStory && (
                  <div className="flex flex-col">
                    <label
                      htmlFor="vet-storyBrief"
                      className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5"
                    >
                      Brief description of your story (optional)
                    </label>
                    <textarea
                      id="vet-storyBrief"
                      placeholder="Tell us briefly about your experience..."
                      value={veteranForm.storyBrief}
                      onChange={(e) => setVeteranForm((f) => ({ ...f, storyBrief: e.target.value }))}
                      className="w-full bg-white border border-gray-300 text-black font-body text-base px-3.5 py-3 min-h-[100px] transition-colors focus:outline-none focus:border-black placeholder:text-gray-400 resize-y"
                    />
                  </div>
                )}

                <CheckboxField
                  id="vet-contactForLegal"
                  label="I'd like to be contacted about potential legal resources or the Monk v. United States case"
                  checked={veteranForm.contactForLegal}
                  onChange={(v) => setVeteranForm((f) => ({ ...f, contactForLegal: v }))}
                />

                <div className="h-px bg-gray-200 my-2" aria-hidden="true" />

                {/* Additional Membership */}
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                  Additional Membership Options
                </p>
                <p className="text-sm text-gray-500 -mt-2">
                  You can also participate as an Affiliate or Advocate alongside your Veteran membership.
                </p>

                <CheckboxField
                  id="vet-alsoAffiliate"
                  label="Also sign me up as an Affiliate (receive updates on the fight)"
                  checked={veteranForm.alsoAffiliate}
                  onChange={(v) => setVeteranForm((f) => ({ ...f, alsoAffiliate: v }))}
                />

                <CheckboxField
                  id="vet-alsoAdvocate"
                  label="I'm also interested in becoming an Advocate (active organizing)"
                  checked={veteranForm.alsoAdvocate}
                  onChange={(v) => setVeteranForm((f) => ({ ...f, alsoAdvocate: v }))}
                />

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="secondary"
                  fullWidth
                  className="mt-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Join as Veteran →'}
                </Button>
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
