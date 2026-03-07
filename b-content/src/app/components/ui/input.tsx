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

/**
 * A styled single-line text input component.
 *
 * @param {InputProps} props - The component props.
 * @param {string} [props.label] - The label for the input.
 * @param {string} [props.error] - An error message to display below the input.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The rendered Input component.
 * @example
 * <Input label="Email" type="email" placeholder="Enter email" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const errorId = error ? `${inputId}-error` : undefined;
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-text-secondary"
                    >
                        {label}
                        {props.required && (
                            <span aria-hidden="true" className="text-error ml-1">*</span>
                        )}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    aria-invalid={!!error}
                    aria-describedby={errorId}
                    className={`
                        w-full px-4 py-2.5 rounded-lg
                        bg-white/90 backdrop-blur-sm border border-border-default
                        text-text-primary placeholder:text-text-muted
                        font-[var(--vdna-font-primary)]
                        transition-all duration-[var(--vdna-transition-fast)]
                        hover:border-crisp-cyan/30 hover:shadow-sm
                        focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-deep-green/15
                        ${error ? "border-error focus:ring-error/15" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p id={errorId} role="alert" className="text-sm text-error">
                        {error}
                    </p>
                )}
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

/**
 * A styled multi-line text area component with optional character counting.
 *
 * @param {TextareaProps} props - The component props.
 * @param {string} [props.label] - The label for the textarea.
 * @param {string} [props.error] - An error message to display below the textarea.
 * @param {number} [props.charCount] - The current character count.
 * @param {number} [props.charMax] - The maximum allowed characters.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The rendered Textarea component.
 * @example
 * <Textarea label="Message" charCount={10} charMax={100} />
 */
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
                        bg-white/90 backdrop-blur-sm border border-border-default
                        text-text-primary placeholder:text-text-muted
                        font-[var(--vdna-font-primary)]
                        transition-all duration-[var(--vdna-transition-fast)]
                        hover:border-crisp-cyan/30 hover:shadow-sm
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
