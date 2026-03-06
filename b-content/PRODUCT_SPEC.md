# 📋 B/CONTENT — Product Specification

> **Version:** 1.0.0
> **Status:** Draft — Review mit Robert ausstehend
> **Erstellt:** 2026-03-06
> **Regel:** Kein Feature wird gebaut das nicht hier steht. Kein Feature wird drangeflickt ohne es zuerst hier aufzunehmen.

---

## 1. Produktvision

**B/CONTENT ist das Content-Gehirn der BenderWire Group.**

Es verwaltet die Wissensbasis (13 Themenfelder, Zitate, Fakten, Anekdoten), beherrscht drei distinkte Kommunikationsstimmen (Alex, Ablas, BWG) und generiert brand-konformen LinkedIn-Content (Text + Bilder) in der richtigen Tonalität.

### Was es NICHT ist
- Kein Social-Media-Scheduler (kein Auto-Posting)
- Kein generisches Canva-Klon
- Kein CMS / Blog-System
- Kein Multi-Plattform-Tool (V1 = LinkedIn only)

---

## 2. Nutzer & Rollen

### V1 (MVP)
| Rolle | Wer | Kann |
|-------|-----|------|
| **Content Creator** | Marco (Agentur) / Marketing-Team | Content erstellen, bearbeiten, exportieren |

### V2+ (Zukunft)
| Rolle | Wer | Kann |
|-------|-----|------|
| **Reviewer** | Alex, Ablas | Posts freigeben/ablehnen |
| **Admin** | Robert / Marco | System konfigurieren, Wissensbasis pflegen |

> ⚠️ **Auth ist auf Phase 3 deferred.** V1 hat keine Login-Funktion. Das Tool wird über URL erreichbar sein — Zugangsschutz ggf. über Cloudflare Access (Zero Trust).

---

## 3. Die drei Kommunikationsinstanzen

Das Herzstück. Jede Instanz hat ein eigenes Profil:

### 3.1 Jürgen Alex

| Eigenschaft | Wert |
|-------------|------|
| **Mantelthema** | Nachhaltigkeit |
| **Claim** | "Einmal richtig. Für immer." |
| **Grundtemperatur** | Kühl, wird punktuell leidenschaftlich |
| **Sprachstil** | Nüchtern-leidenschaftlich, strukturiert, Position beziehen |
| **Merkmale** | Kurze klare Sätze, fragmentarisch. Verstärker: "Tatsächlich" |
| **Vermeiden** | Buzzwords, Marketing-Floskeln, ideologische Schubladen |
| **Oberthemen** | 1. Circular Economy, 2. Energie & Green Steel, 3. Verantwortung & Langfristigkeit |

**Content-Typen:**
| Typ | Zeichenlänge | Frequenz |
|-----|-------------|----------|
| Deep Dive | 800–1200 | 1-2×/Monat |
| Position beziehen | 400–600 | 2-3×/Monat |
| "Die Frage, die niemand stellt" | 300–500 | 2×/Monat |
| Persönlich (4:1 Regel) | 400–600 | 1-2×/Monat |

**Themenfeld-Gewichtung:**
Energie ●●●, Circular Economy ●●●, Bau ●●●, Wasser ●●●, Sicherheit ●●, MedTech ●, Alltag ●, Luxus ●

---

### 3.2 Sebastian Ablas

| Eigenschaft | Wert |
|-------------|------|
| **Mantelthema** | Innovation / Voranbringen |
| **Claim** | "Letztes Jahr unmöglich. Dieses Jahr Standard." |
| **Grundtemperatur** | Warm, wird punktuell analytisch |
| **Sprachstil** | Begeistert-nüchtern, anekdotisch, umgangssprachlich |
| **Merkmale** | Kurze Sätze, "Mega!", "Pillepalle", "Kein Schmu" |
| **Vermeiden** | Management-Sprache, Buzzwords, Abstraktion ohne Beispiel |
| **Oberthemen** | 1. Grenzverschiebung / High-End, 2. Draht macht die Welt smarter, 3. Machen statt Reden |

