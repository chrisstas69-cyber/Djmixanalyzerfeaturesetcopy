import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { toast } from "sonner";
import { Mail, Lock, User, LogOut, LogIn } from "lucide-react";

export interface User {
  id: string;
  email: string;
  username: string;
  profilePic?: string;
  createdAt: string;
  bio?: string;
  followers: string[];
  following: string[];
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem("currentUser");
        const token = localStorage.getItem("authToken");
        if (userStr && token) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login - in production, this would call an API
      const usersStr = localStorage.getItem("users");
      const users: Array<User & { password: string }> = usersStr
        ? JSON.parse(usersStr)
        : [];

      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userData } = foundUser;
        const token = `mock-jwt-${Date.now()}-${Math.random()}`;

        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("authToken", token);
        setUser(userData);

        toast.success(`Welcome back, ${userData.username}!`);
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  const signup = async (
    email: string,
    password: string,
    username: string
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const usersStr = localStorage.getItem("users");
      const users: Array<User & { password: string }> = usersStr
        ? JSON.parse(usersStr)
        : [];

      if (users.some((u) => u.email === email)) {
        toast.error("Email already registered");
        return false;
      }

      if (users.some((u) => u.username === username)) {
        toast.error("Username already taken");
        return false;
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}-${Math.random()}`,
        email,
        username,
        createdAt: new Date().toISOString(),
        followers: [],
        following: [],
        isPremium: false,
      };

      // Store user with password
      users.push({ ...newUser, password });
      localStorage.setItem("users", JSON.stringify(users));

      // Auto-login
      const token = `mock-jwt-${Date.now()}-${Math.random()}`;
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("authToken", token);
      setUser(newUser);

      toast.success(`Welcome to Syntax Audio Intelligence, ${username}!`);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Also update in users array
    const usersStr = localStorage.getItem("users");
    if (usersStr) {
      const users: Array<User & { password?: string }> = JSON.parse(usersStr);
      const index = users.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem("users", JSON.stringify(users));
      }
    }
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthModal({
  open,
  onClose,
  initialMode = "login",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setUsername("");
    }
  }, [open, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let success = false;
    if (mode === "login") {
      success = await login(email, password);
    } else {
      success = await signup(email, password, username);
    }

    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold mb-2">
            {mode === "login" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-white/60 text-sm mb-4">
            {mode === "login"
              ? "Sign in to access all features"
              : "Join Syntax Audio Intelligence"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="pl-9 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-9 bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 bg-white/5 border-white/10 text-white"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/80 text-white mt-4"
          >
            {loading ? (
              "Processing..."
            ) : mode === "login" ? (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            ) : (
              <>
                <User className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AuthButton() {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/80 font-['IBM_Plex_Mono']">
          {user.username}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8"
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAuthModalOpen(true)}
        className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-8"
      >
        <LogIn className="w-3.5 h-3.5 mr-1.5" />
        Sign In
      </Button>
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

