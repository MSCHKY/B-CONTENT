import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/i18n";
import type { KnowledgeTab, TopicFieldData, QuoteGroup } from "./types";
import { TopicsView } from "./topics-view";
import { QuotesView } from "./quotes-view";
import { RulesView } from "./rules-view";

export function KnowledgeViewer() {
    const [activeTab, setActiveTab] = useState<KnowledgeTab>("topics");
    const [topics, setTopics] = useState<TopicFieldData[]>([]);
    const [quoteGroups, setQuoteGroups] = useState<QuoteGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    const loadData = useCallback(async () => {
        try {
            const [topicsRes, quotesRes] = await Promise.all([
                fetch("/api/knowledge/topics"),
                fetch("/api/knowledge/quotes"),
            ]);
            if (topicsRes.ok) setTopics(await topicsRes.json());
            if (quotesRes.ok) setQuoteGroups(await quotesRes.json());
        } catch (err) {
            console.error("Failed to load knowledge data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const totalQuotes = quoteGroups.reduce((sum, g) => sum + g.quotes.length, 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-text-muted">
                {t.common.loading}
            </div>
        );
    }

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
                {activeTab === "topics" && <TopicsView topics={topics} onRefresh={loadData} />}
                {activeTab === "quotes" && (
                    <QuotesView
                        quoteGroups={quoteGroups}
                        topics={topics}
                        onRefresh={loadData}
                    />
                )}
                {activeTab === "rules" && <RulesView />}
            </div>
        </div>
    );
}
