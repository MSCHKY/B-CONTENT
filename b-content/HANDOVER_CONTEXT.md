# 🏗️ B/CONTENT — Handover Context

> **Zuletzt aktualisiert:** 2026-03-08 21:45
> **Modul:** B/CONTENT (Content-Gehirn)
> **Status:** Phase 3 IN PROGRESS — Z-002 ✅, Z-003 ✅, Z-005 Analytics ✅ LIVE
> **Branch:** `main` (Workers Builds Git-Integration aktiv)
> **Live URL:** https://b-content.maschkeai.workers.dev
> **Deploy:** Push auf `main` = automatisch live (Workers Builds, Root Dir: `b-content`)

---

## 1. Modul-Überblick

**B/CONTENT** ist das Content-Gehirn der BenderWire Group. Es verwaltet die Wissensbasis (13 Themenfelder, Zitate, Fakten, Anekdoten), beherrscht drei distinkte Kommunikationsstimmen (Alex, Ablas, BWG) und generiert brand-konformen LinkedIn-Content (Text + Bilder) in der richtigen Tonalität.

**Referenz:** Vollständige Spezifikation → `PRODUCT_SPEC.md`

---

## 2. Aktueller Status

### Phase 0: Foundation ✅ DONE
- [x] Modul-Infrastruktur angelegt
- [x] Content-Strategie vom Kunden erhalten und analysiert
- [x] Product Spec geschrieben + bestätigt
- [x] Tech-Stack entschieden
- [x] vDNA mit echten Brand-Werten befüllt
- [x] Wissensbasis extrahiert → `src/data/`
- [x] Kunden-Feedback eingearbeitet
- [x] LinkedIn gecrawlt und analysiert
- [x] Brand-Assets sortiert
- [x] Sprachstrategie geklärt

### Phase 1: MVP — IN PROGRESS
- [x] **Vite-Projekt initialisiert** (React + Hono + Cloudflare + Tailwind v4)
- [x] **vDNA CSS-Tokens** generiert (7 Gilroy @font-face, alle Brand-Farben, Spacing, Radius)
- [x] **TypeScript Types** aus Product Spec Datenmodell
- [x] **D1 Schema** erstellt (posts + generated_images)
- [x] **Design System** — 6 UI-Primitives (Button, Card, Input/Textarea, Select, Badge, Stepper)
- [x] **Layout Shell** — Sidebar (Desktop + Mobile Bottom-Nav) + AppShell
- [x] **Zustand Stores** — App-Navigation + Create-Flow Wizard State
- [x] **Create-Flow UI** — 4-Step Wizard komplett (Instance → Type → Input → Result)
- [x] **Knowledge Base Viewer** — Topics/Quotes/Rules Tabs
- [x] **Hono Worker API** — Generate + Knowledge Routes (Mock-Mode ohne API Key)
- [x] **Build verifiziert** — 0 TS Errors, Vite Build ok, visuell getestet
- [x] **AI System-Prompts** — Base + 3 Instanzen + 11 Content-Typen + Website-Beitrag
- [x] **Prompt-Builder Service** — Runtime-Assembly aus Instanz + Typ + KB-Kontext
- [x] **Gemini Client** — Text-Generierung (gemini-2.0-flash, Retry, EU-Endpoint vorbereitet)
- [x] **Generate-Route verdrahtet** — Mock-Fallback + echte Pipeline + Website-Artikel-Endpoint
- [x] **Playwright Smoke Test** — 9 Tests (App-Load, Navigation, Create-Flow, Knowledge, API, Orchestrate, Stats)
- [x] **Website-Beitrag Format** — Cross-Instance Prompt + API-Endpoint
- [x] **Bild-Generierung** — Gemini 2.5 Flash Image (Imagen 3) + vDNA-Prompt-Builder (7 Schichten)
- [x] **R2 Upload-Pipeline** — Base64 → Binary → R2 PUT mit strukturiertem Key + EU Jurisdiction
- [x] **Content Library** — D1 Persistierung + Archive-UI (Filter, Expand, Copy, Download, Status, Delete)
- [x] **Save-to-Library Flow** — Bewusste Nutzeraktion, kein Auto-Save
- [x] **Generate Image Button** — Im Result-Editor verdrahtet (war Placeholder)
- [x] GitHub Repo + CI/CD ← ✅ Deployed
- [x] Cloudflare D1/R2 angelegt ← ✅ EU Jurisdiction
- [x] Gemini API Key konfiguriert ← ✅ Live

