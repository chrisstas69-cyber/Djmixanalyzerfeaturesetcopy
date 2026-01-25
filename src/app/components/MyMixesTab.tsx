import { Play, MoreHorizontal, Heart, Download, Repeat } from 'lucide-react';

export default function MyMixesTab() {
  return (
    // Token: bg-0 #070A0F
    <div className="min-h-screen w-full overflow-y-auto bg-[#070A0F]">
      
      {/* CENTERING CONTAINER: max-w-3xl makes it narrow, mx-auto centers it like SoundCloud */}
      <div className="flex justify-center w-full pb-24">
        
        <div className="w-full max-w-3xl px-6 pt-8 md:pt-12">
          
          {/* HEADER */}
          <div className="mb-8 pb-4 border-b border-[rgba(255,255,255,0.05)]">
            <h2 className="text-3xl md:text-4xl font-light tracking-wide text-[#EAF2FF] mb-2">
              My Mixes
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-[#95A3B8] text-base">Your Auto-Generated Sessions</p>
              <div className="h-1 w-1 rounded-full bg-[#95A3B8]"></div>
              <span className="text-[#00C2FF] text-sm font-medium">3 Mixes</span>
            </div>
          </div>

          {/* TRACK LIST (Centered Column) */}
          <div className="flex flex-col gap-3">
            
            {/* --- TRACK 1 (CURRENT) --- */}
            <div className="group flex items-center gap-4 p-4 rounded-xl 
                bg-[rgba(14,19,32,0.4)] border border-[rgba(255,255,255,0.05)]
                hover:bg-[rgba(14,19,32,0.8)] hover:border-[#00C2FF]/50 transition-all">
              
              {/* ARTWORK */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&auto=format&fit=crop" 
                  alt="Mix Art"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                {/* Cyan Glow Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg cursor-pointer">
                  <div className="bg-[#00C2FF] p-2 rounded-full shadow-[0_0_15px_rgba(0,194,255,0.6)]">
                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              {/* INFO & WAVEFORM (Stretched) */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-[#EAF2FF] text-lg font-normal truncate group-hover:text-[#00C2FF] transition-colors">Deep House Journey</h4>
                    <p className="text-[#95A3B8] text-xs uppercase tracking-widest">Auto Mixer • 2d ago</p>
                  </div>
                  <span className="text-[#95A3B8] text-sm font-mono">45:20</span>
                </div>
                
                {/* Waveform */}
                <div className="h-10 w-full flex items-center gap-[2px] overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                   {[30, 50, 40, 70, 100, 80, 60, 90, 40, 50, 30, 60, 80, 50, 40, 70, 90, 60, 40, 30, 50, 70, 90, 80, 60, 40, 30, 20, 40, 50, 60, 40].map((h, i) => (
                     <div 
                       key={i} 
                       className="w-1 rounded-full bg-[#00C2FF]" 
                       style={{ height: `${h}%` }}
                     />
                   ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-1 ml-2">
                <button className="p-2 text-[#95A3B8] hover:text-[#FF6A00] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#95A3B8] hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* --- TRACK 2 --- */}
            <div className="group flex items-center gap-4 p-4 rounded-xl 
                bg-[rgba(14,19,32,0.4)] border border-[rgba(255,255,255,0.05)]
                hover:bg-[rgba(14,19,32,0.8)] hover:border-[#FF6A00]/50 transition-all">
              
              <div className="relative w-16 h-16 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop" 
                  alt="Mix Art"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg cursor-pointer">
                  <div className="bg-[#FF6A00] p-2 rounded-full shadow-[0_0_15px_rgba(255,106,0,0.6)]">
                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-[#95A3B8] text-lg font-normal truncate group-hover:text-[#FF6A00] transition-colors">Spiral Dreams</h4>
                    <p className="text-[#95A3B8] text-xs uppercase tracking-widest">Auto Mixer • 5d ago</p>
                  </div>
                  <span className="text-[#95A3B8] text-sm font-mono">38:15</span>
                </div>
                
                <div className="h-10 w-full flex items-center gap-[2px] overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity">
                   {[40, 60, 30, 80, 50, 40, 70, 20, 50, 30, 60, 40, 20, 50, 70, 90, 40, 30, 50, 60, 70, 40, 30, 50, 60, 40, 30, 20, 40, 50, 70, 90, 60, 40, 30].map((h, i) => (
                     <div 
                       key={i} 
                       className="w-1 rounded-full bg-[#EAF2FF] hover:bg-[#FF6A00]/50" 
                       style={{ height: `${h}%` }}
                     />
                   ))}
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <button className="p-2 text-[#95A3B8] hover:text-[#FF6A00] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#95A3B8] hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* --- TRACK 3 --- */}
            <div className="group flex items-center gap-4 p-4 rounded-xl 
                bg-[rgba(14,19,32,0.4)] border border-[rgba(255,255,255,0.05)]
                hover:bg-[rgba(14,19,32,0.8)] hover:border-[#FF6A00]/50 transition-all">
              
              <div className="relative w-16 h-16 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=200&auto=format&fit=crop" 
                  alt="Mix Art"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg cursor-pointer">
                  <div className="bg-[#FF6A00] p-2 rounded-full shadow-[0_0_15px_rgba(255,106,0,0.6)]">
                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="text-[#95A3B8] text-lg font-normal truncate group-hover:text-[#FF6A00] transition-colors">Good Vibes Mix</h4>
                    <p className="text-[#95A3B8] text-xs uppercase tracking-widest">Auto Mixer • 1w ago</p>
                  </div>
                  <span className="text-[#95A3B8] text-sm font-mono">52:10</span>
                </div>
                
                <div className="h-10 w-full flex items-center gap-[2px] overflow-hidden opacity-40 group-hover:opacity-100 transition-opacity">
                   {[20, 40, 60, 40, 30, 50, 70, 40, 20, 50, 60, 80, 40, 20, 50, 70, 40, 20, 50, 60, 70, 80, 40, 30, 50, 60, 40, 30, 20, 40, 50, 70, 90, 60, 40, 30].map((h, i) => (
                     <div 
                       key={i} 
                       className="w-1 rounded-full bg-[#EAF2FF] hover:bg-[#FF6A00]/50" 
                       style={{ height: `${h}%` }}
                     />
                   ))}
                </div>
              </div>

              <div className="flex items-center gap-1 ml-2">
                <button className="p-2 text-[#95A3B8] hover:text-[#FF6A00] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-[#95A3B8] hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
