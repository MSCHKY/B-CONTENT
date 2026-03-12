// ============================================================
// B/CONTENT — Interview Pipeline View (Z-003)
// State Machine Orchestrator
// ============================================================

import { useState, useCallback } from "react";
import { useTranslation } from "@/i18n";
import { useAppStore } from "@/stores";
import {
    Mic,
    CheckCircle2,
    Loader2,
    AlertTriangle,
    History,
} from "lucide-react";
import type { ExtractedItem, Interview, InterviewSummary } from "@/types/interview";
import type { ViewState } from "./helpers";
import { UploadPanel } from "./upload-panel";
import { ProcessingView } from "./processing-view";
import { ReviewPanel } from "./review-panel";
import { HistoryList } from "./history-list";

export function InterviewView() {
    const { t } = useTranslation();

    // --- State ---
    const [viewState, setViewState] = useState<ViewState>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [contextInput, setContextInput] = useState("");
    const [titleInput, setTitleInput] = useState("");

    // Processing result
    const [interview, setInterview] = useState<Interview | null>(null);
    const [items, setItems] = useState<ExtractedItem[]>([]);

    // History
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<InterviewSummary[]>([]);

    // Import result
    const [importedCount, setImportedCount] = useState(0);
    const [affectedTopics, setAffectedTopics] = useState<string[]>([]);

    // --- File handling ---
    const processFile = useCallback(async (file: File) => {
        if (!file.type.startsWith("audio/")) {
            setErrorMessage(t.interview.errorFormat);
            setViewState("error");
            return;
        }

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

    // --- Text handling ---
    const processText = useCallback(async (text: string) => {
        setViewState("processing");
        setErrorMessage("");

        try {
            const response = await fetch("/api/interview/process-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    title: titleInput || undefined,
                    context: contextInput || undefined,
                }),
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
    }, [contextInput, titleInput]);

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

            {/* History Panel */}
            {showHistory && <HistoryList history={history} />}

            {/* IDLE: Upload Zone */}
            {viewState === "idle" && (
                <UploadPanel
                    titleInput={titleInput}
                    setTitleInput={setTitleInput}
                    contextInput={contextInput}
                    setContextInput={setContextInput}
                    onFileSelected={processFile}
                    onTextSubmit={processText}
                />
            )}

            {/* PROCESSING */}
            {(viewState === "uploading" || viewState === "processing") && (
                <ProcessingView viewState={viewState} />
            )}

            {/* REVIEW PANEL */}
            {viewState === "review" && interview && (
                <ReviewPanel
                    interview={interview}
                    items={items}
                    selectedCount={selectedCount}
                    onToggleItem={toggleItem}
                    onImport={handleImport}
                />
            )}

            {/* IMPORTING */}
            {viewState === "importing" && (
                <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
                    <Loader2 size={32} className="text-bright-green animate-spin mx-auto mb-4" />
                    <p className="text-text-primary font-medium">
                        {t.interview.importing}
                    </p>
                </div>
            )}

            {/* DONE */}
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

            {/* ERROR */}
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
