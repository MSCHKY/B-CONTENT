import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "accent" | "muted" | "success" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-deep-green/10 text-deep-green",
    accent: "bg-crisp-cyan/10 text-crisp-cyan",
    muted: "bg-graphite-dust/10 text-graphite-dust",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
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
        ${variantStyles[variant]}
        ${className}
      `}
            {...props}
        >
            {children}
        </span>
    );
}
