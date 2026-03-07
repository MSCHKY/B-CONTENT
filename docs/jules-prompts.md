# Jules Prompt Library — B/CONTENT

> **Source:** `github:MSCHKY/B-CONTENT`
> **Anleitung:** Prompts können einzeln via CLI oder gebatcht via `delegate` gesendet werden.
> **Best Practice:** Spezifisch sein. Dateipfade angeben. Erwartetes Ergebnis beschreiben.

---

## 🔴 Priority 1 — Sofort (Test-Coverage + Code Quality)

### T-001: API Endpoint Tests

```
Add comprehensive Playwright E2E tests for all API endpoints.

Create a new test file `tests/api.spec.ts` following the patterns in `tests/smoke.spec.ts`.

Test the following endpoints:
1. POST /api/generate — text generation (mock or real Gemini response)
2. POST /api/generate/image — image generation
3. POST /api/generate/website-article — website article generation
4. GET /api/knowledge/topics — returns all 13 topic fields
5. GET /api/knowledge/quotes — returns all quotes
6. GET /api/knowledge/rules — returns content rules
7. GET /api/posts — lists saved posts
8. POST /api/posts — saves a new post
9. DELETE /api/posts/:id — deletes a post

For each endpoint test:
- Happy path with valid input
- Error case with missing/invalid parameters
- Response shape validation (check required fields exist)

Use the existing smoke.spec.ts test setup patterns. Follow AGENTS.md rules.
```

### T-002: TypeScript Strict Mode

```
Enable TypeScript strict mode and fix all resulting errors.

Steps:
1. In `tsconfig.json`, set "strict": true
2. Fix all TypeScript errors that appear
3. Do NOT use `any` type — use proper interfaces from `src/app/types/`
4. Do NOT suppress errors with @ts-ignore
5. Run `npx vite build` to verify zero errors

Expected: Clean build with strict mode enabled. Follow AGENTS.md coding rules.
```

### T-003: JSDoc for All Exports

