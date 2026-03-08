import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary — catches render crashes and shows a recovery UI
 * instead of a white screen. Wrap the root <App /> in this.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    padding: "2rem",
                    background: "#0a0f14",
                    color: "#94a3b8",
                    fontFamily: "system-ui, sans-serif",
                    textAlign: "center",
                }}>
                    <div style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: "12px",
                        padding: "2rem",
                        maxWidth: "480px",
                    }}>
                        <h2 style={{ color: "#f87171", fontSize: "1.25rem", marginBottom: "0.75rem" }}>
                            Something went wrong
                        </h2>
                        <p style={{ fontSize: "0.875rem", marginBottom: "1rem", lineHeight: 1.5 }}>
                            An unexpected error occurred. Please reload the page.
                        </p>
                        {this.state.error && (
                            <pre style={{
                                fontSize: "0.75rem",
                                background: "rgba(0,0,0,0.3)",
                                padding: "0.75rem",
                                borderRadius: "8px",
                                overflow: "auto",
                                maxHeight: "120px",
                                textAlign: "left",
                                color: "#f87171",
                                marginBottom: "1rem",
                            }}>
                                {this.state.error.message}
                            </pre>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: "rgba(239, 68, 68, 0.2)",
                                border: "1px solid rgba(239, 68, 68, 0.4)",
                                borderRadius: "8px",
                                padding: "0.5rem 1.5rem",
                                color: "#f87171",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                            }}
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
