# Syntax Audio Intelligence v1 — Engineering Handoff

**Status:** FROZEN for v1 Production Release  
**Date:** December 28, 2025  
**Design Philosophy:** Underground warehouse DJ aesthetic meets professional audio software

---

## 🔒 SCOPE FREEZE — LOCKED FOR v1

The following systems are **COMPLETE** and must not change in v1:

### ✅ CREATE SYSTEM
- **Create Track** (Suno-style prompt-based generation)
- Generates **3 versions** (A, B, C) per session
- **Editable metadata** (Title + Artist) post-generation
- **Advanced options** hidden by default (expandable)
- Session state persists across navigation
- Clear "Upload music → Analysis → Learned DNA" flow
- No manual tuning or placeholder data

**File:** `/src/app/components/create-track.tsx`

---

### ✅ LIBRARY SYSTEM
- **Single Track Library** (Rekordbox-style dense table)
- **Fixed columns:** Play | Artwork | Title | Artist | BPM | Key | Time | Energy | Version | Actions
- **Draggable columns** (reorderable, resizable)
- **Draggable tracks** (manual reordering with drag handles)
- **Inline editing** (Title, Artist) with double-click or F2
- **Keyboard shortcuts:**
  - `Space` = Play/Pause selected track
  - `Cmd/Ctrl + A` = Select all
  - `Cmd/Ctrl + C` = Share
  - `Cmd/Ctrl + E` = Export
  - `Cmd/Ctrl + D` = Duplicate
  - `Delete/Backspace` = Delete with confirmation
  - `F2` = Edit title
  - `Arrow Up/Down` = Navigate
  - `Shift + Arrow` = Multi-select
- **Right-click context menu** with all actions
- **Multi-selection** support (Shift, Cmd/Ctrl)
- **Status indicators:** NOW PLAYING, UP NEXT, READY, PLAYED
- **Search** with real-time filtering

**File:** `/src/app/components/track-library-dj.tsx`

---

### ✅ AUTO DJ SYSTEM

#### **Auto DJ Mix Crate** (Explicit Queue System)
- **360px wide** right panel
- **NOW PLAYING** section with progress tracking
- **UP NEXT** queue with full metadata
- **Manual reordering** (drag handles)
- **Lock/unlock** individual tracks
- **Energy curve modes:**
  - Linear Rise
  - Peaks & Valleys
  - Plateau
  - Controlled Descent
- **AI Suggestions** shown as ghosted rows (never auto-injected)
- **Transparent logic** (no hidden tracks)
- **Add from Library** integration

**File:** `/src/app/components/auto-dj-mix-crate.tsx`

#### **Auto DJ Mixer** (Professional Hardware Emulation)
- **Dual-deck waveforms:**
  - Flat, data-driven (not decorative blobs)
  - Visible transients, kicks, breakdowns
  - Deck A = Orange (primary)
  - Deck B = Purple
  - Fixed center playhead, scrolling waveforms
  - Phrase markers every 8 bars
- **Professional status strip:**
  - "Beatmatched — harmonic match (12 bars)"
  - "Preparing next track — waiting for phrase boundary (4 bars)"
  - "Transition: long blend • EQ sweep • time remaining: 0:08"
- **Mix Style presets:**
  - Smooth/Deep (32-bar blends, minimal EQ)
  - Club/Peak (16-bar blends, strong EQ)
  - Hypnotic (32-bar blends, subtle movement)
  - Aggressive (8-bar blends, intense action)
- **Human-like motion:**
  - Crossfader: 8-10 second transitions with easing
  - EQ: 4-6 second gradual sweeps
  - Gain: Rare micro-adjustments
  - Never twitchy or constantly moving
- **Transition intelligence:**
  - Phrase-aligned (8/16/32-bar boundaries)
  - 4-phase system: Stable → Preparing → Blending → Completing
  - BPM-accurate waveform scrolling
- **Two-channel mixer layout:**
  - Gain knobs (top)
  - 3-band EQ (HI/MID/LOW)
  - Channel volume faders
  - Crossfader with A/B labels
