import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Check, X, ArrowUpDown, Zap, Lightbulb, Sparkles } from 'lucide-react';
import { CamelotWheel } from './CamelotWheel';

const allKeys = [
  { value: '1A', label: '1A (A♭ Minor)' },
  { value: '2A', label: '2A (E♭ Minor)' },
  { value: '3A', label: '3A (B♭ Minor)' },
  { value: '4A', label: '4A (F Minor)' },
  { value: '5A', label: '5A (C Minor)' },
  { value: '6A', label: '6A (G Minor)' },
  { value: '7A', label: '7A (D Minor)' },
  { value: '8A', label: '8A (A Minor)' },
  { value: '9A', label: '9A (E Minor)' },
  { value: '10A', label: '10A (B Minor)' },
  { value: '11A', label: '11A (F♯ Minor)' },
  { value: '12A', label: '12A (D♭ Minor)' },
  { value: '1B', label: '1B (B Major)' },
  { value: '2B', label: '2B (F♯ Major)' },
  { value: '3B', label: '3B (D♭ Major)' },
  { value: '4B', label: '4B (A♭ Major)' },
  { value: '5B', label: '5B (E♭ Major)' },
  { value: '6B', label: '6B (B♭ Major)' },
  { value: '7B', label: '7B (F Major)' },
  { value: '8B', label: '8B (C Major)' },
  { value: '9B', label: '9B (G Major)' },
  { value: '10B', label: '10B (D Major)' },
  { value: '11B', label: '11B (A Major)' },
  { value: '12B', label: '12B (E Major)' },
];