### Phase 2: Features — IN PROGRESS
- [x] **E-001: Content Orchestration** — Dreier-Regel: Parallele 3-Post-Generierung (Alex/Ablas/BWG)
  - [x] Backend: `POST /api/orchestrate` Route (Mock + Live)
  - [x] Frontend: Orchestrate View (Topic-Select, Language, Context-Input, Campaign-Preview)
  - [x] Sidebar: Orchestrate Nav-Item mit Layers-Icon
- [x] **E-002: 4:1 Ratio Tracker** — Content-Health Dashboard
  - [x] Backend: `GET /api/stats` Route (D1-Aggregation)
  - [x] Frontend: Stats Dashboard (Summary-Cards, Ratio-Bars, Topic-Distribution)
  - [x] PlaceholderView ersetzt durch echte Stats-Komponente
- [x] **i18n: DE/EN Sprachumschaltung** — Zero-Dependency, useSyncExternalStore, localStorage-Persistenz
  - [x] 7 View-Komponenten übersetzt (Sidebar, Create, Knowledge, Library, Orchestrate, Stats, InstancePicker)
  - [x] Globe-Toggle in Sidebar-Footer
  - [x] Deutsch als Default
- [x] **E-003: Wissensbasis-Editor (CRUD)** — Manuell umgesetzt (KV Overlay Pattern, 7 API Routes, TopicEditor + QuoteEditor Components)
  - [x] Backend: KV Overlay (`KB_STORE`) für Topics + Quotes CRUD
  - [x] Frontend: Inline-Editing (topic-editor.tsx, quote-editor.tsx) in knowledge-viewer.tsx
  - [x] Rules-Tab: content-rules.json korrekt gerendert (5 Sektionen)
- [x] **Library Archive** — Soft-Delete statt Hard-Delete
  - [x] DELETE archiviert (status='archived'), POST restore, DELETE purge
  - [x] Archiv-Filter im Dropdown, Wiederherstellen + Endgültig löschen Buttons
  - ⚠️ Hono Route-Ordering-Bug gefixed (purge/restore VOR /:id catch-all)
- [ ] Transkript-Import (V2 Feature)

### Phase 3: Zukunfts-Features — IN PROGRESS
- [x] **Z-002: Content-Kalender** — Monats-Grid, Drag & Drop Scheduling, 2-Tage-Regel Konflikterkennung
  - [x] Backend: `calendar.ts` Routes (GET month, PATCH schedule, GET conflicts)
  - [x] D1 Migration: `scheduled_at` Column + `scheduled` Status in CHECK constraint
  - [x] Frontend: CalendarView (Month Grid, DnD, Schedule-Modal, Conflict-Warnings)
  - [x] Sidebar: Kalender-Nav zwischen Bibliothek und Orchestrieren
  - [x] i18n: 13 Calendar Keys (DE + EN) + `scheduled` Status-Label
  - [x] Drag-to-Unschedule: Drop-Zone auf Ungeplante-Beiträge-Sektion
- [x] **Z-003: Interview-Pipeline** (Audio → Transkription → KB) — Wave 1
  - [x] Backend: D1 Migration (`interviews` Tabelle), 3 API Routes (process, import, history)
  - [x] Gemini `transcribeAndExtract`: Single-Call Audio-Transkription + Fakten-Extraktion
  - [x] Frontend: InterviewView (State Machine: idle→upload→processing→review→import→done)
  - [x] Sidebar: Mic-Icon zwischen Wissen und Bibliothek
  - [x] i18n: 25 Interview Keys (DE + EN)
  - [x] Import-Feedback: Affected Topic Fields + "Wissensbasis öffnen" Button
  - ⚠️ iPhone `audio/x-m4a` MIME-Type Hotfix deployed
- [ ] **Z-001: Review-Workflow** — Wave 2 (benötigt Auth/CF Access)
- [x] **Z-005: Analytics Dashboard** — Wave 3
  - [x] Backend: 4 neue D1-Queries (Timeline, Content-Type Breakdown, Cadence, Scheduling Health)
  - [x] Frontend: ActivityTimeline, ContentTypeBreakdown, SchedulingRing, 6 SummaryCards
  - [x] i18n: 11 neue Keys (DE + EN)
  - [x] Scheduling Query try-catch für DB-Migration-Resilienz
- [ ] **E-005: Template-Builder** — Wave 3

---

