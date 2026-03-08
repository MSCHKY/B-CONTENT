// ============================================================
// B/CONTENT — Knowledge Types
// ============================================================

export type KnowledgeTab = "topics" | "quotes" | "rules";

export interface TopicFieldData {
    id: string;
    label: string;
    kernbotschaft: string;
    facts: string[];
    keywords: string[];
}

export interface QuoteItem {
    id: string;
    content: string;
    topics: string[];
    emotion: string;
    context?: string;
}

export interface QuoteGroup {
    author: string;
    name: string;
    quotes: QuoteItem[];
}

export interface ContentRules {
    posting_rules: {
        ratio: { fach_zu_persoenlich: string; beschreibung: string };
        max_oberthemen: { value: number; beschreibung: string };
        posting_abstand: { min_tage: number; beschreibung: string };
        sprache_default: string;
        sprache_regeln: { englisch: string; deutsch: string };
        website_artikel: string;
    };
    content_principles: Record<string, { formel?: string; beschreibung?: string; beispiel?: string; pruefstein?: string; konsequenz?: string }>;
    leitplanken: { erlaubt: string[]; verboten: string[] };
    orchestrierung: {
        dreier_regel: { beschreibung: string; wirkung: string };
    };
    freigabe: { prinzip: string; beschreibung: string };
}
