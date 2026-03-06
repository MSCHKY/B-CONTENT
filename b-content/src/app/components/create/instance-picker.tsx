import { useCreateStore } from "@/stores";
import { Card, CardBody } from "@/components/ui/card";
import type { InstanceId } from "@/types";
import instancesData from "@data/instances/instances.json";

interface InstanceDisplay {
    id: InstanceId;
    name: string;
    claim: string;
    mantelthema: string;
    icon: string;
}

// instances.json is an object keyed by id, not an array
const instances = instancesData as Record<
    string,
    { id: string; name: string; claim: string; mantelthema: string }
>;

const INSTANCE_CARDS: InstanceDisplay[] = Object.values(instances).map(
    (inst) => ({
        id: inst.id as InstanceId,
        name: inst.name,
        claim: inst.claim,
        mantelthema: inst.mantelthema,
        icon: inst.id === "bwg" ? "🏢" : "👤",
    })
);

export function InstancePicker() {
    const { instance, selectInstance } = useCreateStore();

    return (
        <div>
            <p className="text-text-secondary mb-6">
                Choose the voice for your content. Each instance has its own tonality,
                themes, and style.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {INSTANCE_CARDS.map((inst) => (
                    <Card
                        key={inst.id}
                        selected={instance === inst.id}
                        onClick={() => selectInstance(inst.id)}
                        className="text-center"
                    >
                        <CardBody className="py-8">
                            <span className="text-4xl block mb-3">{inst.icon}</span>
                            <h3 className="text-lg font-semibold text-text-primary mb-1">
                                {inst.name}
                            </h3>
                            <p className="text-sm text-crisp-cyan font-medium mb-3 italic">
                                &ldquo;{inst.claim}&rdquo;
                            </p>
                            <p className="text-xs text-text-muted">{inst.mantelthema}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
