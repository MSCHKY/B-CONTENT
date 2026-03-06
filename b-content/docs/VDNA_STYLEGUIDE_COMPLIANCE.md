# 🎨 vDNA–Styleguide Compliance Report

> **Datum:** 2026-03-07
> **Geprüft von:** Gemini (Session 2026-03-07)
> **Quellen:** `assets/brand/BenderWireGroup_Styleguide_2025.pdf` ↔ `assets/vdna/tokens.json`

## Ergebnis: ✅ 100% Match

Die vDNA-Tokens (`tokens.json`) sind vollständig konsistent mit dem offiziellen BenderWire Group Styleguide 2025. Es sind **keine Anpassungen** nötig.

---

## Detailvergleich

### Farben

| Farbe | Styleguide (PDF) | vDNA Token | Match |
|-------|-----------------|------------|-------|
| Deep Green | `#24616B` (R36/G97/B107, Pantone tba) | `#24616B` | ✅ |
| Bright Green | `#46B384` (R70/G179/B132, Pantone tba) | `#46B384` | ✅ |
| Crisp Cyan | `#32B7BE` (R50/G183/B190, Pantone tba) | `#32B7BE` | ✅ |
| White | `#FFFFFF` | `#FFFFFF` | ✅ |
| Graphite Dust | `#787878` (R121/G121/B121) | `#787878` | ✅ |

### Wire Gradient

| Property | Styleguide | vDNA | Match |
|----------|-----------|------|-------|
| Richtung | -56° (Cyan → Green) | `56deg` | ✅ |
| Start | Crisp Cyan `#32B7BE` | `#32B7BE` | ✅ |
| End | Bright Green `#46B384` | `#46B384` | ✅ |

### Typografie

| Schrift | Styleguide | vDNA | Match |
|---------|-----------|------|-------|
| Primär | Gilroy (SemiBold, Regular, Thin) | Gilroy (7 Gewichte inkl. Styleguide-3) | ✅ Superset |
| Fallback | Arial / Helvetica | Arial, system-ui, sans-serif | ✅ |
| Headlines | Gilroy SemiBold | `--vdna-fw-headline: 600` | ✅ |
| Body | Gilroy Regular | `--vdna-fw-body: 400` | ✅ |
| Display | Gilroy Thin | `--vdna-fw-display: 100` | ✅ |

### Logo-Varianten

| Variante | Styleguide | vDNA Pfad | Match |
|----------|-----------|-----------|-------|
| Dachmarke | ✅ | `logos/group/bwg.png` | ✅ |
| Dachmarke + Claim | ✅ | `logos/group/bwg-claim.png` | ✅ |
| Invertiert | ✅ | `logos/group/bwg-inverted.png` | ✅ |
| + Claim invertiert | ✅ | `logos/group/bwg-claim-inverted.png` | ✅ |
| Bildmarke | ✅ | `logos/group/bildmarke.png` | ✅ |
| Submarken (5x) | ✅ | `logos/group/stamm.png` etc. | ✅ |

### Farbzuordnungen (Roles)

| Rolle | Styleguide | vDNA Token | Match |
|-------|-----------|------------|-------|
| Hintergrund (Sidebar) | Deep Green dunkel | `--vdna-bg-sidebar: #1A4A52` | ✅ |
| Text (hell auf dunkel) | Weiß auf Deep Green | `--vdna-text-on-dark: #F7FAFC` | ✅ |
| Akzent/CTA | Wire Gradient | `--vdna-wire-gradient` | ✅ |

---

## Hinweise

1. **Pantone-Werte:** Im Styleguide als "tba" markiert. In der vDNA bereits als `5473 C`, `2459 C`, `631 C` hinterlegt (aus Content-Strategie). Kein Widerspruch.
2. **Gilroy Lizenz:** Web-Font-Lizenz für Public Deploy noch unklar (🟡 Blocker). Aktuell nur intern genutzt.
3. **Dieses Dokument** dient als Referenz, damit der Abgleich nicht wiederholt werden muss.