- **Observer-only UI** (no manual controls)

**File:** `/src/app/components/auto-dj-mixer-pro-v3.tsx`

---

### ✅ SHARE SYSTEM (Streaming/Listening)

**Share = Listening ONLY. Never includes downloads.**

**Share Modal Contents:**
- Mini player (play/pause, waveform, time)
- Track title + artist
- **Copy Link** button (primary orange)
- **Embed code** (secondary)
- **Social icons** (X, Instagram, TikTok only)
- Microcopy: "This link lets anyone listen — no account required."

**Available from:**
- Track Library (row action + context menu + Cmd+C)
- Version A/B/C cards
- Mix Complete screen

**File:** `/src/app/components/share-modal.tsx`

---

### ✅ EXPORT SYSTEM (Downloadable Files)

**Export = Files ONLY. Never includes streaming/listening.**

**Export Modal Structure:**

#### **SECTION 1: Quick Export**
- Radio options:
  - MP3 (320 kbps)
  - WAV (24-bit) **DEFAULT**
- Helper: "Most DJs choose WAV."

#### **SECTION 2: Stem Export** (CORE FEATURE)
- Checkbox: "Export stems (WAV multitrack)"
- Includes:
  - Drums (WAV 24-bit)
  - Bass (WAV 24-bit)
  - Music (WAV 24-bit)
  - Vocals (WAV 24-bit, if present)
  - FX (WAV 24-bit)
- Details: BPM-aligned, bar-aligned
- Microcopy: "Clean, tempo-aligned stems for remixing and live sets."

#### **SECTION 3: DJ Data** (DEFAULT ON)
- ☑ Cue Sheet (TXT + PDF)
- ☑ Beat Grid Info
- ☑ Key Info (Camelot)
- Microcopy: "Built for DJ prep and harmonic mixing."

#### **SECTION 4: Loudness Profile**
- Radio options:
  - **Club / DJ** (DEFAULT)
  - Streaming Safe
  - Pre-Master
- Microcopy: "You can re-export anytime."

#### **Session Export**
- Single Version (A, B, or C)
- Full Session Package (all versions + stems + cue sheets + metadata)

#### **Post-Export State**
- Message: "Your export is ready"
- Download Files button
- Copy Share Link button
- Microcopy: "You can re-export with different settings anytime."

**Available from:**
- Track Library (row action + context menu + Cmd+E)
- Version A/B/C cards
- Session view
- Mix Complete screen

**File:** `/src/app/components/export-modal.tsx`

---

### ✅ NAVIGATION SYSTEM

**Single Persistent Sidebar** (260px wide)

#### **LIBRARY Section:**
- All Tracks
- DNA Library (learned patterns from uploaded music)
- Sessions (A/B/C groupings)

#### **DJ TOOLS Section:**
- DJ Mix Analyzer
- Auto DJ Mixer

#### **CREATE Section:**
- Create Track (Suno-style)

**Navigation Rules:**
- All DJ Tools route to real screens
- No fallback to Landing Page
- Empty states instead of redirects
- Active state shows orange left border

**Files:**
- `/src/app/components/sidebar-nav.tsx`
- `/src/app/App.tsx`

---

### ✅ BRANDING & VISUAL SYSTEM

#### **Logo**
- Clean SVG logo in app chrome (sidebar header)
- No large hero logo
- Simple, professional presentation

