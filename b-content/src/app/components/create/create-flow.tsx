import { useCreateStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { Stepper } from "@/components/ui/stepper";
import { InstancePicker } from "./instance-picker";
import { ContentTypePicker } from "./content-type-picker";
import { TopicInput } from "./topic-input";
import { ResultEditor } from "./result-editor";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n";

export function CreateFlow() {
    // ⚡ Bolt: Use useShallow to prevent CreateFlow from re-rendering on every keystroke in TopicInput
    const { step, reset } = useCreateStore(
        useShallow((state) => ({ step: state.step, reset: state.reset }))
    );
    const { t } = useTranslation();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-semibold text-text-primary section-header">
                        {t.create.title}
                    </h1>
                </div>
                {step > 1 && (
                    <Button variant="ghost" size="sm" onClick={reset}>
                        {t.create.startOver}
                    </Button>
                )}
            </div>

            {/* Gradient Divider */}
            <hr className="gradient-line mb-4" />

            {/* Stepper */}
            <Stepper steps={[...t.create.steps]} currentStep={step} />

            {/* Step Content with animation */}
            <div className="mt-6 animate-fade-in-up" key={step}>
                {step === 1 && <InstancePicker />}
                {step === 2 && <ContentTypePicker />}
                {step === 3 && <TopicInput />}
                {step === 4 && <ResultEditor />}
            </div>
        </div>
    );
}
