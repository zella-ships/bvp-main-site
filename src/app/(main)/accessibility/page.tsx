export default function AccessibilityPage() {
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
              Accessibility
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

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            Our Commitment
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Black Veterans Project is committed to ensuring digital
            accessibility for people with disabilities. We are continually
            improving the user experience for everyone and applying the relevant
            accessibility standards. Accessibility is not just a legal
            requirement—it reflects our values of inclusion and equity that are
            central to our mission.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            Conformance Status
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            We aim to conform to the Web Content Accessibility Guidelines (WCAG)
            2.1 Level AA standards. These guidelines help make web content more
            accessible to people with disabilities, including visual, auditory,
            physical, speech, cognitive, language, learning, and neurological
            disabilities.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            Accessibility Features
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our website includes the following accessibility features:
          </p>
          <ul className="text-lg text-gray-700 leading-relaxed mb-8 list-disc pl-6 space-y-2">
            <li>
              <strong>Keyboard Navigation:</strong> All interactive elements are
              accessible via keyboard
            </li>
            <li>
              <strong>Focus Indicators:</strong> Visible focus states on all
              interactive elements
            </li>
            <li>
              <strong>Alt Text:</strong> Descriptive alternative text for images
            </li>
            <li>
              <strong>Semantic HTML:</strong> Proper heading structure and
              landmark regions
            </li>
            <li>
              <strong>Color Contrast:</strong> Text meets WCAG AA contrast
              requirements
            </li>
            <li>
              <strong>Responsive Design:</strong> Content adapts to different
              screen sizes and zoom levels
            </li>
            <li>
              <strong>Form Labels:</strong> All form inputs have associated
              labels
            </li>
            <li>
              <strong>ARIA Attributes:</strong> Enhanced screen reader support
              for dynamic content
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            Assistive Technology
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our website is designed to be compatible with assistive
            technologies, including screen readers, screen magnifiers, and voice
            recognition software. We test with popular assistive technologies
            including NVDA, VoiceOver, and JAWS.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            Known Limitations
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            While we strive for full accessibility, some older content or
            third-party components may have limitations. We are actively working
            to address these issues. If you encounter any accessibility
            barriers, please contact us so we can address them.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">Feedback</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            We welcome your feedback on the accessibility of Black Veterans
            Project's website. Please let us know if you encounter any
            accessibility barriers:
          </p>
          <ul className="text-lg text-gray-700 leading-relaxed mb-8 list-disc pl-6 space-y-2">
            <li>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:info@blackveteransproject.org"
                className="text-black font-semibold underline underline-offset-2 hover:text-bvp-navy"
              >
                info@blackveteransproject.org
              </a>
            </li>
            <li>
              <strong>Subject Line:</strong> "Accessibility Feedback"
            </li>
          </ul>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            We try to respond to accessibility feedback within 5 business days.
          </p>

          <h2 className="text-2xl font-bold mb-4 font-gunterz">
            Third-Party Content
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our website may include embedded content from third parties (such as
            videos or social media feeds). While we encourage our partners to
            prioritize accessibility, we cannot guarantee the accessibility of
            third-party content. If you encounter issues with third-party
            content, please let us know and we will work to find accessible
            alternatives.
          </p>
        </article>
      </section>
    </div>
  );
}
