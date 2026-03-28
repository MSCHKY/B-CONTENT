import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    selected?: boolean;
    hoverable?: boolean;
    glass?: boolean;
}

/**
 * A versatile card component used for displaying grouped content.
 *
 * @param {CardProps} props - The component props.
 * @param {boolean} [props.selected=false] - Highlights the card to indicate selection.
 * @param {boolean} [props.hoverable=true] - Adds hover effects like lifting.
 * @param {boolean} [props.glass=true] - Applies a glassmorphism style.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - The card's content.
 * @returns {JSX.Element} The rendered Card component.
 * @example
 * <Card selected hoverable={false}>
 *   <CardBody>Content here</CardBody>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            selected = false,
            hoverable = true,
            glass = true,
            className = "",
            children,
            onClick,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const isInteractive = !!onClick;

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (isInteractive && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                // 🔍 WÄCHTER: Cast via unknown to satisfy strict type requirements without altering runtime behavior for simulated clicks
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
            onKeyDown?.(e);
        };

        return (
            <div
                ref={ref}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                onClick={onClick}
                onKeyDown={handleKeyDown}
                className={`
                    rounded-xl transition-all duration-[var(--vdna-transition-base)]
                    ${glass ? "glass-card" : "bg-bg-card border border-border-default"}
                    ${selected
                        ? "wire-gradient-border shadow-md ring-1 ring-bright-green/20"
                        : ""
                    }
                    ${hoverable && !selected
                        ? "hover-lift cursor-pointer"
                        : ""
                    }
                    ${isInteractive ? "focus-ring outline-none" : ""}
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

/**
 * Header section for the Card component.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div props.
 * @returns {JSX.Element} The card header section.
 */
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

/**
 * Main body content section for the Card component.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div props.
 * @returns {JSX.Element} The card body section.
 */
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

/**
 * Footer section for the Card component, typically used for actions.
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div props.
 * @returns {JSX.Element} The card footer section.
 */
export function CardFooter({
    className = "",
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`px-5 pb-5 pt-2 border-t border-border-default/50 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
