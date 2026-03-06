# 📋 B/CONTENT — Backlog

> **Zuletzt aktualisiert:** 2026-03-06
> **Referenz:** `PRODUCT_SPEC.md` für vollständige Feature-Beschreibungen

---

## 🔴 Phase 0: Foundation (AKTIV — Warten auf Kunden-Feedback)

| ID    | Prio | Aufgabe                                          | Status      |
|-------|------|--------------------------------------------------|-------------|
| F-001 | P0   | Kunden-Feedback einholen (10 Fragen gesendet)    | ⏳ Wartend  |
| F-002 | P0   | Product Spec bestätigen ("Was es NICHT ist")      | ⏳ Wartend  |
| F-003 | P0   | Brand-Assets einsammeln (Logos, Gilroy, Fotos)    | ⏳ Wartend  |
| F-004 | P0   | Web-Recherche vom Kunden bestätigen lassen        | 🔲 Offen   |
| F-005 | P1   | Vite-Projekt initialisieren (React+Hono+CF)      | 🔲 Offen   |
| F-006 | P1   | D1 Datenbank-Schema erstellen                    | 🔲 Offen   |
| F-007 | P1   | AI System-Prompts schreiben (pro Instanz × Typ)  | 🔲 Offen   |
| F-008 | P2   | CI/CD Pipeline (GitHub → CF Pages) einrichten    | 🔲 Offen   |

---

## 🟡 Phase 1: MVP — Content-Gehirn (WARTEND auf Phase 0)

Entspricht Features F1-F6 aus PRODUCT_SPEC.md:

| ID    | Prio | Aufgabe                                          | Feature | Status    |
|-------|------|--------------------------------------------------|---------|-----------|
| M-001 | P0   | Instanz-Auswahl (Alex/Ablas/BWG)                 | F1      | 🔲 Offen  |
| M-002 | P0   | Content-Type-Auswahl (dynamisch pro Instanz)     | F2      | 🔲 Offen  |
| M-003 | P0   | Text-Generator mit Tonalitäts-Profilen           | F3      | 🔲 Offen  |
| M-004 | P0   | Bild-Generator (Gemini 2.5 Flash Image)          | F4      | ✅ Done   |
| M-005 | P1   | Export (PNG/JPG + Klartext)                       | F5      | ✅ Done   |
| M-006 | P1   | Wissensbasis-Viewer (read-only)                  | F6      | ✅ Done   |
| M-007 | P1   | Create-Flow UI (4-Step Wizard)                   | —       | ✅ Done   |
| M-008 | P2   | Smoke Test (Playwright)                          | —       | ✅ Done   |

---

## 🟢 Phase 2: Erweiterungen (WARTEND)

Entspricht Features F7-F11 aus PRODUCT_SPEC.md:

| ID    | Prio | Aufgabe                                          | Feature | Status    |
|-------|------|--------------------------------------------------|---------|-----------|
| E-001 | P1   | Content-Orchestrierung (Dreier-Regel)            | F7      | 🔲 Offen  |
| E-002 | P1   | 4:1 Ratio Tracker                                | F8      | 🔲 Offen  |
| E-003 | P2   | Wissensbasis-Editor (CRUD)                       | F9      | 🔲 Offen  |
| E-004 | P2   | Post-History / Archiv                            | F10     | ✅ Done (MVP) |
| E-005 | P3   | Template-Builder (visuell)                       | F11     | 🔲 Offen  |

---

## 🔵 Phase 3: Zukunft (UNGEPLANT)

Entspricht Features F12-F17 aus PRODUCT_SPEC.md:

| ID    | Prio | Aufgabe                                          | Feature | Status    |
|-------|------|--------------------------------------------------|---------|-----------|
| Z-001 | P3   | Review-Workflow (benötigt Auth)                  | F12     | 🔲 Offen  |
| Z-002 | P3   | Content-Kalender                                 | F13     | 🔲 Offen  |
| Z-003 | P3   | Interview-Pipeline (Audio→Transkription→KB)      | F14     | 🔲 Offen  |
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
| —     | Playwright Smoke Test (6 Tests)                  | 2026-03-06 |
| —     | Bild-Generierung (Gemini 2.5 Flash Image + vDNA-Prompts) | 2026-03-06 |
| —     | R2 Upload-Pipeline (EU Jurisdiction)             | 2026-03-06 |
| —     | Content Library (D1 + Archive-UI + Save-to-Library) | 2026-03-06 |
| —     | Deploy + E2E verifiziert (b-content.maschkeai.workers.dev) | 2026-03-06 |
