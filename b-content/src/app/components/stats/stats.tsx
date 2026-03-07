import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, TrendingUp, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface StatsResponse {
    ratios: InstanceRatio[];
    topicDistribution: TopicCount[];
    summary: StatsSummary;
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

const INSTANCE_COLORS: Record<string, string> = {
    alex: "bg-emerald-500",
    ablas: "bg-cyan-500",
    bwg: "bg-amber-500",
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
                setError(
                    "Failed to load stats. Make sure the Worker is running.",
                );
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
                    Loading Stats...
                </span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 animate-fade-in-up flex items-center gap-2">
                <AlertTriangle size={16} />
                {error ?? "No data available"}
            </div>
        );
    }

    const maxTopicCount = Math.max(
        ...data.topicDistribution.map((t) => t.count),
        1,
    );

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
                    Content Stats
                </h2>
            </div>
            <hr className="gradient-line mb-3" />
            <p className="text-sm text-text-muted mb-6">
                Track posting ratios, topic distribution, and content health
                across all instances.
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
                            Attention Required
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

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 stagger-children">
                <SummaryCard
                    label="Total Posts"
                    value={data.summary.totalPosts}
                    icon={<BarChart3 size={16} />}
                />
                <SummaryCard
                    label="This Month"
                    value={data.summary.thisMonth}
                    icon={<TrendingUp size={16} />}
                />
                <SummaryCard
                    label="Topics Used"
                    value={data.topicDistribution.length}
                    icon={<Hash size={16} />}
                />
                <SummaryCard
                    label="Instances"
                    value={data.ratios.filter((r) => r.totalPosts > 0).length}
                    suffix={`/ ${data.ratios.length}`}
                    icon={<BarChart3 size={16} />}
                />
            </div>

            {/* 4:1 Ratio Section */}
            <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-crisp-cyan" />
                    4:1 Ratio Tracker
                </h3>
                <p className="text-xs text-text-muted mb-4">
                    Rule: 4 expert posts, then 1 personal post per instance.
                </p>

                <div className="space-y-4">
                    {data.ratios.map((ratio) => (
                        <RatioBar key={ratio.instance} ratio={ratio} />
                    ))}
                </div>
            </div>

            {/* Topic Distribution */}
            <div className="glass-card rounded-xl p-5 animate-fade-in-up">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Hash size={18} className="text-crisp-cyan" />
                    Topic Distribution
                </h3>

                {data.topicDistribution.length === 0 ? (
                    <p className="text-sm text-text-muted text-center py-8">
                        No posts yet — generate content in the Create or
                        Orchestrate view.
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
                            <AlertTriangle size={10} /> Next: Personal
                        </Badge>
                    )}
                    {total === 0 && (
                        <Badge variant="muted">No posts yet</Badge>
                    )}
                </div>
            </div>

            {total > 0 && (
                <div className="flex h-3 rounded-full overflow-hidden bg-bg-primary/50">
                    <div
                        className={`${INSTANCE_COLORS[ratio.instance] ?? "bg-text-muted"} transition-all duration-700 ease-out`}
                        style={{ width: `${fachPercent}%` }}
                        title={`Expert: ${ratio.fachPosts}`}
                    />
                    <div
                        className="bg-white/30 transition-all duration-700 ease-out"
                        style={{ width: `${personalPercent}%` }}
                        title={`Personal: ${ratio.personalPosts}`}
                    />
                </div>
            )}

            {total > 0 && (
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-text-muted">
                        Expert: {ratio.fachPosts}
                    </span>
                    <span className="text-[10px] text-text-muted">
                        Personal: {ratio.personalPosts}
                    </span>
                </div>
            )}
        </div>
    );
}
