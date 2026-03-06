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

2. **Product Spec prüfen**
   Wurde ein Feature hinzugefügt das NICHT im `PRODUCT_SPEC.md` steht?
   → Falls ja: Product Spec aktualisieren (Anti-Kabelsalat!).

3. **Modul-Handover aktualisieren**
   Aktualisiere `B-CONTENT/HANDOVER_CONTEXT.md`:
   - Session-Log-Eintrag hinzufügen (Datum, Typ, Thema, Ergebnis)
   - Status-Checkboxen aktualisieren
   - Blocker-Tabelle aktualisieren
   - Offene Punkte notieren

4. **Root-Handover aktualisieren**
   Aktualisiere `/Volumes/Work/AI/__CODING/BENDERGROUP/HANDOVER_CONTEXT.md`:
   - Session-Protokoll-Eintrag
   - Modul-Status aktualisieren

5. **Backlog aktualisieren**
   Falls Backlog-Änderungen: `B-CONTENT/BACKLOG.md` aktualisieren.
   Items als done/in_progress markieren, neue Items hinzufügen.

6. **Git Commit**
   ```bash
   cd /Volumes/Work/AI/__CODING/BENDERGROUP && git add -A && git status
   ```
   Commit mit aussagekräftiger Message. Format: `type(scope): description`

7. **Abschluss-Nachricht**
   Gib Robert eine finale Zusammenfassung mit:
   - ✅ Erledigtes
   - 🔲 Offene Punkte
   - 🎯 Empfohlener nächster Schritt
