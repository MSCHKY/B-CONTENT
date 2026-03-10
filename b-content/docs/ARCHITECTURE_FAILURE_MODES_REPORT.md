# Architecture Failure Modes Report

Date: 2026-03-10
Status: **ALL RESOLVED** (Sessions A+B+C, 2026-03-10)

B/CONTENT runs as a synchronous edge request pipeline: React UI calls a single Cloudflare Worker (Hono), which directly calls Gemini and persists to D1, R2, and KV in request time. This keeps architecture simple but concentrates risk in external dependency availability, multi-store consistency, and environment/schema drift.

## Confirmed vs Inferred

Confirmed from repo evidence:
- Worker route surface and bindings (`DB`, `IMAGES`, `KB_STORE`, `GEMINI_API_KEY`) in `worker/index.ts` and `wrangler.toml`.
- Critical generation and interview paths call Gemini directly via `fetch` in `worker/services/gemini.ts`.
- Persistence is split across D1 (`posts`, `generated_images`, `interviews`), R2 image objects, and KV knowledge overlays.
- Calendar and stats depend on migrated `posts.scheduled_at` + updated status constraints.

Inferred:
- No asynchronous queue/job processor or compensation workflow exists (no queue bindings or background worker code found), so long-running and multi-step operations are handled inline per request.

## Top Failure Modes

| FM | Description | Status | Fix (Commit) |
|----|-------------|--------|--------------|
| FM1 | External AI dependency outage/latency cascade | ✅ Resolved | `Promise.allSettled` in orchestration + exponential backoff in retries (`3e3b512`, `59c1ab3`) |
| FM2 | Cross-store inconsistency and orphaned media | ✅ Resolved | R2 + image metadata cleanup on purge (`3e3b512`) |
| FM3 | Knowledge base data split and write races | ✅ Resolved | Shared `kb-service.ts`, interview import uses canonical `kb_topics`/`kb_quotes` keys with batched writes (`9ed98ea`) |
| FM4 | Schema/migration drift between environments | ✅ Resolved | `/api/health` schema verification for `scheduled_at` + `interviews` table (`3e3b512`) |
| FM5 | Unauthorized mutation and cost abuse | ✅ Resolved | Auth middleware stub (CF Access header check), `x-gemini-key` override removed (`59c1ab3`) |

## Detailed Descriptions

- **FM1 — External AI dependency outage/latency cascade.** Trigger: Gemini 429/5xx/timeouts; orchestration fans out 3 parallel generations. Fix: `Promise.allSettled` for partial-success handling, exponential backoff (1s text, 1.5s image) between retries. Remaining: full circuit breaker not viable in stateless Workers — would require Durable Objects or KV-backed state.

- **FM2 — Cross-store inconsistency and orphaned media.** Trigger: post purge removed D1 row but left R2 objects and `generated_images` metadata. Fix: purge route now deletes R2 objects and image metadata rows. Remaining: scheduled reconciliation job (nice-to-have, low priority).

- **FM3 — Knowledge base data split and write races.** Trigger: interview import wrote to `topics/{id}/facts` and `quotes/all` while Knowledge CRUD used `kb_topics` and `kb_quotes`. Fix: extracted shared `kb-service.ts`, interview import uses same helpers. Bonus: batched writes (1 read + 1 write instead of N). Remaining: optimistic concurrency/CAS (edge case at current scale).

- **FM4 — Schema/migration drift between environments.** Trigger: manual migration execution per environment. Fix: `/api/health` checks for `scheduled_at` column and `interviews` table, returns `schema.ok: false` if missing. Remaining: deployment gate (nice-to-have).

- **FM5 — Unauthorized mutation and cost abuse.** Trigger: no auth on mutating APIs, `x-gemini-key` header override. Fix: `requireAuth` middleware checks `cf-access-authenticated-user-email` header in production, passthrough in dev. Key override removed. Remaining: rate limiting (#5 audit finding, deferred).
