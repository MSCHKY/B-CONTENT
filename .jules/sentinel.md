## 2025-03-17 - Secure Headers Middleware Scope
**Vulnerability:** Missing security headers on API routes
**Learning:** When using `hono/secure-headers` in a Vite/Cloudflare Workers environment, applying it globally (`*`) breaks static asset serving.
**Prevention:** Always scope security headers specifically to API routes (e.g., `app.use('/api/*', secureHeaders())`) to avoid breaking CI builds and static asset delivery.
