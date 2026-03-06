interface StepperProps {
    steps: string[];
    currentStep: number;
}

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
                `}
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
                            <div
                                className={`
                  flex-1 h-0.5 mx-2 mt-[-18px] rounded-full
                  transition-all duration-[var(--vdna-transition-slow)]
                  ${isCompleted ? "wire-gradient" : "bg-border-default"}
                `}
                            />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
