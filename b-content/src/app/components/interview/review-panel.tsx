import { useState } from "react";
import {
    FileAudio,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronUp,
    Import,
    Clock,
    Sparkles,
} from "lucide-react";
import { useTranslation } from "@/i18n";
import type { ExtractedItem, Interview } from "@/types/interview";
import { confidenceColor, confidenceBg, TYPE_LABELS } from "./helpers";

interface ReviewPanelProps {
    interview: Interview;
    items: ExtractedItem[];
    selectedCount: number;
    onToggleItem: (id: string) => void;
    onImport: () => void;
}

export function ReviewPanel({
    interview,
    items,
    selectedCount,
    onToggleItem,
    onImport,
}: ReviewPanelProps) {
    const { t, locale } = useTranslation();
    const [transcriptExpanded, setTranscriptExpanded] = useState(false);

    const groupedItems = items.reduce(
        (acc, item) => {
            if (!acc[item.type]) acc[item.type] = [];
            acc[item.type]!.push(item);
            return acc;
        },
        {} as Record<string, ExtractedItem[]>,
    );

    return (
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
                                        onClick={() => onToggleItem(item.id)}
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
                    onClick={onImport}
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
    );
}
