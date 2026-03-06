# 🏗️ B/CONTENT — Handover Context

> **Zuletzt aktualisiert:** 2026-03-06 16:18
> **Modul:** B/CONTENT (Content-Gehirn)
> **Status:** Phase 0 DONE — Bereit für Phase 1 (Implementierung)

---

## 1. Modul-Überblick

**B/CONTENT** ist das Content-Gehirn der BenderWire Group. Es verwaltet die Wissensbasis (13 Themenfelder, Zitate, Fakten, Anekdoten), beherrscht drei distinkte Kommunikationsstimmen (Alex, Ablas, BWG) und generiert brand-konformen LinkedIn-Content (Text + Bilder) in der richtigen Tonalität.

**Referenz:** Vollständige Spezifikation → `PRODUCT_SPEC.md`

---

## 2. Aktueller Status

### Phase 0: Foundation
- [x] Modul-Infrastruktur angelegt
- [x] Content-Strategie vom Kunden erhalten und analysiert (`assets/info/BWG_Content-Strategie_Komplett-Kontext.md`)
- [x] Product Spec geschrieben (`PRODUCT_SPEC.md`) — Feature-Map, Datenmodell, UI-Konzept, Tech-Stack
- [x] Tech-Stack entschieden: React + Vite v7 + Hono + Cloudflare Workers/D1 + Gemini API
- [x] vDNA mit echten Brand-Werten befüllt (`assets/vdna/tokens.json`)
- [x] Wissensbasis extrahiert → `src/data/`
  - `topics/topic-fields.json` — 13 Themenfelder mit ~80 Fakten
  - `quotes/quotes.json` — 29 Zitate (Alex 8, Ablas 10, Fichtel 6, Pasini 2, Allgemein 3)
  - `instances/instances.json` — 3 Instanz-Profile (Persönlichkeit, Tonalität, Content-Typen, Themengewichtung)
  - `content-rules.json` — 4:1 Ratio, Posting-Regeln, Orchestrierung, Leitplanken
- [x] Web-Recherche durchgeführt → `src/data/unconfirmed/web-research.json` (TBD: Kunden-Bestätigung)
- [x] Fragebogen an Kunden (Marco Pasini) gesendet (10 Fragen)
- [x] Kunden-Feedback erhalten und eingearbeitet
- [x] Product Spec bestätigt ("Was es ist und was es nicht ist, ist alles korrekt.")
- [x] LinkedIn-Seite gecrawlt und analysiert (`assets/info/linkedin-analyse.md`)
- [x] BWG News-Seite analysiert + Beispiel-Artikel gespeichert
- [x] Brand-Assets sortiert (`assets/brand/`): Logos, Fonts, Icons, CD Manual
- [x] Sprachstrategie geklärt: EN default, DE für ausgewählte Kategorien, Tool bilingual
- [x] Neuer Content-Typ identifiziert: Website-Artikel (bilingual DE+EN)
- [ ] Unconfirmed Web-Recherche-Daten bestätigen oder entfernen
- [ ] Projekt initialisieren (Vite/React) ← **NÄCHSTER SCHRITT**

---

## 3. Tech-Stack (entschieden)

| Komponente | Technologie |
|-----------|-------------|
| Frontend | React + Vite v7 + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend/API | Hono + @cloudflare/vite-plugin |
| AI (Text + Bild) | Google Gemini API (Nano Banana 2) |
| Datenbank | Cloudflare D1 (EU Region) |
| File Storage | Cloudflare R2 (Bilder) |
| Hosting | Cloudflare Pages + Workers (EU) |
| Auth (V1) | Keine (ggf. CF Access) → Phase 3 |
| Brand-System | vDNA (`/assets/vdna/tokens.json`) |

---

## 4. Invarianten

1. **Content-Gehirn:** Drei Kommunikationsinstanzen (Alex, Ablas, BWG) mit eigenen Tonalitäts-Profilen
2. **Wissensbasis-gespeist:** AI generiert mit Kontext aus der Knowledge Engine, nicht aus allgemeinem Training
3. **DSGVO-konform:** Cloudflare EU-Region, Gemini EU-Endpoint (Vertex AI)
4. **Core-Ready:** Auth, API, DB so abstrahiert, dass B/WIRE-Integration möglich ist
5. **Brand-konform:** Alle generierten Assets nutzen vDNA-Tokens
6. **Export-First:** Generierte Inhalte sofort downloadbar
7. **Anti-Patchwork:** Kein Feature ohne Eintrag im Product Spec
8. **Instanzen als JSON-Config:** Neue Stimmen/Typen/Themen sind Config-Änderung, kein Code-Umbau

---

## 5. Blocker

**Keine Blocker.** Alle Kunden-Fragen beantwortet, Assets vorhanden, Product Spec bestätigt.

| Risiko | Status | Impact |
|--------|--------|--------|
| Gilroy Web-Lizenz | 🟡 Unklar | Nur rechtlich, kein technischer Blocker. Klären vor Public Deploy. |
| Kein Fotomaterial | ✅ Akzeptiert | AI-Generierung + Template-Grafiken als Bildsprache |

---

## 6. Session-Log

| Datum      | Session-Typ | Thema                           | Ergebnis |
|------------|-------------|---------------------------------|----------|
| 2026-03-06 | Planning    | Modul-Infrastruktur aufgesetzt  | ✅ Done  |
| 2026-03-06 | Planning    | Strategy Doc → Product Spec, vDNA, Wissensbasis | ✅ Done |
| 2026-03-06 | Planning    | Kunden-Feedback, Assets sortiert, LinkedIn-Analyse | ✅ Done |
