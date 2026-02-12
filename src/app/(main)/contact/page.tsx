"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

// ============================================
// TYPES
// ============================================
type ContactTopic = "" | "press" | "partnership" | "speaking" | "general" | "other";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  topic: ContactTopic;
  message: string;
  // Honeypot field - should always be empty (bots fill it, humans don't see it)
  website: string;
}

// ============================================
// SOCIAL LINK COMPONENT
// ============================================
interface SocialLinkProps {
  platform: string;
  handle: string;
  href: string;
}

function SocialLink({ platform, handle, href }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-between items-center group"
    >
      <span className="text-sm font-bold uppercase tracking-wide group-hover:text-bvp-gold transition-colors">
        {platform}
      </span>
      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
        {handle}
      </span>
    </a>
  );
}

// ============================================
// MAIN CONTACT PAGE
// ============================================
export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    message: "",
    website: "", // Honeypot - must stay empty
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topicOptions: { value: ContactTopic; label: string }[] = [
    { value: "", label: "Select a topic" },
    { value: "press", label: "Press Inquiry" },
    { value: "partnership", label: "Partnership Opportunity" },
    { value: "speaking", label: "Speaking Request" },
    { value: "general", label: "General Question" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently reject (bot detected)
    if (formData.website) {
      // Fake success to fool bots
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitting(false);
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    // TODO: Connect to Action Network
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-24 bg-white border-b border-gray-200">
          <div className="py-12 md:py-16 px-6 md:px-24">
            <div className="max-w-[1400px] mx-auto">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Message Sent
              </p>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 font-display">
                Thank You
              </h1>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 md:px-24">
          <div className="max-w-xl">
            <div className="mb-6">
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
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We've received your message and will get back to you as soon as
              possible. For urgent matters, please email us directly at{" "}
              <a
                href="mailto:info@blackveteransproject.org"
                className="font-semibold text-black underline underline-offset-2 hover:text-bvp-navy"
              >
                info@blackveteransproject.org
              </a>
              .
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[15px] font-bold text-black hover:text-bvp-navy transition-colors"
            >
              Return to Homepage
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-24 bg-white border-b border-gray-200">
        <div className="py-12 md:py-16 px-6 md:px-24">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Get in touch
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 font-display">
              Contact Us
            </h1>
            <p className="text-lg text-gray-500">
              For press inquiries, partnerships, speaking requests, or general
              questions.
            </p>
          </div>
        </div>
      </section>

      {/* Content - Two Column Layout */}
      <section>
        <div className="grid md:grid-cols-2">
          {/* Form Panel - First on mobile, Right on desktop */}
          <div className="bg-gray-100 p-8 md:p-12 lg:p-16 order-1 md:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
              Send a Message
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from humans, bots will fill it */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, website: e.target.value }))
                  }
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label
                    htmlFor="contact-firstName"
                    className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="contact-firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, firstName: e.target.value }))
                    }
                    autoComplete="given-name"
                    className="w-full py-3 bg-transparent border-b border-gray-300 text-base transition-colors focus:border-black focus:outline-none"
                    placeholder="First"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-lastName"
                    className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="contact-lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, lastName: e.target.value }))
                    }
                    autoComplete="family-name"
                    className="w-full py-3 bg-transparent border-b border-gray-300 text-base transition-colors focus:border-black focus:outline-none"
                    placeholder="Last"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="contact-email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  autoComplete="email"
                  className="w-full py-3 bg-transparent border-b border-gray-300 text-base transition-colors focus:border-black focus:outline-none"
                  placeholder="you@email.com"
                />
              </div>

              {/* Topic */}
              <div>
                <label
                  htmlFor="contact-topic"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3"
                >
                  I'm reaching out about
                </label>
                <select
                  id="contact-topic"
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      topic: e.target.value as ContactTopic,
                    }))
                  }
                  className="w-full py-3 bg-transparent border-b border-gray-300 text-base transition-colors focus:border-black focus:outline-none"
                >
                  {topicOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, message: e.target.value }))
                  }
                  className="w-full py-3 bg-transparent border-b border-gray-300 text-base transition-colors focus:border-black focus:outline-none resize-y"
                  placeholder="Write a message"
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || !formData.email}
                >
                  {isSubmitting ? "Sending..." : "Submit →"}
                </Button>
              </div>
            </form>
          </div>

          {/* Dark Panel - Second on mobile, Left on desktop */}
          <div
            className="text-white p-8 md:p-12 lg:p-16 flex flex-col order-2 md:order-1"
            style={{
              background: "linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 100%)",
            }}
          >
            {/* Email Icon */}
            <div className="mb-8">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Main Text */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
                For press, partnerships, and general inquiries:
              </h2>
              <a
                href="mailto:info@blackveteransproject.org"
                className="text-lg md:text-xl font-bold underline hover:no-underline hover:text-bvp-gold transition-colors"
              >
                info@blackveteransproject.org
              </a>
              <p className="text-sm text-gray-400 mt-3">
                or send a message via the form above ↑
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 my-8" aria-hidden="true" />

            {/* Follow Section */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                Follow
              </p>
              <div className="space-y-3">
                <SocialLink
                  platform="Instagram"
                  handle="@blackvetsproject"
                  href="https://instagram.com/blackvetsproject"
                />
                <SocialLink
                  platform="Twitter / X"
                  handle="@blackvetsproject"
                  href="https://twitter.com/blackvetsproject"
                />
                <SocialLink
                  platform="LinkedIn"
                  handle="Black Veterans Project"
                  href="https://linkedin.com/company/blackveteransproject"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
