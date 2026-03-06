// ============================================================
// B/CONTENT — Gemini API Client
// Lightweight wrapper for Google Gemini text generation
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

interface GeminiError {
    error: string;
    status?: number;
}

// Gemini API v1 endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const MODEL = "gemini-2.0-flash";

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
    const url = `${GEMINI_API_URL}/models/${MODEL}:generateContent?key=${apiKey}`;

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
