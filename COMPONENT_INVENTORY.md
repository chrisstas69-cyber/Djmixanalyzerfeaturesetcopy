# Syntax Audio Intelligence v1 — Component Inventory

**Complete list of all production components with status and dependencies**

---

## 🟢 PRODUCTION READY (v1 Shipping)

### **Navigation & Layout**

| Component | File | Purpose | Dependencies |
|-----------|------|---------|--------------|
| `App` | `/src/app/App.tsx` | Main router, layout orchestration | All screen components |
| `SidebarNav` | `/src/app/components/sidebar-nav.tsx` | 260px persistent sidebar navigation | lucide-react |
| `Toaster` | `/src/app/components/ui/sonner.tsx` | Toast notification system | sonner |

---

### **Create System**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `CreateTrackModern` | `/src/app/components/create-track-modern.tsx` | Suno-style prompt generation | ✅ Production |

**Features:**
- Prompt-based track generation
- Version A/B/C creation
- Advanced options (hidden by default)
- Editable metadata post-generation
- Session state persistence

---

### **Library System**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `TrackLibraryDJ` | `/src/app/components/track-library-dj.tsx` | Rekordbox-style track table | ✅ Production |
| `DNAUnified` | `/src/app/components/dna-unified.tsx` | Learned DNA pattern library | ✅ Production |

**TrackLibraryDJ Features:**
- 10 columns (Play, Artwork, Title, Artist, BPM, Key, Time, Energy, Version, Actions)
- Draggable columns (reorder, resize)
- Draggable tracks (manual reordering)
- Multi-selection (Shift, Cmd/Ctrl)
- Keyboard shortcuts (Space, Cmd+A, Cmd+C, Cmd+E, Delete, F2, Arrows)
- Right-click context menu
- Inline editing (Title, Artist)
- Search/filter
- Status indicators (NOW PLAYING, UP NEXT, READY, PLAYED)

**DNAUnified Features:**
- Grid view of learned DNA patterns
- Source track references
- Characteristics display
- "Upload music → Analysis → Learned DNA" flow

---

### **DJ Tools**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `DJMixAnalyzer` | `/src/app/components/dj-mix-analyzer.tsx` | Mix analysis tool | ✅ Production |
| `AutoDJMixerProV3` | `/src/app/components/auto-dj-mixer-pro-v3.tsx` | Professional dual-deck mixer | ✅ Production |
| `AutoDJMixCrate` | `/src/app/components/auto-dj-mix-crate.tsx` | Explicit queue system (360px panel) | ✅ Production |
| `AutoDJMixSelector` | `/src/app/components/auto-dj-mix-selector.tsx` | Track selection workflow | ✅ Production |

**AutoDJMixerProV3 Features:**
- Dual-deck waveforms (Orange/Purple)
- Flat, data-driven waveform generation
- Phrase markers (8-bar intervals)
- Professional status strip
- Mix Style presets (Smooth, Club, Hypnotic, Aggressive)
- Human-like motion (8-10s crossfader, 4-6s EQ)
- Phrase-aligned transitions (8/16/32-bar)
- Two-channel mixer layout (Gain, 3-band EQ, Faders, Crossfader)
- Observer-only UI (no manual controls)

**AutoDJMixCrate Features:**
- NOW PLAYING section with progress
- UP NEXT queue with metadata
- Manual reordering (drag handles)
- Lock/unlock tracks
- Energy curve modes (Linear Rise, Peaks & Valleys, Plateau, Descent)
- AI Suggestions (ghosted rows, never auto-injected)
- Add from Library integration

---

### **Analysis & Results**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `AnalysisScreen` | `/src/app/components/analysis-screen.tsx` | Analysis results display | ✅ Production |
| `MixComplete` | `/src/app/components/mix-complete.tsx` | Mix completion screen | ✅ Production |

---

### **Share & Export**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `ShareModal` | `/src/app/components/share-modal.tsx` | Streaming/listening modal | ✅ Production |
| `ExportModal` | `/src/app/components/export-modal.tsx` | File download modal | ✅ Production |

**ShareModal Features:**
- Mini player (play/pause, waveform, time)
- Track title + artist
- Copy Link button (primary)
- Embed code button (secondary)
- Social icons (X, Instagram, TikTok)
- Microcopy: "This link lets anyone listen — no account required."
- NO download options

**ExportModal Features:**
- Quick Export (MP3 320kbps / WAV 24-bit)
- Stem Export (Drums, Bass, Music, Vocals, FX - all WAV 24-bit)
- DJ Data (Cue Sheet, Beat Grid, Key Info)
- Loudness Profile (Club/Streaming/Pre-Master)
- Session Export (Single Version / Full Package)
- Post-export state (Download Files, Copy Share Link)
- NO streaming options

