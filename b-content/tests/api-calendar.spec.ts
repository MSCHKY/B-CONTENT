import { expect, test } from "@playwright/test";
import { execSync } from "node:child_process";

test.describe("API Calendar Endpoint", () => {
    test.beforeAll(() => {
        execSync("npm run db:migrate", { stdio: "ignore" });
    });

    test("GET /api/calendar - requires month parameter", async ({ request }) => {
        const response = await request.get("/api/calendar");
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("month query param required (YYYY-MM)");
    });

    test("GET /api/calendar - rejects invalid month format", async ({ request }) => {
        const response = await request.get("/api/calendar?month=01-2026");
        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.error).toBe("month query param required (YYYY-MM)");
    });

    test("GET /api/calendar - returns expected shape for valid month", async ({ request }) => {
        const response = await request.get("/api/calendar?month=2026-03");
        expect(response.ok()).toBeTruthy();

        const body = await response.json();

        expect(Array.isArray(body.scheduled)).toBeTruthy();
        expect(Array.isArray(body.unscheduled)).toBeTruthy();
        expect(body.month).toBe("2026-03");
    });
});
