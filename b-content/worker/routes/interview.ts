// ============================================================
// B/CONTENT — Interview Pipeline API Routes (Z-003)
// Audio Upload → Gemini Transcribe+Extract → D1 Persist → KV Import
// ============================================================

import { Hono } from "hono";
import type { Env } from "../index";
import { AppError, transcribeAndExtract } from "../services/gemini";

// Max upload size: 20MB (Gemini inline data limit after base64 encoding)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_AUDIO_TYPES = [
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
];

export const interviewRoutes = new Hono<{ Bindings: Env }>();

// ============================================================
// POST /api/interview/process
// Upload audio file → Gemini transcription + extraction → D1 persist
// ============================================================
interviewRoutes.post("/process", async (c) => {
    const apiKey = c.req.header("x-gemini-key") || c.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new AppError("Gemini API key not configured", "API_KEY_MISSING", 500);
    }

    // Parse multipart form data
    const formData = await c.req.formData();
    const audioFile = formData.get("audio");
    const title = formData.get("title") as string | null;
    const context = formData.get("context") as string | null;

    if (!audioFile || !(audioFile instanceof File)) {
        throw new AppError("Audio file is required", "MISSING_AUDIO", 400);
    }

    // Validate file type
    const mimeType = audioFile.type;
    if (!ALLOWED_AUDIO_TYPES.includes(mimeType)) {
        throw new AppError(
            `Unsupported audio format: ${mimeType}. Supported: ${ALLOWED_AUDIO_TYPES.join(", ")}`,
            "UNSUPPORTED_FORMAT",
            400,
        );
    }

    // Validate file size
    if (audioFile.size > MAX_FILE_SIZE) {
        throw new AppError(
            `File too large: ${(audioFile.size / 1024 / 1024).toFixed(1)}MB. Max: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            "FILE_TOO_LARGE",
            413,
        );
    }

    // Convert audio to base64 for Gemini inline data
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
        ),
    );

    // Generate interview ID
    const id = crypto.randomUUID();
    const interviewTitle = title || `Interview ${new Date().toISOString().split("T")[0]}`;

    // Call Gemini: Transcribe + Extract in one API call
    const result = await transcribeAndExtract(apiKey, base64, mimeType, context || undefined);

    // Enrich extracted items with IDs and default selection
    const enrichedItems = result.items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        selected: true,
    }));

    // Persist to D1
    await c.env.DB.prepare(
        `INSERT INTO interviews (id, title, transcript, extracted_items, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'processed', datetime('now'), datetime('now'))`,
    )
        .bind(id, interviewTitle, result.transcript, JSON.stringify(enrichedItems))
        .run();

    return c.json({
        interview: {
            id,
            title: interviewTitle,
            transcript: result.transcript,
            extractedItems: enrichedItems,
            importedCount: 0,
            status: "processed" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });
});

// ============================================================
// POST /api/interview/import
// Import cherry-picked extracted items into Knowledge Base (KV Overlay)
// ============================================================
interviewRoutes.post("/import", async (c) => {
    const body = await c.req.json<{
        interviewId: string;
        items: Array<{
            id: string;
            type: "fact" | "quote" | "anecdote" | "proof_point";
            content: string;
            author?: "alex" | "ablas" | "fichtel" | null;
            topicFields: string[];
        }>;
    }>();

    if (!body.interviewId || !Array.isArray(body.items) || body.items.length === 0) {
        throw new AppError("interviewId and items[] are required", "INVALID_REQUEST", 400);
    }

    const kv = c.env.KB_STORE;
    let importedCount = 0;

    for (const item of body.items) {
        if (!item.content || !item.type) continue;

        if (item.type === "fact" && item.topicFields.length > 0) {
            // Import as fact into topic's fact list
            for (const topicId of item.topicFields) {
                const kvKey = `topics/${topicId}/facts`;
                const existing = await kv.get(kvKey, "json") as Array<{ id: string; content: string; source: string }> | null;
                const facts = existing || [];
                facts.push({
                    id: item.id,
                    content: item.content,
                    source: "Interview Import",
                });
                await kv.put(kvKey, JSON.stringify(facts));
            }
            importedCount++;
        } else if (item.type === "quote") {
            // Import as quote
            const kvKey = "quotes/all";
            const existing = await kv.get(kvKey, "json") as Array<{
                id: string;
                content: string;
                author: string;
                context?: string;
            }> | null;
            const quotes = existing || [];
            quotes.push({
                id: item.id,
                content: item.content,
                author: item.author || "alex",
                context: "Interview Import",
            });
            await kv.put(kvKey, JSON.stringify(quotes));
            importedCount++;
        } else if (item.type === "anecdote" || item.type === "proof_point") {
            // Store anecdotes and proof points as facts in the relevant topic
            for (const topicId of item.topicFields) {
                const kvKey = `topics/${topicId}/facts`;
                const existing = await kv.get(kvKey, "json") as Array<{ id: string; content: string; source: string }> | null;
                const facts = existing || [];
                facts.push({
                    id: item.id,
                    content: `[${item.type === "proof_point" ? "Proof Point" : "Anecdote"}] ${item.content}`,
                    source: "Interview Import",
                });
                await kv.put(kvKey, JSON.stringify(facts));
            }
            importedCount++;
        }
    }

    // Update interview record
    await c.env.DB.prepare(
        `UPDATE interviews SET imported_count = ?, status = 'imported', updated_at = datetime('now') WHERE id = ?`,
    )
        .bind(importedCount, body.interviewId)
        .run();

    return c.json({
        imported: importedCount,
        interviewId: body.interviewId,
    });
});

// ============================================================
// GET /api/interview/history
// List past interviews (without full transcript for performance)
// ============================================================
interviewRoutes.get("/history", async (c) => {
    const status = c.req.query("status");

    let query = `SELECT id, title, imported_count, extracted_items, status, created_at
                 FROM interviews ORDER BY created_at DESC LIMIT 50`;
    const params: string[] = [];

    if (status) {
        query = `SELECT id, title, imported_count, extracted_items, status, created_at
                 FROM interviews WHERE status = ? ORDER BY created_at DESC LIMIT 50`;
        params.push(status);
    }

    const stmt = params.length > 0
        ? c.env.DB.prepare(query).bind(...params)
        : c.env.DB.prepare(query);

    const result = await stmt.all();

    const interviews = (result.results || []).map((row: Record<string, unknown>) => {
        let extractedCount = 0;
        try {
            const items = JSON.parse(row.extracted_items as string || "[]");
            extractedCount = Array.isArray(items) ? items.length : 0;
        } catch { /* ignore parse errors */ }

        return {
            id: row.id,
            title: row.title,
            importedCount: row.imported_count,
            extractedCount,
            status: row.status,
            createdAt: row.created_at,
        };
    });

    return c.json({ interviews });
});
