import { useState } from "react";
import { Save, X } from "lucide-react";
import { useTranslation } from "@/i18n";

interface QuoteEditorProps {
    quote?: {
        id: string;
        content: string;
        topics: string[];
        emotion: string;
        context?: string;
    };
    authorId?: string;
    availableTopics: { id: string; label: string }[];
    availableAuthors: { id: string; name: string }[];
    onSave: (data: {
        id?: string;
        author: string;
        content: string;
        topics: string[];
        emotion: string;
        context?: string;
    }) => Promise<void>;
    onCancel: () => void;
}

export function QuoteEditor({
    quote,
    authorId,
    availableTopics,
    availableAuthors,
    onSave,
    onCancel,
}: QuoteEditorProps) {
    const [author, setAuthor] = useState(quote ? "" : (authorId ?? availableAuthors[0]?.id ?? ""));
    const [content, setContent] = useState(quote?.content ?? "");
    const [selectedTopics, setSelectedTopics] = useState<string[]>(quote?.topics ?? []);
    const [emotion, setEmotion] = useState(quote?.emotion ?? "");
    const [context, setContext] = useState(quote?.context ?? "");
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();

    const isEditing = !!quote;

    const toggleTopic = (topicId: string) => {
        setSelectedTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((t) => t !== topicId)
                : [...prev, topicId]
        );
    };

    const handleSave = async () => {
        if (!content.trim()) return;
        setSaving(true);
        try {
            await onSave({
                id: quote?.id,
                author: isEditing ? "" : author,
                content: content.trim(),
                topics: selectedTopics,
                emotion: emotion.trim(),
                context: context.trim() || undefined,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-3 p-4 rounded-xl border border-border-subtle bg-bg-card/50 animate-fade-in-up">
            {/* Author selector (only for new quotes) */}
            {!isEditing && (
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                        {t.knowledge.editor.authorLabel}
                    </label>
                    <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-bg-input border border-border-subtle text-text-primary focus:outline-none focus:ring-1 focus:ring-crisp-cyan"
                    >
                        {availableAuthors.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Content */}
            <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                    {t.knowledge.editor.quotePlaceholder}
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-bg-input border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-crisp-cyan resize-none"
                    placeholder={t.knowledge.editor.quotePlaceholder}
                />
            </div>

            {/* Topics multi-select (badges) */}
            <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                    {t.knowledge.editor.topicsLabel}
                </label>
                <div className="flex flex-wrap gap-1.5">
                    {availableTopics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => toggleTopic(topic.id)}
                            className={`px-2 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${selectedTopics.includes(topic.id)
                                    ? "bg-crisp-cyan/25 text-crisp-cyan ring-1 ring-crisp-cyan/40"
                                    : "bg-bg-card-hover text-text-muted hover:text-text-secondary"
                                }`}
                        >
                            {topic.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Emotion & Context row */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                        {t.knowledge.editor.emotionLabel}
                    </label>
                    <input
                        type="text"
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-bg-input border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-crisp-cyan"
                        placeholder="z.B. überzeugend, stolz"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                        {t.knowledge.editor.contextLabel}
                    </label>
                    <input
                        type="text"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-bg-input border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-crisp-cyan"
                        placeholder={t.knowledge.editor.contextLabel}
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-2 border-t border-border-subtle">
                <button
                    onClick={onCancel}
                    className="px-3 py-1.5 text-xs rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors cursor-pointer"
                >
                    <X size={12} className="inline mr-1" />
                    {t.knowledge.editor.cancel}
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || !content.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg wire-gradient text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                    <Save size={12} />
                    {saving ? t.common.loading : t.knowledge.editor.save}
                </button>
            </div>
        </div>
    );
}
