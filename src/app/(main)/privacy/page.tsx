export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div style={{ padding: 'clamp(6rem, 10vw, 6rem) clamp(1rem, 4vw, 5.75rem) clamp(2rem, 5vw, 4rem)' }}>
          <div className="max-w-[1400px] mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
              Legal
            </p>
            <h1
              className="font-black leading-tight font-gunterz"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
            >
              Privacy Policy
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 5.75rem)' }}>
        <article className="max-w-[800px] prose prose-lg prose-gray">
          <p className="text-sm text-gray-500 mb-8">
            Last updated: February 2026
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">Introduction</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Black Veterans Project ("BVP," "we," "us," or "our") is committed to
            protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website or engage with our services. Please read this
            policy carefully to understand our practices regarding your personal
            data.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            Information We Collect
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We may collect information about you in various ways, including:
          </p>
          <ul className="text-lg text-gray-700 leading-relaxed mb-8 list-disc pl-6 space-y-2">
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number,
              mailing address, and other information you voluntarily provide
              when signing up for membership, making donations, or contacting
              us.
            </li>
            <li>
              <strong>Derivative Data:</strong> Information our servers
              automatically collect when you access the website, such as IP
              address, browser type, operating system, access times, and pages
              viewed.
            </li>
            <li>
              <strong>Financial Data:</strong> Payment information when you make
              donations, processed securely through our third-party payment
              processors.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            How We Use Your Information
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="text-lg text-gray-700 leading-relaxed mb-8 list-disc pl-6 space-y-2">
            <li>Process donations and send tax receipts</li>
            <li>
              Communicate with you about our mission, events, and opportunities
            </li>
            <li>Respond to your inquiries and provide support</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">Data Security</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            We use administrative, technical, and physical security measures to
            protect your personal information. While we have taken reasonable
            steps to secure the information you provide, please be aware that no
            security measures are perfect or impenetrable, and we cannot
            guarantee the security of any information transmitted to us.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">Your Rights</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Depending on your location, you may have certain rights regarding
            your personal information, including the right to access, correct,
            or delete your data. To exercise these rights, please contact us
            using the information below.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">Contact Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at{" "}
            <a
              href="mailto:info@blackveteransproject.org"
              className="text-black font-semibold underline underline-offset-2 hover:text-bvp-navy"
            >
              info@blackveteransproject.org
            </a>
            .
          </p>
        </article>
      </section>
    </div>
  );
}
