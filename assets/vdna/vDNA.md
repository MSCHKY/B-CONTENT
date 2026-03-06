# 🧬 Benderwire Group — vDNA (Virtual DNA)

> **Version:** 0.1.0
> **Status:** Draft — Brand-Tokens sind Placeholder bis Assets geliefert werden
> **Pfad:** `/assets/vdna/`

---

## 1. Konzept

Die **vDNA** ist die zentrale, modulübergreifende Brand-Identität der Benderwire Group.
Sie definiert die visuellen und inhaltlichen Grundregeln, die JEDES Modul (B/CONTENT, B/WIRE, etc.) konsumiert.

### Prinzip: Single Source of Truth
```
             ┌──────────────┐
             │   vDNA       │  ← EIN Ort für Brand-Tokens
             │  (assets/)   │
             └──┬───┬───┬───┘
                │   │   │
       ┌────────┘   │   └────────┐
       ▼            ▼            ▼
 ┌──────────┐ ┌──────────┐ ┌──────────┐
 │B/CONTENT │ │ B/WIRE   │ │ B/???    │
 │  import  │ │  import  │ │  import  │
 └──────────┘ └──────────┘ └──────────┘
```

**Farbe ändert sich?** → `vdna/tokens.json` ändern → alle Module aktualisieren sich.

---

## 2. Token-Struktur

### 2.1 Farbpalette
```json
{
  "color": {
    "brand": {
      "primary":    { "value": "#___TBD___", "description": "Hauptfarbe (z.B. Logo-Farbe)" },
      "secondary":  { "value": "#___TBD___", "description": "Sekundärfarbe" },
      "accent":     { "value": "#___TBD___", "description": "Akzentfarbe für CTAs" }
    },
    "neutral": {
      "white":      { "value": "#FFFFFF" },
      "black":      { "value": "#0A0A0A" },
      "gray-50":    { "value": "#FAFAFA" },
      "gray-100":   { "value": "#F5F5F5" },
      "gray-200":   { "value": "#E5E5E5" },
      "gray-300":   { "value": "#D4D4D4" },
      "gray-500":   { "value": "#737373" },
      "gray-700":   { "value": "#404040" },
      "gray-900":   { "value": "#171717" }
    },
    "semantic": {
      "success":    { "value": "#22C55E" },
      "warning":    { "value": "#F59E0B" },
      "error":      { "value": "#EF4444" },
      "info":       { "value": "#3B82F6" }
    }
  }
}
```

### 2.2 Typografie
```json
{
  "typography": {
    "font-family": {
      "headline": { "value": "___TBD___", "fallback": "system-ui, sans-serif" },
      "body":     { "value": "___TBD___", "fallback": "system-ui, sans-serif" },
      "mono":     { "value": "___TBD___", "fallback": "monospace" }
    },
    "font-size": {
      "xs":   { "value": "0.75rem",  "px": "12px" },
      "sm":   { "value": "0.875rem", "px": "14px" },
      "base": { "value": "1rem",     "px": "16px" },
      "lg":   { "value": "1.125rem", "px": "18px" },
      "xl":   { "value": "1.25rem",  "px": "20px" },
      "2xl":  { "value": "1.5rem",   "px": "24px" },
      "3xl":  { "value": "1.875rem", "px": "30px" },
      "4xl":  { "value": "2.25rem",  "px": "36px" },
      "5xl":  { "value": "3rem",     "px": "48px" }
    },
    "font-weight": {
      "normal":    { "value": "400" },
      "medium":    { "value": "500" },
      "semibold":  { "value": "600" },
      "bold":      { "value": "700" }
    }
  }
}
```

### 2.3 Spacing & Layout
```json
{
  "spacing": {
    "xs":   { "value": "4px",  "rem": "0.25rem" },
    "sm":   { "value": "8px",  "rem": "0.5rem" },
    "md":   { "value": "16px", "rem": "1rem" },
    "lg":   { "value": "24px", "rem": "1.5rem" },
    "xl":   { "value": "32px", "rem": "2rem" },
    "2xl":  { "value": "48px", "rem": "3rem" },
    "3xl":  { "value": "64px", "rem": "4rem" }
  },
  "radius": {
    "sm":   { "value": "4px" },
    "md":   { "value": "8px" },
    "lg":   { "value": "16px" },
    "xl":   { "value": "24px" },
    "full": { "value": "9999px" }
  }
}
```

