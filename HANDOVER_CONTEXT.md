# 🏗️ BENDERWIRE GROUP — Handover Context

> **Zuletzt aktualisiert:** 2026-03-08 12:50
> **Aktiver Fokus:** B/CONTENT (Content-Gehirn) — Phase 2 near complete, **Jules Workflow V3 live (API-CLI + Scheduled Tasks)**
> **Phase:** Pitch / MVP

---

## 1. Projekt-Überblick

Die **BenderWire Group** bekommt ein modulares Tool-Ökosystem. Langfristig wird ein Core-System (**B/WIRE**) gebaut, an das einzelne Module andocken.

**Da wir uns in der Pitch-Phase befinden**, wird das erste Modul **B/CONTENT** vorab gebaut — aber mit klarer Architektur, die spätere Integration in B/WIRE ermöglicht.

### Modul-Landschaft (geplant)

| Modul      | Status     | Beschreibung                                     |
|------------|------------|--------------------------------------------------|
| **B/WIRE** | 🔲 Geplant | Core-Ökosystem, Hub für alle Module              |
| **B/CONTENT** | 🟡 Aktiv | Content-Gehirn für Marketing (LinkedIn-fokus)    |

---

## 2. B/CONTENT — Content-Gehirn

### Zweck
B/CONTENT ist das Content-Gehirn der BenderWire Group. Es:
- Verwaltet die **Wissensbasis** (13 Themenfelder, Zitate, Fakten, Anekdoten)
- Beherrscht **drei Kommunikationsstimmen** (Jürgen Alex, Sebastian Ablas, BWG-Seite)
- Generiert **brand-konformen LinkedIn-Content** (Text + Bilder) in der richtigen Tonalität

Vollständige Spezifikation → `B-CONTENT/PRODUCT_SPEC.md`

### Tech-Stack (entschieden)
- **Frontend:** React + Vite v7 + TypeScript + Tailwind CSS v4
- **Backend:** Hono + Cloudflare Workers + D1 (EU)
- **AI:** Google Gemini API (Text + Bilder)
- **Brand-System:** vDNA (`assets/vdna/tokens.json`)

### Status
- [x] Projekt-Infrastruktur angelegt
- [x] Content-Strategie vom Kunden erhalten und analysiert
- [x] Product Spec geschrieben (Feature-Map, Datenmodell, UI-Konzept)
- [x] Tech-Stack entschieden
- [x] vDNA mit echten Brand-Werten befüllt
- [x] Wissensbasis extrahiert (13 Themenfelder, 29 Zitate, 3 Profile, Regeln)
- [x] Web-Recherche durchgeführt (unconfirmed, TBD Kunden-Bestätigung)
- [x] Fragebogen an Kunden gesendet + Feedback erhalten
- [x] Product Spec bestätigt
- [x] Brand-Assets sortiert (Logos, Fonts, Icons, CD Manual)
- [x] LinkedIn gecrawlt und analysiert
- [x] Sprachstrategie geklärt (EN default, DE für ausgewählte Kategorien)
- [x] Projekt initialisiert (Vite/React + Tailwind v4 + Zustand + Hono)
- [x] Design System + Layout Shell gebaut (6 UI-Primitives, Sidebar, AppShell)
- [x] Create-Flow UI (4-Step Wizard) + Knowledge Viewer
- [x] Worker API Skeleton (Generate + Knowledge Routes, Mock-Mode)
- [x] Build verifiziert (0 TS Errors, Vite Build ok)
- [x] AI System-Prompts + Prompt-Builder + Gemini Client ✅
- [x] Bild-Generierung (Gemini 2.5 Flash Image) + R2 Upload ✅
- [x] Content Library (D1 Persistierung + Archive-UI) ✅
- [x] Deploy + E2E verifiziert ✅
- [x] **Phase 2:** E-001 Content Orchestration (Dreier-Regel) + E-002 4:1 Ratio Tracker ✅
- [x] **Phase 2:** E-003 Knowledge Editor (CRUD) + Library Archive (Soft-Delete) ✅

