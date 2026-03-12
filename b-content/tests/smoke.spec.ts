import { test, expect } from "@playwright/test";

test.describe("B/CONTENT Smoke Tests", () => {
    test("app loads without errors", async ({ page }) => {
        await page.goto("/");

        // Header should be visible (German locale by default)
        await expect(page.getByText("B/CONTENT")).toBeVisible();

        // Check for no console errors
        const consoleErrors: string[] = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") consoleErrors.push(msg.text());
        });

        // Reload and check for errors
        await page.reload();
        await page.waitForTimeout(1000);
        expect(consoleErrors).toHaveLength(0);
    });

    test("sidebar navigation works", async ({ page }) => {
        await page.goto("/");

        // Create view should be active by default
        // App starts in German — check for German labels
        await expect(page.getByRole("button", { name: /Erstellen/ })).toBeVisible();

        // Navigate to Knowledge
        await page.getByRole("button", { name: /Wissen/ }).click();
        await expect(page.getByText(/Wissensbasis|Knowledge/)).toBeVisible();

        // Navigate to Library
        await page.getByRole("button", { name: /Bibliothek/ }).click();
        await expect(
            page.getByText(/Content-Bibliothek|Content Library/),
        ).toBeVisible();

        // Navigate to Orchestrate
        await page.getByRole("button", { name: /Orchestrieren|Orchestrate/ }).click();
        await expect(
            page.getByText(/Content-Orchestrierung|Content Orchestration/),
        ).toBeVisible();

        // Navigate to Stats
        await page.getByRole("button", { name: /Statistik|Stats/ }).click();
        await expect(
            page.getByText(/Content-Statistik|Content Stats/),
        ).toBeVisible();

        // Navigate back to Create
        await page.getByRole("button", { name: /Erstellen|Create/ }).click();
        await expect(page.getByRole("button", { name: /Erstellen|Create/ })).toBeVisible();
    });

    test("create-flow: instance selection", async ({ page }) => {
        await page.goto("/");

        // Three instance cards should be visible in the main content area
        const main = page.locator("main");
        await expect(main.getByText("Jürgen Alex")).toBeVisible();
        await expect(main.getByText("Sebastian Ablas")).toBeVisible();
        await expect(main.getByText("BenderWire Group")).toBeVisible();

        // Click Alex → should advance to content type step
        await main.getByText("Jürgen Alex").click();

        // Content type options should appear (Step 2)
        await expect(page.getByText("Deep Dive")).toBeVisible();
    });

    test("create-flow: full flow to input step", async ({ page }) => {
        await page.goto("/");

        // Step 1: Select instance
        const main = page.locator("main");
        await main.getByText("Sebastian Ablas").click();

        // Step 2: Select content type (Ablas-specific)
        await expect(main.getByText("Proof Point")).toBeVisible();
        await main.getByText("Proof Point").click();

        // Step 3: Topic & input should be visible
        await expect(
            page.getByPlaceholder(/Beschreiben|Describe|topic|Thema/i),
        ).toBeVisible();
    });

    test("knowledge viewer loads", async ({ page }) => {
        await page.goto("/");

        // Navigate to Knowledge
        await page.getByRole("button", { name: /Wissen/ }).click();

        // Should show topic fields from the knowledge base
        // Scope to main to avoid matching sidebar
        const main = page.locator("main");
        await expect(main.getByText(/Energie/).first()).toBeVisible();
    });

    test("api health check responds with schema status", async ({ request }) => {
        const response = await request.get("/api/health");
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.status).toBe("ok");
        // FM4: Schema health check should report migration state
        expect(body.schema).toBeDefined();
        expect(body.schema.ok).toBeDefined();
    });

    // --- Phase 2 Tests ---

    test("orchestrate view: form elements present", async ({ page }) => {
        await page.goto("/");

        // Navigate to Orchestrate
        await page.getByRole("button", { name: /Orchestrieren|Orchestrate/ }).click();

        // Header and description (German or English)
        await expect(page.getByText(/Content-Orchestrierung|Content Orchestration/)).toBeVisible();
        await expect(page.getByText(/Dreier/)).toBeVisible();

        // Form elements (German or English) — use label-based selectors to avoid strict mode issues
        await expect(page.getByLabel(/Themenfeld|Topic Field/)).toBeVisible();
        await expect(page.getByText(/Sprache|Language/).first()).toBeVisible();

        // Generate button (German or English)
        await expect(
            page.getByRole("button", { name: /3er-Set generieren|Generate/ }),
        ).toBeVisible();
    });

    test("stats view: section headers present", async ({ page }) => {
        await page.goto("/");

        // Navigate to Stats
        await page.getByRole("button", { name: /Statistik|Stats/ }).click();

        // Header (German or English)
        await expect(page.getByText(/Content-Statistik|Content Stats/)).toBeVisible();

        // Analytics sections (German or English)
        await expect(page.getByText(/Aktivitätsverlauf|Activity Timeline/)).toBeVisible();
        await expect(page.getByText(/Planungsquote|Scheduling Health/)).toBeVisible();
    });

    test("api orchestrate returns posts with errors array (mock mode)", async ({ request }) => {
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
        // FM1: New partial-success format includes errors array
        expect(body.errors).toBeDefined();
        expect(Array.isArray(body.errors)).toBe(true);

        // Verify all 3 instances are represented
        const instances = body.posts.map(
            (p: { instance: string }) => p.instance,
        );
        expect(instances).toContain("alex");
        expect(instances).toContain("ablas");
        expect(instances).toContain("bwg");
    });
});
