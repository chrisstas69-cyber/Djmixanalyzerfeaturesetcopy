# TOKEN REPLACEMENT PHASE 3 - IMPLEMENTATION PLAN

## Priority Files (in order):
1. dna-tracks-library.tsx (~70 instances)
2. royalty-revenue-panel.tsx (~80 instances)
3. user-profile-panel.tsx (~81 instances)
4. settings-panel.tsx (~98 instances)
5. dj-mix-analyzer.tsx (~34 instances)
6. circular-knob.tsx (~27 instances)
7. auto-dj-mixer-figma.tsx (~54 instances) - ONLY if used
8. button.tsx - Special fix (Tailwind limitation)

## Common Patterns to Replace:

### Background Colors:
- `#0a0a0a` → `var(--panel-2)`
- `#111` → `var(--panel)`
- `#1a1a1a` → `var(--surface-2)` or `var(--panel-2)`
- `#18181b` → `var(--panel)`
- `#000` → Keep as-is (if for contrast) or `var(--bg-0)`

### Text Colors:
- `#fff` → `var(--text)`
- `#ffffff` → `var(--text)`
- `#888` → `var(--text-3)`
- `#aaa` → `var(--text-2)`
- `#666` → `var(--text-3)`
- `#555` → `var(--text-3)`

### Accent Colors:
- `#ff6b35` → `var(--orange)`
- `#ff8c00` → `var(--orange-2)`
- `#00bcd4` → `var(--cyan)`
- `#00D4FF` → `var(--cyan)`

### Borders:
- `rgba(255,255,255,0.1)` → `var(--border)`
- `rgba(255,255,255,0.15)` → `var(--border-strong)`
- `rgba(255,255,255,0.06)` → `var(--border)`

### Glows:
- `0 0 30px rgba(255,107,53,0.4)` → `var(--glow-orange)`
- `0 0 20px rgba(0,188,212,0.3)` → `var(--glow-cyan)`

## Special Cases:

### button.tsx:
- Convert Tailwind rgba classes to inline styles
- Keep variant API unchanged
- Apply gradients/glows via style prop

### Charts (Recharts):
- Only replace if safe (use chart props, not CSS selectors)

