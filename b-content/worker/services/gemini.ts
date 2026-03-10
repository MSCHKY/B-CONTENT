// ============================================================
// B/CONTENT — Gemini API Client
// Lightweight wrapper for Google Gemini text + image generation
// ============================================================

import { TEXT_GENERATION_CONFIG, IMAGE_GENERATION_CONFIG } from "./prompt-config";

/**
 * Typed application error for API route error handling.
 * Carries a machine-readable code and HTTP status.
 */
export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public status: number = 500,
    ) {
        super(message);
        this.name = "AppError";
    }
}

/**
 * Text generation request for Gemini.
 */
interface GeminiTextRequest {
    /** The system instruction */
    system: string;
    /** The user prompt */
    user: string;
}

/**
 * Response from Gemini text generation.
 */
interface GeminiResponse {
    /** The generated text */
    text: string;
    /** The reason the model stopped generating */
    finishReason: string;
    /** Total tokens used in generation */
    tokenCount?: number;
}

/**
 * Response from Gemini image generation.
 */
interface GeminiImageResponse {
    /** Base64-encoded image data */
    data: string;
    /** MIME type (e.g. "image/png") */
    mimeType: string;
    /** Optional text description from the model */
    text?: string;
    /** The reason the model stopped generating */
    finishReason: string;
}

/**
 * Error structure from Gemini API.
 */
interface GeminiError {
    /** Error message string */
    error: string;
    /** HTTP status code */
    status?: number;
}

// Gemini API v1beta endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";
const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3.1-flash-image-preview";

/**
 * Generate text content using the Gemini API.
 *
 * Uses the standard API endpoint. For EU-only data processing,
 * switch to Vertex AI EU endpoint when ready:
 * https://europe-west1-aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/europe-west1/publishers/google/models/{MODEL}:generateContent
 *
 * @param {string} apiKey - The Gemini API key.
 * @param {GeminiTextRequest} request - The request object containing system instruction and user prompt.
 * @returns {Promise<GeminiResponse>} The generated text response and metadata.
 * @example
 * const response = await generateText("api-key-here", {
 *   system: "You are a helpful assistant.",
 *   user: "Hello!"
 * });
 * console.log(response.text);
 */
