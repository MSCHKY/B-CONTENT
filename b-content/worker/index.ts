import { Hono } from "hono";
import { cors } from "hono/cors";
import { generateRoutes } from "./routes/generate";
import { knowledgeRoutes } from "./routes/knowledge";

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

export default app;
