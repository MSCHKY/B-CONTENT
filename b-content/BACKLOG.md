# 📋 B/CONTENT — Backlog

> **Zuletzt aktualisiert:** 2026-03-08 14:42
> **Referenz:** `PRODUCT_SPEC.md` für vollständige Feature-Beschreibungen

---

## ✅ Phase 0: Foundation — DONE

| ID    | Prio | Aufgabe                                          | Status      |
|-------|------|--------------------------------------------------|-------------|
| F-001 | P0   | Kunden-Feedback einholen (10 Fragen gesendet)    | ✅ Done     |
| F-002 | P0   | Product Spec bestätigen ("Was es NICHT ist")      | ✅ Done     |
| F-003 | P0   | Brand-Assets einsammeln (Logos, Gilroy, Fotos)    | ✅ Done     |
| F-004 | P0   | Web-Recherche vom Kunden bestätigen lassen        | 🟡 Teilweise |
| F-005 | P1   | Vite-Projekt initialisieren (React+Hono+CF)      | ✅ Done     |
| F-006 | P1   | D1 Datenbank-Schema erstellen                    | ✅ Done     |
| F-007 | P1   | AI System-Prompts schreiben (pro Instanz × Typ)  | ✅ Done     |
| F-008 | P2   | CI/CD (GitHub → CF Workers Builds)               | ✅ Done     |

---

## 🟡 Phase 1: MVP — Content-Gehirn (NEAR COMPLETE)

Entspricht Features F1-F6 aus PRODUCT_SPEC.md:

| ID    | Prio | Aufgabe                                          | Feature | Status    |
|-------|------|--------------------------------------------------|---------|-----------|
| M-001 | P0   | Instanz-Auswahl (Alex/Ablas/BWG)                 | F1      | ✅ Done   |
| M-002 | P0   | Content-Type-Auswahl (dynamisch pro Instanz)     | F2      | ✅ Done   |
| M-003 | P0   | Text-Generator mit Tonalitäts-Profilen           | F3      | ✅ Done   |
| M-004 | P0   | Bild-Generator (Gemini 2.5 Flash Image)          | F4      | ✅ Done   |
| M-005 | P1   | Export (PNG/JPG + Klartext)                       | F5      | ✅ Done   |
| M-006 | P1   | Wissensbasis-Viewer (read-only)                  | F6      | ✅ Done   |
| M-007 | P1   | Create-Flow UI (4-Step Wizard)                   | —       | ✅ Done   |
| M-008 | P2   | Smoke Test (Playwright)                          | —       | ✅ Done   |
| M-009 | P2   | Visual Premium Polish (Glassmorphism, Animations) | —       | ✅ Done   |

---

## 🟢 Phase 2: Erweiterungen (IN PROGRESS)

Entspricht Features F7-F11 aus PRODUCT_SPEC.md:

| ID    | Prio | Aufgabe                                          | Feature | Status    |
|-------|------|--------------------------------------------------|---------|-----------|
| E-001 | P1   | Content-Orchestrierung (Dreier-Regel)            | F7      | ✅ Done   |
| E-002 | P1   | 4:1 Ratio Tracker                                | F8      | ✅ Done   |
| E-003 | P2   | Wissensbasis-Editor (CRUD)                       | F9      | ✅ Done (KV Overlay + manuell) |
| E-004 | P2   | Post-History / Archiv                            | F10     | ✅ Done (MVP) |
| E-005 | P3   | Template-Builder (visuell)                       | F11     | 🔲 Offen  |
| E-006 | P1   | Jules AI Agent Integration (AGENTS.md + API + CLI + Prompts) | —       | ✅ Done   |

---

## 🔵 Phase 3: Zukunft (UNGEPLANT)

Entspricht Features F12-F17 aus PRODUCT_SPEC.md:

| ID    | Prio | Aufgabe                                          | Feature | Status    |
|-------|------|--------------------------------------------------|---------|-----------|
| Z-001 | P3   | Review-Workflow (benötigt Auth)                  | F12     | 🔲 Offen  |
| Z-002 | P1   | Content-Kalender                                 | F13     | ✅ Done   |
| Z-003 | P2   | Interview-Pipeline (Audio→Transkription→KB)      | F14     | ✅ Done   |
| Z-004 | P3   | Multi-Channel (Instagram, X)                     | F15     | 🔲 Offen  |
| Z-005 | P3   | Analytics                                        | F16     | 🔲 Offen  |
| Z-006 | P3   | B/WIRE Integration                               | F17     | 🔲 Offen  |

---

## ✅ Erledigt

