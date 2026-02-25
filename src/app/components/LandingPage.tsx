import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Check } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            SYNTA<span className="text-[#ff6b35]">X</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#learn" className="text-white hover:text-[#ff6b35] transition-colors">Learn</a>
            <a href="#pricing" className="text-white hover:text-[#ff6b35] transition-colors">Pricing</a>
            <a href="#login" className="text-white hover:text-[#ff6b35] transition-colors" onClick={onLogin}>Login</a>
            <button className="px-6 py-2.5 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-medium rounded-full transition-all shadow-[0_0_20px_rgba(255,107,53,0.4)] hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]" onClick={onGetStarted}>
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        {/* Animated Waveform */}
        <div className="w-full h-40 mb-12 overflow-hidden">
          <svg className="w-full h-full">
            {[...Array(100)].map((_, i) => {
              const height = 20 + Math.sin(i * 0.2) * 60;
              const colors = ['#ff6b35', '#4488ff', '#9333ea', '#ff4444'];
              const color = colors[i % colors.length];
              return (
                <motion.rect
                  key={i}
                  x={i * 20}
                  y={80 - height / 2}
                  width="16"
                  height={height}
                  fill={color}
                  opacity={0.6}
                  animate={{
                    height: [height, height * 1.3, height],
                    y: [80 - height / 2, 80 - (height * 1.3) / 2, 80 - height / 2]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.02
                  }}
                />
              );
            })}
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            AI Music That <span className="text-[#ff6b35]">Knows Who You Are</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Create underground dance music with AI trained on your sonic DNA. From deep house to techno, generate tracks that sound like you.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button className="px-8 py-4 bg-[#ff6b35] hover:bg-[#ff8555] text-white font-bold text-lg rounded-full transition-all shadow-[0_0_30px_rgba(255,107,53,0.4)] hover:shadow-[0_0_40px_rgba(255,107,53,0.6)]" onClick={onGetStarted}>
              Start Free Trial
            </button>
            <button className="px-8 py-4 border-2 border-white hover:border-[#ff6b35] text-white hover:text-[#ff6b35] font-medium text-lg rounded-full transition-colors flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          <p className="text-sm text-gray-500">5 free tracks • No credit card required</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Your Complete Underground Music Studio
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(255,107,53,0.2)' }}
              className="bg-[#1a1a1a] rounded-2xl p-8 transition-all"
            >
              <div className="text-5xl mb-4">🧬</div>
              <h3 className="text-2xl font-bold text-white mb-4">DNA Analysis</h3>
              <p className="text-gray-400 mb-6">
                Upload your tracks and we'll learn your sonic signature. BPM, key, frequency patterns, arrangement style - we analyze it all.
              </p>
              <div className="h-16 bg-[#0a0a0a] rounded-lg flex items-center px-2">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-0.5 bg-[#ff6b35] rounded-full"
                    style={{ height: `${20 + Math.random() * 60}%`, opacity: 0.6 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(255,107,53,0.2)' }}
              className="bg-[#1a1a1a] rounded-2xl p-8 transition-all"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Generation</h3>
              <p className="text-gray-400 mb-6">
                Generate tracks in your style with AI trained on 10,000+ underground tracks. Deep house, techno, minimal - all genres covered.
              </p>
              <div className="h-16 bg-[#0a0a0a] rounded-lg flex items-center justify-center">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-[#ff6b35] rounded-full opacity-20 animate-ping" />
                  <div className="absolute inset-0 bg-[#ff6b35] rounded-full opacity-40" />
                  <div className="absolute inset-2 bg-[#ff6b35] rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(255,107,53,0.2)' }}
              className="bg-[#1a1a1a] rounded-2xl p-8 transition-all"
            >
              <div className="text-5xl mb-4">🎛️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Professional Stems</h3>
              <p className="text-gray-400 mb-6">
                Export individual stems (drums, bass, synths, FX) for Ableton, Logic, or any DAW. Full creative control.
              </p>
              <div className="space-y-2">
                {['Drums', 'Bass', 'Synths', 'FX'].map((stem, i) => (
                  <div key={stem} className="h-3 bg-[#0a0a0a] rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff6b35] to-[#9333ea]"
                      style={{ width: `${60 + i * 10}%` }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education Teaser Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] via-[#1a0a1f] to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Master the Science of Underground Music
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Learn harmonic mixing, BPM matching, and frequency mastery
          </p>

          {/* Mini Camelot Wheel */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <svg className="w-full h-full" viewBox="0 0 300 300">
              {/* Outer circle */}
              <circle cx="150" cy="150" r="140" fill="none" stroke="url(#wheelGradient)" strokeWidth="2" opacity="0.3" />
              
              {/* Keys around the wheel */}
              {['12B', '1B', '2B', '3B', '4B', '5B', '6B', '7B', '8B', '9B', '10B', '11B'].map((key, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 150 + Math.cos(angle) * 120;
                const y = 150 + Math.sin(angle) * 120;
                const colors = ['#ff6b35', '#ff8555', '#ffaa77', '#9333ea', '#a855f7', '#c084fc'];
                const color = colors[i % colors.length];
                
                return (
                  <g key={key}>
                    <circle cx={x} cy={y} r="20" fill={color} opacity="0.8" />
                    <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                      {key}
                    </text>
                  </g>
                );
              })}

              {/* Inner keys */}
              {['12A', '1A', '2A', '3A', '4A', '5A', '6A', '7A', '8A', '9A', '10A', '11A'].map((key, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 150 + Math.cos(angle) * 60;
                const y = 150 + Math.sin(angle) * 60;
                
                return (
                  <g key={key}>
                    <circle cx={x} cy={y} r="16" fill="#1a1a1a" stroke="#ff6b35" strokeWidth="1" />
                    <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                      {key}
                    </text>
                  </g>
                );
              })}

              <defs>
                <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b35" />
                  <stop offset="50%" stopColor="#9333ea" />
                  <stop offset="100%" stopColor="#ff6b35" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <button className="px-8 py-3 border-2 border-white hover:border-[#ff6b35] text-white hover:text-[#ff6b35] font-medium rounded-full transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* DJ Mix Analyzer Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Analyze Any DJ Mix</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Upload mixes from Carl Cox, Richie Hawtin, or any DJ. We'll identify every track and generate similar ones.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Mockup */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
              <div className="space-y-3">
                {[
                  { name: 'Hypnotic Elements', bpm: 128, key: '4A', genre: 'Techno' },
                  { name: 'Dark Matter Sequence', bpm: 130, key: '5A', genre: 'Deep House' },
                  { name: 'Underground Pulse', bpm: 128, key: '4A', genre: 'Minimal' }
                ].map((track, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-[#ff6b35] font-bold">{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{track.name}</div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{track.bpm} BPM</span>
                          <span>{track.key}</span>
                          <span className="px-2 py-0.5 bg-[#ff6b35]/20 text-[#ff6b35] rounded">{track.genre}</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-8 bg-[#1a1a1a] rounded flex items-center px-1">
                      {[...Array(50)].map((_, j) => (
                        <div
                          key={j}
                          className="flex-1 mx-0.5 bg-[#ff6b35] rounded-full"
                          style={{ height: `${30 + Math.random() * 70}%`, opacity: 0.4 }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                'Auto-identify tracks (Shazam integration)',
                'Analyze DNA of each track',
                'Generate similar tracks',
                'Create seamless mixes with Auto DJ'
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-[#ff6b35] rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Underground Producers</h2>
            <p className="text-xl text-gray-400">Join 1,000+ producers creating the future of dance music</p>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-12">
            {[
              { name: 'Alex Rivera', role: 'Techno Producer', quote: 'This AI actually understands underground sound. Game changer.' },
              { name: 'Sarah Chen', role: 'Deep House DJ', quote: 'The DNA analysis is insane. It captures my style perfectly.' },
              { name: 'Marcus Webb', role: 'Minimal Artist', quote: 'Finally, AI that doesn\'t sound generic. Love the stem export.' }
            ].map((testimonial, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#9333ea] rounded-full" />
                  <div>
                    <div className="text-white font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-16 text-center">
            <div>
              <div className="text-4xl font-bold text-[#ff6b35] mb-2">10,000+</div>
              <div className="text-gray-400">Tracks Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ff6b35] mb-2">500+</div>
              <div className="text-gray-400">Hours of Music</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ff6b35] mb-2">50+</div>
              <div className="text-gray-400">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Start Creating Today</h2>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Starter */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] hover:border-[#ff6b35] transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  50 tracks/month
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  DNA Analysis
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  Basic generation
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  MP3 export
                </li>
              </ul>
              <button className="w-full py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium rounded-lg transition-colors">
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-[#ff6b35] to-[#ff8555] rounded-2xl p-8 transform scale-105 shadow-[0_0_40px_rgba(255,107,53,0.3)]">
              <div className="bg-white text-[#ff6b35] text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-white/80">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  200 tracks/month
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  Everything in Starter
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  Stem export
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  DJ Mix Analyzer
                </li>
                <li className="flex items-center gap-2 text-white">
                  <Check className="w-5 h-5" />
                  Priority generation
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-[#ff6b35] font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>

            {/* DJ */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] hover:border-[#ff6b35] transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">DJ</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$49</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  Unlimited tracks
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  Auto DJ Mixer
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  Custom model training
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-[#ff6b35]" />
                  API access
                </li>
              </ul>
              <button className="w-full py-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <a href="#pricing" className="text-[#ff6b35] hover:text-[#ff8555] font-medium">
              See Full Pricing →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] border-t border-[#1a1a1a] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-12 mb-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                SYNTA<span className="text-[#ff6b35]">X</span>
              </div>
              <p className="text-gray-400">
                Built for the underground.
              </p>
            </div>
            <div className="flex justify-center gap-8 text-gray-400">
              <a href="#about" className="hover:text-white transition-colors">About</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#learn" className="hover:text-white transition-colors">Learn</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex justify-end gap-6">
              <a href="#instagram" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              <a href="#twitter" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#soundcloud" className="text-gray-400 hover:text-white transition-colors">SoundCloud</a>
              <a href="#discord" className="text-gray-400 hover:text-white transition-colors">Discord</a>
            </div>
          </div>
          <div className="flex justify-between items-center pt-8 border-t border-[#1a1a1a] text-sm text-gray-400">
            <div>© 2025 Syntax Audio Intelligence. Built for the underground.</div>
            <div className="flex gap-6">
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}