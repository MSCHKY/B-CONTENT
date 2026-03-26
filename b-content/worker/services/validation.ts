export type InstanceId = "alex" | "ablas" | "bwg";

export interface ValidationError {
    error: string;
    field: string;
}

const instanceTypes: Record<InstanceId, string[]> = {
    alex: ["deep-dive", "position", "frage", "persoenlich"],
    ablas: ["proof-point", "wusstest-du", "messe-story", "persoenlich"],
    bwg: ["draht-steckt-in", "news", "behind-scenes", "zahlen-fakten"]
};

const instanceCharRanges: Record<InstanceId, Record<string, { min: number, max: number }>> = {
    alex: {
        "deep-dive": { min: 800, max: 1200 },
        "position": { min: 400, max: 600 },
        "frage": { min: 300, max: 500 },
        "persoenlich": { min: 400, max: 600 }
    },
    ablas: {
        "proof-point": { min: 400, max: 600 },
        "wusstest-du": { min: 200, max: 400 },
        "messe-story": { min: 400, max: 800 },
        "persoenlich": { min: 300, max: 600 }
    },
    bwg: {
        "draht-steckt-in": { min: 200, max: 400 },
        "news": { min: 300, max: 600 },
        "behind-scenes": { min: 300, max: 500 },
        "zahlen-fakten": { min: 200, max: 300 }
    }
};

export const sanitizeText = (text: any): string => {
    if (typeof text !== "string") return "";
    // Strip dangerous HTML tags but preserve normal punctuation.
    // React handles XSS via JSX escaping — we only need to prevent
    // actual script injection, not encode quotes/apostrophes.
    return text
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, "")
        .replace(/<object[^>]*>.*?<\/object>/gi, "")
        .replace(/<embed[^>]*>/gi, "")
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
        .replace(/javascript\s*:/gi, "")
        .trim();
};

export const validateRequiredString = (value: any, fieldName: string): ValidationError | null => {
    if (typeof value !== "string" || value.trim() === "") {
        return { error: `Field '${fieldName}' is required and must be a non-empty string.`, field: fieldName };
    }
    return null;
};

export const validateRequiredArray = (value: any, fieldName: string): ValidationError | null => {
    if (!Array.isArray(value) || value.length === 0) {
        return { error: `Field '${fieldName}' is required and must be a non-empty array.`, field: fieldName };
    }
    for (const item of value) {
        if (typeof item !== "string") {
            return { error: `Field '${fieldName}' must be an array of strings.`, field: fieldName };
        }
    }
    return null;
};

export const validateInstanceId = (instance: any): ValidationError | null => {
    const validInstances = ["alex", "ablas", "bwg"];
    if (!validInstances.includes(instance)) {
        return { error: `Invalid instance ID. Must be one of: ${validInstances.join(", ")}.`, field: "instance" };
    }
    return null;
};

export const validateContentType = (instance: InstanceId, contentType: any): ValidationError | null => {
    const validTypes = instanceTypes[instance];
    if (!validTypes || !validTypes.includes(contentType)) {
        return { error: `Invalid content type for instance '${instance}'. Allowed: ${validTypes?.join(", ") || "none"}.`, field: "contentType" };
    }
    return null;
};

export const validateTextLength = (instance: any, contentType: any, text: string): ValidationError | null => {
    if (contentType === "website-article") {
        // Tolerance band: hard-block only at ±50% of range (250–2250)
        if (text.length < 250 || text.length > 2250) {
            return { error: `Text length for website-article must be roughly between 500 and 1500 characters (current: ${text.length}).`, field: "text" };
        }
        return null;
    }

    if (!instance || !contentType) return null;

    const ranges = instanceCharRanges[instance as InstanceId];
    if (!ranges) return null;

    const range = ranges[contentType];
    if (!range) return null;

    // Tolerance band: allow ±50% of the defined range.
    // Only hard-block completely absurd lengths to avoid losing user work.
    // The prompt-builder already instructs the AI to aim for the exact range.
    const toleranceMin = Math.floor(range.min * 0.5);
    const toleranceMax = Math.ceil(range.max * 1.5);

    if (text.length < toleranceMin || text.length > toleranceMax) {
        return { error: `Text length for ${instance} ${contentType} is far outside the expected ${range.min}–${range.max} range (current: ${text.length}).`, field: "text" };
    }
    return null;
};
