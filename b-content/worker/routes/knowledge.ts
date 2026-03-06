import { Hono } from "hono";
import type { Env } from "../index";

// Static imports of knowledge base data
import topicFields from "../../src/data/topics/topic-fields.json";
import quotesData from "../../src/data/quotes/quotes.json";
import contentRules from "../../src/data/content-rules.json";

export const knowledgeRoutes = new Hono<{ Bindings: Env }>();

// GET /api/knowledge/topics
knowledgeRoutes.get("/topics", (c) => {
    return c.json(topicFields);
});

// GET /api/knowledge/topics/:id
knowledgeRoutes.get("/topics/:id", (c) => {
    const id = c.req.param("id");
    const fields = topicFields as { id: string }[];
    const field = fields.find((f) => f.id === id);

    if (!field) {
        return c.json({ error: "Topic field not found" }, 404);
    }
    return c.json(field);
});

// GET /api/knowledge/quotes
knowledgeRoutes.get("/quotes", (c) => {
    const author = c.req.query("author");

    if (author) {
        const groups = quotesData as { author: string; quotes: unknown[] }[];
        const group = groups.find((g) => g.author === author);
        return c.json(group?.quotes ?? []);
    }

    return c.json(quotesData);
});

// GET /api/knowledge/rules
knowledgeRoutes.get("/rules", (c) => {
    return c.json(contentRules);
});
