import { useState, useEffect } from "react";
import { useAuth } from "./auth-system";
import {
  Heart,
  MessageSquare,
  UserPlus,
  PlaySquare,
  Music,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface Activity {
  id: string;
  type: "like" | "comment" | "follow" | "mix_created" | "track_created";
  userId: string;
  username: string;
  profilePic?: string;
  targetId: string;
  targetName?: string;
  timestamp: string;
  metadata?: any;
}

export function ActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadActivityFeed();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadActivityFeed = () => {
    try {
      // Load activities from localStorage
      const activitiesStr = localStorage.getItem("activityFeed");
      const allActivities: Activity[] = activitiesStr
        ? JSON.parse(activitiesStr)
        : [];

      if (!user) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Filter activities from users that current user follows
      const followingIds = user.following || [];
      const relevantActivities = allActivities.filter(
        (activity) =>
          followingIds.includes(activity.userId) ||
          activity.userId === user.id
      );

      // Sort by timestamp (newest first)
      relevantActivities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(relevantActivities.slice(0, 50)); // Limit to 50 most recent
      setLoading(false);
    } catch (error) {
      console.error("Error loading activity feed:", error);
      setLoading(false);
    }
  };

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

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-400" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-400" />;
      case "mix_created":
        return <PlaySquare className="w-4 h-4 text-primary" />;
      case "track_created":
        return <Music className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-white/40" />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "like":
        return (
          <span>
            <span className="font-semibold text-white">{activity.username}</span>
            <span className="text-white/60"> liked </span>
            <span className="font-semibold text-white">
              {activity.targetName || "a mix"}
            </span>
          </span>
        );
      case "comment":
        return (
          <span>
            <span className="font-semibold text-white">{activity.username}</span>
            <span className="text-white/60"> commented on </span>
            <span className="font-semibold text-white">
              {activity.targetName || "a mix"}
            </span>
          </span>
        );
      case "follow":
        return (
          <span>
            <span className="font-semibold text-white">{activity.username}</span>
            <span className="text-white/60"> started following you</span>
          </span>
        );
      case "mix_created":
        return (
          <span>
            <span className="font-semibold text-white">{activity.username}</span>
            <span className="text-white/60"> created a new mix: </span>
            <span className="font-semibold text-white">
              {activity.targetName || "Untitled Mix"}
            </span>
          </span>
        );
      case "track_created":
        return (
          <span>
            <span className="font-semibold text-white">{activity.username}</span>
            <span className="text-white/60"> created a new track: </span>
            <span className="font-semibold text-white">
              {activity.targetName || "Untitled Track"}
            </span>
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <UserPlus className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 mb-2">Sign in to see your activity feed</p>
          <p className="text-sm text-white/40">
            Follow other users to see their activity here
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-white/60">Loading activity feed...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
          Activity Feed
        </h1>
        <p className="text-xs text-white/40">
          Latest activity from users you follow
        </p>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-3">
          {activities.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 mb-2">No activity yet</p>
              <p className="text-sm text-white/40">
                Follow other users to see their activity in your feed
              </p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.profilePic ? (
                      <img
                        src={activity.profilePic}
                        alt={activity.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-primary font-['IBM_Plex_Mono']">
                        {activity.username[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getActivityIcon(activity.type)}
                          {getActivityText(activity)}
                        </div>
                        <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                          {formatTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to add activity to feed
export function addActivity(activity: Omit<Activity, "id" | "timestamp">) {
  try {
    const activitiesStr = localStorage.getItem("activityFeed");
    const activities: Activity[] = activitiesStr
      ? JSON.parse(activitiesStr)
      : [];

    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
    };

    activities.push(newActivity);
    localStorage.setItem("activityFeed", JSON.stringify(activities));
  } catch (error) {
    console.error("Error adding activity:", error);
  }
}

