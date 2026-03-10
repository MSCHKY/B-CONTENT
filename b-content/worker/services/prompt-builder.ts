// ============================================================
// B/CONTENT — Prompt Builder Service
// Assembles AI prompts from Instance + ContentType + KB Context
// ============================================================

import systemPrompts from "../../src/data/prompts/system-prompts.json";
import topicFields from "../../src/data/topics/topic-fields.json";
import quotesData from "../../src/data/quotes/quotes.json";
import instancesData from "../../src/data/instances/instances.json";
import { PROMPT_FORMAT } from "./prompt-config";

// --- Types ---

type InstanceId = "alex" | "ablas" | "bwg";
type TopicFieldId = string;

interface TopicFieldData {
    id: string;
    label: string;
    kernbotschaft: string;
    facts: string[];
    keywords: string[];
    instances: Record<string, number>;
}

interface QuoteData {
    id: string;
    content: string;
    topics: string[];
    emotion: string;
    context?: string;
}

interface QuoteGroup {
    author: string;
    name: string;
    quotes: QuoteData[];
}

interface InstanceData {
    id: string;
    name: string;
    role: string;
    mantelthema: string;
    claim: string;
    oberthemen: { label: string; leitgedanke: string }[];
    content_types: {
        id: string;
        label: string;
        beschreibung: string;
        char_range: { min: number; max: number };
        frequenz: string;
        hinweis?: string;
    }[];
}

/**
 * Parameters for building a text generation prompt.
 */
export interface BuildPromptParams {
    /** The ID of the instance generating the text */
    instance: InstanceId;
    /** The content type ID */
    contentType: string;
    /** The primary topic field ID */
    topicField: TopicFieldId;
    /** The user's creative input */
    userInput: string;
    /** The language of the post ("en" or "de") */
    language: "en" | "de";
}

/**
 * Output structure of the prompt builder.
 */
export interface BuiltPrompt {
    /** The system instruction component */
    system: string;
    /** The user prompt component */
    user: string;
}

// --- Knowledge Base Helpers ---

function getTopicContext(topicFieldId: string): string {
    const topics = topicFields as TopicFieldData[];
    const topic = topics.find((t) => t.id === topicFieldId);
    if (!topic) return "";

    const lines: string[] = [
        `TOPIC: ${topic.label}`,
        `Core message: ${topic.kernbotschaft}`,
        "",
        "KEY FACTS:",
        ...topic.facts.map((f) => `• ${f}`),
    ];

    if (topic.keywords.length > 0) {
        lines.push("", `KEYWORDS: ${topic.keywords.join(", ")}`);
    }

    return lines.join("\n");
}

function getRelevantQuotes(
    instanceId: InstanceId,
    topicFieldId: string,
): string {
    const groups = quotesData as QuoteGroup[];
    const relevantQuotes: QuoteData[] = [];

    // Get quotes from the instance author
    const instanceGroup = groups.find((g) => g.author === instanceId);
    if (instanceGroup) {
        const topicQuotes = instanceGroup.quotes.filter(
            (q) =>
                q.topics.length === 0 || q.topics.includes(topicFieldId),
        );
        relevantQuotes.push(...topicQuotes.slice(0, 3)); // max 3
    }

    // Also get general/company quotes for the topic
    const generalGroup = groups.find((g) => g.author === "general");
    if (generalGroup) {
        const generalTopicQuotes = generalGroup.quotes.filter((q) =>
            q.topics.includes(topicFieldId),
        );
        relevantQuotes.push(...generalTopicQuotes.slice(0, 2)); // max 2
    }

    if (relevantQuotes.length === 0) return "";

    const lines = [
        "RELEVANT ORIGINAL QUOTES (use for inspiration, tone calibration, or direct embedding):",
        ...relevantQuotes.map(
            (q) =>
                `• "${q.content}"${q.context ? ` (Context: ${q.context})` : ""}`,
        ),
    ];

    return lines.join("\n");
}

function getContentTypeInfo(
    instanceId: InstanceId,
    contentTypeId: string,
): string {
    const instances = instancesData as Record<string, InstanceData>;
    const instance = instances[instanceId];
    if (!instance) return "";

    const ct = instance.content_types.find((t) => t.id === contentTypeId);
    if (!ct) return "";

    const lines = [
        `CONTENT FORMAT: ${ct.label}`,
        `Description: ${ct.beschreibung}`,
        `Character range: ${ct.char_range.min}–${ct.char_range.max}`,
        `Frequency: ${ct.frequenz}`,
    ];

    if (ct.hinweis) {
        lines.push(`Note: ${ct.hinweis}`);
    }

    return lines.join("\n");
}

