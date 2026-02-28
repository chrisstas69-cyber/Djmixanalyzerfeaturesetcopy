/**
 * Database Schemas
 * 
 * These schemas define the data structure for MongoDB/Supabase.
 * In production, these would be enforced by the database.
 */

export interface UserSchema {
  _id?: string;
  id: string;
  email: string;
  username: string;
  passwordHash: string; // bcrypt hash
  profilePic?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  isPremium: boolean;
  premiumExpiresAt?: Date;
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    publicProfile: boolean;
    defaultPrivacy: "public" | "private" | "unlisted";
  };
  stats: {
    mixesCreated: number;
    tracksCreated: number;
    totalLikes: number;
    totalComments: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface TrackSchema {
  _id?: string;
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  duration: string; // "5:30"
  energy: string;
  version: "A" | "B" | "C";
  status: "NOW PLAYING" | "UP NEXT" | "READY" | "PLAYED" | null;
  artwork?: string;
  dateAdded: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Creator ID
  waveformData?: number[]; // Array of amplitude values
  audioFileUrl?: string; // S3/Cloudinary URL
  stemUrls?: {
    drums?: string;
    bass?: string;
    vocals?: string;
    synth?: string;
  };
  metadata: {
    genre?: string;
    tags?: string[];
    mood?: string;
    harmonic?: string;
  };
  isPublic: boolean;
  likes: string[]; // Array of user IDs
  comments: string[]; // Array of comment IDs
}

export interface MixSchema {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  tracks: Array<{
    trackId: string;
    order: number;
    startTime?: number; // Offset in seconds
    fadeIn?: number;
    fadeOut?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Creator ID
  isPublic: boolean;
  isRemix: boolean;
  originalMixId?: string; // If this is a remix
  remixChain?: string[]; // Array of mix IDs showing remix lineage
  likes: string[]; // Array of user IDs
  comments: string[]; // Array of comment IDs
  plays: number;
  shares: number;
  metadata: {
    totalDuration: number;
    avgBPM?: number;
    keyProgression?: string[];
    energyCurve?: number[];
  };
}

export interface CommentSchema {
  _id?: string;
  id: string;
  userId: string;
  targetType: "mix" | "track";
  targetId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  edited: boolean;
  likes: string[]; // Array of user IDs
  replies?: string[]; // Array of comment IDs (nested comments)
  parentCommentId?: string; // If this is a reply
}

export interface NotificationSchema {
  _id?: string;
  id: string;
  userId: string; // Recipient
  type: "like" | "comment" | "follow" | "mention" | "remix" | "challenge";
  actorId: string; // User who triggered the notification
  targetType?: "mix" | "track" | "comment" | "user";
  targetId?: string;
  message: string;
  createdAt: Date;
  read: boolean;
  readAt?: Date;
}

export interface ChallengeSchema {
  _id?: string;
  id: string;
  name: string;
  description: string;
  sourceMixId: string; // The mix to remix
  creatorId: string;
  deadline: Date;
  prize?: string;
  status: "active" | "voting" | "ended";
  entries: Array<{
    mixId: string;
    userId: string;
    votes: number;
    submittedAt: Date;
  }>;
  winnerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivitySchema {
  _id?: string;
  id: string;
  type: "like" | "comment" | "follow" | "mix_created" | "track_created" | "remix";
  userId: string;
  targetType?: "mix" | "track" | "user";
  targetId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Database Indexes (for MongoDB)
 * These should be created for optimal query performance
 */
export const DatabaseIndexes = {
  users: [
    { email: 1 }, // Unique index
    { username: 1 }, // Unique index
    { "stats.followersCount": -1 }, // For leaderboards
    { createdAt: -1 }, // For recent users
  ],
  tracks: [
    { userId: 1 },
    { isPublic: 1, createdAt: -1 }, // For public feed
    { "metadata.tags": 1 }, // For tag search
    { bpm: 1 }, // For BPM filtering
    { key: 1 }, // For key filtering
  ],
  mixes: [
    { userId: 1 },
    { isPublic: 1, createdAt: -1 },
    { isRemix: 1, originalMixId: 1 }, // For remix chains
    { plays: -1 }, // For popular mixes
    { likes: -1 }, // For trending
  ],
  comments: [
    { targetType: 1, targetId: 1, createdAt: -1 }, // For comment threads
    { userId: 1 },
  ],
  notifications: [
    { userId: 1, read: 1, createdAt: -1 }, // For user notifications
  ],
  challenges: [
    { status: 1, deadline: 1 }, // For active challenges
    { creatorId: 1 },
  ],
  activities: [
    { userId: 1, createdAt: -1 }, // For activity feed
    { type: 1, createdAt: -1 }, // For activity filtering
  ],
};

