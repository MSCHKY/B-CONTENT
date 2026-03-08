import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import { QuoteEditor } from "./quote-editor";
import type { QuoteGroup, TopicFieldData } from "./types";

export function QuotesView({
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
                                                    aria-label={t.knowledge.editor.edit}
                                                >
                                                    <Pencil size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(q.id)}
                                                    className="text-text-muted hover:text-red-400 p-1 rounded-md hover:bg-bg-card-hover transition-colors cursor-pointer"
                                                    title={t.knowledge.editor.delete}
                                                    aria-label={t.knowledge.editor.delete}
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
