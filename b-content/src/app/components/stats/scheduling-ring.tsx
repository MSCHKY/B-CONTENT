import type { SchedulingHealth } from "./types";
import { useTranslation } from "@/i18n";

/** Scheduling Health — SVG progress ring */
export function SchedulingRing({ scheduling }: { scheduling: SchedulingHealth }) {
    const { t } = useTranslation();
    const total = scheduling.scheduled + scheduling.unscheduled;
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = total > 0 ? circumference - (scheduling.coverage / 100) * circumference : circumference;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* SVG Ring */}
            <div className="relative w-36 h-36 shrink-0">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="60" cy="60" r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-border-default"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60" cy="60" r={radius}
                        fill="none"
                        stroke="url(#ringGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-primary">{scheduling.coverage}</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">%</span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
                    <span className="text-text-secondary">{t.stats.scheduledLabel}</span>
                    <span className="font-semibold text-text-primary ml-auto">{scheduling.scheduled}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-border-default" />
                    <span className="text-text-secondary">{t.stats.unscheduledLabel}</span>
                    <span className="font-semibold text-text-primary ml-auto">{scheduling.unscheduled}</span>
                </div>
            </div>
        </div>
    );
}
