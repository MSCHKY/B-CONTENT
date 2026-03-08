import { INSTANCE_COLORS_BORDER } from "@shared/constants";

// --- Types ---

export interface CalendarPost {
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

export interface Conflict {
    postA: string;
    postB: string;
    instance: string;
    dateA: string;
    dateB: string;
    daysBetween: number;
}

// --- Constants ---
export const INSTANCE_COLORS = INSTANCE_COLORS_BORDER;

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const WEEKDAY_LABELS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// --- Helpers ---

export function formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
