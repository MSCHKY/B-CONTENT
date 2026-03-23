import { expect, test } from "@playwright/test";

test.describe("API Calendar Endpoints", () => {
    let postId1: string;
    let postId2: string;
    const marker = `calendar-test-${Date.now()}`;
    const text = `Testing calendar API ${marker}. Testing calendar API ${marker}. Testing calendar API ${marker}.`;

    test.beforeAll(async ({ request }) => {
        // Create two posts to schedule
        const p1 = await request.post("/api/posts", {
            data: {
                instance: "bwg",
                contentType: "news",
                topicFields: ["energie"],
                text: text + " Post 1",
                language: "en",
                hashtags: ["#Test1"],
                charCount: text.length + 7,
                isPersonal: false,
            },
        });
        const body1 = await p1.json();
        postId1 = body1.id;

        const p2 = await request.post("/api/posts", {
            data: {
                instance: "bwg",
                contentType: "news",
                topicFields: ["energie"],
                text: text + " Post 2",
                language: "en",
                hashtags: ["#Test2"],
                charCount: text.length + 7,
                isPersonal: false,
            },
        });
        const body2 = await p2.json();
        postId2 = body2.id;
    });

    test.afterAll(async ({ request }) => {
        if (postId1) await request.delete(`/api/posts/${postId1}/purge`);
        if (postId2) await request.delete(`/api/posts/${postId2}/purge`);
    });

    test("GET /api/calendar - requires month parameter", async ({ request }) => {
        const response = await request.get("/api/calendar");
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toContain("month query param required");
    });

    test("schedule posts and detect conflicts", async ({ request }) => {
        const month = "2025-05"; // Pick a future month

        // 1. Initially unscheduled, should show up if we fetch current month? No, unscheduled only show if draft.
        // Let's just test scheduling logic directly.

        // Schedule post 1
        const sched1 = await request.patch(`/api/calendar/${postId1}/schedule`, {
            data: { scheduledAt: `${month}-10` },
        });
        expect(sched1.ok()).toBeTruthy();
        const bodySched1 = await sched1.json();
        expect(bodySched1.status).toBe("scheduled");
        expect(bodySched1.scheduledAt).toBe(`${month}-10`);

        // Schedule post 2 right next to it (conflict!)
        const sched2 = await request.patch(`/api/calendar/${postId2}/schedule`, {
            data: { scheduledAt: `${month}-11` },
        });
        expect(sched2.ok()).toBeTruthy();

        // 2. Fetch calendar month
        const cal = await request.get(`/api/calendar?month=${month}`);
        expect(cal.ok()).toBeTruthy();
        const calBody = await cal.json();
        expect(calBody.month).toBe(month);
        expect(Array.isArray(calBody.scheduled)).toBe(true);
        expect(calBody.scheduled.find((p: any) => p.id === postId1)).toBeTruthy();
        expect(calBody.scheduled.find((p: any) => p.id === postId2)).toBeTruthy();

        // 3. Check conflicts
        const conflictsRes = await request.get(`/api/calendar/conflicts?month=${month}`);
        expect(conflictsRes.ok()).toBeTruthy();
        const conflictsBody = await conflictsRes.json();
        expect(Array.isArray(conflictsBody.conflicts)).toBe(true);

        // Should find conflict between post1 and post2 since they are 1 day apart
        const conflict = conflictsBody.conflicts.find(
            (c: any) => (c.postA === postId1 && c.postB === postId2) || (c.postA === postId2 && c.postB === postId1)
        );
        expect(conflict).toBeTruthy();
        expect(conflict.daysBetween).toBe(1);
    });
});