---

### **UI Components (shadcn)**

| Component | File | Purpose | Status |
|-----------|------|---------|--------|
| `ContextMenu` | `/src/app/components/ui/context-menu.tsx` | Right-click menus | ✅ Production |
| `AlertDialog` | `/src/app/components/ui/alert-dialog.tsx` | Confirmation dialogs | ✅ Production |
| `Sonner` | `/src/app/components/ui/sonner.tsx` | Toast wrapper | ✅ Production |

---

## 🟡 LEGACY / REFERENCE ONLY (DO NOT USE)

These components exist in the codebase but are **NOT** used in v1. They are kept for reference or migration purposes:

| Component | File | Reason |
|-----------|------|--------|
| `LandingHero` | `/src/app/components/landing-hero.tsx` | Initial landing page (now bypassed) |
| `SharePlayer` | `/src/app/components/share-player.tsx` | Old share player (replaced by ShareModal) |
| `SessionSharePlayer` | `/src/app/components/session-share-player.tsx` | Old session player (replaced by ShareModal) |
| `ExportShareDemo` | `/src/app/components/export-share-demo.tsx` | Demo component (not production) |
| `EmptyStatesDemo` | `/src/app/components/empty-states.tsx` | Demo component (not production) |
| `AutoDJMixerProV2` | `/src/app/components/auto-dj-mixer-pro-v2.tsx` | Old mixer (replaced by V3) |

---

## 📊 COMPONENT DEPENDENCY GRAPH

```
App.tsx
├── SidebarNav
├── Toaster (sonner)
└── [Active View]
    ├── CreateTrackModern
    │   └── (standalone, no modals)
    ├── TrackLibraryDJ
    │   ├── ContextMenu (ui/context-menu)
    │   ├── AlertDialog (ui/alert-dialog)
    │   ├── ShareModal
    │   └── ExportModal
    ├── DNAUnified
    │   └── (standalone)
    ├── DJMixAnalyzer
    │   └── (standalone)
    ├── AutoDJMixerProV3
    │   └── AutoDJMixCrate
    ├── AutoDJMixSelector
    │   └── (standalone)
    ├── AnalysisScreen
    │   └── (standalone)
    └── MixComplete
        ├── ShareModal
        └── ExportModal
```

---

## 🎨 COMPONENT DESIGN PATTERNS

### **Modal Pattern**

All modals follow this structure:

```typescript
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // ... specific props
}

export function Modal({ open, onOpenChange, ...props }: ModalProps) {
  if (!open) return null; // Early return for performance
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#18181b] border border-white/10 w-full max-w-lg">
        {/* Header with close button */}
        <button onClick={() => onOpenChange(false)}>
          <X />
        </button>
        
        {/* Content */}
      </div>
    </div>
  );
}
```

**Usage:**
```typescript
const [modalOpen, setModalOpen] = useState(false);

<Modal open={modalOpen} onOpenChange={setModalOpen} {...props} />
```

---

### **Table/List Pattern**

Dense data tables follow Rekordbox-style layout:

```typescript
// Fixed row height for performance
const ROW_HEIGHT = 40;

// Columns with metadata
interface Column {
  id: ColumnId;
  label: string;
  width: number;
  minWidth: number;
  align: "left" | "center" | "right";
  visible: boolean;
}

// Render loop
{tracks.map((track, index) => (
  <div
    key={track.id}
    className="flex items-center border-b border-white/10"
    style={{ height: `${ROW_HEIGHT}px` }}
  >
    {/* Cells */}
  </div>
))}
```

---

### **Animation Pattern**

All animations use intervals with cleanup:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // Update state with easing
    setState((prev) => {
      const diff = prev.target - prev.value;
      if (Math.abs(diff) < 0.1) return prev;
      return { ...prev, value: prev.value + diff * SPEED };
    });
  }, 50); // 20fps

  return () => clearInterval(interval);
}, [dependencies]);
```

---

### **Selection Pattern**

Multi-selection logic:

```typescript
const [selectedItems, setSelectedItems] = useState<string[]>([]);
const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

