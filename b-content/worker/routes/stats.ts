import { Hono } from "hono";
import type { Env } from "../index";

/**
 * Hono router for content statistics and the 4:1 ratio tracker.
 * Aggregates data from D1 posts table.
 */
export const statsRoutes = new Hono<{ Bindings: Env }>();

interface InstanceRatio {
    instance: string;
    label: string;
    totalPosts: number;
    fachPosts: number;
    personalPosts: number;
    ratio: string;
    isHealthy: boolean;
    nextShouldBePersonal: boolean;
}

interface TopicCount {
    topicField: string;
    count: number;
}

interface StatsSummary {
    totalPosts: number;
    thisMonth: number;
    oldestPost: string | null;
    newestPost: string | null;
    warnings: string[];
}

const INSTANCE_LABELS: Record<string, string> = {
    alex: "Jürgen Alex",
    ablas: "Sebastian Ablas",
    bwg: "BWG Company",
};

// GET /api/stats — Aggregate stats from D1
statsRoutes.get("/", async (c) => {
    try {
        const db = c.env.DB;

        // 1. Per-instance post counts and personal ratio
        const instanceResult = await db
            .prepare(
                `SELECT 
                    instance_id,
                    COUNT(*) as total,
                    SUM(CASE WHEN is_personal = 1 THEN 1 ELSE 0 END) as personal,
                    SUM(CASE WHEN is_personal = 0 THEN 1 ELSE 0 END) as fach
                 FROM posts
                 GROUP BY instance_id`,
            )
            .all();

        const ratios: InstanceRatio[] = (
            instanceResult.results as Array<{
                instance_id: string;
                total: number;
                personal: number;
                fach: number;
            }>
        ).map((row) => {
            const fachSinceLastPersonal = row.fach % 5; // Simplified: modulo to track within 4:1 cycle
            return {
                instance: row.instance_id,
                label:
                    INSTANCE_LABELS[row.instance_id] ?? row.instance_id,
                totalPosts: row.total,
                fachPosts: row.fach,
                personalPosts: row.personal,
                ratio: `${row.fach}:${row.personal}`,
                isHealthy:
                    row.personal === 0
                        ? row.fach <= 4
                        : row.fach / Math.max(row.personal, 1) <= 5,
                nextShouldBePersonal: fachSinceLastPersonal >= 4,
            };
        });

        // Add missing instances with 0 posts
        for (const instanceId of ["alex", "ablas", "bwg"]) {
            if (!ratios.find((r) => r.instance === instanceId)) {
                ratios.push({
                    instance: instanceId,
                    label: INSTANCE_LABELS[instanceId] ?? instanceId,
                    totalPosts: 0,
                    fachPosts: 0,
                    personalPosts: 0,
                    ratio: "0:0",
                    isHealthy: true,
                    nextShouldBePersonal: false,
                });
            }
        }

        // Sort: alex, ablas, bwg
        ratios.sort((a, b) => {
            const order = ["alex", "ablas", "bwg"];
            return order.indexOf(a.instance) - order.indexOf(b.instance);
        });

        // 2. Topic field distribution
        const topicResult = await db
            .prepare(
                `SELECT topic_fields FROM posts`,
            )
            .all();

        const topicCounts: Record<string, number> = {};
        for (const row of topicResult.results as Array<{
            topic_fields: string;
        }>) {
            try {
                const fields: string[] = JSON.parse(row.topic_fields);
                for (const field of fields) {
                    topicCounts[field] = (topicCounts[field] ?? 0) + 1;
                }
            } catch {
                // Skip malformed JSON
            }
        }

        const topicDistribution: TopicCount[] = Object.entries(topicCounts)
            .map(([topicField, count]) => ({ topicField, count }))
            .sort((a, b) => b.count - a.count);

        // 3. Summary stats
        const summaryResult = await db
            .prepare(
                `SELECT 
                    COUNT(*) as total,
                    MIN(created_at) as oldest,
                    MAX(created_at) as newest
                 FROM posts`,
            )
            .first<{ total: number; oldest: string | null; newest: string | null }>();

        // This month count
        const now = new Date();
        const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
        const monthResult = await db
            .prepare(
                `SELECT COUNT(*) as count FROM posts WHERE created_at >= ?`,
            )
            .bind(monthStart)
            .first<{ count: number }>();

        // Build warnings
        const warnings: string[] = [];
        for (const ratio of ratios) {
            if (ratio.nextShouldBePersonal) {
                warnings.push(
                    `${ratio.label}: Next post should be personal (4:1 ratio)`,
                );
            }
            if (!ratio.isHealthy) {
                warnings.push(
                    `${ratio.label}: Fach:Personal ratio out of balance (${ratio.ratio})`,
                );
            }
        }

        const summary: StatsSummary = {
            totalPosts: summaryResult?.total ?? 0,
            thisMonth: monthResult?.count ?? 0,
            oldestPost: summaryResult?.oldest ?? null,
            newestPost: summaryResult?.newest ?? null,
            warnings,
        };

        return c.json({ ratios, topicDistribution, summary });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Failed to fetch stats: ${message}` }, 500);
    }
});
