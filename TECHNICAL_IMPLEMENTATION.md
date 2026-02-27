# Syntax Audio Intelligence v1 — Technical Implementation Guide

**Status:** Production Ready  
**Last Updated:** December 28, 2025

---

## 📁 PROJECT STRUCTURE

```
syntax-audio-intelligence/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── sidebar-nav.tsx              [Navigation - 260px sidebar]
│   │   │   ├── create-track-modern.tsx      [CREATE - Suno-style prompt gen]
│   │   │   ├── track-library-dj.tsx         [LIBRARY - Rekordbox-style table]
│   │   │   ├── dna-unified.tsx              [DNA Library - learned patterns]
│   │   │   ├── analysis-screen.tsx          [Analysis results]
│   │   │   ├── dj-mix-analyzer.tsx          [DJ Mix Analyzer tool]
│   │   │   ├── auto-dj-mixer-pro-v3.tsx     [Auto DJ - Professional mixer]
│   │   │   ├── auto-dj-mix-crate.tsx        [Auto DJ - Queue system]
│   │   │   ├── auto-dj-mix-selector.tsx     [Auto DJ - Track selection]
│   │   │   ├── share-modal.tsx              [SHARE - Streaming/listening]
│   │   │   ├── export-modal.tsx             [EXPORT - File downloads]
│   │   │   ├── mix-complete.tsx             [Mix completion screen]
│   │   │   └── ui/                          [shadcn components]
│   │   │       ├── context-menu.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       └── sonner.tsx
│   │   └── App.tsx                          [Main router]
│   ├── styles/
│   │   ├── theme.css                        [Design tokens - LOCKED]
│   │   └── fonts.css                        [Font imports only]
│   └── imports/                             [SVG assets from Figma]
├── package.json
├── V1_FREEZE.md                             [Scope freeze document]
└── TECHNICAL_IMPLEMENTATION.md              [This file]
```

---

## 🎨 DESIGN SYSTEM (LOCKED)

### **Color Palette**

```css
/* Base Colors */
--background: #000000;           /* True black */
--card-bg: #18181b;              /* Near-black for cards */
--border-subtle: rgba(255,255,255,0.1);
--border-medium: rgba(255,255,255,0.2);

/* Typography */
--text-primary: #ffffff;         /* True white */
--text-secondary: rgba(255,255,255,0.6);  /* Muted gray */
--text-tertiary: rgba(255,255,255,0.4);   /* Very muted */

/* Accents */
--primary: #ea580c;              /* Warm orange - USE SPARINGLY */
--deck-a: #ea580c;               /* Orange (same as primary) */
--deck-b: #a855f7;               /* Purple (purple-500) */
```

### **Typography**

- **Headings:** System condensed sans-serif (default)
- **Data/Labels:** `font-['IBM_Plex_Mono']`
- **DO NOT USE:** text-2xl, font-bold, leading-tight (use theme defaults)

### **Spacing**

- Use Tailwind spacing scale (1-6 for tight, 8-12 for generous)
- Component padding: 4-6 units
- Section gaps: 6-8 units

### **Border Radius**

- Minimal/none for industrial aesthetic
- Exception: Pills/badges can have slight rounding

---

## 🧩 COMPONENT IMPLEMENTATION PATTERNS

### **1. Track Library (Rekordbox-Style)**

**File:** `/src/app/components/track-library-dj.tsx`

**Key Features:**
```typescript
// Fixed row height for virtual scrolling optimization
const ROW_HEIGHT = 40;

// Column system - draggable, resizable
interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  visible: boolean;
}

// Track selection state
const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
```

**Multi-Selection Logic:**
```typescript
// Single click - replace selection
// Cmd/Ctrl + Click - toggle selection
// Shift + Click - range selection from lastSelectedIndex
// Shift + Arrow - extend selection
```

**Keyboard Shortcuts:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Space - Play/Pause
    // Cmd/Ctrl + A - Select All
    // Cmd/Ctrl + C - Share
    // Cmd/Ctrl + E - Export
    // Delete/Backspace - Delete with confirmation
    // F2 - Edit title
    // Arrow Up/Down - Navigate
  };
  
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [selectedTracks]);
```

**Drag & Drop:**
```typescript
// HTML5 Drag API
onDragStart={(e) => {
  e.dataTransfer.effectAllowed = "move";
  setDraggedTracks(selectedTracks.includes(track.id) ? selectedTracks : [track.id]);
}}

