import { useAppStore } from "@/stores";
import { AppShell } from "@/components/layout/app-shell";
import { CreateFlow } from "@/components/create/create-flow";
import { KnowledgeViewer } from "@/components/knowledge/knowledge-viewer";
import { Library } from "@/components/library/library";
import { Orchestrate } from "@/components/orchestrate/orchestrate";
import { Stats } from "@/components/stats/stats";
import { CalendarView } from "@/components/calendar/calendar-view";
import { InterviewView } from "@/components/interview/interview-view";

export function App() {
    const view = useAppStore((s) => s.view);

    return (
        <AppShell>
            {view === "create" && <CreateFlow />}
            {view === "knowledge" && <KnowledgeViewer />}
            {view === "interview" && <InterviewView />}
            {view === "library" && <Library />}
            {view === "calendar" && <CalendarView />}
            {view === "orchestrate" && <Orchestrate />}
            {view === "stats" && <Stats />}
        </AppShell>
    );
}
