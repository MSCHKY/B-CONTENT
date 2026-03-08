// ============================================================
// B/CONTENT — Interview Pipeline View (Z-003)
// Audio Upload → Processing → Review Panel → KB Import
// ============================================================

import { useState, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n";
import { useAppStore } from "@/stores";
import {
    Mic,
    Upload,
    FileAudio,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Loader2,
    Import,
    Clock,
    Sparkles,
    AlertTriangle,
    History,
} from "lucide-react";
import type { ExtractedItem, Interview, InterviewSummary } from "@/types/interview";

// --- State Machine ---
type ViewState = "idle" | "uploading" | "processing" | "review" | "importing" | "done" | "error";

// --- Confidence color helper ---
function confidenceColor(c: number): string {
    if (c >= 0.8) return "text-green-400";
    if (c >= 0.5) return "text-yellow-400";
    return "text-red-400";
}

function confidenceBg(c: number): string {
    if (c >= 0.8) return "bg-green-500/20 border-green-500/30";
    if (c >= 0.5) return "bg-yellow-500/20 border-yellow-500/30";
    return "bg-red-500/20 border-red-500/30";
}

// --- Item type labels ---
const TYPE_LABELS: Record<ExtractedItem["type"], { de: string; en: string; emoji: string }> = {
    fact: { de: "Fakt", en: "Fact", emoji: "📊" },
    quote: { de: "Zitat", en: "Quote", emoji: "💬" },
    anecdote: { de: "Anekdote", en: "Anecdote", emoji: "📖" },
    proof_point: { de: "Proof Point", en: "Proof Point", emoji: "✅" },
};

export function InterviewView() {
    const { t, locale } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- State ---
    const [viewState, setViewState] = useState<ViewState>("idle");
    const [dragActive, setDragActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [contextInput, setContextInput] = useState("");
    const [titleInput, setTitleInput] = useState("");

    // Processing result
    const [interview, setInterview] = useState<Interview | null>(null);
    const [items, setItems] = useState<ExtractedItem[]>([]);
    const [transcriptExpanded, setTranscriptExpanded] = useState(false);

    // History
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<InterviewSummary[]>([]);

    // Import result
    const [importedCount, setImportedCount] = useState(0);
    const [affectedTopics, setAffectedTopics] = useState<string[]>([]);

    // --- File handling ---
    const processFile = useCallback(async (file: File) => {
        // Validate type
        if (!file.type.startsWith("audio/")) {
            setErrorMessage(t.interview.errorFormat);
            setViewState("error");
            return;
        }

        // Validate size (20MB)
        if (file.size > 20 * 1024 * 1024) {
            setErrorMessage(t.interview.errorSize);
            setViewState("error");
            return;
        }

        setViewState("uploading");
        setErrorMessage("");

        try {
            const formData = new FormData();
            formData.append("audio", file);
            if (titleInput) formData.append("title", titleInput);
            if (contextInput) formData.append("context", contextInput);

            setViewState("processing");

            const response = await fetch("/api/interview/process", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: "Unknown error" }));
                throw new Error((err as { error: string }).error || `HTTP ${response.status}`);
            }

            const data = await response.json() as { interview: Interview };
            setInterview(data.interview);
            setItems(
                data.interview.extractedItems.map((item) => ({
                    ...item,
                    selected: true,
                })),
            );
            setViewState("review");
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : String(err));
            setViewState("error");
        }
    }, [contextInput, titleInput, t]);

    // --- Drag & Drop handlers ---
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    }, [processFile]);

    // --- Item toggle ---
    const toggleItem = useCallback((id: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item,
            ),
        );
    }, []);

    // --- Import ---
    const handleImport = useCallback(async () => {
        if (!interview) return;
        const selectedItems = items.filter((item) => item.selected);
        if (selectedItems.length === 0) return;

        setViewState("importing");

        try {
            const response = await fetch("/api/interview/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    interviewId: interview.id,
                    items: selectedItems,
                }),
            });

            if (!response.ok) {
                throw new Error(`Import failed: HTTP ${response.status}`);
            }

            const data = await response.json() as { imported: number; affectedTopics: string[] };
            setImportedCount(data.imported);
            setAffectedTopics(data.affectedTopics || []);
            setViewState("done");
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : String(err));
            setViewState("error");
        }
    }, [interview, items]);

    // --- Load history ---
    const loadHistory = useCallback(async () => {
        try {
            const response = await fetch("/api/interview/history");
            if (response.ok) {
                const data = await response.json() as { interviews: InterviewSummary[] };
                setHistory(data.interviews);
            }
        } catch { /* ignore */ }
        setShowHistory((prev) => !prev);
    }, []);

    // --- Reset ---
    const resetToIdle = useCallback(() => {
        setViewState("idle");
        setInterview(null);
        setItems([]);
        setErrorMessage("");
        setContextInput("");
        setTitleInput("");
        setImportedCount(0);
        setAffectedTopics([]);
    }, []);

    // --- Counts ---
    const selectedCount = items.filter((i) => i.selected).length;
    const groupedItems = items.reduce(
        (acc, item) => {
            if (!acc[item.type]) acc[item.type] = [];
            acc[item.type]!.push(item);
            return acc;
        },
        {} as Record<string, ExtractedItem[]>,
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                            <Mic className="text-bright-green" size={24} />
                            {t.interview.title}
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">
                            {t.interview.subtitle}
                        </p>
                    </div>
                    <button
                        onClick={loadHistory}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                            text-text-secondary hover:text-text-primary hover:bg-white/5
                            transition-colors cursor-pointer"
                    >
                        <History size={16} />
                        {t.interview.history}
                    </button>
                </div>
            </div>

            {/* History Panel (collapsible) */}
            {showHistory && history.length > 0 && (
                <div className="mb-6 glass-card rounded-xl p-4 animate-slide-in-left">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">
                        {t.interview.history}
                    </h3>
                    <div className="space-y-2">
                        {history.map((h) => (
                            <div
                                key={h.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 text-sm"
                            >
                                <div>
                                    <span className="text-text-primary font-medium">
                                        {h.title}
                                    </span>
                                    <span className="text-text-secondary ml-2 text-xs">
                                        {new Date(h.createdAt).toLocaleDateString(locale === "de" ? "de-DE" : "en-US")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-text-secondary">
                                    <span>{h.extractedCount} items</span>
                                    <span className={`px-2 py-0.5 rounded-full ${h.status === "imported"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-blue-500/20 text-blue-400"
                                        }`}>
                                        {h.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ==================== IDLE: Upload Zone ==================== */}
            {viewState === "idle" && (
                <div className="space-y-4">
                    {/* Context inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                {t.interview.titleLabel}
                            </label>
                            <input
                                type="text"
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                placeholder={t.interview.titlePlaceholder}
                                className="w-full px-3 py-2 rounded-lg bg-bg-input border border-white/10
                                    text-text-primary placeholder:text-text-secondary/50
                                    focus:outline-none focus:border-bright-green/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                {t.interview.context}
                            </label>
                            <input
                                type="text"
                                value={contextInput}
                                onChange={(e) => setContextInput(e.target.value)}
                                placeholder={t.interview.contextPlaceholder}
                                className="w-full px-3 py-2 rounded-lg bg-bg-input border border-white/10
                                    text-text-primary placeholder:text-text-secondary/50
                                    focus:outline-none focus:border-bright-green/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Drop Zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            glass-card rounded-xl p-12 text-center cursor-pointer
                            transition-all duration-300 border-2 border-dashed
                            ${dragActive
                                ? "border-bright-green bg-bright-green/10 scale-[1.01]"
                                : "border-white/20 hover:border-white/40 hover:bg-white/5"
                            }
                        `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className={`
                                w-16 h-16 rounded-2xl flex items-center justify-center
                                transition-all duration-300
                                ${dragActive ? "bg-bright-green/20 scale-110" : "bg-white/10"}
                            `}>
                                <Upload
                                    size={28}
                                    className={`transition-colors ${dragActive ? "text-bright-green" : "text-text-secondary"}`}
                                />
                            </div>
                            <div>
                                <p className="text-text-primary font-medium text-lg">
                                    {t.interview.dropzone}
                                </p>
                                <p className="text-text-secondary text-sm mt-1">
                                    {t.interview.formatHint}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== PROCESSING ==================== */}
            {(viewState === "uploading" || viewState === "processing") && (
                <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-bright-green/10 flex items-center justify-center animate-pulse">
                                <FileAudio size={32} className="text-bright-green" />
                            </div>
                            <Loader2
                                size={56}
                                className="absolute -top-4 -left-4 text-bright-green/30 animate-spin"
                            />
                        </div>
                        <div>
                            <p className="text-text-primary font-medium text-lg">
                                {viewState === "uploading"
                                    ? t.interview.uploading
                                    : t.interview.processing
                                }
                            </p>
                            <p className="text-text-secondary text-sm mt-1">
                                {t.interview.processingHint}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== REVIEW PANEL ==================== */}
            {viewState === "review" && interview && (
                <div className="space-y-6 animate-fade-in">
                    {/* Transcript (collapsible) */}
                    <div className="glass-card rounded-xl overflow-hidden">
                        <button
                            onClick={() => setTranscriptExpanded(!transcriptExpanded)}
                            className="w-full flex items-center justify-between p-4 text-left
                                hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <h3 className="font-semibold text-text-primary flex items-center gap-2">
                                <FileAudio size={18} className="text-bright-green" />
                                {t.interview.transcript}
                            </h3>
                            {transcriptExpanded
                                ? <ChevronUp size={18} className="text-text-secondary" />
                                : <ChevronDown size={18} className="text-text-secondary" />
                            }
                        </button>
                        {transcriptExpanded && (
                            <div className="px-4 pb-4 border-t border-white/10">
                                <pre className="text-text-secondary text-sm whitespace-pre-wrap
                                    max-h-80 overflow-y-auto mt-3 leading-relaxed font-sans">
                                    {interview.transcript}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Extracted Items */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-text-primary flex items-center gap-2">
                                <Sparkles size={18} className="text-bright-green" />
                                {t.interview.extracted}
                                <span className="text-text-secondary text-sm font-normal">
                                    ({items.length})
                                </span>
                            </h3>
                            <span className="text-sm text-text-secondary">
                                {selectedCount} {t.interview.selected}
                            </span>
                        </div>

                        {/* Items grouped by type */}
                        {(["fact", "quote", "anecdote", "proof_point"] as const).map((type) => {
                            const typeItems = groupedItems[type];
                            if (!typeItems || typeItems.length === 0) return null;
                            const label = TYPE_LABELS[type];

                            return (
                                <div key={type} className="space-y-2">
                                    <h4 className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                                        <span>{label.emoji}</span>
                                        {locale === "de" ? label.de : label.en}
                                        <span className="text-text-secondary/50">({typeItems.length})</span>
                                    </h4>
                                    {typeItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`
                                                glass-card rounded-lg p-3 flex gap-3 transition-all duration-200
                                                ${item.selected ? "border-bright-green/20" : "opacity-50"}
                                            `}
                                        >
                                            {/* Checkbox */}
                                            <button
                                                onClick={() => toggleItem(item.id)}
                                                className="shrink-0 mt-0.5 cursor-pointer"
                                            >
                                                {item.selected
                                                    ? <CheckCircle2 size={20} className="text-bright-green" />
                                                    : <XCircle size={20} className="text-text-secondary/40" />
                                                }
                                            </button>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-text-primary text-sm leading-relaxed">
                                                    {item.content}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    {/* Author badge */}
                                                    {item.author && (
                                                        <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-text-secondary">
                                                            {item.author}
                                                        </span>
                                                    )}
                                                    {/* Topic tags */}
                                                    {item.topicFields.map((tf) => (
                                                        <span
                                                            key={tf}
                                                            className="text-xs px-1.5 py-0.5 rounded bg-bright-green/10 text-bright-green/80"
                                                        >
                                                            {tf}
                                                        </span>
                                                    ))}
                                                    {/* Confidence */}
                                                    <span className={`text-xs px-1.5 py-0.5 rounded border ${confidenceBg(item.confidence)} ${confidenceColor(item.confidence)}`}>
                                                        {Math.round(item.confidence * 100)}%
                                                    </span>
                                                    {/* Timestamp */}
                                                    {item.sourceTimestamp && (
                                                        <span className="text-xs text-text-secondary/50 flex items-center gap-0.5">
                                                            <Clock size={10} />
                                                            {item.sourceTimestamp}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    {/* Import Button */}
                    <div className="flex items-center justify-between glass-card rounded-xl p-4">
                        <span className="text-text-secondary text-sm">
                            {selectedCount} {t.interview.itemsSelected}
                        </span>
                        <button
                            onClick={handleImport}
                            disabled={selectedCount === 0}
                            className={`
                                flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm
                                transition-all duration-200 cursor-pointer
                                ${selectedCount > 0
                                    ? "wire-gradient text-white shadow-md hover:shadow-lg hover:scale-[1.02]"
                                    : "bg-white/10 text-text-secondary/50 cursor-not-allowed"
                                }
                            `}
                        >
                            <Import size={16} />
                            {t.interview.import}
                        </button>
                    </div>
                </div>
            )}

            {/* ==================== IMPORTING ==================== */}
            {viewState === "importing" && (
                <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
                    <Loader2 size={32} className="text-bright-green animate-spin mx-auto mb-4" />
                    <p className="text-text-primary font-medium">
                        {t.interview.importing}
                    </p>
                </div>
            )}

            {/* ==================== DONE ==================== */}
            {viewState === "done" && (
                <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-text-primary font-medium text-lg">
                                {t.interview.imported}
                            </p>
                            <p className="text-text-secondary text-sm mt-1">
                                {importedCount} {t.interview.itemsImported}
                            </p>
                        </div>

                        {/* Affected topic fields */}
                        {affectedTopics.length > 0 && (
                            <div className="mt-2 flex flex-wrap justify-center gap-2">
                                {affectedTopics.map((topic) => (
                                    <span
                                        key={topic}
                                        className="text-xs px-2 py-1 rounded-full bg-bright-green/10 text-bright-green/80 border border-bright-green/20"
                                    >
                                        {topic === "_quotes" ? t.interview.quotesLabel : topic}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => {
                                    resetToIdle();
                                    useAppStore.getState().setView("knowledge");
                                }}
                                className="px-4 py-2 rounded-lg wire-gradient text-white
                                    hover:shadow-lg transition-all cursor-pointer text-sm font-medium"
                            >
                                {t.interview.openKnowledgeBase}
                            </button>
                            <button
                                onClick={resetToIdle}
                                className="px-4 py-2 rounded-lg bg-white/10 text-text-primary
                                    hover:bg-white/15 transition-colors cursor-pointer text-sm"
                            >
                                {t.interview.newInterview}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== ERROR ==================== */}
            {viewState === "error" && (
                <div className="glass-card rounded-xl p-8 text-center animate-fade-in border border-red-500/20">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle size={24} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-text-primary font-medium">{t.common.error}</p>
                            <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
                        </div>
                        <button
                            onClick={resetToIdle}
                            className="mt-2 px-4 py-2 rounded-lg bg-white/10 text-text-primary
                                hover:bg-white/15 transition-colors cursor-pointer text-sm"
                        >
                            {t.interview.tryAgain}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