onDrop={(e) => {
  // Reorder tracks array
  // Update state
}}
```

---

### **2. Auto DJ Mixer (Professional Hardware Emulation)**

**File:** `/src/app/components/auto-dj-mixer-pro-v3.tsx`

**Waveform Generation:**
```typescript
function generateProfessionalWaveform(samples: number, seed: number = 0) {
  // Kick drums (4/4 pattern)
  const isKick = kickPos === 0 || kickPos === 4 || kickPos === 8 || kickPos === 12;
  
  // Snare/clap (on 2 and 4)
  const isSnare = kickPos === 6 || kickPos === 14;
  
  // Bassline, mids, highs
  // Phrase structure (8-bar phrases)
  // Breakdown/build sections
  // Noise floor (always present)
  
  return data; // Array of height percentages
}
```

**Human-Like Motion (Easing):**
```typescript
const smoothKnob = (knob: Knob, speed: number): Knob => {
  const diff = knob.target - knob.value;
  if (Math.abs(diff) < 0.1) return knob;
  return { ...knob, value: knob.value + diff * speed };
};

// Crossfader: 0.006 (very slow, 8-10 seconds)
// EQ: 0.007 (gradual, 4-6 seconds)
// Gain: 0.012 (rare micro-adjustments)
```

**Transition Phases:**
```typescript
type TransitionPhase = "stable" | "preparing" | "blending" | "completing";

// Stable: Normal mixing, rare EQ adjustments
// Preparing: 4 bars before transition, cue next deck
// Blending: Active crossfader motion + EQ sweeps
// Completing: Deck swap, reset for next cycle
```

**Mix Style Presets:**
```typescript
const MIX_STYLES: Record<MixStyle, MixStyleConfig> = {
  smooth: { blendBars: 32, eqIntensity: 3, transitionSeconds: 30 },
  club: { blendBars: 16, eqIntensity: 6, transitionSeconds: 22 },
  hypnotic: { blendBars: 32, eqIntensity: 2, transitionSeconds: 35 },
  aggressive: { blendBars: 8, eqIntensity: 8, transitionSeconds: 18 },
};
```

---

### **3. Auto DJ Mix Crate (Queue System)**

**File:** `/src/app/components/auto-dj-mix-crate.tsx`

**Queue Management:**
```typescript
interface QueueTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  key: string;
  energy: number;
  locked: boolean;
  isAISuggestion?: boolean; // Ghosted if true
}

// Drag to reorder (unless locked)
// AI suggestions shown as ghosted rows
// Never auto-inject tracks
```

**Energy Curve Modes:**
```typescript
type EnergyCurve = "linear-rise" | "peaks-valleys" | "plateau" | "controlled-descent";

// Visual indicator shows energy flow
// Lock icon prevents reordering
```

---

### **4. Share Modal (Streaming)**

**File:** `/src/app/components/share-modal.tsx`

**Modal Structure:**
```typescript
interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: {
    title: string;
    artist: string;
    duration: string;
    shareUrl?: string;
  } | null;
}

// ONLY includes:
// - Mini player
// - Copy Link (primary)
// - Embed code (secondary)
// - Social icons (X, Instagram, TikTok)
// NO download options
```

---

### **5. Export Modal (File Downloads)**

**File:** `/src/app/components/export-modal.tsx`

**Export Options:**
```typescript
interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track: {
    title: string;
    artist: string;
    hasVocals?: boolean;
  } | null;
  isSession?: boolean;
}

// SECTIONS:
// 1. Quick Export (MP3/WAV)
// 2. Stem Export (Drums, Bass, Music, Vocals, FX)
// 3. DJ Data (Cue Sheet, Beat Grid, Key Info)
// 4. Loudness Profile (Club/Streaming/Pre-Master)

// NO share/streaming options
```

**Post-Export State:**
```typescript
const [exportState, setExportState] = useState<"setup" | "ready">("setup");

// "ready" state shows:
// - Download Files button
// - Copy Share Link button
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### **Virtual Scrolling (Track Library)**

```typescript
// Fixed row height enables virtual scrolling
const ROW_HEIGHT = 40;

// Only render visible rows + buffer
const visibleStart = Math.floor(scrollTop / ROW_HEIGHT);
const visibleEnd = Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT);
const buffer = 10; // Render extra rows for smooth scrolling
```

### **Waveform Rendering**

```typescript
// Pre-generate waveform data (don't recalculate on every render)
const waveformDataA = useMemo(() => generateProfessionalWaveform(800, 1), []);
const waveformDataB = useMemo(() => generateProfessionalWaveform(800, 2), []);

// Use CSS transforms for scrolling (GPU-accelerated)
style={{ transform: `translateX(-${waveformScrollA}%)` }}
```

### **Animation Intervals**

