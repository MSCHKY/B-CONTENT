import { useCreateStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
    } = useCreateStore();

    // Find relevant quotes for the selected instance and topic
    const relevantQuotes = topicField
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

    const handleGenerate = async () => {
        setIsGenerating(true);

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

            const data = (await response.json()) as { text: string };
            setGeneratedText(data.text);
            nextStep();
        } catch {
            // Fallback mock for dev without worker
            setGeneratedText(
                `[Dev Mock] Content for ${instance}\n\nTopic: ${topicField}\nInput: "${userInput}"\n\nThis is a placeholder. The real AI generation requires the Worker API to be running.\n\n#BenderWire #Innovation`
            );
            nextStep();
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="sm" onClick={prevStep}>
                    ← Back
                </Button>
                <p className="text-text-secondary">
                    Define your topic and provide context
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Input Area */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select
                            label="Topic Field"
                            options={topicOptions}
                            placeholder="Select a topic..."
                            value={topicField ?? ""}
                            onChange={(e) =>
                                selectTopicField(e.target.value as TopicFieldId)
                            }
                        />
                        <Select
                            label="Language"
                            options={languageOptions}
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value as "en" | "de")
                            }
                        />
                    </div>

                    <Textarea
                        label="Context / Keywords"
                        placeholder="Describe the topic, add keywords, mention specific facts or angles you want to highlight..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        charCount={userInput.length}
                        rows={6}
                    />

                    <Button
                        size="lg"
                        className="w-full"
                        onClick={handleGenerate}
                        loading={isGenerating}
                        disabled={!topicField || !userInput.trim()}
                    >
                        ✨ Generate Content
                    </Button>
                </div>

                {/* Knowledge Suggestions */}
                <div className="bg-bg-card rounded-xl border border-border-default p-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <span>💡</span> Knowledge Suggestions
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
                            Select a topic to see relevant quotes and facts.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
