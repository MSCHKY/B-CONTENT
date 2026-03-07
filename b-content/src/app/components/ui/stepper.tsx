interface StepperProps {
    steps: string[];
    currentStep: number;
}

/**
 * A styled step indicator for multi-step processes.
 *
 * @param {StepperProps} props - The component props.
 * @param {string[]} props.steps - An array of labels for each step.
 * @param {number} props.currentStep - The current active step (1-indexed).
 * @returns {JSX.Element} The rendered Stepper component.
 * @example
 * <Stepper steps={["One", "Two", "Three"]} currentStep={2} />
 */
export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <nav className="flex items-center gap-2 w-full max-w-xl mx-auto py-4">
            {steps.map((label, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;

                return (
                    <div key={label} className="flex items-center flex-1 last:flex-none">
                        {/* Step circle + label */}
                        <div className="flex flex-col items-center gap-1.5">
                            <div
                                className={`
                                    w-9 h-9 rounded-full flex items-center justify-center
                                    text-sm font-semibold transition-all duration-[var(--vdna-transition-base)]
                                    ${isCompleted
                                        ? "wire-gradient text-white shadow-sm"
                                        : isActive
                                            ? "bg-deep-green text-white shadow-md ring-4 ring-deep-green/15"
                                            : "bg-border-default text-text-muted"
                                    }
                                    ${isActive ? "animate-scale-in" : ""}
                                `}
                                style={isActive ? { animation: "pulseGlow 2.5s ease-in-out infinite, scaleIn 0.3s ease-out" } : undefined}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            <span
                                className={`
                                    text-xs font-medium whitespace-nowrap
                                    transition-colors duration-[var(--vdna-transition-base)]
                                    ${isActive
                                        ? "text-deep-green"
                                        : isCompleted
                                            ? "text-bright-green"
                                            : "text-text-muted"
                                    }
                                `}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Connector line (not after last step) */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 mx-2 mt-[-18px] relative">
                                {/* Background track */}
                                <div className="h-0.5 rounded-full bg-border-default" />
                                {/* Animated gradient fill */}
                                <div
                                    className={`
                                        absolute inset-0 h-0.5 rounded-full
                                        transition-all duration-700 ease-out
                                        ${isCompleted
                                            ? "wire-gradient opacity-100"
                                            : "opacity-0"
                                        }
                                    `}
                                    style={isCompleted ? {
                                        background: "linear-gradient(90deg, #32B7BE, #46B384)",
                                        backgroundSize: "200% 100%",
                                        animation: "gradientFlow 3s ease-in-out infinite",
                                    } : undefined}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
