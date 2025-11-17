# Implementation Plan: Incorporate Stack Images into Stacks Profile Page

**Date:** 2025-11-06
**Goal:** Replace gradient placeholders with actual stack images on `/stacks` page, keeping gradients for cards without images

## Context

The `/stacks` profile page currently shows all stack cards with gradient placeholder backgrounds. We have 9 stack images available in `stacks-app/images/` that need to be displayed on their corresponding cards. Any stacks without matching images should keep the gradient background.

**Available Images:**
- `bookstacks.jpg`
- `bookstacks2.jpg`
- `bookstacks3.jpg`
- `bookstacks4.jpg`
- `bookstacks5.jpg`
- `bookstacks6.jpg`
- `bookstacks7_#blues.jpg`
- `bookstacks8_#blues.jpg`
- `bookstacks9_#blues.webp`

**Current State:**
- File: `stacks-app/app/stacks/page.tsx`
- Lines 23-39: StackSection component renders cards with `bg-gradient-accent` placeholder
- Mock data already has `photo` property with paths like `/images/bookstacks.jpg`

## Implementation Tasks

### Task 1: Import Next.js Image Component
**File:** `stacks-app/app/stacks/page.tsx`
**Location:** Top of file (after line 1)

Add the Next.js Image import:
```typescript
import Image from "next/image";
```

**Why:** Next.js Image component optimizes images automatically and provides better performance than `<img>` tags.

**Verification:** Import statement appears at top of file with other imports.

---

### Task 2: Update StackSection Card to Display Images
**File:** `stacks-app/app/stacks/page.tsx`
**Location:** Lines 23-39 (inside StackSection component)

**Current Code:**
```typescript
<div className="relative w-full aspect-square bg-gradient-accent flex items-center justify-center">
  <p className="text-white font-black text-xl">STACK</p>
  {/* Overlay Badges */}
  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
    ...
  </div>
</div>
```

**Replace With:**
```typescript
<div className="relative w-full aspect-square bg-gradient-accent flex items-center justify-center overflow-hidden">
  {/* Conditional Image or Gradient Fallback */}
  {stack.photo ? (
    <Image
      src={stack.photo}
      alt={stack.caption}
      fill
      className="object-cover"
      sizes="256px"
    />
  ) : (
    <p className="text-white font-black text-xl">STACK</p>
  )}
  {/* Overlay Badges */}
  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end z-10">
    <div className="bg-black/80 border-[3px] border-white px-2 py-1 rounded-lg">
      <p className="text-white font-black text-xs uppercase">
        {stack.books.length} Books
      </p>
    </div>
    <div className="bg-black/80 border-[3px] border-white px-2 py-1 rounded-lg">
      <p className="text-white font-black text-xs uppercase">
        {stack.likeCount} ❤️
      </p>
    </div>
  </div>
</div>
```

**Key Changes:**
1. Added `overflow-hidden` to parent div to ensure images don't break border-radius
2. Conditional rendering: `stack.photo ? <Image> : <fallback>`
3. Image component uses `fill` layout with `object-cover` for proper aspect ratio
4. Added `z-10` to overlay badges to ensure they appear above image
5. `sizes="256px"` matches the card width (w-64 = 256px)

**Why:**
- Gracefully handles missing images with gradient fallback
- Image optimization through Next.js
- Maintains existing styling and overlay badges
- Z-index ensures badges remain visible over images

**Verification:**
- Cards with matching images show photos instead of gradients
- Cards without images show gradient + "STACK" text
- Overlay badges (book count, likes) remain visible on all cards
- Images maintain aspect-square ratio without distortion

---

### Task 3: Verify Image Paths Match Mock Data
**File:** `stacks-app/lib/mockData.ts`
**Location:** Lines 187-340 (mockStacks array)

