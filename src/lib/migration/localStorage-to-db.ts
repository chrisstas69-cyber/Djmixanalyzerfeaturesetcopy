/**
 * Migration Utility: localStorage to Database
 * 
 * This utility helps migrate data from localStorage to a production database.
 * Run this once when moving from development to production.
 */

import { apiClient } from "../api/client";

export interface MigrationStats {
  users: number;
  tracks: number;
  mixes: number;
  comments: number;
  likes: number;
  notifications: number;
  errors: number;
}

/**
 * Migrate all localStorage data to the database
 */
export async function migrateLocalStorageToDatabase(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    users: 0,
    tracks: 0,
    mixes: 0,
    comments: 0,
    likes: 0,
    notifications: 0,
    errors: 0,
  };

  try {
    // Migrate users
    const usersStr = localStorage.getItem("users");
    if (usersStr) {
      const users = JSON.parse(usersStr);
      for (const user of users) {
        try {
          // Skip password - it should already be hashed in production
          const { password, ...userData } = user;
          await apiClient.signup(userData.email, password || "temp", userData.username);
          stats.users++;
        } catch (error) {
          console.error(`Failed to migrate user ${user.id}:`, error);
          stats.errors++;
        }
      }
    }

    // Migrate tracks
    const tracksStr = localStorage.getItem("libraryTracks");
    if (tracksStr) {
      const tracks = JSON.parse(tracksStr);
      for (const track of tracks) {
        try {
          await apiClient.createTrack(track);
          stats.tracks++;
        } catch (error) {
          console.error(`Failed to migrate track ${track.id}:`, error);
          stats.errors++;
        }
      }
    }

    // Migrate mixes
    const mixesStr = localStorage.getItem("userMixes");
    if (mixesStr) {
      const mixes = JSON.parse(mixesStr);
      for (const mix of mixes) {
        try {
          await apiClient.createMix(mix);
          stats.mixes++;
        } catch (error) {
          console.error(`Failed to migrate mix ${mix.id}:`, error);
          stats.errors++;
        }
      }
    }

    // Migrate comments
    const mixCommentsStr = localStorage.getItem("mixComments");
    const trackCommentsStr = localStorage.getItem("trackComments");
    
    if (mixCommentsStr) {
      const comments = JSON.parse(mixCommentsStr);
      for (const [itemId, commentList] of Object.entries(comments)) {
        for (const comment of commentList as any[]) {
          try {
            await apiClient.addComment("mix", itemId, comment.text);
            stats.comments++;
          } catch (error) {
            console.error(`Failed to migrate comment ${comment.id}:`, error);
            stats.errors++;
          }
        }
      }
    }

    if (trackCommentsStr) {
      const comments = JSON.parse(trackCommentsStr);
      for (const [itemId, commentList] of Object.entries(comments)) {
        for (const comment of commentList as any[]) {
          try {
            await apiClient.addComment("track", itemId, comment.text);
            stats.comments++;
          } catch (error) {
            console.error(`Failed to migrate comment ${comment.id}:`, error);
            stats.errors++;
          }
        }
      }
    }

    // Migrate likes
    const mixLikesStr = localStorage.getItem("mixLikes");
    const trackLikesStr = localStorage.getItem("trackLikes");
    
    if (mixLikesStr) {
      const likes = JSON.parse(mixLikesStr);
      for (const [itemId, likeList] of Object.entries(likes)) {
        for (const like of likeList as any[]) {
          try {
            await apiClient.likeItem("mix", itemId);
            stats.likes++;
          } catch (error) {
            console.error(`Failed to migrate like:`, error);
            stats.errors++;
          }
        }
      }
    }

    if (trackLikesStr) {
      const likes = JSON.parse(trackLikesStr);
      for (const [itemId, likeList] of Object.entries(likes)) {
        for (const like of likeList as any[]) {
          try {
            await apiClient.likeItem("track", itemId);
            stats.likes++;
          } catch (error) {
            console.error(`Failed to migrate like:`, error);
            stats.errors++;
          }
        }
      }
    }

    // Migrate notifications
    const notificationsStr = localStorage.getItem("notifications");
    if (notificationsStr) {
      const notifications = JSON.parse(notificationsStr);
      // Notifications are typically created server-side, so we might skip this
      // or create them as historical records
      stats.notifications = notifications.length;
    }

    console.log("Migration complete:", stats);
    return stats;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

/**
 * Backup localStorage data before migration
 */
export function backupLocalStorage(): string {
  const backup: Record<string, any> = {};
  
  const keys = [
    "users",
    "currentUser",
    "authToken",
    "libraryTracks",
    "userMixes",
    "mixLikes",
    "trackLikes",
    "mixComments",
    "trackComments",
    "notifications",
    "activityFeed",
    "favoriteTracks",
    "playbackHistory",
  ];

  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        backup[key] = JSON.parse(value);
      } catch {
        backup[key] = value;
      }
    }
  }

  const backupStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([backupStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `localStorage-backup-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  return backupStr;
}

