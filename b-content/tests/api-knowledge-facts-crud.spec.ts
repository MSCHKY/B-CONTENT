import { expect, test } from "@playwright/test";

interface TopicResponse {
    id: string;
    facts: string[];
}

interface ErrorResponse {
    error: string;
}

test.describe("API Knowledge Topic Facts CRUD", () => {
    test("add fact -> verify -> delete -> verify", async ({ request }) => {
        const topicId = "energie";
        const uniqueFact = `API fact test ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        const addResponse = await request.post(`/api/knowledge/topics/${topicId}/facts`, {
            data: { fact: uniqueFact },
        });

        expect(addResponse.status()).toBe(201);
        const addBody = (await addResponse.json()) as TopicResponse;
        expect(addBody.id).toBe(topicId);
        expect(addBody.facts).toContain(uniqueFact);

        const getAfterAddResponse = await request.get(`/api/knowledge/topics/${topicId}`);
        expect(getAfterAddResponse.ok()).toBeTruthy();
        const getAfterAddBody = (await getAfterAddResponse.json()) as TopicResponse;
        const factIndex = getAfterAddBody.facts.lastIndexOf(uniqueFact);
        expect(factIndex).toBeGreaterThan(-1);

        const deleteResponse = await request.delete(
            `/api/knowledge/topics/${topicId}/facts/${factIndex}`,
        );
        expect(deleteResponse.ok()).toBeTruthy();
        const deleteBody = (await deleteResponse.json()) as TopicResponse;
        expect(deleteBody.facts).not.toContain(uniqueFact);

        const getAfterDeleteResponse = await request.get(`/api/knowledge/topics/${topicId}`);
        expect(getAfterDeleteResponse.ok()).toBeTruthy();
        const getAfterDeleteBody = (await getAfterDeleteResponse.json()) as TopicResponse;
        expect(getAfterDeleteBody.facts).not.toContain(uniqueFact);
    });

    test("returns 404 for unknown topic id", async ({ request }) => {
        const response = await request.get("/api/knowledge/topics/not-a-topic");
        expect(response.status()).toBe(404);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("not found");
    });
});
