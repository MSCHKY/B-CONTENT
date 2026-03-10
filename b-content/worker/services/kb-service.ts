// ============================================================
// B/CONTENT — Shared Knowledge Base Service
// Canonical KV Overlay helpers for Topics & Quotes.
// Used by both Knowledge CRUD routes and Interview Import.
// ============================================================

// Static imports of knowledge base data (defaults)
import staticTopics from "../../src/data/topics/topic-fields.json";
import staticQuotes from "../../src/data/quotes/quotes.json";

// --- Types for KB data ---

export interface TopicData {
    id: string;
    label: string;
    kernbotschaft: string;
    instances: Record<string, number>;
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

// --- KV Overlay Helpers ---

/** Get topics: KV override or static defaults */
export async function getTopics(kv: KVNamespace): Promise<TopicData[]> {
    try {
        const override = await kv.get("kb_topics", "json");
        if (override) return override as TopicData[];
    } catch (err) {
        console.error("[KV] Failed to read kb_topics, using static defaults:", err instanceof Error ? err.message : err);
    }
    return structuredClone(staticTopics) as TopicData[];
}

/** Save topics to KV overlay */
export async function saveTopics(kv: KVNamespace, topics: TopicData[]): Promise<void> {
    try {
        await kv.put("kb_topics", JSON.stringify(topics));
    } catch (err) {
        console.error("[KV] Failed to save kb_topics:", err instanceof Error ? err.message : err);
        throw new Error("Failed to persist topic changes");
    }
}

/** Get quotes: KV override or static defaults */
export async function getQuotes(kv: KVNamespace): Promise<QuoteGroup[]> {
    try {
        const override = await kv.get("kb_quotes", "json");
        if (override) return override as QuoteGroup[];
    } catch (err) {
        console.error("[KV] Failed to read kb_quotes, using static defaults:", err instanceof Error ? err.message : err);
    }
    return structuredClone(staticQuotes) as QuoteGroup[];
}

/** Save quotes to KV overlay */
export async function saveQuotes(kv: KVNamespace, quotes: QuoteGroup[]): Promise<void> {
    try {
        await kv.put("kb_quotes", JSON.stringify(quotes));
    } catch (err) {
        console.error("[KV] Failed to save kb_quotes:", err instanceof Error ? err.message : err);
        throw new Error("Failed to persist quote changes");
    }
}
