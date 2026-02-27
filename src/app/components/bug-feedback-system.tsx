import { useState } from "react";
import { Bug, Lightbulb, MessageSquare, ThumbsUp, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from "./auth-system";
import { toast } from "sonner";

type FeedbackType = "bug" | "feature";

interface FeedbackItem {
  id: string;
  type: FeedbackType;
  title: string;
  description: string;
  userId: string;
  username: string;
  status: "open" | "in-progress" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  votes: number;
  createdAt: string;
  updatedAt: string;
  comments: Array<{
    id: string;
    userId: string;
    username: string;
    text: string;
    createdAt: string;
  }>;
}

export function BugFeedbackSystem() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"report" | "requests">("report");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("bug");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    steps: "",
    expected: "",
    actual: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [featureRequests, setFeatureRequests] = useState<FeedbackItem[]>([]);
  const [bugReports, setBugReports] = useState<FeedbackItem[]>([]);

  // Load feedback items from localStorage
  useState(() => {
    try {
      const requestsStr = localStorage.getItem("featureRequests");
      const bugsStr = localStorage.getItem("bugReports");
      
      if (requestsStr) {
        setFeatureRequests(JSON.parse(requestsStr));
      }
      if (bugsStr) {
        setBugReports(JSON.parse(bugsStr));
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit feedback");
      return;
    }

    try {
      const newItem: FeedbackItem = {
        id: `${feedbackType}-${Date.now()}-${Math.random()}`,
        type: feedbackType,
        title: formData.title,
        description: feedbackType === "bug" 
          ? `${formData.description}\n\nSteps to reproduce:\n${formData.steps}\n\nExpected:\n${formData.expected}\n\nActual:\n${formData.actual}`
          : formData.description,
        userId: user.id,
        username: user.username,
        status: "open",
        priority: "medium",
        votes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      };

      const storageKey = feedbackType === "bug" ? "bugReports" : "featureRequests";
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      existing.push(newItem);
      localStorage.setItem(storageKey, JSON.stringify(existing));

      if (feedbackType === "bug") {
        setBugReports([...bugReports, newItem]);
      } else {
        setFeatureRequests([...featureRequests, newItem]);
      }

      setFormData({ title: "", description: "", steps: "", expected: "", actual: "" });
      setSubmitted(true);
      toast.success(`${feedbackType === "bug" ? "Bug report" : "Feature request"} submitted!`);
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  const handleVote = (itemId: string, type: FeedbackType) => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }

    try {
      const storageKey = type === "bug" ? "bugReports" : "featureRequests";
      const items: FeedbackItem[] = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const item = items.find(i => i.id === itemId);
      
      if (item) {
        // Simple voting - in production, track which users voted
        item.votes += 1;
        localStorage.setItem(storageKey, JSON.stringify(items));
        
        if (type === "bug") {
          setBugReports([...items]);
        } else {
          setFeatureRequests([...items]);
        }
        
        toast.success("Vote recorded!");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const allItems = [...featureRequests, ...bugReports].sort(
    (a, b) => b.votes - a.votes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-xl flex-shrink-0">
        <h1 className="text-xl font-semibold tracking-tight mb-1 text-white">
          Bug Reports & Feature Requests
        </h1>
        <p className="text-xs text-white/40">
          Help us improve Syntax Audio Intelligence
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("report")}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "report"
                ? "border-primary text-primary"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "requests"
                ? "border-primary text-primary"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            View Requests ({allItems.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "report" ? (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div>
                <label className="text-xs text-white/60 mb-2 block font-['IBM_Plex_Mono']">
                  Type
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFeedbackType("bug")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      feedbackType === "bug"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Bug className="w-4 h-4" />
                    Bug Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType("feature")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      feedbackType === "feature"
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Lightbulb className="w-4 h-4" />
                    Feature Request
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={feedbackType === "bug" ? "Brief description of the bug" : "Feature name"}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={feedbackType === "bug" ? "Describe what happened" : "Describe the feature you'd like"}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              {/* Bug-specific fields */}
              {feedbackType === "bug" && (
                <>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                      Steps to Reproduce
                    </label>
                    <textarea
                      value={formData.steps}
                      onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                      placeholder="1. Go to...\n2. Click on...\n3. See error..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                      Expected Behavior
                    </label>
                    <Input
                      value={formData.expected}
                      onChange={(e) => setFormData({ ...formData, expected: e.target.value })}
                      placeholder="What should have happened"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
                      Actual Behavior
                    </label>
                    <Input
                      value={formData.actual}
                      onChange={(e) => setFormData({ ...formData, actual: e.target.value })}
                      placeholder="What actually happened"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/80 text-white"
                disabled={submitted || !formData.title || !formData.description}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submitted!
                  </>
                ) : (
                  <>
                    {feedbackType === "bug" ? (
                      <Bug className="w-4 h-4 mr-2" />
                    ) : (
                      <Lightbulb className="w-4 h-4 mr-2" />
                    )}
                    Submit {feedbackType === "bug" ? "Bug Report" : "Feature Request"}
                  </>
                )}
              </Button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {allItems.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No feedback submitted yet</p>
              </div>
            ) : (
              allItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === "bug" ? (
                          <Bug className="w-4 h-4 text-red-400" />
                        ) : (
                          <Lightbulb className="w-4 h-4 text-primary" />
                        )}
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-sm font-['IBM_Plex_Mono'] ${
                          item.status === "resolved" ? "bg-green-500/20 text-green-400" :
                          item.status === "in-progress" ? "bg-blue-500/20 text-blue-400" :
                          item.status === "rejected" ? "bg-red-500/20 text-red-400" :
                          "bg-white/10 text-white/60"
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2 whitespace-pre-line">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span>By {item.username}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleVote(item.id, item.type)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4 text-white/60" />
                      <span className="text-sm font-['IBM_Plex_Mono']">{item.votes}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

