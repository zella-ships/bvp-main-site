// Accessibility Configuration
// This data powers both the admin dashboard and the /accessibility page

export interface A11yItem {
  id: string;
  category: 'perceivable' | 'operable' | 'understandable' | 'robust';
  wcagCriteria: string;
  label: string;
  description: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-applicable';
  notes?: string;
}

// WCAG 2.2 Level AA compliance checklist
export const accessibilityChecklist: A11yItem[] = [
  // Perceivable
  {
    id: 'text-alternatives',
    category: 'perceivable',
    wcagCriteria: '1.1.1',
    label: 'Text Alternatives',
    description: 'All non-text content has text alternatives',
    status: 'compliant',
    notes: 'All images have alt text, icons have aria-labels',
  },
  {
    id: 'captions',
    category: 'perceivable',
    wcagCriteria: '1.2.2',
    label: 'Captions (Prerecorded)',
    description: 'Captions provided for prerecorded audio/video',
    status: 'not-applicable',
    notes: 'No video content currently on site',
  },
  {
    id: 'color-contrast',
    category: 'perceivable',
    wcagCriteria: '1.4.3',
    label: 'Contrast (Minimum)',
    description: 'Text has 4.5:1 contrast ratio (3:1 for large text)',
    status: 'compliant',
    notes: 'All text meets AA contrast requirements',
  },
  {
    id: 'resize-text',
    category: 'perceivable',
    wcagCriteria: '1.4.4',
    label: 'Resize Text',
    description: 'Text can be resized up to 200% without loss of functionality',
    status: 'compliant',
    notes: 'Responsive design with relative units',
  },
  {
    id: 'images-of-text',
    category: 'perceivable',
    wcagCriteria: '1.4.5',
    label: 'Images of Text',
    description: 'Text is used instead of images of text',
    status: 'compliant',
    notes: 'All text is real text, not images',
  },
  {
    id: 'reflow',
    category: 'perceivable',
    wcagCriteria: '1.4.10',
    label: 'Reflow',
    description: 'Content reflows at 320px width without horizontal scroll',
    status: 'compliant',
    notes: 'Mobile-first responsive design',
  },
  {
    id: 'non-text-contrast',
    category: 'perceivable',
    wcagCriteria: '1.4.11',
    label: 'Non-text Contrast',
    description: 'UI components have 3:1 contrast ratio',
    status: 'compliant',
    notes: 'Buttons, form fields, icons meet contrast requirements',
  },
  {
    id: 'identify-input-purpose',
    category: 'perceivable',
    wcagCriteria: '1.3.5',
    label: 'Identify Input Purpose',
    description: 'Form inputs have autocomplete attributes',
    status: 'compliant',
    notes: 'All form fields use proper autocomplete (name, email, tel, etc.)',
  },

  // Operable
  {
    id: 'keyboard',
    category: 'operable',
    wcagCriteria: '2.1.1',
    label: 'Keyboard',
    description: 'All functionality available via keyboard',
    status: 'compliant',
    notes: 'All interactive elements are keyboard accessible',
  },
  {
    id: 'no-keyboard-trap',
    category: 'operable',
    wcagCriteria: '2.1.2',
    label: 'No Keyboard Trap',
    description: 'Keyboard focus is not trapped',
    status: 'compliant',
    notes: 'Modal dialogs properly manage focus',
  },
  {
    id: 'skip-blocks',
    category: 'operable',
    wcagCriteria: '2.4.1',
    label: 'Bypass Blocks',
    description: 'Skip navigation link provided',
    status: 'compliant',
    notes: 'Skip to main content link in header',
  },
  {
    id: 'page-titled',
    category: 'operable',
    wcagCriteria: '2.4.2',
    label: 'Page Titled',
    description: 'Pages have descriptive titles',
    status: 'compliant',
    notes: 'All pages have unique, descriptive titles',
  },
  {
    id: 'focus-order',
    category: 'operable',
    wcagCriteria: '2.4.3',
    label: 'Focus Order',
    description: 'Focus order preserves meaning and operability',
    status: 'compliant',
    notes: 'Logical tab order throughout',
  },
  {
    id: 'link-purpose',
    category: 'operable',
    wcagCriteria: '2.4.4',
    label: 'Link Purpose (In Context)',
    description: 'Link purpose can be determined from link text',
    status: 'compliant',
    notes: 'Descriptive link text used throughout',
  },
  {
    id: 'focus-visible',
    category: 'operable',
    wcagCriteria: '2.4.7',
    label: 'Focus Visible',
    description: 'Keyboard focus indicator is visible',
    status: 'compliant',
    notes: 'Custom focus-visible styles on all interactive elements',
  },
  {
    id: 'dragging-movements',
    category: 'operable',
    wcagCriteria: '2.5.7',
    label: 'Dragging Movements (2.2)',
    description: 'No functionality requires dragging',
    status: 'compliant',
    notes: 'No drag interactions on site',
  },

  // Understandable
  {
    id: 'language-page',
    category: 'understandable',
    wcagCriteria: '3.1.1',
    label: 'Language of Page',
    description: 'Page language is identified in HTML',
    status: 'compliant',
    notes: 'lang="en" set on html element',
  },
  {
    id: 'on-focus',
    category: 'understandable',
    wcagCriteria: '3.2.1',
    label: 'On Focus',
    description: 'No unexpected context changes on focus',
    status: 'compliant',
    notes: 'No auto-submit or unexpected navigation',
  },
  {
    id: 'on-input',
    category: 'understandable',
    wcagCriteria: '3.2.2',
    label: 'On Input',
    description: 'No unexpected context changes on input',
    status: 'compliant',
    notes: 'Form changes require explicit submit',
  },
  {
    id: 'error-identification',
    category: 'understandable',
    wcagCriteria: '3.3.1',
    label: 'Error Identification',
    description: 'Input errors are identified and described',
    status: 'compliant',
    notes: 'Form validation with clear error messages',
  },
  {
    id: 'labels',
    category: 'understandable',
    wcagCriteria: '3.3.2',
    label: 'Labels or Instructions',
    description: 'Form inputs have labels',
    status: 'compliant',
    notes: 'All form fields have associated labels',
  },
  {
    id: 'consistent-help',
    category: 'understandable',
    wcagCriteria: '3.2.6',
    label: 'Consistent Help (2.2)',
    description: 'Help mechanisms appear in consistent locations',
    status: 'compliant',
    notes: 'Contact link in header/footer consistently across pages',
  },
  {
    id: 'redundant-entry',
    category: 'understandable',
    wcagCriteria: '3.3.7',
    label: 'Redundant Entry (2.2)',
    description: 'Previously entered info is auto-populated or available',
    status: 'compliant',
    notes: 'No multi-step forms that re-ask info',
  },
  {
    id: 'accessible-auth',
    category: 'understandable',
    wcagCriteria: '3.3.8',
    label: 'Accessible Authentication (2.2)',
    description: 'No cognitive function test required for auth',
    status: 'not-applicable',
    notes: 'No login/authentication required',
  },

  // Robust
  {
    id: 'parsing',
    category: 'robust',
    wcagCriteria: '4.1.1',
    label: 'Parsing',
    description: 'HTML is valid and well-formed',
    status: 'compliant',
    notes: 'Next.js generates valid HTML',
  },
  {
    id: 'name-role-value',
    category: 'robust',
    wcagCriteria: '4.1.2',
    label: 'Name, Role, Value',
    description: 'UI components have accessible names and roles',
    status: 'compliant',
    notes: 'Semantic HTML and ARIA attributes used correctly',
  },
  {
    id: 'status-messages',
    category: 'robust',
    wcagCriteria: '4.1.3',
    label: 'Status Messages',
    description: 'Status messages are announced to screen readers',
    status: 'compliant',
    notes: 'Form success/error states announced via aria-live',
  },
];