---

## 3. Invarianten (NICHT brechen!)

1. **Modul-Unabhängigkeit:** Jedes Modul ist eigenständig deploybar
2. **Core-Ready:** Auth, API, DB so abstrahiert, dass B/WIRE-Integration möglich ist
3. **Brand-Konsistenz:** Alle Module nutzen vDNA-Tokens aus `/assets/vdna/`
4. **DSGVO-konform:** Cloudflare EU-Region, Gemini EU-Endpoint
5. **Deutsche Kommunikation:** Chat/Reasoning auf Deutsch, Code/Commits auf Englisch
6. **Anti-Patchwork:** Kein Feature ohne Eintrag im Product Spec
7. **Anti-Kabelsalat:** Product Spec ist der Vertrag. Kein Feature wird drangeflickt.
8. **Deployment-Standard:** Push auf `main` = Live. Immer. Punkt. (→ siehe §3a)

### 3a. Deployment-Standard (VERBINDLICH)

> **Wir arbeiten für einen Großkonzern. Profis arbeiten sauber. Keine Workarounds, keine Sonderwege.**

| Regel | Detail |
|-------|--------|
| **Plattform** | Cloudflare Workers Builds mit nativer Git-Integration |
| **Trigger** | Push auf `main` = automatisches Build + Deploy |
| **Repo-Anbindung** | GitHub Repo ist im Cloudflare Dashboard direkt verbunden |
| **KEIN GitHub Actions CI/CD** | Cloudflare hat eigene Build-Pipeline — die nutzen wir |
| **KEIN manuelles `wrangler deploy`** | Nur im absoluten Notfall (Debugging) |
| **Konsistenz** | Exakt gleiches Pattern wie alle anderen Robert-Projekte |
| **Root Directory** | Im Dashboard auf `b-content` setzen (Repo-Root ≠ Modul-Root) |

**Warum:** Robert nutzt bei allen ~30 Projekten dasselbe Pattern: Git-Push triggert Cloudflare Build. Kein Projekt bekommt einen Sonderweg. Punkt.

> ⚠️ **Achtung Repo-Struktur:** Das Git-Repo ist `BENDERGROUP` (Monorepo). B-CONTENT liegt im Subdirectory `b-content/`. Workers Builds **Root Directory** muss auf `b-content` stehen, sonst findet der Build die `package.json` nicht.

---

## 4. Ordnerstruktur

```
BENDERGROUP/
├── assets/                    # Shared Assets (modulübergreifend)
│   ├── brand/                 # Logo, Farben, Fonts (pending)
│   ├── gfx/                   # Grafiken, Icons
│   ├── info/                  # Unternehmensdaten, Strategy Doc
│   └── vdna/                  # Virtual DNA — Brand-Token-System
│       ├── tokens.json        # Source of Truth (Farben, Fonts, AI-Prompts)
│       └── vDNA.md            # Konzept-Dokumentation
├── docs/                      # Übergreifende Dokumentation
├── .agent/                    # Agent-Konfiguration
│   ├── workflows/             # /session-start, /session-end, /feature, /research
│   ├── skills/
│   └── rules/workspace.md
├── B-CONTENT/                 # 🟡 Modul: Content-Gehirn
│   ├── PRODUCT_SPEC.md        # Vollständige Produktspezifikation
│   ├── BACKLOG.md             # Priorisiertes Backlog (aligned mit Product Spec)
│   ├── HANDOVER_CONTEXT.md    # Modul-Handover
│   └── src/data/              # Vorbereitete Wissensbasis
│       ├── topics/            # 13 Themenfelder (bestätigt)
│       ├── quotes/            # 29 Zitate (bestätigt)
│       ├── instances/         # 3 Instanz-Profile (bestätigt)
│       ├── content-rules.json # Posting-Regeln (bestätigt)
│       └── unconfirmed/       # ⚠️ Web-Recherche (TBD Kunden-Bestätigung)
├── HANDOVER_CONTEXT.md        # ← Du bist hier
└── MASTERPLAN.md              # Strategischer Gesamtplan
```

