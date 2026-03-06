import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "accent" | "muted" | "success" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-deep-green/10 text-deep-green border border-deep-green/15",
    accent: "bg-crisp-cyan/10 text-crisp-cyan border border-crisp-cyan/15",
    muted: "bg-graphite-dust/8 text-graphite-dust border border-graphite-dust/10",
    success: "bg-success/10 text-success border border-success/15",
    warning: "bg-warning/10 text-warning border border-warning/15",
};

export function Badge({
    variant = "default",
    className = "",
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={`
                inline-flex items-center
                px-2.5 py-0.5 rounded-full
                text-xs font-medium
                transition-colors duration-[var(--vdna-transition-fast)]
                ${variantStyles[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </span>
    );
}