// --- Main Builder ---

/**
 * Builds a prompt for generating text content based on given parameters.
 *
 * @param {BuildPromptParams} params - The parameters for building the text prompt.
 * @returns {BuiltPrompt} The constructed system and user prompt strings.
 * @example
 * const prompt = buildTextPrompt({
 *   instance: "alex",
 *   contentType: "post",
 *   topicField: "sustainability",
 *   userInput: "Talk about our new green energy initiative.",
 *   language: "en"
 * });
 * console.log(prompt.system);
 */
export function buildTextPrompt(params: BuildPromptParams): BuiltPrompt {
    const { instance, contentType, topicField, userInput, language } = params;

    // Gather prompt components
    const baseRules = systemPrompts.base;
    const instancePrompt =
        systemPrompts.instances[instance as keyof typeof systemPrompts.instances] ?? "";
    const ctPrompt =
        systemPrompts.contentTypes[contentType as keyof typeof systemPrompts.contentTypes] ?? "";
    const ctInfo = getContentTypeInfo(instance, contentType);
    const langInstruction =
        language === "de"
            ? "Write the post in GERMAN (Deutsch)."
            : "Write the post in ENGLISH.";

    // Extract charRange for constraint
    const rangeMatch = ctInfo.match(/Character range: (\d+)–(\d+)/);
    const charConstraint = rangeMatch
        ? `Your output MUST be between ${rangeMatch[1]} and ${rangeMatch[2]} characters (including spaces and hashtags). Count carefully.`
        : "";

    // Build system prompt based on PROMPT_FORMAT
    let system: string;

    if (PROMPT_FORMAT === "v2") {
        // XML-structured format (Context7 best practice for Gemini 2.5+)
        const parts = [
            `<role>\n${instancePrompt || baseRules}\n</role>`,
            instancePrompt ? `<rules>\n${baseRules}\n</rules>` : "",
            `<content_format>\n${ctPrompt}\n${ctInfo ? `\n${ctInfo}` : ""}\n</content_format>`,
            `<constraints>`,
            `- Language: ${langInstruction}`,
            charConstraint ? `- Character count: ${charConstraint}` : "",
            `</constraints>`,
            `<output_format>`,
            `Return ONLY the post text including hashtags.`,
            `No meta-commentary, no explanations, no markdown formatting.`,
            `</output_format>`,
            `<self_critique>`,
            `Before returning your final response, verify:`,
            `1. Character count falls within the required range.`,
            `2. Tone matches the requested persona — authentic, not generic.`,
            `3. No corporate buzzwords or forbidden phrases.`,
            `</self_critique>`,
        ].filter(Boolean);
        system = parts.join("\n");
    } else {
        // v1: Original plain text format
        const systemParts: string[] = [baseRules];
        if (instancePrompt) {
            systemParts.push("\n---\n", instancePrompt);
        }
        if (ctPrompt) {
            systemParts.push("\n---\n", ctPrompt);
        }
        if (ctInfo) {
            systemParts.push("\n", ctInfo);
        }
        systemParts.push(`\nLANGUAGE: ${langInstruction}`);
        if (charConstraint) {
            systemParts.push(`\nHARD CONSTRAINT — CHARACTER COUNT: ${charConstraint} If your draft is too short, add more substance. If too long, tighten the language.`);
        }
        systemParts.push(
            `\nBefore returning your final response, verify:\n1. Character count falls within the required range.\n2. Tone matches the requested persona — authentic, not generic.\n3. No corporate buzzwords or forbidden phrases.`
        );
        system = systemParts.join("\n");
    }

    // 2. Assemble user prompt with KB context
    const userParts: string[] = [];

    const topicContext = getTopicContext(topicField);
    if (topicContext) {
        userParts.push(topicContext);
    }

    const quotes = getRelevantQuotes(instance, topicField);
    if (quotes) {
        userParts.push("\n");
        userParts.push(quotes);
    }

    userParts.push("\n---\n");
    userParts.push(`USER INPUT / CONTEXT:\n${userInput}`);
    userParts.push(
        "\n\nGenerate the post now. Follow all format and tonality rules above.",
    );

    const user = userParts.join("\n");

    return { system, user };
}

