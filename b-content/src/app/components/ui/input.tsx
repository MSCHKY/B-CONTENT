import {
    type InputHTMLAttributes,
    type TextareaHTMLAttributes,
    forwardRef,
} from "react";
import { X } from "lucide-react";

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
    charLabel?: string;
    /** When provided, shows a subtle × clear button inside the textarea (top-right). */
    onClear?: () => void;
}

/**
 * A styled multi-line text area component with optional character counting
 * and an inline clear button.
 *
 * @param {TextareaProps} props - The component props.
 * @param {string} [props.label] - The label for the textarea.
 * @param {string} [props.error] - An error message to display below the textarea.
 * @param {number} [props.charCount] - The current character count.
 * @param {number} [props.charMax] - The maximum allowed characters.
 * @param {() => void} [props.onClear] - Callback to clear the textarea content.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The rendered Textarea component.
 * @example
 * <Textarea label="Message" charCount={10} charMax={100} onClear={() => setText("")} />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        { label, error, charCount, charMax, charLabel, onClear, className = "", id, ...props },
        ref
    ) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
        const isOverLimit = charMax !== undefined && charCount !== undefined && charCount > charMax;
        const hasContent = (charCount !== undefined && charCount > 0) || (typeof props.value === "string" && props.value.length > 0);

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
                <div className="relative">
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
                            ${onClear ? "pr-10" : ""}
                            ${error || isOverLimit ? "border-error focus:ring-error/15" : ""}
                            ${className}
                        `}
                        {...props}
                    />
                    {onClear && hasContent && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-text-muted hover:text-text-primary hover:bg-black/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green/50"
                            aria-label="Text löschen"
                            title="Text löschen"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    {error && <p className="text-sm text-error">{error}</p>}
                    {charCount !== undefined && (
                        <p
                            className={`text-xs ml-auto ${isOverLimit ? "text-error font-semibold" : "text-text-muted"
                                }`}
                        >
                            {charCount}
                            {charMax ? ` / ${charMax}` : ""} {charLabel ?? "characters"}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
