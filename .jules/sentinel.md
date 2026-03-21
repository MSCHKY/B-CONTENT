## 2025-03-21 - [API Security Headers]
**Vulnerability:** Missing fundamental security headers on API routes
**Learning:** Cloudflare Workers acting as full stack runtimes (serving both static assets via Vite and JSON APIs via Hono) must scope security middleware specifically to the API paths (e.g., `app.use('/api/*', secureHeaders())`) to avoid stripping or conflicting with headers expected by static asset delivery.
**Prevention:** Always verify the scope of middleware when applying it to a monolithic Worker that handles both static hosting and API endpoints.
