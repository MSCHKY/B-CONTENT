import { useCreateStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ImageFormat } from "@/types";
import { LINKEDIN_FORMATS } from "@/types";

const formatOptions = Object.entries(LINKEDIN_FORMATS).map(
    ([value, { label }]) => ({
        value,
        label,
    })
);

export function ResultEditor() {
    const {
        instance,
        contentType,
        generatedText,
        imageFormat,
        generatedImageUrl,
        isGenerating,
        setGeneratedText,
        setImageFormat,
        prevStep,
        reset,
    } = useCreateStore();

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

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="sm" onClick={prevStep}>
                    ← Back
                </Button>
                <p className="text-text-secondary">
                    Edit and export your content
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Text Editor */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary">Post Text</h3>
                        <div className="flex items-center gap-2">
                            <Badge variant={charCount > 1200 ? "warning" : "default"}>
                                {charCount} chars
                            </Badge>
                            <Badge variant="accent">{contentType}</Badge>
                        </div>
                    </div>

                    <Textarea
                        value={generatedText ?? ""}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        charCount={charCount}
                        rows={12}
                        className="font-mono text-sm"
                    />

                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={handleCopyText}>
                            📋 Copy
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleExportText}>
                            ⬇️ Export .txt
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={prevStep}
                        >
                            🔄 Regenerate
                        </Button>
                    </div>
                </div>

                {/* Image Area */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text-primary">Post Image</h3>
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
                        ) : (
                            <div className="text-center p-8">
                                <span className="text-4xl block mb-3">🎨</span>
                                <p className="text-sm text-text-muted">
                                    Image generation available when
                                    <br />
                                    Gemini API key is configured
                                </p>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        disabled={isGenerating}
                    >
                        🎨 Generate Image
                    </Button>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-8 pt-6 border-t border-border-default flex items-center justify-between">
                <p className="text-sm text-text-muted">
                    Instance: <span className="font-medium text-text-secondary">{instance}</span>
                    {" · "}Type: <span className="font-medium text-text-secondary">{contentType}</span>
                </p>
                <div className="flex gap-3">
                    <Button variant="ghost" onClick={reset}>
                        New Post
                    </Button>
                    <Button onClick={handleExportText}>
                        ⬇️ Export All
                    </Button>
                </div>
            </div>
        </div>
    );
}
