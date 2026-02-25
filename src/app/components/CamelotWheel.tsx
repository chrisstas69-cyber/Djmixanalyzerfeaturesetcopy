import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

interface KeyInfo {
  camelot: string;
  musicalKey: string;
  innerColor: string;
  outerColor: string;
}

const wheelData: KeyInfo[] = [
  { camelot: '1A', musicalKey: 'A♭ Minor', innerColor: '#FF0000', outerColor: '#FF4444' },
  { camelot: '2A', musicalKey: 'E♭ Minor', innerColor: '#FF6600', outerColor: '#FF8844' },
  { camelot: '3A', musicalKey: 'B♭ Minor', innerColor: '#FF9900', outerColor: '#FFAA44' },
  { camelot: '4A', musicalKey: 'F Minor', innerColor: '#FFCC00', outerColor: '#FFDD44' },
  { camelot: '5A', musicalKey: 'C Minor', innerColor: '#FFFF00', outerColor: '#FFFF44' },
  { camelot: '6A', musicalKey: 'G Minor', innerColor: '#99FF00', outerColor: '#AAFF44' },
  { camelot: '7A', musicalKey: 'D Minor', innerColor: '#00FF00', outerColor: '#44FF44' },
  { camelot: '8A', musicalKey: 'A Minor', innerColor: '#00FF99', outerColor: '#44FFAA' },
  { camelot: '9A', musicalKey: 'E Minor', innerColor: '#00FFFF', outerColor: '#44FFFF' },
  { camelot: '10A', musicalKey: 'B Minor', innerColor: '#0099FF', outerColor: '#44AAFF' },
  { camelot: '11A', musicalKey: 'F♯ Minor', innerColor: '#0000FF', outerColor: '#4444FF' },
  { camelot: '12A', musicalKey: 'D♭ Minor', innerColor: '#9900FF', outerColor: '#AA44FF' },
];

const majorKeys: KeyInfo[] = [
  { camelot: '1B', musicalKey: 'B Major', innerColor: '#FF0000', outerColor: '#FF4444' },
  { camelot: '2B', musicalKey: 'F♯ Major', innerColor: '#FF6600', outerColor: '#FF8844' },
  { camelot: '3B', musicalKey: 'D♭ Major', innerColor: '#FF9900', outerColor: '#FFAA44' },
  { camelot: '4B', musicalKey: 'A♭ Major', innerColor: '#FFCC00', outerColor: '#FFDD44' },
  { camelot: '5B', musicalKey: 'E♭ Major', innerColor: '#FFFF00', outerColor: '#FFFF44' },
  { camelot: '6B', musicalKey: 'B♭ Major', innerColor: '#99FF00', outerColor: '#AAFF44' },
  { camelot: '7B', musicalKey: 'F Major', innerColor: '#00FF00', outerColor: '#44FF44' },
  { camelot: '8B', musicalKey: 'C Major', innerColor: '#00FF99', outerColor: '#44FFAA' },
  { camelot: '9B', musicalKey: 'G Major', innerColor: '#00FFFF', outerColor: '#44FFFF' },
  { camelot: '10B', musicalKey: 'D Major', innerColor: '#0099FF', outerColor: '#44AAFF' },
  { camelot: '11B', musicalKey: 'A Major', innerColor: '#0000FF', outerColor: '#4444FF' },
  { camelot: '12B', musicalKey: 'E Major', innerColor: '#9900FF', outerColor: '#AA44FF' },
];

