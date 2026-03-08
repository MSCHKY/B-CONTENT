import { useState, useEffect, useCallback } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import { TopicEditor } from "./topic-editor";
import { QuoteEditor } from "./quote-editor";

type KnowledgeTab = "topics" | "quotes" | "rules";

// Types matching API JSON structures
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

// ============================================================
// Topics Tab — with inline editing
// ============================================================

function TopicsView({ topics, onRefresh }: { topics: TopicFieldData[]; onRefresh: () => Promise<void> }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleSave = async (topicId: string, facts: string[], keywords: string[]) => {
        const res = await fetch(`/api/knowledge/topics/${topicId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ facts, keywords }),
        });
        if (res.ok) {
            setEditingId(null);
            await onRefresh();
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
            {topics.map((topic) => (
                <div
                    key={topic.id}
                    className="glass-card rounded-xl p-5 hover-lift group"
                >
                    <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-text-primary group-hover:text-deep-green transition-colors">
                            {topic.label}
                        </h3>
                        {editingId !== topic.id && (
                            <button
                                onClick={() => setEditingId(topic.id)}
                                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-crisp-cyan transition-all cursor-pointer p-1 rounded-md hover:bg-bg-card-hover"
                                title={t.knowledge.editor.edit}
                            >
                                <Pencil size={14} />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-crisp-cyan italic mb-3">
                        {topic.kernbotschaft}
                    </p>

                    {editingId === topic.id ? (
                        <TopicEditor
                            topicId={topic.id}
                            facts={topic.facts}
                            keywords={topic.keywords}
                            onSave={handleSave}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <>
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
                            {topic.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {topic.keywords.slice(0, 5).map((kw) => (
                                        <span
                                            key={kw}
                                            className="px-2 py-0.5 rounded-full text-[10px] bg-crisp-cyan/10 text-crisp-cyan/70"
                                        >
                                            {kw}
                                        </span>
                                    ))}
                                    {topic.keywords.length > 5 && (
                                        <span className="px-2 py-0.5 text-[10px] text-text-muted">
                                            +{topic.keywords.length - 5}
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

// ============================================================
// Quotes Tab — with inline editing + add/delete
// ============================================================

function QuotesView({
    quoteGroups,
    topics,
    onRefresh,
}: {
    quoteGroups: QuoteGroup[];
    topics: TopicFieldData[];
    onRefresh: () => Promise<void>;
}) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const { t } = useTranslation();

    const availableTopics = topics.map((t) => ({ id: t.id, label: t.label }));
    const availableAuthors = quoteGroups.map((g) => ({ id: g.author, name: g.name }));

    const handleSaveQuote = async (data: {
        id?: string;
        author: string;
        content: string;
        topics: string[];
        emotion: string;
        context?: string;
    }) => {
        const url = data.id ? `/api/knowledge/quotes/${data.id}` : "/api/knowledge/quotes";
        const method = data.id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            setEditingId(null);
            setShowAdd(false);
            await onRefresh();
        }
    };

    const handleDelete = async (quoteId: string) => {
        if (!confirm(t.knowledge.editor.confirmDelete)) return;
        const res = await fetch(`/api/knowledge/quotes/${quoteId}`, { method: "DELETE" });
        if (res.ok) await onRefresh();
    };

    return (
        <div className="space-y-6">
            {/* Add Quote button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg wire-gradient text-white hover:opacity-90 transition-opacity cursor-pointer"
                >
                    <Plus size={14} />
                    {t.knowledge.editor.addQuote}
                </button>
            </div>

            {/* Add Quote Form */}
            {showAdd && (
                <QuoteEditor
                    availableTopics={availableTopics}
                    availableAuthors={availableAuthors}
                    onSave={handleSaveQuote}
                    onCancel={() => setShowAdd(false)}
                />
            )}

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
                            <div key={q.id}>
                                {editingId === q.id ? (
                                    <QuoteEditor
                                        quote={q}
                                        availableTopics={availableTopics}
                                        availableAuthors={availableAuthors}
                                        onSave={handleSaveQuote}
                                        onCancel={() => setEditingId(null)}
                                    />
                                ) : (
                                    <div className="glass-card rounded-lg p-4 hover-lift group/quote">
                                        <div className="flex items-start justify-between">
                                            <p className="text-sm text-text-primary italic flex-1">
                                                &ldquo;{q.content}&rdquo;
                                            </p>
                                            <div className="flex gap-1 opacity-0 group-hover/quote:opacity-100 transition-opacity shrink-0 ml-2">
                                                <button
                                                    onClick={() => setEditingId(q.id)}
                                                    className="text-text-muted hover:text-crisp-cyan p-1 rounded-md hover:bg-bg-card-hover transition-colors cursor-pointer"
                                                    title={t.knowledge.editor.edit}
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q.id)}
                                                    className="text-text-muted hover:text-red-400 p-1 rounded-md hover:bg-bg-card-hover transition-colors cursor-pointer"
                                                    title={t.knowledge.editor.delete}
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            {q.topics.map((topic) => (
                                                <Badge key={topic} variant="muted">
                                                    {topic}
                                                </Badge>
                                            ))}
                                            {q.emotion && (
                                                <span className="text-[10px] text-text-muted italic">
                                                    {q.emotion}
                                                </span>
                                            )}
                                            {q.context && (
                                                <span className="text-xs text-text-muted">
                                                    — {q.context}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ============================================================
// Rules Tab — read-only (rules are system invariants)
// ============================================================

interface ContentRules {
    posting_rules: {
        ratio: { fach_zu_persoenlich: string; beschreibung: string };
        max_oberthemen: { value: number; beschreibung: string };
        posting_abstand: { min_tage: number; beschreibung: string };
        sprache_default: string;
        sprache_regeln: { englisch: string; deutsch: string };
        website_artikel: string;
    };
    content_principles: Record<string, { formel?: string; beschreibung?: string; beispiel?: string; pruefstein?: string; konsequenz?: string }>;
    leitplanken: { erlaubt: string[]; verboten: string[] };
    orchestrierung: {
        dreier_regel: { beschreibung: string; wirkung: string };
    };
    freigabe: { prinzip: string; beschreibung: string };
}

function RulesView() {
    const [rules, setRules] = useState<ContentRules | null>(null);

    useEffect(() => {
        fetch("/api/knowledge/rules")
            .then((r) => r.json())
            .then((data) => setRules(data as ContentRules))
            .catch((err) => console.error(err));
    }, []);

    if (!rules) return null;

    return (
        <div className="space-y-6">
            {/* Posting Rules */}
            <section className="animate-fade-in-up">
                <h3 className="font-semibold text-text-primary mb-3">📋 Posting-Regeln</h3>
                <div className="space-y-2 stagger-children">
                    <RuleCard
                        title={`Ratio: ${rules.posting_rules.ratio.fach_zu_persoenlich}`}
                        desc={rules.posting_rules.ratio.beschreibung}
                    />
                    <RuleCard
                        title={`Max. Oberthemen: ${rules.posting_rules.max_oberthemen.value}`}
                        desc={rules.posting_rules.max_oberthemen.beschreibung}
                    />
                    <RuleCard
                        title={`Posting-Abstand: ${rules.posting_rules.posting_abstand.min_tage} Tage`}
                        desc={rules.posting_rules.posting_abstand.beschreibung}
                    />
                </div>
            </section>

            {/* Content Principles */}
            <section className="animate-fade-in-up">
                <h3 className="font-semibold text-text-primary mb-3">💡 Content-Prinzipien</h3>
                <div className="space-y-2 stagger-children">
                    {Object.entries(rules.content_principles).map(([key, p]) => (
                        <RuleCard
                            key={key}
                            title={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            desc={p.beschreibung ?? p.formel ?? ""}
                            example={p.beispiel ?? p.pruefstein}
                        />
                    ))}
                </div>
            </section>

            {/* Leitplanken */}
            <section className="animate-fade-in-up">
                <h3 className="font-semibold text-text-primary mb-3">🚧 Leitplanken</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card rounded-xl p-4">
                        <h4 className="text-sm font-medium text-deep-green mb-2">✅ Erlaubt</h4>
                        <ul className="space-y-1">
                            {rules.leitplanken.erlaubt.map((r, i) => (
                                <li key={i} className="text-xs text-text-secondary flex gap-2">
                                    <span className="text-bright-green shrink-0">•</span> {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                        <h4 className="text-sm font-medium text-red-400 mb-2">🚫 Verboten</h4>
                        <ul className="space-y-1">
                            {rules.leitplanken.verboten.map((r, i) => (
                                <li key={i} className="text-xs text-text-secondary flex gap-2">
                                    <span className="text-red-400 shrink-0">•</span> {r}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Orchestrierung */}
            <section className="animate-fade-in-up">
                <h3 className="font-semibold text-text-primary mb-3">🎯 Orchestrierung</h3>
                <RuleCard
                    title="Dreier-Regel"
                    desc={rules.orchestrierung.dreier_regel.beschreibung}
                    example={rules.orchestrierung.dreier_regel.wirkung}
                />
            </section>

            {/* Freigabe */}
            <section className="animate-fade-in-up">
                <h3 className="font-semibold text-text-primary mb-3">✅ Freigabe</h3>
                <RuleCard
                    title={rules.freigabe.prinzip}
                    desc={rules.freigabe.beschreibung}
                />
            </section>
        </div>
    );
}

function RuleCard({ title, desc, example }: { title: string; desc: string; example?: string }) {
    return (
        <div className="glass-card rounded-lg p-4 hover-lift">
            <h4 className="text-sm font-medium text-deep-green mb-1">
                {title}
            </h4>
            <p className="text-sm text-text-secondary">{desc}</p>
            {example && (
                <p className="text-xs text-text-muted italic mt-1">
                    ↳ {example}
                </p>
            )}
        </div>
    );
}
