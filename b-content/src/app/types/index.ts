// ============================================================
// B/CONTENT — Core Type Definitions
// Source: PRODUCT_SPEC.md §6 (Datenmodell)
// ============================================================

// --- Instance & Identity ---

export type InstanceId = "alex" | "ablas" | "bwg";

export interface ContentInstance {
    id: InstanceId;
    name: string;
    claim: string;
    mantelthema: string;
    oberthemen: string[]; // max 3
    tonality: TonalityProfile;
    contentTypes: ContentType[];
    topicWeights: Record<TopicFieldId, 1 | 2 | 3>;
}

export interface TonalityProfile {
    grundtemperatur: string;
    sprachstil: string;
    merkmale: string[];
    verstaerker: string[];
    vermeiden: string[];
    beispielSaetze: string[];
}

export interface ContentType {
    id: string;
    label: string;
    description: string;
    charRange: { min: number; max: number };
    frequency: string;
    promptTemplate: string;
}

// --- Knowledge Base ---

export type TopicFieldId =
    | "energie"
    | "circular"
    | "medtech"
    | "bau"
    | "alltag"
    | "luxus"
    | "sicherheit"
    | "wasser"
    | "vertikale-integration"
    | "geopolitik"
    | "image-reframe"
    | "ingredient-branding"
    | "qualitaet";

export interface TopicField {
    id: TopicFieldId;
    label: string;
    kernbotschaft: string;
    facts: Fact[];
}

export interface Fact {
    id: string;
    content: string;
    source: string;
    topicField: TopicFieldId;
}

export interface Quote {
    id: string;
    content: string;
    author: "alex" | "ablas" | "fichtel" | "pasini";
    context?: string;
}

export interface Anecdote {
    id: string;
    content: string;
    author: "alex" | "ablas";
    topicFields: TopicFieldId[];
    emotionalHook?: string;
}

// --- Content ---

export type PostLanguage = "en" | "de";
export type PostStatus = "draft" | "scheduled" | "review" | "approved" | "published";

export type ImageFormat =
    | "single-square"
    | "single-landscape"
    | "single-portrait"
    | "carousel-slide"
    | "company-banner";

export interface Post {
    id: string;
    instance: InstanceId;
    contentType: string;
    topicFields: TopicFieldId[];
    text: string;
    image?: GeneratedImage;
    language: PostLanguage;
    hashtags: string[];
    charCount: number;
    isPersonal: boolean;
    status: PostStatus;
    scheduledAt?: string | null;
    linkedPosts?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface GeneratedImage {
    id: string;
    format: ImageFormat;
    width: number;
    height: number;
    prompt: string;
    url: string;
    templateId?: string;
}

// --- LinkedIn Formats ---

export interface LinkedInFormat {
    width: number;
    height: number;
    label: string;
}

export const LINKEDIN_FORMATS: Record<ImageFormat, LinkedInFormat> = {
    "single-square": { width: 1200, height: 1200, label: "Standard Post" },
    "single-landscape": {
        width: 1200,
        height: 627,
        label: "Landscape / Link Preview",
    },
    "single-portrait": {
        width: 1080,
        height: 1350,
        label: "Portrait / Story-Style",
    },
    "carousel-slide": { width: 1080, height: 1080, label: "Karussell-Slide" },
    "company-banner": { width: 1584, height: 396, label: "Unternehmensbanner" },
};

// --- App State ---

export type AppView = "create" | "knowledge" | "library" | "orchestrate" | "stats" | "calendar" | "interview";

export interface CreateFlowState {
    step: 1 | 2 | 3 | 4;
    instance: InstanceId | null;
    contentType: string | null;
    topicField: TopicFieldId | null;
    userInput: string;
    language: PostLanguage;
    generatedText: string | null;
    generatedImageUrl: string | null;
    imageFormat: ImageFormat;
    isGenerating: boolean;
}
