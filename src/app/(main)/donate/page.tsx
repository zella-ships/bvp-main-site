"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// TYPES
// ============================================
type Frequency = "one-time" | "monthly";
type PaymentMethod = "credit-card" | "bank" | "paypal" | "wallet";

interface DonationFormData {
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
}

// ============================================
// AMOUNT BUTTON COMPONENT
// ============================================
interface AmountButtonProps {
  amount: number;
  selected: boolean;
  onClick: () => void;
}

function AmountButton({ amount, selected, onClick }: AmountButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-lg font-medium transition-all focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2 ${
        selected
          ? "border-2 border-black bg-gray-100"
          : "border border-gray-300 hover:border-black"
      }`}
      aria-pressed={selected}
    >
      ${amount}
    </button>
  );
}

// ============================================
// TOGGLE SWITCH COMPONENT
// ============================================
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  id: string;
}

function ToggleSwitch({ enabled, onChange, id }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-[22px] rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2 ${
        enabled ? "bg-bvp-green" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-[3px] w-4 h-4 bg-white rounded-full transition-transform ${
          enabled ? "left-[29px]" : "left-[3px]"
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

// ============================================
// RADIO BUTTON COMPONENT
// ============================================
interface RadioButtonProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  name: string;
  id: string;
}

function RadioButton({ label, checked, onChange, name, id }: RadioButtonProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
      <span className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <span
          className={`block w-5 h-5 rounded-full border-2 transition-colors ${
            checked ? "border-black bg-black" : "border-gray-300"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-bvp-gold peer-focus-visible:ring-offset-2`}
          aria-hidden="true"
        >
          {checked && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
          )}
        </span>
      </span>
      <span className={`text-[17px] ${checked ? "text-black" : "text-gray-600"}`}>
        {label}
      </span>
    </label>
  );
}

// ============================================
// PAYMENT METHOD ACCORDION
// ============================================
interface PaymentAccordionProps {
  method: PaymentMethod;
  label: string;
  selected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
}

function PaymentAccordion({
  method,
  label,
  selected,
  onSelect,
  children,
}: PaymentAccordionProps) {
  return (
    <div
      className={`border transition-colors ${
        selected ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-gray-50"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`w-full p-4 text-left font-medium transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-bvp-gold ${
          selected ? "bg-gray-100" : ""
        }`}
        aria-expanded={selected}
        aria-controls={`payment-${method}-content`}
      >
        <span className="flex items-center justify-between">
          <span>{label}</span>
          {selected && (
            <svg
              className="w-4 h-4 text-bvp-green"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="8" fill="currentColor" />
              <path
                d="M5 8L7 10L11 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>
      <AnimatePresence>
        {selected && children && (
          <motion.div
            id={`payment-${method}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN DONATE PAGE
// ============================================
export default function DonatePage() {
  // Donation amount state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  // Options state
  const [roundUp, setRoundUp] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit-card");

  // Form state
  const [formData, setFormData] = useState<DonationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    cardNumber: "",
  });

  // Calculate actual donation amount
  const donationAmount = useMemo(() => {
    if (showCustom && customAmount) {
      return parseFloat(customAmount) || 0;
    }
    return selectedAmount || 0;
  }, [selectedAmount, customAmount, showCustom]);

  // Calculate processing fee (2.89%)
  const processingFee = useMemo(() => {
    return Math.round(donationAmount * 0.0289 * 100) / 100;
  }, [donationAmount]);

  // Calculate total with round up
  const totalAmount = useMemo(() => {
    return roundUp ? donationAmount + processingFee : donationAmount;
  }, [donationAmount, processingFee, roundUp]);

  const presetAmounts = [25, 50, 100, 250, 500];

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setShowCustom(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const cleaned = value.replace(/[^0-9.]/g, "");
    setCustomAmount(cleaned);
    setSelectedAmount(null);
    setShowCustom(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, integrate with payment processor
    console.log("Processing donation:", {
      amount: totalAmount,
      frequency,
      paymentMethod,
      ...formData,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div style={{ padding: 'clamp(6rem, 10vw, 8rem) clamp(1rem, 4vw, 5.75rem) clamp(2rem, 5vw, 3rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
              Support Our Mission
            </p>
            <h1
              className="font-gunterz font-bold leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
            >
              Help Us Secure the Legacy for Black Veterans
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section>
        <div style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 5.75rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: 'clamp(2rem, 5vw, 4rem)',
              }}
            >
              {/* Left Column: Copy */}
              <div>
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed text-gray-700">
                    Your donation helps Black Veterans Project's mission to
                    advocate for racial inclusion and justice across the United
                    States military while ensuring the welfare of all Black
                    veterans who've served.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    By supporting us, you're helping to drive forward vital work
                    that raises public awareness, addresses systemic inequities,
                    and brings us closer to a future where all who have served
                    are empowered with the resources and opportunities they've
                    long been denied.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Every contribution, no matter the size, strengthens our
                    ability to make lasting change and ensure Black veterans'
                    voices are heard.
                  </p>
                </div>

                {/* Tax deductible note */}
                <div className="mt-8 p-4 bg-gray-50 border-l-4 border-bvp-gold">
                  <p className="text-sm text-gray-600">
                    <strong>Tax Deductible:</strong> Black Veterans Project is a
                    501(c)(3) nonprofit organization. Your donation is
                    tax-deductible to the extent allowed by law.
                  </p>
                </div>
              </div>

              {/* Right Column: Donation Form */}
              <div>
                <form onSubmit={handleSubmit} aria-label="Donation form">
                  {/* Amount Selection */}
                  <fieldset className="mb-6">
                    <legend className="text-sm font-medium text-gray-600 mb-3">
                      Choose a Donation Amount
                    </legend>
                    <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
                      {presetAmounts.map((amount) => (
                        <AmountButton
                          key={amount}
                          amount={amount}
                          selected={selectedAmount === amount && !showCustom}
                          onClick={() => handlePresetClick(amount)}
                        />
                      ))}
                    </div>

                    {/* Custom Amount Input */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Or enter custom:
                      </span>
                      <div className="relative flex-1 max-w-[200px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          $
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="Other amount"
                          value={customAmount}
                          onChange={(e) =>
                            handleCustomAmountChange(e.target.value)
                          }
                          className={`w-full pl-7 pr-3 py-3 border text-base min-h-[44px] transition-colors focus:outline-none ${
                            showCustom
                              ? "border-black"
                              : "border-gray-300 focus:border-black"
                          }`}
                          aria-label="Custom donation amount"
                        />
                      </div>
                    </div>
                  </fieldset>

                  {/* Amount Display */}
                  <div className="border border-gray-300 p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        ${totalAmount.toFixed(2)}
                      </span>
                      <span className="text-gray-500">
                        /{frequency === "one-time" ? "One time" : "Monthly"}{" "}
                        donation
                      </span>
                    </div>
                    <span className="text-gray-500">USD</span>
                  </div>

                  {/* Round Up Toggle */}
                  {donationAmount > 0 && (
                    <div className="flex items-center gap-3 mb-6">
                      <ToggleSwitch
                        id="round-up-toggle"
                        enabled={roundUp}
                        onChange={setRoundUp}
                      />
                      <label
                        htmlFor="round-up-toggle"
                        className="text-[17px] text-gray-600 cursor-pointer"
                      >
                        Round up my donation to ${(donationAmount + processingFee).toFixed(2)} so the
                        processing fees are covered.
                      </label>
                    </div>
                  )}

                  {/* Frequency */}
                  <fieldset className="mb-6">
                    <legend className="text-sm font-medium text-gray-600 mb-3">
                      Frequency
                    </legend>
                    <div className="flex flex-wrap gap-6">
                      <RadioButton
                        id="freq-one-time"
                        name="frequency"
                        label="One time donation"
                        checked={frequency === "one-time"}
                        onChange={() => setFrequency("one-time")}
                      />
                      <RadioButton
                        id="freq-monthly"
                        name="frequency"
                        label="Monthly recurring donation"
                        checked={frequency === "monthly"}
                        onChange={() => setFrequency("monthly")}
                      />
                    </div>
                  </fieldset>

                  {/* Payment Method */}
                  <fieldset className="mb-6">
                    <legend className="text-sm font-medium text-gray-600 mb-3">
                      Payment Method
                    </legend>
                    <div className="space-y-2">
                      <PaymentAccordion
                        method="credit-card"
                        label="Pay by Credit Card"
                        selected={paymentMethod === "credit-card"}
                        onSelect={() => setPaymentMethod("credit-card")}
                      >
                        <div>
                          <label
                            htmlFor="card-number"
                            className="text-sm text-gray-600 mb-2 block"
                          >
                            Card Number
                          </label>
                          <div className="border border-gray-300 bg-white p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <rect
                                  x="2"
                                  y="4"
                                  width="16"
                                  height="12"
                                  rx="2"
                                  stroke="currentColor"
                                  fill="none"
                                />
                                <rect x="2" y="7" width="16" height="2" />
                              </svg>
                              <input
                                type="text"
                                id="card-number"
                                placeholder="Card number"
                                value={formData.cardNumber}
                                onChange={(e) =>
                                  setFormData((f) => ({
                                    ...f,
                                    cardNumber: e.target.value,
                                  }))
                                }
                                className="flex-1 text-base outline-none placeholder:text-gray-400"
                                aria-label="Credit card number"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M8 1a4 4 0 00-4 4v2H3a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V5a4 4 0 00-4-4zm2 6V5a2 2 0 10-4 0v2h4z" />
                            </svg>
                            <span>SSL encrypted and secure</span>
                          </div>
                        </div>
                      </PaymentAccordion>

                      <PaymentAccordion
                        method="bank"
                        label="Pay by Bank Account"
                        selected={paymentMethod === "bank"}
                        onSelect={() => setPaymentMethod("bank")}
                      >
                        <p className="text-sm text-gray-600">
                          Connect your bank account for direct ACH transfer.
                          Lower processing fees for larger donations.
                        </p>
                      </PaymentAccordion>

                      <PaymentAccordion
                        method="paypal"
                        label="Pay by PayPal"
                        selected={paymentMethod === "paypal"}
                        onSelect={() => setPaymentMethod("paypal")}
                      >
                        <p className="text-sm text-gray-600">
                          You'll be redirected to PayPal to complete your
                          donation securely.
                        </p>
                      </PaymentAccordion>

                      <PaymentAccordion
                        method="wallet"
                        label="Pay by Mobile Wallet"
                        selected={paymentMethod === "wallet"}
                        onSelect={() => setPaymentMethod("wallet")}
                      >
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-[17px] font-medium hover:border-black transition-colors min-h-[44px]"
                          >
                            Apple Pay
                          </button>
                          <button
                            type="button"
                            className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-[17px] font-medium hover:border-black transition-colors min-h-[44px]"
                          >
                            Google Pay
                          </button>
                        </div>
                      </PaymentAccordion>
                    </div>
                  </fieldset>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        htmlFor="donor-firstName"
                        className="text-sm font-medium text-gray-600 mb-2 block"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="donor-firstName"
                        placeholder="First"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            firstName: e.target.value,
                          }))
                        }
                        required
                        autoComplete="given-name"
                        className="w-full border border-gray-300 p-3 text-base min-h-[44px] transition-colors focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="donor-lastName"
                        className="text-sm font-medium text-gray-600 mb-2 block"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="donor-lastName"
                        placeholder="Last"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((f) => ({
                            ...f,
                            lastName: e.target.value,
                          }))
                        }
                        required
                        autoComplete="family-name"
                        className="w-full border border-gray-300 p-3 text-base min-h-[44px] transition-colors focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Email (for receipt) */}
                  <div className="mb-6">
                    <label
                      htmlFor="donor-email"
                      className="text-sm font-medium text-gray-600 mb-2 block"
                    >
                      Email (for receipt)
                    </label>
                    <input
                      type="email"
                      id="donor-email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          email: e.target.value,
                        }))
                      }
                      required
                      autoComplete="email"
                      className="w-full border border-gray-300 p-3 text-base min-h-[44px] transition-colors focus:border-black focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={donationAmount <= 0}
                    className="w-full py-4 px-8 font-ontika font-medium text-lg tracking-wide rounded-full border-4 border-bvp-gold bg-bvp-gold text-black transition-all duration-300 hover:bg-white active:scale-95 focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {frequency === "monthly" ? "Start Monthly Donation" : "Donate"}{" "}
                    ${totalAmount.toFixed(2)} →
                  </button>

                  {/* Security Note */}
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Your payment information is processed securely. We never
                    store your credit card details.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