const handleClick = (itemId: string, index: number, event: MouseEvent) => {
  if (event.shiftKey && lastSelectedIndex !== null) {
    // Range selection
    const start = Math.min(lastSelectedIndex, index);
    const end = Math.max(lastSelectedIndex, index);
    const range = items.slice(start, end + 1).map(i => i.id);
    setSelectedItems(range);
  } else if (event.metaKey || event.ctrlKey) {
    // Toggle selection
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  } else {
    // Replace selection
    setSelectedItems([itemId]);
  }
  
  setLastSelectedIndex(index);
};
```

---

## 🧪 COMPONENT TESTING CHECKLIST

### **TrackLibraryDJ**
- [ ] Drag column headers to reorder
- [ ] Resize columns by dragging borders
- [ ] Drag tracks to reorder
- [ ] Multi-select with Shift + Click
- [ ] Multi-select with Cmd/Ctrl + Click
- [ ] Keyboard navigation (Arrow keys)
- [ ] Keyboard shortcuts (Space, Cmd+A, Cmd+C, Cmd+E, Delete, F2)
- [ ] Right-click context menu
- [ ] Inline editing (double-click, F2)
- [ ] Search filtering
- [ ] Status indicators display correctly

### **AutoDJMixerProV3**
- [ ] Waveforms scroll smoothly (60fps)
- [ ] Playhead stays centered
- [ ] Phrase markers align at 8-bar intervals
- [ ] Crossfader moves slowly (8-10 seconds)
- [ ] EQ knobs move gradually (4-6 seconds)
- [ ] Status strip updates correctly
- [ ] Mix Style presets change behavior
- [ ] Deck A = Orange, Deck B = Purple
- [ ] Transitions are phrase-aligned
- [ ] No sudden snaps or jumps

### **AutoDJMixCrate**
- [ ] Tracks can be reordered (unless locked)
- [ ] Lock/unlock toggles work
- [ ] Energy curve modes switch correctly
- [ ] AI suggestions appear as ghosted
- [ ] NOW PLAYING updates
- [ ] UP NEXT highlights correctly
- [ ] Add from Library opens and works

### **ShareModal**
- [ ] Mini player plays/pauses
- [ ] Waveform displays correctly
- [ ] Copy Link button works
- [ ] Embed code button works
- [ ] Social icons trigger correct actions
- [ ] NO download options present

### **ExportModal**
- [ ] Format selection (MP3/WAV) works
- [ ] Stem export checkbox enables stems list
- [ ] DJ Data checkboxes toggle
- [ ] Loudness profile selection works
- [ ] Session export mode (if session) works
- [ ] Export simulation completes
- [ ] Ready state displays correctly
- [ ] NO share/streaming options present

---

## 🔧 MAINTENANCE NOTES

### **When to Create a New Component**

✅ **Create new component if:**
- Logic exceeds 300 lines
- Component is reused in 3+ places
- Component has complex state management
- Component has distinct responsibility

❌ **Keep inline if:**
- Simple presentational markup (<50 lines)
- Used only once
- No complex logic
- Part of parent's core responsibility

### **File Naming Convention**

```
kebab-case.tsx       // All component files
PascalCase           // Component names
camelCase            // Function/variable names
UPPER_SNAKE_CASE     // Constants
```

### **Import Order**

```typescript
// 1. React
import { useState, useEffect } from "react";

// 2. External libraries
import { Play, Pause } from "lucide-react";
import { toast } from "sonner";

// 3. UI components
import { ContextMenu } from "./ui/context-menu";

// 4. Local components
import { ShareModal } from "./share-modal";

// 5. Types
interface MyProps { ... }
type MyType = ...;
```

---

## 📦 COMPONENT SIZE REFERENCE

| Component | Lines | Complexity | Notes |
|-----------|-------|------------|-------|
| `App.tsx` | ~120 | Low | Simple router |
| `SidebarNav` | ~150 | Low | Static navigation |
| `TrackLibraryDJ` | ~900 | High | Complex interactions |
| `AutoDJMixerProV3` | ~700 | High | Animation-heavy |
| `AutoDJMixCrate` | ~550 | Medium | Queue management |
| `ShareModal` | ~250 | Low | Simple modal |
| `ExportModal` | ~550 | Medium | Form with sections |

**Target:** Keep components under 500 lines. Split if exceeding 800 lines.

---

## 🚀 PERFORMANCE BENCHMARKS

| Component | Target FPS | Load Time | Notes |
|-----------|------------|-----------|-------|
| `TrackLibraryDJ` | 60fps scroll | <100ms (100 tracks) | Virtual scrolling recommended for 1000+ |
| `AutoDJMixerProV3` | 60fps waveform | <50ms | GPU-accelerated transforms |
| `AutoDJMixCrate` | 60fps drag | <50ms | Lightweight DOM updates |

---

**END OF COMPONENT INVENTORY**

All components documented and ready for production. 🎯
