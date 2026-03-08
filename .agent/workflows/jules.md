---
description: Jules AI Agent — API-basierte Task-Delegation, Status-Monitoring, PR-Review
---
# /jules

Workflow für die vollständig API-basierte Kommunikation mit Google Jules AI Agent.

## Architektur

- **API:** Jules REST API v1alpha (`jules.googleapis.com`)
- **SDK:** `@google/jules-sdk` (optional, für TypeScript-Integration)
- **CLI:** `./scripts/jules.sh` — Shell-Wrapper für alle API-Operationen
- **Repo:** `MSCHKY/B-CONTENT` (GitHub)
- **Kontext:** Jules liest `b-content/AGENTS.md` automatisch
- **Tracker:** `docs/jules-tracker.md` — Zentrale Session-History

## Voraussetzungen

```bash
# API Key setzen (einmalig pro Terminal-Session)
export JULES_API_KEY="your-key-here"

# Verify
./scripts/jules.sh help
```

---

## 1. Status prüfen (Quick Check)

// turbo-all

### 1a. Aktive Jules-Sessions
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh active
```

### 1b. Offene PRs von Jules
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr list --author "jules-google[bot]" --state open
```

### 1c. Alle Sessions (History)
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh list
```

---

## 2. Persona deployen (Standard-Weg)

Vier spezialisierte Personas stehen bereit. Jede erstellt max. 1 fokussierten PR.

### Einzelne Persona starten
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh persona stahl
```

### Mehrere Personas gleichzeitig (Batch)
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh batch stahl zink schliff
```

### Verfügbare Personas

| Persona | Datei | Domain | Ideal für |
|---------|-------|--------|-----------|
| `stahl` | `docs/jules-prompts/stahl.txt` | Testing & QA | E2E Tests, Coverage-Gaps, Edge Cases |
| `glut` | `docs/jules-prompts/glut.txt` | Performance | React.memo, Lazy Loading, Bundle Size |
| `zink` | `docs/jules-prompts/zink.txt` | Security | Headers, Validation, CORS, Input Limits |
| `schliff` | `docs/jules-prompts/schliff.txt` | UX Polish | A11y, Aria-Labels, Focus States, Empty States |

### Empfohlene Rotation
```
Mo → stahl 🔩 (Testing)
Mi → glut 🔥 (Performance)
Fr → zink 🛡️ (Security)
So → schliff ✨ (UX Polish)
```

---

## 3. Custom Task delegieren

### 3a. Prompt-Datei erstellen
```bash
# Prompt als Datei vorbereiten
cat > /tmp/jules-task.txt << 'EOF'
[Prompt hier einfügen — folge dem Schema der Persona-Dateien]
EOF
```

### 3b. Session erstellen
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh create /tmp/jules-task.txt "Task Title"
```

### 3c. Prompt-Regeln (WICHTIG!)
- **Max 5 Dateien** pro Task — Jules verliert Fokus bei mehr
- **Boundaries explizit** — Was darf Jules, was NICHT
- **Build+Test-Anweisung** immer inkludieren: `cd b-content && npx vite build && npx playwright test`
- **API Response Shapes** für Tests immer mitgeben (siehe `stahl.txt` als Vorlage)
- **`AGENTS.md` referenzieren** — Jules liest es automatisch, aber explizit erwähnen hilft

---

## 4. Session-Lifecycle managen

### 4a. Status einer Session prüfen
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh status <SESSION_ID>
```

### 4b. Plan genehmigen (wenn `requirePlanApproval: true`)
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh approve <SESSION_ID>
```