```
Add JSDoc documentation to all exported functions, types, and components.

Scope:
- `worker/services/gemini.ts` — document all exported functions
- `worker/services/prompt-builder.ts` — document the prompt assembly logic
- `worker/routes/generate.ts` — document all route handlers
- `worker/routes/posts.ts` — document CRUD operations
- `worker/routes/knowledge.ts` — document knowledge endpoints
- `src/app/stores/*.ts` — document Zustand store interfaces and actions
- `src/app/components/ui/*.tsx` — document component props and usage

Use standard JSDoc format with @param, @returns, @example where applicable.
Keep descriptions concise but informative. English only. Follow AGENTS.md rules.
```

---

## 🟡 Priority 2 — Code Hardening

### T-004: Error Handling Audit

```
Audit and improve error handling across all API routes and services.

Focus areas:
1. `worker/services/gemini.ts` — ensure proper error handling for:
   - API key missing/invalid
   - Rate limiting (429)
   - Network timeouts
   - Invalid response format from Gemini
   - Image generation failures

2. `worker/routes/generate.ts` — ensure:
   - Input validation for all parameters
   - Meaningful error messages returned to frontend
   - No unhandled promise rejections

3. `worker/routes/posts.ts` — ensure:
   - D1 query error handling
   - Proper 404 for missing posts
   - Input sanitization

Create a consistent error response format: { error: string, code?: string }
Add try-catch blocks where missing. Log errors server-side.
Follow AGENTS.md rules.
```

### T-005: Input Validation & Sanitization

```
Add input validation to all API endpoints using a consistent pattern.

Requirements:
1. Create a validation utility in `worker/services/validation.ts`
2. Validate all POST body fields:
   - Required field checks
   - String length limits (match PRODUCT_SPEC.md char ranges)
   - Enum validation for instance_id ('alex' | 'ablas' | 'bwg')
   - Enum validation for content_type against available types per instance
3. Sanitize text inputs (strip HTML, prevent injection)
4. Return typed validation errors: { error: string, field: string }

Apply to:
- POST /api/generate (instance, contentType, topic, context)
- POST /api/generate/image (instance, prompt, format)
- POST /api/posts (all fields)

Follow AGENTS.md coding rules. Full TypeScript types required.
```

### T-006: Performance Audit

```
Audit the React frontend for performance issues and optimize.

Check for:
1. Unnecessary re-renders in Create-Flow wizard steps
2. Missing React.memo() on heavy components
3. Missing useMemo/useCallback in stores
4. Large JSON imports that could be lazy-loaded
5. Image optimization (R2 URLs — check if we're loading full-res when thumbnails suffice)
6. Bundle size analysis — run `npx vite build` and check output sizes

Create a brief report as comments in the code where optimizations are applied.
Do NOT introduce new dependencies. Follow AGENTS.md rules.
```

---

## 🟢 Priority 3 — Documentation & Cleanup

### T-007: API Documentation

```
Create comprehensive API documentation in `docs/API.md`.

Document every endpoint with:
- Method + Path
- Description
- Request body (with TypeScript interface)
- Response body (with TypeScript interface)
- Example curl command
- Error responses

Endpoints to document:
- POST /api/generate
- POST /api/generate/image
- POST /api/generate/website-article
- GET /api/knowledge/topics
- GET /api/knowledge/quotes
- GET /api/knowledge/rules
- GET /api/posts
- POST /api/posts
- DELETE /api/posts/:id

Follow AGENTS.md rules. Use English.
```

### T-008: Dead Code Cleanup

```
Find and remove all dead code, unused imports, and unused variables.

Scope: All files in src/ and worker/ directories.

Steps:
1. Run TypeScript compiler with noUnusedLocals and noUnusedParameters
2. Remove all unused imports
3. Remove all unused variables and functions
4. Remove any commented-out code blocks (unless they contain TODO comments)
5. Verify build passes: `npx vite build`

Do NOT remove any files or change functionality. Only clean up dead code.
Follow AGENTS.md rules.
```

### T-009: Accessibility Audit

```
Audit all React components for accessibility (a11y) compliance.

Check for:
1. Missing aria-labels on interactive elements
2. Missing alt text on images
3. Proper heading hierarchy (h1 → h2 → h3)
4. Keyboard navigation support (tab order, focus management)
5. Color contrast ratios (check vDNA brand colors against WCAG AA)
6. Screen reader compatibility for the Create-Flow wizard steps

Fix all issues found. Add aria-labels, roles, and keyboard handlers where missing.
Do NOT change the visual design. Follow AGENTS.md rules.
```

### T-010: Security Hardening

```
Security audit all API endpoints and frontend code.

Check for:
1. XSS vulnerabilities in user-generated content display
2. CSRF protection on mutation endpoints
3. Content-Security-Policy headers
4. SQL injection in D1 queries (verify parameterized queries)
5. R2 key path traversal prevention
6. Rate limiting considerations (document recommendations)
7. API key exposure prevention (ensure GEMINI_API_KEY is never sent to frontend)

Create a security report in `docs/SECURITY_AUDIT.md` with findings and fixes applied.
Follow AGENTS.md rules.
```

---

## 🔵 Scheduled / Recurring

### T-011: Dependency Check (Weekly)

```
Check all npm dependencies for:
1. Available updates (run `npm outdated`)
2. Security vulnerabilities (run `npm audit`)
3. Deprecated packages

If safe updates are available (patch or minor versions), update them.
Do NOT update major versions without explicit approval.
Run `npx vite build` after updates to verify nothing breaks.
Create a summary of changes in the commit message.
```

### T-012: Code Quality Report

```
Generate a code quality report covering:
1. TypeScript strictness compliance
2. Test coverage summary
3. Bundle size breakdown
4. Unused exports or dead code
5. TODO/FIXME/HACK comments inventory

Output the report as `docs/CODE_QUALITY.md`.
Do NOT modify any code — just report findings.
```

---

## 📋 Overnight Batch File Format

For batch delegation via `jules delegate`, create a `.txt` file with prompts separated by `---`:

```
# docs/jules-overnight.txt

Add Playwright E2E tests for POST /api/generate endpoint...
(full prompt here)
---
Enable TypeScript strict mode and fix all errors...
(full prompt here)
---
Add JSDoc to all exported functions in worker/services/...
(full prompt here)
```

Then run:
```bash
JULES_API_KEY=your-key ./scripts/jules-cli.sh delegate "github:MSCHKY/B-CONTENT" docs/jules-overnight.txt
```
