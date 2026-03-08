import type { ContentTypeCount } from "./types";
import { INSTANCE_COLORS_DOT, INSTANCE_LABELS, CONTENT_TYPE_LABELS } from "@shared/constants";

const INSTANCE_COLORS = INSTANCE_COLORS_DOT;

/** Content-Type Breakdown — grouped horizontal bars per instance */
export function ContentTypeBreakdown({ breakdown }: { breakdown: ContentTypeCount[] }) {
    // Group by instance
    const grouped = new Map<string, ContentTypeCount[]>();
    for (const item of breakdown) {
        const existing = grouped.get(item.instance) ?? [];
        existing.push(item);
        grouped.set(item.instance, existing);
    }

    const maxCount = Math.max(...breakdown.map((b) => b.count), 1);

    return (
        <div className="space-y-5">
            {Array.from(grouped.entries()).map(([instance, items]) => (
                <div key={instance}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${INSTANCE_COLORS[instance] ?? "bg-text-muted"}`} />
                        <span className="text-sm font-medium text-text-primary">
                            {INSTANCE_LABELS[instance] ?? instance}
                        </span>
                    </div>
                    <div className="space-y-1.5 pl-4">
                        {items.map((item) => (
                            <div key={`${instance}-${item.contentType}`} className="flex items-center gap-2">
                                <span className="text-xs text-text-muted w-32 truncate shrink-0">
                                    {CONTENT_TYPE_LABELS[item.contentType] ?? item.contentType}
                                </span>
                                <div className="flex-1 h-4 bg-bg-card-hover rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${INSTANCE_COLORS[instance] ?? "bg-text-muted"}`}
                                        style={{ width: `${Math.max((item.count / maxCount) * 100, 6)}%` }}
                                    />
                                </div>
                                <span className="text-xs font-semibold text-text-secondary w-6 text-right">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
