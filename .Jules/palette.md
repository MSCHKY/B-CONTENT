## 2025-03-22 - Add ARIA Labels to Error Dismissal Buttons
**Learning:** Found multiple instances where error dismissal buttons ("✕") were missing accessible names, making them unreadable to screen readers. They also lacked `type="button"`, `focus-visible` styling for keyboard users, and explicit cursor styling.
**Action:** Created `t.common.close` translation ("Schließen" / "Close") and applied `type="button"`, `aria-label`, `focus-visible:ring-2`, and `cursor-pointer` to all error banner close buttons to ensure full accessibility and usability compliance.
