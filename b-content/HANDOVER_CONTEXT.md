# 🏗️ B/CONTENT — Handover Context

> **Zuletzt aktualisiert:** 2026-03-07 01:23
> **Modul:** B/CONTENT (Content-Gehirn)
> **Status:** Phase 1 NEAR COMPLETE — Text + Bild-Generierung live, Visual Polish deployed, Jules AI Integration live
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
- [x] **Playwright Smoke Test** — 6 Tests (App-Load, Navigation, Create-Flow, Knowledge, API)
- [x] **Website-Beitrag Format** — Cross-Instance Prompt + API-Endpoint
- [x] **Bild-Generierung** — Gemini 2.5 Flash Image (Imagen 3) + vDNA-Prompt-Builder (7 Schichten)
- [x] **R2 Upload-Pipeline** — Base64 → Binary → R2 PUT mit strukturiertem Key + EU Jurisdiction
- [x] **Content Library** — D1 Persistierung + Archive-UI (Filter, Expand, Copy, Download, Status, Delete)
- [x] **Save-to-Library Flow** — Bewusste Nutzeraktion, kein Auto-Save
- [x] **Generate Image Button** — Im Result-Editor verdrahtet (war Placeholder)
- [ ] Transkript-Import (V2 Feature)
- [x] GitHub Repo + CI/CD ← ✅ Deployed
- [x] Cloudflare D1/R2 angelegt ← ✅ EU Jurisdiction
- [x] Gemini API Key konfiguriert ← ✅ Live

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
