import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    selected?: boolean;
    hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            selected = false,
            hoverable = true,
            className = "",
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={`
          bg-bg-card rounded-xl
          border transition-all duration-[var(--vdna-transition-base)]
          ${selected
                        ? "wire-gradient-border shadow-md ring-1 ring-bright-green/20"
                        : "border-border-default"
                    }
          ${hoverable && !selected
                        ? "hover:shadow-md hover:border-crisp-cyan/40 hover:scale-[1.01] cursor-pointer"
                        : ""
                    }
          ${className}
        `}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

// Card sub-components for consistent layout
export function CardHeader({
    className = "",
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`px-5 pt-5 pb-2 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardBody({
    className = "",
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`px-5 py-3 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({
    className = "",
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`px-5 pb-5 pt-2 border-t border-border-default ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
