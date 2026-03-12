import { expect, test } from "@playwright/test";

interface SavePostResponse {
    id: string;
    status: string;
}

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

interface StatsResponse {
    ratios: InstanceRatio[];
    topicDistribution: TopicCount[];
    summary: StatsSummary;
}

const buildText = (length: number, marker: string): string => {
    const chunk = `${marker} industrial communications quality assurance content `;
    return chunk.repeat(Math.ceil(length / chunk.length)).slice(0, length);
};

test.describe("API Stats Endpoint", () => {

    test("returns expected aggregation shape and includes newly created topic counts", async ({ request }) => {
        const createdPostIds: string[] = [];
        const topicMarker = `stats-topic-${Date.now()}`;

        try {
            const alexText = buildText(320, "alex");
            const createAlex = await request.post("/api/posts", {
                data: {
                    instance: "alex",
                    contentType: "frage",
                    topicFields: [topicMarker, "energie"],
                    text: alexText,
                    language: "de",
                    hashtags: ["#Stats"],
                    charCount: alexText.length,
                    isPersonal: false,
                },
            });
            expect(createAlex.status()).toBe(201);
            const alexBody = (await createAlex.json()) as SavePostResponse;
            createdPostIds.push(alexBody.id);

            const ablasText = buildText(430, "ablas");
            const createAblas = await request.post("/api/posts", {
                data: {
                    instance: "ablas",
                    contentType: "proof-point",
                    topicFields: [topicMarker],
                    text: ablasText,
                    language: "de",
                    hashtags: ["#Stats"],
                    charCount: ablasText.length,
                    isPersonal: true,
                },
            });
            expect(createAblas.status()).toBe(201);
            const ablasBody = (await createAblas.json()) as SavePostResponse;
            createdPostIds.push(ablasBody.id);

            const statsResponse = await request.get("/api/stats");
            expect(statsResponse.ok()).toBeTruthy();
            const statsBody = (await statsResponse.json()) as StatsResponse;

            expect(Array.isArray(statsBody.ratios)).toBeTruthy();
            expect(statsBody.ratios).toHaveLength(3);
            for (const instanceId of ["alex", "ablas", "bwg"]) {
                const row = statsBody.ratios.find((ratio) => ratio.instance === instanceId);
                expect(row).toBeDefined();
                expect(typeof row?.totalPosts).toBe("number");
                expect(typeof row?.isHealthy).toBe("boolean");
                expect(typeof row?.nextShouldBePersonal).toBe("boolean");
            }

            expect(Array.isArray(statsBody.topicDistribution)).toBeTruthy();
            const markerTopic = statsBody.topicDistribution.find(
                (topic) => topic.topicField === topicMarker,
            );
            expect(markerTopic).toBeDefined();
            expect(markerTopic?.count).toBeGreaterThanOrEqual(2);

            expect(typeof statsBody.summary.totalPosts).toBe("number");
            expect(typeof statsBody.summary.thisMonth).toBe("number");
            expect(Array.isArray(statsBody.summary.warnings)).toBeTruthy();
        } finally {
            for (const id of createdPostIds) {
                await request.delete(`/api/posts/${id}/purge`);
            }
        }
    });
});
