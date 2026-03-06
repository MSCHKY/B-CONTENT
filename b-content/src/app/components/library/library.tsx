import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

// --- Types matching D1 response ---

interface PostRecord {
    id: string;
    instance: string;
    content_type: string;
    topic_fields: string[];
    text: string;
    language: string;
    hashtags: string[];
    char_count: number;
    is_personal: number;
    status: string;
    image_id: string | null;
    created_at: string;
    updated_at: string;
    image?: {
        id: string;
        format: string;
        width: number;
        height: number;
        url: string;
    };
}

const instanceOptions = [
    { value: "", label: "All Instances" },
    { value: "alex", label: "Jürgen Alex" },
    { value: "ablas", label: "Sebastian Ablas" },
    { value: "bwg", label: "BWG Company" },
];

const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "published", label: "Published" },
];

const INSTANCE_LABELS: Record<string, string> = {
    alex: "Jürgen Alex",
    ablas: "Sebastian Ablas",
    bwg: "BWG",
};

const STATUS_VARIANTS: Record<string, "default" | "accent" | "warning" | "muted"> = {
    draft: "muted",
    review: "warning",
    approved: "accent",
    published: "default",
};

export function Library() {
    const [posts, setPosts] = useState<PostRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterInstance, setFilterInstance] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [expandedPost, setExpandedPost] = useState<string | null>(null);

    // Fetch posts from API
    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filterInstance) params.set("instance", filterInstance);
            if (filterStatus) params.set("status", filterStatus);
            params.set("limit", "50");

            const response = await fetch(`/api/posts?${params}`);
            const data = (await response.json()) as { posts: PostRecord[]; error?: string };

            if (data.error) {
                setError(data.error);
            } else {
                setPosts(data.posts ?? []);
            }
        } catch {
            setError("Failed to load posts. Make sure the Worker is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [filterInstance, filterStatus]);

    const handleCopyText = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };

    const handleDownloadImage = (url: string, instance: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${instance}-post-image.png`;
        a.click();
    };

    const handleStatusChange = async (postId: string, newStatus: string) => {
        try {
            await fetch(`/api/posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchPosts(); // Refresh
        } catch {
            // Silent fail
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm("Delete this post?")) return;
        try {
            await fetch(`/api/posts/${postId}`, { method: "DELETE" });
            fetchPosts();
        } catch {
            // Silent fail
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-muted animate-pulse">Loading Library...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary">📚 Content Library</h2>
                    <p className="text-sm text-text-muted mt-1">
                        {posts.length} post{posts.length !== 1 ? "s" : ""} generated
                    </p>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchPosts}>
                    🔄 Refresh
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <Select
                    label="Instance"
                    options={instanceOptions}
                    value={filterInstance}
                    onChange={(e) => setFilterInstance(e.target.value)}
                />
                <Select
                    label="Status"
                    options={statusOptions}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                />
            </div>

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 mb-6 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Post List */}
            {posts.length === 0 ? (
                <div className="text-center py-16">
                    <span className="text-5xl block mb-4">📭</span>
                    <p className="text-text-muted text-lg">No posts yet</p>
                    <p className="text-text-muted text-sm mt-2">
                        Generated content will appear here after you save it from the Create flow.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => {
                        const isExpanded = expandedPost === post.id;
                        const dateStr = new Date(post.created_at + "Z").toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        return (
                            <div
                                key={post.id}
                                className="rounded-xl border border-border-default bg-bg-card hover:border-border-active transition-colors overflow-hidden"
                            >
                                {/* Post Header — always visible */}
                                <button
                                    onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                                    className="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
                                >
                                    {/* Image thumbnail */}
                                    <div className="w-16 h-16 rounded-lg bg-bg-card-hover flex-shrink-0 overflow-hidden">
                                        {post.image?.url ? (
                                            <img
                                                src={post.image.url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl text-text-muted">
                                                📝
                                            </div>
                                        )}
                                    </div>

                                    {/* Post meta */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={STATUS_VARIANTS[post.status] ?? "muted"}>
                                                {post.status}
                                            </Badge>
                                            <Badge variant="accent">
                                                {INSTANCE_LABELS[post.instance] ?? post.instance}
                                            </Badge>
                                            <Badge variant="muted">{post.content_type}</Badge>
                                        </div>
                                        <p className="text-sm text-text-primary truncate">
                                            {post.text.slice(0, 120)}
                                            {post.text.length > 120 ? "..." : ""}
                                        </p>
                                        <p className="text-xs text-text-muted mt-1">
                                            {dateStr} · {post.char_count} chars · {post.language.toUpperCase()}
                                        </p>
                                    </div>

                                    {/* Expand arrow */}
                                    <span className="text-text-muted text-lg flex-shrink-0">
                                        {isExpanded ? "▲" : "▼"}
                                    </span>
                                </button>

                                {/* Expanded detail */}
                                {isExpanded && (
                                    <div className="border-t border-border-default p-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {/* Full text */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-text-primary mb-2">Full Text</h4>
                                                <div className="bg-bg-primary rounded-lg p-3 text-sm text-text-secondary whitespace-pre-wrap max-h-64 overflow-y-auto">
                                                    {post.text}
                                                </div>
                                                {post.hashtags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {post.hashtags.map((tag, i) => (
                                                            <Badge key={i} variant="muted">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Image preview */}
                                            <div>
                                                {post.image?.url && (
                                                    <>
                                                        <h4 className="text-sm font-semibold text-text-primary mb-2">Image</h4>
                                                        <img
                                                            src={post.image.url}
                                                            alt="Generated post image"
                                                            className="w-full rounded-lg border border-border-default"
                                                        />
                                                        <p className="text-xs text-text-muted mt-1">
                                                            {post.image.width}×{post.image.height} · {post.image.format}
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-default">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleCopyText(post.text)}
                                            >
                                                📋 Copy Text
                                            </Button>
                                            {post.image?.url && (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDownloadImage(post.image!.url, post.instance)
                                                    }
                                                >
                                                    ⬇️ Download Image
                                                </Button>
                                            )}
                                            <Select
                                                options={statusOptions.slice(1)} // Remove "All" option
                                                value={post.status}
                                                onChange={(e) =>
                                                    handleStatusChange(post.id, e.target.value)
                                                }
                                            />
                                            <div className="flex-1" />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(post.id)}
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
