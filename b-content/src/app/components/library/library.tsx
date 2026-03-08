import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "@/i18n";
import type { PostRecord } from "./types";
import { PostCard } from "./post-card";

export function Library() {
    const [posts, setPosts] = useState<PostRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterInstance, setFilterInstance] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [expandedPost, setExpandedPost] = useState<string | null>(null);
    const { t } = useTranslation();

    const instanceOptions = [
        { value: "", label: t.library.allInstances },
        { value: "alex", label: "Jürgen Alex" },
        { value: "ablas", label: "Sebastian Ablas" },
        { value: "bwg", label: "BWG Company" },
    ];

    const statusOptions = [
        { value: "", label: t.library.allStatuses },
        { value: "draft", label: t.library.statusLabels.draft },
        { value: "review", label: t.library.statusLabels.review },
        { value: "approved", label: t.library.statusLabels.approved },
        { value: "published", label: t.library.statusLabels.published },
        { value: "archived", label: t.library.statusLabels.archived },
    ];

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
            setError(t.common.error);
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
            fetchPosts();
        } catch (err) {
            console.error("[handleStatusChange]", err);
            setError(t.common.actionFailed);
        }
    };

    const handleArchive = async (postId: string) => {
        if (!confirm(t.library.confirmArchive)) return;
        try {
            await fetch(`/api/posts/${postId}`, { method: "DELETE" });
            fetchPosts();
        } catch (err) {
            console.error("[handleArchive]", err);
            setError(t.common.actionFailed);
        }
    };

    const handleRestore = async (postId: string) => {
        try {
            await fetch(`/api/posts/${postId}/restore`, { method: "POST" });
            fetchPosts();
        } catch (err) {
            console.error("[handleRestore]", err);
            setError(t.common.actionFailed);
        }
    };

    const handlePurge = async (postId: string) => {
        if (!confirm(t.library.confirmPurge)) return;
        try {
            await fetch(`/api/posts/${postId}/purge`, { method: "DELETE" });
            fetchPosts();
        } catch (err) {
            console.error("[handlePurge]", err);
            setError(t.common.actionFailed);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-8 h-8 border-2 border-crisp-cyan/30 border-t-crisp-cyan rounded-full" style={{ animation: "gentleSpin 0.8s linear infinite" }} />
                <span className="text-text-muted text-sm">{t.common.loading}</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-xl font-semibold text-text-primary section-header">
                        {t.library.title}
                    </h2>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchPosts}>
                    <RefreshCw size={14} className="mr-1" /> {t.library.refresh}
                </Button>
            </div>
            <hr className="gradient-line mb-3" />
            <p className="text-sm text-text-muted mb-6">
                {t.library.subtitle}
            </p>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <Select
                    label={t.library.filterInstance}
                    options={instanceOptions}
                    value={filterInstance}
                    onChange={(e) => setFilterInstance(e.target.value)}
                />
                <Select
                    label={t.library.filterStatus}
                    options={statusOptions}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                />
            </div>

            {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 mb-6 text-sm text-red-400 animate-fade-in-up">
                    {error}
                </div>
            )}

            {/* Post List */}
            {posts.length === 0 ? (
                <div className="text-center py-16 animate-fade-in-up">
                    <span className="text-5xl block mb-4">📭</span>
                    <p className="text-text-muted text-lg">{t.library.noPosts}</p>
                    <p className="text-text-muted text-sm mt-2">
                        {t.library.noPostsHint}
                    </p>
                </div>
            ) : (
                <div className="space-y-4 stagger-children">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            isExpanded={expandedPost === post.id}
                            onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                            onCopyText={handleCopyText}
                            onDownloadImage={handleDownloadImage}
                            onStatusChange={handleStatusChange}
                            onArchive={handleArchive}
                            onRestore={handleRestore}
                            onPurge={handlePurge}
                            statusOptions={statusOptions}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
