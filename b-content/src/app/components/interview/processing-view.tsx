import { FileAudio, Loader2 } from "lucide-react";
import { useTranslation } from "@/i18n";
import type { ViewState } from "./helpers";

export function ProcessingView({ viewState }: { viewState: ViewState }) {
    const { t } = useTranslation();

    return (
        <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-bright-green/10 flex items-center justify-center animate-pulse">
                        <FileAudio size={32} className="text-bright-green" />
                    </div>
                    <Loader2
                        size={56}
                        className="absolute -top-4 -left-4 text-bright-green/30 animate-spin"
                    />
                </div>
                <div>
                    <p className="text-text-primary font-medium text-lg">
                        {viewState === "uploading"
                            ? t.interview.uploading
                            : t.interview.processing
                        }
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                        {t.interview.processingHint}
                    </p>
                </div>
            </div>
        </div>
    );
}
