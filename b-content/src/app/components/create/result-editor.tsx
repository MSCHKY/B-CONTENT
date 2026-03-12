import { useState } from "react";
import { useAppStore, useCreateStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import type { ImageFormat } from "@/types";
import { LINKEDIN_FORMATS } from "@/types";

const formatOptions = Object.entries(LINKEDIN_FORMATS).map(
    ([value, { label }]) => ({
        value,
        label,
    })
);

export function ResultEditor() {
    // ⚡ Bolt: Use useShallow to prevent ResultEditor from re-rendering on every keystroke in TopicInput
    const {
        instance,
        contentType,
        topicField,
        userInput,
        language,
        generatedText,
        imageFormat,
        generatedImageUrl,
        isGenerating,
        setGeneratedText,
        setImageFormat,
        setGeneratedImageUrl,
        prevStep,
        reset,
    } = useCreateStore(
        useShallow((state) => ({
            instance: state.instance,
            contentType: state.contentType,
            topicField: state.topicField,
            userInput: state.userInput,
            language: state.language,
            generatedText: state.generatedText,
            imageFormat: state.imageFormat,
            generatedImageUrl: state.generatedImageUrl,
            isGenerating: state.isGenerating,
            setGeneratedText: state.setGeneratedText,
            setImageFormat: state.setImageFormat,
            setGeneratedImageUrl: state.setGeneratedImageUrl,
            prevStep: state.prevStep,
            reset: state.reset,
        }))
    );

    const setView = useAppStore((s) => s.setView);
    const { t } = useTranslation();

    const [savedPostId, setSavedPostId] = useState<string | null>(null);
    const [savedImageId, setSavedImageId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    const charCount = generatedText?.length ?? 0;
    const format = LINKEDIN_FORMATS[imageFormat];

    const handleCopyText = async () => {
        if (generatedText) {
            await navigator.clipboard.writeText(generatedText);
        }
    };

    const handleExportText = () => {
        if (!generatedText) return;
        const blob = new Blob([generatedText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${instance}-${contentType}-post.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Generate image via API
    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        setImageError(null);
        try {
            const response = await fetch("/api/generate/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    instance,
                    format: imageFormat,
                    topicField,
                    userInput,
                    style: "photo",
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({ error: "Unknown error" })) as { error?: string };
                throw new Error(errData.error || `HTTP ${response.status}`);
            }

            const data = (await response.json()) as {
                imageUrl?: string;
                imageId?: string;
                error?: string;
            };

            if (data.imageUrl) {
                setGeneratedImageUrl(data.imageUrl);
                if (data.imageId) {
                    setSavedImageId(data.imageId);
                }
            } else if (data.error) {
                setImageError(data.error);
            }
        } catch (err) {
            console.error("[Image Generation] Failed:", err);
            setImageError(err instanceof Error ? err.message : "Image generation failed");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const [saveError, setSaveError] = useState<string | null>(null);

    // Save to Library (D1)
    const handleSaveToLibrary = async () => {
        if (!generatedText || !instance || !contentType) return;
        setIsSaving(true);
        setSaveError(null);

        try {
            const hashtags = generatedText.match(/#\w+/g) ?? [];
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    instance,
                    contentType,
                    topicFields: topicField ? [topicField] : [],
                    text: generatedText,
                    language,
                    hashtags,
                    charCount: generatedText.length,
                    isPersonal: false,
                    imageId: savedImageId,
                }),
            });

            const data = (await response.json()) as { id?: string; error?: string };
            if (!response.ok) {
                const errMsg = data.error || `Server error (${response.status})`;
                console.error("[Save to Library]", errMsg);
                setSaveError(errMsg);
                return;
            }
            if (data.id) {
                setSavedPostId(data.id);
            }
        } catch (err) {
            console.error("[Save to Library] Network error:", err);
            setSaveError("Network error — please try again");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="sm" onClick={prevStep}>
                    {t.create.back}
                </Button>
                <p className="text-text-secondary">
                    {t.create.result.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text Editor */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary">{t.create.result.postText}</h3>
                        <div className="flex items-center gap-2">
                            <Badge variant={charCount > 1200 ? "warning" : "default"}>
                                {charCount} {t.create.result.charCount}
                            </Badge>
                            <Badge variant="accent">{contentType}</Badge>
                        </div>
                    </div>

                    <Textarea
                        value={generatedText ?? ""}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        charCount={charCount}
                        charLabel={t.create.result.charCount}
                        rows={12}
                        className="font-mono text-sm"
                        onClear={() => {
                            setGeneratedText("");
                            setGeneratedImageUrl(null);
                            setSavedPostId(null);
                            setSavedImageId(null);
                            setSaveError(null);
                            setImageError(null);
                        }}
                    />

                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={handleCopyText}>
                            📋 {t.create.result.copy}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleExportText}>
                            ⬇️ {t.create.result.exportTxt}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevStep}
                        >
                            🔄 {t.create.result.regenerate}
                        </Button>
                    </div>
                </div>

                {/* Image Area */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary">{t.create.result.postImage}</h3>
                        <Badge variant="muted">
                            {format.width}×{format.height}
                        </Badge>
                    </div>

                    <Select
                        label="Format"
                        options={formatOptions}
                        value={imageFormat}
                        onChange={(e) =>
                            setImageFormat(e.target.value as ImageFormat)
                        }
                    />

                    {/* Image Preview / Placeholder */}
                    <div
                        className="rounded-xl border-2 border-dashed border-border-default bg-bg-card-hover flex items-center justify-center overflow-hidden"
                        style={{
                            aspectRatio: `${format.width} / ${format.height}`,
                            maxHeight: "400px",
                        }}
                    >
                        {generatedImageUrl ? (
                            <img
                                src={generatedImageUrl}
                                alt="Generated post image"
                                className="w-full h-full object-cover"
                            />
                        ) : isGeneratingImage ? (
                            <div className="text-center p-8">
                                <span className="text-4xl block mb-3 animate-pulse">🎨</span>
                                <p className="text-sm text-text-muted">
                                    {t.create.result.generatingImage}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <span className="text-4xl block mb-3">🎨</span>
                                <p className="text-sm text-text-muted">
                                    {t.create.result.generateImageHint}
                                </p>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        disabled={isGenerating || isGeneratingImage}
                        loading={isGeneratingImage}
                        onClick={handleGenerateImage}
                    >
                        🎨 {t.create.result.generateImage}
                    </Button>

                    {imageError && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400 animate-fade-in-up flex items-center justify-between">
                            <span>⚠️ {imageError}</span>
                            <button type="button" aria-label="Fehlermeldung schließen" onClick={() => setImageError(null)} className="text-red-400 hover:text-red-300 ml-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-sm">✕</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Error Display */}
            {saveError && (
                <div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm flex items-center justify-between">
                    <span>⚠️ {saveError}</span>
                    <Button variant="ghost" size="sm" onClick={() => setSaveError(null)}>
                        ✕
                    </Button>
                </div>
            )}

            {/* Bottom Action Bar */}
            <div className="mt-8 pt-6 border-t border-border-default flex items-center justify-between">
                <p className="text-sm text-text-muted">
                    {t.create.result.instanceLabel}: <span className="font-medium text-text-secondary">{instance}</span>
                    {" · "}{t.create.result.typeLabel}: <span className="font-medium text-text-secondary">{contentType}</span>
                </p>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={reset}>
                        {t.create.result.newPost}
                    </Button>
                    <Button variant="secondary" onClick={handleExportText}>
                        ⬇️ {t.create.result.exportAll}
                    </Button>
                    {savedPostId ? (
                        <Button
                            onClick={() => setView("library")}
                        >
                            ✅ {t.create.result.savedViewLibrary}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSaveToLibrary}
                            loading={isSaving}
                            disabled={!generatedText}
                        >
                            💾 {t.create.result.saveToLibrary}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

