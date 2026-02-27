# COMPONENT ROUTING DISCOVERY

## Screen Name | Route/Path | Component File Used

Based on analysis of `src/app/App.tsx` renderView function and `src/app/components/sidebar-nav.tsx`:

| Screen Name | Route/Path | Component File Used |
|------------|------------|---------------------|
| Auto DJ Mixer | `auto-dj-mixer-pro-v3` | `src/app/components/auto-dj-mixer-figma.tsx` |
| My Mixes | `mixes` | `src/app/components/mixes-panel.tsx` |
| Generated Tracks | `library-full` | `src/app/components/track-library-dj.tsx` |
| DNA Tracks | `dna-track-library` | `src/app/components/dna-tracks-library.tsx` |
| Settings | `settings` | `src/app/components/settings-panel.tsx` |

## Source of Truth

### Sidebar Navigation
**File**: `src/app/components/sidebar-nav.tsx`
- Navigation items defined in `mainNavigation` array (lines ~31-42)
- Each item has an `id` property that corresponds to the route used in App.tsx

### Routing Logic
**File**: `src/app/App.tsx`
- `renderView` function contains switch/case statements (starting around line ~195)
- Routes are matched to component imports
- Component imports are at the top of the file (lines ~1-74)

### Route to Component Mapping (exact lines from renderView)

1. **Auto DJ Mixer**: 
   - Route: `"auto-dj-mixer-pro-v3"`
   - Component: `<AutoDJMixerFigma />`
   - Import: `import AutoDJMixerFigma from "./components/auto-dj-mixer-figma";`

2. **My Mixes**: 
   - Route: `"mixes"`
   - Component: `<MixesPanel />`
   - Import: `import { MixesPanel } from "./components/mixes-panel";`

3. **Generated Tracks**: 
   - Route: `"library-full"`
   - Component: `<TrackLibraryDJ />`
   - Import: `import { TrackLibraryDJ } from "./components/track-library-dj";`

4. **DNA Tracks**: 
   - Route: `"dna-track-library"`
   - Component: `<DNATracks />`
   - Import: `import DNATracks from "./components/dna-tracks-library";`

5. **Settings**: 
   - Route: `"settings"`
   - Component: `<SettingsPanel />`
   - Import: `import { SettingsPanel } from "./components/settings-panel";`

## Notes

- The sidebar navigation uses these route IDs to navigate
- All routes are handled client-side via state management in App.tsx
- Component files use different export styles (default vs named exports)
