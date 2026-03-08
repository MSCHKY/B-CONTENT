---
description: Jules AI Agent — Tasks delegieren, Status prüfen, PRs reviewen
---
# /jules

Workflow für die Kommunikation mit Google Jules AI Agent im B/CONTENT Projekt.

## Voraussetzungen
- Jules ist über GitHub integriert (Repo: `MSCHKY/B-CONTENT`)
- Jules hat Zugriff auf `AGENTS.md` im Repo-Root für Kontext
- Session-IDs werden im `HANDOVER_CONTEXT.md` dokumentiert

## 1. Status einer laufenden Jules-Session prüfen

```bash
# Offene PRs von Jules anzeigen
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr list --author "jules-google[bot]" --state open
```

```bash
# Alle PRs von Jules (inkl. geschlossene)
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr list --author "jules-google[bot]" --state all --limit 10
```

## 2. Jules-PR reviewen

```bash
# PR Details + Diff anzeigen (PR-Nummer ersetzen)
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr view <PR_NUMBER> --comments
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr diff <PR_NUMBER>
```

**Review-Checkliste:**
- [ ] Keine Änderungen außerhalb von `b-content/`
- [ ] Kein `package-lock.json` Diff (außer bei echtem Dependency-Change)
- [ ] Keine `test-results/`, `.last-run.json`, `trace.zip` committed
- [ ] Build OK: `cd B-CONTENT && npx vite build`
- [ ] Tests OK: `cd B-CONTENT && npx playwright test`
- [ ] Code-Style konsistent mit bestehenden Patterns
- [ ] Keine neuen `any` Types

```bash
# PR mergen (nach erfolgreichem Review)
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr merge <PR_NUMBER> --squash --delete-branch
```

```bash
# PR schließen (wenn Qualität nicht reicht)
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr close <PR_NUMBER> --comment "Closed: [Grund angeben]"
```

## 3. Neue Task an Jules delegieren

### 3a. Prompt vorbereiten
Prompt-Templates liegen in: `b-content/docs/jules-prompts/`

**Prompt-Regeln:**
- Persona + Scope klar definieren (was darf Jules, was NICHT)
- `AGENTS.md` referenzieren für Kontext
- Max 5 Dateien pro Task (Task Boundaries)
- Explizite Build+Test-Anweisung: `cd b-content && npx vite build && npx playwright test`
- Commit-Frequenz definieren: "Commit after each logical change"

### 3b. Task delegieren (via GitHub UI oder API)
1. Gehe zu https://jules.google.com/
2. Wähle Repo `MSCHKY/B-CONTENT`
3. Paste Prompt
4. Starte Session

### 3c. Session-ID dokumentieren
Session-ID im HANDOVER_CONTEXT.md eintragen:
```
| YYYY-MM-DD | Delegation | Jules: [Beschreibung] | 🔄 Session: [ID] |
```

## 4. Cherry-Pick aus Jules-PR

Wenn nur Teile eines Jules-PRs brauchbar sind:

```bash
# Branch des PRs fetchen
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr checkout <PR_NUMBER>

# Einzelne Commits cherry-picken
git log --oneline -10
git checkout main
git cherry-pick <COMMIT_HASH>

# Aufräumen
git branch -D <JULES_BRANCH>
```

## 5. Jules-Ergebnis bewerten

| Qualität | Aktion |
|----------|--------|
| ✅ Sauber | `gh pr merge --squash --delete-branch` |
| 🟡 Teilweise | Cherry-pick brauchbarer Commits, PR schließen |
| ❌ Unbrauchbar | `gh pr close --comment "Reason"` |

**Erfahrungswerte:**
- Jules funktioniert gut für: JSDoc, Lint-Fixes, Dependency-Updates, einfache Tests
- Jules scheitert oft bei: Komplexe Features, Sandbox-Resets, State-Management
- Jules braucht: Sehr explizite Prompts mit klaren Boundaries
- Jules hat Probleme mit: Monorepo-Kontext (arbeitet manchmal außerhalb von `b-content/`)