---

## 5. Session-Protokoll

| Datum      | Session-Typ | Thema                          | Ergebnis |
|------------|-------------|--------------------------------|----------|
| 2026-03-06 | Planning    | Projekt-Setup & Infrastruktur  | ✅ Infrastruktur angelegt |
| 2026-03-06 | Planning    | Strategy Doc → Product Spec, vDNA, Wissensbasis | ✅ Done |
| 2026-03-06 | Planning    | Kunden-Feedback, Assets, LinkedIn-Analyse | ✅ Alle Blocker gelöst |
| 2026-03-06 | Execution   | Phase A+B: Foundation + Design System + Create-Flow + Knowledge | ✅ 31 Dateien, 6k Zeilen |
| 2026-03-06 | Follow-up   | Marco-Feedback: Website-Beitrag, Bild-Gap, User-Scope, Budget | ✅ Dokumentiert |
| 2026-03-06 | Execution   | AI-Pipeline: Prompts + Builder + Gemini + Smoke Test | ✅ Done |
| 2026-03-06 | Ops         | GitHub + D1/R2 (EU) + API Key + Deploy + E2E Verify | ✅ Live |
| 2026-03-06 | Execution   | Bild-Pipeline (Gemini Image + R2 + vDNA) + Content Library (D1 + UI) | ✅ Live |
| 2026-03-06 | Polish      | Visual Premium Upgrade: Glassmorphism, Animations, Logo, Gradient Accents | ✅ Deployed |
| 2026-03-06 | Ops         | Deployment-Standard dokumentiert: Workers Builds + Git-Integration | ✅ Verankert |
| 2026-03-07 | Maintenance | Styleguide-Abgleich, Assets-Fix, Lucide Icons, CF Access, Jules AI Research | ✅ Alle Blocker gelöst |
| 2026-03-07 | Integration | Jules AI Agent via API: AGENTS.md, CLI, Prompt Library, 7 Overnight-Tasks delegiert | ✅ Live |
| 2026-03-07 | Review      | Jules PRs: 3 gemerged, 3 closed, Error Handling cherry-picked, Prompt Library → Drahtwerk-Personas | ✅ Done |
| 2026-03-07 | QA + Bugfix | Live Smoke Test, GEMINI_API_KEY persistent fix, Save-to-Library Validation, Library Image JOIN | ✅ Deployed |
| 2026-03-07 | Phase 2     | E-001 Content Orchestration (Dreier-Regel) + E-002 4:1 Ratio Tracker: Backend + Frontend + 9 Tests | ✅ Build OK, pushed |
| 2026-03-07 | Feature     | i18n DE/EN (7 Views, Globe-Toggle), Stats-Bug Fix, Library Icons | ✅ Deployed |
| 2026-03-07 | Delegation  | Jules E-003 Knowledge CRUD: 2× Sandbox-Reset, kein PR | ❌ Fehlgeschlagen |
| 2026-03-07 | Execution   | E-003 manuell: Knowledge CRUD (KV Overlay, 7 Routes, TopicEditor, QuoteEditor, i18n) | ✅ Deployed |
| 2026-03-07 | Feature     | Library Archive: Soft-Delete, Restore, Purge + Route-Ordering-Fix | ✅ Deployed |
| 2026-03-08 | QA/Audit    | Multi-Model Code Audit (Opus/Sonnet/Gemini/Codex + Jules): Context7-backed Prompts, 4/5 done | ✅ Jules pending |
| 2026-03-08 | Hardening   | Audit Batch 1+2: 7 Findings gefixt (Error Handler, API Key Header, CORS, Sanitization, Pagination), /jules Workflow V1 | ✅ Deployed |
| 2026-03-08 | Tooling     | Jules Workflow V2→V3: API-CLI, Prompt V3 (Core Contract + Persona Lens), 7 Scheduled Tasks | ✅ Deployed |