export function EducationPage() {
  const [selectedKey, setSelectedKey] = useState('8A');
  const [showResults, setShowResults] = useState(false);

  const getCompatibleKeys = (key: string) => {
    if (!key) return [];
    
    const number = parseInt(key.slice(0, -1));
    const letter = key.slice(-1);
    
    const prevNumber = number === 1 ? 12 : number - 1;
    const nextNumber = number === 12 ? 1 : number + 1;
    const swapLetter = letter === 'A' ? 'B' : 'A';
    
    return [
      { key: `${prevNumber}${letter}`, type: 'Smooth transition' },
      { key: `${nextNumber}${letter}`, type: 'Smooth transition' },
      { key: `${number}${swapLetter}`, type: 'Energy boost' }
    ];
  };

  const compatibleKeys = getCompatibleKeys(selectedKey);
  const selectedKeyInfo = allKeys.find(k => k.value === selectedKey);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#9333ea] via-[#4c1d95] to-[#0a0a0a] py-20 px-6">
        {/* Animated Waveform Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            {[...Array(80)].map((_, i) => {
              const height = 30 + Math.sin(i * 0.3) * 40;
              return (
                <motion.rect
                  key={i}
                  x={i * 25}
                  y={100 - height / 2}
                  width="20"
                  height={height}
                  fill="white"
                  opacity={0.3}
                  animate={{
                    height: [height, height * 1.4, height],
                    y: [100 - height / 2, 100 - (height * 1.4) / 2, 100 - height / 2]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.03
                  }}
                />
              );
            })}
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold text-white mb-6">
              Master Harmonic Mixing
            </h1>
            <p className="text-2xl text-purple-200 max-w-3xl mx-auto">
              Learn the science behind perfect DJ transitions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Camelot Wheel Section (Hero) */}
      <section className="py-20">
        <CamelotWheel />
      </section>

      {/* Try It Yourself Tool */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Try It Yourself
          </h2>

          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]">
            <label className="block text-white font-medium mb-3">
              Select your track key:
            </label>
            
            <select
              value={selectedKey}
              onChange={(e) => {
                setSelectedKey(e.target.value);
                setShowResults(false);
              }}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors mb-6"
            >
              {allKeys.map(key => (
                <option key={key.value} value={key.value}>
                  {key.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowResults(true)}
              className="w-full px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-bold rounded-lg transition-colors shadow-[0_0_20px_rgba(255,107,53,0.4)] hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]"
            >
              Show Compatible Keys
            </button>

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-[#2a2a2a]"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {selectedKeyInfo?.label} mixes well with:
                </h3>

                <div className="space-y-3">
                  {compatibleKeys.map((compatible, index) => {
                    const keyInfo = allKeys.find(k => k.value === compatible.key);
                    return (
                      <motion.div
                        key={compatible.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-4 bg-[#0a0a0a] rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-[#ff6b35] rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{keyInfo?.label}</div>
                          <div className="text-sm text-gray-400">{compatible.type}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* The 4 Rules of Harmonic Mixing */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            The 4 Rules of Harmonic Mixing
          </h2>

          <div className="grid grid-cols-2 gap-8">
            {/* CARD 1: Perfect Match */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0a2a0a] rounded-2xl p-8 border-2 border-[#00ff00]/20 hover:border-[#00ff00]/40 transition-all"
            >
              <div className="w-16 h-16 bg-[#00ff00] rounded-2xl flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">
                Perfect Match ✅
              </h3>
              
              <div className="text-xl text-[#00ff00] font-bold mb-4">
                Same Key (8A → 8A)
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Tracks in the same key always mix perfectly. Zero risk of clashing. This is your safest option for smooth transitions.
              </p>
              
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#00ff00]/20">
                <div className="text-sm text-gray-400 mb-1">Example:</div>
                <div className="text-white font-medium">
                  Nocturnal Sequence (8A) → Dark Matter (8A)
                </div>
              </div>
            </motion.div>

            {/* CARD 2: Smooth Transition */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0a1a2a] rounded-2xl p-8 border-2 border-[#4488ff]/20 hover:border-[#4488ff]/40 transition-all"
            >
              <div className="w-16 h-16 bg-[#4488ff] rounded-2xl flex items-center justify-center mb-6">
                <ArrowUpDown className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">
                Smooth Transition ↕️
              </h3>
              
              <div className="text-xl text-[#4488ff] font-bold mb-4">
                Adjacent Keys (8A → 7A or 9A)
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Move up or down one step on the wheel for smooth, harmonic transitions. This is the foundation of professional DJ mixing.
              </p>
              
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#4488ff]/20">
                <div className="text-sm text-gray-400 mb-1">Example:</div>
                <div className="text-white font-medium">
                  Nocturnal Sequence (8A) → Subsonic Ritual (7A)
                </div>
              </div>
            </motion.div>

            {/* CARD 3: Energy Shift */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a0a] rounded-2xl p-8 border-2 border-[#ff6b35]/20 hover:border-[#ff6b35]/40 transition-all"
            >
              <div className="w-16 h-16 bg-[#ff6b35] rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">
                Energy Shift ⚡
              </h3>
              
              <div className="text-xl text-[#ff6b35] font-bold mb-4">
                Major/Minor Swap (8A → 8B)
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Switch between major and minor (same number) to change energy while staying harmonic. Perfect for building or dropping intensity.
              </p>
              
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#ff6b35]/20">
                <div className="text-sm text-gray-400 mb-1">Example:</div>
                <div className="text-white font-medium">
                  Nocturnal Sequence (8A) → Hypnotic Elements (8B)
                </div>
              </div>
            </motion.div>

            {/* CARD 4: Avoid Clashes */}
            <motion.div
              whileHover={{ y: -8 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#2a0a0a] rounded-2xl p-8 border-2 border-[#ff4444]/20 hover:border-[#ff4444]/40 transition-all"
            >
              <div className="w-16 h-16 bg-[#ff4444] rounded-2xl flex items-center justify-center mb-6">
                <X className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-3">
                Avoid Clashes ❌
              </h3>
              
              <div className="text-xl text-[#ff4444] font-bold mb-4">
                Opposite Keys (8A → 2A)
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Keys far apart on the wheel will clash and sound dissonant. Avoid large jumps unless you want jarring transitions.
              </p>
              
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#ff4444]/20">
                <div className="text-sm text-gray-400 mb-1">Example:</div>
                <div className="text-white font-medium flex items-center gap-2">
                  Nocturnal Sequence (8A) → Industrial Dawn (2A)
                  <X className="w-4 h-4 text-[#ff4444]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pro DJ Tips */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Pro DJ Tips
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {/* TIP 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] hover:border-[#ff6b35] transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#ff6b35] to-[#ff8555] rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Start your set in a <span className="text-white font-bold">minor key (A)</span> for a deep, underground vibe. Switch to <span className="text-white font-bold">major (B)</span> for peak time energy.
              </p>
            </motion.div>

            {/* TIP 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] hover:border-[#ff6b35] transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#9333ea] to-[#a855f7] rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Move <span className="text-white font-bold">clockwise</span> around the wheel to gradually increase energy. Move <span className="text-white font-bold">counter-clockwise</span> to bring it down.
              </p>
            </motion.div>

            {/* TIP 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] hover:border-[#ff6b35] transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#4488ff] to-[#6aa6ff] rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Use <span className="text-white font-bold">Syntax AI</span> to generate tracks in compatible keys. Build entire sets that flow perfectly from start to finish.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden bg-gradient-to-r from-[#ff6b35] via-[#9333ea] to-[#ff6b35] rounded-3xl p-12 text-center"
          >
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <div className="relative">
              <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
              
              <h2 className="text-5xl font-bold text-white mb-4">
                Ready to Create Harmonically Perfect Music?
              </h2>
              
              <p className="text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                Use what you've learned to generate your next track
              </p>
              
              <button className="px-12 py-5 bg-white text-[#ff6b35] font-bold text-xl rounded-full hover:bg-gray-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
                Start Generating
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
