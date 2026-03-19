import { expect, test } from "@playwright/test";

interface ErrorResponse {
    error: string;
    code?: string;
    field?: string;
}

test.describe("API Input Validation", () => {
    test("rejects malformed JSON body for text generation", async ({ request }) => {
        const response = await request.post("/api/generate/text", {
            headers: {
                "content-type": "application/json",
            },
            data: Buffer.from("{", "utf8"),
        });

        expect(response.status()).toBe(400);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("Invalid JSON");
        expect(body.code).toBe("INVALID_JSON");
    });

    test("rejects missing required fields", async ({ request }) => {
        const response = await request.post("/api/generate/text", {
            data: {
                instance: "alex",
                topicField: "energie",
                userInput: "Some context",
                language: "de",
            },
        });

        expect(response.status()).toBe(400);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("contentType");
    });

    test("rejects empty strings after sanitization", async ({ request }) => {
        const response = await request.post("/api/generate/text", {
            data: {
                instance: "alex",
                contentType: "deep-dive",
                topicField: "energie",
                userInput: "   ",
                language: "de",
            },
        });

        expect(response.status()).toBe(400);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("userInput");
    });

    test("rejects posts that violate content length validation", async ({ request }) => {
        const response = await request.post("/api/posts", {
            data: {
                instance: "alex",
                contentType: "deep-dive",
                topicFields: ["energie"],
                text: "too short",
                language: "de",
                hashtags: [],
                charCount: 9,
                isPersonal: false,
            },
        });

        expect(response.status()).toBe(400);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("Text length");
        expect(body.field).toBe("text");
    });

    test("rejects missing required fields for website-article generation", async ({ request }) => {
        const response = await request.post("/api/generate/website-article", {
            data: {
                topicField: "Innovation",
                // missing userInput
            },
        });

        expect(response.status()).toBe(400);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("userInput");
    });

    test("rejects missing required fields for image generation", async ({ request }) => {
        const response = await request.post("/api/generate/image", {
            data: {
                instance: "alex",
                format: "single-square",
                topicField: "Innovation",
                // missing userInput
            },
        });

        expect(response.status()).toBe(400);
        const body = (await response.json()) as ErrorResponse;
        expect(body.error).toContain("userInput");
    });
});
