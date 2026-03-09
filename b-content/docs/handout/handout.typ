// B/CONTENT — Benutzerhandbuch
// Brand: BenderWire Group (#46B384, #1A202C)

#set document(
  title: "B/CONTENT — Benutzerhandbuch",
  author: "maschke.ai",
)

#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2cm, left: 2cm, right: 2cm),
  footer: context [
    #set text(8pt, fill: luma(150))
    #h(1fr)
    B/CONTENT Benutzerhandbuch · BenderWire Group
    #h(1fr)
    #counter(page).display()
  ],
)

#set text(font: "Helvetica Neue", size: 10pt, fill: rgb("#1A202C"))
#set par(leading: 0.7em, justify: true)
#set heading(numbering: none)

#let brand-green = rgb("#46B384")
#let brand-dark = rgb("#1A202C")
#let brand-light = rgb("#F0F4F3")

#let section-title(title) = {
  v(0.5cm)
  block(
    width: 100%,
    inset: (y: 8pt),
    below: 12pt,
    [
      #line(length: 40pt, stroke: 2pt + brand-green)
      #v(4pt)
      #text(16pt, weight: "bold", fill: brand-dark)[#title]
    ]
  )
}

#let screenshot(path, caption: none) = {
  figure(
    block(
      stroke: 0.5pt + luma(220),
      radius: 6pt,
      clip: true,
      image(path, width: 100%),
    ),
    caption: if caption != none { text(9pt, fill: luma(100))[#caption] } else { none },
  )
}

// === COVER PAGE ===

#page(footer: none)[
  #v(3cm)
  #align(center)[
    #image("bwg-logo.png", width: 40%)
    #v(1.5cm)
    #text(28pt, weight: "bold", fill: brand-dark)[B/CONTENT]
    #v(2pt)
    #text(12pt, fill: luma(120), tracking: 3pt)[CONTENT BRAIN]
    #v(1cm)
    #line(length: 60pt, stroke: 2.5pt + brand-green)
    #v(1cm)
    #text(14pt, fill: luma(80))[Benutzerhandbuch]
    #v(0.3cm)
    #text(10pt, fill: luma(150))[Version 1.0.0-beta · März 2026]
    #v(3cm)
    #block(
      fill: brand-light,
      radius: 8pt,
      inset: 16pt,
      width: 70%,
    )[
      #set text(9pt, fill: luma(100))
      #set par(justify: false)
      Erstellt von *maschke.ai* für die BenderWire Group. \
      Dieses Dokument beschreibt die Funktionen und Bedienung \
      des B/CONTENT Content-Gehirns.
    ]
  ]
]

// === BETA STATUS ===

#section-title("Beta-Status")

#block(
  fill: rgb("#FFF3E0"),
  stroke: 1pt + rgb("#FFB74D"),
  radius: 6pt,
  inset: 14pt,
  width: 100%,
)[
  #set text(9.5pt)
  #text(11pt, weight: "bold", fill: rgb("#E65100"))[⚠ Dieses Produkt befindet sich in der Beta-Phase.]
  #v(6pt)
  B/CONTENT ist ein funktionaler Prototyp — *14 von 17 geplanten Features* sind implementiert und nutzbar. Das System wird aktiv weiterentwickelt.
]

#v(0.3cm)

*Was bereits live ist (14 Features):*
- Alle 7 Module (Erstellen, Wissen, Interview, Bibliothek, Kalender, Orchestrieren, Statistik)
- KI-Text- und Bildgenerierung mit Brand-Konformität
- Dreier-Regel, 4:1 Ratio Tracking, 2-Tage-Konflikt-Erkennung
- Sprachumschaltung Deutsch / Englisch
- Audio-Interview-Import mit automatischer Transkription

#v(0.2cm)

