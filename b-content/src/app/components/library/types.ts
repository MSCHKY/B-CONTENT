// ============================================================
// B/CONTENT — Library Types
// ============================================================

export interface PostRecord {
    id: string;
    instance: string;
    content_type: string;
    topic_fields: string[];
    text: string;
    language: string;
    hashtags: string[];
    char_count: number;
    is_personal: number;
    status: string;
    image_id: string | null;
    created_at: string;
    updated_at: string;
    image?: {
        id: string;
        format: string;
        width: number;
        height: number;
        url: string;
    };
}
