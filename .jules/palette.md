## 2026-03-28 - Accessibility of Icon-only Error Dismiss Buttons
**Learning:** Inline error states using bare `✕` characters lack screen reader context, keyboard focus indicators, and explicit `type="button"` attributes, leading to inaccessible form validation and transient error interactions.
**Action:** Always include an English `aria-label` and `title` (or translated equivalent matching the app's UI language) for icon-only buttons, add explicit `focus-visible` utility classes, and ensure `type="button"` is present to prevent unintended form submissions.
