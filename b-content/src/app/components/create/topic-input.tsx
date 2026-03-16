import { useMemo, useState } from "react";
import { useCreateStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import type { TopicFieldId } from "@/types";
import topicFields from "@data/topics/topic-fields.json";
import quotesData from "@data/quotes/quotes.json";

// Types matching actual JSON structures
interface QuoteItem {
    id: string;
    content: string;
    topics: string[];
    emotion: string;
    context?: string;
}

interface QuoteGroup {
    author: string;
    name: string;
    quotes: QuoteItem[];
}

// Build topic options for select
const topicOptions = (topicFields as { id: string; label: string }[]).map(
    (t) => ({
        value: t.id,
        label: t.label,
    })
);

const languageOptions = [
    { value: "en", label: "English" },
    { value: "de", label: "Deutsch" },
];

// Flatten quotes from grouped structure
const allQuotes = (quotesData as QuoteGroup[]).flatMap((group) =>
    group.quotes.map((q) => ({ ...q, author: group.author }))
);

export function TopicInput() {
    // ⚡ Bolt: Use useShallow to prevent TopicInput from unnecesarily re-rendering when other store values change
    const {
        instance,
        topicField,
        userInput,
        language,
        isGenerating,
        selectTopicField,
        setUserInput,
        setLanguage,
        setGeneratedText,
        setIsGenerating,
        prevStep,
        nextStep,
    } = useCreateStore(
        useShallow((state) => ({
            instance: state.instance,
            topicField: state.topicField,
            userInput: state.userInput,
            language: state.language,
            isGenerating: state.isGenerating,
            selectTopicField: state.selectTopicField,
            setUserInput: state.setUserInput,
            setLanguage: state.setLanguage,
            setGeneratedText: state.setGeneratedText,
            setIsGenerating: state.setIsGenerating,
            prevStep: state.prevStep,
            nextStep: state.nextStep,
        }))
    );

    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);

    // Find relevant quotes for the selected instance and topic
    // ⚡ Bolt: Memoize relevant quotes to prevent unnecessary filtering on every keystroke
    const relevantQuotes = useMemo(() => {
        return topicField
            ? allQuotes
                .filter(
                    (q) =>
                        (q.author === instance || q.author === "general") &&
                        q.topics.includes(topicField)
                )
                .slice(0, 3)
            : allQuotes
                .filter((q) => q.author === instance || q.author === "general")
                .slice(0, 3);
    }, [instance, topicField]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("/api/generate/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    instance,
                    contentType: useCreateStore.getState().contentType,
                    topicField,
                    userInput,
                    language,
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({ error: "Unknown error" })) as { error?: string };
                throw new Error(errData.error || `HTTP ${response.status}`);
            }

            const data = (await response.json()) as { text: string };
            setGeneratedText(data.text);
            nextStep();
        } catch (err) {
            if (import.meta.env.DEV) {
                // Dev-only fallback when worker is not running
                setGeneratedText(
                    `[Dev Mock] Content for ${instance}\n\nTopic: ${topicField}\nInput: "${userInput}"\n\nThis is a placeholder. The real AI generation requires the Worker API to be running.\n\n#BenderWire #Innovation`
                );
                nextStep();
            } else {
                console.error("[handleGenerate]", err);
                setError(err instanceof Error ? err.message : t.common.error);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="sm" onClick={prevStep}>
                    {t.create.back}
                </Button>
                <p className="text-text-secondary">
                    {t.create.topicInput.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label={t.create.topicInput.topicLabel}
                            options={topicOptions}
                            placeholder={t.create.topicInput.topicPlaceholder}
                            value={topicField ?? ""}
                            onChange={(e) =>
                                selectTopicField(e.target.value as TopicFieldId)
                            }
                        />
                        <Select
                            label={t.create.topicInput.languageLabel}
                            options={languageOptions}
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value as "en" | "de")
                            }
                        />
                    </div>

                    <Textarea
                        label={t.create.topicInput.inputLabel}
                        placeholder={t.create.topicInput.inputPlaceholder}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        charCount={userInput.length}
                        charLabel={t.create.result.charCount}
                        rows={6}
                        onClear={() => setUserInput("")}
                    />

                    <Button
                        size="lg"
                        className="w-full"
                        onClick={handleGenerate}
                        loading={isGenerating}
                        disabled={!topicField || !userInput.trim()}
                    >
                        ✨ {t.create.topicInput.generate}
                    </Button>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 animate-fade-in-up flex items-center justify-between">
                            <span>⚠️ {error}</span>
                            <button
                                type="button"
                                aria-label="Fehlermeldung schließen"
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-300 ml-2 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-red-400 rounded"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                {/* Knowledge Suggestions */}
                <div className="bg-bg-card rounded-xl border border-border-default p-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <span>💡</span> {t.create.topicInput.quotesTitle}
                    </h3>
                    {relevantQuotes.length > 0 ? (
                        <div className="space-y-3">
                            {relevantQuotes.map((quote) => (
                                <button
                                    key={quote.id}
                                    onClick={() =>
                                        setUserInput(
                                            userInput
                                                ? `${userInput}\n\n"${quote.content}"`
                                                : `"${quote.content}"`
                                        )
                                    }
                                    className="block w-full text-left p-3 rounded-lg bg-bg-primary hover:bg-bg-card-hover transition-colors text-sm cursor-pointer"
                                >
                                    <p className="text-text-primary italic">
                                        &ldquo;{quote.content}&rdquo;
                                    </p>
                                    <Badge variant="muted" className="mt-2">
                                        {quote.author}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-text-muted">
                            {t.create.topicInput.quotesEmpty}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
