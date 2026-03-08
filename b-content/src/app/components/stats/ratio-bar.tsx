import type { InstanceRatio } from "./types";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";
import { INSTANCE_COLORS_DOT, INSTANCE_COLORS_BG } from "@shared/constants";

const INSTANCE_COLORS = INSTANCE_COLORS_DOT;
const INSTANCE_BG = INSTANCE_COLORS_BG;

export function RatioBar({ ratio }: { ratio: InstanceRatio }) {
    const total = ratio.fachPosts + ratio.personalPosts;
    const fachPercent = total > 0 ? (ratio.fachPosts / total) * 100 : 0;
    const personalPercent = total > 0 ? (ratio.personalPosts / total) * 100 : 0;
    const { t } = useTranslation();

    return (
        <div
            className={`rounded-lg border p-3 ${INSTANCE_BG[ratio.instance] ?? "bg-bg-card border-border-default"}`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-2.5 h-2.5 rounded-full ${INSTANCE_COLORS[ratio.instance] ?? "bg-text-muted"}`}
                    />
                    <span className="text-sm font-semibold text-text-primary">
                        {ratio.label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={ratio.isHealthy ? "accent" : "warning"}
                    >
                        {ratio.ratio}
                    </Badge>
                    {ratio.nextShouldBePersonal && (
                        <Badge variant="warning">
                            <AlertTriangle size={10} /> {t.stats.nextPersonal}
                        </Badge>
                    )}
                    {total === 0 && (
                        <Badge variant="muted">{t.stats.noPostsYet}</Badge>
                    )}
                </div>
            </div>

            {total > 0 && (
                <div className="flex h-3 rounded-full overflow-hidden bg-bg-primary/50">
                    <div
                        className={`${INSTANCE_COLORS[ratio.instance] ?? "bg-text-muted"} transition-all duration-700 ease-out`}
                        style={{ width: `${fachPercent}%` }}
                        title={`${t.stats.expert}: ${ratio.fachPosts}`}
                    />
                    <div
                        className="bg-white/30 transition-all duration-700 ease-out"
                        style={{ width: `${personalPercent}%` }}
                        title={`${t.stats.personal}: ${ratio.personalPosts}`}
                    />
                </div>
            )}

            {total > 0 && (
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-text-muted">
                        {t.stats.expert}: {ratio.fachPosts}
                    </span>
                    <span className="text-[10px] text-text-muted">
                        {t.stats.personal}: {ratio.personalPosts}
                    </span>
                </div>
            )}
        </div>
    );
}
