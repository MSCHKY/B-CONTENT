import type { ExtractedItem } from "@/types/interview";

// --- State Machine ---
export type ViewState = "idle" | "uploading" | "processing" | "review" | "importing" | "done" | "error";

// --- Confidence color helper ---
export function confidenceColor(c: number): string {
    if (c >= 0.8) return "text-green-400";
    if (c >= 0.5) return "text-yellow-400";
    return "text-red-400";
}

export function confidenceBg(c: number): string {
    if (c >= 0.8) return "bg-green-500/20 border-green-500/30";
    if (c >= 0.5) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
}

// --- Item type labels ---
export const TYPE_LABELS: Record<ExtractedItem["type"], { de: string; en: string; emoji: string }> = {
    fact: { de: "Fakt", en: "Fact", emoji: "📊" },
    quote: { de: "Zitat", en: "Quote", emoji: "💬" },
    anecdote: { de: "Anekdote", en: "Anecdote", emoji: "📖" },
    proof_point: { de: "Proof Point", en: "Proof Point", emoji: "✅" },
};
