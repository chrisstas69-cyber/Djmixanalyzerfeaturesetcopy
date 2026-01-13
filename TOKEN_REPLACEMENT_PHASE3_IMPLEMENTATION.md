# TOKEN REPLACEMENT PHASE 3 - COMPLETE IMPLEMENTATION GUIDE

## Executive Summary

**Scope**: ~500+ hard-coded color instances across 8 priority files
**Goal**: Replace all with CSS tokens from `design-system.css`
**Constraint**: Token refactor ONLY - no layout/structure changes

## Priority Files & Instance Counts

1. dna-tracks-library.tsx - ~70 instances
2. royalty-revenue-panel.tsx - ~80 instances
3. user-profile-panel.tsx - ~81 instances
4. settings-panel.tsx - ~98 instances
5. dj-mix-analyzer.tsx - ~34 instances
6. circular-knob.tsx - ~27 instances
7. auto-dj-mixer-figma.tsx - ~54 instances
8. button.tsx - ~10 instances (special: Tailwind limitation)

**Total**: ~454 instances across 8 files

## Standard Replacement Patterns

### Background Colors:
- `'#0a0a0a'` → `'var(--panel-2)'`
- `'#111'` → `'var(--panel)'`
- `'#1a1a1a'` → `'var(--surface-2)'`
- `'#18181b'` → `'var(--panel)'`
- `'#000'` → Keep as-is (if for contrast) or `'var(--bg-0)'`

### Text Colors:
- `'#fff'` → `'var(--text)'`
- `'#ffffff'` → `'var(--text)'`
- `'#888'` → `'var(--text-3)'`
- `'#aaa'` → `'var(--text-2)'`
- `'#666'` → `'var(--text-3)'`
- `'#555'` → `'var(--text-3)'`

### Accent Colors:
- `'#00bcd4'` → `'var(--cyan)'`
- `'#00D4FF'` → `'var(--cyan)'`
- `'#12C8FF'` → `'var(--cyan)'`
- `'#ff6b35'` → `'var(--orange)'`
- `'#ff8c00'` → `'var(--orange-2)'`

### Borders:
- `'rgba(255,255,255,0.1)'` → `'var(--border)'`
- `'rgba(255,255,255,0.15)'` → `'var(--border-strong)'`
- `'rgba(255,255,255,0.06)'` → `'var(--border)'`

### Glows/Shadows:
- `'0 0 30px rgba(255,107,53,0.4)'` → `'var(--glow-orange)'`
- `'0 0 20px rgba(0,188,212,0.3)'` → `'var(--glow-cyan)'`

## Special Cases

### button.tsx (Tailwind Limitation)
**Problem**: Tailwind arbitrary values `[rgba(...)]` cannot use CSS vars
**Solution**: Convert gradient/glow colors to inline styles

**Current**:
```tsx
primaryCyan: "bg-gradient-to-b from-[rgba(18,200,255,0.95)] ..."
```

**Target**:
```tsx
// Keep Tailwind for layout, add inline style for colors
style={{ 
  background: 'linear-gradient(to bottom, var(--cyan), var(--cyan-2))',
  boxShadow: 'var(--glow-cyan)'
}}
```

### Charts (Recharts)
- Only replace if using chart props (stroke/fill)
- Avoid modifying CSS selectors for third-party library
- Document as "remaining" if not safely changeable

## Execution Checklist

For each file:
- [ ] Identify all hard-coded colors
- [ ] Replace common patterns systematically
- [ ] Handle context-specific cases
- [ ] Verify no layout changes
- [ ] Document before/after examples
- [ ] Count replacements

## Expected Output

1. List of EVERY file changed
2. For EACH file: before/after examples
3. Total counts (found, replaced, remaining)
4. Remaining values with reasons
5. Next targets list

