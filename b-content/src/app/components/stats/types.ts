// ============================================================
// B/CONTENT — Stats Types
// ============================================================

export interface InstanceRatio {
    instance: string;
    label: string;
    totalPosts: number;
    fachPosts: number;
    personalPosts: number;
    ratio: string;
    isHealthy: boolean;
    nextShouldBePersonal: boolean;
}

export interface TopicCount {
    topicField: string;
    count: number;
}

export interface StatsSummary {
    totalPosts: number;
    thisMonth: number;
    oldestPost: string | null;
    newestPost: string | null;
    warnings: string[];
}

export interface TimelineWeek {
    week: string;
    weekLabel: string;
    count: number;
    instances: Record<string, number>;
}

export interface ContentTypeCount {
    instance: string;
    contentType: string;
    count: number;
}

export interface Cadence {
    avgPerWeek: number;
    thisWeek: number;
    trend: "up" | "down" | "stable";
}

export interface SchedulingHealth {
    scheduled: number;
    unscheduled: number;
    coverage: number;
}

export interface StatsResponse {
    ratios: InstanceRatio[];
    topicDistribution: TopicCount[];
    summary: StatsSummary;
    timeline: TimelineWeek[];
    contentTypeBreakdown: ContentTypeCount[];
    cadence: Cadence;
    scheduling: SchedulingHealth;
    error?: string;
}
