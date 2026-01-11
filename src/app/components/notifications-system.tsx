import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth-system";
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  X,
  Check,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "remix" | "challenge";
  userId: string;
  username: string;
  profilePic?: string;
  targetId: string;
  targetName?: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: any;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = () => {
    if (!user) return;

    try {
      const notificationsStr = localStorage.getItem("notifications");
      const allNotifications: Notification[] = notificationsStr
        ? JSON.parse(notificationsStr)
        : [];

      // Filter notifications for current user
      const userNotifications = allNotifications
        .filter((n) => n.userId === user.id)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 20); // Show last 20

      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const markAsRead = (notificationId: string) => {
    try {
      const notificationsStr = localStorage.getItem("notifications");
      const allNotifications: Notification[] = notificationsStr
        ? JSON.parse(notificationsStr)
        : [];

      const index = allNotifications.findIndex((n) => n.id === notificationId);
      if (index !== -1) {
        allNotifications[index].read = true;
        localStorage.setItem("notifications", JSON.stringify(allNotifications));
        loadNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = () => {
    if (!user) return;

    try {
      const notificationsStr = localStorage.getItem("notifications");
      const allNotifications: Notification[] = notificationsStr
        ? JSON.parse(notificationsStr)
        : [];

      allNotifications.forEach((n) => {
        if (n.userId === user.id && !n.read) {
          n.read = true;
        }
      });

      localStorage.setItem("notifications", JSON.stringify(allNotifications));
      loadNotifications();
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = (notificationId: string) => {
    try {
      const notificationsStr = localStorage.getItem("notifications");
      const allNotifications: Notification[] = notificationsStr
        ? JSON.parse(notificationsStr)
        : [];

      const filtered = allNotifications.filter((n) => n.id !== notificationId);
      localStorage.setItem("notifications", JSON.stringify(filtered));
      loadNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
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

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-400" />;
      case "comment":
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-400" />;
      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/60 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-[#18181b] border border-white/10 rounded-xl shadow-xl z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-white/60 hover:text-white transition-colors font-['IBM_Plex_Mono']"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setSettingsOpen(true)}
                className="p-1 text-white/60 hover:text-white transition-colors"
                aria-label="Notification settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/60">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-white/40 hover:text-primary transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to create notifications
export function createNotification(
  notification: Omit<Notification, "id" | "timestamp" | "read">
) {
  try {
    const notificationsStr = localStorage.getItem("notifications");
    const notifications: Notification[] = notificationsStr
      ? JSON.parse(notificationsStr)
      : [];

    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    notifications.push(newNotification);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Show toast for important notifications
    toast.info(notification.message);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

