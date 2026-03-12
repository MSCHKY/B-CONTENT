import { useMemo } from "react";
import { AlertTriangle, GripVertical } from "lucide-react";
import { useTranslation } from "@/i18n";
import { INSTANCE_LABELS } from "@shared/constants";
import type { CalendarPost, Conflict } from "./types";
import { INSTANCE_COLORS, formatDate } from "./types";

interface MonthGridProps {
    currentMonth: string;
    scheduled: CalendarPost[];
    conflicts: Conflict[];
    onDragStart: (e: React.DragEvent, postId: string) => void;
    onDropOnDate: (postId: string, date: string) => void;
    onPostClick: (post: CalendarPost, date: string) => void;
}

export function MonthGrid({
    currentMonth,
    scheduled,
    conflicts,
    onDragStart,
    onDropOnDate,
    onPostClick,
}: MonthGridProps) {
    const { locale } = useTranslation();

    const WEEKDAY_LABELS = locale === "de"
        ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Build calendar grid
    const calendarDays = (() => {
        const [y, m] = currentMonth.split("-").map(Number);
        const firstDay = new Date(y!, m! - 1, 1);
        const lastDay = new Date(y!, m!, 0);
        const daysInMonth = lastDay.getDate();

        let startDow = firstDay.getDay() - 1;
        if (startDow < 0) startDow = 6;

        const days: Array<{ date: string; day: number; isCurrentMonth: boolean }> = [];

        for (let i = startDow - 1; i >= 0; i--) {
            const d = new Date(y!, m! - 1, -i);
            days.push({ date: formatDate(d), day: d.getDate(), isCurrentMonth: false });
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(y!, m! - 1, d);
            days.push({ date: formatDate(date), day: d, isCurrentMonth: true });
        }

        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            const date = new Date(y!, m!, d);
            days.push({ date: formatDate(date), day: d, isCurrentMonth: false });
        }

        return days;
    })();

    // ⚡ Bolt: Pre-calculate map of posts by date to avoid O(N*D) filtering loop
    // Expected Impact: Reduces filtering complexity from O(N*42) to O(N+42), improving calendar render time with many posts.
    const postsByDate = useMemo(() => {
        const map = new Map<string, CalendarPost[]>();
        for (const post of scheduled) {
            if (!post.scheduled_at) continue;
            const existing = map.get(post.scheduled_at) || [];
            existing.push(post);
            map.set(post.scheduled_at, existing);
        }
        return map;
    }, [scheduled]);

    // ⚡ Bolt: Pre-calculate set of conflict dates to avoid O(N*D) some() lookups
    const conflictDates = useMemo(() => {
        const set = new Set<string>();
        for (const c of conflicts) {
            set.add(c.dateA);
            set.add(c.dateB);
        }
        return set;
    }, [conflicts]);

    const getPostsForDate = (dateStr: string) => postsByDate.get(dateStr) || [];
    const hasConflict = (dateStr: string) => conflictDates.has(dateStr);

    const today = formatDate(new Date());

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, date: string) => {
        e.preventDefault();
        const postId = e.dataTransfer.getData("text/plain");
        if (postId) onDropOnDate(postId, date);
    };

    return (
        <div className="glass-card rounded-xl overflow-hidden mb-8">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-border-default/30">
                {WEEKDAY_LABELS.map((day) => (
                    <div
                        key={day}
                        className="py-2 text-center text-xs font-semibold text-text-muted uppercase tracking-wider"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
                {calendarDays.map((day) => {
                    const dayPosts = getPostsForDate(day.date);
                    const isToday = day.date === today;
                    const isConflict = hasConflict(day.date);

                    return (
                        <div
                            key={day.date}
                            className={`
                                min-h-[100px] p-1.5 border-b border-r border-border-default/15
                                transition-colors duration-150
                                ${day.isCurrentMonth ? "bg-transparent" : "bg-bg-primary/30"}
                                ${isConflict ? "bg-warning/5" : ""}
                                hover:bg-bg-card-hover/30
                            `}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, day.date)}
                        >
                            {/* Day number */}
                            <div className="flex items-center justify-between mb-1">
                                <span
                                    className={`
                                        text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                                        ${isToday
                                            ? "bg-deep-green text-white"
                                            : day.isCurrentMonth
                                                ? "text-text-secondary"
                                                : "text-text-muted/40"
                                        }
                                    `}
                                >
                                    {day.day}
                                </span>
                                {isConflict && (
                                    <AlertTriangle size={12} className="text-warning" />
                                )}
                            </div>

                            {/* Posts in this day */}
                            <div className="space-y-1">
                                {dayPosts.map((post) => (
                                    <div
                                        key={post.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, post.id)}
                                        onClick={() => onPostClick(post, day.date)}
                                        className={`
                                            group flex items-start gap-1 p-1 rounded
                                            border-l-2 ${INSTANCE_COLORS[post.instance] ?? "border-l-text-muted"}
                                            bg-bg-card/60 hover:bg-bg-card cursor-grab active:cursor-grabbing
                                            transition-all duration-150 hover:shadow-sm
                                            text-[10px] leading-tight
                                        `}
                                    >
                                        <GripVertical size={10} className="text-text-muted/40 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-text-primary truncate">
                                                {INSTANCE_LABELS[post.instance] ?? post.instance}
                                            </div>
                                            <div className="text-text-muted truncate">
                                                {post.content_type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
