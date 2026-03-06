import { Hono } from "hono";
import { cors } from "hono/cors";
import { generateRoutes } from "./routes/generate";
import { knowledgeRoutes } from "./routes/knowledge";
import { postRoutes } from "./routes/posts";

export interface Env {
    DB: D1Database;
    IMAGES: R2Bucket;
    GEMINI_API_KEY: string;
    ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("/api/*", cors());

// Health check
app.get("/api/health", (c) =>
    c.json({ status: "ok", environment: c.env.ENVIRONMENT })
);

// Mount routes
app.route("/api/generate", generateRoutes);
app.route("/api/knowledge", knowledgeRoutes);
app.route("/api/posts", postRoutes);

// ============================================================
// Image Serving — GET /api/images/:key+
// Retrieves generated images from R2 and serves with proper headers
// ============================================================
app.get("/api/images/*", async (c) => {
    // Extract the R2 key from the URL path (everything after /api/images/)
    const key = c.req.path.replace("/api/images/", "");

    if (!key) {
        return c.json({ error: "Image key is required" }, 400);
    }

    try {
        const object = await c.env.IMAGES.get(key);

        if (!object) {
            return c.json({ error: "Image not found" }, 404);
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        // Cache for 1 year — images are immutable (UUID-keyed)
        headers.set("cache-control", "public, max-age=31536000, immutable");

        return new Response(object.body, { headers });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Image retrieval failed: ${message}` }, 500);
    }
});

export default app;

