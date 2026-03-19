## 2024-03-20 - Accessible Inline Error Dismissals
**Learning:** Inline error dismissal buttons (e.g., ✕) lack accessibility contexts when implemented purely visually.
**Action:** Always include `type="button"`, a localized `aria-label` (e.g., "Fehlermeldung schließen"), and `focus-visible` utility classes for keyboard navigation.