## 3. Tech-Stack (bestätigt + implementiert)

| Komponente | Technologie | Status |
|-----------|-------------|--------|
| Frontend | React 19 + Vite 6.4 + TypeScript | ✅ Implementiert |
| Styling | Tailwind CSS v4 + vDNA Tokens | ✅ Implementiert |
| State Management | Zustand v5 | ✅ Implementiert |
| Backend/API | Hono + @cloudflare/vite-plugin | ✅ Live |
| AI Text | Google Gemini API (gemini-2.0-flash) | ✅ Live |
| AI Bild | Google Gemini API (gemini-2.5-flash-image) | ✅ Live |
| Datenbank | Cloudflare D1 (EU Region) | ✅ Live (posts + generated_images) |
| File Storage | Cloudflare R2 (b-content-images, EU) | ✅ Live |
| Hosting | Cloudflare Workers | ✅ b-content.maschkeai.workers.dev |
| Auth (V1) | Keine (ggf. CF Access) → Phase 3 | ⏸️ Deferred |
| Brand-System | vDNA (`/assets/vdna/tokens.json`) | ✅ CSS-Tokens + Image-Prompts |

---

## 4. Entscheidungen (diese Session)

| Entscheidung | Ergebnis |
|-------------|---------|
| Routing | **State-basiert** (kein React Router) — reicht für V1, weniger Overhead |
| State Management | **Zustand** — typed, skaliert, minimal |
| Font-Einbindung | Gilroy via @font-face OTF — Web-Lizenz unklar, für internen Gebrauch ok |
| Wissensbasis-API | Statische JSON-Imports, kein D1 für KB in V1 |
| AI API Budget | **Kein Limit** — „was es braucht" (Marco) |
| Nutzerkreis V1 | **Nur Marco + Lisa** (Grafikerin), NICHT Alex/Ablas direkt |
| GF-Freigabe | Nicht im MVP, Marco sendet per Teams |

---

## 5. Neues Feedback Marco (2026-03-06 17:07)

> ✅ In AI-Pipeline eingearbeitet (Website-Beitrag Prompt + Endpoint)

| Punkt | Detail | Impact |
|-------|--------|--------|
| **Website-Beitrag** | Neues Format: kurze Pressemitteilung für Website, periodisch aus Themen generiert | Product Spec §3.4 aktualisiert ✅ |
| **Bild-Gap** | Keine professionellen Fotos vorhanden. Nur Selfies/Schnappschüsse oder AI-generiert | Bildsprache entwickeln, AI-Bildgenerierung priorisieren |
| **Bildformat** | Hochformat (Regelfall), aber flexibel | Bereits unterstützt (LINKEDIN_FORMATS) |
| **Transkript-Import** | Monatliche Interviews als Transkript, sollen ins Tool geladen werden können | V2 Feature, Backlog-Item |
| **Canva Templates** | Keine vorhanden, entstehen gerade | Kein Blocker |
| **CD Manual** | Existiert als PDF, wird hochgeladen | Assets abwarten |
| **API Budget** | „Kein Limit, was es braucht" | Kein Blocker, großzügig dimensionieren |

---

## 6. Invarianten

1. **Content-Gehirn:** Drei Kommunikationsinstanzen (Alex, Ablas, BWG) + Website-Beitrag
2. **Wissensbasis-gespeist:** AI generiert mit Kontext aus der Knowledge Engine
3. **DSGVO-konform:** Cloudflare EU-Region, Gemini EU-Endpoint (Vertex AI)
4. **Core-Ready:** Auth, API, DB so abstrahiert, dass B/WIRE-Integration möglich ist
5. **Brand-konform:** Alle generierten Assets nutzen vDNA-Tokens
6. **Export-First:** Generierte Inhalte sofort downloadbar
7. **Anti-Patchwork:** Kein Feature ohne Eintrag im Product Spec
8. **Instanzen als JSON-Config:** Neue Stimmen/Typen/Themen sind Config-Änderung, kein Code-Umbau
9. **Deployment-Standard:** Push auf `main` = Live — Cloudflare Workers Builds, KEIN manuelles Deploy, KEIN CI/CD-Workaround

---

## 7. Blocker

