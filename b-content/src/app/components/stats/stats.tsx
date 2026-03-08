import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, TrendingUp, TrendingDown, Minus, Hash, CalendarCheck, Activity } from "lucide-react";
import { useTranslation } from "@/i18n";
import { TOPIC_LABELS } from "@shared/constants";
import type { StatsResponse } from "./types";
import { SummaryCard } from "./summary-card";
import { RatioBar } from "./ratio-bar";
import { ActivityTimeline } from "./activity-timeline";
import { ContentTypeBreakdown } from "./content-type-breakdown";
import { SchedulingRing } from "./scheduling-ring";

export function Stats() {
    const [data, setData] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/stats");
                const json = (await response.json()) as StatsResponse;
                if (json.error) {
                    setError(json.error);
                } else {
                    setData(json);
                }
            } catch {
                setError(t.common.error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div
                    className="w-8 h-8 border-2 border-crisp-cyan/30 border-t-crisp-cyan rounded-full"
                    style={{ animation: "gentleSpin 0.8s linear infinite" }}
                />
                <span className="text-text-muted text-sm">
                    {t.common.loading}
                </span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 animate-fade-in-up flex items-center gap-2">
                <AlertTriangle size={16} />
                {error ?? t.common.noData}
            </div>
        );
    }

    const maxTopicCount = Math.max(
        ...data.topicDistribution.map((tc) => tc.count),
        1,
    );

    const TrendIcon = data.cadence.trend === "up" ? TrendingUp : data.cadence.trend === "down" ? TrendingDown : Minus;
    const trendLabel = data.cadence.trend === "up" ? t.stats.trendUp : data.cadence.trend === "down" ? t.stats.trendDown : t.stats.trendStable;
    const trendColor = data.cadence.trend === "up" ? "text-emerald-400" : data.cadence.trend === "down" ? "text-amber-400" : "text-text-muted";

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <BarChart3
                    className="text-crisp-cyan"
                    size={24}
                    strokeWidth={2}
                />
                <h2 className="text-xl font-semibold text-text-primary section-header">
                    {t.stats.title}
                </h2>
            </div>
            <hr className="gradient-line mb-3" />
            <p className="text-sm text-text-muted mb-6">
                {t.stats.subtitle}
            </p>

            {/* Warnings */}
            {data.summary.warnings.length > 0 && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 mb-6 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle
                            size={16}
                            className="text-amber-400"
                        />
                        <span className="text-sm font-semibold text-amber-400">
                            {t.stats.attentionRequired}
                        </span>
                    </div>
                    <ul className="space-y-1">
                        {data.summary.warnings.map((w, i) => (
                            <li
                                key={i}
                                className="text-sm text-amber-300/80 pl-6"
                            >
                                • {w}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Summary Cards — expanded to 6 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 stagger-children">
                <SummaryCard
                    label={t.stats.totalPosts}
                    value={data.summary.totalPosts}
                    icon={<BarChart3 size={16} />}
                />
                <SummaryCard
                    label={t.stats.thisMonth}
                    value={data.summary.thisMonth}
                    icon={<TrendingUp size={16} />}
                />
                <SummaryCard
                    label={t.stats.topicsUsed}
                    value={data.topicDistribution.length}
                    icon={<Hash size={16} />}
                />
                <SummaryCard
                    label={t.stats.avgPerWeek}
                    value={data.cadence.avgPerWeek}
                    icon={<Activity size={16} />}
                />
                <SummaryCard
                    label={t.stats.thisWeekLabel}
                    value={data.cadence.thisWeek}
                    icon={<TrendIcon size={16} className={trendColor} />}
                    suffix={` ${trendLabel}`}
                />
                <SummaryCard
                    label={t.stats.coverage}
                    value={data.scheduling.coverage}
                    suffix="%"
                    icon={<CalendarCheck size={16} />}
                />
            </div>

            {/* 4:1 Ratio Section */}
            <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-crisp-cyan" />
                    {t.stats.ratioTracker}
                </h3>
                <p className="text-xs text-text-muted mb-4">
                    {t.stats.ratioRule}
                </p>

                <div className="space-y-4">
                    {data.ratios.map((ratio) => (
                        <RatioBar key={ratio.instance} ratio={ratio} />
                    ))}
                </div>
            </div>

            {/* Activity Timeline — 12-week stacked bar chart */}
            <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-crisp-cyan" />
                    {t.stats.activityTimeline}
                </h3>
                <ActivityTimeline timeline={data.timeline} />
            </div>

            {/* Content-Type Breakdown */}
            {data.contentTypeBreakdown.length > 0 && (
                <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in-up">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <BarChart3 size={18} className="text-crisp-cyan" />
                        {t.stats.contentTypes}
                    </h3>
                    <ContentTypeBreakdown breakdown={data.contentTypeBreakdown} />
                </div>
            )}

            {/* Scheduling Health */}
            <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <CalendarCheck size={18} className="text-crisp-cyan" />
                    {t.stats.schedulingHealth}
                </h3>
                <SchedulingRing scheduling={data.scheduling} />
            </div>

            {/* Topic Distribution */}
            <div className="glass-card rounded-xl p-5 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Hash size={18} className="text-crisp-cyan" />
                    {t.stats.topicDistribution}
                </h3>

                {data.topicDistribution.length === 0 ? (
                    <p className="text-sm text-text-muted text-center py-8">
                        {t.stats.noPostsHint}
                    </p>
                ) : (
                    <div className="space-y-3">
                        {data.topicDistribution.map((topic) => (
                            <div
                                key={topic.topicField}
                                className="flex items-center gap-3"
                            >
                                <span className="text-sm text-text-secondary w-44 truncate shrink-0">
                                    {TOPIC_LABELS[topic.topicField] ??
                                        topic.topicField}
                                </span>
                                <div className="flex-1 h-6 bg-bg-card-hover rounded-full overflow-hidden">
                                    <div
                                        className="h-full wire-gradient rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                                        style={{
                                            width: `${Math.max((topic.count / maxTopicCount) * 100, 8)}%`,
                                        }}
                                    >
                                        <span className="text-[10px] font-bold text-white">
                                            {topic.count}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
