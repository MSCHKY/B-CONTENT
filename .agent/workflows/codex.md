---
description: Codex AI Agent — Lokale Scheduled Audits, Einmal-Tasks, GitHub-Modus
---
# /codex

Workflow für OpenAI Codex (macOS App) als autonomen Code-Auditor.

## Architektur

- **App:** Codex (macOS, lokale Sandbox)
- **Prompts:** `docs/codex-prompts/ready/` (fertig zusammengebaute Prompts)
- **Quell-Dateien:** `docs/codex-prompts/` (Core Contract + 5 Persona-Lenses separat)
- **Kontext:** Codex liest `AGENTS.md` automatisch
- **Ausführung:** Worktree (isoliert, blockt nicht deine Arbeit)

## Prompt-Zusammensetzung

Jeder Prompt = **Core Contract + Persona Lens** in einer Datei:

| Datei | Persona |
|-------|---------|
| `ready/01-waechter-full.txt` | 🔍 Dependencies & Hygiene |
| `ready/02-stahl-full.txt` | 🔩 Testing & QA |
| `ready/03-zink-full.txt` | 🛡️ Security |
| `ready/04-glut-full.txt` | 🔥 Performance |
| `ready/05-schliff-full.txt` | ✨ UX Polish |

---

## 1. Automatisierung einrichten (in der App)

1. Codex App öffnen → Sidebar → **Automatisierungen**
2. **Automatisierung erstellen**
3. Felder ausfüllen:
   - **Name:** z.B. `🔍 WÄCHTER — Dependency Patrol`
   - **Projekte:** B-CONTENT Ordner auswählen
   - **Ausführungsumgebung:** **Worktree** (empfohlen)
   - **Prompt:** Inhalt der entsprechenden `ready/`-Datei pasten
   - **Zeitplan:** Täglich, Uhrzeit + Wochentag wählen
4. **Erstellen** klicken

### Empfohlene Rotation (versetzt zu Jules)

| Tag | Persona | Uhrzeit |
|-----|---------|---------|
| Mo  | 🔍 WÄCHTER | 09:00 |
| Di  | 🔩 STAHL | 09:00 |
| Do  | 🔥 GLUT | 09:00 |
| Sa  | 🛡️ ZINK | 09:00 |
| So  | ✨ SCHLIFF | 09:00 |

> Jules läuft Mo/Mi/Fr/So → Codex versetzt für maximale Abdeckung.

---

## 2. Einmal-Audit (Ad-Hoc)

1. Codex App → neuen Thread starten
2. Ausführungsumgebung: **Worktree**
3. Prompt aus `ready/`-Datei pasten
4. Run starten → Report abwarten

---

## 3. Ergebnisse reviewen

- Findings landen im **Posteingang / Triage** der Codex-Sidebar
- Wenn nix gefunden → wird automatisch archiviert
- Bei Findings → Review im Inbox, dann entscheiden:
  - Fix übernehmen → Handoff oder manuell committen/pushen
  - Nur Report → an Jules/Antigravity delegieren

### Review-Checkliste
- [ ] Keine Änderungen außerhalb von `b-content/`
- [ ] Build OK: `npx vite build`
- [ ] Tests OK: `npx playwright test`
- [ ] Code-Style konsistent mit bestehenden Patterns
- [ ] Keine neuen `any` Types
- [ ] Keine Emojis in UI (muss Lucide Icons sein)

---

## 4. Worktree-Hygiene

Häufige Schedules erzeugen viele Worktrees. Regelmäßig:
- Erledigte Automation-Runs archivieren
- Runs nicht pinnen, es sei denn du willst den Worktree behalten

---

## 5. Codex vs. Jules — Wann was nutzen?

| Szenario | Empfehlung |
|----------|------------|
| Schneller Security-Check | **Codex** (lokal, sofort) |
| Wiederkehrende Patrouille | **Beide** (versetzt) |
| PR mit Code-Fix | **Jules** (native PR-Erstellung) |
| Deep-Dive Audit | **Codex** (längere Laufzeit lokal ok) |
| Test-Dateien schreiben | **Codex** (besserer Sandbox-Zugriff) |
| Einfache Cleanup-Tasks | **Jules** (schneller Turnaround) |
