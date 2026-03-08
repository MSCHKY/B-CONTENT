import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, AlertTriangle, CalendarClock, GripVertical } from "lucide-react";
import { useTranslation } from "@/i18n";

// --- Types ---

interface CalendarPost {
    id: string;
    instance: string;
    content_type: string;
    text: string;
    language: string;
    char_count: number;
    status: string;
    scheduled_at: string | null;
    created_at: string;
    image_url: string | null;
    topic_fields: string[];
}

interface Conflict {
    postA: string;
    postB: string;
    instance: string;
    dateA: string;
    dateB: string;
    daysBetween: number;
}

// --- Constants ---

const INSTANCE_COLORS: Record<string, string> = {
    alex: "border-l-deep-green",
    ablas: "border-l-crisp-cyan",
    bwg: "border-l-bright-green",
};

const INSTANCE_LABELS: Record<string, string> = {
    alex: "Jürgen Alex",
    ablas: "Sebastian Ablas",
    bwg: "BWG",
};

const STATUS_VARIANTS: Record<string, "default" | "accent" | "warning" | "muted" | "success"> = {
    draft: "muted",
    scheduled: "accent",
    review: "warning",
    approved: "success",
    published: "default",
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_LABELS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// --- Component ---

export function CalendarView() {
    const { t, locale } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [scheduled, setScheduled] = useState<CalendarPost[]>([]);
    const [unscheduled, setUnscheduled] = useState<CalendarPost[]>([]);
    const [conflicts, setConflicts] = useState<Conflict[]>([]);
    const [filterInstance, setFilterInstance] = useState("");
    const [loading, setLoading] = useState(true);
    const [scheduleModal, setScheduleModal] = useState<{ post: CalendarPost; date?: string } | null>(null);
    const [dragOverUnscheduled, setDragOverUnscheduled] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);

    const weekdays = locale === "de" ? WEEKDAY_LABELS_DE : WEEKDAY_LABELS;

    const instanceOptions = [
        { value: "", label: t.calendar.allInstances },
        { value: "alex", label: "Jürgen Alex" },
        { value: "ablas", label: "Sebastian Ablas" },
        { value: "bwg", label: "BWG Company" },
    ];

    // Fetch calendar data
    const fetchCalendar = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ month: currentMonth });
            if (filterInstance) params.set("instance", filterInstance);

            const [calRes, confRes] = await Promise.all([
                fetch(`/api/calendar?${params}`),
                fetch(`/api/calendar/conflicts?${params}`),
            ]);

            const calData = await calRes.json() as {
                scheduled: CalendarPost[];
                unscheduled: CalendarPost[];
            };
            const confData = await confRes.json() as {
                conflicts: Conflict[];
            };

            setScheduled(calData.scheduled ?? []);
            setUnscheduled(calData.unscheduled ?? []);
            setConflicts(confData.conflicts ?? []);
        } catch (err) {
            console.error("[fetchCalendar]", err);
            setError(t.common.actionFailed);
        } finally {
            setLoading(false);
        }
    }, [currentMonth, filterInstance]);

    useEffect(() => {
        fetchCalendar();
    }, [fetchCalendar]);

    // Month navigation
    const navigateMonth = (delta: number) => {
        const [y, m] = currentMonth.split("-").map(Number);
        const date = new Date(y!, m! - 1 + delta, 1);
        setCurrentMonth(
            `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        );
    };

    const monthLabel = (() => {
        const [y, m] = currentMonth.split("-").map(Number);
        const date = new Date(y!, m! - 1, 1);
        return date.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
            month: "long",
            year: "numeric",
        });
    })();

    // Build calendar grid
    const calendarDays = (() => {
        const [y, m] = currentMonth.split("-").map(Number);
        const firstDay = new Date(y!, m! - 1, 1);
        const lastDay = new Date(y!, m!, 0);
        const daysInMonth = lastDay.getDate();

        // Monday = 0, Sunday = 6
        let startDow = firstDay.getDay() - 1;
        if (startDow < 0) startDow = 6;

        const days: Array<{ date: string; day: number; isCurrentMonth: boolean }> = [];

        // Previous month padding
        for (let i = startDow - 1; i >= 0; i--) {
            const d = new Date(y!, m! - 1, -i);
            days.push({
                date: formatDate(d),
                day: d.getDate(),
                isCurrentMonth: false,
            });
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(y!, m! - 1, d);
            days.push({
                date: formatDate(date),
                day: d,
                isCurrentMonth: true,
            });
        }

        // Next month padding to fill 6 rows
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            const date = new Date(y!, m!, d);
            days.push({
                date: formatDate(date),
                day: d,
                isCurrentMonth: false,
            });
        }

        return days;
    })();

    // Get posts for a specific date
    const getPostsForDate = (dateStr: string) =>
        scheduled.filter((p) => p.scheduled_at === dateStr);

    // Check if a date has a conflict
    const hasConflict = (dateStr: string) =>
        conflicts.some((c) => c.dateA === dateStr || c.dateB === dateStr);

    // Today
    const today = formatDate(new Date());

    // Schedule a post
    const handleSchedule = async (postId: string, date: string) => {
        try {
            await fetch(`/api/calendar/${postId}/schedule`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scheduledAt: date }),
            });
            setScheduleModal(null);
            fetchCalendar();
        } catch (err) {
            console.error("[handleSchedule]", err);
            setError(t.common.actionFailed);
        }
    };

    // Unschedule a post
    const handleUnschedule = async (postId: string) => {
        try {
            await fetch(`/api/calendar/${postId}/schedule`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scheduledAt: null }),
            });
            fetchCalendar();
        } catch (err) {
            console.error("[handleUnschedule]", err);
            setError(t.common.actionFailed);
        }
    };

    // Drag & Drop handlers
    const handleDragStart = (e: React.DragEvent, postId: string) => {
        e.dataTransfer.setData("text/plain", postId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, date: string) => {
        e.preventDefault();
        const postId = e.dataTransfer.getData("text/plain");
        if (postId) {
            handleSchedule(postId, date);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div
                    className="w-8 h-8 border-2 border-crisp-cyan/30 border-t-crisp-cyan rounded-full"
                    style={{ animation: "gentleSpin 0.8s linear infinite" }}
                />
                <span className="text-text-muted text-sm">{t.common.loading}</span>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary section-header">
                        {t.calendar.title}
                    </h2>
                </div>
            </div>
            <hr className="gradient-line mb-3" />
            <p className="text-sm text-text-muted mb-6">
                {t.calendar.subtitle}
            </p>

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 mb-6 text-sm text-red-400 animate-fade-in-up flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-2">✕</button>
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                {/* Month navigation */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                        <ChevronLeft size={16} />
                    </Button>
                    <span className="text-text-primary font-semibold min-w-[160px] text-center">
                        {monthLabel}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                        <ChevronRight size={16} />
                    </Button>
                </div>

                {/* Instance filter */}
                <div className="w-48">
                    <Select
                        options={instanceOptions}
                        value={filterInstance}
                        onChange={(e) => setFilterInstance(e.target.value)}
                    />
                </div>

                {/* Conflict indicator */}
                {conflicts.length > 0 && (
                    <div className="flex items-center gap-1.5 text-warning text-sm animate-fade-in-up">
                        <AlertTriangle size={14} />
                        <span>
                            {conflicts.length} {t.calendar.conflicts}
                        </span>
                    </div>
                )}
            </div>

            {/* Calendar Grid */}
            <div className="glass-card rounded-xl overflow-hidden mb-8">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 border-b border-border-default/30">
                    {weekdays.map((day) => (
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
                                            onDragStart={(e) => handleDragStart(e, post.id)}
                                            onClick={() => setScheduleModal({ post, date: day.date })}
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

            {/* Unscheduled Posts (Drag Source + Drop Target to unschedule) */}
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
                        handleUnschedule(postId);
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
                                onDragStart={(e) => handleDragStart(e, post.id)}
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
                                            {post.content_type} · {post.char_count} {locale === "de" ? "Zeichen" : "chars"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-text-muted italic">
                        {dragOverUnscheduled
                            ? (locale === "de" ? "Hier ablegen zum Entplanen" : "Drop here to unschedule")
                            : (locale === "de" ? "Alle Beiträge sind geplant" : "All posts are scheduled")
                        }
                    </p>
                )}
            </div>

            {/* Schedule Modal */}
            {scheduleModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up"
                    onClick={() => setScheduleModal(null)}
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
                                    {INSTANCE_LABELS[scheduleModal.post.instance] ?? scheduleModal.post.instance}
                                </Badge>
                                <Badge variant="muted">{scheduleModal.post.content_type}</Badge>
                            </div>
                            <p className="text-sm text-text-secondary line-clamp-3">
                                {scheduleModal.post.text.slice(0, 150)}{scheduleModal.post.text.length > 150 ? "…" : ""}
                            </p>
                        </div>

                        {/* Date picker */}
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                            {t.calendar.selectDate}
                        </label>
                        <input
                            type="date"
                            ref={dateInputRef}
                            defaultValue={scheduleModal.date ?? scheduleModal.post.scheduled_at ?? ""}
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
                                        handleSchedule(scheduleModal.post.id, dateInputRef.current.value);
                                    }
                                }}
                            >
                                {t.calendar.schedule}
                            </Button>
                            {scheduleModal.post.scheduled_at && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        handleUnschedule(scheduleModal.post.id);
                                        setScheduleModal(null);
                                    }}
                                >
                                    {t.calendar.unscheduleBtn}
                                </Button>
                            )}
                            <div className="flex-1" />
                            <Button variant="ghost" size="sm" onClick={() => setScheduleModal(null)}>
                                {t.calendar.cancel}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Helpers ---

function formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
