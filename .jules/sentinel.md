## 2024-05-01 - Missing Security Headers
**Vulnerability:** Missing security headers on API routes
**Learning:** Cloudflare Workers and Vite static asset serving can conflict if `secureHeaders` is applied globally (`*`). It must be scoped specifically to `/api/*` to enforce defense-in-depth for backend APIs without breaking frontend delivery.
**Prevention:** Always apply `secureHeaders` and scope it specifically to the API paths (`/api/*`) on full-stack apps using Hono + Cloudflare Pages/Workers.
