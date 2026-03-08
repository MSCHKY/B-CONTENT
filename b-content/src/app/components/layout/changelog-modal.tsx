import { useState } from "react";
import { X, Tag, Sparkles } from "lucide-react";
import { changelog, APP_VERSION } from "@/data/changelog-data";
import { useTranslation } from "@/i18n";

/**
 * Invisible trigger in the bottom-left corner of the viewport.
 * Click to open the changelog modal. Only those who know, know.
 */
export function ChangelogTrigger() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-0 left-0 w-8 h-8 z-[90] cursor-default opacity-0"
                aria-label="Changelog"
                tabIndex={-1}
            />
            {isOpen && <ChangelogModal onClose={() => setIsOpen(false)} />}
        </>
    );
}

function ChangelogModal({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation();

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" />

            {/* Modal */}
            <div
                className="relative w-full max-w-md max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl animate-fade-in"
                style={{
                    background: "linear-gradient(145deg, rgba(30,40,38,0.98), rgba(20,28,26,0.99))",
                    border: "1px solid rgba(255,255,255,0.06)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center gap-2">
                        <Tag size={14} className="text-bright-green/70" />
                        <h2 className="text-text-on-dark/80 font-medium text-sm tracking-wide">
                            {t.changelog.title}
                        </h2>
                        <span className="text-text-on-dark/20 text-[10px] font-mono">
                            v{APP_VERSION}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-on-dark/30 hover:text-text-on-dark/60 transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto max-h-[calc(75vh-3.5rem)] px-5 py-4 space-y-5">
                    {changelog.map((entry, i) => (
                        <div key={entry.version}>
                            {/* Version Header */}
                            <div className="flex items-center gap-2.5 mb-2.5">
                                <span className={`
                                    inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide
                                    ${i === 0
                                        ? "wire-gradient text-white shadow-sm"
                                        : "bg-white/5 text-text-on-dark/40"
                                    }
                                `}>
                                    {i === 0 && <Sparkles size={10} />}
                                    v{entry.version}
                                </span>
                                <span className="text-text-on-dark/20 text-[11px] font-light">
                                    {entry.date}
                                </span>
                            </div>

                            {/* Highlights */}
                            <ul className="space-y-1 pl-0.5">
                                {entry.highlights.map((highlight, j) => (
                                    <li
                                        key={j}
                                        className="flex items-start gap-2 text-[13px] leading-relaxed text-text-on-dark/50"
                                    >
                                        <span className="mt-[7px] w-1 h-1 rounded-full bg-bright-green/30 shrink-0" />
                                        {highlight}
                                    </li>
                                ))}
                            </ul>

                            {/* Divider (except last) */}
                            {i < changelog.length - 1 && (
                                <div className="mt-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
