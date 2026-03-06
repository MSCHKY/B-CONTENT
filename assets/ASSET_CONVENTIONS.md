# 📁 Asset-Konventionen

> Zuletzt aktualisiert: 2026-03-06

## Struktur

```
assets/
├── brand/                          # ✅ Sortierte, nutzbare Assets
│   ├── logos/
│   │   ├── group/                  # BWG + alle Submarken (normal, inverted, claim)
│   │   ├── members/                # Member-Badges
│   │   └── social/                 # LinkedIn, Facebook, Xing Icons
│   ├── icons/
│   │   ├── industry/               # Branchen-Icons (Medizin, Auto, Solar etc.)
│   │   └── communication/          # Mail, Call, Location Icons
│   ├── fonts/
│   │   ├── gilroy/                 # Primär-Font (7 Weights: Thin→ExtraBold)
│   │   └── arial/                  # Fallback (Regular + Bold)
│   └── BenderWireGroup_Styleguide_2025.pdf
│
├── vdna/                           # Brand-Token-System
│   ├── tokens.json                 # Source of Truth (Farben, Fonts, AI-Prompts)
│   └── vDNA.md                     # Konzept-Doku
│
└── info/                           # Referenzmaterial (nicht direkt im Tool)
    ├── BWG_Content-Strategie_Komplett-Kontext.md
    ├── beispiel-website-artikel.md
    ├── linkedin-analyse.md
    ├── linkedin/                   # LinkedIn-Screenshots
    └── marco-feedback-*.txt        # Kunden-Feedback (chronologisch)
```

## Namenskonventionen

| Regel | Beispiel |
|-------|---------|
| Dateinamen: **kebab-case**, englisch | `bwg-claim-inverted.png` |
| Keine Leerzeichen in Dateinamen | ✅ `tri-star.png` ❌ `Tri Star.png` |
| Varianten mit Suffix | `bwg.png`, `bwg-inverted.png`, `bwg-claim.png` |
| Feedback-Dateien mit Datum | `marco-feedback-2026-03-06.txt` |

## Neue Assets einsortieren

Wenn Marco neue Dateien liefert:
1. In `assets/brand/` einsortieren (richtige Unterkategorie)
2. Kebab-case Dateinamen vergeben
3. Originale NICHT in `assets/brand/` belassen — nur sortierte Versionen
4. Bei Bedarf `tokens.json` aktualisieren (neue Farben, Fonts etc.)

## Was NICHT in `assets/brand/` gehört

- AI/Illustrator-Quelldateien → nicht committen (zu groß, nicht nutzbar)
- Temporäre Screenshots → `assets/info/` oder `/tmp/`
- Unbestätigte Daten → `B-CONTENT/src/data/unconfirmed/`
