# BVP SPEC 07: ACCESSIBILITY
## WCAG 2.2 AA Compliance & Apple HIG Standards

---

## STANDARDS & COMPLIANCE

| Standard | Target | Status |
|----------|--------|--------|
| **WCAG 2.2** | Level AA | In Progress |
| **Apple HIG** | iOS Accessibility | Implemented |
| **Section 508** | Federal compliance | Aligned |

---

## 1. CONTENT & SEMANTICS

### Language Attributes
- `lang="en"` on `<html>` element (`src/app/layout.tsx`)
- Use `lang` attribute on content blocks in other languages if needed

### Heading Hierarchy
- **One `<h1>` per page** — main page title
- **Sequential levels** — never skip (h1 → h2 → h3, not h1 → h3)
- Each section uses appropriate heading level

```tsx
// CORRECT
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

// INCORRECT - skips h2
<h1>Page Title</h1>
<h3>Section Title</h3>
```

### Meaningful Link Text
- No "click here" or "read more" without context
- Links should make sense out of context (screen reader link lists)

```tsx
// CORRECT
<Link href="/about">Learn about our mission</Link>

// INCORRECT
<Link href="/about">Click here</Link>
```

### Semantic HTML
- Use `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>`
- Lists use `<ul>/<ol>` and `<li>`, not styled divs
- Tables use `<th>`, `scope`, and `<caption>` when applicable

---

## 2. iOS/MOBILE ACCESSIBILITY

### Dynamic Type Support
```css
/* globals.css */
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  font-size: 1.0625rem; /* 17px Apple HIG minimum */
}
```

### Reduced Motion Support
CSS media query disables all animations:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Framer Motion hook for JS animations:
```tsx
import { useReducedMotion } from 'framer-motion';

function Component() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
    />
  );
}
```

### High Contrast Mode Support
```css
@media (prefers-contrast: high) {
  /* Remove transparency */
  .bg-white\/50 { background-color: #fff !important; }

  /* Strengthen text contrast */
  .text-white\/80 { color: #fff !important; }

  /* Remove backdrop blur */
  .backdrop-blur-md { backdrop-filter: none !important; }

  /* Extra visible focus states */
  :focus-visible {
    outline-width: 3px !important;
    outline-offset: 3px !important;
  }
}
```

### Safe Area Insets
```css
html {
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

---

## 3. TOUCH TARGETS

### Minimum Size: 44px × 44px (Apple HIG)

| Component | Implementation |
|-----------|----------------|
| Buttons | `min-h-[44px]` on mobile |
| Form inputs | `min-h-[48px]` |
| Toggle switches | `w-11 h-[28px]` |
| Checkboxes | `w-11 h-11` touch wrapper |
| Social icons | `w-11 h-11` |
| Footer links | `min-h-[44px]` with padding |
| Back-to-top | `w-11 h-11 min-w-[44px] min-h-[44px]` |

```tsx
// Button component example
const sizes = {
  sm: "px-6 py-3 md:py-2.5 min-h-[44px] md:min-h-0",
  md: "px-8 py-3.5 md:py-3 min-h-[48px] md:min-h-0",
  lg: "px-10 py-4 min-h-[52px] md:min-h-0",
};
```

---

## 4. KEYBOARD NAVIGATION

### Skip Link
```tsx
// Header.tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 ..."
>
  Skip to main content
</a>
```

### Focus Trap Pattern (Modals)
```tsx
function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    setTimeout(() => firstElement?.focus(), 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }

      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onEscape]);

  return containerRef;
}
```

### Focus Management on Errors
```tsx
// Move focus to first invalid field on form submit
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const errors = validate(formData);

  if (errors.name) {
    nameInputRef.current?.focus();
  } else if (errors.email) {
    emailInputRef.current?.focus();
  }
};
```

---

## 5. SCREEN READER SUPPORT

### ARIA Roles & Landmarks
```tsx
// Modal pattern
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>

// Navigation
<nav role="navigation" aria-label="Main navigation">

// Current page
<a aria-current="page" href="/about">About</a>

// Mobile menu
<div
  role="dialog"
  aria-modal="true"
  aria-label="Mobile navigation menu"
>
```

### Live Regions
```tsx
// Status announcements (polite)
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {isSubmitting && 'Submitting...'}
  {isSuccess && 'Success! Form submitted.'}
</div>

// Error announcements (assertive)
<p role="alert" aria-live="assertive">
  {errorMessage}
</p>
```

### Form Accessibility
```tsx
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : "email-hint"}
  autoComplete="email"
/>
<p id="email-error" role="alert">{errorMessage}</p>
```

### Toggle/Switch Pattern
```tsx
<button
  role="switch"
  aria-checked={isEnabled}
  aria-label="Enable analytics"
  onClick={toggle}
>
```

### Accordion Pattern
```tsx
<button
  id="accordion-button-1"
  aria-expanded={isOpen}
  aria-controls="accordion-panel-1"
>
  {title}
</button>
<div
  id="accordion-panel-1"
  role="region"
  aria-labelledby="accordion-button-1"
>
  {content}