### 4c. Feedback senden (wenn `AWAITING_USER_FEEDBACK`)
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && ./scripts/jules.sh message <SESSION_ID> "Your feedback here"
```

### Session States
| State | Bedeutung | Aktion |
|-------|-----------|--------|
| `QUEUED` | Wartet auf Slot | Abwarten |
| `PLANNING` | Jules plant | Abwarten |
| `AWAITING_PLAN_APPROVAL` | Plan fertig | `./scripts/jules.sh approve <ID>` |
| `IN_PROGRESS` | Jules arbeitet | Abwarten |
| `AWAITING_USER_FEEDBACK` | Jules braucht Input | `./scripts/jules.sh message <ID> "..."` |
| `COMPLETED` | Fertig — PR erstellt | → Schritt 5 (Review) |
| `FAILED` | Fehlgeschlagen | Prompt überarbeiten, neuer Versuch |

---

## 5. PR reviewen

### 5a. PR anzeigen
```bash
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr list --author "jules-google[bot]" --state open
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr view <PR_NUMBER> --comments
cd /Volumes/Work/AI/__CODING/BENDERGROUP && gh pr diff <PR_NUMBER>
```

### 5b. Review-Checkliste
- [ ] Keine Änderungen außerhalb von `b-content/`
- [ ] Kein `package-lock.json` Diff (außer bei echtem Dependency-Change)
- [ ] Keine `test-results/`, `.last-run.json`, `trace.zip` committed
- [ ] Build OK: `cd B-CONTENT && npx vite build`
- [ ] Tests OK: `cd B-CONTENT && npx playwright test`
- [ ] Code-Style konsistent mit bestehenden Patterns
- [ ] Keine neuen `any` Types
- [ ] Keine Emojis in UI (muss Lucide Icons sein)

### 5c. Entscheidung

| Qualität | Aktion |
|----------|--------|
| ✅ Sauber | `gh pr merge <PR> --squash --delete-branch` |
| 🟡 Teilweise | Cherry-pick brauchbarer Commits (→ Schritt 6) |
| ❌ Unbrauchbar | `gh pr close <PR> --comment "Closed: [Grund]"` |

---

## 6. Cherry-Pick (Teilweise brauchbar)

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

---

## 7. Tracker aktualisieren

Nach JEDEM Review — Ergebnis in `docs/jules-tracker.md` eintragen:

```markdown
| YYYY-MM-DD HH:MM | <session-id> | <persona> | <task-title> | ✅/🟡/❌ | #<pr-number> |
```

---

## Erfahrungswerte (Hard-Won Lessons)

### ✅ Jules funktioniert gut für:
- JSDoc-Kommentare hinzufügen
- Lint/TypeScript Fixes (einzelne Datei)
- Simple Playwright-Tests (wenn Response Shapes mitgegeben werden)
- Security-Header setzen
- aria-label hinzufügen
- Bundle-Optimierungen (React.memo, lazy imports)

### ❌ Jules scheitert regelmäßig bei:
- **Komplexe Features** (E-003 Knowledge CRUD = 2× Sandbox-Reset)
- **Multi-File State Management** (Zustand Stores + UI + API zusammen)
- **Monorepo-Kontext** (arbeitet manchmal außerhalb von `b-content/`)
- **Strenge TypeScript Compilation** (bricht Build kaputt)
- **Tests mit falschen Assertions** (erfindet API Response Shapes)

### 🎯 Schlüssel-Taktiken:
1. **1 PR = 1 logische Änderung** — nie Features + Refactoring mischen
2. **API Response Shapes explizit** im Prompt mitgeben (Jules erfindet sie sonst)
3. **`automationMode: AUTO_CREATE_PR`** + **`requirePlanApproval: false`** = schnellster Weg
4. **Max 5 Dateien** pro Task — darüber verliert Jules den Fokus
5. **Build+Test immer zwingend** — Jules überspringt es sonst manchmal
6. **Persona-Rotation** verhindert Prompt-Fatigue und bringt Abwechslung

---

## SDK-Alternative (TypeScript)

Für tiefere Integration (z.B. in CI/CD oder eigene Tools):

```bash
npm install @google/jules-sdk
```

```typescript
import { jules } from '@google/jules-sdk';

// Session erstellen
const session = await jules.session({
  prompt: 'Fix the login button alignment',
  source: { github: 'MSCHKY/B-CONTENT', baseBranch: 'main' },
});

// Auf Ergebnis warten
const outcome = await session.result();
console.log(`State: ${outcome.state}`);
if (outcome.pullRequest) {
  console.log(`PR: ${outcome.pullRequest.url}`);
}
```

```typescript
// Batch: Mehrere Tasks parallel
const sessions = await jules.all(
  ['Fix tests', 'Add aria-labels', 'Optimize bundle'],
  (task) => ({
    prompt: task,
    source: { github: 'MSCHKY/B-CONTENT', baseBranch: 'main' },
  }),
  { concurrency: 3, stopOnError: false, delayMs: 500 }
);
```
