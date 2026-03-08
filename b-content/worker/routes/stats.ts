import { Hono } from "hono";
import type { Env } from "../index";
import { INSTANCE_LABELS } from "@shared/constants";

/**
 * Hono router for content statistics, 4:1 ratio tracker, and analytics.
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

interface TimelineWeek {
    week: string;
    weekLabel: string;
    count: number;
    instances: Record<string, number>;
}

interface ContentTypeCount {
    instance: string;
    contentType: string;
    count: number;
}

interface Cadence {
    avgPerWeek: number;
    thisWeek: number;
    trend: "up" | "down" | "stable";
}

interface SchedulingHealth {
    scheduled: number;
    unscheduled: number;
    coverage: number;
}

// GET /api/stats — Aggregate stats + analytics from D1
statsRoutes.get("/", async (c) => {
    try {
        const db = c.env.DB;

        // 1. Per-instance post counts and personal ratio
        const instanceResult = await db
            .prepare(
                `SELECT 
                    instance,
                    COUNT(*) as total,
                    SUM(CASE WHEN is_personal = 1 THEN 1 ELSE 0 END) as personal,
                    SUM(CASE WHEN is_personal = 0 THEN 1 ELSE 0 END) as fach
                 FROM posts
                 GROUP BY instance`,
            )
            .all();

        const ratios: InstanceRatio[] = (
            instanceResult.results as Array<{
                instance: string;
                total: number;
                personal: number;
                fach: number;
            }>
        ).map((row) => {
            const fachSinceLastPersonal = row.fach % 5; // Simplified: modulo to track within 4:1 cycle
            return {
                instance: row.instance,
                label:
                    INSTANCE_LABELS[row.instance] ?? row.instance,
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

        // 4. Activity Timeline — posts per week for last 12 weeks (stacked by instance)
        const twelveWeeksAgo = new Date(now);
        twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
        const timelineCutoff = twelveWeeksAgo.toISOString().slice(0, 10);

        const timelineResult = await db
            .prepare(
                `SELECT 
                    strftime('%Y-W%W', created_at) as week,
                    instance,
                    COUNT(*) as count
                 FROM posts
                 WHERE created_at >= ?
                 GROUP BY week, instance
                 ORDER BY week ASC`,
            )
            .bind(timelineCutoff)
            .all();

        // Build full 12-week timeline with 0-fills
        const timelineMap = new Map<string, TimelineWeek>();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i * 7);
            // Get ISO week manually
            const jan1 = new Date(d.getFullYear(), 0, 1);
            const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
            const weekKey = `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
            const weekLabel = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
            timelineMap.set(weekKey, { week: weekKey, weekLabel, count: 0, instances: { alex: 0, ablas: 0, bwg: 0 } });
        }

        for (const row of timelineResult.results as Array<{ week: string; instance: string; count: number }>) {
            const existing = timelineMap.get(row.week);
            if (existing) {
                existing.count += row.count;
                existing.instances[row.instance] = (existing.instances[row.instance] ?? 0) + row.count;
            }
        }

        const timeline: TimelineWeek[] = Array.from(timelineMap.values());

        // 5. Content-Type Breakdown — per instance
        const ctResult = await db
            .prepare(
                `SELECT instance, content_type, COUNT(*) as count
                 FROM posts
                 GROUP BY instance, content_type
                 ORDER BY instance, count DESC`,
            )
            .all();

        const contentTypeBreakdown: ContentTypeCount[] = (
            ctResult.results as Array<{ instance: string; content_type: string; count: number }>
        ).map((row) => ({
            instance: row.instance,
            contentType: row.content_type,
            count: row.count,
        }));

        // 6. Weekly Cadence — average posts/week + this week + trend
        const weekCounts = timeline.map((w) => w.count);
        const nonZeroWeeks = weekCounts.filter((c) => c > 0);
        const avgPerWeek = nonZeroWeeks.length > 0
            ? Math.round((nonZeroWeeks.reduce((a, b) => a + b, 0) / nonZeroWeeks.length) * 10) / 10
            : 0;
        const thisWeekCount = weekCounts[weekCounts.length - 1] ?? 0;
        const lastWeekCount = weekCounts[weekCounts.length - 2] ?? 0;

        let trend: Cadence["trend"] = "stable";
        if (thisWeekCount > lastWeekCount) trend = "up";
        else if (thisWeekCount < lastWeekCount) trend = "down";

        const cadence: Cadence = { avgPerWeek, thisWeek: thisWeekCount, trend };

        // 7. Scheduling Health — scheduled vs unscheduled (non-archived posts)
        // Wrapped in try-catch: scheduled_at column may not exist in unmigrated local DBs
        let scheduling: SchedulingHealth = { scheduled: 0, unscheduled: 0, coverage: 0 };
        try {
            const schedResult = await db
                .prepare(
                    `SELECT
                        SUM(CASE WHEN scheduled_at IS NOT NULL THEN 1 ELSE 0 END) as scheduled,
                        SUM(CASE WHEN scheduled_at IS NULL THEN 1 ELSE 0 END) as unscheduled
                     FROM posts
                     WHERE status != 'archived'`,
                )
                .first<{ scheduled: number; unscheduled: number }>();

            const scheduledCount = schedResult?.scheduled ?? 0;
            const unscheduledCount = schedResult?.unscheduled ?? 0;
            const totalActive = scheduledCount + unscheduledCount;
            scheduling = {
                scheduled: scheduledCount,
                unscheduled: unscheduledCount,
                coverage: totalActive > 0 ? Math.round((scheduledCount / totalActive) * 100) : 0,
            };
        } catch {
            // scheduled_at column may not exist — graceful fallback
        }

        return c.json({
            ratios,
            topicDistribution,
            summary,
            timeline,
            contentTypeBreakdown,
            cadence,
            scheduling,
        });
    } catch (err) {
        console.error("[GET /api/stats]", err instanceof Error ? err.message : err);
        return c.json({ error: "Failed to fetch stats" }, 500);
    }
});
