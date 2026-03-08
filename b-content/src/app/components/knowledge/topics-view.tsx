import { useState } from "react";
import { Pencil } from "lucide-react";
import { useTranslation } from "@/i18n";
import { TopicEditor } from "./topic-editor";
import type { TopicFieldData } from "./types";

export function TopicsView({ topics, onRefresh }: { topics: TopicFieldData[]; onRefresh: () => Promise<void> }) {
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
                                aria-label={t.knowledge.editor.edit}
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
