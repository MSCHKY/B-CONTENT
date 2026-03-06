---
description: Feature entwickeln — Branch, Implementierung, Test, PR
---

# /feature

Workflow für die Entwicklung eines neuen Features.

## Schritte

1. **Scope klären**
   - Feature klar definieren (User Story / Beschreibung)
   - Acceptance Criteria festlegen
   - Abgrenzung: Was gehört NICHT dazu?

2. **Branch erstellen**
   ```bash
   cd /Volumes/Work/AI/__CODING/BENDERGROUP/B-CONTENT
   git checkout -b feature/<feature-name>
   ```

3. **Design-System checken**
   // turbo
   Lies `/Volumes/Work/AI/__CODING/BENDERGROUP/docs/DESIGN_SYSTEM.md` — existierende Patterns identifizieren.

4. **Implementieren**
   - Bestehende Patterns wiederverwenden (Anti-Patchwork!)
   - TypeScript strict, no `any`
   - Komponenten modular und wiederverwendbar

5. **Testen**
   ```bash
   npm run build
   npm run test
   ```
   Playwright Smoke-Test muss grün sein.

6. **Commit & Push**
   ```bash
   git add -A
   git commit -m "feat(b-content): <description>"
   git push origin feature/<feature-name>
   ```

7. **CHANGELOG + Version**
   `CHANGELOG.md` und `package.json` Version aktualisieren.

8. **PR erstellen**
   Push to GitHub → PR gegen `preview` Branch.

9. **Handover aktualisieren**
   Feature im Backlog als "done" markieren.