**Content-Typen:**
| Typ | Zeichenlänge | Frequenz |
|-----|-------------|----------|
| Proof Point | 400–600 | 2-3×/Monat |
| "Wusstest du, dass..." | 200–400 | 2-3×/Monat |
| Messe / Kundenstory | 400–800 | 1-2×/Monat |
| Persönlich (4:1 Regel) | 300–600 | 1-2×/Monat |

**Themenfeld-Gewichtung:**
MedTech ●●●, Alltag ●●●, Luxus ●●, Energie ●, Circular Economy ●, Bau ●, Wasser ●, Sicherheit ●

---

### 3.3 BenderWire Group (Unternehmensseite)

| Eigenschaft | Wert |
|-------------|------|
| **Mantelthema** | Relevanz von Draht |
| **Claim** | "redefining wire. since 1815." |
| **Grundtemperatur** | Sachlich, staunend (nicht angeberisch) |
| **Sprachstil** | Faktenbasiert, inspirierend, markenkonform |
| **Vermeiden** | Buzzwords, leere Versprechen, persönliche Färbung |
| **Oberthemen** | 1. "Draht steckt in...", 2. Technologie & Kompetenz, 3. Menschen & Kultur |

**Content-Typen:**
| Typ | Zeichenlänge | Frequenz |
|-----|-------------|----------|
| "Draht steckt in..." (Serie) | 200–400 | 2-3×/Monat |
| Unternehmensnews | 300–600 | Nach Anlass |
| Behind the Scenes | 300–500 | 1-2×/Monat |
| Zahlen & Fakten | 200–300 | 1×/Monat |

**Themenfeld-Gewichtung:**
Alltag ●●●, Energie ●●, Circular Economy ●●, MedTech ●●, Bau ●●, Luxus ●●, Wasser ●●, Sicherheit ●

---

## 4. Wissensbasis (Knowledge Engine)

Die Wissensbasis ist das Fundament für qualitativ hochwertige Content-Generierung. Die AI bekommt Kontext aus dieser Basis, nicht aus dem allgemeinen Training.

### 4.1 Themenfelder (13)

| # | Themenfeld | Kernbotschaft |
|---|-----------|---------------|
| 1 | Energie & Energiewende | Ohne Draht keine Energiewende. Punkt. |
| 2 | Circular Economy | Stahl — unendlich oft recycelbar, ohne Qualitätsverlust. |
| 3 | Medizintechnik | Draht rettet Leben. Jeden Tag. Unsichtbar. |
| 4 | Bau & Infrastruktur | Ohne Draht kein Gebäude, keine Brücke, kein Tunnel der sicher hält. |
| 5 | Alltagsprodukte & Tech | Draht ist überall — du siehst ihn nur nie. |
| 6 | Luxus & Kultur | Vom Billigsten bis zum Teuersten — Draht ist immer dabei. |
| 7 | Sicherheit & Defence | Draht schützt — im Alltag und im Ernstfall. |
| 8 | Wasser & Filtration | Sauberes Wasser für die Welt — immer durch Draht. |
| 9 | Vertikale Integration | Von der Schmelze bis zum Feindraht — das kann sonst keiner. |
| 10 | Geopolitische Resilienz | Zwei Kontinente, zwei Wirtschaftsräume. |
| 11 | Image-Reframe | Von außen grau, innen Hightech. |
| 12 | Ingredient Branding | Eigene Drahtmarke in Endprodukten. (langfristig) |
| 13 | Qualität als Lebensversicherung | Wir versprechen nur, was wir halten können. |

### 4.2 Datentypen in der Wissensbasis

| Typ | Beschreibung | Quelle |
|-----|-------------|--------|
| **Fakten** | Verifizierte Aussagen pro Themenfeld | Strategy Doc, Interviews |
| **Zitate** | Original-Zitate von Alex, Ablas, Fichtel | Zitatsammlung (Kap. 13) |
| **Anekdoten** | Geschichten und Beispiele | Interviews, Messen |
| **Proof Points** | Konkrete Belege (Zahlen, Cases) | Produktwissen |
| **Interview-Extrakte** | Kernaussagen aus monatlichen Interviews | Laufend |

