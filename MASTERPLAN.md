# 🎯 BENDERWIRE GROUP — Masterplan

> **Version:** 0.1.0
> **Erstellt:** 2026-03-06
> **Status:** Draft — Planungsphase

---

## 1. Vision

Ein modulares Tool-Ökosystem für die Benderwire Group, das interne Prozesse (Marketing, Sales, Operations) mit maßgeschneiderten AI-gestützten Werkzeugen unterstützt.

---

## 2. Architektur-Prinzipien

### 2.1 Modul-Architektur
```
                    ┌──────────────┐
                    │   B/WIRE     │  (Core — Phase 2+)
                    │   (Hub)      │
                    └──┬───┬───┬───┘
                       │   │   │
              ┌────────┘   │   └────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │B/CONTENT │ │ B/???    │ │ B/???    │
        │(MVP now) │ │(Future)  │ │(Future)  │
        └──────────┘ └──────────┘ └──────────┘
```

### 2.2 Design-Prinzipien
1. **Standalone First:** Jedes Modul funktioniert eigenständig
2. **Core-Ready Interfaces:** Definierte Schnittstellen für spätere Hub-Integration
3. **vDNA (Virtual DNA):** Zentrales Brand-Token-System (`/assets/vdna/tokens.json`), von ALLEN Modulen konsumiert
4. **Shared Type Contracts:** TypeScript-Interfaces die modulübergreifend gelten (User, Auth, API)
5. **DSGVO-First:** Alle Datenverarbeitung EU-konform. Cloudflare EU-Region, Gemini EU-Endpoint (Vertex AI)

### 2.3 Core-Ready Patterns (für B/CONTENT beachten)
- **Auth-Adapter:** Abstrahiertes Interface (`AuthProvider`) → aktuell Null-Auth, später B/WIRE-Auth einsteckbar. **Auth wird bewusst auf Phase 3 deferred.**
- **API-Layer:** Hono mit typed Routes → kann später hinter B/WIRE Gateway sitzen
- **Data-Layer:** D1-Abstraktion → DB kann später von B/WIRE zentral verwaltet werden
- **vDNA-Consumption:** Alle Module importieren Brand-Tokens aus `/assets/vdna/` — keine hardcodierten Farben/Fonts

---

## 3. Modul: B/CONTENT — Content-Maschine

### 3.1 Ziel
Marketing-Abteilung befähigen, professionellen LinkedIn-Content (Bilder + Text) schnell und brand-konform zu erstellen.

### 3.2 User Stories (Draft)

> ⚠️ Diese User Stories sind ein erster Entwurf. Refinement mit dem Kunden steht aus.

| ID   | Als...           | Möchte ich...                                        | Damit...                                    |
|------|------------------|------------------------------------------------------|---------------------------------------------|
| US01 | Marketing-MA     | Ein LinkedIn-Bild mit Brand-Elementen generieren     | ich schnell visuellen Content habe          |
| US02 | Marketing-MA     | Einen Posting-Text generieren lassen                 | ich Inspiration/Basis für meinen Post habe  |
| US03 | Marketing-MA     | Vorlagen für wiederkehrende Post-Typen nutzen        | ich konsistentes Branding sicherstelle      |
| US04 | Marketing-MA     | Generierte Inhalte vor Veröffentlichung bearbeiten   | ich die finale Kontrolle behalte            |
| US05 | Marketing-Lead   | Einen Content-Kalender pflegen                       | Postings planbar und regelmäßig sind        |
| US06 | Marketing-MA     | Brand-Assets (Logo, Farben, Fonts) zentral haben     | alles einheitlich aussieht                  |
| US07 | Marketing-MA     | Verschiedene LinkedIn-Formate nutzen (Karussell, Single, Poll) | ich vielfältigen Content erstelle |

### 3.3 MVP Scope (V1)

> ⚠️ Noch nicht final — wird nach Anforderungs-Workshop festgelegt

**IN Scope (Vorschlag):**
- [ ] Bild-Generator mit Brand-Templates
- [ ] Text-Generator für LinkedIn-Posts
- [ ] Template-Bibliothek (vorgefertigte Layouts)
- [ ] Brand-Asset-Management (Logo, Farben, Fonts)
- [ ] Export-Funktion (Download-ready für LinkedIn)

