import { useState, useRef, useCallback } from "react";
import { Upload, Mic, FileText } from "lucide-react";
import { useTranslation } from "@/i18n";

type InputMode = "audio" | "text";

interface UploadPanelProps {
    titleInput: string;
    setTitleInput: (v: string) => void;
    contextInput: string;
    setContextInput: (v: string) => void;
    onFileSelected: (file: File) => void;
    onTextSubmit: (text: string) => void;
}

export function UploadPanel({
    titleInput,
    setTitleInput,
    contextInput,
    setContextInput,
    onFileSelected,
    onTextSubmit,
}: UploadPanelProps) {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [inputMode, setInputMode] = useState<InputMode>("audio");
    const [textInput, setTextInput] = useState("");

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
        if (file) {
            if (inputMode === "text" && (file.name.endsWith(".md") || file.name.endsWith(".txt"))) {
                // Read text files
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const content = ev.target?.result as string;
                    if (content) setTextInput(content);
                };
                reader.readAsText(file);
            } else {
                onFileSelected(file);
            }
        }
    }, [onFileSelected, inputMode]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (inputMode === "text" && (file.name.endsWith(".md") || file.name.endsWith(".txt"))) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const content = ev.target?.result as string;
                    if (content) setTextInput(content);
                };
                reader.readAsText(file);
            } else {
                onFileSelected(file);
            }
        }
    }, [onFileSelected, inputMode]);

    const handleTextSubmit = useCallback(() => {
        if (textInput.trim().length >= 10) {
            onTextSubmit(textInput);
        }
    }, [textInput, onTextSubmit]);

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

            {/* Input Mode Toggle */}
            <div className="flex gap-1 p-1 rounded-lg bg-white/5 w-fit">
                <button
                    onClick={() => setInputMode("audio")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
                        transition-all cursor-pointer ${
                        inputMode === "audio"
                            ? "bg-bright-green/20 text-bright-green"
                            : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                    <Mic size={14} />
                    {t.interview.audioTab}
                </button>
                <button
                    onClick={() => setInputMode("text")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
                        transition-all cursor-pointer ${
                        inputMode === "text"
                            ? "bg-bright-green/20 text-bright-green"
                            : "text-text-secondary hover:text-text-primary"
                    }`}
                >
                    <FileText size={14} />
                    {t.interview.textTab}
                </button>
            </div>

            {/* Audio Mode: Drop Zone */}
            {inputMode === "audio" && (
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
            )}

            {/* Text Mode: Textarea + File Upload */}
            {inputMode === "text" && (
                <div className="space-y-3">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative rounded-xl transition-all duration-300 ${
                            dragActive ? "ring-2 ring-bright-green" : ""
                        }`}
                    >
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={t.interview.textPlaceholder}
                            rows={12}
                            className="w-full px-4 py-3 rounded-xl bg-bg-input border border-white/10
                                text-text-primary placeholder:text-text-secondary/50 text-sm leading-relaxed
                                focus:outline-none focus:border-bright-green/50 transition-colors resize-y min-h-[200px]"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm
                                    text-text-secondary hover:text-text-primary hover:bg-white/5
                                    transition-colors cursor-pointer"
                            >
                                <Upload size={14} />
                                {t.interview.textFileUpload}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".md,.txt,.text"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <span className="text-text-secondary/50 text-xs">
                                {t.interview.textFormatHint}
                            </span>
                        </div>
                        <span className="text-text-secondary/50 text-xs">
                            {textInput.length.toLocaleString()} {t.interview.textChars}
                        </span>
                    </div>
                    <button
                        onClick={handleTextSubmit}
                        disabled={textInput.trim().length < 10}
                        className="w-full py-3 rounded-xl font-medium text-white wire-gradient
                            hover:shadow-lg transition-all cursor-pointer disabled:opacity-40
                            disabled:cursor-not-allowed"
                    >
                        {t.interview.textExtract}
                    </button>
                </div>
            )}
        </div>
    );
}
