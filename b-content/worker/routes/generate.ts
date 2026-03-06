import { Hono } from "hono";
import type { Env } from "../index";

export const generateRoutes = new Hono<{ Bindings: Env }>();

// POST /api/generate/text
generateRoutes.post("/text", async (c) => {
    const body = await c.req.json<{
        instance: string;
        contentType: string;
        topicField: string;
        userInput: string;
        language: string;
    }>();

    // TODO: Wire up Gemini API when API key is configured
    // For now, return mock response
    const hasApiKey = Boolean(c.env.GEMINI_API_KEY);

    if (!hasApiKey) {
        return c.json({
            text: `[Mock] ${body.instance} ${body.contentType} post about "${body.userInput}"\n\nThis is a placeholder response. Configure GEMINI_API_KEY to enable AI generation.\n\n#BenderWire #Innovation #Wire`,
            hashtags: ["#BenderWire", "#Innovation", "#Wire"],
            charCount: 180,
            mock: true,
        });
    }

    // Real implementation will go here
    // const prompt = buildPrompt(body);
    // const result = await generateWithGemini(c.env.GEMINI_API_KEY, prompt);
    return c.json({ text: "TODO: Real generation", mock: false });
});

// POST /api/generate/image
generateRoutes.post("/image", async (c) => {
    // Body: { prompt: string; format: string }
    // Will be used when Gemini API integration is implemented
    const hasApiKey = Boolean(c.env.GEMINI_API_KEY);

    if (!hasApiKey) {
        return c.json({
            imageUrl: null,
            message:
                "Image generation requires GEMINI_API_KEY. Configure it via: wrangler secret put GEMINI_API_KEY",
            mock: true,
        });
    }

    // Real implementation will go here
    return c.json({ imageUrl: null, mock: false });
});
