import { Hono } from "hono";
import { cors } from "hono/cors";
import { AppError } from "./services/gemini";
import { generateRoutes } from "./routes/generate";
import { knowledgeRoutes } from "./routes/knowledge";
import { postRoutes } from "./routes/posts";
import { orchestrateRoutes } from "./routes/orchestrate";
import { statsRoutes } from "./routes/stats";

export interface Env {
    DB: D1Database;
    IMAGES: R2Bucket;
    KB_STORE: KVNamespace;
    GEMINI_API_KEY: string;
    ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware — restrict CORS to known origins
app.use("/api/*", cors({
    origin: [
        "https://b-content.maschkeai.workers.dev",
        "http://localhost:5173",
    ],
    allowMethods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
}));

// Global error handler — masks internal details from client responses
app.onError((err, c) => {
    if (err instanceof AppError) {
        return c.json({ error: err.message, code: err.code }, err.status as 400 | 429 | 500 | 502 | 504);
    }

    // 🛡️ ZINK: Catch JSON syntax errors from invalid c.req.json() payloads globally.
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
        return c.json({ error: "Invalid JSON format", code: "INVALID_JSON" }, 400);
    }

    // Log full error internally, return safe message to client
    console.error(`[Unhandled Error] ${err.message}`, err.stack);
    return c.json({ error: "Internal server error" }, 500);
});

// Health check
app.get("/api/health", (c) =>
    c.json({ status: "ok", environment: c.env.ENVIRONMENT })
);

// Mount routes
app.route("/api/generate", generateRoutes);
app.route("/api/knowledge", knowledgeRoutes);
app.route("/api/posts", postRoutes);
app.route("/api/orchestrate", orchestrateRoutes);
app.route("/api/stats", statsRoutes);

// ============================================================
// Image Serving — GET /api/images/:key+
// Retrieves generated images from R2 and serves with proper headers
// ============================================================
// R2 key validation pattern: {instance}/{date}/{uuid}.{ext}
const R2_KEY_PATTERN = /^[a-z]{2,5}\/\d{4}-\d{2}-\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg)$/;

app.get("/api/images/*", async (c) => {
    // Extract the R2 key from the URL path (everything after /api/images/)
    const key = c.req.path.replace("/api/images/", "");

    if (!key) {
        return c.json({ error: "Image key is required" }, 400);
    }

    // Validate key format to prevent path traversal
    if (!R2_KEY_PATTERN.test(key)) {
        return c.json({ error: "Invalid image key format" }, 400);
    }

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
});

export default app;