/**
 * Builds a prompt for generating a website article.
 *
 * @param {Object} params - The parameters for building the article prompt.
 * @param {TopicFieldId} params.topicField - The topic field for the article.
 * @param {string} params.userInput - The user's input or context for the article.
 * @returns {BuiltPrompt} The constructed system and user prompt strings.
 * @example
 * const prompt = buildWebsiteArticlePrompt({
 *   topicField: "innovation",
 *   userInput: "Focus on our latest R&D breakthrough."
 * });
 * console.log(prompt.user);
 */
export function buildWebsiteArticlePrompt(params: {
    topicField: TopicFieldId;
    userInput: string;
}): BuiltPrompt {
    const { topicField, userInput } = params;

    // System: base + website article format
    const system = [
        systemPrompts.base,
        "\n---\n",
        systemPrompts.websiteArticle,
    ].join("\n");

    // User: topic context + input
    const userParts: string[] = [];

    const topicContext = getTopicContext(topicField);
    if (topicContext) {
        userParts.push(topicContext);
    }

    // Get quotes from all authors for this topic
    const allGroups = quotesData as QuoteGroup[];
    const allRelevantQuotes: string[] = [];
    for (const group of allGroups) {
        for (const q of group.quotes) {
            if (q.topics.includes(topicField)) {
                allRelevantQuotes.push(`• "${q.content}" — ${group.name}`);
            }
        }
    }
    if (allRelevantQuotes.length > 0) {
        userParts.push("\nRELEVANT QUOTES FROM THE COMPANY:");
        userParts.push(...allRelevantQuotes.slice(0, 5));
    }

    userParts.push("\n---\n");
    userParts.push(`USER INPUT / CONTEXT:\n${userInput}`);
    userParts.push(
        "\n\nGenerate the website article now. Provide BOTH German and English versions, clearly separated.",
    );

    return { system, user: userParts.join("\n") };
}

// ============================================================
// Image Prompt Builder — vDNA-powered brand-conformant image prompts
// Uses prompt_fragments from /assets/vdna/tokens.json
// ============================================================

/**
 * vDNA prompt fragments — sourced from tokens.json ai.prompt_fragments
 * These are the brand-level visual instructions that ensure every
 * generated image matches the BenderWire Group corporate identity.
 */
const VDNA_PROMPT_FRAGMENTS = {
    brand_style:
        "Professional, modern corporate style using BenderWire Group brand identity. Deep green (#24616B) as primary color with bright green (#46B384) and crisp cyan (#32B7BE) accents. Clean, minimalist layout with Gilroy typography. Wire gradient for dynamic elements.",
    photo_style:
        "High-quality industrial photography. Clean, modern production environments. Macro shots of wire and metal surfaces. Natural lighting with deep green tonal accents.",
    illustration_style:
        "Geometric vector style inspired by Gilroy typeface. Wire-cross-section circular motifs. Brand color palette. Modern, abstract, professional.",
    linkedin_post:
        "Professional LinkedIn post image. BenderWire Group branding. Deep green background or white with green accents. Gilroy SemiBold for headlines. Wire gradient for accent elements.",
} as const;

/**
 * LinkedIn image formats with pixel dimensions from vDNA tokens.
 */
const LINKEDIN_FORMATS: Record<string, { width: number; height: number; label: string }> = {
    "single-square": { width: 1200, height: 1200, label: "Standard Post" },
    "single-landscape": { width: 1200, height: 627, label: "Landscape / Link Preview" },
    "single-portrait": { width: 1080, height: 1350, label: "Portrait / Story-Style" },
    "carousel-slide": { width: 1080, height: 1080, label: "Karussell-Slide" },
    "company-banner": { width: 1584, height: 396, label: "Unternehmensbanner" },
};

/**
 * Instance-specific visual guidelines for image generation.
 * Extends the persona tonality into the visual domain.
 */
