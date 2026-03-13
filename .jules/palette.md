## 2025-02-24 - Unlabelled Error Banners
**Learning:** Dismissal buttons for error banners across different components (e.g. Calendar, Content Creator) shared an inaccessible pattern: they lacked `type="button"` (risking form submissions), lacked `aria-label` (making screen readers announce just "X"), and had no visible keyboard focus states.
**Action:** When creating or reviewing ad-hoc dismissible UI elements, enforce `type="button"`, explicit `aria-label` (localized to German, e.g., 'Fehlermeldung schließen'), and explicit `focus-visible` utility classes for keyboard accessibility.
