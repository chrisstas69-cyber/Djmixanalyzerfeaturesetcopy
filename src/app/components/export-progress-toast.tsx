import { useState, useEffect } from "react";
import { CheckCircle2, FolderOpen, Link2, X } from "lucide-react";
import { Button } from "./ui/button";

interface ExportProgressToastProps {
  isVisible: boolean;
  onDismiss: () => void;
}

type ExportStage = "preparing" | "metadata" | "finalizing" | "complete";

export function ExportProgressToast({ isVisible, onDismiss }: ExportProgressToastProps) {
  const [stage, setStage] = useState<ExportStage>("preparing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStage("preparing");
      setProgress(0);
      return;
    }

    // Simulate export stages
    const stages: ExportStage[] = ["preparing", "metadata", "finalizing", "complete"];
    let currentStageIndex = 0;

    const stageInterval = setInterval(() => {
      currentStageIndex++;
      if (currentStageIndex < stages.length) {
        setStage(stages[currentStageIndex]);
        setProgress((currentStageIndex / (stages.length - 1)) * 100);
      } else {
        clearInterval(stageInterval);
      }
    }, 2000); // 2 seconds per stage

    return () => clearInterval(stageInterval);
  }, [isVisible]);

  if (!isVisible) return null;

  const getStatusText = () => {
    switch (stage) {
      case "preparing":
        return "Preparing audio";
      case "metadata":
        return "Embedding metadata";
      case "finalizing":
        return "Finalizing files";
      case "complete":
        return "Export complete";
      default:
        return "Exporting…";
    }
  };

  const isComplete = stage === "complete";

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-card border border-border shadow-2xl z-50 transition-all duration-250 ease-in-out">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          )}
          <span className="text-sm font-medium font-['IBM_Plex_Mono']">
            {isComplete ? "Export Complete" : "Exporting…"}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-white transition-opacity duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {!isComplete ? (
          <>
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary ease-in-out"
                  style={{ 
                    width: `${progress}%`,
                    transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </div>
            </div>
            {/* Status Text */}
            <div className="text-xs text-muted-foreground font-['IBM_Plex_Mono']">
              {getStatusText()}
            </div>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="text-sm text-white/90 mb-4 font-['IBM_Plex_Mono']">
              Your export is ready
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 font-['IBM_Plex_Mono'] text-xs transition-all duration-200"
              >
                <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                Open Folder
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 font-['IBM_Plex_Mono'] text-xs transition-all duration-200"
              >
                <Link2 className="w-3.5 h-3.5 mr-1.5" />
                Copy Link
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}