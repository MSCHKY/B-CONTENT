import {
    type SelectHTMLAttributes,
    forwardRef,
} from "react";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}

/**
 * A styled dropdown select component.
 *
 * @param {SelectProps} props - The component props.
 * @param {string} [props.label] - The label for the select dropdown.
 * @param {SelectOption[]} props.options - The list of options to display.
 * @param {string} [props.placeholder] - The placeholder text when no option is selected.
 * @param {string} [props.error] - An error message to display below the select.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} The rendered Select component.
 * @example
 * <Select options={[{value: "1", label: "One"}]} placeholder="Select number" />
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, placeholder, error, className = "", id, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-medium text-text-secondary"
                    >
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={`
                        w-full px-4 py-2.5 rounded-lg appearance-none
                        bg-white/90 backdrop-blur-sm border border-border-default
                        text-text-primary
                        font-[var(--vdna-font-primary)]
                        transition-all duration-[var(--vdna-transition-fast)]
                        hover:border-crisp-cyan/30 hover:shadow-sm
                        focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-deep-green/15
                        bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23787878%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4.646%206.646a.5.5%200%200%201%20.708%200L8%209.293l2.646-2.647a.5.5%200%200%201%20.708.708l-3%203a.5.5%200%200%201-.708%200l-3-3a.5.5%200%200%201%200-.708z%22%2F%3E%3C%2Fsvg%3E')]
                        bg-no-repeat bg-[right_12px_center]
                        pr-10
                        ${error ? "border-error" : ""}
                        ${className}
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-sm text-error">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";
