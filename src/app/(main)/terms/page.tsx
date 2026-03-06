export default function TermsPage() {
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
              className="font-black leading-tight font-display"
              style={{ fontSize: 'clamp(1.75rem, 1rem + 3.5vw, 3rem)' }}
            >
              Terms of Use
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 5.75rem)' }}>
        <article className="max-w-[800px]">
          <p className="text-sm text-gray-500 mb-8">
            Last updated: February 2026
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            Acceptance of Terms
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            By accessing or using the Black Veterans Project website, you agree
            to be bound by these Terms of Use and all applicable laws and
            regulations. If you do not agree with any of these terms, you are
            prohibited from using or accessing this site.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            Use of Website
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Permission is granted to temporarily access the materials on Black
            Veterans Project's website for personal, non-commercial use only.
            This is a grant of license, not a transfer of title. You may not
            modify, copy, distribute, transmit, display, perform, reproduce,
            publish, license, create derivative works from, transfer, or sell
            any information obtained from this website without prior written
            consent.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            Intellectual Property
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            All content on this website, including but not limited to text,
            graphics, logos, images, audio clips, and software, is the property
            of Black Veterans Project or its content suppliers and is protected
            by United States and international copyright laws. The compilation
            of all content on this site is the exclusive property of Black
            Veterans Project.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            User Submissions
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            By submitting content to Black Veterans Project, including stories,
            feedback, or other materials, you grant us a non-exclusive,
            royalty-free, perpetual, and worldwide license to use, modify,
            publish, and distribute such content in connection with our mission.
            You represent that you own or have the necessary rights to submit
            such content.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            Limitation of Liability
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            In no event shall Black Veterans Project or its suppliers be liable
            for any damages arising out of the use or inability to use the
            materials on our website, even if Black Veterans Project has been
            notified of the possibility of such damages. Some jurisdictions do
            not allow limitations on implied warranties or limitations of
            liability, so these limitations may not apply to you.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            External Links
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our website may contain links to third-party websites. Black
            Veterans Project has no control over and assumes no responsibility
            for the content, privacy policies, or practices of any third-party
            sites or services.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            Governing Law
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            These terms and conditions are governed by and construed in
            accordance with the laws of the United States, and you irrevocably
            submit to the exclusive jurisdiction of the courts in that
            jurisdiction.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">
            Changes to Terms
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Black Veterans Project reserves the right to revise these Terms of
            Use at any time without notice. By using this website, you agree to
            be bound by the current version of these terms.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-display">Contact Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            If you have any questions about these Terms of Use, please contact
            us at{" "}
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
