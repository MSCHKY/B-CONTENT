import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import topicFields from "@data/topics/topic-fields.json";
import quotesData from "@data/quotes/quotes.json";
import contentRules from "@data/content-rules.json";
import { useTranslation } from "@/i18n";

type KnowledgeTab = "topics" | "quotes" | "rules";

// Types matching actual JSON structures
interface TopicFieldData {
    id: string;
    label: string;
    kernbotschaft: string;
    facts: string[];
    keywords: string[];
}

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

const topics = topicFields as TopicFieldData[];
const quoteGroups = quotesData as QuoteGroup[];

// Flatten all quotes for count
const totalQuotes = quoteGroups.reduce((sum, g) => sum + g.quotes.length, 0);

export function KnowledgeViewer() {
    const [activeTab, setActiveTab] = useState<KnowledgeTab>("topics");
    const { t } = useTranslation();

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-text-primary section-header">
                    {t.knowledge.title}
                </h1>
                <hr className="gradient-line mt-4 mb-3" />
                <p className="text-text-secondary">
                    {t.knowledge.subtitle}
                </p>
            </div>

            {/* Tab Selector — glassmorphism pill */}
            <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit tab-pill-container">
                {(
                    [
                        { id: "topics", label: `🏷️ ${t.knowledge.tabs.topics}`, count: topics.length },
                        { id: "quotes", label: `💬 ${t.knowledge.tabs.quotes}`, count: totalQuotes },
                        { id: "rules", label: `📏 ${t.knowledge.tabs.rules}` },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium
                            transition-all duration-[var(--vdna-transition-base)]
                            cursor-pointer
                            ${activeTab === tab.id
                                ? "wire-gradient text-white shadow-sm"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-card-hover"
                            }
                        `}
                    >
                        {tab.label}
                        {"count" in tab && tab.count !== undefined && (
                            <span className="ml-1.5 opacity-70">({tab.count})</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content with fade-in */}
            <div className="animate-fade-in-up" key={activeTab}>
                {activeTab === "topics" && <TopicsView />}
                {activeTab === "quotes" && <QuotesView />}
                {activeTab === "rules" && <RulesView />}
            </div>
        </div>
    );
}

function TopicsView() {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    className="glass-card rounded-xl p-5 hover-lift group"
                >
                    <h3 className="font-semibold text-text-primary mb-1 group-hover:text-deep-green transition-colors">
                        {topic.label}
                    </h3>
                    <p className="text-sm text-crisp-cyan italic mb-3">
                        {topic.kernbotschaft}
                    </p>
                    <div className="space-y-1.5">
                        {topic.facts.slice(0, 3).map((fact, i) => (
                            <p key={i} className="text-xs text-text-secondary flex gap-2">
                                <span className="text-bright-green shrink-0">•</span>
                                {fact}
                            </p>
                        ))}
                        {topic.facts.length > 3 && (
                            <p className="text-xs text-text-muted">
                                +{topic.facts.length - 3} {t.knowledge.facts}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function QuotesView() {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            {quoteGroups.map((group) => (
                <div key={group.author} className="animate-fade-in-up">
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Badge variant="accent">{group.name}</Badge>
                        <span className="text-sm text-text-muted">
                            ({group.quotes.length} {t.knowledge.tabs.quotes})
                        </span>
                    </h3>
                    <div className="space-y-2 stagger-children">
                        {group.quotes.map((q) => (
                            <div
                                key={q.id}
                                className="glass-card rounded-lg p-4 hover-lift"
                            >
                                <p className="text-sm text-text-primary italic">
                                    &ldquo;{q.content}&rdquo;
                                </p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {q.topics.map((topic) => (
                                        <Badge key={topic} variant="muted">
                                            {topic}
                                        </Badge>
                                    ))}
                                    {q.context && (
                                        <span className="text-xs text-text-muted">
                                            — {q.context}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function RulesView() {
    const rules = contentRules as {
        rules?: { name: string; description: string }[];
        orchestration?: { name: string; description: string }[];
        guidelines?: { name: string; description: string }[];
    };

    const allRuleSections = [
        { title: "Posting Rules", items: rules.rules ?? [] },
        { title: "Orchestration", items: rules.orchestration ?? [] },
        { title: "Guidelines", items: rules.guidelines ?? [] },
    ].filter((s) => s.items.length > 0);

    return (
        <div className="space-y-6">
            {allRuleSections.map((section) => (
                <div key={section.title} className="animate-fade-in-up">
                    <h3 className="font-semibold text-text-primary mb-3">
                        {section.title}
                    </h3>
                    <div className="space-y-2 stagger-children">
                        {section.items.map((rule) => (
                            <div
                                key={rule.name}
                                className="glass-card rounded-lg p-4 hover-lift"
                            >
                                <h4 className="text-sm font-medium text-deep-green mb-1">
                                    {rule.name}
                                </h4>
                                <p className="text-sm text-text-secondary">
                                    {rule.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