#### **Color System (High-Contrast DJ Aesthetic)**
- **Base:** Near-black backgrounds (#000000, #18181b)
- **Primary text:** True white (#ffffff)
- **Secondary text:** Muted gray (white/60, white/40)
- **Accent:** Warm orange (CSS variable `--primary`)
  - Used for: CTAs, active states, NOW PLAYING, section highlights
  - NO gradients, NO neon glow effects
- **Deck B accent:** Purple (#a855f7, purple-500)
- **Borders:** white/10, white/20 for subtle separation

#### **Typography**
- **Headings:** System condensed sans-serif
- **Labels/Logs/Data:** IBM Plex Mono
- **Font Size:** Use default theme sizes (NO text-2xl, font-bold, etc.)
- **Line Height:** Use default theme values

#### **Visual Effects**
- Subtle grain/vignette (optional, minimal)
- Faint scanlines (optional, minimal)
- NO flashy animations
- NO rounded cartoon visuals

**Files:**
- `/src/styles/theme.css` (DO NOT MODIFY tokens unless explicitly requested)
- `/src/styles/fonts.css` (font imports only)

---

## 🚫 OUT OF SCOPE FOR v1

**Explicitly excluded from v1 (goes to v2 backlog):**

- User-defined DNA profiles
- Collaborative sessions
- Cloud DAWs
- Manual mastering controls
- Social feeds
- Mobile layouts (desktop-first)
- Offline mode
- User authentication
- Real-time collaboration
- Audio file upload/processing (all generation is prompt-based in v1)

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Stack**
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4.0
- **State Management:** React useState/useEffect (no external state library)
- **Routing:** Manual navigation state in App.tsx
- **Icons:** lucide-react
- **Toasts:** sonner
- **Build:** Vite

### **Key Dependencies**
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "lucide-react": "latest",
  "sonner": "latest",
  "tailwindcss": "^4.0.0"
}
```

### **File Structure**
```
/src
  /app
    /components
      - sidebar-nav.tsx
      - create-track.tsx
      - track-library-dj.tsx
      - auto-dj-mixer-pro-v3.tsx
      - auto-dj-mix-crate.tsx
      - share-modal.tsx
      - export-modal.tsx
      - dj-mix-analyzer.tsx
      - analysis-screen.tsx
      - mix-complete.tsx
      - auto-dj-mix-selector.tsx
      /ui (shadcn components)
        - context-menu.tsx
        - alert-dialog.tsx
    - App.tsx (main routing)
  /styles
    - theme.css (design tokens - DO NOT MODIFY)
    - fonts.css (font imports only)
  /imports
    - (SVG files from Figma imports)
```

### **Component Patterns**

#### **State Management**
- Use `useState` for local component state
- Use `useEffect` for side effects and intervals
- Pass state down via props (no context or global state)

#### **Styling**
- Tailwind utility classes
- NO inline styles except for dynamic transforms/positions
- NO custom CSS files (use Tailwind only)
- Respect theme.css typography defaults

#### **Interactions**
- Keyboard shortcuts via `useEffect` + `addEventListener`
- Drag & drop via native HTML5 drag API
- Context menus via shadcn ContextMenu component
- Modals via conditional rendering

#### **Mock Data**
- All data is currently mocked/hardcoded
- API integration is v2 scope
- Keep mock data realistic and consistent

---

## 🎯 BUILD PRIORITIES (Engineering Focus)

### **1. Track Library Behavior & Performance**
- Ensure smooth scrolling with large track counts (100+ tracks)
- Optimize drag & drop performance
- Test keyboard shortcuts thoroughly
- Validate multi-selection edge cases

### **2. Auto DJ Mixer Stability**
- Smooth waveform scrolling at 60fps
- Accurate easing for crossfader/EQ transitions
- Phrase-aligned transition logic correctness
- BPM-based scroll speed accuracy

### **3. Export Reliability**
- Stem export flow completeness
- Cue sheet generation logic
- Loudness profile application
- Session export packaging

### **4. Share Player Performance**
- Waveform rendering optimization
- Playback state management
- Embed code generation

### **5. Create Track Generation Flow**
- Form validation
- Session state persistence
- Version A/B/C management
- Metadata editing

---

## ✅ SUCCESS CRITERIA FOR v1

**v1 is successful if:**

1. **DJs trust it**
   - Feels like professional DJ software (Rekordbox/Traktor)
   - No "AI gimmicky" features or language
   - Underground warehouse aesthetic feels authentic

2. **Stems export cleanly**
   - All stem formats export correctly
   - BPM and bar alignment is accurate
   - Cue sheets are readable and useful

3. **Auto DJ feels human**
   - Transitions feel natural, not robotic
   - Mixer motion has realistic easing
   - No sudden snaps or twitchy movements

4. **Product feels finished, not experimental**
   - No placeholder UI or "coming soon" states
   - All interactions are polished
   - No bugs in core workflows

5. **Nothing feels "AI gimmicky"**
   - Professional language throughout
   - No hype or marketing speak in UI
   - No unnecessary animations or effects

---

## 🔒 NO FURTHER DESIGN CHANGES

**After this freeze:**

- ✅ **Bug fixes allowed** (fixing broken behavior)
- ✅ **Performance optimizations allowed**
- ✅ **Accessibility improvements allowed**
- ❌ **NO layout changes**
- ❌ **NO new features**
- ❌ **NO UX/interaction changes**
- ❌ **NO visual redesigns**

**Any new ideas go into v2 backlog.**

---

## 📋 TESTING CHECKLIST

### **Track Library**
- [ ] Drag column headers to reorder
- [ ] Resize columns by dragging borders
- [ ] Drag tracks to reorder
- [ ] Multi-select with Shift + Arrow
- [ ] Multi-select with Cmd/Ctrl + Click
- [ ] Select all with Cmd/Ctrl + A
- [ ] Right-click context menu
- [ ] Keyboard shortcuts (all listed above)
- [ ] Inline editing (double-click, F2)
- [ ] Search filtering
- [ ] Play/Pause from row action
- [ ] Share modal opens (Cmd+C)
- [ ] Export modal opens (Cmd+E)
- [ ] Delete confirmation (Delete key)

### **Auto DJ Mixer**
- [ ] Waveforms scroll smoothly
- [ ] Playhead stays centered
- [ ] Phrase markers align correctly
- [ ] Crossfader moves slowly (8-10 sec)
- [ ] EQ knobs move gradually (4-6 sec)
- [ ] Status strip updates correctly
- [ ] Mix style presets change behavior
- [ ] Deck A/B colors are correct
- [ ] Transitions are phrase-aligned
- [ ] No sudden snaps or jumps

### **Auto DJ Mix Crate**
- [ ] Tracks can be reordered
- [ ] Lock/unlock functionality
- [ ] Energy curve mode switching
- [ ] AI suggestions appear as ghosted
- [ ] NOW PLAYING section updates
- [ ] UP NEXT highlights correctly
- [ ] Add from Library works
- [ ] Manual vs AI mode toggle

### **Share Modal**
- [ ] Mini player works
- [ ] Copy link button
- [ ] Embed code button
- [ ] Social share buttons
- [ ] Waveform displays
- [ ] No download options present

### **Export Modal**
- [ ] Format selection (MP3/WAV)
- [ ] Stem export checkbox
- [ ] DJ Data checkboxes
- [ ] Loudness profile selection
- [ ] Session export mode (if session)
- [ ] Export process simulation
- [ ] Ready state displays
- [ ] Download button works
- [ ] No share/streaming options present

### **Create Track**
- [ ] Prompt input works
- [ ] Advanced options expand/collapse
- [ ] Generate creates A/B/C versions
- [ ] Title/Artist editable post-gen
- [ ] Session state persists

### **Navigation**
- [ ] Sidebar navigation works
- [ ] All routes lead to real screens
- [ ] Active state highlights correctly
- [ ] No unexpected redirects

---

## 🎨 DESIGN TOKENS (LOCKED)

**DO NOT MODIFY `/src/styles/theme.css` tokens unless explicitly requested.**

Current theme uses:
- CSS variables for colors
- Default typography sizing
- Minimal border-radius
- Professional spacing scale

---

## 📞 HANDOFF CONTACTS

**Design Questions:** Refer to this document  
**Scope Questions:** Refer to OUT OF SCOPE section  
**Priority Questions:** Refer to BUILD PRIORITIES section

---

## 🚀 NEXT STEPS FOR ENGINEERING

1. **Review this document** thoroughly
2. **Run testing checklist** against current build
3. **File bugs** for broken behaviors (NOT design changes)
4. **Optimize performance** for large datasets
5. **Prepare for production deployment**

---

**END OF v1 FREEZE DOCUMENT**

All systems locked. Ship it. 🚢
