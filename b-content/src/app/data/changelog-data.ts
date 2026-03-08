/**
 * Changelog data for the in-app version modal.
 * Update this file when creating a new release.
 */

export interface ChangelogEntry {
    version: string;
    date: string;
    highlights: string[];
}

export const APP_VERSION = "1.0.0-beta.0";

export const changelog: ChangelogEntry[] = [
    {
        version: "1.0.0-beta.0",
        date: "2026-03-08",
        highlights: [
            "Analytics Dashboard (Timeline, Content-Types, Cadence, Scheduling Health)",
            "Interview-Pipeline (Audio → Transkription → Wissensbasis-Import)",
            "Content-Kalender (Drag & Drop, 2-Tage-Regel, Konflikterkennung)",
            "Component Splitting & Code-Audit Hardening",
        ],
    },
    {
        version: "0.3.0",
        date: "2026-03-07",
        highlights: [
            "Content-Orchestrierung (Dreier-Regel: Alex / Ablas / BWG)",
            "4:1 Ratio Tracker & Stats-Dashboard",
            "Wissensbasis-Editor (CRUD für Themen & Zitate)",
            "Bibliothek-Archiv (Soft-Delete, Restore, Purge)",
            "Sprachumschaltung DE / EN",
        ],
    },
    {
        version: "0.2.0",
        date: "2026-03-06",
        highlights: [
            "AI Text-Generierung (Gemini 2.0 Flash)",
            "AI Bild-Generierung (Gemini 2.5 Flash Image + vDNA)",
            "Content-Bibliothek (D1 Persistierung + UI)",
            "Visual Premium Upgrade (Glassmorphism, Animationen)",
        ],
    },
    {
        version: "0.1.0",
        date: "2026-03-06",
        highlights: [
            "Projekt-Foundation (Vite + React + Hono + Tailwind v4)",
            "Design System (6 UI-Primitives, Sidebar, AppShell)",
            "Create-Flow (4-Step Wizard)",
            "Wissensbasis-Viewer (Themen, Zitate, Regeln)",
        ],
    },
];
