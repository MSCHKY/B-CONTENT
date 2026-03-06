# 🏗️ BENDERWIRE GROUP — Handover Context

> **Zuletzt aktualisiert:** 2026-03-06
> **Aktiver Fokus:** B/CONTENT (Content-Gehirn) — Warten auf Kunden-Feedback
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
- [x] Fragebogen an Kunden gesendet (10 Fragen)
- [ ] ⏳ Kunden-Feedback abwarten
- [ ] Product Spec finale Bestätigung ("Was es NICHT ist")
- [ ] Projekt initialisieren (Vite/React)

---

## 3. Invarianten (NICHT brechen!)

1. **Modul-Unabhängigkeit:** Jedes Modul ist eigenständig deploybar
2. **Core-Ready:** Auth, API, DB so abstrahiert, dass B/WIRE-Integration möglich ist
3. **Brand-Konsistenz:** Alle Module nutzen vDNA-Tokens aus `/assets/vdna/`
4. **DSGVO-konform:** Cloudflare EU-Region, Gemini EU-Endpoint
5. **Deutsche Kommunikation:** Chat/Reasoning auf Deutsch, Code/Commits auf Englisch
6. **Anti-Patchwork:** Kein Feature ohne Eintrag im Product Spec
7. **Anti-Kabelsalat:** Product Spec ist der Vertrag. Kein Feature wird drangeflickt.

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
| 2026-03-06 | Planning    | Strategy Doc, Product Spec, vDNA, Wissensbasis, Web-Recherche | ✅ Alles vorbereitet, warten auf Kunden |
