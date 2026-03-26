## 2026-03-08 - Incomplete HTML Sanitization in API Service
**Vulnerability:** The `sanitizeText` function in `worker/services/validation.ts` was attempting to prevent XSS by merely stripping `<` and `>` characters using a simple regex replace. This character stripping approach is brittle and can lead to unexpected data loss or bypasses in certain contexts.
**Learning:** Security validations were partially implemented but lacked robust HTML entity encoding for user-provided text destined for database storage and future display.
**Prevention:** Always use comprehensive HTML entity escaping (`&`, `<`, `>`, `"`, `'`) when sanitizing text inputs, rather than attempting to strip specific characters.

## 2026-03-08 - Unbounded Pagination in API Endpoints
**Vulnerability:** The `/api/posts` endpoint accepted arbitrary `limit` and `offset` query parameters without an upper bound. This exposed the application to Application-Layer DoS attacks, where a malicious user could request excessive records, crashing the database or Cloudflare Worker memory.
**Learning:** Pagination parameters must always be strictly validated and constrained to prevent resource exhaustion.
**Prevention:** Always enforce strict validation, default fallbacks, and hard upper limits on pagination parameters (e.g., \`Math.min(rawLimit, 100)\`) in GET endpoints.
