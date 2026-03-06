---
description: Session beenden — Handover aktualisieren, committen, Übergabe sichern
---

# /session-end

Workflow zum sauberen Abschluss einer Arbeitssession.

## Schritte

1. **Zusammenfassung erstellen**
   Erstelle eine kurze Zusammenfassung der Session:
   - Was wurde gemacht?
   - Was ist der aktuelle Stand?
   - Was sind die nächsten Schritte?
   - Gibt es Blocker oder offene Fragen?

2. **Modul-Handover aktualisieren**
   Aktualisiere den `HANDOVER_CONTEXT.md` des aktiven Moduls (z.B. `B-CONTENT/HANDOVER_CONTEXT.md`):
   - Session-Log-Eintrag hinzufügen
   - Status-Checkboxen aktualisieren
   - Offene Punkte notieren

3. **Root-Handover aktualisieren**
   Aktualisiere `/Volumes/Work/AI/__CODING/BENDERGROUP/HANDOVER_CONTEXT.md`:
   - Session-Protokoll-Eintrag
   - Modul-Status aktualisieren

4. **Backlog aktualisieren**
   Falls Backlog-Änderungen: `BACKLOG.md` des Moduls aktualisieren.

5. **Git Commit**
   ```bash
   cd /Volumes/Work/AI/__CODING/BENDERGROUP/B-CONTENT
   git add -A
   git status
   ```
   Commit mit aussagekräftiger Message. Format: `type(scope): description`

6. **Abschluss-Nachricht**
   Gib Robert eine finale Zusammenfassung mit:
   - ✅ Erledigtes
   - 🔲 Offene Punkte
   - 🎯 Empfohlener nächster Schritt
