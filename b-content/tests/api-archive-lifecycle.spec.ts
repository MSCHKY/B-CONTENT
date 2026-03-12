import { expect, test } from "@playwright/test";

interface SavePostResponse {
    id: string;
    status: string;
}

interface PostListItem {
    id: string;
    status: string;
}

interface PostListResponse {
    posts: PostListItem[];
    total: number;
}

interface StatusResponse {
    id: string;
    status: string;
}

interface ErrorResponse {
    error: string;
}

const buildValidNewsText = (marker: string): string => {
    const seed = `${marker} Industrial wire update for enterprise communication quality assurance and content creation. `;
    return seed.repeat(6).slice(0, 400);
};

test.describe("API Library Archive Lifecycle", () => {

    test("save -> archive -> list-filtered -> restore -> purge", async ({ request }) => {
        const marker = `archive-lifecycle-${Date.now()}`;
        const text = buildValidNewsText(marker);

        const saveResponse = await request.post("/api/posts", {
            data: {
                instance: "bwg",
                contentType: "news",
                topicFields: ["energie"],
                text,
                language: "de",
                hashtags: ["#BenderWire"],
                charCount: text.length,
                isPersonal: false,
            },
        });

        expect(saveResponse.status()).toBe(201);
        const saveBody = (await saveResponse.json()) as SavePostResponse;
        expect(saveBody.status).toBe("saved");
        expect(saveBody.id).toBeTruthy();

        const postId = saveBody.id;

        const archiveResponse = await request.delete(`/api/posts/${postId}`);
        expect(archiveResponse.ok()).toBeTruthy();
        const archiveBody = (await archiveResponse.json()) as StatusResponse;
        expect(archiveBody).toEqual({ id: postId, status: "archived" });

        const defaultListResponse = await request.get("/api/posts?limit=200");
        expect(defaultListResponse.ok()).toBeTruthy();
        const defaultListBody = (await defaultListResponse.json()) as PostListResponse;
        expect(defaultListBody.posts.some((post) => post.id === postId)).toBeFalsy();

        const archivedListResponse = await request.get("/api/posts?status=archived&limit=200");
        expect(archivedListResponse.ok()).toBeTruthy();
        const archivedListBody = (await archivedListResponse.json()) as PostListResponse;
        expect(archivedListBody.posts.some((post) => post.id === postId)).toBeTruthy();

        const restoreResponse = await request.post(`/api/posts/${postId}/restore`);
        expect(restoreResponse.ok()).toBeTruthy();
        const restoreBody = (await restoreResponse.json()) as StatusResponse;
        expect(restoreBody).toEqual({ id: postId, status: "restored" });

        const restoredListResponse = await request.get("/api/posts?limit=200");
        expect(restoredListResponse.ok()).toBeTruthy();
        const restoredListBody = (await restoredListResponse.json()) as PostListResponse;
        expect(restoredListBody.posts.some((post) => post.id === postId)).toBeTruthy();

        const purgeResponse = await request.delete(`/api/posts/${postId}/purge`);
        expect(purgeResponse.ok()).toBeTruthy();
        const purgeBody = (await purgeResponse.json()) as StatusResponse;
        expect(purgeBody).toEqual({ id: postId, status: "purged" });

        const getAfterPurgeResponse = await request.get(`/api/posts/${postId}`);
        expect(getAfterPurgeResponse.status()).toBe(404);
        const getAfterPurgeBody = (await getAfterPurgeResponse.json()) as ErrorResponse;
        expect(getAfterPurgeBody.error).toContain("Post not found");
    });
});
