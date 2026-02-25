import React, { useEffect, useState } from 'react';

const STATUS_STEPS = [
  'Fetching mix from source...',
  'Extracting audio fingerprint...',
  'Running Shazam track detection...',
  'Identifying tracks (12 found)...',
  'Analyzing BPM, key & energy...',
  'Building DNA profile...',
  'Analysis complete!',
];

const STEP_INTERVAL_MS = 1500;
const TOTAL_DURATION_MS = 10500;

interface Props {
  url: string;
  onComplete: () => void;
}

export default function AnalysisProgress({ url, onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= STATUS_STEPS.length) {
          clearInterval(stepTimer);
          return prev;
        }
        return next;
      });
    }, STEP_INTERVAL_MS);
    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(progressTimer);
        onComplete();
      }
    }, 50);
    return () => clearInterval(progressTimer);
  }, [onComplete]);

  const displayUrl = url.length > 60 ? url.slice(0, 57) + '...' : url;

  return (
    <div className="p-8 space-y-8">
      <p className="text-white/60 text-sm truncate" title={url}>
        {displayUrl}
      </p>

      <div className="space-y-3">
        {STATUS_STEPS.slice(0, stepIndex + 1).map((message, i) => {
          const isComplete = i < stepIndex || message === 'Analysis complete!';
          return (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm ${isComplete ? 'text-white/50' : 'text-white'}`}
            >
              {isComplete ? (
                <span className="text-green-400 flex-shrink-0">✓</span>
              ) : (
                <span className="animate-spin flex-shrink-0">⟳</span>
              )}
              <span>{message}</span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <div
          className="w-full overflow-hidden bg-white/10"
          style={{ height: 4, borderRadius: 2 }}
        >
          <div
            className="h-full bg-[#00D4FF] transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}
