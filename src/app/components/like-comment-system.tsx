import { useState, useEffect } from "react";
import { useAuth } from "./auth-system";
import { Heart, MessageSquare, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export interface Like {
  userId: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  profilePic?: string;
  text: string;
  timestamp: string;
  edited?: boolean;
}

interface LikeCommentSystemProps {
  itemId: string;
  itemType: "mix" | "track";
  onUpdate?: () => void;
}

export function LikeCommentSystem({
  itemId,
  itemType,
  onUpdate,
}: LikeCommentSystemProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<Like[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    loadLikesAndComments();
  }, [itemId, itemType]);

  const loadLikesAndComments = () => {
    try {
      const likesKey = `${itemType}Likes`;
      const commentsKey = `${itemType}Comments`;

      const likesStr = localStorage.getItem(likesKey);
      const allLikes: Record<string, Like[]> = likesStr
        ? JSON.parse(likesStr)
        : {};
      setLikes(allLikes[itemId] || []);

      const commentsStr = localStorage.getItem(commentsKey);
      const allComments: Record<string, Comment[]> = commentsStr
        ? JSON.parse(commentsStr)
        : {};
      setComments(allComments[itemId] || []);
    } catch (error) {
      console.error("Error loading likes/comments:", error);
    }
  };

  const handleLike = () => {
    if (!user) {
      toast.error("Please sign in to like");
      return;
    }

    try {
      const likesKey = `${itemType}Likes`;
      const likesStr = localStorage.getItem(likesKey);
      const allLikes: Record<string, Like[]> = likesStr
        ? JSON.parse(likesStr)
        : {};

      if (!allLikes[itemId]) {
        allLikes[itemId] = [];
      }

      const existingLikeIndex = allLikes[itemId].findIndex(
        (l) => l.userId === user.id
      );

      if (existingLikeIndex !== -1) {
        // Unlike
        allLikes[itemId].splice(existingLikeIndex, 1);
        toast.success("Unliked");
      } else {
        // Like
        allLikes[itemId].push({
          userId: user.id,
          timestamp: new Date().toISOString(),
        });
        toast.success("Liked!");
      }

      localStorage.setItem(likesKey, JSON.stringify(allLikes));
      loadLikesAndComments();
      onUpdate?.();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to like");
    }
  };

  const handleAddComment = () => {
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    try {
      const commentsKey = `${itemType}Comments`;
      const commentsStr = localStorage.getItem(commentsKey);
      const allComments: Record<string, Comment[]> = commentsStr
        ? JSON.parse(commentsStr)
        : {};

      if (!allComments[itemId]) {
        allComments[itemId] = [];
      }

      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random()}`,
        userId: user.id,
        username: user.username,
        profilePic: user.profilePic,
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
      };

      allComments[itemId].push(newComment);
      localStorage.setItem(commentsKey, JSON.stringify(allComments));

      setCommentText("");
      loadLikesAndComments();
      onUpdate?.();
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!user) return;

    try {
      const commentsKey = `${itemType}Comments`;
      const commentsStr = localStorage.getItem(commentsKey);
      const allComments: Record<string, Comment[]> = commentsStr
        ? JSON.parse(commentsStr)
        : {};

      if (allComments[itemId]) {
        allComments[itemId] = allComments[itemId].filter(
          (c) => c.id !== commentId
        );
        localStorage.setItem(commentsKey, JSON.stringify(allComments));
        loadLikesAndComments();
        onUpdate?.();
        toast.success("Comment deleted");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleEditComment = (commentId: string, newText: string) => {
    if (!user) return;

    try {
      const commentsKey = `${itemType}Comments`;
      const commentsStr = localStorage.getItem(commentsKey);
      const allComments: Record<string, Comment[]> = commentsStr
        ? JSON.parse(commentsStr)
        : {};

      if (allComments[itemId]) {
        const comment = allComments[itemId].find((c) => c.id === commentId);
        if (comment && comment.userId === user.id) {
          comment.text = newText.trim();
          comment.edited = true;
          localStorage.setItem(commentsKey, JSON.stringify(allComments));
          loadLikesAndComments();
          setEditingCommentId(null);
          setEditText("");
          onUpdate?.();
          toast.success("Comment updated");
        }
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to edit comment");
    }
  };

  const isLiked = user && likes.some((l) => l.userId === user.id);
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-t border-white/5 pt-4 mt-4">
      {/* Like Button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            isLiked
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
            strokeWidth={isLiked ? 0 : 1.5}
          />
          <span className="text-sm font-['IBM_Plex_Mono']">
            {likes.length}
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-['IBM_Plex_Mono']">
            {comments.length}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* Add Comment */}
          {user && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-primary font-['IBM_Plex_Mono']">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="bg-white/5 border-white/10 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  onClick={handleAddComment}
                  size="sm"
                  className="mt-2 bg-primary hover:bg-primary/80 text-white h-7"
                  disabled={!commentText.trim()}
                >
                  <Send className="w-3 h-3 mr-1.5" />
                  Post
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-white/40 text-center py-4">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((comment) => {
                const isOwnComment = user?.id === comment.userId;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      {comment.profilePic ? (
                        <img
                          src={comment.profilePic}
                          alt={comment.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-primary font-['IBM_Plex_Mono']">
                          {comment.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {comment.username}
                        </span>
                        {comment.edited && (
                          <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                            (edited)
                          </span>
                        )}
                        <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                          {formatTime(comment.timestamp)}
                        </span>
                      </div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            autoFocus
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                handleEditComment(comment.id, editText)
                              }
                              size="sm"
                              className="bg-primary hover:bg-primary/80 text-white h-7"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditText("");
                              }}
                              size="sm"
                              variant="outline"
                              className="bg-white/5 border-white/10 text-white h-7"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-white/70">{comment.text}</p>
                      )}
                    </div>
                    {isOwnComment && !isEditing && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditText(comment.text);
                          }}
                          className="p-1 text-white/40 hover:text-white transition-colors"
                          title="Edit comment"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete comment"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