export async function generateText(
    apiKey: string,
    request: GeminiTextRequest,
): Promise<GeminiResponse> {
    if (!apiKey) {
        throw new AppError("API key missing", "API_KEY_MISSING", 400);
    }

    const url = `${GEMINI_API_URL}/models/${TEXT_MODEL}:generateContent`;

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
            ...TEXT_GENERATION_CONFIG,
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

    // Attempt with 1 retry + exponential backoff
    for (let attempt = 0; attempt < 2; attempt++) {
        if (attempt > 0) {
            await new Promise(r => setTimeout(r, attempt * 1000));
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();

                if (response.status === 429) {
                    throw new AppError("Rate limit exceeded", "RATE_LIMIT_EXCEEDED", 429);
                }

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

            let data;
            try {
                data = (await response.json()) as {
                    candidates?: {
                        content?: { parts?: { text?: string }[] };
                        finishReason?: string;
                    }[];
                    usageMetadata?: { totalTokenCount?: number };
                };
            } catch {
                throw new AppError("Invalid response format", "INVALID_RESPONSE_FORMAT", 502);
            }

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
            clearTimeout(timeoutId);
            if (err instanceof AppError) {
                throw err;
            }
            if (err instanceof Error && err.name === "AbortError") {
                throw new AppError("Network timeout", "TIMEOUT", 504);
            }
            lastError = {
                error: `Network error: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
    }

    throw new AppError(lastError?.error ?? "Gemini API request failed", "API_FAILURE", 500);
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
 *
 * @param {string} apiKey - The Gemini API key.
 * @param {string} prompt - The prompt to generate the image.
 * @returns {Promise<GeminiImageResponse>} The generated image response containing base64 data and metadata.
 * @example
 * const response = await generateImage("api-key-here", "A futuristic city skyline at night.");
 * console.log(response.mimeType);
 */
export async function generateImage(
    apiKey: string,
    prompt: string,
): Promise<GeminiImageResponse> {
    const url = `${GEMINI_API_URL}/models/${IMAGE_MODEL}:generateContent`;

    const body = {
        contents: [
            {
                role: "user",
                parts: [{ text: prompt }],
            },
        ],
        generationConfig: {
            responseModalities: ["IMAGE"],
            ...IMAGE_GENERATION_CONFIG,
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

    // Attempt with 1 retry + exponential backoff
    for (let attempt = 0; attempt < 2; attempt++) {
        if (attempt > 0) {
            await new Promise(r => setTimeout(r, attempt * 1500));
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
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

    throw new AppError(
        lastError?.error ?? "Gemini Image API request failed",
        lastError?.status === 429 ? "RATE_LIMITED" : "IMAGE_GENERATION_FAILED",
        lastError?.status ?? 500,
    );
}

// ============================================================
// Audio Transcription + Knowledge Extraction
// Uses Gemini 2.0 Flash with inline audio data for combined
// transcription and structured fact/quote/anecdote extraction.
// ============================================================

/** Supported audio MIME types for Gemini inline data */
const SUPPORTED_AUDIO_TYPES = [
    "audio/webm",
    "audio/mp3",
    "audio/mpeg",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
    "audio/wav",
    "audio/ogg",
    "audio/flac",
    "audio/aac",
] as const;

/** Raw extracted item from Gemini (before we add id/selected) */
interface RawExtractedItem {
    type: "fact" | "quote" | "anecdote" | "proof_point";
    content: string;
    author?: "alex" | "ablas" | "fichtel" | null;
    topicFields: string[];
    confidence: number;
    sourceTimestamp?: string;
}

/** Result from transcribeAndExtract */
export interface TranscriptionResult {
    transcript: string;
    items: RawExtractedItem[];
}

/** System prompt for combined transcription + extraction */
const TRANSCRIBE_EXTRACT_PROMPT = `You are a content analyst for the BenderWire Group, a wire manufacturing company.
You receive an audio interview. Your task:

1. TRANSCRIPTION: Create a complete, accurate transcript of the interview.
   - Preserve the speaker's original language (German or English).
   - Include speaker changes where identifiable.

2. EXTRACTION: Identify valuable content from the transcript:
   - **fact**: Verifiable statements, numbers, data points, technical specifications.
   - **quote**: Direct quotes suitable for LinkedIn posts — memorable, punchy, authentic.
   - **anecdote**: Stories, examples, experiences that create emotional connection.
   - **proof_point**: Concrete evidence (numbers, case studies, customer references).

3. For each item, assign one or more topic fields:
   energie, circular, medtech, bau, alltag, luxus, sicherheit, wasser,
   vertikale-integration, geopolitik, image-reframe, ingredient-branding, qualitaet

4. Assign a confidence score (0.0–1.0) indicating how useful the item is for content creation.

5. If you can identify the speaker, set author to "alex" (Jürgen Alex), "ablas" (Sebastian Ablas), or "fichtel". Otherwise set to null.

Respond EXCLUSIVELY in this JSON format:
{
  "transcript": "Full transcript text here...",
  "items": [
    {
      "type": "fact",
      "content": "The extracted text",
      "author": "alex",
      "topicFields": ["energie", "circular"],
      "confidence": 0.95,
      "sourceTimestamp": "12:34"
    }
  ]
}`;

/**
 * Transcribe audio and extract knowledge items using the Gemini API.
 *
 * Sends audio as inline base64 data to Gemini 2.0 Flash and receives
 * structured JSON containing the full transcript and extracted items.
 *
 * @param {string} apiKey - The Gemini API key.
 * @param {string} audioBase64 - Base64-encoded audio data.
 * @param {string} mimeType - Audio MIME type (e.g. "audio/webm", "audio/mp3").
 * @param {string} [context] - Optional context hint (e.g. "Interview with Jürgen Alex about Circular Economy").
 * @returns {Promise<TranscriptionResult>} Transcript and extracted knowledge items.
 * @throws {AppError} On validation errors, API failures, or malformed responses.
 */
export async function transcribeAndExtract(
    apiKey: string,
    audioBase64: string,
    mimeType: string,
    context?: string,
): Promise<TranscriptionResult> {
    if (!apiKey) {
        throw new AppError("API key missing", "API_KEY_MISSING", 400);
    }

    // Validate MIME type
    if (!SUPPORTED_AUDIO_TYPES.includes(mimeType as typeof SUPPORTED_AUDIO_TYPES[number])) {
        throw new AppError(
            `Unsupported audio format: ${mimeType}. Supported: ${SUPPORTED_AUDIO_TYPES.join(", ")}`,
            "UNSUPPORTED_FORMAT",
            400,
        );
    }

    const url = `${GEMINI_API_URL}/models/${TEXT_MODEL}:generateContent`;

    // Build user prompt with optional context
    let userPrompt = TRANSCRIBE_EXTRACT_PROMPT;
    if (context) {
        userPrompt += `\n\nAdditional context about this interview: ${context}`;
    }

    const body = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            mimeType,
                            data: audioBase64,
                        },
                    },
                    {
                        text: userPrompt,
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: 0.2,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
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

    // Single attempt with generous timeout (audio processing can take 30-90s)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 429) {
                throw new AppError("Rate limit exceeded", "RATE_LIMIT_EXCEEDED", 429);
            }
            if (response.status === 413) {
                throw new AppError(
                    "Audio file too large for inline processing",
                    "FILE_TOO_LARGE",
                    413,
                );
            }

            const errorText = await response.text();
            throw new AppError(
                `Gemini Audio API error: ${response.status} — ${errorText.slice(0, 200)}`,
                "API_FAILURE",
                response.status >= 500 ? 502 : response.status,
            );
        }

        const data = (await response.json()) as {
            candidates?: {
                content?: { parts?: { text?: string }[] };
                finishReason?: string;
            }[];
        };

        const candidate = data.candidates?.[0];
        const rawText = candidate?.content?.parts?.[0]?.text;

        if (!rawText) {
            throw new AppError(
                "Gemini returned empty response for audio transcription",
                "EMPTY_RESPONSE",
                502,
            );
        }

        // Parse structured JSON response
        let parsed: { transcript?: string; items?: RawExtractedItem[] };
        try {
            parsed = JSON.parse(rawText);
        } catch {
            // Fallback: try to extract JSON from markdown fence
            const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch?.[1]) {
                parsed = JSON.parse(jsonMatch[1]);
            } else {
                throw new AppError(
                    "Failed to parse Gemini response as JSON",
                    "PARSE_ERROR",
                    502,
                );
            }
        }

        if (!parsed.transcript) {
            throw new AppError(
                "Gemini response missing transcript field",
                "INVALID_RESPONSE",
                502,
            );
        }

        return {
            transcript: parsed.transcript,
            items: Array.isArray(parsed.items) ? parsed.items : [],
        };
    } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof AppError) {
            throw err;
        }
        if (err instanceof Error && err.name === "AbortError") {
            throw new AppError(
                "Audio transcription timed out (max 2 min)",
                "TIMEOUT",
                504,
            );
        }
        throw new AppError(
            `Transcription failed: ${err instanceof Error ? err.message : String(err)}`,
            "TRANSCRIPTION_FAILED",
            500,
        );
    }
}
