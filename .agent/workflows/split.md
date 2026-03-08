---
description: Component Splitting — Übergroße Komponenten in fokussierte Sub-Dateien zerlegen
---

# /split

Workflow zum systematischen Aufteilen übergroßer Komponenten in wartbare Sub-Dateien.

## Schritte

// turbo-all

1. **Analyse: Größte Dateien identifizieren**
   ```bash
   find <MODULE>/src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -20
   ```
   → Kandidaten >250 Zeilen markieren.

2. **Outlines analysieren**
   Für jeden Kandidaten: Outline lesen, Concerns identifizieren:
   - Inline Sub-Komponenten (eigene Funktionen in derselben Datei)
   - Type Interfaces / Constants
   - Helper-Funktionen
   - Separate JSX-Blöcke (Panels, Modals, Cards)

3. **Splitting-Plan erstellen**
   Pro Datei dokumentieren:
   - Was wird extrahiert (Funktion/Type/Helper)
   - Ziel-Dateiname (im selben Verzeichnis)
   - Erwartete Zielgröße der Hauptdatei

   Batching-Strategie:
   - **Quick Wins:** Bereits separate Funktionen → mechanischer Move
   - **Strukturell:** Monolithen → JSX-Blöcke in eigene Komponenten
   - **Optional:** Grenzfälle (250-350 Zeilen) → nur wenn klar trennbar

4. **Splitting durchführen (pro Datei)**
   Reihenfolge pro Datei:
   1. Types/Interfaces extrahieren → `types.ts`
   2. Helper-Funktionen extrahieren → `helpers.ts` oder spezifischer Name
   3. Sub-Komponenten extrahieren → eigene `.tsx` Dateien
   4. Hauptdatei aufräumen: Imports anpassen, Barrel-Exports prüfen
   
   **Regeln:**
   - Kein Logik-Refactoring! Nur Move + Import-Anpassung.
   - Props-Interfaces für extrahierte Komponenten definieren.
   - Dateien im selben Verzeichnis wie die Quelldatei.

5. **Verifizieren**
   ```bash
   # TypeScript Build
   npm run build --prefix <MODULE>
   
   # Playwright Smoke Tests (falls vorhanden)
   cd <MODULE> && npx playwright test
   ```
   
   Zusätzlich: Jede betroffene View einmal im Browser öffnen.

6. **Commit**
   ```bash
   git add -A && git commit -m "refactor: split <component> into sub-components"
   ```