### 4.3 Content-Regeln (System-Invarianten)

| Regel | Beschreibung |
|-------|-------------|
| **4:1 Ratio** | 4 Fachbeiträge, dann 1 persönlicher Post |
| **Max 3 Oberthemen** | Pro Instanz max. 3 Oberthemen |
| **2-Tage-Abstand** | Nie zwei Posts am selben Tag, min. 2 Tage Abstand |
| **Emotion > Abstraktion** | Abstraktes Produkt + echte Welt = Emotion |
| **Keine direkte Werbung** | Kein "Kauft unseren Draht!" |
| **Keine Corporate-Floskeln** | Kein "Wir freuen uns, bekannt geben zu dürfen..." |
| **Authentizitäts-Check** | "Klingelt oder klingelt nicht?" |
| **Sprache** | Posts auf Englisch (basierend auf Beispiel-Posts) |

---

## 5. Feature-Map

### Ebene 1: Kern-Features (MVP)

#### F1: Instanz-Auswahl
Der User wählt für wen der Content ist: Alex, Ablas, oder BWG.
Das System lädt automatisch das richtige Tonalitäts-Profil und die relevanten Themenfelder.

#### F2: Content-Type-Auswahl
Basierend auf der gewählten Instanz zeigt das System die verfügbaren Content-Typen:
- Alex: Deep Dive, Position, Frage, Persönlich
- Ablas: Proof Point, Wusstest du, Messe/Story, Persönlich
- BWG: Draht steckt in, News, Behind the Scenes, Zahlen

#### F3: Text-Generator
User gibt Thema/Stichworte/Kontext ein. AI generiert Post-Text:
- In der richtigen Tonalität der gewählten Instanz
- Im richtigen Content-Typ-Format
- Mit passender Zeichenlänge
- Mit Kontext aus der Wissensbasis
- Mit passenden Hashtags

User kann Text bearbeiten, regenerieren, oder Varianten anfordern.

#### F4: Bild-Generator
User kann ein LinkedIn-Bild generieren:
- Format-Auswahl (Square, Landscape, Portrait, Karussell)
- Brand-konform (Farben, Logo-Platzierung, Gradient)
- Via Nano Banana 2 (Gemini API) mit vDNA-Prompt-Fragmenten
- Alternativ: Template-basiert (Logo + Text-Overlay + Foto)

#### F5: Export
Download des fertigen Contents:
- Bild als PNG/JPG (LinkedIn-optimiert)
- Text als Klartext (Copy-Paste-ready)
- Optional: Bild + Text kombiniert als Preview

#### F6: Wissensbasis-Viewer
Zugriff auf die eingebettete Wissensbasis:
- Themenfelder durchsuchen
- Zitate finden
- Fakten nachschlagen
- (V1: read-only, vorpopuliert aus Strategy Doc)

---

### Ebene 2: Erweiterungen (Post-MVP)

#### F7: Content-Orchestrierung
Ein Thema über alle 3 Instanzen spielen:
- User wählt Thema → System schlägt 3 Posts vor (Alex/Ablas/BWG Perspektive)
- Dreier-Regel aus Kapitel 8 der Strategy Doc
- Timing-Vorschlag (Mo/Mi/Fr)

#### F8: 4:1 Ratio Tracker
Dashboard das zeigt:
- Wie viele Fach- vs. Persönliche Posts pro Instanz
- Warnung wenn Ratio kippt
- Themenfeld-Verteilung

#### F9: Wissensbasis-Editor
CRUD für die Wissensbasis:
- Neue Fakten, Zitate, Anekdoten hinzufügen
- Interview-Transkripte importieren und extrahieren
- Themenfeld-Zuordnung

#### F10: Post-History
Archiv aller generierten Posts:
- Filtbar nach Instanz, Themenfeld, Content-Typ
- Wiederverwendung / Remix von alten Posts
- Status-Tracking (Draft, Review, Approved, Published)

