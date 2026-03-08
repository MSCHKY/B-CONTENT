// ============================================================
// B/CONTENT — Shared Constants
// Single source of truth for labels, variants, and mappings
// used across both frontend components and worker routes.
// ============================================================

export type InstanceId = "alex" | "ablas" | "bwg";

// --- Instance Labels ---

export const INSTANCE_LABELS: Record<string, string> = {
    alex: "Jürgen Alex",
    ablas: "Sebastian Ablas",
    bwg: "BWG Company",
};

// --- Instance IDs (ordered) ---

export const INSTANCE_IDS: InstanceId[] = ["alex", "ablas", "bwg"];

// --- Status Badge Variants ---

export const STATUS_VARIANTS: Record<string, "default" | "accent" | "warning" | "muted" | "success"> = {
    draft: "muted",
    scheduled: "accent",
    review: "warning",
    approved: "success",
    published: "default",
    archived: "muted",
};

// --- Instance Colors (Tailwind utility classes) ---

export const INSTANCE_COLORS_DOT: Record<string, string> = {
    alex: "bg-emerald-500",
    ablas: "bg-cyan-500",
    bwg: "bg-amber-500",
};

export const INSTANCE_HEX: Record<string, string> = {
    alex: "#10b981",
    ablas: "#06b6d4",
    bwg: "#f59e0b",
};

export const INSTANCE_COLORS_BORDER: Record<string, string> = {
    alex: "border-l-deep-green",
    ablas: "border-l-crisp-cyan",
    bwg: "border-l-bright-green",
};

export const INSTANCE_COLORS_BG: Record<string, string> = {
    alex: "bg-emerald-500/10 border-emerald-500/20",
    ablas: "bg-cyan-500/10 border-cyan-500/20",
    bwg: "bg-amber-500/10 border-amber-500/20",
};

export const INSTANCE_COLORS_GRADIENT: Record<string, string> = {
    alex: "from-emerald-500/20 to-emerald-900/10 border-emerald-500/30",
    ablas: "from-cyan-500/20 to-cyan-900/10 border-cyan-500/30",
    bwg: "from-amber-500/20 to-amber-900/10 border-amber-500/30",
};

export const INSTANCE_ACCENT: Record<string, string> = {
    alex: "text-emerald-400",
    ablas: "text-cyan-400",
    bwg: "text-amber-400",
};

// --- Topic Labels ---

export const TOPIC_LABELS: Record<string, string> = {
    energie: "Energie & Energiewende",
    circular: "Circular Economy",
    medtech: "Medizintechnik",
    bau: "Bau & Infrastruktur",
    alltag: "Alltagsprodukte & Tech",
    luxus: "Luxus & Kultur",
    sicherheit: "Sicherheit & Defence",
    wasser: "Wasser & Filtration",
    "vertikale-integration": "Vertikale Integration",
    geopolitik: "Geopolitische Resilienz",
    "image-reframe": "Image-Reframe",
    "ingredient-branding": "Ingredient Branding",
    qualitaet: "Qualität",
};

// --- Content-Type Labels ---

export const CONTENT_TYPE_LABELS: Record<string, string> = {
    "deep-dive": "Deep Dive",
    "position": "Position",
    "frage": "Die Frage",
    "persoenlich": "Persönlich",
    "proof-point": "Proof Point",
    "wusstest-du": "Wusstest du?",
    "messe-story": "Messe/Story",
    "draht-steckt-in": "Draht steckt in…",
    "unternehmensnews": "News",
    "behind-the-scenes": "Behind the Scenes",
    "zahlen-fakten": "Zahlen & Fakten",
    "website-article": "Website-Beitrag",
};
