// ============================================================
// B/CONTENT — Gemini API Client
// Lightweight wrapper for Google Gemini text + image generation
// ============================================================

interface GeminiTextRequest {
    system: string;
    user: string;
}

interface GeminiResponse {
    text: string;
    finishReason: string;
    tokenCount?: number;
}

interface GeminiImageResponse {
    /** Base64-encoded image data */
    data: string;
    /** MIME type (e.g. "image/png") */
    mimeType: string;
    /** Optional text description from the model */
    text?: string;
    finishReason: string;
}

interface GeminiError {
    error: string;
    status?: number;
}

// Gemini API v1beta endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const TEXT_MODEL = "gemini-2.0-flash";
const IMAGE_MODEL = "gemini-2.5-flash-image";

/**
 * Generate text content using the Gemini API.
 *
 * Uses the standard API endpoint. For EU-only data processing,
 * switch to Vertex AI EU endpoint when ready:
 * https://europe-west1-aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/europe-west1/publishers/google/models/{MODEL}:generateContent
 */
export async function generateText(
    apiKey: string,
    request: GeminiTextRequest,
): Promise<GeminiResponse> {
    const url = `${GEMINI_API_URL}/models/${TEXT_MODEL}:generateContent?key=${apiKey}`;

    const body = {
        system_instruction: {
            parts: [{ text: request.system }],
        },
        contents: [
            {
                role: "user",
                parts: [{ text: request.user }],
            },
        ],
        generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_ONLY_HIGH",
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_ONLY_HIGH",
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_ONLY_HIGH",
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_ONLY_HIGH",
            },
        ],
    };

    let lastError: GeminiError | null = null;

    // Attempt with 1 retry
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorText = await response.text();
                lastError = {
                    error: `Gemini API error: ${response.status} — ${errorText}`,
                    status: response.status,
                };

                // Don't retry on 4xx errors (auth, bad request)
                if (response.status >= 400 && response.status < 500) {
                    break;
                }

                // Retry on 5xx
                continue;
            }

            const data = (await response.json()) as {
                candidates?: {
                    content?: { parts?: { text?: string }[] };
                    finishReason?: string;
                }[];
                usageMetadata?: { totalTokenCount?: number };
            };

            const candidate = data.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text;

            if (!text) {
                return {
                    text: "",
                    finishReason: candidate?.finishReason ?? "UNKNOWN",
                };
            }

            return {
                text: text.trim(),
                finishReason: candidate?.finishReason ?? "STOP",
                tokenCount: data.usageMetadata?.totalTokenCount,
            };
        } catch (err) {
            lastError = {
                error: `Network error: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
    }

    throw new Error(lastError?.error ?? "Gemini API request failed");
}

// ============================================================
// Image Generation — Gemini 2.5 Flash Image (Imagen 3 / Nano Banana 2)
// Uses native generateContent endpoint with responseModalities: ["IMAGE"]
// ============================================================

/**
 * Generate an image using the Gemini Image API.
 *
 * Model: gemini-2.5-flash-image (Imagen 3 / Nano Banana 2)
 * Returns base64-encoded image data that can be piped to R2 storage.
 *
 * API docs: https://ai.google.dev/gemini-api/docs/image-generation
 */
export async function generateImage(
    apiKey: string,
    prompt: string,
): Promise<GeminiImageResponse> {
    const url = `${GEMINI_API_URL}/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`;

    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            responseModalities: ["IMAGE"],
            temperature: 0.8,
            topP: 0.95,
            topK: 40,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_ONLY_HIGH",
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_ONLY_HIGH",
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_ONLY_HIGH",
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_ONLY_HIGH",
            },
        ],
    };

    let lastError: GeminiError | null = null;

    // Attempt with 1 retry (image gen can be slow — no extra retries)
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorText = await response.text();
                lastError = {
                    error: `Gemini Image API error: ${response.status} — ${errorText}`,
                    status: response.status,
                };

                if (response.status >= 400 && response.status < 500) {
                    break;
                }
                continue;
            }

            // Response shape: candidates[].content.parts[] where parts can be
            // { text: "..." } or { inlineData: { mimeType: "image/png", data: "base64..." } }
            const data = (await response.json()) as {
                candidates?: {
                    content?: {
                        parts?: Array<{
                            text?: string;
                            inlineData?: { mimeType: string; data: string };
                        }>;
                    };
                    finishReason?: string;
                }[];
            };

            const candidate = data.candidates?.[0];
            const parts = candidate?.content?.parts ?? [];

            // Find the image part
            const imagePart = parts.find((p) => p.inlineData?.data);
            if (!imagePart?.inlineData) {
                throw new Error(
                    "Gemini returned no image data. The model may have refused the prompt or encountered an error.",
                );
            }

            // Optionally capture any text the model returned
            const textPart = parts.find((p) => p.text);

            return {
                data: imagePart.inlineData.data,
                mimeType: imagePart.inlineData.mimeType,
                text: textPart?.text?.trim(),
                finishReason: candidate?.finishReason ?? "STOP",
            };
        } catch (err) {
            // Don't wrap our own thrown errors
            if (err instanceof Error && err.message.includes("Gemini returned no image")) {
                throw err;
            }
            lastError = {
                error: `Network error: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
    }

    throw new Error(lastError?.error ?? "Gemini Image API request failed");
}