#### F11: Template-Builder
Visuelle Bild-Templates erstellen:
- Drag & Drop für Logo, Text, Foto-Bereiche
- vDNA-Farben und Fonts automatisch
- Speicherbar als wiederverwendbare Vorlage

---

### Ebene 3: Zukunft (Post-V2)

#### F12: Review-Workflow (benötigt Auth)
In-App Freigabe durch Alex/Ablas.

#### F13: Content-Kalender
Planung und Scheduling von Posts.

#### F14: Interview-Pipeline
Audio-Upload → Auto-Transkription → Extraktion → Wissensbasis.

#### F15: Multi-Channel
Erweiterung auf Instagram, X, etc.

#### F16: Analytics
Link zu LinkedIn Analytics, Performance-Tracking.

#### F17: B/WIRE Integration
Auth, zentrale DB, Gateway.

---

## 6. Datenmodell

```typescript
// === Kern-Entitäten ===

interface ContentInstance {
  id: 'alex' | 'ablas' | 'bwg';
  name: string;
  claim: string;
  mantelthema: string;
  oberthemen: string[];          // max 3
  tonality: TonalityProfile;
  contentTypes: ContentType[];
  topicWeights: Record<TopicFieldId, 1 | 2 | 3>;  // ● ●● ●●●
}

interface TonalityProfile {
  grundtemperatur: string;
  sprachstil: string;
  merkmale: string[];            // Sprachliche Merkmale
  verstaerker: string[];         // "Tatsächlich", "Mega" etc.
  vermeiden: string[];           // DON'Ts
  beispiel_saetze: string[];     // Für AI-Prompt-Kontext
}

interface ContentType {
  id: string;                    // z.B. "deep-dive", "proof-point"
  label: string;
  description: string;
  charRange: { min: number; max: number };
  frequency: string;             // z.B. "2-3×/Monat"
  promptTemplate: string;        // AI-System-Prompt für diesen Typ
}

// === Wissensbasis ===

type TopicFieldId = 
  | 'energie' | 'circular' | 'medtech' | 'bau' 
  | 'alltag' | 'luxus' | 'sicherheit' | 'wasser'
  | 'vertikale-integration' | 'geopolitik' 
  | 'image-reframe' | 'ingredient-branding' | 'qualitaet';

interface TopicField {
  id: TopicFieldId;
  label: string;
  kernbotschaft: string;
  facts: Fact[];
  quotes: Quote[];
  anecdotes: Anecdote[];
}

interface Fact {
  id: string;
  content: string;
  source: string;
  topicField: TopicFieldId;
}

interface Quote {
  id: string;
  content: string;
  author: 'alex' | 'ablas' | 'fichtel' | 'pasini';
  context?: string;
}

interface Anecdote {
  id: string;
  content: string;
  author: 'alex' | 'ablas';
  topicFields: TopicFieldId[];
  emotionalHook?: string;
}

// === Content ===

interface Post {
  id: string;
  instance: ContentInstance['id'];
  contentType: ContentType['id'];
  topicFields: TopicFieldId[];
  text: string;
  image?: GeneratedImage;
  language: 'en' | 'de';
  hashtags: string[];
  charCount: number;
  isPersonal: boolean;           // Für 4:1 Tracking
  status: 'draft' | 'review' | 'approved' | 'published';
  linkedPosts?: string[];        // Orchestrierung: verbundene Posts
  createdAt: string;
  updatedAt: string;
}

interface GeneratedImage {
  id: string;
  format: 'single-square' | 'single-landscape' | 'single-portrait' | 'carousel-slide' | 'company-banner';
  width: number;
  height: number;
  prompt: string;
  url: string;                   // R2 Storage URL
  templateId?: string;           // Falls template-basiert
}
```

---

## 7. Screen-Map (UI-Konzept)

