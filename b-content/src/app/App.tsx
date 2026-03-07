import { useAppStore } from "@/stores";
import { AppShell } from "@/components/layout/app-shell";
import { CreateFlow } from "@/components/create/create-flow";
import { KnowledgeViewer } from "@/components/knowledge/knowledge-viewer";
import { Library } from "@/components/library/library";
import { Orchestrate } from "@/components/orchestrate/orchestrate";
import { Stats } from "@/components/stats/stats";

export function App() {
    const view = useAppStore((s) => s.view);

    return (
        <AppShell>
            {view === "create" && <CreateFlow />}
            {view === "knowledge" && <KnowledgeViewer />}
            {view === "library" && <Library />}
            {view === "orchestrate" && <Orchestrate />}
            {view === "stats" && <Stats />}
        </AppShell>
    );
}
