"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ============================================
// TYPES
// ============================================
interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

// ============================================
// FAQ DATA
// ============================================
const faqSections: FAQSection[] = [
  {
    title: "About BVP",
    items: [
      {
        question: "What is Black Veterans Project (BVP)?",
        answer: (
          <p>
            Black Veterans Project is the first comprehensive reparative justice effort mobilizing Black veterans and military families. We leverage data-driven research, narrative storytelling, and impact litigation to advance repair and equity.
          </p>
        ),
      },
      {
        question: "Is BVP a nonprofit?",
        answer: (
          <p>
            Yes, BVP is a registered 501(c)(3) nonprofit organization.
          </p>
        ),
      },
      {
        question: "Are donations tax-deductible?",
        answer: (
          <p>
            Yes. All donations to Black Veterans Project are tax-deductible to the extent allowed by law.
          </p>
        ),
      },
      {
        question: "How is BVP governed?",
        answer: (
          <p>
            BVP is governed by an independent Board of Directors. You can learn more about our board members on our{" "}
            <Link href="/about" className="text-black font-semibold underline underline-offset-2 hover:text-bvp-navy">
              About page
            </Link>
            .
          </p>
        ),
      },
      {
        question: "Where can I find BVP's financial information?",
        answer: (
          <p>
            Our 990s are available on our{" "}
            <Link href="/financials" className="text-black font-semibold underline underline-offset-2 hover:text-bvp-navy">
              Financials page
            </Link>
            . We believe in full transparency and make all required nonprofit disclosures publicly accessible.
          </p>
        ),
      },
    ],
  },
  {
    title: "Get Involved",
    items: [
      {
        question: "How do I become a BVP member?",
        answer: (
          <p>
            Visit the{" "}
            <Link href="/join" className="text-black font-semibold underline underline-offset-2 hover:text-bvp-navy">
              Join Us
            </Link>{" "}
            section of our site to sign up as an Affiliate or Advocate. All members receive updates on our work, invitations to events, and opportunities to participate in campaigns. Advocates gain access to training, campaign resources, and opportunities to represent BVP.
          </p>
        ),
      },
      {
        question: "Do I have to identify as Black or be a military veteran to become a member of BVP?",
        answer: (
          <p>
            No. Membership is free and open to all supporters of our mission.
          </p>
        ),
      },
      {
        question: "What are the benefits of BVP membership?",
        answer: (
          <p>
            Members receive regular updates on our litigation, narrative projects, and advocacy efforts. Advocates gain access to training, campaign resources, and opportunities to represent BVP.
          </p>
        ),
      },
      {
        question: "How can I volunteer with BVP?",
        answer: (
          <p>
            We welcome volunteers for a variety of roles, including event support, community outreach, research assistance, and storytelling projects. Sign up as an Advocate member to be notified of volunteer opportunities, or contact us directly with your interests and skills.
          </p>
        ),
      },
      {
        question: "Can my organization partner with BVP?",
        answer: (
          <p>
            We welcome inquiries about partnerships. If interested, please contact us at{" "}
            <a href="mailto:info@blackveteransproject.org" className="text-black font-semibold underline underline-offset-2 hover:text-bvp-navy">
              info@blackveteransproject.org
            </a>
          </p>
        ),
      },
    ],
  },
];

// ============================================
// ACCORDION ITEM COMPONENT
// ============================================
interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  sectionIndex: number;
}

function AccordionItem({ item, isOpen, onToggle, index, sectionIndex }: AccordionItemProps) {
  const id = useId();
  const headerId = `faq-header-${sectionIndex}-${index}-${id}`;
  const panelId = `faq-panel-${sectionIndex}-${index}-${id}`;

  return (
    <div className="border-b border-gray-300">
      <h3>
        <button
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-6 py-6 text-left focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2 group"
        >
          <span className="text-lg md:text-xl font-bold group-hover:text-black transition-colors">
            {item.question}
          </span>
          <span
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isOpen
                ? "bg-black rotate-180 group-hover:bg-[#FDC500] group-hover:text-black group-active:bg-[#FDC500] group-active:text-black"
                : "bg-gray-500 group-hover:bg-black group-active:bg-[#FDC500] group-active:text-black"
            }`}
            aria-hidden="true"
          >
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="2 5 7 10 12 5" />
            </svg>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FAQ SECTION COMPONENT
// ============================================
interface FAQSectionComponentProps {
  section: FAQSection;
  sectionIndex: number;
  openItems: Set<string>;
  onToggle: (key: string) => void;
}

function FAQSectionComponent({
  section,
  sectionIndex,
  openItems,
  onToggle,
}: FAQSectionComponentProps) {
  return (
    <div className="mb-16">
      <h2 className="max-w-[816px] text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 pb-4 border-b-2 border-black">
        {section.title}
      </h2>

      <div className="max-w-[816px]">
        {section.items.map((item, index) => {
          const key = `${sectionIndex}-${index}`;
          return (
            <AccordionItem
              key={key}
              item={item}
              isOpen={openItems.has(key)}
              onToggle={() => onToggle(key)}
              index={index}
              sectionIndex={sectionIndex}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MAIN FAQ PAGE
// ============================================
export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleToggle = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        // Close other items in the same section (optional: remove for multi-open)
        const sectionIndex = key.split("-")[0];
        next.forEach((k) => {
          if (k.startsWith(sectionIndex + "-")) {
            next.delete(k);
          }
        });
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div style={{ padding: 'clamp(6rem, 10vw, 6rem) clamp(1rem, 4vw, 5.75rem) clamp(2rem, 5vw, 3rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
              Frequently Asked Questions
            </p>
            <h1
              className="font-gunterz font-bold text-black leading-tight max-w-4xl"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
            >
              Common questions about BVP and how to get involved.
            </h1>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-gray-100">
        <div style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 5.75rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            {faqSections.map((section, index) => (
              <FAQSectionComponent
                key={section.title}
                section={section}
                sectionIndex={index}
                openItems={openItems}
                onToggle={handleToggle}
              />
            ))}

            {/* Contact CTA */}
            <div className="mt-12">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold bg-black text-white hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2"
              >
                Have More Questions? Contact Us
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
