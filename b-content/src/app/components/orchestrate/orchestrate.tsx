import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layers, Copy, Save, Calendar, Loader2, AlertTriangle } from "lucide-react";
import topicFields from "@data/topics/topic-fields.json";
import { useTranslation } from "@/i18n";
import { INSTANCE_LABELS, INSTANCE_COLORS_GRADIENT, INSTANCE_ACCENT, CONTENT_TYPE_LABELS } from "@shared/constants";

// --- Types ---

interface OrchestratedPost {
    instance: string;
    contentType: string;
    text: string;
    hashtags: string[];
    charCount: number;
    suggestedDay: string;
    mock: boolean;
}

// Constants imported from @shared/constants
const INSTANCE_COLORS = INSTANCE_COLORS_GRADIENT;

const topicOptions = (topicFields as Array<{ id: string; label: string }>).map(
    (t) => ({
        value: t.id,
        label: t.label,
    }),
);

export function Orchestrate() {
    const [topicField, setTopicField] = useState("");
    const [userInput, setUserInput] = useState("");
    const [language, setLanguage] = useState("en");
    const [posts, setPosts] = useState<OrchestratedPost[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [savingAll, setSavingAll] = useState(false);
    const [saveResult, setSaveResult] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleGenerate = async () => {
        if (!topicField || !userInput.trim()) return;

        setIsGenerating(true);
        setError(null);
        setPosts([]);
        setSaveResult(null);

        try {
            const response = await fetch("/api/orchestrate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicField, userInput, language }),
            });

            const data = (await response.json()) as {
                posts?: OrchestratedPost[];
                error?: string;
            };

            if (data.error) {
                setError(data.error);
            } else if (data.posts) {
                setPosts(data.posts);
            }
        } catch {
            setError(t.common.error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = async (text: string, index: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = async () => {
        const combined = posts
            .map(
                (p) =>
                    `--- ${INSTANCE_LABELS[p.instance]} (${p.suggestedDay}) ---\n\n${p.text}`,
            )
            .join("\n\n\n");
        await navigator.clipboard.writeText(combined);
        setCopiedIndex(-1);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSaveAll = async () => {
        setSavingAll(true);
        setSaveResult(null);
        let saved = 0;

        try {
            for (const post of posts) {
                const response = await fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        instance: post.instance,
                        contentType: post.contentType,
                        topicFields: [topicField],
                        text: post.text,
                        language,
                        hashtags: post.hashtags,
                        charCount: post.charCount,
                        isPersonal: false,
                    }),
                });
                if (response.ok) saved++;
            }
            setSaveResult(
                `${saved}/${posts.length} posts saved to Library`,
            );
        } catch {
            setSaveResult("Failed to save posts");
        } finally {
            setSavingAll(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <Layers className="text-crisp-cyan" size={24} strokeWidth={2} />
                <h2 className="text-xl font-semibold text-text-primary section-header">
                    {t.orchestrate.title}
                </h2>
            </div>
            <hr className="gradient-line mb-3" />
            <p className="text-sm text-text-muted mb-6">
                {t.orchestrate.subtitle}
            </p>

            {/* Input Form */}
            <div className="glass-card rounded-xl p-5 mb-6 animate-fade-in-up">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Select
                        label={t.orchestrate.topicLabel}
                        options={[
                            { value: "", label: t.orchestrate.topicPlaceholder },
                            ...topicOptions,
                        ]}
                        value={topicField}
                        onChange={(e) => setTopicField(e.target.value)}
                    />
                    <Select
                        label={t.create.topicInput.languageLabel}
                        options={[
                            { value: "en", label: "English" },
                            { value: "de", label: "Deutsch" },
                        ]}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Context / Input
                    </label>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={t.create.topicInput.inputPlaceholder}
                        className="w-full bg-bg-primary/80 backdrop-blur-sm border border-border-default rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-crisp-cyan/50 transition-all resize-none"
                        rows={3}
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    loading={isGenerating}
                    disabled={!topicField || !userInput.trim() || isGenerating}
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    <Layers size={18} />
                    {isGenerating
                        ? t.orchestrate.generating
                        : t.orchestrate.generateWeek}
                </Button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 mb-6 text-sm text-red-400 animate-fade-in-up flex items-center gap-2">
                    <AlertTriangle size={16} />
                    {error}
                </div>
            )}

            {/* Loading Skeleton */}
            {isGenerating && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {["alex", "ablas", "bwg"].map((id) => (
                        <div
                            key={id}
                            className={`rounded-xl border bg-gradient-to-b ${INSTANCE_COLORS[id]} p-5 animate-pulse`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Loader2
                                    className="animate-spin text-text-muted"
                                    size={16}
                                />
                                <span className="text-sm text-text-muted">
                                    Generating {INSTANCE_LABELS[id]}...
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-white/10 rounded w-full" />
                                <div className="h-3 bg-white/10 rounded w-4/5" />
                                <div className="h-3 bg-white/10 rounded w-3/5" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results */}
            {posts.length > 0 && (
                <div className="animate-fade-in-up">
                    {/* Action bar */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-text-primary">
                            {t.orchestrate.result.weekPlan}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleCopyAll}
                            >
                                <Copy size={14} />
                                {copiedIndex === -1
                                    ? t.orchestrate.result.copied
                                    : t.orchestrate.result.copyAll}
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveAll}
                                loading={savingAll}
                                disabled={savingAll}
                            >
                                <Save size={14} />
                                {t.orchestrate.result.saveAll}
                            </Button>
                        </div>
                    </div>

                    {saveResult && (
                        <div className="rounded-lg bg-bright-green/10 border border-bright-green/30 p-3 mb-4 text-sm text-bright-green animate-fade-in-up">
                            {saveResult}
                        </div>
                    )}

                    {/* Post cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {posts.map((post, i) => (
                            <div
                                key={post.instance}
                                className={`rounded-xl border bg-gradient-to-b ${INSTANCE_COLORS[post.instance]} p-5 hover-lift transition-all`}
                                style={{
                                    animationDelay: `${i * 100}ms`,
                                }}
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h4
                                            className={`font-semibold ${INSTANCE_ACCENT[post.instance]}`}
                                        >
                                            {INSTANCE_LABELS[post.instance]}
                                        </h4>
                                        <span className="text-xs text-text-muted">
                                            {CONTENT_TYPE_LABELS[
                                                post.contentType
                                            ] ?? post.contentType}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar
                                            size={12}
                                            className="text-text-muted"
                                        />
                                        <Badge variant="muted">
                                            {post.suggestedDay}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Post text */}
                                <div className="bg-bg-primary/60 backdrop-blur-sm rounded-lg p-3 mb-3 text-sm text-text-secondary whitespace-pre-wrap max-h-64 overflow-y-auto">
                                    {post.text}
                                </div>

                                {/* Meta + Actions */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-muted">
                                        {post.charCount} {t.create.result.charCount}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleCopy(post.text, i)
                                        }
                                    >
                                        <Copy size={12} />
                                        {copiedIndex === i
                                            ? t.orchestrate.result.copied
                                            : t.orchestrate.result.copy}
                                    </Button>
                                </div>

                                {/* Hashtags */}
                                {post.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {post.hashtags
                                            .slice(0, 5)
                                            .map((tag, j) => (
                                                <Badge
                                                    key={j}
                                                    variant="muted"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                    </div>
                                )}

                                {post.mock && (
                                    <div className="mt-2 text-xs text-amber-400/70 flex items-center gap-1">
                                        <AlertTriangle size={10} />
                                        {t.orchestrate.mockNotice}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
