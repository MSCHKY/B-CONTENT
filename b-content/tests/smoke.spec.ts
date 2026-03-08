import { test, expect } from "@playwright/test";

test.describe("B/CONTENT Smoke Tests", () => {
    test("app loads without errors", async ({ page }) => {
        // Navigate to the app
        await page.goto("/");

        // App shell should be visible
        await expect(page.locator("body")).toBeVisible();

        // Sidebar branding should be present (B/CONTENT text or the B logo)
        await expect(page.getByText("B/CONTENT")).toBeVisible();

        // No uncaught errors in console
        const errors: string[] = [];
        page.on("pageerror", (err) => errors.push(err.message));
        await page.waitForTimeout(1000);
        expect(errors).toHaveLength(0);
    });

    test("sidebar navigation works", async ({ page }) => {
        await page.goto("/");

        // Create view should be active by default
        await expect(page.getByText("Choose the voice")).toBeVisible();

        // Navigate to Knowledge
        await page.getByRole("button", { name: /Wissen/ }).click();
        await expect(page.getByText("Knowledge")).toBeVisible();

        // Navigate to Library
        await page.getByRole("button", { name: /Bibliothek/ }).click();
        await expect(
            page.getByText("Content Library"),
        ).toBeVisible();

        // Navigate to Orchestrate
        await page.getByRole("button", { name: /Orchestrate|Orchestrieren/ }).click();
        await expect(
            page.getByText("Content Orchestration"),
        ).toBeVisible();

        // Navigate to Stats
        await page.getByRole("button", { name: /Stats|Statistik/ }).click();
        await expect(
            page.getByText("Content Stats"),
        ).toBeVisible();

        // Navigate back to Create
        await page.getByRole("button", { name: /Create/ }).click();
        await expect(page.getByText("Choose the voice")).toBeVisible();
    });

    test("create-flow: instance selection", async ({ page }) => {
        await page.goto("/");

        // Three instance cards should be visible
        await expect(page.getByText("Jürgen Alex")).toBeVisible();
        await expect(page.getByText("Sebastian Ablas")).toBeVisible();
        await expect(page.getByText("BenderWire Group")).toBeVisible();

        // Click Alex → should advance to content type step
        await page.getByText("Jürgen Alex").click();

        // Content type options should appear (Step 2)
        await expect(page.getByText("Deep Dive")).toBeVisible();
    });

    test("create-flow: full flow to input step", async ({ page }) => {
        await page.goto("/");

        // Step 1: Select instance
        await page.getByText("Sebastian Ablas").click();

        // Step 2: Select content type (Ablas-specific)
        await expect(page.getByText("Proof Point")).toBeVisible();
        await page.getByText("Proof Point").click();

        // Step 3: Topic & input should be visible
        await expect(
            page.getByPlaceholder(/context|stichworte|keywords/i),
        ).toBeVisible();
    });

    test("knowledge viewer loads", async ({ page }) => {
        await page.goto("/");

        // Navigate to Knowledge
        await page.getByRole("button", { name: /Wissen/ }).click();

        // Should show topic fields from the knowledge base
        await expect(page.getByText("Energie")).toBeVisible();
    });

    test("api health check responds", async ({ request }) => {
        const response = await request.get("/api/health");
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.status).toBe("ok");
    });

    // --- Phase 2 Tests ---

    test("orchestrate view: form elements present", async ({ page }) => {
        await page.goto("/");

        // Navigate to Orchestrate
        await page.getByRole("button", { name: /Orchestrate|Orchestrieren/ }).click();

        // Header and description
        await expect(page.getByText("Content Orchestration")).toBeVisible();
        await expect(page.getByText("Dreier-Regel")).toBeVisible();

        // Form elements
        await expect(page.getByText("Topic Field")).toBeVisible();
        await expect(page.getByText("Language")).toBeVisible();
        await expect(
            page.getByPlaceholder(/angle|context|key points/i),
        ).toBeVisible();

        // Generate button
        await expect(
            page.getByRole("button", { name: /Generate Campaign/ }),
        ).toBeVisible();
    });

    test("stats view: section headers present", async ({ page }) => {
        await page.goto("/");

        // Navigate to Stats
        await page.getByRole("button", { name: /Stats|Statistik/ }).click();

        // Header
        await expect(page.getByText("Content Stats")).toBeVisible();
    });

    test("api orchestrate returns posts (mock mode)", async ({ request }) => {
        const response = await request.post("/api/orchestrate", {
            data: {
                topicField: "energie",
                userInput: "Test campaign about energy transition",
                language: "en",
            },
        });
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.posts).toBeDefined();
        expect(body.posts).toHaveLength(3);

        // Verify all 3 instances are represented
        const instances = body.posts.map(
            (p: { instance: string }) => p.instance,
        );
        expect(instances).toContain("alex");
        expect(instances).toContain("ablas");
        expect(instances).toContain("bwg");
    });
});
