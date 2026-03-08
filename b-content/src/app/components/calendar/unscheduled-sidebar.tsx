import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, GripVertical } from "lucide-react";
import { useTranslation } from "@/i18n";
import { INSTANCE_LABELS, STATUS_VARIANTS } from "@shared/constants";
import type { CalendarPost } from "./types";
import { INSTANCE_COLORS } from "./types";

interface UnscheduledSidebarProps {
    unscheduled: CalendarPost[];
    onDragStart: (e: React.DragEvent, postId: string) => void;
    onUnschedule: (postId: string) => void;
}

export function UnscheduledSidebar({
    unscheduled,
    onDragStart,
    onUnschedule,
}: UnscheduledSidebarProps) {
    const { t } = useTranslation();
    const [dragOverUnscheduled, setDragOverUnscheduled] = useState(false);

    return (
        <div
            className={`mb-8 rounded-xl p-4 transition-all duration-200 ${dragOverUnscheduled
                ? "bg-crisp-cyan/10 ring-2 ring-crisp-cyan/30 ring-dashed"
                : ""
                }`}
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverUnscheduled(true);
            }}
            onDragLeave={() => setDragOverUnscheduled(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragOverUnscheduled(false);
                const postId = e.dataTransfer.getData("text/plain");
                if (postId) {
                    onUnschedule(postId);
                }
            }}
        >
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <CalendarClock size={16} className="text-text-muted" />
                {t.calendar.unscheduled} ({unscheduled.length})
            </h3>
            {unscheduled.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {unscheduled.map((post) => (
                        <div
                            key={post.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, post.id)}
                            className={`
                                glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing
                                border-l-3 ${INSTANCE_COLORS[post.instance] ?? "border-l-text-muted"}
                                hover-lift transition-all duration-200
                            `}
                        >
                            <div className="flex items-start gap-2">
                                <GripVertical size={14} className="text-text-muted/40 shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <Badge variant={STATUS_VARIANTS[post.status] ?? "muted"}>
                                            {post.status}
                                        </Badge>
                                        <Badge variant="accent">
                                            {INSTANCE_LABELS[post.instance] ?? post.instance}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-text-secondary line-clamp-2">
                                        {post.text.slice(0, 100)}{post.text.length > 100 ? "…" : ""}
                                    </p>
                                    <p className="text-[10px] text-text-muted mt-1">
                                        {post.content_type} · {post.char_count} {t.calendar.charsSuffix}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-text-muted italic">
                    {dragOverUnscheduled
                        ? t.calendar.dropToUnschedule
                        : t.calendar.allScheduled
                    }
                </p>
            )}
        </div>
    );
}