</div>
```

---

## 6. COLOR & CONTRAST

### Minimum Ratios (WCAG AA)
- **Normal text**: 4.5:1
- **Large text (18px+ bold, 24px+ regular)**: 3:1
- **UI components**: 3:1

### BVP Color Palette Contrast
| Combination | Ratio | Pass |
|-------------|-------|------|
| Black on White | 21:1 | ✅ |
| Black on Gold (#FDC500) | 12.6:1 | ✅ |
| White on Black | 21:1 | ✅ |
| Gold on Black | 12.6:1 | ✅ |
| White/80 on Black | ~14:1 | ✅ |

### Focus Indicator
```css
:focus-visible {
  outline: 2px solid #FDC500;
  outline-offset: 2px;
}
```

---

## 7. COMPONENT PATTERNS

### Back-to-Top Button
```tsx
// src/components/ui/BackToTop.tsx
<button
  onClick={scrollToTop}
  className="w-11 h-11 min-w-[44px] min-h-[44px] ..."
  aria-label="Back to top"
>
  <svg aria-hidden="true">...</svg>
</button>
```

### Cookie Consent
- `role="dialog"` with `aria-modal="true"`
- `aria-labelledby` and `aria-describedby`
- Focus trap when open
- Escape key closes
- Toggle with `role="switch"` and `aria-checked`

### Mobile Menu
- `role="dialog"` with `aria-modal="true"`
- Menu button with `aria-expanded` and `aria-controls`
- Focus trap when open
- Focus returns to menu button on close
- Escape key closes

### Newsletter Form
- Labels (visible or `.sr-only`)
- `aria-required`, `aria-invalid`, `aria-describedby`
- `autoComplete` attributes
- Focus moves to first error on submit
- Success announced via `role="status"`

---

## 8. MEDIA & DOCUMENTS

### Images
- Decorative: `alt=""` with `aria-hidden="true"`
- Informative: Descriptive `alt` text
- Complex (charts/infographics): Extended description or data table

### SVGs
- Decorative: `aria-hidden="true"`
- Informative: `role="img"` with `<title>` element

### Videos (if added)
- Captions required
- Transcript recommended
- Audio descriptions for visual-only info

### PDFs
- Tagged PDFs with proper reading order
- OR provide HTML alternative
- Note in accessibility statement

---

## 9. COGNITIVE ACCESSIBILITY (WCAG 2.2)

| Requirement | Implementation |
|-------------|----------------|
| **Consistent Help (3.2.6)** | Contact link in header/footer consistently |
| **Redundant Entry (3.3.7)** | Multi-step forms don't re-ask info |
| **Accessible Auth (3.3.8)** | N/A (no login required) |
| **Dragging (2.5.7)** | No drag interactions |

---

## 10. TESTING CHECKLIST

### Automated Testing
- [ ] Lighthouse accessibility audit (90+ score)
- [ ] axe-core browser extension
- [ ] Wave evaluation tool

### Screen Reader Testing
| Reader | Browser | Platform | Status |
|--------|---------|----------|--------|
| VoiceOver | Safari | macOS/iOS | [ ] |
| NVDA | Firefox | Windows | [ ] |
| JAWS | Chrome/Edge | Windows | [ ] |
| TalkBack | Chrome | Android | [ ] |

### Keyboard Testing
- [ ] All interactive elements focusable via Tab
- [ ] Visible focus indicator on all elements
- [ ] Skip link functional
- [ ] Modal focus traps work correctly
- [ ] Escape closes modals
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate menus

### Zoom Testing
- [ ] 200% browser zoom — no horizontal scroll, text readable
- [ ] 400% browser zoom — content reflows, still functional
- [ ] iOS Dynamic Type at largest setting

### Motion Testing
- [ ] Enable "Reduce Motion" in OS settings
- [ ] Verify all animations stop or provide static alternative
- [ ] Parallax effects disabled
- [ ] Repeating animations (spinners) show static state

### High Contrast Testing
- [ ] Enable "Increase Contrast" on iOS/macOS
- [ ] Verify all UI elements visible
- [ ] No information lost when transparency removed

### Mobile Testing
- [ ] All touch targets 44px minimum
- [ ] Forms work with mobile keyboards
- [ ] `inputMode` set correctly (email, tel, etc.)
- [ ] Safe area insets respected on notched devices

---

## 11. KNOWN LIMITATIONS

### Current
- PDFs on Financials page need accessible versions or HTML alternatives
- No search functionality (WCAG 2.4.5 recommends multiple ways to find content)
- No sitemap page (planned)

### Third-Party Content
- Substack embeds rely on Substack's accessibility
- External video content (if embedded) requires source captions

---

## 12. MAINTENANCE

### Before Each Release
1. Run Lighthouse accessibility audit
2. Test with VoiceOver (macOS)
3. Verify all new form fields have proper labels and autocomplete
4. Check heading hierarchy on new pages
5. Verify touch targets on mobile

### Quarterly Review
1. Full screen reader testing (all platforms)
2. User feedback analysis
3. WCAG updates check
4. Color contrast verification with any design changes

---

## RESOURCES

- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [Apple Human Interface Guidelines - Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Framer Motion Accessibility](https://www.framer.com/motion/accessibility/)

---

*Last updated: February 2026*
