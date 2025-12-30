import { useEffect, useRef, useState } from "react";

interface WaveformVisualizerProps {
  audioData?: string; // base64 or blob URL
  energy?: "Rising" | "Building" | "Peak" | "Chill" | "Groove" | "Steady";
  width?: number;
  height?: number;
  barCount?: number;
}

const ENERGY_COLORS = {
  Peak: "#ef4444", // red
  Building: "#f97316", // orange
  Rising: "#eab308", // yellow
  Groove: "#3b82f6", // blue
  Steady: "#8b5cf6", // purple
  Chill: "#06b6d4", // cyan
};

export function WaveformVisualizer({
  audioData,
  energy = "Peak",
  width = 800,
  height = 100,
  barCount = 100,
}: WaveformVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    if (!audioData || !svgRef.current) {
      // Generate mock waveform data if no audio provided
      const mockData = Array.from({ length: barCount }, () => Math.random());
      setWaveformData(mockData);
      return;
    }

    // In a real implementation, this would analyze the audio buffer
    // For now, generate mock waveform based on energy level
    const generateMockWaveform = () => {
      const data: number[] = [];
      const baseAmplitude = energy === "Peak" ? 0.8 : energy === "Building" ? 0.6 : energy === "Rising" ? 0.4 : 0.3;
      
      for (let i = 0; i < barCount; i++) {
        const variation = (Math.sin(i / 10) + 1) / 2;
        const amplitude = baseAmplitude + (Math.random() - 0.5) * 0.3;
        data.push(Math.max(0.1, Math.min(1, amplitude * variation)));
      }
      
      return data;
    };

    setWaveformData(generateMockWaveform());
  }, [audioData, energy, barCount]);

  const color = ENERGY_COLORS[energy] || ENERGY_COLORS.Peak;
  const barWidth = width / barCount;
  const spacing = barWidth * 0.1;

  return (
    <div className="w-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {waveformData.map((amplitude, index) => {
          const barHeight = amplitude * height * 0.9;
          const x = index * barWidth;
          const y = (height - barHeight) / 2;
          
          return (
            <rect
              key={index}
              x={x + spacing / 2}
              y={y}
              width={barWidth - spacing}
              height={barHeight}
              fill={color}
              opacity={0.8}
              rx={2}
            />
          );
        })}
      </svg>
    </div>
  );
}


