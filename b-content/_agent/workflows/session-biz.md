---
description: Business-Session starten/beenden — Kontext laden, Dokumente bearbeiten, Status sichern
---

# /session-biz — Business-Session Workflow

> **Zweck:** Strukturiertes Arbeiten an Business-Dokumenten (Kalkulation, Angebote, Verträge).
> Der `business/`-Ordner ist **gitignored** — daher kein Git-Commit/Push am Ende.

---

## Start

### 1. Kontext laden
// turbo
Read `business/README.md` to understand the current state of all business documents.

### 2. PRODUCT_SPEC prüfen
// turbo
Read `PRODUCT_SPEC.md` — compare feature scope against business documents for consistency.

### 3. Offene Punkte identifizieren
Check `business/README.md` → "Offene Punkte" section. Report status to user.

### 4. Relevante KI-Artefakte laden
Check knowledge items for:
- `bot_as_a_service_baas_framework/artifacts/standards/commercial_strategy.md`
- `bot_as_a_service_baas_framework/artifacts/standards/project_structure_business.md`

---

## End

### 1. README updaten
Update `business/README.md` with:
- Current status of each document (Draft / Review / Final)
- Open questions and next steps
- Date of last session

### 2. Artefakte sichern
Since `business/` is gitignored, there is **no git commit**. Instead:
- Ensure all changes are saved to the `business/` directory
- Create/update conversation artifacts summarizing key decisions
- Update relevant Knowledge Items if major strategy changes were made

### 3. Briefing für nächste Session
Add a "Nächste Session" section to `business/README.md` with concrete next steps.

> [!IMPORTANT]
> **KEIN `git add/commit/push`** — Business-Docs bleiben lokal.
> Backup erfolgt über Time Machine / iCloud, nicht über Git.
