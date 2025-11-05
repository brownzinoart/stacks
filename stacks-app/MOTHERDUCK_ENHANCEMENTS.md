# MotherDuck Design Enhancements

## Implemented Patterns

### Button Micro-interactions
- 7px diagonal hover offset (translate-x-[7px] -translate-y-[7px])
- 120ms transition timing
- Shadow expansion on hover (-5px → -12px)
- Active state color shift

### Card Behaviors
- 1.02 scale on hover
- Shadow expansion (card-brutal utility)
- Smooth 200ms transitions

### Typography System
- Responsive scale: 30px mobile → 80px desktop
- MotherDuck letter-spacing (-0.02em headings, 0.02em body)
- Font weights: 900 (headings), 500 (body)

### Spacing
- 56-160px vertical rhythm scale
- Generous section gaps (py-14 md:py-20 lg:py-28)
- Consistent 24-32px internal padding

### Animations
- Scroll-triggered fade-up effects
- Link underline expansion
- Button hover offset

## Usage Examples

### Buttons
```tsx
<button className="btn-motherduck-primary">Primary CTA</button>
<button className="btn-motherduck-secondary">Secondary</button>
```

### Cards
```tsx
<div className="card-brutal p-6">
  {/* Includes hover scale + shadow */}
</div>
```

### Responsive Typography
```tsx
<h1 className="text-h1-mobile md:text-h1-tablet lg:text-h1-desktop">
  Heading
</h1>
```

### Scroll Animations
```tsx
const ref = useScrollAnimation("up");
<div ref={ref}>Animates on scroll</div>
```
