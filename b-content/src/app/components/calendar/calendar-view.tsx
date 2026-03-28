import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/i18n";
import type { CalendarPost, Conflict } from "./types";
import { MonthGrid } from "./month-grid";
import { UnscheduledSidebar } from "./unscheduled-sidebar";
import { ScheduleModal } from "./schedule-modal";

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
    const [error, setError] = useState<string | null>(null);

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

    // Schedule / Unschedule
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

    // Drag start handler (shared between grid and sidebar)
    const handleDragStart = (e: React.DragEvent, postId: string) => {
        e.dataTransfer.setData("text/plain", postId);
        e.dataTransfer.effectAllowed = "move";
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
                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="text-red-400 hover:text-red-300 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-sm"
                        aria-label={t.common.dismissError}
                        title={t.common.dismissError}
                    >✕</button>
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
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

                <div className="w-48">
                    <Select
                        options={instanceOptions}
                        value={filterInstance}
                        onChange={(e) => setFilterInstance(e.target.value)}
                    />
                </div>

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
            <MonthGrid
                currentMonth={currentMonth}
                scheduled={scheduled}
                conflicts={conflicts}
                onDragStart={handleDragStart}
                onDropOnDate={(postId, date) => handleSchedule(postId, date)}
                onPostClick={(post, date) => setScheduleModal({ post, date })}
            />

            {/* Unscheduled Posts */}
            <UnscheduledSidebar
                unscheduled={unscheduled}
                onDragStart={handleDragStart}
                onUnschedule={handleUnschedule}
            />

            {/* Schedule Modal */}
            {scheduleModal && (
                <ScheduleModal
                    post={scheduleModal.post}
                    date={scheduleModal.date}
                    onSchedule={handleSchedule}
                    onUnschedule={handleUnschedule}
                    onClose={() => setScheduleModal(null)}
                />
            )}
        </div>
    );
}
