# Architecture Failure Modes Report

Date: 2026-03-10

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

- **Failure mode:** External AI dependency outage/latency cascade. **Trigger:** Gemini 429/5xx/timeouts; orchestration fans out 3 parallel generations and fails as a unit (`Promise.all`). **Symptoms:** `/api/generate/*`, `/api/orchestrate`, and interview processing errors or high latency; user-visible failures during peak load. **Detection:** Endpoint-level 429/5xx/504 metrics and p95/p99 latency alerts; track failure rate by Gemini model. **Mitigation:** Add circuit breaker + backoff, move long tasks to async jobs, and change orchestration to partial-success handling (`Promise.allSettled`).
- **Failure mode:** Cross-store inconsistency and orphaned media. **Trigger:** Image path writes R2 first, D1 metadata insert second and non-fatal on failure; post purge removes post row but not image metadata/object cleanup. **Symptoms:** Missing image associations in library UI, orphaned D1/R2 artifacts, storage cost drift. **Detection:** Scheduled reconciliation between `posts.image_id`, `generated_images.id`, and R2 key inventory. **Mitigation:** Add compensating cleanup job, enforce cleanup on purge/archive transitions, and define a single source-of-truth lifecycle state.
- **Failure mode:** Knowledge base data split and write races. **Trigger:** Knowledge API uses KV keys `kb_topics`/`kb_quotes`, while interview import writes to different KV keys (`topics/{id}/facts`, `quotes/all`); all writes are read-modify-write without optimistic concurrency control. **Symptoms:** Imported interview items do not appear in the Knowledge UI/API, or recent edits are overwritten under concurrent updates. **Detection:** E2E check: interview import then immediate knowledge read parity; KV write conflict telemetry/version mismatch counters. **Mitigation:** Consolidate to one canonical KV schema (or move KB to D1), add versioned writes/CAS pattern, and make import write through the same abstraction used by knowledge routes.
- **Failure mode:** Schema/migration drift between environments. **Trigger:** Calendar/stats rely on `scheduled_at` and updated status constraints, but migration execution is manual per environment. **Symptoms:** Runtime 500s on calendar scheduling queries in stale DBs, or silent stat degradation where scheduling health falls back to zeros. **Detection:** Startup schema-version check in `/api/health` and deployment gate that verifies required migrations. **Mitigation:** Treat migration level as a hard prerequisite for deploy; fail fast on incompatible schema rather than partial fallback.
- **Failure mode:** Unauthorized mutation and cost abuse. **Trigger:** Mutating APIs (posts/knowledge/interview/import) have no auth layer; interview process accepts optional request-provided `x-gemini-key`. **Symptoms:** Unauthorized content mutation, KB poisoning, unexpected Gemini/storage spend spikes, auditability gaps. **Detection:** Write-route audit logs, rate-limit breach alerts, and cost anomaly alarms by endpoint. **Mitigation:** Add authentication/authorization for all mutating endpoints, enforce rate limits and WAF rules, and disable per-request key override in production.
