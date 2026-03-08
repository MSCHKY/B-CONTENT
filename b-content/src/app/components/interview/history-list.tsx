import { useTranslation } from "@/i18n";
import type { InterviewSummary } from "@/types/interview";

export function HistoryList({ history }: { history: InterviewSummary[] }) {
    const { locale } = useTranslation();

    if (history.length === 0) return null;

    return (
        <div className="mb-6 glass-card rounded-xl p-4 animate-slide-in-left">
            <h3 className="text-sm font-semibold text-text-primary mb-3">
                History
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
    );
}
