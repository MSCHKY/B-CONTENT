import { useAppStore } from "@/stores";
import { AppShell } from "@/components/layout/app-shell";
import { CreateFlow } from "@/components/create/create-flow";
import { KnowledgeViewer } from "@/components/knowledge/knowledge-viewer";
import { Library } from "@/components/library/library";

export function App() {
    const view = useAppStore((s) => s.view);

    return (
        <AppShell>
            {view === "create" && <CreateFlow />}
            {view === "knowledge" && <KnowledgeViewer />}
            {view === "library" && <Library />}
            {view === "stats" && <PlaceholderView title="Stats" emoji="📊" description="4:1 Ratio Tracker — coming in Phase 2" />}
        </AppShell>
    );
}

function PlaceholderView({ title, emoji, description }: { title: string; emoji: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <span className="text-6xl mb-4">{emoji}</span>
            <h1 className="text-2xl font-semibold text-text-primary mb-2">{title}</h1>
            <p className="text-text-secondary max-w-md">{description}</p>
        </div>
    );
}
