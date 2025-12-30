import { useState, useEffect } from "react";
import { X, Sparkles, Music, Sliders, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onLoadSampleData: () => void;
}

const SAMPLE_TRACKS = [
  { id: "sample-1", title: "Midnight Groove", artist: "Deep Sessions", bpm: 128, key: "Am", duration: "6:30", energy: "Building", version: "A" as const, status: null, dateAdded: new Date().toISOString().split('T')[0] },
  { id: "sample-2", title: "Warehouse Anthem", artist: "Underground Collective", bpm: 130, key: "Fm", duration: "7:15", energy: "Peak", version: "B" as const, status: null, dateAdded: new Date().toISOString().split('T')[0] },
  { id: "sample-3", title: "Deep House Vibes", artist: "Soulful Sessions", bpm: 124, key: "Dm", duration: "5:58", energy: "Groove", version: "A" as const, status: null, dateAdded: new Date().toISOString().split('T')[0] },
  { id: "sample-4", title: "Rolling Bassline", artist: "Low Frequency", bpm: 127, key: "Gm", duration: "6:30", energy: "Steady", version: "B" as const, status: null, dateAdded: new Date().toISOString().split('T')[0] },
  { id: "sample-5", title: "Peak Time Energy", artist: "Night Shift", bpm: 132, key: "Em", duration: "7:02", energy: "Peak", version: "C" as const, status: null, dateAdded: new Date().toISOString().split('T')[0] },
];

export function OnboardingModal({ open, onClose, onLoadSampleData }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      title: "Welcome to Syntax Audio Intelligence",
      description: "Your AI-powered DJ production studio",
      content: (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Get started in three simple steps:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">1. Create Track</h3>
                <p className="text-xs text-white/60">
                  Describe your vibe and generate AI-powered tracks with multiple versions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">2. Build Library</h3>
                <p className="text-xs text-white/60">
                  Save tracks, organize with favorites, and create custom mixes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Sliders className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white mb-1">3. Mix & Perform</h3>
                <p className="text-xs text-white/60">
                  Use the professional DJ mixer to blend tracks and create seamless transitions
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Key Features",
      description: "Discover what makes Syntax powerful",
      content: (
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <span className="text-primary">DNA Analysis</span>
            </h3>
            <p className="text-xs text-white/60">
              Upload reference tracks to build your unique musical DNA profile. Get personalized track recommendations based on your style.
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <span className="text-primary">Favorites & Organization</span>
            </h3>
            <p className="text-xs text-white/60">
              Star tracks you love, filter by energy level, and sort by BPM, key, or date. Keep your library organized and accessible.
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <span className="text-primary">Export & Share</span>
            </h3>
            <p className="text-xs text-white/60">
              Export tracks as JSON, CSV, or M3U playlists. Share mixes with others or import tracks from share codes.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleLoadSampleData = async () => {
    setIsLoading(true);
    try {
      // Load existing tracks
      const existingStr = localStorage.getItem('libraryTracks');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      
      // Add sample tracks
      const updated = [...existing, ...SAMPLE_TRACKS];
      localStorage.setItem('libraryTracks', JSON.stringify(updated));
      
      // Call parent callback
      onLoadSampleData();
      
      toast.success("Sample tracks loaded! Check your Track Library.");
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast.error("Failed to load sample data");
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold mb-2">
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription className="text-white/60 text-sm mb-4">
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 min-h-[300px]">
          {steps[currentStep].content}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <button
            onClick={handleSkip}
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            Skip Tour
          </button>
          <div className="flex items-center gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Previous
              </Button>
            )}
            {currentStep === steps.length - 1 ? (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleLoadSampleData}
                  disabled={isLoading}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load Sample Tracks"
                  )}
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/80 text-white"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


