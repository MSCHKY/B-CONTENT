import { useCreateStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import instancesData from "@data/instances/instances.json";

interface ContentTypeData {
    id: string;
    label: string;
    beschreibung?: string;
    char_range: { min: number; max: number };
    frequenz: string;
}

// instances.json is keyed by id
const instances = instancesData as Record<
    string,
    { id: string; name: string; content_types: ContentTypeData[] }
>;

export function ContentTypePicker() {
    // ⚡ Bolt: Use useShallow to prevent ContentTypePicker from re-rendering on every keystroke in TopicInput
    const { instance, contentType, selectContentType, prevStep } =
        useCreateStore(
            useShallow((state) => ({
                instance: state.instance,
                contentType: state.contentType,
                selectContentType: state.selectContentType,
                prevStep: state.prevStep,
            }))
        );

    if (!instance) return null;

    const instanceData = instances[instance];
    if (!instanceData) return null;

    const contentTypes = instanceData.content_types;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Button variant="ghost" size="sm" onClick={prevStep}>
                    ← Back
                </Button>
                <p className="text-text-secondary">
                    Select a content type for{" "}
                    <span className="font-semibold wire-gradient-text">
                        {instanceData.name}
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
                {contentTypes.map((ct) => (
                    <Card
                        key={ct.id}
                        selected={contentType === ct.id}
                        onClick={() => selectContentType(ct.id)}
                        className="group"
                    >
                        <CardBody>
                            <h3 className="font-semibold text-text-primary mb-1 group-hover:text-deep-green transition-colors">
                                {ct.label}
                            </h3>
                            {ct.beschreibung && (
                                <p className="text-sm text-text-secondary mb-3">
                                    {ct.beschreibung}
                                </p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="default">
                                    {ct.char_range.min}–{ct.char_range.max} chars
                                </Badge>
                                <Badge variant="muted">{ct.frequenz}</Badge>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