export function CamelotWheel() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const getCompatibleKeys = (key: string): string[] => {
    if (!key) return [];
    
    const number = parseInt(key.slice(0, -1));
    const letter = key.slice(-1);
    
    // Compatible keys: adjacent +1, adjacent -1, and major/minor swap
    const prevNumber = number === 1 ? 12 : number - 1;
    const nextNumber = number === 12 ? 1 : number + 1;
    const swapLetter = letter === 'A' ? 'B' : 'A';
    
    return [
      `${prevNumber}${letter}`,
      `${nextNumber}${letter}`,
      `${number}${swapLetter}`
    ];
  };

  const isCompatible = (key: string): boolean => {
    if (!selectedKey) return false;
    return getCompatibleKeys(selectedKey).includes(key);
  };

  const renderSegment = (keyInfo: KeyInfo, index: number, isOuter: boolean) => {
    const angle = (index * 30) - 90; // Start from top, each segment is 30 degrees
    const angleRad = (angle * Math.PI) / 180;
    const nextAngleRad = ((angle + 30) * Math.PI) / 180;
    
    const innerRadius = isOuter ? 240 : 120;
    const outerRadius = isOuter ? 360 : 240;
    
    // Calculate path for segment
    const x1 = 360 + Math.cos(angleRad) * innerRadius;
    const y1 = 360 + Math.sin(angleRad) * innerRadius;
    const x2 = 360 + Math.cos(angleRad) * outerRadius;
    const y2 = 360 + Math.sin(angleRad) * outerRadius;
    const x3 = 360 + Math.cos(nextAngleRad) * outerRadius;
    const y3 = 360 + Math.sin(nextAngleRad) * outerRadius;
    const x4 = 360 + Math.cos(nextAngleRad) * innerRadius;
    const y4 = 360 + Math.sin(nextAngleRad) * innerRadius;
    
    const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`;
    
    // Calculate text position (middle of segment)
    const midAngleRad = ((angle + 15) * Math.PI) / 180;
    const textRadius = isOuter ? 300 : 180;
    const textX = 360 + Math.cos(midAngleRad) * textRadius;
    const textY = 360 + Math.sin(midAngleRad) * textRadius;
    
    const isSelected = selectedKey === keyInfo.camelot;
    const isHovered = hoveredKey === keyInfo.camelot;
    const compatible = isCompatible(keyInfo.camelot);
    const shouldFade = selectedKey && !isSelected && !compatible;
    
    const color = isOuter ? keyInfo.outerColor : keyInfo.innerColor;
    
    return (
      <g key={keyInfo.camelot}>
        {/* Outer Glow Layer for NEON effect */}
        <motion.path
          d={path}
          fill={color}
          opacity={0.3}
          style={{
            filter: `blur(20px)`,
            pointerEvents: 'none'
          }}
          animate={{
            opacity: isHovered || compatible ? 0.6 : 0.3
          }}
        />
        
        {/* Main Segment */}
        <motion.path
          d={path}
          fill={color}
          stroke={isSelected ? 'white' : 'rgba(255,255,255,0.3)'}
          strokeWidth={isSelected ? 4 : 2}
          style={{
            filter: `drop-shadow(0 0 ${isHovered || compatible ? 25 : 12}px ${color}) brightness(${isHovered ? 1.2 : 1})`,
            cursor: 'pointer'
          }}
          opacity={shouldFade ? 0.3 : 1}
          animate={{
            opacity: shouldFade ? 0.3 : 1,
            scale: isHovered ? 1.05 : 1,
            filter: compatible 
              ? [`drop-shadow(0 0 15px ${color}) brightness(1)`, `drop-shadow(0 0 35px ${color}) brightness(1.3)`, `drop-shadow(0 0 15px ${color}) brightness(1)`]
              : `drop-shadow(0 0 ${isHovered ? 25 : 12}px ${color}) brightness(${isHovered ? 1.2 : 1})`
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.2, ease: 'easeOut' },
            filter: compatible 
              ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.2 }
          }}
          onMouseEnter={() => setHoveredKey(keyInfo.camelot)}
          onMouseLeave={() => setHoveredKey(null)}
          onClick={() => setSelectedKey(selectedKey === keyInfo.camelot ? null : keyInfo.camelot)}
        />
        
        {/* Camelot notation - BOLD and LARGE */}
        <text
          x={textX}
          y={textY - 2}
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="900"
          style={{ 
            pointerEvents: 'none', 
            textShadow: '0 0 12px rgba(0,0,0,1), 0 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '1px'
          }}
        >
          {keyInfo.camelot}
        </text>
        
        {/* Musical key (smaller text below) */}
        <text
          x={textX}
          y={textY + 14}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          opacity={0.9}
          fontWeight="500"
          style={{ pointerEvents: 'none', textShadow: '0 0 8px rgba(0,0,0,1)' }}
        >
          {keyInfo.musicalKey}
        </text>
      </g>
    );
  };

  const getSelectedKeyInfo = () => {
    if (!selectedKey) return null;
    const allKeys = [...wheelData, ...majorKeys];
    return allKeys.find(k => k.camelot === selectedKey);
  };

  const getCompatibleKeyInfo = () => {
    if (!selectedKey) return [];
    const compatible = getCompatibleKeys(selectedKey);
    const allKeys = [...wheelData, ...majorKeys];
    return compatible.map(key => allKeys.find(k => k.camelot === key)).filter(Boolean) as KeyInfo[];
  };

  const getTransitionType = (fromKey: string, toKey: string): string => {
    const fromNum = parseInt(fromKey.slice(0, -1));
    const toNum = parseInt(toKey.slice(0, -1));
    const fromLetter = fromKey.slice(-1);
    const toLetter = toKey.slice(-1);
    
    if (fromLetter !== toLetter) {
      return 'Energy boost (Major/Minor swap)';
    } else if (toNum === (fromNum % 12) + 1) {
      return 'Move up 1 (Smooth blend)';
    } else {
      return 'Move down 1 (Smooth blend)';
    }
  };

  const selectedInfo = getSelectedKeyInfo();
  const compatibleKeys = getCompatibleKeyInfo();

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Interactive <span className="text-[#ff6b35]">Camelot Wheel</span>
          </h1>
          <p className="text-xl text-gray-400">
            Learn harmonic mixing like a pro DJ
          </p>
        </div>

        {/* Main Wheel Container */}
        <div className="relative flex justify-center mb-16">
          {/* Labels */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-center">
            <div className="text-white font-bold mb-1">MAJOR KEYS (B)</div>
            <div className="text-[#ff6b35]">↓</div>
          </div>
          
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 text-center">
            <div className="text-[#ff6b35]">↑</div>
            <div className="text-white font-bold mt-1">MINOR KEYS (A)</div>
          </div>
          
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-24 text-center">
            <div className="text-white font-bold mb-1">Energy</div>
            <div className="text-[#ff6b35] text-2xl">+</div>
          </div>
          
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-24 text-center">
            <div className="text-white font-bold mb-1">Energy</div>
            <div className="text-[#ff6b35] text-2xl">-</div>
          </div>

          {/* The Wheel */}
          <svg width="720" height="720" viewBox="0 0 720 720">
            {/* Outer ring (Major keys) */}
            {majorKeys.map((keyInfo, index) => renderSegment(keyInfo, index, true))}
            
            {/* Inner ring (Minor keys) */}
            {wheelData.map((keyInfo, index) => renderSegment(keyInfo, index, false))}
            
            {/* Center circle */}
            <defs>
              <radialGradient id="centerGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#1a0a2e" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
            </defs>
            <circle
              cx="360"
              cy="360"
              r="100"
              fill="url(#centerGradient)"
              stroke="white"
              strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255,107,53,0.5))' }}
            />
            <text
              x="360"
              y="350"
              textAnchor="middle"
              fill="white"
              fontSize="24"
              fontWeight="bold"
            >
              CAMELOT
            </text>
            <text
              x="360"
              y="375"
              textAnchor="middle"
              fill="white"
              fontSize="24"
              fontWeight="bold"
            >
              WHEEL
            </text>
            <text
              x="360"
              y="395"
              textAnchor="middle"
              fill="gray"
              fontSize="12"
            >
              Click a key
            </text>
          </svg>
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {selectedInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedInfo.camelot} ({selectedInfo.musicalKey}) mixes well with:
                  </h3>
                  <button
                    onClick={() => setSelectedKey(null)}
                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg text-white transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  {compatibleKeys.map((key, index) => (
                    <motion.div
                      key={key.camelot}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#0a0a0a] rounded-lg p-4 flex items-center justify-between"
                      style={{
                        boxShadow: `0 0 20px ${key.camelot.endsWith('A') ? key.innerColor : key.outerColor}40`
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white"
                          style={{
                            backgroundColor: key.camelot.endsWith('A') ? key.innerColor : key.outerColor,
                            boxShadow: `0 0 15px ${key.camelot.endsWith('A') ? key.innerColor : key.outerColor}`
                          }}
                        >
                          {key.camelot}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {key.camelot} ({key.musicalKey})
                          </div>
                          <div className="text-sm text-gray-400">
                            {getTransitionType(selectedInfo.camelot, key.camelot)}
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-[#ff6b35] hover:bg-[#ff8555] rounded-lg text-white transition-colors flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Preview
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a]">
            <h4 className="text-white font-bold mb-4">How to use:</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#ff6b35]">•</span>
                <span>Click any key to see which keys mix harmonically with it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6b35]">•</span>
                <span>Adjacent keys (±1) provide smooth, seamless transitions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6b35]">•</span>
                <span>Major/Minor swaps (A↔B) create energy changes while staying harmonic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6b35]">•</span>
                <span>Hover over segments to see them glow with their unique color</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] text-center">
            <div className="text-4xl mb-3">🎵</div>
            <h5 className="text-white font-bold mb-2">24 Keys</h5>
            <p className="text-sm text-gray-400">
              12 Minor (A) + 12 Major (B) keys covering the entire musical spectrum
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] text-center">
            <div className="text-4xl mb-3">✨</div>
            <h5 className="text-white font-bold mb-2">Harmonic Mixing</h5>
            <p className="text-sm text-gray-400">
              Mix tracks in compatible keys for smooth, professional DJ sets
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-[#2a2a2a] text-center">
            <div className="text-4xl mb-3">🎛️</div>
            <h5 className="text-white font-bold mb-2">Energy Control</h5>
            <p className="text-sm text-gray-400">
              Control energy flow with Major/Minor swaps while staying in key
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}