**No code changes needed** - just verify paths are correct:
- Stack 1: `/images/bookstacks.jpg` ✓
- Stack 2: `/images/bookstacks2.jpg` ✓
- Stack 3: `/images/bookstacks7_blues.jpg` ✓
- Stack 4: `/images/bookstacks3.jpg` ✓
- Stack 5: `/images/bookstacks4.jpg` ✓
- Stack 6: `/images/bookstacks8_blues.jpg` ✓
- Stack 7: `/images/bookstacks5.jpg` ✓
- Stack 8: `/images/bookstacks6.jpg` ✓
- Stack 9: `/images/bookstacks9_blues.webp` ✓

**Note:** File name `bookstacks7_#blues.jpg` in directory should be referenced as `bookstacks7_blues.jpg` in code (no `#` in paths).

**Verification:** All 9 stacks have matching image files in `stacks-app/images/`.

---

### Task 4: Test on Development Server
**Location:** Browser at `http://localhost:3002/stacks`

**Test Cases:**
1. Navigate to `/stacks` page
2. Verify all 4 horizontal scroll sections render correctly:
   - Recent Stacks
   - Most Liked
   - This Month
   - Earlier This Year
3. Check that stack cards display images (not gradients)
4. Verify overlay badges (book count, likes) are visible and readable
5. Test horizontal scrolling works smoothly
6. Verify card borders and shadows maintain brutalist design
7. Check dark mode compatibility

**Expected Result:**
- All stack cards show actual book stack photos
- Gradient backgrounds only appear if `stack.photo` is null/undefined
- Images cover the full card area without distortion
- Overlay text remains legible with black/80 backgrounds

---

## Edge Cases & Considerations

### Missing Images
- **Current State:** All 9 stacks have image paths defined
- **Future State:** If new stacks added without images, they gracefully fall back to gradient + "STACK" text
- **No Action Needed:** Conditional rendering handles this automatically

### Image Optimization
- Next.js Image component automatically optimizes:
  - Serves WebP format when browser supports it
  - Lazy loads images outside viewport
  - Responsive sizing based on `sizes` prop
- **No additional configuration needed**

### Dark Mode
- Overlay badges already have `dark:` classes
- Images should work in both light/dark modes
- **Verification:** Test in dark mode to ensure readability

### Performance
- `sizes="256px"` tells Next.js to generate appropriately sized images
- Cards are w-64 (256px), so this prevents serving oversized images
- Horizontal scroll with `width: max-content` maintains smooth performance

---

## Success Criteria

✅ Stack cards display actual photos instead of gradient placeholders
✅ All 9 stacks show their corresponding images
✅ Images maintain aspect-square ratio without distortion
✅ Overlay badges remain visible and readable on top of images
✅ Horizontal scrolling works smoothly
✅ Border-radius and shadows maintain brutalist aesthetic
✅ Dark mode displays correctly
✅ Graceful fallback for stacks without images (gradient + text)
✅ No console errors or warnings
✅ Images load and display on first render

---

## Files to Modify

1. **`stacks-app/app/stacks/page.tsx`**
   - Add Image import
   - Update StackSection card rendering (lines 23-39)

**Total:** 1 file, ~15 lines changed

---

## Rollback Plan

If issues occur, revert to gradient placeholders:

```typescript
// Restore original code (lines 23-39)
<div className="relative w-full aspect-square bg-gradient-accent flex items-center justify-center">
  <p className="text-white font-black text-xl">STACK</p>
  {/* Overlay Badges */}
  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
    ...
  </div>
</div>
```

---

## Notes for Future Implementation

- When adding new stacks, ensure images are placed in `stacks-app/images/`
- Image naming convention: `bookstacks{N}.jpg` or `bookstacks{N}_{hashtag}.jpg`
- Avoid special characters (`#`, `@`, spaces) in filenames
- Preferred format: JPG for photos, WebP for optimized delivery
- Mock data `photo` property should match exact filename in `/images/`

---

## Implementation Estimate

**Time:** 5-10 minutes
**Complexity:** Low
**Risk:** Low (graceful fallback ensures no breaking changes)
