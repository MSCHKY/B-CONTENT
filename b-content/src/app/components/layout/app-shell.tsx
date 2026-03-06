import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex min-h-dvh bg-bg-primary">
            <Sidebar />
            <main className="flex-1 min-w-0 pb-20 md:pb-0">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
