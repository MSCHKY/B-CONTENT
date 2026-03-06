---
description: Session starten — Kontext laden, Status prüfen, Orientierung geben
---

# /session-start

Workflow zum Beginn jeder Arbeitssession im Benderwire-Projekt.

## Schritte

// turbo-all

1. **Root-Handover lesen**
   Lies `/Volumes/Work/AI/__CODING/BENDERGROUP/HANDOVER_CONTEXT.md` vollständig.

2. **Masterplan lesen**
   Lies `/Volumes/Work/AI/__CODING/BENDERGROUP/MASTERPLAN.md` vollständig.

3. **Aktives Modul identifizieren**
   Prüfe welches Modul aktuell aktiv ist (aus Root-HANDOVER_CONTEXT.md).
   
   Falls Modul B/CONTENT aktiv:
   - Lies `B-CONTENT/HANDOVER_CONTEXT.md`
   - Lies `B-CONTENT/BACKLOG.md`
   - Lies `B-CONTENT/PRODUCT_SPEC.md` (Kurzversion — nur Abschnitte 1-3 reichen für Kontext)

4. **Git-Status prüfen**
   ```bash
   cd /Volumes/Work/AI/__CODING/BENDERGROUP && git status && git log --oneline -5
   ```

5. **Zusammenfassung an Robert**
   Gib eine kompakte Zusammenfassung:
   - Aktueller Projektstatus (Phase, offene Items)
   - Letzte Session (was wurde gemacht)
   - Nächste Schritte aus dem Backlog
   - Git-Branch + letzter Commit
   - Offene Blocker