| ID    | Aufgabe                                          | Erledigt   |
|-------|--------------------------------------------------|------------|
| —     | Projekt-Infrastruktur angelegt                   | 2026-03-06 |
| —     | Content-Strategie analysiert                     | 2026-03-06 |
| —     | Product Spec geschrieben                         | 2026-03-06 |
| —     | Tech-Stack entschieden                           | 2026-03-06 |
| —     | vDNA mit echten Brand-Werten befüllt             | 2026-03-06 |
| —     | Wissensbasis extrahiert (Themenfelder, Zitate, Profile, Regeln) | 2026-03-06 |
| —     | Web-Recherche (unconfirmed) durchgeführt         | 2026-03-06 |
| —     | Fragebogen an Kunden gesendet                    | 2026-03-06 |
| —     | Vite-Projekt initialisiert + Design System + Create-Flow + Knowledge | 2026-03-06 |
| —     | AI System-Prompts (3 Instanzen × 11 Content-Typen + Website-Beitrag) | 2026-03-06 |
| —     | Prompt-Builder Service + Gemini Client + Generate-Route | 2026-03-06 |
| —     | Playwright Smoke Test (9 Tests)                  | 2026-03-07 |
| —     | Bild-Generierung (Gemini 2.5 Flash Image + vDNA-Prompts) | 2026-03-06 |
| —     | R2 Upload-Pipeline (EU Jurisdiction)             | 2026-03-06 |
| —     | Content Library (D1 + Archive-UI + Save-to-Library) | 2026-03-06 |
| —     | Deploy + E2E verifiziert (b-content.maschkeai.workers.dev) | 2026-03-06 |
| —     | Visual Premium Polish (Glassmorphism, Micro-Animations, Logo, Gradients) | 2026-03-06 |
| —     | CI/CD: Workers Builds + Git-Integration (push=live) | 2026-03-06 |
| —     | Brand-Assets in public/ (Fonts + Logo 404 gefixt) | 2026-03-07 |
| —     | Lucide React Icons (Emojis → SVG)                | 2026-03-07 |
| —     | vDNA–Styleguide Compliance Report dokumentiert   | 2026-03-07 |
| —     | Jules AI Integration (AGENTS.md + CLI + Prompt Library + 7 Tasks delegiert) | 2026-03-07 |
| —     | Jules PR-Review: 3 gemerged (JSDoc, Validation, Error Handling), 3 closed | 2026-03-07 |
| —     | AGENTS.md gehärtet (Git Hygiene, Task Boundaries, AppError) | 2026-03-07 |
| —     | Prompt Library: 12 Task-Prompts → 4 Drahtwerk-Personas (STAHL/GLUT/ZINK/SCHLIFF) | 2026-03-07 |
| —     | Live Smoke Test bestanden (AI-Generierung E2E verifiziert) | 2026-03-07 |
| —     | GEMINI_API_KEY persistent gelöst (REST API statt wrangler versions) | 2026-03-07 |
| —     | Save-to-Library Bug gefixt (Validation zu streng + Silent Fail → Error-Feedback) | 2026-03-07 |
| —     | Library Image-JOIN gefixt (LEFT JOIN auf generated_images) | 2026-03-07 |
| —     | E-001: Content Orchestration (Dreier-Regel) — API + Frontend | 2026-03-07 |
| —     | E-002: 4:1 Ratio Tracker — API + Dashboard       | 2026-03-07 |
| —     | i18n: DE/EN Sprachumschaltung (7 Views, Globe-Toggle, useSyncExternalStore) | 2026-03-07 |
| —     | Stats-Bug gefixt (instance_id → instance in SQL)  | 2026-03-07 |
| —     | Library: Emoji-Buttons → Lucide Icons (Copy, Download, Trash2, RefreshCw) | 2026-03-07 |
| —     | E-003 Knowledge CRUD: KV Overlay + 7 API Routes + TopicEditor + QuoteEditor + i18n 16 Keys | 2026-03-07 |
| —     | Library Archive: Soft-Delete, Restore, Purge + Hono Route-Ordering Fix | 2026-03-07 |
| —     | Multi-Model Code Audit: 14 Findings gefixt, 6 deferred, Jules PRs reviewed | 2026-03-08 |
| —     | Z-002: Content-Kalender (Month Grid, Drag & Drop, 2-Day Rule Conflicts, 3 API Routes) | 2026-03-08 |
| —     | Z-003: Interview-Pipeline (Gemini Audio, 3 API Routes, InterviewView, i18n 25 Keys) | 2026-03-08 |
