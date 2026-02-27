# COMPONENT ROUTING DISCOVERY

## Screen Name | Route/Path | Component File Used

Based on analysis of `src/app/App.tsx` and `src/app/components/sidebar-nav.tsx`:

| Screen Name | Route/Path | Component File Used |
|------------|------------|---------------------|
| Auto DJ Mixer | `auto-dj-mixer-pro-v3` | `auto-dj-mixer-figma.tsx` |
| My Mixes | `mixes` | `mixes-panel.tsx` |
| Generated Tracks | `library-full` | `track-library-dj.tsx` |
| DNA Tracks | `dna-track-library` | `dna-tracks-library.tsx` |
| Settings | `settings` | `settings-panel.tsx` |

## Notes

- Sidebar navigation items are defined in `sidebar-nav.tsx` (mainNavigation array)
- Routes are handled in `App.tsx` renderView function
- Component imports are at the top of `App.tsx`
