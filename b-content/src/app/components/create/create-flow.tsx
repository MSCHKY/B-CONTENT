import { useCreateStore } from "@/stores";
import { Stepper } from "@/components/ui/stepper";
import { InstancePicker } from "./instance-picker";
import { ContentTypePicker } from "./content-type-picker";
import { TopicInput } from "./topic-input";
import { ResultEditor } from "./result-editor";
import { Button } from "@/components/ui/button";

const STEPS = ["Instance", "Content Type", "Input", "Result"];

export function CreateFlow() {
    const { step, reset } = useCreateStore();

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-semibold text-text-primary">
                    Create Content
                </h1>
                {step > 1 && (
                    <Button variant="ghost" size="sm" onClick={reset}>
                        ↺ Start Over
                    </Button>
                )}
            </div>

            {/* Stepper */}
            <Stepper steps={STEPS} currentStep={step} />

            {/* Step Content */}
            <div className="mt-6">
                {step === 1 && <InstancePicker />}
                {step === 2 && <ContentTypePicker />}
                {step === 3 && <TopicInput />}
                {step === 4 && <ResultEditor />}
            </div>
        </div>
    );
}
