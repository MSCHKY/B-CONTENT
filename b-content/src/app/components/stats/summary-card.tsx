export function SummaryCard({
    label,
    value,
    suffix,
    icon,
}: {
    label: string;
    value: number;
    suffix?: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="glass-card rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-text-muted mb-1">
                {icon}
                <span className="text-xs font-medium uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <p className="text-2xl font-bold text-text-primary">
                {value}
                {suffix && (
                    <span className="text-sm text-text-muted font-normal">
                        {suffix}
                    </span>
                )}
            </p>
        </div>
    );
}
