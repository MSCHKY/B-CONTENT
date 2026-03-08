// ============================================================
// B/CONTENT — Interview Pipeline Type Definitions
// Feature: Z-003 (PRODUCT_SPEC.md §5 F14)
// ============================================================

import type { TopicFieldId } from "./index";

// --- Extracted Knowledge Items ---

export type ExtractedItemType = "fact" | "quote" | "anecdote" | "proof_point";

export interface ExtractedItem {
    /** Unique identifier */
    id: string;
    /** Type of knowledge item */
    type: ExtractedItemType;
    /** The extracted text content */
    content: string;
    /** Who said it (if identifiable) */
    author?: "alex" | "ablas" | "fichtel" | null;
    /** Assigned topic fields */
    topicFields: TopicFieldId[];
    /** AI confidence score (0.0–1.0) */
    confidence: number;
    /** Approximate timestamp in the audio (e.g. "12:34") */
    sourceTimestamp?: string;
    /** Whether the user has selected this item for import */
    selected: boolean;
}

// --- Interview Entity ---

export type InterviewStatus = "processing" | "processed" | "imported" | "failed";

export interface Interview {
    id: string;
    title: string;
    transcript: string;
    extractedItems: ExtractedItem[];
    importedCount: number;
    status: InterviewStatus;
    durationSeconds?: number;
    createdAt: string;
    updatedAt: string;
}

/** Summary for history list (without full transcript) */
export interface InterviewSummary {
    id: string;
    title: string;
    importedCount: number;
    extractedCount: number;
    status: InterviewStatus;
    createdAt: string;
}

// --- API Request / Response ---

export interface ProcessInterviewResponse {
    interview: Interview;
}

export interface ImportItemsRequest {
    interviewId: string;
    items: ExtractedItem[];
}

export interface ImportItemsResponse {
    imported: number;
    interviewId: string;
}
