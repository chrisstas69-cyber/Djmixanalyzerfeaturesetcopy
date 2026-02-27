# Syntax Audio Intelligence v1 — Quick Start Guide

**Get up and running in 5 minutes**

---

## 🚀 Installation

```bash
# Clone repository
git clone <repository-url>
cd syntax-audio-intelligence

# Install dependencies
npm install

# Start development server
npm run dev
```

**Environment:** Node 18+ required

---

## 📂 First Steps

### **1. Understand the Architecture**

```
src/app/App.tsx              → Main router
src/app/components/          → All UI components
src/styles/theme.css         → Design tokens (DO NOT MODIFY)
```

### **2. Run the Application**

```bash
npm run dev
```

Open `http://localhost:5173` (or the URL shown in terminal)

### **3. Navigate the Interface**

**Sidebar (260px left panel):**
- LIBRARY → All Tracks, DNA Library, Sessions
- DJ TOOLS → DJ Mix Analyzer, Auto DJ Mixer
- CREATE → Create Track

**Main Content Area:**
- Currently shows `LandingHero` by default
- Click any sidebar item to navigate

---

## 🎯 Key Components to Explore

### **1. Track Library** (Most Complex)
**File:** `/src/app/components/track-library-dj.tsx`

**Try:**
- Click sidebar → "All Tracks"
- Drag column headers to reorder
- Drag track rows to reorder
- Right-click a track for context menu
- Press `Cmd+C` to open Share modal
- Press `Cmd+E` to open Export modal
- Press `F2` to edit track title
- Use arrow keys + Shift to multi-select

---

### **2. Auto DJ Mixer** (Most Visual)
**File:** `/src/app/components/auto-dj-mixer-pro-v3.tsx`

**Try:**
- Click sidebar → "Auto DJ Mixer"
- Watch the waveforms scroll
- Observe the crossfader move slowly (8-10 seconds)
- Change "Mix Style" presets (top right)
- Read the status strip (shows what's happening)

**Right Panel:** Auto DJ Mix Crate (queue system)

---

### **3. Share vs Export** (Critical Separation)

**Share Modal:**
- Click "All Tracks" → Click Share icon on any track
- Only shows: Player, Copy Link, Embed, Social
- NO download options

**Export Modal:**
- Click "All Tracks" → Click Export icon on any track
- Only shows: Format, Stems, DJ Data, Loudness
- NO share/streaming options

**NEVER mix these two!**

---

## 🎨 Design System Quick Reference

### **Colors**

```tsx
// Use these Tailwind classes:
className="bg-black"                    // True black background
className="bg-[#18181b]"                // Card background
className="border-white/10"             // Subtle border
className="text-white"                  // Primary text
className="text-white/60"               // Secondary text
className="text-white/40"               // Tertiary text
className="bg-primary"                  // Orange accent (SPARINGLY)
className="text-primary"                // Orange text
```

### **Typography**

```tsx
// DON'T use these:
className="text-2xl font-bold leading-tight"  ❌

// DO use theme defaults:
className="text-white"                        ✅

// For monospace data:
className="font-['IBM_Plex_Mono']"            ✅
```

### **Spacing**

```tsx
// Padding
className="p-4"      // Tight
className="p-6"      // Standard
className="p-8"      // Generous

// Gaps
className="gap-4"    // Tight
className="gap-6"    // Standard
className="gap-8"    // Generous
```

---

## 🧩 Common Patterns

### **Modal Pattern**

```tsx
const [modalOpen, setModalOpen] = useState(false);

<button onClick={() => setModalOpen(true)}>
  Open Modal
</button>

<MyModal
  open={modalOpen}
  onOpenChange={setModalOpen}
  data={...}
/>
```

### **Toast Notifications**

```tsx
import { toast } from "sonner";

toast.success("Action completed");
toast.error("Something went wrong");
toast.loading("Processing...");
toast.info("Helpful information");
```

### **Keyboard Shortcuts**

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " " && !e.repeat) {
      e.preventDefault();
      handlePlay();
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === "c") {
      e.preventDefault();
      handleShare();
    }
  };
  
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [dependencies]);
```

---

## 🐛 Common Issues

### **Issue: "Module not found"**

```bash
# Make sure all dependencies are installed
npm install

# If using new packages, install first
npm install package-name
```

### **Issue: "Styles not updating"**

```bash
# Tailwind CSS v4 uses CSS imports
# Make sure /src/styles/theme.css is imported in App.tsx
```

### **Issue: "Component not rendering"**

```tsx
// Check that component is imported in App.tsx
import { MyComponent } from "./components/my-component";

// Check that route is registered in renderView()
case "my-route":
  return <MyComponent />;
