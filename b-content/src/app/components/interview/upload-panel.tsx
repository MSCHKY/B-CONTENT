import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";
import { useTranslation } from "@/i18n";

interface UploadPanelProps {
    titleInput: string;
    setTitleInput: (v: string) => void;
    contextInput: string;
    setContextInput: (v: string) => void;
    onFileSelected: (file: File) => void;
}

export function UploadPanel({
    titleInput,
    setTitleInput,
    contextInput,
    setContextInput,
    onFileSelected,
}: UploadPanelProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelected(file);
    }, [onFileSelected]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelected(file);
    }, [onFileSelected]);

    return (
        <div className="space-y-4">
            {/* Context inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        {t.interview.titleLabel}
                    </label>
                    <input
                        type="text"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        placeholder={t.interview.titlePlaceholder}
                        className="w-full px-3 py-2 rounded-lg bg-bg-input border border-white/10
                            text-text-primary placeholder:text-text-secondary/50
                            focus:outline-none focus:border-bright-green/50 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        {t.interview.context}
                    </label>
                    <input
                        type="text"
                        value={contextInput}
                        onChange={(e) => setContextInput(e.target.value)}
                        placeholder={t.interview.contextPlaceholder}
                        className="w-full px-3 py-2 rounded-lg bg-bg-input border border-white/10
                            text-text-primary placeholder:text-text-secondary/50
                            focus:outline-none focus:border-bright-green/50 transition-colors"
                    />
                </div>
            </div>

            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    glass-card rounded-xl p-12 text-center cursor-pointer
                    transition-all duration-300 border-2 border-dashed
                    ${dragActive
                        ? "border-bright-green bg-bright-green/10 scale-[1.01]"
                        : "border-white/20 hover:border-white/40 hover:bg-white/5"
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                    <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center
                        transition-all duration-300
                        ${dragActive ? "bg-bright-green/20 scale-110" : "bg-white/10"}
                    `}>
                        <Upload
                            size={28}
                            className={`transition-colors ${dragActive ? "text-bright-green" : "text-text-secondary"}`}
                        />
                    </div>
                    <div>
                        <p className="text-text-primary font-medium text-lg">
                            {t.interview.dropzone}
                        </p>
                        <p className="text-text-secondary text-sm mt-1">
                            {t.interview.formatHint}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
