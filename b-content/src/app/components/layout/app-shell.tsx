import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-dvh bg-bg-primary">
            <Sidebar />
            <main className="md:ml-20 lg:ml-56 min-w-0 pb-20 md:pb-0 bg-ambient overflow-x-clip relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
                    <div className="animate-fade-in-up">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
