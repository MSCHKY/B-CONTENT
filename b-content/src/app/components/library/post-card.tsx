import { INSTANCE_LABELS, STATUS_VARIANTS } from "@shared/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Copy, Download, Trash2, Archive, RotateCcw } from "lucide-react";
import { useTranslation } from "@/i18n";
import type { PostRecord } from "./types";

interface PostCardProps {
    post: PostRecord;
    isExpanded: boolean;
    onToggle: () => void;
    onCopyText: (text: string) => void;
    onDownloadImage: (url: string, instance: string) => void;
    onStatusChange: (postId: string, newStatus: string) => void;
    onArchive: (postId: string) => void;
    onRestore: (postId: string) => void;
    onPurge: (postId: string) => void;
    statusOptions: Array<{ value: string; label: string }>;
}

export function PostCard({
    post,
    isExpanded,
    onToggle,
    onCopyText,
    onDownloadImage,
    onStatusChange,
    onArchive,
    onRestore,
    onPurge,
    statusOptions,
}: PostCardProps) {
    const { t } = useTranslation();

    const dateStr = new Date(post.created_at + "Z").toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="glass-card rounded-xl overflow-hidden hover-lift">
            {/* Post Header — always visible */}
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-4 text-left cursor-pointer"
            >
                {/* Image thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-bg-card-hover flex-shrink-0 overflow-hidden">
                    {post.image?.url ? (
                        <img
                            src={post.image.url}
                            alt=""
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                <span className={`text-text-muted text-lg flex-shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                </span>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
                <div className="border-t border-border-default/50 p-4 expand-enter">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Full text */}
                        <div>
                            <h4 className="text-sm font-semibold text-text-primary mb-2">{t.create.result.postText}</h4>
                            <div className="bg-bg-primary/80 rounded-lg p-3 text-sm text-text-secondary whitespace-pre-wrap max-h-64 overflow-y-auto backdrop-blur-sm">
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
                                    <h4 className="text-sm font-semibold text-text-primary mb-2">{t.create.result.postImage}</h4>
                                    <img
                                        src={post.image.url}
                                        alt="Generated post image"
                                        className="w-full rounded-lg border border-border-default/50 transition-transform duration-300 hover:scale-[1.02]"
                                    />
                                    <p className="text-xs text-text-muted mt-1">
                                        {post.image.width}×{post.image.height} · {post.image.format}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-default/50">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onCopyText(post.text)}
                        >
                            <Copy size={14} className="mr-1" /> {t.library.copyText}
                        </Button>
                        {post.image?.url && (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                    onDownloadImage(post.image!.url, post.instance)
                                }
                            >
                                <Download size={14} className="mr-1" /> {t.library.downloadImage}
                            </Button>
                        )}
                        {post.status !== "archived" && (
                            <Select
                                options={statusOptions.slice(1, -1)}
                                value={post.status}
                                onChange={(e) =>
                                    onStatusChange(post.id, e.target.value)
                                }
                            />
                        )}
                        <div className="flex-1" />
                        {post.status === "archived" ? (
                            <>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onRestore(post.id)}
                                >
                                    <RotateCcw size={14} className="mr-1" /> {t.library.restore}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onPurge(post.id)}
                                >
                                    <Trash2 size={14} className="mr-1 text-red-400" /> {t.library.purge}
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onArchive(post.id)}
                                title={t.library.archive}
                            >
                                <Archive size={14} />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
