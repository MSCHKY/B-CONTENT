# 🏗️ B/CONTENT — Handover Context

> **Zuletzt aktualisiert:** 2026-03-06
> **Modul:** B/CONTENT (Content-Gehirn)
> **Status:** Phase 0 — Foundation / Warten auf Kunden-Feedback

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
- [ ] ⏳ Offene Fragen vom Kunden beantwortet
- [ ] Product Spec finale Bestätigung ("Was es NICHT ist" — blockiert alles Weitere)
- [ ] Unconfirmed Web-Recherche-Daten bestätigen oder entfernen
- [ ] Projekt initialisieren (Vite/React)

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

| Blocker | Wartet auf | Impact |
|---------|-----------|--------|
| Product Spec finale Bestätigung | Marcos Antwort | Blockiert Projektinitialisierung |
| Brand-Assets (Logos, Gilroy Font, Fotos) | Marcos Antwort | Blockiert Template-Design |
| Bild-Strategie (AI vs. Template vs. Mix) | Marcos Antwort | Beeinflusst Architektur |

---

## 6. Session-Log

| Datum      | Session-Typ | Thema                           | Ergebnis |
|------------|-------------|---------------------------------|----------|
| 2026-03-06 | Planning    | Modul-Infrastruktur aufgesetzt  | ✅ Done  |
| 2026-03-06 | Planning    | Strategy Doc analysiert, Product Spec, vDNA, Wissensbasis, Web-Recherche | ✅ Done |
