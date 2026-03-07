import { Hono } from "hono";
import type { Env } from "../index";
import { buildTextPrompt, buildWebsiteArticlePrompt, buildImagePrompt } from "../services/prompt-builder";
import { generateText, generateImage } from "../services/gemini";

type InstanceId = "alex" | "ablas" | "bwg";
type ImageStyle = "photo" | "illustration" | "abstract" | "infographic";

/**
 * Hono router for content and image generation endpoints.
 *
 * @type {Hono<{ Bindings: Env }>}
 * @example
 * app.route("/api/generate", generateRoutes);
 */
export const generateRoutes = new Hono<{ Bindings: Env }>();

// POST /api/generate/text
generateRoutes.post("/text", async (c) => {
    const body = await c.req.json<{
        instance: InstanceId;
        contentType: string;
        topicField: string;
        userInput: string;
        language: "en" | "de";
    }>();

    const hasApiKey = Boolean(c.env.GEMINI_API_KEY);

    if (!hasApiKey) {
        // Mock mode — return placeholder when no API key configured
        return c.json({
            text: `[Mock] ${body.instance} ${body.contentType} post about "${body.userInput}"\n\nThis is a placeholder response. Configure GEMINI_API_KEY to enable AI generation.\n\n#BenderWire #Innovation #Wire`,
            hashtags: ["#BenderWire", "#Innovation", "#Wire"],
            charCount: 180,
            mock: true,
        });
    }

    try {
        // Build prompt from instance + content type + KB context
        const prompt = buildTextPrompt({
            instance: body.instance,
            contentType: body.contentType,
            topicField: body.topicField,
            userInput: body.userInput,
            language: body.language,
        });

        // Generate via Gemini
        const result = await generateText(c.env.GEMINI_API_KEY, prompt);

        // Extract hashtags from generated text
        const hashtags = result.text.match(/#\w+/g) ?? [];

        return c.json({
            text: result.text,
            hashtags,
            charCount: result.text.length,
            tokenCount: result.tokenCount,
            mock: false,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Generation failed: ${message}` }, 500);
    }
});

// POST /api/generate/website-article
generateRoutes.post("/website-article", async (c) => {
    const body = await c.req.json<{
        topicField: string;
        userInput: string;
    }>();

    const hasApiKey = Boolean(c.env.GEMINI_API_KEY);

    if (!hasApiKey) {
        return c.json({
            text: `[Mock] Website article about "${body.userInput}"\n\nThis is a placeholder. Configure GEMINI_API_KEY to enable generation.`,
            charCount: 100,
            mock: true,
        });
    }

    try {
        const prompt = buildWebsiteArticlePrompt({
            topicField: body.topicField,
            userInput: body.userInput,
        });

        const result = await generateText(c.env.GEMINI_API_KEY, prompt);

        return c.json({
            text: result.text,
            charCount: result.text.length,
            tokenCount: result.tokenCount,
            mock: false,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return c.json({ error: `Generation failed: ${message}` }, 500);
    }
});

// ============================================================
// POST /api/generate/image
// Full pipeline: vDNA prompt → Gemini Image API → R2 Upload → URL
// ============================================================
generateRoutes.post("/image", async (c) => {
    const body = await c.req.json<{
        instance: InstanceId;
        format: string;
        topicField: string;
        userInput: string;
        style?: ImageStyle;
    }>();

    const hasApiKey = Boolean(c.env.GEMINI_API_KEY);

    if (!hasApiKey) {
        return c.json({
            imageUrl: null,
            prompt: null,
            message:
                "Image generation requires GEMINI_API_KEY. Configure it via: wrangler secret put GEMINI_API_KEY",
            mock: true,
        });
    }

    try {
        // 1. Build brand-conformant prompt from vDNA fragments + instance + topic
        const prompt = buildImagePrompt({
            instance: body.instance,
            format: body.format || "single-square",
            topicField: body.topicField,
            userInput: body.userInput,
            style: body.style || "photo",
        });

        // 2. Generate image via Gemini (Imagen 3 / Nano Banana 2)
        const imageResult = await generateImage(c.env.GEMINI_API_KEY, prompt);

        // 3. Decode base64 → binary for R2 upload
        const binaryData = Uint8Array.from(atob(imageResult.data), (ch) =>
            ch.charCodeAt(0),
        );

        // 4. Determine file extension from MIME type
        const ext = imageResult.mimeType === "image/jpeg" ? "jpg" : "png";

        // 5. Build structured R2 key: {instance}/{date}/{uuid}.{ext}
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const uuid = crypto.randomUUID();
        const r2Key = `${body.instance}/${dateStr}/${uuid}.${ext}`;

        // 6. Upload to R2 with proper content type
        await c.env.IMAGES.put(r2Key, binaryData, {
            httpMetadata: {
                contentType: imageResult.mimeType,
            },
            customMetadata: {
                instance: body.instance,
                format: body.format || "single-square",
                topicField: body.topicField,
                style: body.style || "photo",
                generatedAt: now.toISOString(),
            },
        });

        // 7. Store image metadata in D1 for Library
        const imageId = uuid; // reuse the same UUID
        const formatSpec = {
            "single-square": { width: 1200, height: 1200 },
            "single-landscape": { width: 1200, height: 627 },
            "single-portrait": { width: 1080, height: 1350 },
            "carousel-slide": { width: 1080, height: 1080 },
            "company-banner": { width: 1584, height: 396 },
        }[body.format || "single-square"] ?? { width: 1200, height: 1200 };

        const imageUrl = `/api/images/${r2Key}`;

        try {
            await c.env.DB.prepare(
                `INSERT INTO generated_images (id, format, width, height, prompt, url)
                 VALUES (?, ?, ?, ?, ?, ?)`
            )
                .bind(
                    imageId,
                    body.format || "single-square",
                    formatSpec.width,
                    formatSpec.height,
                    prompt,
                    imageUrl,
                )
                .run();
        } catch {
            // D1 insert failure is non-fatal — image is still in R2
            console.error("[D1 Image Insert] Failed to store image metadata, image is still in R2");
        }

        return c.json({
            imageUrl,
            imageId,
            r2Key,
            mimeType: imageResult.mimeType,
            prompt, // Include prompt for transparency/debugging
            modelText: imageResult.text || null, // Any text the model returned
            mock: false,
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[Image Generation Error]", message);
        return c.json({ error: `Image generation failed: ${message}` }, 500);
    }
});

// ============================================================
// GET /api/generate/image-formats
// Returns available LinkedIn image formats from vDNA
// ============================================================
generateRoutes.get("/image-formats", (c) => {
    return c.json({
        formats: [
            { id: "single-square", width: 1200, height: 1200, label: "Standard Post" },
            { id: "single-landscape", width: 1200, height: 627, label: "Landscape / Link Preview" },
            { id: "single-portrait", width: 1080, height: 1350, label: "Portrait / Story-Style" },
            { id: "carousel-slide", width: 1080, height: 1080, label: "Karussell-Slide" },
            { id: "company-banner", width: 1584, height: 396, label: "Unternehmensbanner" },
        ],
        styles: [
            { id: "photo", label: "Industrial Photography" },
            { id: "illustration", label: "Geometric Illustration" },
            { id: "abstract", label: "Abstract / Conceptual" },
            { id: "infographic", label: "Infographic" },
        ],
    });
});

