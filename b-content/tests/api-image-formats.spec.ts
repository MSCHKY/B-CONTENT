import { expect, test } from "@playwright/test";

interface ImageFormat {
    id: string;
    width: number;
    height: number;
    label: string;
}

interface ImageStyle {
    id: string;
    label: string;
}

interface ImageFormatsResponse {
    formats: ImageFormat[];
    styles: ImageStyle[];
}

test.describe("API Image Formats", () => {
    test("returns expected static image formats and styles", async ({ request }) => {
        const response = await request.get("/api/generate/image-formats");
        expect(response.ok()).toBeTruthy();

        const body = (await response.json()) as ImageFormatsResponse;
        expect(Array.isArray(body.formats)).toBeTruthy();
        expect(Array.isArray(body.styles)).toBeTruthy();
        expect(body.formats).toHaveLength(5);
        expect(body.styles).toHaveLength(4);

        const expectedFormats = [
            "single-square",
            "single-landscape",
            "single-portrait",
            "carousel-slide",
            "company-banner",
        ];
        for (const formatId of expectedFormats) {
            const format = body.formats.find((entry) => entry.id === formatId);
            expect(format).toBeDefined();
            expect((format?.width ?? 0) > 0).toBeTruthy();
            expect((format?.height ?? 0) > 0).toBeTruthy();
            expect(typeof format?.label).toBe("string");
        }

        const expectedStyles = ["photo", "illustration", "abstract", "infographic"];
        for (const styleId of expectedStyles) {
            const style = body.styles.find((entry) => entry.id === styleId);
            expect(style).toBeDefined();
            expect(typeof style?.label).toBe("string");
        }
    });
});