```
┌─────────────────────────────────────────────────────┐
│  B/CONTENT                                     [≡]  │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│  SIDEBAR │              MAIN AREA                   │
│          │                                          │
│  ┌─────┐ │  Wechselt je nach Sidebar-Auswahl:      │
│  │ ✨  │ │                                          │
│  │ New │ │  • Create  → Content-Erstellungsflow     │
│  │     │ │  • Library → Post-History (F10)          │
│  ├─────┤ │  • Knowledge → Wissensbasis-Viewer (F6)  │
│  │ 📚  │ │  • Orchestrate → 3er-Regel (F7)         │
│  │Libr.│ │                                          │
│  │     │ │                                          │
│  ├─────┤ │                                          │
│  │ 🧠  │ │                                          │
│  │Know.│ │                                          │
│  │     │ │                                          │
│  ├─────┤ │                                          │
│  │ 📊  │ │                                          │
│  │Stats│ │                                          │
│  └─────┘ │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Create-Flow (Hauptscreen)

```
Step 1: Instanz wählen
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  👤 Jürgen   │ │  👤 Sebastian│ │  🏢 BWG      │
│  Alex        │ │  Ablas       │ │  Company     │
│              │ │              │ │              │
│  Nachhalt-   │ │  Innovation  │ │  Relevanz    │
│  igkeit      │ │              │ │  von Draht   │
└──────────────┘ └──────────────┘ └──────────────┘

Step 2: Content-Typ wählen
(dynamisch basierend auf gewählter Instanz)
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📝 Deep Dive │ │ 💬 Position  │ │ ❓ Die Frage │ ...
└──────────────┘ └──────────────┘ └──────────────┘

Step 3: Thema & Input
┌─────────────────────────────────────────────┐
│ Themenfeld: [Dropdown: 13 Felder]           │
│                                             │
│ Kontext / Stichworte:                       │
│ ┌─────────────────────────────────────────┐ │
│ │ "Katheter-Innovation, Flachdraht,      │ │
│ │  MD&M Messe Erlebnis..."               │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Wissensbasis-Vorschläge:                    │
│ 💡 "Unser Draht lässt taube Kinder hören"  │
│ 💡 "11µm Runddraht, already braided"       │
│                                             │
│         [✨ Content generieren]              │
└─────────────────────────────────────────────┘

