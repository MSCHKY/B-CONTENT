import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useTranslation } from "@/i18n";

interface TopicEditorProps {
    topicId: string;
    facts: string[];
    keywords: string[];
    onSave: (topicId: string, facts: string[], keywords: string[]) => Promise<void>;
    onCancel: () => void;
}

export function TopicEditor({ topicId, facts: initialFacts, keywords: initialKeywords, onSave, onCancel }: TopicEditorProps) {
    const [facts, setFacts] = useState<string[]>([...initialFacts]);
    const [keywords, setKeywords] = useState<string[]>([...initialKeywords]);
    const [newFact, setNewFact] = useState("");
    const [newKeyword, setNewKeyword] = useState("");
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();

    const addFact = () => {
        if (newFact.trim()) {
            setFacts([...facts, newFact.trim()]);
            setNewFact("");
        }
    };

    const removeFact = (index: number) => {
        setFacts(facts.filter((_, i) => i !== index));
    };

    const addKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword("");
        }
    };

    const removeKeyword = (index: number) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(topicId, facts, keywords);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4 p-4 rounded-xl border border-border-subtle bg-bg-card/50 animate-fade-in-up">
            {/* Facts Editor */}
            <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                    {t.knowledge.facts}
                </h4>
                <div className="space-y-2">
                    {facts.map((fact, i) => (
                        <div key={i} className="flex items-start gap-2 group">
                            <span className="text-bright-green shrink-0 mt-0.5">•</span>
                            <p className="text-xs text-text-secondary flex-1">{fact}</p>
                            <button
                                onClick={() => removeFact(i)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity cursor-pointer shrink-0"
                                title={t.knowledge.editor.delete}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        value={newFact}
                        onChange={(e) => setNewFact(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addFact()}
                        placeholder={t.knowledge.editor.factPlaceholder}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-bg-input border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-crisp-cyan"
                    />
                    <button
                        onClick={addFact}
                        disabled={!newFact.trim()}
                        className="px-2 py-1.5 rounded-lg bg-deep-green/20 text-deep-green hover:bg-deep-green/30 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* Keywords Editor */}
            <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                    {t.knowledge.keywords}
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {keywords.map((kw, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-crisp-cyan/15 text-crisp-cyan"
                        >
                            {kw}
                            <button
                                onClick={() => removeKeyword(i)}
                                className="hover:text-red-400 transition-colors cursor-pointer"
                            >
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                        placeholder={t.knowledge.editor.addKeyword}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-bg-input border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-crisp-cyan"
                    />
                    <button
                        onClick={addKeyword}
                        disabled={!newKeyword.trim()}
                        className="px-2 py-1.5 rounded-lg bg-crisp-cyan/20 text-crisp-cyan hover:bg-crisp-cyan/30 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-2 border-t border-border-subtle">
                <button
                    onClick={onCancel}
                    className="px-3 py-1.5 text-xs rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card-hover transition-colors cursor-pointer"
                >
                    {t.knowledge.editor.cancel}
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg wire-gradient text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                >
                    <Save size={12} />
                    {saving ? t.common.loading : t.knowledge.editor.save}
                </button>
            </div>
        </div>
    );
}