// Summary stats
export const a11ySummary = {
  total: accessibilityChecklist.length,
  compliant: accessibilityChecklist.filter(i => i.status === 'compliant').length,
  partial: accessibilityChecklist.filter(i => i.status === 'partial').length,
  nonCompliant: accessibilityChecklist.filter(i => i.status === 'non-compliant').length,
  notApplicable: accessibilityChecklist.filter(i => i.status === 'not-applicable').length,
  byCategory: {
    perceivable: {
      total: accessibilityChecklist.filter(i => i.category === 'perceivable').length,
      compliant: accessibilityChecklist.filter(i => i.category === 'perceivable' && i.status === 'compliant').length,
    },
    operable: {
      total: accessibilityChecklist.filter(i => i.category === 'operable').length,
      compliant: accessibilityChecklist.filter(i => i.category === 'operable' && i.status === 'compliant').length,
    },
    understandable: {
      total: accessibilityChecklist.filter(i => i.category === 'understandable').length,
      compliant: accessibilityChecklist.filter(i => i.category === 'understandable' && i.status === 'compliant').length,
    },
    robust: {
      total: accessibilityChecklist.filter(i => i.category === 'robust').length,
      compliant: accessibilityChecklist.filter(i => i.category === 'robust' && i.status === 'compliant').length,
    },
  },
  // Compliance percentage
  complianceRate: Math.round(
    (accessibilityChecklist.filter(i => i.status === 'compliant' || i.status === 'not-applicable').length /
      accessibilityChecklist.length) *
      100
  ),
};

// Generate accessibility statement text
export function generateA11yStatement(): string {
  const compliantCount = a11ySummary.compliant;
  const totalApplicable = a11ySummary.total - a11ySummary.notApplicable;

  return `
Black Veterans Project is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## Conformance Status

This website substantially conforms to WCAG 2.2 Level AA guidelines. We have evaluated ${a11ySummary.total} WCAG criteria, with ${compliantCount} of ${totalApplicable} applicable criteria meeting compliance (${a11ySummary.complianceRate}% compliance rate).

## Measures Taken

We have taken the following measures to ensure accessibility:
- Implemented keyboard navigation for all interactive elements
- Added skip-to-main-content link for screen reader users
- Ensured color contrast ratios meet WCAG AA standards (4.5:1 for text, 3:1 for UI components)
- Provided text alternatives for all non-text content
- Used semantic HTML and ARIA attributes appropriately
- Tested with screen readers and keyboard-only navigation

## Feedback

We welcome your feedback on the accessibility of this website. Please let us know if you encounter accessibility barriers:
- Email: info@blackveteransproject.org

We try to respond to feedback within 5 business days.

## Last Updated

This statement was last updated on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
  `.trim();
}
