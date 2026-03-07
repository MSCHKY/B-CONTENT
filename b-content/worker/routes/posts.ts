import { Hono } from "hono";
import type { Env } from "../index";
import { validateRequiredString, validateInstanceId, validateContentType, validateTextLength, sanitizeText } from "../services/validation";
import type { InstanceId } from "../services/validation";

/**
 * Hono router for post management endpoints.
 *
 * Provides CRUD operations for generated content (posts) stored in the D1 database.
 *
 * @type {Hono<{ Bindings: Env }>}
 * @example
 * app.route("/api/posts", postRoutes);
 */
export const postRoutes = new Hono<{ Bindings: Env }>();

// ============================================================
// POST /api/posts — Save a generated post to D1
// ============================================================
postRoutes.post("/", async (c) => {
    const body = await c.req.json<{
        instance: string;
        contentType: string;
        topicFields: string[];
        text: string;
        language: string;
        hashtags: string[];
        charCount: number;
        isPersonal?: boolean;
        imageId?: string;
    }>();

    body.text = sanitizeText(body.text);
    if (Array.isArray(body.hashtags)) {
        body.hashtags = body.hashtags.map(h => sanitizeText(h));
    }

    // topicFields and hashtags are optional — allow empty arrays
    if (!Array.isArray(body.topicFields)) body.topicFields = [];
    if (!Array.isArray(body.hashtags)) body.hashtags = [];

    const errors = [
        body.contentType !== "website-article" ? validateRequiredString(body.instance, "instance") : null,
        body.contentType !== "website-article" ? validateInstanceId(body.instance) : null,
        validateRequiredString(body.contentType, "contentType"),
        validateRequiredString(body.text, "text"),
        validateRequiredString(body.language, "language"),
    ].filter(Boolean);

    if (errors.length === 0 && body.contentType !== "website-article") {
        const cTypeError = validateContentType(body.instance as InstanceId, body.contentType);
        if (cTypeError) errors.push(cTypeError);
    }

    if (errors.length === 0) {
        const lenError = validateTextLength(body.instance, body.contentType, body.text);
        if (lenError) errors.push(lenError);
    }

    if (errors.length > 0) {
        return c.json(errors[0], 400);
    }

    const id = crypto.randomUUID();

    try {
        await c.env.DB.prepare(
            `INSERT INTO posts (id, instance, content_type, topic_fields, text, language, hashtags, char_count, is_personal, status, image_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`
        )
            .bind(
                id,
                body.instance,
                body.contentType,
                JSON.stringify(body.topicFields),
                body.text,
                body.language,
                JSON.stringify(body.hashtags),
                body.charCount,
                body.isPersonal ? 1 : 0,
                body.imageId ?? null,
            )
            .run();

        return c.json({ id, status: "saved" }, 201);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Failed to save post: ${message}` }, 500);
    }
});

// ============================================================
// GET /api/posts — List all posts (with filters)
// ============================================================
postRoutes.get("/", async (c) => {
    const instance = c.req.query("instance");
    const contentType = c.req.query("contentType");
    const status = c.req.query("status");
    const limit = parseInt(c.req.query("limit") ?? "50", 10);
    const offset = parseInt(c.req.query("offset") ?? "0", 10);

    let query = "SELECT * FROM posts";
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (instance) {
        conditions.push("instance = ?");
        params.push(instance);
    }
    if (contentType) {
        conditions.push("content_type = ?");
        params.push(contentType);
    }
    if (status) {
        conditions.push("status = ?");
        params.push(status);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    try {
        const result = await c.env.DB.prepare(query).bind(...params).all();

        // Also get image data for posts that have images
        const posts = result.results.map((row) => ({
            ...row,
            topic_fields: JSON.parse((row.topic_fields as string) || "[]"),
            hashtags: JSON.parse((row.hashtags as string) || "[]"),
        }));

        return c.json({ posts, total: posts.length });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Failed to fetch posts: ${message}` }, 500);
    }
});

// ============================================================
// GET /api/posts/:id — Get a single post
// ============================================================
postRoutes.get("/:id", async (c) => {
    const id = c.req.param("id");

    try {
        const post = await c.env.DB.prepare("SELECT * FROM posts WHERE id = ?")
            .bind(id)
            .first();

        if (!post) {
            return c.json({ error: "Post not found" }, 404);
        }

        // Parse JSON fields
        const parsed = {
            ...post,
            topic_fields: JSON.parse((post.topic_fields as string) || "[]"),
            hashtags: JSON.parse((post.hashtags as string) || "[]"),
        };

        // If post has an image, fetch image data too
        if (post.image_id) {
            const image = await c.env.DB.prepare(
                "SELECT * FROM generated_images WHERE id = ?"
            )
                .bind(post.image_id)
                .first();
            return c.json({ ...parsed, image });
        }

        return c.json(parsed);
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Failed to fetch post: ${message}` }, 500);
    }
});

// ============================================================
// PATCH /api/posts/:id — Update post (text, status)
// ============================================================
postRoutes.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json<{
        text?: string;
        status?: string;
        hashtags?: string[];
        imageId?: string;
    }>();

    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (body.text !== undefined) {
        updates.push("text = ?");
        params.push(body.text);
        updates.push("char_count = ?");
        params.push(body.text.length);
    }
    if (body.status !== undefined) {
        updates.push("status = ?");
        params.push(body.status);
    }
    if (body.hashtags !== undefined) {
        updates.push("hashtags = ?");
        params.push(JSON.stringify(body.hashtags));
    }
    if (body.imageId !== undefined) {
        updates.push("image_id = ?");
        params.push(body.imageId);
    }

    if (updates.length === 0) {
        return c.json({ error: "No fields to update" }, 400);
    }

    updates.push("updated_at = datetime('now')");
    params.push(id);

    try {
        await c.env.DB.prepare(
            `UPDATE posts SET ${updates.join(", ")} WHERE id = ?`
        )
            .bind(...params)
            .run();

        return c.json({ id, status: "updated" });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Failed to update post: ${message}` }, 500);
    }
});

// ============================================================
// DELETE /api/posts/:id — Delete a post
// ============================================================
postRoutes.delete("/:id", async (c) => {
    const id = c.req.param("id");

    try {
        await c.env.DB.prepare("DELETE FROM posts WHERE id = ?")
            .bind(id)
            .run();

        return c.json({ id, status: "deleted" });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Failed to delete post: ${message}` }, 500);
    }
});