*Was noch kommt (3 offene Features):*

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + luma(220),
  inset: 8pt,
  fill: (x, y) => if y == 0 { brand-light } else { none },
  [*Feature*], [*Beschreibung*],
  [Template-Builder], [Wiederverwendbare Content-Vorlagen erstellen und verwalten],
  [Review-Workflow], [Freigabeprozess mit Rollen (Ersteller → Reviewer → Freigabe)],
  [Multi-Channel-Export], [Direkter Export zu LinkedIn, Instagram, Newsletter etc.],
)

#v(0.3cm)

#block(
  fill: brand-light,
  radius: 6pt,
  inset: 12pt,
  width: 100%,
)[
  #set text(9pt, fill: luma(100))
  *Temporäre Beta-Entscheidungen* — folgende Punkte werden sich in der finalen Version ändern:
  - *Zugangssystem:* Aktuell via Cloudflare Access (E-Mail-Gate) — in der finalen Version eigenes Login mit Rollen und Rechten
  - *Nutzerverwaltung:* Noch keine Benutzerkonten — aktuell gemeinsamer Zugang für alle freigeschalteten E-Mails
  - *Hosting:* Temporär unter `maschkeai.workers.dev` — finale Domain wird kundenspezifisch
  - *Daten:* Demo-Inhalte in der Bibliothek dienen zur Veranschaulichung
]

// === CONTENT ===

#section-title("Was ist B/CONTENT?")

*B/CONTENT* ist das Content-Gehirn der BenderWire Group. Es wurde entwickelt, um die Marketing-Abteilung bei der Erstellung von professionellem, markenkonformem LinkedIn-Content zu unterstützen.

#block(
  fill: brand-light,
  radius: 6pt,
  inset: 12pt,
  width: 100%,
)[
  #set text(9.5pt)
  *Das System beherrscht drei Kommunikationsstimmen:*
  - *Jürgen Alex* — Nachhaltigkeit, nüchtern-leidenschaftlich
  - *Sebastian Ablas* — Innovation, begeistert-nüchtern
  - *BenderWire Group* — Unternehmensseite, faktenbasiert
]

Jede Stimme hat ein eigenes Tonalitätsprofil, eigene Content-Typen und Themenfeld-Gewichtungen. Die KI generiert Texte und Bilder basierend auf einer *Wissensbasis* mit 13 Themenfeldern, 29 Zitaten und konkreten Fakten — nicht aus allgemeinem Training.

#v(0.3cm)

#block(
  fill: rgb("#FFF8E1"),
  radius: 6pt,
  inset: 12pt,
  width: 100%,
)[
  #set text(9.5pt)
  *Was B/CONTENT nicht ist:*
  #set text(9pt)
  - Kein Social-Media-Scheduler (kein Auto-Posting)
  - Kein generisches Canva-Klon
  - Kein CMS — es generiert Content, verwaltet ihn aber nicht extern
]

// === FUNKTIONSÜBERSICHT ===

#section-title("Funktionsübersicht")

B/CONTENT besteht aus *sieben Modulen*, erreichbar über die Sidebar-Navigation:

#table(
  columns: (auto, 1fr),
  stroke: 0.5pt + luma(220),
  inset: 8pt,
  fill: (x, y) => if y == 0 { brand-light } else { none },
  [*Modul*], [*Beschreibung*],
  [Erstellen], [Content-Erstellungsflow (4-Step Wizard)],
  [Wissen], [Wissensbasis mit 13 Themenfeldern, 29 Zitaten, Regeln],
  [Interview], [Audio-Upload → Transkription → Fakten-Extraktion],
  [Bibliothek], [Gespeicherte Beiträge mit Filter, Archiv, Export],
  [Kalender], [Monatsansicht, Drag & Drop Planung, 2-Tage-Regel],
  [Orchestrieren], [Dreier-Regel: 1 Thema → 3 Perspektiven],
  [Statistik], [Content-Analyse, Ratio Tracker, Aktivitätsverlauf],
)

// === CONTENT ERSTELLEN ===

#section-title("Content erstellen")

Der Kern von B/CONTENT ist der *4-Step Create-Flow*:

