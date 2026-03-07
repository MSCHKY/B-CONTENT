import { Hono } from "hono";
import type { Env } from "../index";

// Static imports of knowledge base data (defaults)
import staticTopics from "../../src/data/topics/topic-fields.json";
import staticQuotes from "../../src/data/quotes/quotes.json";
import contentRules from "../../src/data/content-rules.json";

// --- Types for KB data ---
interface TopicData {
    id: string;
    label: string;
    kernbotschaft: string;
    instances: Record<string, number>;
    facts: string[];
    keywords: string[];
}

interface QuoteItem {
    id: string;
    content: string;
    topics: string[];
    emotion: string;
    context?: string;
}

interface QuoteGroup {
    author: string;
    name: string;
    quotes: QuoteItem[];
}

// --- KV Overlay Helpers ---

/** Get topics: KV override merged with static defaults */
async function getTopics(kv: KVNamespace): Promise<TopicData[]> {
    const override = await kv.get("kb_topics", "json");
    if (override) return override as TopicData[];
    return structuredClone(staticTopics) as TopicData[];
}

async function saveTopics(kv: KVNamespace, topics: TopicData[]): Promise<void> {
    await kv.put("kb_topics", JSON.stringify(topics));
}

/** Get quotes: KV override merged with static defaults */
async function getQuotes(kv: KVNamespace): Promise<QuoteGroup[]> {
    const override = await kv.get("kb_quotes", "json");
    if (override) return override as QuoteGroup[];
    return structuredClone(staticQuotes) as QuoteGroup[];
}

async function saveQuotes(kv: KVNamespace, quotes: QuoteGroup[]): Promise<void> {
    await kv.put("kb_quotes", JSON.stringify(quotes));
}

// --- Router ---

export const knowledgeRoutes = new Hono<{ Bindings: Env }>();

// ============================================================
// READ endpoints
// ============================================================

// GET /api/knowledge/topics
knowledgeRoutes.get("/topics", async (c) => {
    const topics = await getTopics(c.env.KB_STORE);
    return c.json(topics);
});

// GET /api/knowledge/topics/:id
knowledgeRoutes.get("/topics/:id", async (c) => {
    const id = c.req.param("id");
    const topics = await getTopics(c.env.KB_STORE);
    const field = topics.find((f) => f.id === id);
    if (!field) return c.json({ error: "Topic field not found" }, 404);
    return c.json(field);
});

// GET /api/knowledge/quotes
knowledgeRoutes.get("/quotes", async (c) => {
    const author = c.req.query("author");
    const groups = await getQuotes(c.env.KB_STORE);

    if (author) {
        const group = groups.find((g) => g.author === author);
        return c.json(group?.quotes ?? []);
    }
    return c.json(groups);
});

// GET /api/knowledge/rules
knowledgeRoutes.get("/rules", (c) => {
    return c.json(contentRules);
});

// ============================================================
// TOPIC CRUD — facts & keywords
// ============================================================

// PUT /api/knowledge/topics/:id — Update a topic (facts, keywords)
knowledgeRoutes.put("/topics/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{ facts?: string[]; keywords?: string[] }>();
    const topics = await getTopics(c.env.KB_STORE);
    const idx = topics.findIndex((t) => t.id === id);
    if (idx === -1) return c.json({ error: "Topic not found" }, 404);

    const topic = topics[idx]!;
    if (body.facts) topic.facts = body.facts;
    if (body.keywords) topic.keywords = body.keywords;

    await saveTopics(c.env.KB_STORE, topics);
    return c.json(topic);
});

// POST /api/knowledge/topics/:id/facts — Add a fact
knowledgeRoutes.post("/topics/:id/facts", async (c) => {
    const id = c.req.param("id");
    const { fact } = await c.req.json<{ fact: string }>();
    if (!fact?.trim()) return c.json({ error: "Fact is required" }, 400);

    const topics = await getTopics(c.env.KB_STORE);
    const topic = topics.find((t) => t.id === id);
    if (!topic) return c.json({ error: "Topic not found" }, 404);

    topic.facts.push(fact.trim());
    await saveTopics(c.env.KB_STORE, topics);
    return c.json(topic, 201);
});

// DELETE /api/knowledge/topics/:id/facts/:index — Remove a fact by index
knowledgeRoutes.delete("/topics/:id/facts/:index", async (c) => {
    const id = c.req.param("id");
    const index = parseInt(c.req.param("index"), 10);
    if (isNaN(index)) return c.json({ error: "Invalid fact index" }, 400);

    const topics = await getTopics(c.env.KB_STORE);
    const topic = topics.find((t) => t.id === id);
    if (!topic) return c.json({ error: "Topic not found" }, 404);
    if (index < 0 || index >= topic.facts.length) return c.json({ error: "Fact index out of range" }, 400);

    topic.facts.splice(index, 1);
    await saveTopics(c.env.KB_STORE, topics);
    return c.json(topic);
});

// ============================================================
// QUOTE CRUD
// ============================================================

// POST /api/knowledge/quotes — Add a new quote
knowledgeRoutes.post("/quotes", async (c) => {
    const body = await c.req.json<{
        author: string;
        content: string;
        topics?: string[];
        emotion?: string;
        context?: string;
    }>();
    if (!body.author?.trim() || !body.content?.trim()) {
        return c.json({ error: "Author and content are required" }, 400);
    }

    const groups = await getQuotes(c.env.KB_STORE);
    let group = groups.find((g) => g.author === body.author);

    // If author group doesn't exist, create it
    if (!group) {
        group = { author: body.author, name: body.author, quotes: [] };
        groups.push(group);
    }

    const newQuote: QuoteItem = {
        id: `${body.author}-${Date.now()}`,
        content: body.content.trim(),
        topics: body.topics ?? [],
        emotion: body.emotion ?? "",
        context: body.context,
    };

    group.quotes.push(newQuote);
    await saveQuotes(c.env.KB_STORE, groups);
    return c.json(newQuote, 201);
});

// PUT /api/knowledge/quotes/:id — Update a quote
knowledgeRoutes.put("/quotes/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<Partial<QuoteItem>>();
    const groups = await getQuotes(c.env.KB_STORE);

    for (const group of groups) {
        const idx = group.quotes.findIndex((q) => q.id === id);
        if (idx !== -1) {
            const quote = group.quotes[idx]!;
            if (body.content) quote.content = body.content;
            if (body.topics) quote.topics = body.topics;
            if (body.emotion !== undefined) quote.emotion = body.emotion ?? "";
            if (body.context !== undefined) quote.context = body.context ?? undefined;

            await saveQuotes(c.env.KB_STORE, groups);
            return c.json(quote);
        }
    }
    return c.json({ error: "Quote not found" }, 404);
});

// DELETE /api/knowledge/quotes/:id — Delete a quote
knowledgeRoutes.delete("/quotes/:id", async (c) => {
    const id = c.req.param("id");
    const groups = await getQuotes(c.env.KB_STORE);

    for (const group of groups) {
        const idx = group.quotes.findIndex((q) => q.id === id);
        if (idx !== -1) {
            group.quotes.splice(idx, 1);
            await saveQuotes(c.env.KB_STORE, groups);
            return c.json({ success: true });
        }
    }
    return c.json({ error: "Quote not found" }, 404);
});