```typescript
// Use requestAnimationFrame or setInterval with cleanup
useEffect(() => {
  const interval = setInterval(() => {
    // Update animation state
  }, 50); // 20fps for smooth motion without excessive CPU

  return () => clearInterval(interval);
}, [dependencies]);
```

---

## 🧪 TESTING SCENARIOS

### **Track Library Stress Tests**

```typescript
// Test with 1000+ tracks
const STRESS_TEST_TRACKS = Array.from({ length: 1000 }, (_, i) => ({
  id: `track-${i}`,
  title: `Track ${i}`,
  // ... other properties
}));

// Verify:
// - Smooth scrolling
// - Drag & drop performance
// - Search filtering speed
// - Selection performance
```

### **Auto DJ Timing Accuracy**

```typescript
// Verify BPM-accurate scrolling
const bpm = 128;
const beatsPerSecond = bpm / 60;
const scrollSpeed = beatsPerSecond * pixelsPerBeat;

// Verify phrase alignment
const barLength = (60 / bpm) * 4; // 4 beats per bar
const phraseLength = barLength * 8; // 8 bars per phrase
// Transitions must land on phrase boundaries
```

### **Modal Isolation**

```typescript
// Share and Export modals must NEVER appear together
// Test that opening one automatically closes the other
if (shareModalOpen) {
  expect(exportModalOpen).toBe(false);
}
```

---

## 🚨 COMMON PITFALLS

### **1. DO NOT modify theme.css**
```typescript
// ❌ WRONG - Adding custom classes to theme.css
.my-custom-class { ... }

// ✅ CORRECT - Use Tailwind utilities
className="bg-black border border-white/10 p-4"
```

### **2. DO NOT use font size/weight classes**
```typescript
// ❌ WRONG - Overriding typography
className="text-2xl font-bold leading-tight"

// ✅ CORRECT - Let theme defaults handle it
className="text-white" // Uses default size/weight from theme
```

### **3. DO NOT mix Share and Export**
```typescript
// ❌ WRONG - Combined modal
<ShareAndExportModal />

// ✅ CORRECT - Separate modals
<ShareModal />
<ExportModal />
```

### **4. DO NOT auto-inject tracks in Auto DJ**
```typescript
// ❌ WRONG - Hidden logic
queue.push(suggestedTrack); // User doesn't see this

// ✅ CORRECT - Transparent suggestions
aiSuggestions.push({ ...track, isAISuggestion: true }); // Ghosted row
```

---

## 📦 BUILD & DEPLOYMENT

### **Development**

```bash
npm install
npm run dev
```

### **Production Build**

```bash
npm run build
npm run preview # Test production build locally
```

### **Environment Variables**

```bash
# None required for v1 (all client-side)
# API integration is v2 scope
```

---

## 🔧 MAINTENANCE GUIDELINES

### **Allowed Changes in v1**

- ✅ Bug fixes (broken functionality)
- ✅ Performance optimizations
- ✅ Accessibility improvements (ARIA labels, keyboard nav)
- ✅ Console error fixes
- ✅ Browser compatibility fixes

### **NOT Allowed in v1**

- ❌ Layout changes
- ❌ New features
- ❌ UX/interaction redesigns
- ❌ Visual style changes
- ❌ Scope expansion

---

## 📚 REFERENCE IMPLEMENTATIONS

### **Context Menu Example**

```typescript
<ContextMenu>
  <ContextMenuTrigger>
    {/* Row content */}
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onClick={handleShare}>
      Share
      <ContextMenuShortcut>⌘C</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem onClick={handleExport}>
      Export
      <ContextMenuShortcut>⌘E</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem onClick={handleDelete}>
      Delete
      <ContextMenuShortcut>⌫</ContextMenuShortcut>
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

### **Toast Notifications**

```typescript
import { toast } from "sonner";

// Success
toast.success("Track exported successfully");

// Error
toast.error("Export failed");

// Loading
toast.loading("Preparing export...");

// Info
toast.info("Select a track to continue");
```

---

## 🎯 ENGINEERING PRIORITIES

1. **Performance first** - 60fps animations, smooth scrolling
2. **Keyboard accessibility** - All actions keyboard-navigable
3. **Error handling** - Graceful degradation, clear error messages
4. **Code clarity** - Readable, maintainable, well-commented
5. **Design fidelity** - Match freeze spec exactly

---

## 📞 SUPPORT & QUESTIONS

**Refer to:**
- `/V1_FREEZE.md` for scope and design decisions
- This document for technical implementation
- Existing component code for patterns and examples

**DO NOT:**
- Add new features without v2 scope approval
- Modify design system without explicit request
- Introduce new dependencies without review

---

**END OF TECHNICAL IMPLEMENTATION GUIDE**

Ship it with confidence. 🚀
