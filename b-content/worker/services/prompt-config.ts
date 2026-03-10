// ============================================================
// B/CONTENT — Prompt Configuration (Tuning Center)
// All generation parameters in one place for easy A/B testing.
// Change values here to tune output quality without touching
// builder or API client code.
// ============================================================

/**
 * Text generation config for Gemini 2.5 Flash.
 *
 * Context7 Best Practice (2026-03):
 * - temperature 1.0 is the recommended default for Gemini 2.5+
 * - Values below 1.0 can cause loops or degraded performance
 * - topP 0.95 + topK 40 is a balanced creative setting
 */
export const TEXT_GENERATION_CONFIG = {
    temperature: 1.0,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
} as const;

/**
 * Image generation config for Gemini 3.1 Flash Image Preview.
 *
 * Context7 Best Practice (2026-03):
 * - responseModalities: ["IMAGE"] for image-only output
 * - imageConfig.aspectRatio controls dimensions (1:1, 16:9, 9:16, 4:3, 3:4)
 * - imageConfig.imageSize controls resolution (256, 512, 1K, 2K, 4K)
 */
export const IMAGE_GENERATION_CONFIG = {
    temperature: 0.8,
    topP: 0.95,
    topK: 40,
} as const;

/**
 * Default image config values per LinkedIn format.
 * Maps our internal format IDs to Gemini API imageConfig values.
 */
export const FORMAT_TO_IMAGE_CONFIG: Record<string, { aspectRatio: string; imageSize: string }> = {
    "single-square": { aspectRatio: "1:1", imageSize: "1K" },
    "single-landscape": { aspectRatio: "16:9", imageSize: "1K" },
    "single-portrait": { aspectRatio: "9:16", imageSize: "1K" },
    "carousel-slide": { aspectRatio: "1:1", imageSize: "1K" },
    "company-banner": { aspectRatio: "16:9", imageSize: "1K" },
} as const;

/**
 * Prompt format version flag.
 * v1 = plain text (original)
 * v2 = XML-structured (Context7 best practice for Gemini 2.5+)
 *
 * Switch back to "v1" to instantly revert to the original prompt format.
 */
export const PROMPT_FORMAT: "v1" | "v2" = "v2";