+ *Instanz wählen* — Für wen soll der Content sein? (Alex, Ablas, BWG)
+ *Content-Typ wählen* — Dynamisch basierend auf der gewählten Instanz
+ *Thema & Kontext* — Themenfeld auswählen, Stichworte/Kontext eingeben
+ *Ergebnis* — Generierter Text + optionales Bild, bearbeitbar und exportierbar

#screenshot("screenshots/01-erstellen.png", caption: "Schritt 1: Instanzauswahl — drei Kommunikationsstimmen")

Im Ergebnis-Schritt können Sie:
- Den generierten Text *bearbeiten* und *kopieren*
- Ein *markenkonformes Bild* generieren lassen
- Den Beitrag in die *Bibliothek speichern*
- Text und Bild *exportieren* (Copy/Download)

// === WISSENSBASIS ===

#section-title("Wissensbasis")

Die Wissensbasis ist das Fundament der Content-Generierung. Sie enthält *13 Themenfelder* mit Fakten, Schlüsselwörtern und Kernbotschaften — von Energie & Nachhaltigkeit bis Medizintechnik.

#screenshot("screenshots/02-wissen.png", caption: "Wissensbasis mit Themenfeldern, Zitaten und Content-Regeln")

Die Wissensbasis ist *editierbar*: Neue Fakten, Zitate und Schlüsselwörter können direkt im Tool hinzugefügt werden. Änderungen fließen sofort in die Content-Generierung ein.

Drei Tabs:
- *Themenfelder* — 13 Felder mit Kernbotschaft, Fakten und Keywords
- *Zitate* — 29 Original-Zitate von Alex, Ablas und Fichtel
- *Regeln* — Content-Richtlinien (4:1 Ratio, 2-Tage-Abstand etc.)

// === INTERVIEW-PIPELINE ===

#section-title("Interview-Pipeline")

Monatliche Interviews können als *Audio-Datei hochgeladen* werden. Das System transkribiert die Aufnahme automatisch und extrahiert relevante Fakten und Zitate für die Wissensbasis.

#screenshot("screenshots/03-interview.png", caption: "Interview-Pipeline — Audio hochladen, transkribieren, extrahieren")

*Unterstützte Formate:* MP3, M4A, WAV, WebM, OGG, FLAC (max. 20 MB)

Der Workflow:
+ Audio-Datei hochladen (Drag & Drop oder Klick)
+ Automatische Transkription und Fakten-Extraktion (~30–60 Sek.)
+ Extrahierte Items prüfen und auswählen
+ Ausgewählte Items in die Wissensbasis importieren

// === BIBLIOTHEK ===

#section-title("Content-Bibliothek")

Alle gespeicherten Beiträge werden in der Bibliothek verwaltet. Hier können Sie nach *Instanz* und *Status* filtern, Texte kopieren, Bilder herunterladen oder Beiträge archivieren.

#screenshot("screenshots/04-bibliothek.png", caption: "Content-Bibliothek mit Filter, Status-Badges und Bild-Vorschau")

*Status-System:*
- *Entwurf* — Frisch generiert, noch nicht eingeplant
- *Geplant* — Im Kalender terminiert
- *Archiviert* — Soft-Delete, kann wiederhergestellt werden

// === KALENDER ===

#section-title("Content-Kalender")

Der Kalender zeigt eine *Monatsansicht* aller geplanten Beiträge. Per *Drag & Drop* können ungeplante Beiträge auf Kalendertage geschoben werden.

#screenshot("screenshots/05-kalender.png", caption: "Content-Kalender mit Drag & Drop und Konflikt-Warnungen")

*2-Tage-Regel:* Das System warnt automatisch, wenn zwei Beiträge zu nah beieinander liegen (weniger als 2 Tage Abstand). Konflikte werden als Warnung oberhalb des Kalenders angezeigt.

// === ORCHESTRIEREN ===

#section-title("Content-Orchestrierung")

Die *Dreier-Regel* aus der Content-Strategie: Wählen Sie ein Thema, und B/CONTENT generiert automatisch *drei Beiträge* — einen aus der Perspektive von Alex, Ablas und BWG.

