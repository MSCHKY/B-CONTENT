import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, TrendingUp, TrendingDown, Minus, Hash, CalendarCheck, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";

// --- Types matching API response ---

interface InstanceRatio {
    instance: string;
    label: string;
    totalPosts: number;
    fachPosts: number;
    personalPosts: number;
    ratio: string;
    isHealthy: boolean;
    nextShouldBePersonal: boolean;
}

interface TopicCount {
    topicField: string;
    count: number;
}

interface StatsSummary {
    totalPosts: number;
    thisMonth: number;
    oldestPost: string | null;
    newestPost: string | null;
    warnings: string[];
}

interface TimelineWeek {
    week: string;
    weekLabel: string;
    count: number;
    instances: Record<string, number>;
}

interface ContentTypeCount {
    instance: string;
    contentType: string;
    count: number;
}

interface Cadence {
    avgPerWeek: number;
    thisWeek: number;
    trend: "up" | "down" | "stable";
}

interface SchedulingHealth {
    scheduled: number;
    unscheduled: number;
    coverage: number;
}

interface StatsResponse {
    ratios: InstanceRatio[];
    topicDistribution: TopicCount[];
    summary: StatsSummary;
    timeline: TimelineWeek[];
    contentTypeBreakdown: ContentTypeCount[];
    cadence: Cadence;
    scheduling: SchedulingHealth;
    error?: string;
}

const TOPIC_LABELS: Record<string, string> = {
    energie: "Energie & Energiewende",
    circular: "Circular Economy",
    medtech: "Medizintechnik",
    bau: "Bau & Infrastruktur",
    alltag: "Alltagsprodukte & Tech",
    luxus: "Luxus & Kultur",
    sicherheit: "Sicherheit & Defence",
    wasser: "Wasser & Filtration",
    "vertikale-integration": "Vertikale Integration",
    geopolitik: "Geopolitische Resilienz",
    "image-reframe": "Image-Reframe",
    "ingredient-branding": "Ingredient Branding",
    qualitaet: "Qualität",
};

const CONTENT_TYPE_LABELS: Record<string, string> = {
    "deep-dive": "Deep Dive",
    "position": "Position",
    "frage": "Die Frage",
    "persoenlich": "Persönlich",
    "proof-point": "Proof Point",
    "wusstest-du": "Wusstest du?",
    "messe-story": "Messe/Story",
    "draht-steckt-in": "Draht steckt in…",
    "unternehmensnews": "News",
    "behind-the-scenes": "Behind the Scenes",
    "zahlen-fakten": "Zahlen & Fakten",
    "website-article": "Website-Beitrag",
};

const INSTANCE_COLORS: Record<string, string> = {
    alex: "bg-emerald-500",
    ablas: "bg-cyan-500",
    bwg: "bg-amber-500",
};

const INSTANCE_HEX: Record<string, string> = {
    alex: "#10b981",
    ablas: "#06b6d4",
    bwg: "#f59e0b",
};

const INSTANCE_BG: Record<string, string> = {
    alex: "bg-emerald-500/10 border-emerald-500/20",
    ablas: "bg-cyan-500/10 border-cyan-500/20",
    bwg: "bg-amber-500/10 border-amber-500/20",
};

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

// --- Sub-components ---

function SummaryCard({
    label,
    value,
    suffix,
    icon,
}: {
    label: string;
    value: number;
    suffix?: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="glass-card rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-text-muted mb-1">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
                {value}
                {suffix && (
                    <span className="text-sm text-text-muted font-normal">
                        {suffix}
                    </span>
                )}
            </p>
        </div>
    );
}

