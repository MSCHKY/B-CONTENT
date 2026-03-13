## 2025-03-08 - Add Missing Global Security Headers Middleware
**Vulnerability:** Missing global security headers (HSTS, X-Content-Type-Options, etc) in `worker/index.ts` even though memory indicated it was there. This could expose users to common web vulnerabilities like clickjacking or MIME sniffing.
**Learning:** Found a gap between documented architecture (memory) and actual codebase state regarding `secureHeaders()`.
**Prevention:** Always verify documentation/memory assertions against the actual code. Actively apply global security defaults (like `app.use("*", secureHeaders())`) to newly initialized Hono or Express applications to ensure robust defense in depth.
