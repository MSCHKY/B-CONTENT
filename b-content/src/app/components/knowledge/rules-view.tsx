import { useState, useEffect } from "react";
import type { ContentRules } from "./types";

export function RulesView() {
    const [rules, setRules] = useState<ContentRules | null>(null);

    useEffect(() => {
        fetch("/api/knowledge/rules")
            .then((r) => r.json())
            .then((data) => setRules(data as ContentRules))
            .catch(console.error);
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