function RatioBar({ ratio }: { ratio: InstanceRatio }) {
    const total = ratio.fachPosts + ratio.personalPosts;
    const fachPercent = total > 0 ? (ratio.fachPosts / total) * 100 : 0;
    const personalPercent = total > 0 ? (ratio.personalPosts / total) * 100 : 0;
    const { t } = useTranslation();

    return (
        <div
            className={`rounded-lg border p-3 ${INSTANCE_BG[ratio.instance] ?? "bg-bg-card border-border-default"}`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2.5 h-2.5 rounded-full ${INSTANCE_COLORS[ratio.instance] ?? "bg-text-muted"}`}
                    />
                    <span className="text-sm font-semibold text-text-primary">
                        {ratio.label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={ratio.isHealthy ? "accent" : "warning"}
                    >
                        {ratio.ratio}
                    </Badge>
                    {ratio.nextShouldBePersonal && (
                        <Badge variant="warning">
                            <AlertTriangle size={10} /> {t.stats.nextPersonal}
                        </Badge>
                    )}
                    {total === 0 && (
                        <Badge variant="muted">{t.stats.noPostsYet}</Badge>
                    )}
                </div>
            </div>

            {total > 0 && (
                <div className="flex h-3 rounded-full overflow-hidden bg-bg-primary/50">
                    <div
                        className={`${INSTANCE_COLORS[ratio.instance] ?? "bg-text-muted"} transition-all duration-700 ease-out`}
                        style={{ width: `${fachPercent}%` }}
                        title={`${t.stats.expert}: ${ratio.fachPosts}`}
                    />
                    <div
                        className="bg-white/30 transition-all duration-700 ease-out"
                        style={{ width: `${personalPercent}%` }}
                        title={`${t.stats.personal}: ${ratio.personalPosts}`}
                    />
                </div>
            )}

            {total > 0 && (
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-text-muted">
                        {t.stats.expert}: {ratio.fachPosts}
                    </span>
                    <span className="text-[10px] text-text-muted">
                        {t.stats.personal}: {ratio.personalPosts}
                    </span>
                </div>
            )}
        </div>
    );
}

/** 12-week stacked bar chart — pure CSS */
function ActivityTimeline({ timeline }: { timeline: TimelineWeek[] }) {
    const maxCount = Math.max(...timeline.map((w) => w.count), 1);
    const { t } = useTranslation();

    if (timeline.every((w) => w.count === 0)) {
        return (
            <p className="text-sm text-text-muted text-center py-8">
                {t.stats.noPostsHint}
            </p>
        );
    }

    return (
        <div className="flex items-end gap-1.5 h-40">
            {timeline.map((week) => {
                const totalHeight = (week.count / maxCount) * 100;
                const alexH = week.count > 0 ? ((week.instances.alex ?? 0) / week.count) * totalHeight : 0;
                const ablasH = week.count > 0 ? ((week.instances.ablas ?? 0) / week.count) * totalHeight : 0;
                const bwgH = week.count > 0 ? ((week.instances.bwg ?? 0) / week.count) * totalHeight : 0;

                return (
                    <div
                        key={week.week}
                        className="flex-1 flex flex-col items-center gap-1 group"
                    >
                        {/* Stacked bar */}
                        <div
                            className="w-full rounded-t-md overflow-hidden flex flex-col-reverse transition-all duration-500 ease-out relative"
                            style={{ height: `${Math.max(totalHeight, 4)}%` }}
                            title={`${week.weekLabel}: ${week.count} posts`}
                        >
                            {alexH > 0 && (
                                <div
                                    style={{ height: `${(alexH / totalHeight) * 100}%`, backgroundColor: INSTANCE_HEX.alex }}
                                    className="w-full transition-all duration-500"
                                />
                            )}
                            {ablasH > 0 && (
                                <div
                                    style={{ height: `${(ablasH / totalHeight) * 100}%`, backgroundColor: INSTANCE_HEX.ablas }}
                                    className="w-full transition-all duration-500"
                                />
                            )}
                            {bwgH > 0 && (
                                <div
                                    style={{ height: `${(bwgH / totalHeight) * 100}%`, backgroundColor: INSTANCE_HEX.bwg }}
                                    className="w-full transition-all duration-500"
                                />
                            )}
                            {week.count === 0 && (
                                <div className="w-full h-full bg-border-default/30 rounded-t-md" />
                            )}

                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-sidebar/95 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                {week.count}
                            </div>
                        </div>

                        {/* Week label */}
                        <span className="text-[9px] text-text-muted leading-none">
                            {week.weekLabel}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/** Content-Type Breakdown — grouped horizontal bars per instance */
function ContentTypeBreakdown({ breakdown }: { breakdown: ContentTypeCount[] }) {
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
                            {INSTANCE_LABELS_MAP[instance] ?? instance}
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

const INSTANCE_LABELS_MAP: Record<string, string> = {
    alex: "Jürgen Alex",
    ablas: "Sebastian Ablas",
    bwg: "BWG Company",
};

/** Scheduling Health — SVG progress ring */
function SchedulingRing({ scheduling }: { scheduling: SchedulingHealth }) {
    const { t } = useTranslation();
    const total = scheduling.scheduled + scheduling.unscheduled;
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = total > 0 ? circumference - (scheduling.coverage / 100) * circumference : circumference;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Ring */}
            <div className="relative w-36 h-36 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="60" cy="60" r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border-default"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60" cy="60" r={radius}
                        fill="none"
                        stroke="url(#ringGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-primary">{scheduling.coverage}</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">%</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                    <span className="text-text-secondary">{t.stats.scheduledLabel}</span>
                    <span className="font-semibold text-text-primary ml-auto">{scheduling.scheduled}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-border-default" />
                    <span className="text-text-secondary">{t.stats.unscheduledLabel}</span>
                    <span className="font-semibold text-text-primary ml-auto">{scheduling.unscheduled}</span>
                </div>
            </div>
        </div>
    );
}

