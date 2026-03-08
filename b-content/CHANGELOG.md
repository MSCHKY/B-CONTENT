# Changelog

All notable changes to B/CONTENT will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-beta.0](https://github.com/MSCHKY/B-CONTENT/compare/v0.3.0...v1.0.0-beta.0) (2026-03-08)

### Features

* **Z-005 Analytics Dashboard:** activity timeline, content-type breakdown, cadence tracker, scheduling health ring, 6 summary cards
* **Z-003 Interview Pipeline:** audio upload, Gemini transcription & fact extraction, KB import with affected-topic feedback
* **Z-002 Content Calendar:** month grid with drag & drop scheduling, 2-day rule conflict detection, drag-to-unschedule
* **Pitch polish:** complete i18n localization (DE/EN), empty-state UX improvements

### Bug Fixes

* Sidebar stays fixed on scroll — removed position:relative from sidebar-glow
* iPhone audio/x-m4a MIME type accepted in interview pipeline
* Archive 500 on production — added 'archived' to D1 CHECK constraint

### Code Quality

* **Audit remediation:** 7 silent-fail catches → error feedback, dev mock leak removed, useRef migration, response.ok checks
* **Shared constants:** 11 exports consolidated into `src/shared/constants.ts`, 8 files refactored
* **Error Boundary:** global React error boundary with i18n support
* **Component splitting:** 5 oversized components split into 22 focused sub-files (total reduction ~1600 lines)

## [0.3.0](https://github.com/MSCHKY/B-CONTENT/compare/v0.2.0...v0.3.0) (2026-03-07)

### Features

* **E-001 Content Orchestration:** "Dreier-Regel" — parallel 3-post generation across Alex/Ablas/BWG
* **E-002 4:1 Ratio Tracker:** content health dashboard with summary cards, ratio bars, topic distribution
* **E-003 Knowledge CRUD:** KV Overlay pattern, 7 API routes, inline TopicEditor + QuoteEditor
* **Library Archive:** soft-delete, restore, purge with Hono route-ordering fix
* **i18n:** DE/EN language switching across 7 views, globe toggle in sidebar footer

### Bug Fixes

* Stats instance_id → instance SQL column fix
* Save-to-Library validation too strict + silent fail → error feedback
* Library image LEFT JOIN on generated_images
* GEMINI_API_KEY persistent via Cloudflare REST API

### Code Quality

* Jules AI integration: AGENTS.md, CLI script, prompt library (12 templates → 4 Drahtwerk personas)
* Jules PR review: 3 merged (JSDoc, validation, error handling), 3 closed

## [0.2.0](https://github.com/MSCHKY/B-CONTENT/compare/v0.1.0...v0.2.0) (2026-03-06)

### Features

* **AI text generation:** Gemini 2.0 Flash with instance-specific system prompts and prompt builder
* **AI image generation:** Gemini 2.5 Flash Image (Imagen 3) with 7-layer vDNA prompt builder
* **R2 upload pipeline:** Base64 → binary → R2 PUT with structured keys, EU jurisdiction
* **Content Library:** D1 persistence, archive UI (filter, expand, copy, download, status badges)
* **Save-to-Library flow:** explicit user action, no auto-save
* **Website article format:** cross-instance prompt + dedicated API endpoint

### Visual

* **Premium polish:** glassmorphism cards, micro-animations, gradient accents, logo glow, Gilroy typography
* **Deployment standard:** Workers Builds with native Git integration documented and enforced

## 0.1.0 (2026-03-06)

### Features

* **Project foundation:** Vite 7 + React 19 + Hono + Cloudflare Workers + Tailwind CSS v4
* **vDNA CSS tokens:** 7 Gilroy @font-face declarations, all brand colors, spacing, radius
* **Design system:** 6 UI primitives (Button, Card, Input/Textarea, Select, Badge, Stepper)
* **Layout shell:** desktop sidebar + mobile bottom-nav + AppShell
* **Create-Flow:** 4-step wizard (Instance → Type → Input → Result)
* **Knowledge Base Viewer:** topics, quotes, and content rules tabs
* **Worker API:** generate + knowledge routes with mock mode
* **D1 schema:** posts + generated_images tables
* **Playwright smoke test:** 9 tests covering app load, navigation, create-flow, knowledge, API
