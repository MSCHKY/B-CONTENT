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
        await page.getByRole("button", { name: /Knowledge/ }).click();
        await expect(page.getByRole("heading", { name: "Knowledge" })).toBeVisible();

        // Navigate to Library (placeholder)
        await page.getByRole("button", { name: /Library/ }).click();
        await expect(
            page.getByRole("heading", { name: /Content Library/i }),
        ).toBeVisible();

        // Navigate back to Create
        await page.getByRole("button", { name: /Create/ }).click();
        await expect(page.getByText("Choose the voice")).toBeVisible();
    });

    test("create-flow: instance selection", async ({ page }) => {
        await page.goto("/");

        // Three instance cards should be visible
        await expect(page.getByRole("heading", { name: "Jürgen Alex" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Sebastian Ablas" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "BenderWire Group" })).toBeVisible();

        // Click Alex → should advance to content type step
        await page.getByRole("heading", { name: "Jürgen Alex" }).click();

        // Content type options should appear (Step 2)
        await expect(page.getByRole("heading", { name: "Deep Dive" })).toBeVisible();
    });

    test("create-flow: full flow to input step", async ({ page }) => {
        await page.goto("/");

        // Step 1: Select instance
        await page.getByRole("heading", { name: "Sebastian Ablas" }).click();

        // Step 2: Select content type (Ablas-specific)
        await expect(page.getByRole("heading", { name: "Proof Point" })).toBeVisible();
        await page.getByRole("heading", { name: "Proof Point" }).click();

        // Step 3: Topic & input should be visible
        await expect(
            page.getByPlaceholder(/context|stichworte|keywords/i),
        ).toBeVisible();
    });

    test("knowledge viewer loads", async ({ page }) => {
        await page.goto("/");

        // Navigate to Knowledge
        await page.getByRole("button", { name: /Knowledge/ }).click();

        // Should show topic fields from the knowledge base
        await expect(page.getByRole("heading", { name: /Energie/i })).toBeVisible();
    });

    test("api health check responds", async ({ request }) => {
        const response = await request.get("/api/health");
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        expect(body.status).toBe("ok");
    });
});
