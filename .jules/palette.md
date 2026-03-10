
## 2025-05-15 - Accessible Error Dismissal Focus States
**Learning:** Raw `<button>` elements used for inline UI actions (like dismissing error alerts) often lack default focus indicators and `type="button"` attributes, causing accessibility issues for keyboard users and potential form submission bugs.
**Action:** Always add `type="button"`, `aria-label` (localized), and `focus-visible` utility classes (e.g., `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded`) to icon-only buttons like "✕" used to dismiss errors.
