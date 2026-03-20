## 2026-03-08 - Incomplete HTML Sanitization in API Service
**Vulnerability:** The `sanitizeText` function in `worker/services/validation.ts` was attempting to prevent XSS by merely stripping `<` and `>` characters using a simple regex replace. This character stripping approach is brittle and can lead to unexpected data loss or bypasses in certain contexts.
**Learning:** Security validations were partially implemented but lacked robust HTML entity encoding for user-provided text destined for database storage and future display.
**Prevention:** Always use comprehensive HTML entity escaping (`&`, `<`, `>`, `"`, `'`) when sanitizing text inputs, rather than attempting to strip specific characters.
## 2025-03-20 - Add secureHeaders middleware
**Vulnerability:** Missing security headers on API responses.
**Learning:** `hono/secure-headers` needs to be scoped specifically to API routes (e.g. `/api/*`) instead of globally (`*`). Applying it globally will break Cloudflare Workers/Vite static asset serving during CI builds.
**Prevention:** Always ensure security headers middleware is properly scoped to relevant API routes when serving static files from the same app instance.
