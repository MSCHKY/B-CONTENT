import { Hono } from "hono";
import type { Env } from "../index";
import { buildTextPrompt } from "../services/prompt-builder";
import { generateText, AppError } from "../services/gemini";
import { validateRequiredString, sanitizeText } from "../services/validation";
import type { InstanceId } from "@shared/constants";

// Default content types per instance for orchestration
const ORCHESTRATION_CONTENT_TYPES: Record<InstanceId, string> = {
    alex: "deep-dive",
    ablas: "proof-point",
    bwg: "draht-steckt-in",
};

// Suggested posting days
const TIMING_SUGGESTIONS = ["Monday", "Wednesday", "Friday"];

/**
 * Hono router for content orchestration — the "Dreier-Regel".
 * Generates coordinated posts across all 3 instances from a single topic.
 */
export const orchestrateRoutes = new Hono<{ Bindings: Env }>();

// POST /api/orchestrate — Generate 3 coordinated posts
orchestrateRoutes.post("/", async (c) => {
    let body;
    try {
        body = await c.req.json<{
            topicField: string;
            userInput: string;
            language?: "en" | "de";
        }>();
    } catch {
        return c.json({ error: "Invalid JSON body" }, 400);
    }

    body.userInput = sanitizeText(body.userInput);
    const language = body.language ?? "en";

    // Validate
    const errors = [
        validateRequiredString(body.topicField, "topicField"),
        validateRequiredString(body.userInput, "userInput"),
    ].filter(Boolean);

    if (errors.length > 0) {
        return c.json(errors[0], 400);
    }

    const hasApiKey = Boolean(c.env.GEMINI_API_KEY);

    if (!hasApiKey) {
        // Mock mode — return placeholder posts for each instance
        const instances: InstanceId[] = ["alex", "ablas", "bwg"];
        const mockPosts = instances.map((instanceId, i) => ({
            instance: instanceId,
            contentType: ORCHESTRATION_CONTENT_TYPES[instanceId],
            text: `[MOCK] This is a ${instanceId} ${ORCHESTRATION_CONTENT_TYPES[instanceId]} post about "${body.topicField}". Configure GEMINI_API_KEY for real generation.`,
            hashtags: ["#BenderWire", `#${body.topicField}`],
            charCount: 120,
            suggestedDay: TIMING_SUGGESTIONS[i],
            mock: true,
        }));

        return c.json({ posts: mockPosts, errors: [], timing: TIMING_SUGGESTIONS });
    }

    try {
        const instances: InstanceId[] = ["alex", "ablas", "bwg"];

        // Fire all 3 generation calls in parallel — use allSettled for partial-success
        const settled = await Promise.allSettled(
            instances.map(async (instanceId) => {
                const contentType = ORCHESTRATION_CONTENT_TYPES[instanceId];

                const prompt = buildTextPrompt({
                    instance: instanceId,
                    contentType,
                    topicField: body.topicField,
                    userInput: `${body.userInput}\n\n[ORCHESTRATION CONTEXT: This post is part of a coordinated 3-post campaign. The same topic is being covered from 3 different perspectives: Jürgen Alex (sustainability/responsibility), Sebastian Ablas (innovation/pragmatism), and BenderWire Group (corporate/facts). Make this post unique to your perspective — avoid overlapping content with the other two.]`,
                    language,
                });

                const result = await generateText(c.env.GEMINI_API_KEY, prompt);

                // Extract hashtags from generated text
                const hashtagMatch = result.text.match(/#\w+/g);
                const hashtags = hashtagMatch
                    ? [...new Set(hashtagMatch)]
                    : [];

                return {
                    instance: instanceId,
                    contentType,
                    text: result.text,
                    hashtags,
                    charCount: result.text.length,
                    tokenCount: result.tokenCount,
                    mock: false,
                };
            }),
        );

        // Separate fulfilled from rejected results
        const posts: Array<Record<string, unknown>> = [];
        const errors: Array<{ instance: string; error: string }> = [];

        settled.forEach((result, i) => {
            if (result.status === "fulfilled") {
                posts.push({
                    ...result.value,
                    suggestedDay: TIMING_SUGGESTIONS[i],
                });
            } else {
                const reason = result.reason;
                const message = reason instanceof AppError
                    ? `${reason.code}: ${reason.message}`
                    : reason instanceof Error
                        ? reason.message
                        : String(reason);
                errors.push({ instance: instances[i]!, error: message });
                console.error(`[POST /api/orchestrate] ${instances[i]} failed:`, message);
            }
        });

        // If ALL failed, return 502
        if (posts.length === 0) {
            return c.json({
                error: "All generation calls failed",
                errors,
            }, 502);
        }

        return c.json({ posts, errors, timing: TIMING_SUGGESTIONS });
    } catch (err) {
        // Unexpected errors (not per-instance failures)
        const message = err instanceof Error ? err.message : String(err);
        console.error("[POST /api/orchestrate]", message);
        return c.json({ error: "Orchestration failed" }, 500);
    }
});