| Blocker | Status | Impact |
|---------|--------|--------|
| ~~GitHub Repo fehlt~~ | ✅ Gelöst | github.com/MSCHKY/B-CONTENT |
| ~~D1 + R2 nicht erstellt~~ | ✅ Gelöst (EU Jurisdiction) | D1 Schema deployed, R2 live |
| ~~Gemini API Key fehlt~~ | ✅ Gelöst | Text + Bild-Generierung live |
| ~~Bild-Generierung~~ | ✅ Gelöst | Gemini 2.5 Flash Image + vDNA-Prompts + R2 Upload |
| Gilroy Web-Lizenz | ✅ Intern gelöst | CF Access schützt App — nur für Public Deploy relevant |
| ~~Bildmaterial~~ | ✅ Gelöst (AI) | AI-Generierung mit vDNA-Brand-Fragmenten live |
| ~~CD Manual PDF~~ | ✅ Gelöst | `assets/brand/BenderWireGroup_Styleguide_2025.pdf` — vDNA-Abgleich: 100% Match |
| ~~Cloudflare Access~~ | ✅ Gelöst | Zero Trust Self-Hosted App, Team-Policy (Robert + Lisa) |
| ~~Assets 404~~ | ✅ Gelöst | Fonts + Logo in `public/assets/brand/`, Lucide Icons |

---

## 8. Session-Log

