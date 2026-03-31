import Link from "next/link";

// ============================================
// TYPES
// ============================================
interface DocumentItem {
  title: string;
  size: string;
  href: string;
}

// ============================================
// DOCUMENT LINK COMPONENT
// ============================================
function DocumentLink({ title, size, href }: DocumentItem) {
  return (
    <a
      href={href}
      className="block p-6 border border-gray-200 hover:border-black transition-colors group focus-visible:ring-2 focus-visible:ring-bvp-gold focus-visible:ring-offset-2"
      download
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-lg group-hover:text-bvp-navy transition-colors">
            {title}
          </p>
          <p className="text-gray-500 text-sm">{size}</p>
        </div>
        <span className="text-gray-400 group-hover:text-black transition-colors text-xl">
          ↓
        </span>
      </div>
    </a>
  );
}

// ============================================
// MAIN FINANCIALS PAGE
// ============================================
export default function FinancialsPage() {
  const form990s: DocumentItem[] = [
    { title: "2024 Form 990", size: "PDF • 263 KB", href: "/documents/2024-990-BVP.pdf" },
    { title: "2023 Form 990", size: "PDF • 250 KB", href: "/documents/2023-990-BVP.pdf" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div style={{ padding: 'clamp(6rem, 10vw, 6rem) clamp(1rem, 4vw, 5.75rem) clamp(2rem, 5vw, 4rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
              Transparency
            </p>
            <h1
              className="font-gunterz font-bold leading-tight"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
            >
              Financials & 990
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 5.75rem)' }}>
        <div className="max-w-[900px]">
          <p className="text-xl leading-relaxed mb-12 text-gray-700">
            Black Veterans Project is committed to transparency and
            accountability. Below you'll find our IRS Form 990 filings.
          </p>

          {/* Form 990s */}
          <h2 className="font-gunterz font-bold text-2xl mb-6">IRS Form 990</h2>
          <div className="space-y-4 mb-12">
            {form990s.map((doc) => (
              <DocumentLink key={doc.title} {...doc} />
            ))}
          </div>

          {/* Tax-Exempt Status */}
          <h2 className="font-gunterz font-bold text-2xl mb-6">
            Tax-Exempt Status
          </h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              Black Veterans Project is a 501(c)(3) nonprofit organization.
              Donations are tax-deductible to the fullest extent allowed by law.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>EIN:</strong> 83-4476025
            </p>
          </div>

          {/* Questions CTA */}
          <div className="mt-12 p-6 bg-gray-100 border-l-4 border-bvp-gold">
            <p className="text-gray-700 mb-4">
              Have questions about our financials or operations?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-bold text-black hover:text-bvp-navy transition-colors"
            >
              Contact Us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
