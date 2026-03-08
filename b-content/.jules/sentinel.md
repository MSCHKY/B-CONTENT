## 2026-03-08 - Incomplete HTML Sanitization in API Service
**Vulnerability:** The `sanitizeText` function in `worker/services/validation.ts` was attempting to prevent XSS by merely stripping `<` and `>` characters using a simple regex replace. This character stripping approach is brittle and can lead to unexpected data loss or bypasses in certain contexts.
**Learning:** Security validations were partially implemented but lacked robust HTML entity encoding for user-provided text destined for database storage and future display.
**Prevention:** Always use comprehensive HTML entity escaping (`&`, `<`, `>`, `"`, `'`) when sanitizing text inputs, rather than attempting to strip specific characters.
