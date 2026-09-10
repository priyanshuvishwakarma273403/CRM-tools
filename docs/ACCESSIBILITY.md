# CRM OS — Accessibility (a11y) & Inclusive Design Specification

## 1. Compliance Standard: WCAG 2.1 Level AA

CRM OS adheres to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA across all interactive surfaces:
- **Contrast Ratios**: Body text achieves a minimum contrast ratio of `4.5:1` against light and dark background surfaces. Large display headlines achieve at least `3.0:1`.
- **Keyboard Traversal**: Every interactive control (buttons, links, drawer toggles, modal dialogs, search inputs) is reachable and operable via keyboard tab orders.
- **Visible Focus Rings**: Active focus rings use a clear 2px offset brand outline (`focus:ring-2 focus:ring-brand-500`) that remains sharp in both dark and light modes.

---

## 2. Screen Reader & ARIA Standards

1. **Semantic HTML**:
   - Landmarks (`<main>`, `<aside>`, `<nav>`, `<header>`) demarcate page structure.
2. **Dialog Modals & Drawers**:
   - Implement `role="dialog"`, `aria-modal="true"`, and automatic focus trapping to prevent keyboard focus from leaking into obscured background DOM nodes.
3. **Icons & Badges**:
   - Decorative icons carry `aria-hidden="true"`.
   - Functional action buttons include explicit `aria-label` tags (e.g. `aria-label="Close dialog"`).

---

## 3. Motion & Cognitive Accessibility

- **`prefers-reduced-motion`**: Overrides CSS transitions and Framer Motion spring physics for users who have enabled reduced motion in their operating system settings.
- **Explainable Health & Risk**: Health indicators combine color cues with explicit text labels (`Healthy`, `At Risk`) and numeric fractions (`72 / 100`) so information is never conveyed by color alone.
