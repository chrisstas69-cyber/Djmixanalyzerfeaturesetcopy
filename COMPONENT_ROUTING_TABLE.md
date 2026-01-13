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
File: `src/app/components/sidebar-nav.tsx`
- Navigation items defined in `mainNavigation` array (lines ~31-42)
- Each item has an `id` that corresponds to the route

### Routing Logic
File: `src/app/App.tsx`
- `renderView` function (starting around line ~195)
- Uses switch/case statements to render components based on route
- Component imports at top of file (lines ~1-74)

### Component Imports (from App.tsx)
- `AutoDJMixerFigma` from `./components/auto-dj-mixer-figma`
- `MixesPanel` from `./components/mixes-panel`
- `TrackLibraryDJ` from `./components/track-library-dj`
- `DNATracks` from `./components/dna-tracks-library`
- `SettingsPanel` from `./components/settings-panel`

## Route to Component Mapping (from renderView)

1. **Auto DJ Mixer**: `case "auto-dj-mixer-pro-v3"` → `<AutoDJMixerFigma />`
2. **My Mixes**: `case "mixes"` → `<MixesPanel />`
3. **Generated Tracks**: `case "library-full"` → `<TrackLibraryDJ />`
4. **DNA Tracks**: `case "dna-track-library"` → `<DNATracks />`
5. **Settings**: `case "settings"` → `<SettingsPanel />`