#screenshot("screenshots/06-orchestrieren.png", caption: "Dreier-Regel: Ein Thema, drei Perspektiven")

Jeder Beitrag kann einzeln kopiert, bearbeitet oder in die Bibliothek gespeichert werden.

// === STATISTIK ===

#section-title("Statistik & Analytics")

Das Analytics-Dashboard zeigt die *Content-Gesundheit* auf einen Blick:

#screenshot("screenshots/07-statistik.png", caption: "Analytics Dashboard mit Aktivitätsverlauf und Planungsquote")

- *Aktivitätsverlauf* — Wöchentliche Posting-Frequenz über Zeit
- *Content-Typen* — Verteilung nach Beitragsart
- *Planungsquote* — Anteil geplanter vs. ungeplanter Beiträge
- *4:1 Ratio Tracker* — Fach- vs. Persönliche Beiträge pro Instanz

// === CI / BRAND ===

#section-title("Corporate Identity")

B/CONTENT nutzt das *vDNA-System* (Virtual DNA) — ein zentrales Brand-Token-Verzeichnis, das sicherstellt, dass alle generierten Inhalte markenkonform sind.

#block(
  fill: brand-light,
  radius: 6pt,
  inset: 12pt,
  width: 100%,
)[
  #set text(9.5pt)
  *Brand-Elemente im System:*
  - *Farben:* BenderWire Green (\#46B384), Dark (\#1A202C)
  - *Typografie:* Gilroy (Headlines), System-Font (Fließtext)
  - *Bildsprache:* KI-generiert mit vDNA-Prompt-Fragmenten (Draht-Motive, Brand-Farben, keine generischen Stock-Bilder)
  - *Tonalität:* 3 distinkte Sprachprofile, systemisch in der AI verankert
]

Die KI-Bildgenerierung nutzt ein *7-Schichten-Prompt-System*, das automatisch Brand-Farben, Draht-Motive und die richtige visuelle Sprache einbettet — ohne manuelles Eingreifen.

// === SPRACHE ===

#section-title("Sprachumschaltung")

Die gesamte Benutzeroberfläche ist in *Deutsch und Englisch* verfügbar. Die Sprache kann jederzeit über das Globe-Symbol im Sidebar-Footer umgeschaltet werden. Die Einstellung wird im Browser gespeichert.

#v(0.3cm)
#align(center)[
  #text(9pt, fill: luma(150))[Standard: Deutsch · Alle Labels, Buttons und Hinweistexte werden sofort übersetzt]
]

// === ZUGANG ===

#section-title("Zugang & Sicherheit")

B/CONTENT ist in der Beta-Phase über *Cloudflare Access* (Zero Trust) geschützt. Nach Eingabe Ihrer E-Mail-Adresse erhalten Sie einen Einmal-Code — kein Passwort nötig.

#block(
  fill: brand-light,
  radius: 6pt,
  inset: 12pt,
  width: 100%,
)[
  #set text(9.5pt)
  *URL:* #link("https://b-content.maschkeai.workers.dev")[b-content.maschkeai.workers.dev] \
  *Authentifizierung:* E-Mail + Einmal-Code (Cloudflare Access) \
  *Berechtigte Nutzer:* Werden individuell freigeschaltet \
  #v(4pt)
  #set text(8.5pt, fill: luma(120))
  _Hinweis: Dieses Zugangssystem ist eine Übergangslösung für die Beta-Phase. In der finalen Version wird ein eigenes Login-System mit Benutzerkonten und Rollenmanagement implementiert._
]

// === FOOTER ===

#v(1cm)
#line(length: 100%, stroke: 0.5pt + luma(220))
#v(0.5cm)
#align(center)[
  #image("maschkeai.svg", width: 12%)
  #v(0.2cm)
  #text(8pt, fill: luma(150))[
    B/CONTENT v1.0.0-beta · BenderWire Group \
    Fragen oder Feedback? → robert\@maschke.ai
  ]
]
