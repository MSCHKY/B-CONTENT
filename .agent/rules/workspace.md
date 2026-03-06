# Workspace-Regeln: BENDERGROUP

## Pflicht
- Vor jeder Arbeit: `/session-start` Workflow ausführen
- Nach jeder Session: `/session-end` Workflow ausführen
- HANDOVER_CONTEXT.md ist die Source-of-Truth für den aktuellen Stand
- MASTERPLAN.md ist die Source-of-Truth für strategische Entscheidungen
- PRODUCT_SPEC.md ist der Vertrag gegen Scope Creep — kein Feature ohne Eintrag!

## Source-of-Truth Hierarchie
1. **PRODUCT_SPEC.md** → Was gebaut wird (Features, Datenmodell, UI)
2. **HANDOVER_CONTEXT.md** → Wo wir stehen (Status, Blocker)
3. **BACKLOG.md** → Was als nächstes kommt (priorisiert)
4. **MASTERPLAN.md** → Warum wir es bauen (Strategie)

## Brand & Design
- vDNA-Tokens (`assets/vdna/tokens.json`) sind die einzige Quelle für Farben, Fonts, Styles
- CD Manual: `assets/brand/BenderWireGroup_Styleguide_2025.pdf`
- Keine hardcodierten Farben/Fonts — immer vDNA-Tokens referenzieren
- Anti-Patchwork: Keine neuen UI-Patterns wenn äquivalente existieren

## Drei Kommunikationsinstanzen
- **Jürgen Alex** → Nachhaltigkeit, Metallurgie, Operations
- **Sebastian Ablas** → Innovation, MedTech, Sales
- **BenderWire Group** → Unternehmen, Messen, Partnerschaften
- Alle drei sind Configs in `src/data/instances/instances.json`, nicht Code-Logik

## Sprache
- **Code, Commits, Variablen:** Englisch
- **Dokumentation, Chat:** Deutsch
- **Content-Output:** EN default, DE für ausgewählte Kategorien (Jubilare etc.)
- **Website-Artikel:** Immer bilingual (DE + EN)

## Code-Standards
- TypeScript strict mode, kein `any`
- React + Vite v7 + Tailwind CSS v4
- Hono für API-Routes
- Cloudflare Workers/D1/R2 als Backend

## DSGVO
- Cloudflare D1 EU-Region pflicht
- Gemini API über EU-Endpoint (Vertex AI)
- Keine personenbezogenen Daten in AI-Prompts ohne Einwilligung

## Assets
- Sortierte Assets: `assets/brand/` (logos, fonts, icons)
- Rohdaten vom Kunden: `assets/gfx/` (Originale, nicht direkt nutzen)
- Informationsmaterial: `assets/info/` (Strategy Doc, LinkedIn-Analyse, Feedback)
- Unbestätigte Daten: `src/data/unconfirmed/` (Web-Recherche, TBD)
- Neue Assets → `assets/brand/` einsortieren, kebab-case, englische Namen

## Deployment
- Feature-Branch → `preview` → User-Verification → `main`
- Kein direkter Push auf `main`
- CHANGELOG.md bei jedem Feature-Abschluss aktualisieren
