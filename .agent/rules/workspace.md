# Workspace-Regeln: BENDERGROUP

## Pflicht
- Vor jeder Arbeit: `/session-start` Workflow ausführen
- Nach jeder Session: `/session-end` Workflow ausführen
- HANDOVER_CONTEXT.md ist die Source-of-Truth für den aktuellen Stand
- MASTERPLAN.md ist die Source-of-Truth für strategische Entscheidungen

## Code-Standards
- TypeScript strict mode, kein `any`
- Englische Code-Kommentare, Commit-Messages, Variablennamen
- Deutsche Dokumentation und Chat
- Commit-Format: `type(scope): description` (z.B. `feat(b-content): add template engine`)

## Anti-Patchwork
- Keine neuen UI-Komponenten wenn äquivalente existieren
- Design-Token-System aus DESIGN_SYSTEM.md verwenden
- Bestehende Patterns aus `/docs/` zuerst lesen

## Deployment
- Feature-Branch → `preview` → User-Verification → `main`
- Kein direkter Push auf `main`
- CHANGELOG.md bei jedem Feature-Abschluss aktualisieren
