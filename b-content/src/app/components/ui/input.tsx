import {
    type InputHTMLAttributes,
    type TextareaHTMLAttributes,
    forwardRef,
} from "react";

// --- Text Input ---

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-text-secondary"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2.5 rounded-lg
            bg-bg-card border border-border-default
            text-text-primary placeholder:text-text-muted
            font-[var(--vdna-font-primary)]
            transition-all duration-[var(--vdna-transition-fast)]
            focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-deep-green/15
            ${error ? "border-error focus:ring-error/15" : ""}
            ${className}
          `}
                    {...props}
                />
                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

// --- Textarea ---

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    charCount?: number;
    charMax?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        { label, error, charCount, charMax, className = "", id, ...props },
        ref
    ) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const isOverLimit = charMax !== undefined && charCount !== undefined && charCount > charMax;

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-sm font-medium text-text-secondary"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`
            w-full px-4 py-3 rounded-lg min-h-[120px] resize-y
            bg-bg-card border border-border-default
            text-text-primary placeholder:text-text-muted
            font-[var(--vdna-font-primary)]
            transition-all duration-[var(--vdna-transition-fast)]
            focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-deep-green/15
            ${error || isOverLimit ? "border-error focus:ring-error/15" : ""}
            ${className}
          `}
                    {...props}
                />
                <div className="flex justify-between items-center">
                    {error && <p className="text-sm text-error">{error}</p>}
                    {charCount !== undefined && (
                        <p
                            className={`text-xs ml-auto ${isOverLimit ? "text-error font-semibold" : "text-text-muted"
                                }`}
                        >
                            {charCount}
                            {charMax ? ` / ${charMax}` : ""} characters
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
