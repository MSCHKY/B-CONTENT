# 📊 Jules Session Tracker — B/CONTENT

> **Aktualisiert:** 2026-03-26
> **Repo:** `MSCHKY/B-CONTENT`
> **CLI:** `./scripts/jules.sh`

---

## Active Sessions

_No active sessions. All audit PRs have been processed._

---

## Session History

| Datum | Session-ID | Persona | Task | Ergebnis | PR |
|-------|-----------|---------|------|----------|---|
| 2026-03-07 | batch-1 | manual | JSDoc Documentation | ✅ Merged | #2 |
| 2026-03-07 | batch-2 | manual | Input Validation | ✅ Merged | #4 |
| 2026-03-07 | batch-3 | manual | Error Handling | ✅ Cherry-picked | #3 (closed) |
| 2026-03-07 | batch-4 | manual | TypeScript Strict | ❌ Closed (broke build) | #5 (closed) |
| 2026-03-07 | batch-5 | manual | API Documentation | ❌ Closed (scope creep) | #6 (closed) |
| 2026-03-07 | batch-6 | manual | Playwright API Tests | ❌ Closed (wrong assertions) | #7 (closed) |
| 2026-03-07 | 3594320281645123255 | manual | E-003 Knowledge CRUD | ❌ Sandbox reset, code lost | — |
| 2026-03-07 | 15320552779448508024 | manual | E-003 Knowledge CRUD (retry) | ❌ Sandbox reset again | — |
| 2026-03-08 | 18319471948386100645 | manual | Code Cleanup (Audit) | ❌ Closed (duplicated existing onError) | #9 (closed) |
| 2026-03-08 | — | sentinel | 🛡️ Sentinel: XSS Sanitization | ✅ Merged | #10 |
| 2026-03-08 | — | palette | 🎨 Palette: ARIA Labels | ✅ Merged | #11 |
| 2026-03-08 | — | bolt | ⚡ Bolt: useShallow Performance | ✅ Merged | #12 |
| 2026-03-08 | 6241730076080635089 | stahl | 🔩 STAHL: API Test Coverage | ✅ Merged | #13 |
| 2026-03-08 | 6644161972299354233 | zink | 🛡️ ZINK: Global JSON Error Handler | ✅ Merged | #14 |
| 2026-03-08 | 16111870264160609064 | glut | 🔥 GLUT: useShallow Performance | ❌ Closed (duplicate of #12 Bolt) | #15 (closed) |
| 2026-03-08 | 16852091670583670182 | schliff | ✨ SCHLIFF: Card Keyboard A11y | ✅ Merged | #16 |
| 2026-03-08 | 3364864528324354222 | waechter | 🔍 WÄCHTER: TS Type Fix | ✅ Merged | #17 |

---

## Cleanup Session 2026-03-26

Between 2026-03-10 and 2026-03-26, Jules ran unattended and created **64 PRs** (#18–#89).
Without human review, massive duplication occurred.

### Cleanup Results
| Action | Count |
|--------|-------|
| Duplicate PRs closed | 56 |
| Unique PRs merged | 8 |
| Total PRs processed | 64 |

### Merged PRs (2026-03-26)
| PR | Persona | Description |
|----|---------|-------------|
| #85 | WÄCHTER | Hono 4.7.0 → 4.12.9 (CVE fix) |
| #80 | ZINK | secureHeaders middleware on /api/* |
| #89 | SCHLIFF* | ARIA labels in TopicEditor |
| #87 | ZINK* | Pagination DoS fix (Math.min limit 100) |
| #73 | STAHL | Calendar API test coverage |
| #86 | STAHL | Knowledge quotes CRUD tests |
| #88 | GLUT* | Interview import O(1) Map lookups |
| #63 | GLUT* | MonthGrid useMemo Map/Set lookups |

_* Jules used unauthorized aliases (Palette, Sentinel, Bolt). Fixed in core-contract v4._

### Root Cause Analysis
1. **Idempotency check too narrow:** `--limit 10` missed older open PRs → duplicates
2. **No code verification:** Jules didn't check if issues were already fixed in main
3. **Persona name drift:** Jules invented aliases (Bolt, Sentinel, Palette) instead of using assigned names
4. **No lock file discipline:** Multiple PRs bundled unrelated package-lock.json changes

### Config Fixes Applied (core-contract v4)
1. Idempotency: 3-step check (open PRs → merged PRs → verify code on main)
2. PR naming: Strict prefix table, forbidden alias list
3. Command order: Idempotency check BEFORE scan (was after)
4. Boundaries: Explicit ban on unnecessary package-lock.json modifications
5. Persona files: Added "Already Secured/Optimized/Polished" lists to prevent re-discovery

---

## Learnings

| Lesson | Detail |
|--------|--------|
| ✅ Works well | JSDoc, Lint fixes, simple validation, dependency updates, single-file tests |
| ✅ **Persona Audits v3** | **7/9 PRs merged cleanly.** Focused persona prompts (STAHL/ZINK/SCHLIFF/WÄCHTER) produce high-quality PRs. |
| ⚠️ Mixed results | Error handling (needs cherry-pick), API docs |
| ❌ **Duplicate explosion** | 56 duplicate PRs in 16 days of unattended runs. Idempotency check was insufficient. Fixed in v4. |
| ❌ **Persona drift** | Jules renamed personas (Bolt/Sentinel/Palette). Strict naming table now enforced. |
| ❌ Fails often | Complex features (E-003), multi-file state management, sandbox-heavy tasks |
| 🎯 Best practice | Max 5 files per task, explicit build+test commands, clear boundaries |
| 🎯 **Never run unattended >3 days** | Weekly review of open PRs is mandatory. |
| 🔑 Key insight | `automationMode: AUTO_CREATE_PR` + `requirePlanApproval: false` = fastest path |

---

## Stats

| Metric | Value |
|--------|-------|
| Total Sessions (all time) | ~80 |
| PRs Merged (all time) | 17 |
| PRs Closed (all time) | 64 |
| Success Rate (Persona v3, supervised) | **78%** (7/9) |
| Success Rate (unattended, Mar 10-26) | **12.5%** (8/64) |