const INSTANCE_VISUAL_GUIDES: Record<InstanceId, string> = {
    alex: [
        "Visual tone: Cool, structured, authoritative.",
        "Subject matter: Sustainability, circular economy, energy infrastructure.",
        "Mood: Thoughtful, deliberate, industrial precision.",
        "Avoid: Flashy graphics, playful elements, stock photo clichés.",
    ].join(" "),
    ablas: [
        "Visual tone: Warm, energetic, innovation-focused.",
        "Subject matter: High-tech wire applications, medical technology, customer stories.",
        "Mood: Excited discovery, pushing boundaries, hands-on engineering.",
        "Avoid: Corporate blandness, overly formal compositions.",
    ].join(" "),
    bwg: [
        "Visual tone: Factual, awe-inspiring, brand-consistent.",
        "Subject matter: Wire in everyday life, company culture, technology showcase.",
        "Mood: Understated pride, staunend (astonished, not boastful).",
        "Avoid: Personal flair, individual perspectives, promotional push.",
    ].join(" "),
};

/**
 * Visual style options for the generated image.
 */
type ImageStyle = "photo" | "illustration" | "abstract" | "infographic";

/**
 * Parameters for building an image generation prompt.
 */
interface BuildImagePromptParams {
    /** The ID of the instance generating the image */
    instance: InstanceId;
    /** The target format (e.g., 'single-square') */
    format: string;
    /** The topic field for the image content */
    topicField: TopicFieldId;
    /** The user's creative input for the image */
    userInput: string;
    /** The visual style of the image (defaults to 'photo') */
    style?: ImageStyle;
}

/**
 * Build a brand-conformant image generation prompt.
 *
 * Assembly order:
 * 1. Base brand style from vDNA
 * 2. Format-specific dimensions
 * 3. Style-specific fragment (photo / illustration)
 * 4. Instance visual guide (Alex vs Ablas vs BWG mood)
 * 5. Topic context (facts + keywords for subject inspiration)
 * 6. User creative input
 *
 * @param {BuildImagePromptParams} params - The parameters for building the image prompt.
 * @returns {string} The constructed prompt string for image generation.
 * @example
 * const prompt = buildImagePrompt({
 *   instance: "alex",
 *   format: "single-square",
 *   topicField: "sustainability",
 *   userInput: "A wind turbine in a green field.",
 *   style: "photo"
 * });
 * console.log(prompt);
 */
export function buildImagePrompt(params: BuildImagePromptParams): string {
    const {
        instance,
        format,
        topicField,
        userInput,
        style = "photo",
    } = params;

    const parts: string[] = [];

    // 1. Core brand identity
    parts.push(VDNA_PROMPT_FRAGMENTS.brand_style);

    // 2. LinkedIn format + dimensions
    const formatSpec = LINKEDIN_FORMATS[format];
    if (formatSpec) {
        parts.push(
            `Image format: ${formatSpec.label} (${formatSpec.width}×${formatSpec.height}px).`,
        );
    }

    // 3. Visual style fragment
    parts.push(VDNA_PROMPT_FRAGMENTS.linkedin_post);
    switch (style) {
        case "photo":
            parts.push(VDNA_PROMPT_FRAGMENTS.photo_style);
            break;
        case "illustration":
            parts.push(VDNA_PROMPT_FRAGMENTS.illustration_style);
            break;
        case "abstract":
            parts.push(
                VDNA_PROMPT_FRAGMENTS.illustration_style,
                "Abstract and conceptual. No recognizable objects — pure geometric and wire-inspired forms.",
            );
            break;
        case "infographic":
            parts.push(
                "Clean infographic layout. Data-driven visual. Use brand colors for charts/icons. Minimal text. Wire gradient for accent lines.",
            );
            break;
    }

    // 4. Instance visual guide
    const visualGuide = INSTANCE_VISUAL_GUIDES[instance];
    if (visualGuide) {
        parts.push(visualGuide);
    }

    // 5. Topic context (compact — just core message + key facts for visual inspiration)
    const topics = topicFields as TopicFieldData[];
    const topic = topics.find((t) => t.id === topicField);
    if (topic) {
        parts.push(
            `Topic: ${topic.label}. ${topic.kernbotschaft}`,
        );
        if (topic.keywords.length > 0) {
            parts.push(`Visual keywords: ${topic.keywords.slice(0, 6).join(", ")}.`);
        }
    }

    // 6. User creative input
    if (userInput.trim()) {
        parts.push(`Specific request: ${userInput.trim()}`);
    }

    // 7. Quality + safety rails
    parts.push(
        "Do NOT include any text or typography in the image unless explicitly requested.",
        "High resolution, professional quality, suitable for LinkedIn publishing.",
    );

    return parts.join("\n\n");
}