**OUT of Scope (V1):**
- Automatisches Posting auf LinkedIn (API-Integration)
- Content-Kalender
- Multi-User / Team-Features
- B/WIRE Integration
- Analytics / Performance-Tracking

### 3.4 Tech-Stack (Vorschlag)

> ⚠️ Noch nicht final entschieden

| Komponente       | Technologie                       | Status     | Begründung                                          |
|------------------|-----------------------------------|------------|-----------------------------------------------------|
| Frontend         | React + Vite v7 + TypeScript      | ✅ Bestätigt| Bewährter Stack, Robert's Erfahrung                 |
| Styling          | Tailwind CSS v4                   | ✅ Bestätigt| Schnell, konsistent, Design-Token-ready             |
| Backend/API      | Hono + @cloudflare/vite-plugin    | ✅ Bestätigt| Full-Stack Monorepo, typed D1/KV Bindings           |
| AI: Bilder       | **Nano Banana 2** (Gemini API)    | ✅ Bestätigt| Precision Text Rendering, Subject Consistency, 4K   |
| AI: Text         | **Gemini API** (Text Generation)  | ✅ Bestätigt| Gleicher Provider wie Bilder → 1 API-Key            |
| Datenbank        | Cloudflare D1 (EU Region)         | ✅ Bestätigt| CF-native, Hono D1-Support, DSGVO-konform           |
| Auth             | Null-Auth → B/WIRE (Phase 3)      | ⏸️ Deferred | Auth-Adapter vorbereiten, Implementierung später    |
| Hosting          | Cloudflare Pages + Workers (EU)   | ✅ Bestätigt| Git-Deploy, Data Localization Suite für DSGVO        |
| Brand-System     | **vDNA** (`/assets/vdna/`)        | ✅ Bestätigt| Zentrales Token-System, modulübergreifend            |
| Bild-Verarbeitung| Canvas API / Nano Banana 2        | 🔲 Offen   | Template-Rendering noch zu evaluieren               |

---

## 4. Roadmap (High-Level)

### Phase 0: Foundation (← wir sind hier)
- [x] Projekt-Infrastruktur
- [ ] Anforderungen finalisieren
- [ ] Tech-Stack entscheiden
- [ ] Design-System definieren
- [ ] Architektur-Blueprint

### Phase 1: MVP B/CONTENT
- [ ] Core UI (Editor-Interface)
- [ ] Template-Engine (Bild-Layouts)
- [ ] AI Text-Generator Integration
- [ ] AI Bild-Generator Integration
- [ ] Brand-Asset-System
- [ ] Export-Pipeline

### Phase 2: Polish & Pitch
- [ ] UX-Feinschliff
- [ ] Demo-Modus für Pitch
- [ ] Dokumentation

### Phase 3: B/WIRE Core (Zukunft)
- [ ] Auth-System
- [ ] Modul-Hub
- [ ] B/CONTENT Migration auf B/WIRE

---

## 5. Offene Fragen

| #  | Frage                                                                 | Status       |
|----|-----------------------------------------------------------------------|-------------|
| Q1 | Welche LinkedIn-Post-Formate sind Priorität? (Single, Karussell, etc.)| 🔲 Offen     |
| Q2 | Gibt es ein bestehendes Brand-Manual / CI?                            | 🔲 Offen     |
| Q3 | Wer sind die tatsächlichen Nutzer? (1 Person? Team?)                  | 🔲 Offen     |
| Q4 | Budget für AI-APIs? (Bild-Generierung kostet pro Bild)                | 🔲 Offen     |
| Q5 | Soll das Tool intern gehostet werden oder SaaS?                       | 🔲 Offen     |
| Q6 | Gibt es bestehende Content-Workflows die wir abbilden müssen?         | 🔲 Offen     |
| Q7 | ~~Welche AI-Provider sind akzeptabel?~~                               | ✅ Gemini API |
| Q8 | Gemini EU-Endpoint (Vertex AI) oder Standard-API?                     | 🔲 Offen     |
