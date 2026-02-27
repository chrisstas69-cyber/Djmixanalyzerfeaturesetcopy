import { useState, useEffect } from "react";
import { useAuth } from "./auth-system";
import { User, Calendar, Music, PlaySquare, Users, Heart, MessageSquare, Share2, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface PublicUser {
  id: string;
  username: string;
  email: string;
  profilePic?: string;
  bio?: string;
  createdAt: string;
  followers: string[];
  following: string[];
  isPremium: boolean;
}

interface Mix {
  id: string;
  name: string;
  tracks: any[];
  createdAt: string;
  likes: string[];
  comments: any[];
  userId: string;
}

export function UserProfilePublic({ userId }: { userId: string }) {
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<PublicUser | null>(null);
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      // Load user from localStorage
      const usersStr = localStorage.getItem("users");
      const users: PublicUser[] = usersStr ? JSON.parse(usersStr) : [];
      const foundUser = users.find((u) => u.id === userId);

      if (foundUser) {
        const { password: _, ...publicUser } = foundUser as any;
        setProfileUser(publicUser);

        // Check if current user is following
        if (currentUser) {
          setIsFollowing(currentUser.following.includes(userId));
        }

        // Load user's mixes
        const mixesStr = localStorage.getItem("userMixes");
        const allMixes: Mix[] = mixesStr ? JSON.parse(mixesStr) : [];
        const userMixes = allMixes.filter((m) => m.userId === userId);
        setMixes(userMixes);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    if (!currentUser || !profileUser) return;

    try {
      const usersStr = localStorage.getItem("users");
      const users: any[] = usersStr ? JSON.parse(usersStr) : [];

      const currentUserIndex = users.findIndex((u) => u.id === currentUser.id);
      const profileUserIndex = users.findIndex((u) => u.id === profileUser.id);

      if (isFollowing) {
        // Unfollow
        users[currentUserIndex].following = users[currentUserIndex].following.filter(
          (id: string) => id !== profileUser.id
        );
        users[profileUserIndex].followers = users[profileUserIndex].followers.filter(
          (id: string) => id !== currentUser.id
        );
        toast.success(`Unfollowed ${profileUser.username}`);
      } else {
        // Follow
        if (!users[currentUserIndex].following.includes(profileUser.id)) {
          users[currentUserIndex].following.push(profileUser.id);
        }
        if (!users[profileUserIndex].followers.includes(currentUser.id)) {
          users[profileUserIndex].followers.push(currentUser.id);
        }
        toast.success(`Following ${profileUser.username}`);
      }

      localStorage.setItem("users", JSON.stringify(users));

      // Update current user in localStorage
      const updatedCurrentUser = users[currentUserIndex];
      const { password: _, ...userData } = updatedCurrentUser;
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Reload profile
      loadProfile();
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Failed to follow user");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-white/60">Loading profile...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <User className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">User not found</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;
  const joinDate = new Date(profileUser.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">User Profile</h1>
        <p className="text-xs text-white/40">@{profileUser.username}</p>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                {profileUser.profilePic ? (
                  <img
                    src={profileUser.profilePic}
                    alt={profileUser.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">
                      {profileUser.username}
                    </h2>
                    {profileUser.isPremium && (
                      <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs font-['IBM_Plex_Mono'] rounded-sm">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  {!isOwnProfile && currentUser && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? "outline" : "default"}
                      className={isFollowing ? "bg-white/5 border-white/10" : "bg-primary hover:bg-primary/80"}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {profileUser.bio && (
                  <p className="text-white/70 mb-4">{profileUser.bio}</p>
                )}

                <div className="flex items-center gap-6 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{profileUser.followers.length} followers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Following {profileUser.following.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <Music className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {mixes.length}
              </p>
              <p className="text-xs text-white/60 mt-1">Mixes</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {mixes.reduce((sum, m) => sum + m.likes.length, 0)}
              </p>
              <p className="text-xs text-white/60 mt-1">Total Likes</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white font-['IBM_Plex_Mono']">
                {mixes.reduce((sum, m) => sum + m.comments.length, 0)}
              </p>
              <p className="text-xs text-white/60 mt-1">Comments</p>
            </div>
          </div>

          {/* Mixes Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PlaySquare className="w-5 h-5 text-primary" />
              Public Mixes
            </h3>

            {mixes.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <PlaySquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No public mixes yet</p>
                <p className="text-sm text-white/40">
                  {isOwnProfile
                    ? "Create your first mix to get started"
                    : "This user hasn't created any mixes yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mixes.map((mix) => (
                  <div
                    key={mix.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white truncate">
                        {mix.name}
                      </h4>
                      <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                        {mix.tracks.length} tracks
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{mix.likes.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{mix.comments.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

