# AGENTS.md — B/CONTENT (BenderWire Group)

## Project
AI-powered content generation tool for BenderWire Group, an industrial wire manufacturer (est. 1815).
Generates brand-compliant LinkedIn posts (text + images) for three distinct communication voices (Jürgen Alex, Sebastian Ablas, BenderWire Group corporate page) plus cross-instance website articles.

## Tech Stack
- **Frontend:** React 19 + Vite 7 + TypeScript + Tailwind CSS v4 + Zustand v5
- **Backend:** Hono on Cloudflare Workers + D1 (EU) + R2 (EU)
- **AI:** Google Gemini API (text: gemini-2.0-flash, images: gemini-2.5-flash-image)
- **Brand System:** vDNA tokens (`/assets/vdna/tokens.json`)
- **Icons:** Lucide React (NEVER use emoji in UI)
- **Fonts:** Gilroy (via @font-face from `public/assets/brand/fonts/`)

## Setup
```bash
npm install
npm run dev        # Starts local dev server (port 5173)
npx vite build     # Production build
```

## Architecture
```
B-CONTENT/
├── src/
│   ├── app/                  # React frontend
│   │   ├── components/
│   │   │   ├── ui/           # Design System primitives (Button, Card, Input, Select, Badge, Stepper)
│   │   │   ├── create/       # Create-Flow wizard (4 steps)
│   │   │   ├── library/      # Content Library (archive)
│   │   │   └── knowledge/    # Knowledge Base viewer
│   │   ├── hooks/            # Custom React hooks
│   │   ├── stores/           # Zustand state (app navigation + create-flow wizard)
│   │   ├── types/            # TypeScript type definitions
│   │   └── App.tsx           # Root component
│   ├── data/
│   │   ├── instances/        # 3 communication profiles (JSON config)
│   │   ├── topics/           # 13 topic fields (JSON)
│   │   ├── quotes/           # 29 verified quotes (JSON)
│   │   └── prompts/          # AI system prompts per instance × type
│   └── styles/
│       ├── vdna.css          # AUTO-GENERATED from tokens.json — DO NOT EDIT
│       └── index.css         # App styles
├── worker/
│   ├── routes/
│   │   ├── generate.ts       # AI text/image generation endpoints
│   │   ├── knowledge.ts      # Knowledge base API
│   │   └── posts.ts          # Content library CRUD
│   ├── services/
│   │   ├── gemini.ts         # Gemini API client (text + image)
│   │   └── prompt-builder.ts # Prompt assembly from instance + type + KB context
│   └── index.ts              # Hono app entry
├── db/
│   └── schema.sql            # D1 schema (posts + generated_images tables)
├── tests/
│   └── smoke.spec.ts         # Playwright smoke tests (6 tests)
├── wrangler.toml             # Cloudflare Workers config
└── vite.config.ts            # Vite + Cloudflare plugin config
```

## Coding Rules
1. **Language:** UI labels in German, code + comments + commit messages in English.
2. **NEVER edit** `src/styles/vdna.css` — it is auto-generated from `tokens.json`.
3. **Icons:** Use Lucide React. NEVER use emoji characters in UI components.
4. **Exports:** Prefer named exports and functional React components with hooks.
5. **Styling:** Use Tailwind CSS v4 utility classes. Reuse existing design tokens from vDNA.
6. **Anti-Patchwork:** Do NOT introduce new CSS classes, libraries, or patterns if equivalents already exist.
7. **Brand colors:** Always reference vDNA tokens (e.g., `--color-bwg-blue`, `--color-bwg-steel`). Never hardcode hex values.
8. **Types:** All new code must be fully typed. No `any` types. Use interfaces from `src/app/types/`.
9. **State:** Use Zustand stores for shared state. No prop drilling beyond 2 levels.
10. **API routes:** All Hono routes return typed JSON responses. Error responses use `{ error: string }`.

## Testing
- **Framework:** Playwright (E2E)
- **Existing tests:** `tests/smoke.spec.ts` — use this as a pattern for new tests.
- **Run tests:** `npx playwright test`
- **Coverage focus:** API endpoints (`/api/generate/*`, `/api/posts/*`, `/api/knowledge/*`)

## Deployment
- **Platform:** Cloudflare Workers Builds (native Git integration)
- **Trigger:** Push to `main` = automatic build + deploy
- **Live URL:** https://b-content.maschkeai.workers.dev
- **Root Directory:** `b-content` (monorepo — parent is `BENDERGROUP`)
- **NEVER** run `wrangler deploy` manually.
- **NEVER** set up GitHub Actions CI/CD — Cloudflare has its own pipeline.

## D1 Database Schema
```sql
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  instance_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  topic_fields TEXT NOT NULL,  -- JSON array
  text_content TEXT NOT NULL,
  image_url TEXT,
  language TEXT DEFAULT 'en',
  hashtags TEXT,               -- JSON array
  char_count INTEGER,
  is_personal INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS generated_images (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES posts(id),
  format TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  prompt TEXT,
  r2_key TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## Git Hygiene
- **NEVER** commit `test-results/`, `.last-run.json`, or `trace.zip` files.
- **NEVER** modify `package-lock.json` unless you explicitly changed `package.json`.
- **NEVER** create files outside the `b-content/` directory (the repo root has other modules).
- **ALWAYS** verify your changes build cleanly: `cd b-content && npx vite build` (must show 0 errors).
- **ALWAYS** run existing tests after changes: `cd b-content && npx playwright test` — fix any failures before creating a PR.
- One PR = one logical change. Don't mix features with refactoring or documentation.

## Task Boundaries
- Each task should touch as few files as possible. If your changes affect more than 5 files, reconsider the scope.
- When writing tests, provide ONLY the test file in the PR — no side-effect changes to production code.
- When fixing bugs, explain the root cause in the PR description.
- When adding features, reference the relevant section in `PRODUCT_SPEC.md`.

## Important Context
- This is a tool for a **Fortune-500-level industrial corporation**. Quality matters.
- The three communication instances (Alex, Ablas, BWG) have very different tonal profiles. Review `src/data/instances/` before touching any prompt or content logic.
- The vDNA brand token system is the source of truth for all visual styling. Check `assets/vdna/tokens.json` and `src/styles/vdna.css`.
- Auth is intentionally deferred to Phase 3 (B/WIRE integration). Do NOT add authentication code.
- Error responses MUST use the format `{ error: string, code?: string }`. Use `AppError` class from `worker/services/gemini.ts`.