### 2.4 Logo & Grafiken
```json
{
  "logo": {
    "primary":     { "path": "/assets/brand/logo-primary.svg", "status": "TBD" },
    "mono-white":  { "path": "/assets/brand/logo-mono-white.svg", "status": "TBD" },
    "mono-dark":   { "path": "/assets/brand/logo-mono-dark.svg", "status": "TBD" },
    "icon":        { "path": "/assets/brand/icon.svg", "status": "TBD" },
    "favicon":     { "path": "/assets/brand/favicon.ico", "status": "TBD" }
  }
}
```

---

## 3. LinkedIn-Specs (Content-spezifisch)

### 3.1 Bildformate
```json
{
  "linkedin": {
    "formats": {
      "single-square":   { "width": 1200, "height": 1200, "label": "Standard Post" },
      "single-landscape": { "width": 1200, "height": 627,  "label": "Landscape / Link Preview" },
      "single-portrait":  { "width": 1080, "height": 1350, "label": "Portrait / Story-Style" },
      "carousel-slide":   { "width": 1080, "height": 1080, "label": "Karussell-Slide" },
      "company-banner":   { "width": 1584, "height": 396,  "label": "Unternehmensbanner" }
    }
  }
}
```

### 3.2 Content-Templates (geplant)
| Template           | Format              | Beschreibung                       |
|--------------------|--------------------|------------------------------------|
| Quote-Card         | 1200×1200          | Zitat + Logo + Branding            |
| Stat-Card          | 1200×1200          | Kennzahl groß + Kontext            |
| Tip-Card           | 1200×1200          | Tipp/Hack + Branding               |
| Before/After       | 1200×1200          | Vorher/Nachher Vergleich            |
| Karussell-Set      | 1080×1080 (×N)     | Titelfolie + Inhalt + CTA          |
| Team-Spotlight     | 1080×1350          | Mitarbeiter-Vorstellung             |
| Event-Ankündigung  | 1200×627           | Event + Datum + CTA                |

---

## 4. Konsumierung durch Module

### 4.1 In Tailwind v4 (CSS-Layer)
Die vDNA-Tokens werden in eine `vdna.css` exportiert die jedes Modul importiert:

```css
/* Automatisch generiert aus vdna/tokens.json */
@theme {
  --color-brand-primary: var(--vdna-brand-primary);
  --color-brand-secondary: var(--vdna-brand-secondary);
  --color-brand-accent: var(--vdna-brand-accent);
  
  --font-headline: var(--vdna-font-headline);
  --font-body: var(--vdna-font-body);
}
```

### 4.2 In AI-Prompts (Nano Banana 2)
Die vDNA liefert auch Prompt-Fragmente für konsistente Bild-Generierung:

```json
{
  "ai_prompt_fragments": {
    "brand_style": "Professional, modern corporate style with [brand-primary] color accents. Clean, minimalist layout with [font-headline] typography.",
    "photo_style": "High-quality professional photography, natural lighting, corporate environment.",
    "illustration_style": "Flat vector illustration, [brand-primary] and [brand-secondary] color palette, geometric shapes."
  }
}
```

### 4.3 Migration bei Brand-Change
```
1. Brand ändert sich (z.B. neue Primärfarbe)
2. → tokens.json updaten
3. → `npm run vdna:build` (generiert CSS, Prompt-Fragmente, etc.)
4. → Jedes Modul bekommt automatisch die neuen Werte
```

---

## 5. Dateistruktur

```
assets/vdna/
├── tokens.json              ← Source of Truth (maschinenlesbar)
├── vDNA.md                  ← Du bist hier (Dokumentation)
├── generated/
│   ├── vdna.css             ← CSS Custom Properties (auto-generiert)
│   ├── vdna-tailwind.js     ← Tailwind v4 Theme Extension (auto-generiert)
│   └── vdna-prompts.json    ← AI Prompt-Fragmente (auto-generiert)
└── templates/
    ├── quote-card.json       ← Template-Definitionen
    ├── stat-card.json
    └── ...
```