| Datum      | Session-Typ | Thema                           | Ergebnis |
|------------|-------------|---------------------------------|----------|
| 2026-03-06 | Planning    | Modul-Infrastruktur aufgesetzt  | ✅ Done  |
| 2026-03-06 | Planning    | Strategy Doc → Product Spec, vDNA, Wissensbasis | ✅ Done |
| 2026-03-06 | Planning    | Kunden-Feedback, Assets sortiert, LinkedIn-Analyse | ✅ Done |
| 2026-03-06 | Execution   | Phase A+B: Projekt-Setup + Design System + Create-Flow + Knowledge | ✅ Done |
| 2026-03-06 | Follow-up   | Marco-Feedback: Website-Beitrag, Bild-Gap, User-Scope, Budget | ✅ Dokumentiert |
| 2026-03-06 | Execution   | AI-Pipeline: System-Prompts + Prompt-Builder + Gemini Client + Smoke Test | ✅ Done |
| 2026-03-06 | Ops         | GitHub Push + D1/R2 (EU) + Gemini Key + First Deploy + E2E Test | ✅ Live |
| 2026-03-06 | Execution   | Bild-Pipeline (Gemini Image + R2 + vDNA Prompts) + Content Library (D1 + UI) | ✅ Live |
| 2026-03-06 | Polish      | Visual Premium Upgrade: Glassmorphism, Micro-Animations, Logo, Gradient Accents (14 Dateien) | ✅ Deployed |
| 2026-03-06 | Ops         | Deployment-Standard verankert: Workers Builds + Git-Integration, kein Sonderweg | ✅ Dokumentiert |
| 2026-03-07 | Maintenance | Styleguide↔vDNA Compliance (100%), Assets-Fix (Fonts+Logo), Lucide Icons, CF Access, Jules Research | ✅ Deployed |
| 2026-03-07 | Integration | Jules AI Agent: AGENTS.md, CLI Script, Prompt Library (12 Templates), 7 Tasks delegiert | ✅ Live |
| 2026-03-07 | Review      | Jules PR-Review: 3 gemerged (JSDoc+Validation+ErrorHandling), 3 closed, Code-Hardening cherry-picked, Prompt Library → 4 Drahtwerk-Personas | ✅ Done |
| 2026-03-07 | QA + Bugfix | Live Smoke Test: AI-Gen ✅, Save-to-Library-Bug gefixt (Validation + Silent Fail), Image-JOIN in Library, GEMINI_API_KEY persistent via REST API | ✅ Deployed |
| 2026-03-07 | Phase 2     | E-001 Orchestrate (Dreier-Regel) + E-002 Stats (4:1 Ratio Tracker): Backend + Frontend + Tests | ✅ Build OK |
| 2026-03-07 | Feature     | i18n: DE/EN Sprachumschaltung (7 Views, Globe-Toggle, localStorage), Stats-Bug gefixt (instance_id→instance), Library Emoji→Lucide Icons | ✅ Deployed |
| 2026-03-07 | Delegation  | Jules E-003 Knowledge CRUD: 2× gescheitert (Sandbox-Reset, Code verloren). Session 1: `3594320281645123255`, Session 2: `15320552779448508024` — AWAITING_USER_FEEDBACK | ❌ Fehlgeschlagen |
| 2026-03-07 | Execution   | E-003 manuell umgesetzt: Knowledge CRUD (KV Overlay + 7 API Routes + TopicEditor + QuoteEditor + knowledge-viewer rewrite + i18n 16 Keys) | ✅ Deployed |
| 2026-03-07 | Feature     | Library Archive: Soft-Delete, Restore, Purge + Hono Route-Ordering-Bugfix | ✅ Deployed |
| 2026-03-08 | QA/Audit    | Multi-Model Code Audit: Opus (Architektur), Sonnet (Hygiene), Gemini (Security), Codex (Tests) + Jules delegiert | ✅ 4/5 done, Jules IN_PROGRESS |
| 2026-03-08 | Hardening   | Audit Batch 1+2: Global Error Handler, API Key→Header, CORS, R2 Validation, Sanitization, Pagination, Error Masking | ✅ 7/13 Findings gefixt, deployed |
| 2026-03-08 | Tooling     | Jules Workflow V2→V3: API-CLI (`scripts/jules.sh`), Prompt V3 (Core Contract + Persona Lens), 7 Scheduled Tasks, 60+ alte Sessions bereinigt | ✅ Committed + deployed |
| 2026-03-08 | Review      | Jules Audit Batch 3: 9 PRs reviewed — 7 merged (#10-#14, #16, #17), 2 closed (#9 dup onError, #15 dup useShallow). Perf, Security, A11y, Tests. | ✅ 0 open PRs |
| 2026-03-08 | Bugfix      | Archive 500 on Production: D1 CHECK constraint missing 'archived' status. Migration applied, Archive/Restore/Purge verifiziert. | ✅ Fixed + Verified |
| 2026-03-08 | Planning    | Phase 3 Roadmap: 3-Wave-Strategie (Calendar→Interview→Review→Analytics→Templates). Z-002 priorisiert. | ✅ Plan erstellt + genehmigt |
| 2026-03-08 | Execution   | Z-002 Content-Kalender: 3 API-Routes, CalendarView Component (380 Zeilen), D1 Migration (scheduled_at + status CHECK), Drag & Drop, Conflict Detection | ✅ Live + Verifiziert |
| 2026-03-08 | Polish      | Calendar Drag-to-Unschedule: Drop-Zone auf Ungeplante-Beiträge-Sektion mit visuellem Feedback | ✅ Deployed |
| 2026-03-08 | Execution   | Z-003 Interview-Pipeline: D1 Migration, Gemini Audio Service, 3 API Routes, InterviewView UI (594 Zeilen), Sidebar + i18n (25 Keys) | ✅ Live |
| 2026-03-08 | Hotfix      | iPhone audio/x-m4a MIME-Type Fix + Import-Feedback Polish (affected topics + KB-Link) | ✅ Deployed |
| 2026-03-08 | Feature     | Z-005 Analytics Dashboard: 4 D1-Queries (Timeline/Content-Types/Cadence/Scheduling), 4 Chart-Komponenten, 6 SummaryCards, 11 i18n Keys | ✅ Live |
| 2026-03-08 | Bugfix      | Sidebar fixed positioning: .sidebar-glow position:relative entfernt, sticky→fixed, overflow-hidden→overflow-x-clip | ✅ Deployed |
| 2026-03-08 | Hardening   | Audit Critical Fixes: 7 Silent-Fail-Catches → Error-Feedback, Dev-Mock-Leak → DEV-only, getElementById → useRef, response.ok Checks, 3 i18n-Strings | ✅ Deployed |
| 2026-03-08 | Refactoring | Audit Fixes Batch 2: Shared Constants (`src/shared/constants.ts`, 11 Exports, 8 Dateien), KV try/catch, Error Boundary, 9 i18n-Keys, 6 Inline-Strings eliminiert | ✅ Deployed |
| 2026-03-08 | Refactoring | Component Splitting: 5 übergroße Komponenten (stats 579→236, knowledge 498→95, interview 624→303, calendar 536→216, library 374→197) in 22 fokussierte Sub-Dateien zerlegt. `/split` Workflow erstellt. | ✅ Build OK |

### ⚠️ Bekannte Probleme
- **6 Audit-Findings bewusst deferred:** KV Race Condition (#1), Rate Limiting (#5), DSGVO Gemini EU (#6), KV Jurisdiction (#7), POST Idempotenz (#12), REST-Konsistenz (#13).
- **Portable Audit System** — Tracker #28: Core Contract als projektübergreifendes Template (eigene Session).
