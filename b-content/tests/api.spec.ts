import { test, expect } from "@playwright/test";

test.describe("B/CONTENT API Tests", () => {
    // ---------------------------------------------------------
    // POST /api/generate/text
    // ---------------------------------------------------------
    test.describe("POST /api/generate/text", () => {
        test("happy path - returns mock generation when no API key", async ({ request }) => {
            const response = await request.post("/api/generate/text", {
                data: {
                    instance: "alex",
                    contentType: "deep-dive",
                    topicField: "energie",
                    userInput: "Test input",
                    language: "en"
                }
            });
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(body).toHaveProperty("text");
            expect(typeof body.text).toBe("string");
            expect(body).toHaveProperty("hashtags");
            expect(Array.isArray(body.hashtags)).toBe(true);
            expect(body).toHaveProperty("charCount");
            expect(typeof body.charCount).toBe("number");
            expect(body).toHaveProperty("mock");
            expect(typeof body.mock).toBe("boolean");
        });

        test("error case - missing required fields", async ({ request }) => {
            const response = await request.post("/api/generate/text", {
                data: {
                    // Empty object, missing required properties
                }
            });

            // Validation runs BEFORE mock check — missing fields → 400
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body).toHaveProperty("error");
        });
    });

    // ---------------------------------------------------------
    // POST /api/generate/image
    // ---------------------------------------------------------
    test.describe("POST /api/generate/image", () => {
        test("happy path - returns mock generation when no API key", async ({ request }) => {
            const response = await request.post("/api/generate/image", {
                data: {
                    instance: "alex",
                    format: "single-square",
                    topicField: "Innovation",
                    userInput: "Test image"
                }
            });
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(body).toHaveProperty("imageUrl");
            expect(typeof body.imageUrl === "string" || body.imageUrl === null).toBe(true);

            if (body.imageId !== undefined) {
                expect(typeof body.imageId === "string" || body.imageId === null).toBe(true);
            }
            if (body.r2Key !== undefined) {
                expect(typeof body.r2Key === "string" || body.r2Key === null).toBe(true);
            }
            if (body.mimeType !== undefined) {
                expect(typeof body.mimeType === "string" || body.mimeType === null).toBe(true);
            }
            expect(body).toHaveProperty("prompt");
            expect(typeof body.prompt === "string" || body.prompt === null).toBe(true);
            expect(body).toHaveProperty("mock");
            expect(typeof body.mock).toBe("boolean");
        });
    });

    // ---------------------------------------------------------
    // POST /api/generate/website-article
    // ---------------------------------------------------------
    test.describe("POST /api/generate/website-article", () => {
        test("happy path - returns mock generation when no API key", async ({ request }) => {
            const response = await request.post("/api/generate/website-article", {
                data: {
                    topicField: "Innovation",
                    userInput: "Test input"
                }
            });
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(body).toHaveProperty("text");
            expect(typeof body.text).toBe("string");
            expect(body).toHaveProperty("charCount");
            expect(typeof body.charCount).toBe("number");
            expect(body).toHaveProperty("mock");
            expect(typeof body.mock).toBe("boolean");

            if (body.tokenCount !== undefined) {
                expect(typeof body.tokenCount).toBe("number");
            }
        });
    });

    // ---------------------------------------------------------
    // GET /api/knowledge/topics
    // ---------------------------------------------------------
    test.describe("GET /api/knowledge/topics", () => {
        test("happy path - returns topic fields", async ({ request }) => {
            const response = await request.get("/api/knowledge/topics");
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBeGreaterThan(0);
            expect(body[0]).toHaveProperty("id");
            expect(body[0]).toHaveProperty("label");
        });

        test("error case - missing endpoint should 404", async ({ request }) => {
            const response = await request.get("/api/knowledge/topics/nonexistent/subroute");
            expect(response.status()).toBe(404);
        });
    });

    // ---------------------------------------------------------
    // GET /api/knowledge/quotes
    // ---------------------------------------------------------
    test.describe("GET /api/knowledge/quotes", () => {
        test("happy path - returns all quotes", async ({ request }) => {
            const response = await request.get("/api/knowledge/quotes");
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBeGreaterThan(0);
            expect(body[0]).toHaveProperty("author");
            expect(body[0]).toHaveProperty("quotes");
        });

        test("happy path - returns quotes for specific author", async ({ request }) => {
            const response = await request.get("/api/knowledge/quotes?author=J%C3%BCrgen%20Alex");
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(Array.isArray(body)).toBe(true);
            if (body.length > 0) {
                expect(body[0]).toHaveProperty("text");
            }
        });

        test("error case - unsupported method", async ({ request }) => {
            const response = await request.post("/api/knowledge/quotes");
            // Hono may return 404 or 405 for wrong methods depending on routing config
            expect(response.status()).toBeGreaterThanOrEqual(400);
        });
    });

    // ---------------------------------------------------------
    // GET /api/knowledge/rules
    // ---------------------------------------------------------
    test.describe("GET /api/knowledge/rules", () => {
        test("happy path - returns content rules", async ({ request }) => {
            const response = await request.get("/api/knowledge/rules");
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(typeof body).toBe("object");
            expect(body).not.toBeNull();
            // Should have some keys like 'general' or 'formatting'
            expect(Object.keys(body).length).toBeGreaterThan(0);
        });

        test("error case - extra path parameter", async ({ request }) => {
            const response = await request.get("/api/knowledge/rules/extra");
            expect(response.status()).toBe(404);
        });
    });

    // ---------------------------------------------------------
    // POST /api/posts & GET /api/posts & DELETE /api/posts/:id
    // ---------------------------------------------------------
    test.describe("Posts CRUD", () => {
        // Run sequentially so that state is maintained across tests
        test.describe.configure({ mode: 'serial' });

        let createdPostId: string;

        test("POST /api/posts - happy path", async ({ request }) => {
            const response = await request.post("/api/posts", {
                data: {
                    instance: "alex",
                    contentType: "frage",
                    topicFields: ["energie"],
                    text: "This is a test post with enough characters to pass the minimum length validation for a frage content type in the system.".repeat(2),
                    language: "en",
                    hashtags: ["#Test"],
                    charCount: 200,
                    isPersonal: false
                }
            });
            expect(response.status()).toBe(201);
            const body = await response.json();

            expect(body).toHaveProperty("id");
            expect(body).toHaveProperty("status", "saved");
            createdPostId = body.id;
        });

        test("POST /api/posts - error case missing required fields", async ({ request }) => {
            const response = await request.post("/api/posts", {
                data: {
                    instance: "alex"
                    // missing contentType, topicFields, text, etc.
                }
            });
            // Should fail due to validation (missing required fields)
            expect(response.status()).toBe(400);
            const body = await response.json();
            expect(body).toHaveProperty("error");
        });

        test("GET /api/posts - happy path", async ({ request }) => {
            const response = await request.get("/api/posts");
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(body).toHaveProperty("posts");
            expect(Array.isArray(body.posts)).toBe(true);
            expect(body).toHaveProperty("total");
            expect(typeof body.total).toBe("number");

            // Should contain the post we just created
            const createdPost = body.posts.find((p: any) => p.id === createdPostId);
            expect(createdPost).toBeDefined();
            expect(createdPost.text).toContain("test post with enough characters");
        });

        test("GET /api/posts - query parameters", async ({ request }) => {
            const response = await request.get("/api/posts?limit=1");
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(body.posts.length).toBeLessThanOrEqual(1);
        });

        test("GET /api/posts - error case invalid method", async ({ request }) => {
            // we already test POST above. We'll test PUT which is unhandled.
            const response = await request.put("/api/posts");
            expect(response.status()).toBe(404);
        });

        test("DELETE /api/posts/:id - happy path", async ({ request }) => {
            // Ensure we have an ID to delete
            expect(createdPostId).toBeDefined();

            const response = await request.delete(`/api/posts/${createdPostId}`);
            expect(response.ok()).toBeTruthy();
            const body = await response.json();

            expect(body).toHaveProperty("id", createdPostId);
            expect(body).toHaveProperty("status", "archived");

            // Verify it was deleted from list
            const listResponse = await request.get(`/api/posts`);
            const listBody = await listResponse.json();
            const foundPost = listBody.posts?.find((p: any) => p.id === createdPostId);
            expect(foundPost).toBeUndefined();
        });

        test("DELETE /api/posts/:id - error case non-existent id (should still return 200 or 404 depending on implementation)", async ({ request }) => {
            const response = await request.delete(`/api/posts/non-existent-id`);
            // SQLite DELETE without matching row doesn't error, it just returns 0 rows affected.
            // Depending on the implementation, it might still return 200 "deleted".
            // So we just expect it not to throw a 500.
            expect(response.status()).toBeLessThan(500);
        });
    });
});
