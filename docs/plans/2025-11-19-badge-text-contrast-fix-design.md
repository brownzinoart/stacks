# Badge Text Contrast Fix - Design Document

**Date:** 2025-11-19
**Status:** Approved
**Type:** Bug Fix / Design System Compliance

## Problem Statement

Badge and button elements using `bg-accent-teal` (#53DBC9) and `bg-accent-yellow` (#EAC435) are missing explicit text color declarations, causing poor contrast and readability issues. Most notably, the "reader tags" on the book detail overlay blend into white backgrounds.

### Affected Pages
- Book detail overlay (reader tags)
- Discover/search results pages
- Reading tracker badges
- All inline badge/button implementations bypassing component system

## Root Cause

Four inline badge/button implementations bypass the `Badge.tsx` and `Button.tsx` components, which already have correct text colors. These inline implementations use only background colors without specifying text colors, defaulting to inherited text color (often black on light backgrounds, creating insufficient contrast).

## Design System Specification

According to `design_system/v2.0_refined_design_system.html`:

```css
.badge-secondary { background: var(--accent-yellow); color: var(--text-primary); }
.badge-success { background: var(--accent-teal); color: var(--text-primary); }
```

### Color Mapping
- **Light backgrounds (teal/yellow):** Use dark text (`text-light-text` = #383838)
- **Dark backgrounds (cyan/coral/purple):** Use white text (`text-white`)
- **Dark mode:** All text becomes white (`dark:text-dark-text` = #ffffff)

## Solution

Add explicit text color classes to 4 inline implementations to match the design system and existing component patterns.

### Changes Required

#### File: `app/discover/book/[id]/page.tsx`

**1. NYT Bestseller badge (line 134)**
```diff
- className="flex items-center gap-2 px-5 py-2.5 bg-accent-yellow border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge"
+ className="flex items-center gap-2 px-5 py-2.5 bg-accent-yellow text-light-text dark:text-dark-text border-[3px] border-light-border dark:border-dark-border rounded-xl font-black text-sm shadow-brutal-badge"
```

**2. Reader tags (line 154) - PRIMARY ISSUE**
```diff
- className="px-3.5 py-1.5 bg-accent-teal border-2 border-light-border dark:border-dark-border rounded-lg text-xs font-bold shadow-brutal-badge"
+ className="px-3.5 py-1.5 bg-accent-teal text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-lg text-xs font-bold shadow-brutal-badge"
```

**3. Bookshop.org button (line 244)**
```diff
- className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-teal border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
+ className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-teal text-light-text dark:text-dark-text border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-base shadow-brutal-sm hover:shadow-brutal transition-all"
```

#### File: `app/discover/results/page.tsx`

**4. Randomize button (line 165)**
```diff
- className="px-4 py-3 bg-accent-yellow border-[5px] border-light-border dark:border-dark-border rounded-xl font-black text-xl shadow-brutal-sm hover:shadow-brutal transition-all"
+ className="px-4 py-3 bg-accent-yellow text-light-text dark:text-dark-text border-[5px] border-light-border dark:border-dark-border rounded-xl font-black text-xl shadow-brutal-sm hover:shadow-brutal transition-all"
```

## Design System Compliance

✅ Uses colors defined in `tailwind.config.ts`:
- `text-light-text` (#383838)
- `text-dark-text` (#ffffff)

✅ Matches component implementations:
- `Badge.tsx` lines 24, 26
- `Button.tsx` lines 28, 30

✅ Follows design system spec:
- `v2.0_refined_design_system.html` lines 440, 442

✅ WCAG AA compliance:
- Teal (#53DBC9) + dark text (#383838) = 4.5:1+ contrast
- Yellow (#EAC435) + dark text (#383838) = 4.5:1+ contrast

## Testing Checklist

- [ ] Reader tags visible on book detail overlay (light mode)
- [ ] Reader tags visible on book detail overlay (dark mode)
- [ ] NYT Bestseller badge readable (light + dark mode)
- [ ] Bookshop button text readable (light + dark mode)
- [ ] Randomize button text readable (light + dark mode)
- [ ] No visual regressions on other pages
- [ ] Test on iPhone 12 Pro viewport (390px)

## Future Recommendations

1. **Component Usage:** Consider refactoring inline badges to use the `Badge` component for consistency
2. **Linting Rule:** Add ESLint rule to flag `bg-accent-teal` or `bg-accent-yellow` without corresponding text color classes
3. **Design System Documentation:** Add color pairing guidelines to prevent future contrast issues

## Files Modified

- `app/discover/book/[id]/page.tsx` (3 changes)
- `app/discover/results/page.tsx` (1 change)

## Implementation Estimate

- **Complexity:** Low (4 className additions)
- **Risk:** Minimal (design system compliant)
- **Testing:** 10 minutes (visual verification)