Step 4: Ergebnis bearbeiten
┌──────────────────────┬──────────────────────┐
│   TEXT                │   BILD               │
│                       │                      │
│ ┌───────────────────┐ │ ┌──────────────────┐ │
│ │ Generierter Post  │ │ │                  │ │
│ │ in der richtigen  │ │ │  [Bild-Preview]  │ │
│ │ Tonalität...      │ │ │                  │ │
│ │                   │ │ │                  │ │
│ │ #Hashtags         │ │ └──────────────────┘ │
│ └───────────────────┘ │                      │
│                       │ Format: [1200×1200▼] │
│ 📊 847 Zeichen        │                      │
│ 🏷️ Deep Dive          │ [🔄 Regenerieren]    │
│ ✅ Fach-Post (3/4)    │ [🎨 Template wählen] │
│                       │                      │
│ [🔄 Variante] [✏️ Edit]│ [⬇️  Export]         │
└──────────────────────┴──────────────────────┘
```

---

## 8. Tech-Stack (bestätigt)

| Komponente | Technologie |
|-----------|-------------|
| Frontend | React + Vite v7 + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend/API | Hono + @cloudflare/vite-plugin |
| AI (Text + Bild) | Google Gemini API (Nano Banana 2) |
| Datenbank | Cloudflare D1 (EU Region) |
| File Storage | Cloudflare R2 (Bilder) |
| Hosting | Cloudflare Pages + Workers (EU) |
| Auth (V1) | Keine (ggf. CF Access) |
| Brand-System | vDNA (`/assets/vdna/tokens.json`) |

---

## 9. Projekt-Struktur

```
B-CONTENT/
├── src/
│   ├── app/                      # React App
│   │   ├── components/
│   │   │   ├── ui/               # Design-System Primitives
│   │   │   ├── create/           # Create-Flow Komponenten
│   │   │   ├── library/          # Post-History
│   │   │   └── knowledge/        # Wissensbasis-Viewer
│   │   ├── hooks/                # Custom Hooks
│   │   ├── stores/               # State Management
│   │   ├── types/                # TypeScript Types
│   │   └── App.tsx
│   │
│   ├── data/
│   │   ├── instances/            # Alex, Ablas, BWG Profile (JSON)
│   │   ├── topics/               # 13 Themenfelder (JSON)
│   │   ├── quotes/               # Zitatsammlung (JSON)
│   │   └── prompts/              # AI System-Prompts pro Instanz/Typ
│   │
│   └── styles/
│       ├── vdna.css              # Auto-generiert aus tokens.json
│       └── index.css             # App-spezifische Styles
│
├── worker/
│   ├── routes/
│   │   ├── generate.ts           # AI Text/Bild Generierung
│   │   ├── knowledge.ts          # Wissensbasis CRUD
│   │   └── posts.ts              # Post CRUD
│   ├── services/
│   │   ├── gemini.ts             # Gemini API Client
│   │   └── prompt-builder.ts     # Prompt-Assembly aus Instanz + Typ + Kontext
│   └── index.ts                  # Hono App
│
├── db/
│   └── schema.sql                # D1 Schema
│
├── tests/
│   └── smoke.spec.ts             # Playwright Smoke Test
│
├── HANDOVER_CONTEXT.md
├── BACKLOG.md
├── CHANGELOG.md
├── PRODUCT_SPEC.md               # ← Du bist hier
├── package.json
├── vite.config.ts
├── wrangler.toml
└── tsconfig.json
```

---

## 10. Abgrenzung & Extension Points

### Was NICHT in V1 kommt (bewusst)

| Feature | Warum nicht | Wann |
|---------|------------|------|
| Login / Auth | Kein Multi-User in V1. CF Access als Stopgap. | Phase 3 (B/WIRE) |
| Auto-Posting | LinkedIn API komplex, Freigabe-Workflow fehlt noch | V3+ |
| Content-Kalender | Nice-to-have, kein Kern-Wert | V2 |
| Multi-Channel | V1 = LinkedIn only | V3+ |
| Analytics | Externes Tool (LinkedIn Analytics) reicht erstmal | V3+ |
| Interview-Pipeline | Audio-Transkription ist eigenes Feature | V2 |

### Extension Points (Architektur-Vorsorge)

Folgende Punkte werden in der Architektur **vorbereitet** aber nicht implementiert:

| Extension Point | Vorbereitung |
|----------------|-------------|
| **Auth** | `AuthProvider` Interface, Null-Auth Implementierung |
| **Multi-Channel** | `Platform` Type mit LinkedIn als einzigem Wert |
| **Kalender** | `Post.scheduledAt` optional im Schema |
| **B/WIRE** | API-Routen hinter `ModuleManifest`, migrierbar |
| **Neue Instanzen** | Instanzen sind JSON-konfiguriert, nicht hardcoded |
| **Neue Content-Typen** | Content-Typen sind JSON-konfiguriert, erweiterbar |
| **Neue Themenfelder** | Themenfelder sind JSON-konfiguriert, erweiterbar |

---

## 11. Risiken & Mitigationen

| Risiko | Impact | Mitigation |
|--------|--------|-----------|
| Gilroy-Font keine Web-Lizenz | UI sieht anders aus | Arial-Fallback definiert, wirkt trotzdem professionell |
| Gemini API Qualität für Tonalität | Posts klingen nicht nach Alex/Ablas | Detaillierte System-Prompts mit Beispiel-Posts als Few-Shot |
| Nano Banana 2 Bild-Qualität | Bilder sind nicht brand-konform genug | Template-basierter Fallback (Logo + Text + Farben) |
| DSGVO Gemini | Daten verlassen EU | Vertex AI EU-Endpoint nutzen |
| Scope Creep | Kabelsalat | Dieses Dokument als Vertrag. Kein Feature ohne Eintrag hier. |
