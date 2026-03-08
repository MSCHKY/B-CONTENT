import { Hono } from "hono";
import type { Env } from "../index";

/**
 * Hono router for calendar endpoints.
 *
 * Provides scheduling, month-view queries, and conflict detection
 * for the content calendar (Z-002).
 */
export const calendarRoutes = new Hono<{ Bindings: Env }>();

// ============================================================
// GET /api/calendar — Posts for a given month (scheduled + unscheduled)
// Query params: month (YYYY-MM), instance (optional)
// ============================================================
calendarRoutes.get("/", async (c) => {
    const month = c.req.query("month"); // e.g. "2026-03"
    const instance = c.req.query("instance");

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return c.json({ error: "month query param required (YYYY-MM)" }, 400);
    }

    const startDate = `${month}-01`;
    // Calculate end of month by going to next month
    const [yearStr, monStr] = month.split("-");
    const year = Number(yearStr);
    const mon = Number(monStr);
    const nextMonth = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, "0")}`;
    const endDate = `${nextMonth}-01`;

    let query = `
        SELECT p.*, gi.url as img_url, gi.format as img_format
        FROM posts p
        LEFT JOIN generated_images gi ON p.image_id = gi.id
        WHERE p.status != 'archived'
          AND (
            (p.scheduled_at >= ? AND p.scheduled_at < ?)
            OR (p.scheduled_at IS NULL AND p.status = 'draft')
          )
    `;
    const params: (string | number)[] = [startDate, endDate];

    if (instance) {
        query += " AND p.instance = ?";
        params.push(instance);
    }

    query += " ORDER BY p.scheduled_at ASC, p.created_at DESC";

    try {
        const result = await c.env.DB.prepare(query).bind(...params).all();

        const scheduled = result.results
            .filter((r) => r.scheduled_at)
            .map(mapPostRow);
        const unscheduled = result.results
            .filter((r) => !r.scheduled_at)
            .map(mapPostRow);

        return c.json({ scheduled, unscheduled, month });
    } catch (err) {
        console.error("[GET /api/calendar]", err instanceof Error ? err.message : err);
        return c.json({ error: "Failed to fetch calendar data" }, 500);
    }
});

// ============================================================
// PATCH /api/calendar/:id/schedule — Set or update scheduled_at
// Body: { scheduledAt: "2026-03-15" | null }
// ============================================================
calendarRoutes.patch("/:id/schedule", async (c) => {
    const id = c.req.param("id");

    let body;
    try {
        body = await c.req.json<{ scheduledAt: string | null }>();
    } catch {
        return c.json({ error: "Invalid JSON format" }, 400);
    }

    const { scheduledAt } = body;

    // Validate date format if provided
    if (scheduledAt !== null && !/^\d{4}-\d{2}-\d{2}$/.test(scheduledAt)) {
        return c.json({ error: "scheduledAt must be YYYY-MM-DD or null" }, 400);
    }

    // Determine new status: scheduled if date set, draft if cleared
    const newStatus = scheduledAt ? "scheduled" : "draft";

    try {
        // First check if post exists
        const existing = await c.env.DB.prepare("SELECT id, status FROM posts WHERE id = ?")
            .bind(id)
            .first();

        if (!existing) {
            return c.json({ error: "Post not found" }, 404);
        }

        // Don't allow scheduling archived posts
        if (existing.status === "archived") {
            return c.json({ error: "Cannot schedule an archived post" }, 400);
        }

        await c.env.DB.prepare(
            `UPDATE posts 
             SET scheduled_at = ?, status = ?, updated_at = datetime('now') 
             WHERE id = ?`
        )
            .bind(scheduledAt, newStatus, id)
            .run();

        return c.json({ id, scheduledAt, status: newStatus });
    } catch (err) {
        console.error("[PATCH /api/calendar/:id/schedule]", err instanceof Error ? err.message : err);
        return c.json({ error: "Failed to schedule post" }, 500);
    }
});

// ============================================================
// GET /api/calendar/conflicts — Check 2-day rule violations
// Query params: month (YYYY-MM), instance (optional)
// ============================================================
calendarRoutes.get("/conflicts", async (c) => {
    const month = c.req.query("month");
    const instance = c.req.query("instance");

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return c.json({ error: "month query param required (YYYY-MM)" }, 400);
    }

    const startDate = `${month}-01`;
    const [yearStr2, monStr2] = month.split("-");
    const year = Number(yearStr2);
    const mon = Number(monStr2);
    const nextMonth = mon === 12 ? `${year + 1}-01` : `${year}-${String(mon + 1).padStart(2, "0")}`;
    const endDate = `${nextMonth}-01`;

    let query = `
        SELECT id, instance, scheduled_at, content_type
        FROM posts
        WHERE scheduled_at IS NOT NULL
          AND scheduled_at >= ? AND scheduled_at < ?
          AND status != 'archived'
    `;
    const params: (string | number)[] = [startDate, endDate];

    if (instance) {
        query += " AND instance = ?";
        params.push(instance);
    }

    query += " ORDER BY scheduled_at ASC";

    try {
        const result = await c.env.DB.prepare(query).bind(...params).all();
        const posts = result.results as Array<{
            id: string;
            instance: string;
            scheduled_at: string;
            content_type: string;
        }>;

        // Check 2-day rule: no two posts within 2 days of each other (per instance)
        const conflicts: Array<{
            postA: string;
            postB: string;
            instance: string;
            dateA: string;
            dateB: string;
            daysBetween: number;
        }> = [];

        // Group by instance
        const byInstance = new Map<string, typeof posts>();
        for (const post of posts) {
            const group = byInstance.get(post.instance) ?? [];
            group.push(post);
            byInstance.set(post.instance, group);
        }

        for (const [inst, group] of byInstance) {
            for (let i = 0; i < group.length - 1; i++) {
                const postA = group[i]!;
                const postB = group[i + 1]!;
                const dateA = new Date(postA.scheduled_at);
                const dateB = new Date(postB.scheduled_at);
                const daysBetween = Math.round(
                    (dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (daysBetween < 2) {
                    conflicts.push({
                        postA: postA.id,
                        postB: postB.id,
                        instance: inst,
                        dateA: postA.scheduled_at,
                        dateB: postB.scheduled_at,
                        daysBetween,
                    });
                }
            }
        }

        return c.json({ conflicts, total: conflicts.length });
    } catch (err) {
        console.error("[GET /api/calendar/conflicts]", err instanceof Error ? err.message : err);
        return c.json({ error: "Failed to check conflicts" }, 500);
    }
});

// --- Helper ---

function mapPostRow(row: Record<string, unknown>) {
    return {
        id: row.id,
        instance: row.instance,
        content_type: row.content_type,
        text: row.text,
        language: row.language,
        char_count: row.char_count,
        is_personal: row.is_personal,
        status: row.status,
        scheduled_at: row.scheduled_at,
        created_at: row.created_at,
        image_url: row.img_url ?? null,
        image_format: row.img_format ?? null,
        topic_fields: JSON.parse((row.topic_fields as string) || "[]"),
        hashtags: JSON.parse((row.hashtags as string) || "[]"),
    };
}
