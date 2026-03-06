import { useAppStore } from "@/stores";
import type { AppView } from "@/types";

interface NavItem {
    id: AppView;
    icon: string;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: "create", icon: "✨", label: "Create" },
    { id: "knowledge", icon: "🧠", label: "Knowledge" },
    { id: "library", icon: "📚", label: "Library" },
    { id: "stats", icon: "📊", label: "Stats" },
];

export function Sidebar() {
    const { view, setView } = useAppStore();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-20 lg:w-56 h-dvh bg-bg-sidebar sticky top-0 shrink-0">
                {/* Logo Area */}
                <div className="flex items-center justify-center lg:justify-start gap-3 px-4 h-16 border-b border-white/10">
                    <div className="w-8 h-8 rounded-full wire-gradient flex items-center justify-center">
                        <span className="text-white text-sm font-bold">B</span>
                    </div>
                    <span className="hidden lg:block text-text-on-dark font-semibold text-sm tracking-wide">
                        B/CONTENT
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-1 p-2 mt-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = view === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`
                  flex items-center gap-3 px-3 py-2.5
                  rounded-lg text-left
                  transition-all duration-[var(--vdna-transition-fast)]
                  cursor-pointer
                  ${isActive
                                        ? "wire-gradient text-white shadow-md"
                                        : "text-text-on-dark/70 hover:text-text-on-dark hover:bg-white/8"
                                    }
                `}
                            >
                                <span className="text-xl w-8 text-center">{item.icon}</span>
                                <span className="hidden lg:block text-sm font-medium">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-white/10">
                    <div className="hidden lg:flex items-center gap-2 text-text-on-dark/40 text-xs">
                        <span>BenderWire Group</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-sidebar border-t border-white/10">
                <div className="flex items-center justify-around h-16 px-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = view === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id)}
                                className={`
                  flex flex-col items-center gap-0.5 px-3 py-1.5
                  rounded-lg min-w-[60px]
                  transition-all duration-[var(--vdna-transition-fast)]
                  cursor-pointer
                  ${isActive
                                        ? "text-bright-green"
                                        : "text-text-on-dark/60 hover:text-text-on-dark"
                                    }
                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
