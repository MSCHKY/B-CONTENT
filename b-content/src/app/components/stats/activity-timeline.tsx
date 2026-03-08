import type { TimelineWeek } from "./types";
import { useTranslation } from "@/i18n";
import { INSTANCE_HEX } from "@shared/constants";

/** 12-week stacked bar chart — pure CSS */
export function ActivityTimeline({ timeline }: { timeline: TimelineWeek[] }) {
    const maxCount = Math.max(...timeline.map((w) => w.count), 1);
    const { t } = useTranslation();

    if (timeline.every((w) => w.count === 0)) {
        return (
            <p className="text-sm text-text-muted text-center py-8">
                {t.stats.noPostsHint}
            </p>
        );
    }

    return (
        <div className="flex items-end gap-1.5 h-40">
            {timeline.map((week) => {
                const totalHeight = (week.count / maxCount) * 100;
                const alexH = week.count > 0 ? ((week.instances.alex ?? 0) / week.count) * totalHeight : 0;
                const ablasH = week.count > 0 ? ((week.instances.ablas ?? 0) / week.count) * totalHeight : 0;
                const bwgH = week.count > 0 ? ((week.instances.bwg ?? 0) / week.count) * totalHeight : 0;

                return (
                    <div
                        key={week.week}
                        className="flex-1 flex flex-col items-center gap-1 group"
                    >
                        {/* Stacked bar */}
                        <div
                            className="w-full rounded-t-md overflow-hidden flex flex-col-reverse transition-all duration-500 ease-out relative"
                            style={{ height: `${Math.max(totalHeight, 4)}%` }}
                            title={`${week.weekLabel}: ${week.count} posts`}
                        >
                            {alexH > 0 && (
                                <div
                                    style={{ height: `${(alexH / totalHeight) * 100}%`, backgroundColor: INSTANCE_HEX.alex }}
                                    className="w-full transition-all duration-500"
                                />
                            )}
                            {ablasH > 0 && (
                                <div
                                    style={{ height: `${(ablasH / totalHeight) * 100}%`, backgroundColor: INSTANCE_HEX.ablas }}
                                    className="w-full transition-all duration-500"
                                />
                            )}
                            {bwgH > 0 && (
                                <div
                                    style={{ height: `${(bwgH / totalHeight) * 100}%`, backgroundColor: INSTANCE_HEX.bwg }}
                                    className="w-full transition-all duration-500"
                                />
                            )}
                            {week.count === 0 && (
                                <div className="w-full h-full bg-border-default/30 rounded-t-md" />
                            )}

                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-sidebar/95 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                {week.count}
                            </div>
                        </div>

                        {/* Week label */}
                        <span className="text-[9px] text-text-muted leading-none">
                            {week.weekLabel}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
