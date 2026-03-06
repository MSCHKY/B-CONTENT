# 🏗️ B/CONTENT — Handover Context

> **Zuletzt aktualisiert:** 2026-03-06 17:00
> **Modul:** B/CONTENT (Content-Gehirn)
> **Status:** Phase 1 IN PROGRESS — Foundation + Design System gebaut
> **Branch:** `feature/b-content-foundation`

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
- [ ] AI System-Prompts pro Instanz/Typ ← **NÄCHSTE SESSION**
- [ ] Prompt-Builder Service
- [ ] Playwright Smoke Test
- [ ] GitHub Repo + CI/CD ← **ROBERT ERFORDERLICH**
- [ ] Cloudflare D1/R2 anlegen ← **ROBERT ERFORDERLICH**
- [ ] Gemini API Key konfigurieren ← **ROBERT ERFORDERLICH**

---

## 3. Tech-Stack (bestätigt + implementiert)

| Komponente | Technologie | Status |
|-----------|-------------|--------|
| Frontend | React 19 + Vite 6.4 + TypeScript | ✅ Implementiert |
| Styling | Tailwind CSS v4 + vDNA Tokens | ✅ Implementiert |
| State Management | Zustand v5 | ✅ Implementiert |
| Backend/API | Hono + @cloudflare/vite-plugin | ✅ Skeleton |
| AI (Text + Bild) | Google Gemini API | 🔲 Wartet auf API Key |
| Datenbank | Cloudflare D1 (EU Region) | 🔲 Schema ready, DB nicht erstellt |
| File Storage | Cloudflare R2 (Bilder) | 🔲 Nicht erstellt |
| Hosting | Cloudflare Pages + Workers (EU) | 🔲 Nicht deployed |
| Auth (V1) | Keine (ggf. CF Access) → Phase 3 | ⏸️ Deferred |
| Brand-System | vDNA (`/assets/vdna/tokens.json`) | ✅ CSS-Tokens generiert |

---

## 4. Entscheidungen (diese Session)

| Entscheidung | Ergebnis |
|-------------|---------|
| Routing | **State-basiert** (kein React Router) — reicht für V1, weniger Overhead |
| State Management | **Zustand** — typed, skaliert, minimal |
| Font-Einbindung | Gilroy via @font-face OTF — Web-Lizenz unklar, für internen Gebrauch ok |
| Wissensbasis-API | Statische JSON-Imports, kein D1 für KB in V1 |

---

## 5. Invarianten

1. **Content-Gehirn:** Drei Kommunikationsinstanzen (Alex, Ablas, BWG) mit eigenen Tonalitäts-Profilen
2. **Wissensbasis-gespeist:** AI generiert mit Kontext aus der Knowledge Engine, nicht aus allgemeinem Training
3. **DSGVO-konform:** Cloudflare EU-Region, Gemini EU-Endpoint (Vertex AI)
4. **Core-Ready:** Auth, API, DB so abstrahiert, dass B/WIRE-Integration möglich ist
5. **Brand-konform:** Alle generierten Assets nutzen vDNA-Tokens
6. **Export-First:** Generierte Inhalte sofort downloadbar
7. **Anti-Patchwork:** Kein Feature ohne Eintrag im Product Spec
8. **Instanzen als JSON-Config:** Neue Stimmen/Typen/Themen sind Config-Änderung, kein Code-Umbau

---

## 6. Blocker

| Blocker | Status | Impact |
|---------|--------|--------|
| GitHub Repo fehlt | ⏳ Wartet auf Robert | Kein Push, kein CI/CD |
| D1 + R2 nicht erstellt | ⏳ Wartet auf Robert | Kein Backend-Storage |
| Gemini API Key fehlt | ⏳ Wartet auf Robert | AI-Generierung nur Mock |
| Gilroy Web-Lizenz | 🟡 Unklar | Nur für Public Deploy relevant |

---

## 7. Session-Log

| Datum      | Session-Typ | Thema                           | Ergebnis |
|------------|-------------|---------------------------------|----------|
| 2026-03-06 | Planning    | Modul-Infrastruktur aufgesetzt  | ✅ Done  |
| 2026-03-06 | Planning    | Strategy Doc → Product Spec, vDNA, Wissensbasis | ✅ Done |
| 2026-03-06 | Planning    | Kunden-Feedback, Assets sortiert, LinkedIn-Analyse | ✅ Done |
| 2026-03-06 | Execution   | **Phase A+B: Projekt-Setup + Design System + Layout + Create-Flow + Knowledge Viewer** | ✅ Done |
