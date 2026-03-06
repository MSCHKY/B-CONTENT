import { Hono } from "hono";
import type { Env } from "../index";
import { buildTextPrompt, buildWebsiteArticlePrompt } from "../services/prompt-builder";
import { generateText } from "../services/gemini";

type InstanceId = "alex" | "ablas" | "bwg";

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

// POST /api/generate/image
generateRoutes.post("/image", async (c) => {
    const hasApiKey = Boolean(c.env.GEMINI_API_KEY);

    if (!hasApiKey) {
        return c.json({
            imageUrl: null,
            message:
                "Image generation requires GEMINI_API_KEY. Configure it via: wrangler secret put GEMINI_API_KEY",
            mock: true,
        });
    }

    // TODO: Implement Nano Banana 2 image generation
    // This requires Gemini image generation API (Imagen 3 / Nano Banana 2)
    return c.json({
        imageUrl: null,
        message: "Image generation coming soon — text generation is active.",
        mock: false,
    });
});