```

---

## 📚 Essential Documentation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `V1_FREEZE.md` | Scope freeze, what's locked, what's out of scope | **FIRST - Read before any work** |
| `TECHNICAL_IMPLEMENTATION.md` | How components work, patterns, best practices | When implementing features |
| `COMPONENT_INVENTORY.md` | All components, their status, dependencies | When finding components to use/modify |
| `QUICK_START.md` | This file - get started fast | Right now |

---

## ✅ Daily Workflow

### **Morning:**
1. `git pull` (get latest changes)
2. `npm install` (update dependencies if needed)
3. `npm run dev` (start dev server)

### **During Development:**
1. Make changes to component files
2. Save → Vite hot-reloads automatically
3. Test in browser
4. Check console for errors

### **Before Committing:**
1. Test all affected keyboard shortcuts
2. Check console for warnings/errors
3. Verify no TypeScript errors: `npm run build`
4. Test in production build: `npm run preview`

---

## 🔍 Code Navigation

### **Finding Components**

```bash
# All components are in:
/src/app/components/

# Main router:
/src/app/App.tsx

# Styles:
/src/styles/
```

### **Finding Features**

| Feature | Component |
|---------|-----------|
| Track table | `track-library-dj.tsx` |
| DJ mixer | `auto-dj-mixer-pro-v3.tsx` |
| Queue system | `auto-dj-mix-crate.tsx` |
| Share modal | `share-modal.tsx` |
| Export modal | `export-modal.tsx` |
| Create track | `create-track-modern.tsx` |
| Navigation | `sidebar-nav.tsx` |

---

## 🎓 Learning Path

### **Day 1: Orientation**
- [ ] Read `V1_FREEZE.md` (15 min)
- [ ] Run the app (`npm run dev`)
- [ ] Click through all sidebar items
- [ ] Try keyboard shortcuts in Track Library
- [ ] Open Share and Export modals

### **Day 2: Track Library Deep Dive**
- [ ] Read `TrackLibraryDJ` component code
- [ ] Understand selection logic
- [ ] Try all keyboard shortcuts
- [ ] Test drag & drop
- [ ] Understand context menu

### **Day 3: Auto DJ System**
- [ ] Read `AutoDJMixerProV3` component code
- [ ] Understand waveform generation
- [ ] Observe transition phases
- [ ] Read `AutoDJMixCrate` component code
- [ ] Understand queue management

### **Day 4: Modals & Forms**
- [ ] Read `ShareModal` component code
- [ ] Read `ExportModal` component code
- [ ] Understand the separation
- [ ] Test all export options

### **Day 5: Create & Analysis**
- [ ] Read `CreateTrackModern` component code
- [ ] Understand version A/B/C flow
- [ ] Read `AnalysisScreen` component code

---

## 🚨 Critical Rules

### **❌ NEVER DO:**
1. Modify `/src/styles/theme.css` without explicit approval
2. Use font size/weight Tailwind classes (text-2xl, font-bold, etc.)
3. Mix Share and Export in the same modal
4. Add new features without v2 scope approval
5. Auto-inject tracks in Auto DJ queue
6. Use placeholder/dummy data labeled as "AI"

### **✅ ALWAYS DO:**
1. Use theme defaults for typography
2. Keep Share and Export completely separate
3. Show transparent logic (no hidden AI decisions)
4. Use IBM Plex Mono for data/labels
5. Test keyboard shortcuts after changes
6. Clean up event listeners in useEffect

---

## 💡 Quick Tips

### **Performance:**
- Use `useMemo` for expensive calculations
- Use CSS transforms for animations (GPU-accelerated)
- Clean up intervals and event listeners

### **Accessibility:**
- All actions should have keyboard shortcuts
- Use semantic HTML (`<button>`, `<input>`, etc.)
- Add ARIA labels where needed

### **Code Quality:**
- Keep components under 500 lines (split if larger)
- Use TypeScript types for all props
- Comment complex logic
- Use meaningful variable names

---

## 🎯 Your First Task

**Recommended first task:** Fix a small bug or add a toast notification

**Example:**
```tsx
// In track-library-dj.tsx, find the delete handler
const handleDelete = (trackIds: string[]) => {
  // Add this line:
  toast.success(`Deleted ${trackIds.length} track(s)`);
  
  // Existing logic...
  setTracks((prev) => prev.filter((t) => !trackIds.includes(t.id)));
};
```

**This teaches you:**
- How to find components
- How to add toast notifications
- How component logic works
- How state management works

---

## 📞 Getting Help

**Stuck?**
1. Check `TECHNICAL_IMPLEMENTATION.md` for patterns
2. Look at similar components for examples
3. Check console for error messages
4. Read TypeScript error carefully (usually helpful)

**Need clarification on scope?**
1. Check `V1_FREEZE.md` → OUT OF SCOPE section
2. If not listed, check FROZEN sections

**Need component info?**
1. Check `COMPONENT_INVENTORY.md`
2. Find component status and dependencies

---

## ✅ Success Checklist

**You're ready to ship when:**
- [ ] All keyboard shortcuts work
- [ ] No console errors or warnings
- [ ] Smooth scrolling (60fps) in Track Library
- [ ] Share and Export modals work correctly
- [ ] Auto DJ mixer animates smoothly
- [ ] All drag & drop interactions work
- [ ] Build completes without errors (`npm run build`)
- [ ] Production preview works (`npm run preview`)

---

**Welcome to Syntax Audio Intelligence v1!**

You've got everything you need. Read the freeze doc, explore the code, and ship with confidence. 🚀
