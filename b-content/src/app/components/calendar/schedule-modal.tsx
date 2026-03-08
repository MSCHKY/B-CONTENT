import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import { INSTANCE_LABELS } from "@shared/constants";
import type { CalendarPost } from "./types";

interface ScheduleModalProps {
    post: CalendarPost;
    date?: string;
    onSchedule: (postId: string, date: string) => void;
    onUnschedule: (postId: string) => void;
    onClose: () => void;
}

export function ScheduleModal({
    post,
    date,
    onSchedule,
    onUnschedule,
    onClose,
}: ScheduleModalProps) {
    const { t } = useTranslation();
    const dateInputRef = useRef<HTMLInputElement>(null);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up"
            onClick={onClose}
        >
            <div
                className="glass-card rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                    {t.calendar.schedulePost}
                </h3>

                {/* Post info */}
                <div className="mb-4 p-3 rounded-lg bg-bg-primary/50">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Badge variant="accent">
                            {INSTANCE_LABELS[post.instance] ?? post.instance}
                        </Badge>
                        <Badge variant="muted">{post.content_type}</Badge>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-3">
                        {post.text.slice(0, 150)}{post.text.length > 150 ? "…" : ""}
                    </p>
                </div>

                {/* Date picker */}
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    {t.calendar.selectDate}
                </label>
                <input
                    type="date"
                    ref={dateInputRef}
                    defaultValue={date ?? post.scheduled_at ?? ""}
                    className="w-full rounded-lg border border-border-default/30 bg-bg-card px-3 py-2 text-sm text-text-primary mb-4
                               focus:outline-none focus:ring-2 focus:ring-deep-green/50"
                />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            if (dateInputRef.current?.value) {
                                onSchedule(post.id, dateInputRef.current.value);
                            }
                        }}
                    >
                        {t.calendar.schedule}
                    </Button>
                    {post.scheduled_at && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onUnschedule(post.id);
                                onClose();
                            }}
                        >
                            {t.calendar.unscheduleBtn}
                        </Button>
                    )}
                    <div className="flex-1" />
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        {t.calendar.cancel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
