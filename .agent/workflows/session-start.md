---
description: Session starten — Kontext laden, Status prüfen, Orientierung geben
---

# /session-start

Workflow zum Beginn jeder Arbeitssession im Benderwire-Projekt.

## Schritte

1. **Handover lesen**
   // turbo
   Lies `/Volumes/Work/AI/__CODING/BENDERGROUP/HANDOVER_CONTEXT.md` vollständig.

2. **Masterplan lesen**
   // turbo
   Lies `/Volumes/Work/AI/__CODING/BENDERGROUP/MASTERPLAN.md` vollständig.

3. **Aktives Modul identifizieren**
   Prüfe welches Modul aktuell aktiv ist (aus HANDOVER_CONTEXT.md).
   Falls Modul B/CONTENT aktiv:
   // turbo
   Lies `/Volumes/Work/AI/__CODING/BENDERGROUP/B-CONTENT/HANDOVER_CONTEXT.md` falls vorhanden.

4. **Git-Status prüfen**
   // turbo
   ```bash
   cd /Volumes/Work/AI/__CODING/BENDERGROUP/B-CONTENT && git status 2>/dev/null || echo "Kein Git-Repo"
   ```

5. **Backlog prüfen**
   // turbo
   Lies das aktive Modul-Backlog (z.B. `B-CONTENT/BACKLOG.md`) falls vorhanden.

6. **Zusammenfassung an Robert**
   Gib eine kompakte Zusammenfassung:
   - Aktueller Projektstatus
   - Letzte Session (was wurde gemacht)
   - Nächste Schritte / offene Punkte
   - Git-Branch + Status
   - Offene Fragen / Blocker
