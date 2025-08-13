# STACKS Design System

**Version 1.0** | Ultra Bold Gen Z Library Experience

---

## 🎯 Design Philosophy & Brand Identity

### Vision

Stacks transforms the traditional library experience into an electrifying, ultra-bold digital adventure that speaks Gen Z's language. Every interaction should feel like discovering a hidden treasure, with vibrant colors, dramatic shadows, and playful animations that make book discovery irresistibly fun.

### Design Principles

1. **ULTRA BOLD MAXIMALISM**: Nothing subtle here—we use saturated colors, dramatic typography, and high-contrast elements that demand attention
2. **TACTILE DIGITAL EXPERIENCE**: Every element should feel touchable with bold outlines, dramatic shadows, and satisfying feedback
3. **JOYFUL DISCOVERY**: Reading should feel like an adventure—use playful animations and surprise moments
4. **MOBILE-FIRST ACCESSIBILITY**: Optimized for thumbs with generous touch targets and iOS safe area support
5. **PERFORMANCE THROUGH BOLDNESS**: Use hardware-accelerated transforms and efficient animations

### Tone of Voice

- **Energetic & Encouraging**: "WHAT'S NEXT?", "READY TO read!", "AVERAGE BEATEN!"
- **Direct & Action-Oriented**: Clear calls-to-action with powerful verbs
- **Inclusive & Supportive**: Making everyone feel welcome in their reading journey
- **Playfully Educational**: Learning through discovery, not intimidation

---

## 🎨 Visual Identity

### Logo & Typography System

- **Primary Wordmark**: "STACKS" in black, 900 weight, super-tight letter spacing (-0.03em)
- **Usage**: Always in uppercase, never modified, minimum size 24px mobile/32px desktop
- **Font Stack**: Inter (system fallback: -apple-system, BlinkMacSystemFont)

### Typography Hierarchy

#### Display Typography

```css
/* Ultra-large headlines */
.text-mega {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 0.85;
}

/* Large headlines */
.text-huge {
  font-size: clamp(1.5rem, 6vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 0.9;
}

/* Bold headlines */
.text-xl-bold {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
```

#### Content Typography

- **H1**: 900 weight, -0.025em tracking, 0.9 line-height
- **H2**: 800 weight, -0.02em tracking, 0.95 line-height
- **H3**: 700 weight, -0.01em tracking, normal line-height
- **Body**: 400/600 weight, normal tracking, 1.5 line-height
- **UI Text**: 700/800 weight for buttons and labels

---

## 🌈 Color System

### Primary Brand Colors

```css
/* Ultra vibrant Gen Z palette */
--primary-green: #4ade80; /* Success, completion */
--primary-yellow: #fbbf24; /* Attention, highlights */
--primary-orange: #fb7185; /* Energy, action */
--primary-purple: #a78bfa; /* Creative, mystery */
--primary-teal: #14b8a6; /* Fresh, discovery */
--primary-pink: #ec4899; /* Fun, community */
--primary-blue: #3b82f6; /* Trust, navigation */
```

### Background Colors

```css
--bg-light: #f8fafc; /* App background */
--bg-dark: #0f172a; /* Dark mode (future) */
```

### Text Colors

```css
--text-primary: #0f172a; /* Primary text */
--text-secondary: #475569; /* Secondary text */
--text-white: #ffffff; /* White text */
```

### Color Usage Guidelines

- **Green**: Reading progress, success states, "ready" indicators
- **Yellow**: Navigation active states, important metrics
- **Orange**: Action buttons, urgency, streak counters
- **Purple**: Reading plans, personal content
- **Teal**: Discovery features, refreshing content
- **Pink**: Community features, love/favorites
- **Blue**: Links, external actions, trust elements

---

## 📐 Spacing & Layout System

### Spacing Scale

```css
/* Base spacing unit: 4px */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px - card padding */
--space-12: 3rem; /* 48px */
```

### Border Radius

```css
--radius-card: 24px; /* Standard cards */
--radius-xl-card: 32px; /* Large feature cards */
--radius-pill: 999px; /* Pills and buttons */
```

### Container Patterns

- **Mobile margins**: 16px (1rem) sides
- **Desktop margins**: 32px (2rem) sides
- **Max content width**: 1280px (7xl)
- **Card padding**: 32px standard, 48px for large cards

---

## 🎪 The "Pop" Effect System

Our signature ultra-bold visual language built on dramatic outlines and shadows:

### Pop Element Classes

```css
/* Standard pop effect */
.pop-element {
  border: 3px solid #000000;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.8);
  transform: translateZ(0);
  will-change: transform;
}

/* Large pop effect */
.pop-element-lg {
  border: 3px solid #000000;
  box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.8);
}

/* Extra large pop effect */
.pop-element-xl {
  border: 3px solid #000000;
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.8);
}
```

### Shadow System

```css
/* Backdrop shadows for buttons */
.shadow-backdrop: 4px 4px 0px rgba(0, 0, 0, 0.8);
.shadow-backdrop-lg: 6px 6px 0px rgba(0, 0, 0, 0.8);
.shadow-backdrop-xl: 8px 8px 0px rgba(0, 0, 0, 0.8);

/* Card shadows for depth */
.shadow-card:
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 10px 10px -5px rgba(0, 0, 0, 0.04);
.shadow-mega: 0 32px 64px -12px rgba(0, 0, 0, 0.25);
```

---

## 🧩 Component Library

### Atomic Design Structure

```
atoms/
  - Button variants
  - Text elements
  - Input fields
  - Icons
  - Loading states

molecules/
  - BookCover
  - NavigationItem
  - SearchInput
  - ProgressBar

organisms/
  - AIPromptInput
  - MyQueue
  - ReadingStreak
  - MobileHeader
  - BottomNavigation

templates/
  - MobileLayout
  - FullTakeoverLoader
```

### Button System

#### Primary Actions

```tsx
<button className="pop-element touch-feedback mobile-touch rounded-full bg-text-primary px-6 py-4 text-base font-black text-white transition-all duration-300 hover:scale-110">
  ACTION TEXT
</button>
```

#### Mood Buttons (Special Pattern)

```tsx
<button
  className="pop-element touch-feedback mobile-touch rounded-3xl px-4 py-4 text-base font-black transition-all duration-300 hover:rotate-1 hover:scale-110"
  style={{ backgroundColor: moodColor }}
>
  <span className="mr-2">{emoji}</span>
  MOOD LABEL
</button>
```

#### Quick Action Pills

```tsx
<button className="touch-feedback flex-1 rounded-full bg-white/80 px-3 py-2 text-sm font-bold text-text-primary transition-transform hover:scale-105">
  +5 PAGES
</button>
```

### Input System

```tsx
<input className="outline-bold-thin shadow-backdrop mobile-touch w-full rounded-full bg-white px-6 py-4 text-base font-bold focus:outline-none focus:ring-4 focus:ring-white/50" />
```

### Card System

#### Feature Cards (Large)

```tsx
<div className="pop-element-lg relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_10px_40px_rgb(0,0,0,0.3)] sm:p-12">
  {/* Card content */}
</div>
```

#### Content Cards (Standard)

```tsx
<div className="outline-bold-thin rounded-2xl bg-white/20 p-6 backdrop-blur-sm sm:p-8">{/* Card content */}</div>
```

---

## 🎭 Animation & Interaction

### Micro-animations

#### Entrance Animations

```css
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.animation-delay-200 {
  animation-delay: 0.2s;
}
.animation-delay-400 {
  animation-delay: 0.4s;
}
/* etc. */
```

#### Floating Decorations

```css
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 3s ease-in-out infinite 1s;
}
```

### Touch Feedback

```css
.touch-feedback {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateZ(0);
  will-change: transform;
}

.touch-feedback:active {
  transform: translateZ(0) scale(0.95);
}
```

### Hover States

- **Buttons**: Scale to 110%, slight rotation possible
- **Cards**: Scale to 102%, enhanced shadows
- **Interactive elements**: Immediate visual feedback

---

## 📱 Mobile-First Guidelines

### Safe Area Support

```css
/* iOS safe area utilities */
.pt-safe {
  padding-top: env(safe-area-inset-top);
}
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
.pl-safe {
  padding-left: env(safe-area-inset-left);
}
.pr-safe {
  padding-right: env(safe-area-inset-right);
}
```

### Touch Targets

```css
.mobile-touch {
  min-height: 44px;
  min-width: 44px;
}
```

### Mobile Header Pattern

- Height: Dynamic based on safe-area-inset-top
- Background: Sticky with blur and shadow
- Content: Logo + avatar, properly spaced

### Bottom Navigation Pattern

- Fixed bottom position with safe area padding
- 4 icons maximum for thumb reach
- Active state with background color and bold text

---

## 🎨 Decorative Elements

### Floating Bubbles Pattern

Every major card includes animated floating circles:

```tsx
<div className="animate-float absolute left-6 top-6 z-0
  h-16 w-16 rounded-full bg-primary-yellow opacity-30" />
<div className="animate-float-delayed absolute right-12 top-2 z-0
  h-12 w-12 rounded-full bg-primary-purple opacity-25" />
{/* 3-6 bubbles total per card */}
```

### Background Characters

Hero sections can include background imagery:

- Opacity: 0.65
- Filter: drop-shadow + brightness + contrast adjustments
- Mix-blend-mode: multiply
- Position: Bottom-right typically

---

## 📚 Component Specifications

### BookCover Component

**Props**: `title`, `author`, `isbn?`, `coverUrl?`, `className?`, `showSource?`
**Fallback Strategy**: API → AI Description → Gradient → Emergency
**Sizes**:

- Small: `w-16 h-20` (64x80px)
- Medium: `w-20 h-28` (80x112px)
- Large: `w-24 h-32` (96x128px)

### AIPromptInput Component

**Features**: Rotating placeholder examples, mood selection, error states
**Loading**: Full-screen takeover with multi-stage progress
**Validation**: Required input with shake animation on error

### FullTakeoverLoader Component

**Stages**: 4-stage process with individual progress bars
**Features**: Cancel button, cost savings display, accessibility support
**Portal**: Renders at document.body level for true fullscreen

### MobileHeader Component

**Layout**: Logo left, avatar right
**Safe Area**: Dynamic top padding for all iPhone models
**Styling**: Sticky with shadow and blur effects

### BottomNavigation Component

**Items**: 4 core navigation items
**States**: Active (background + bold) vs inactive (gray)
**Icons**: Lucide React icons, 24px size

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

- **Color Contrast**: All text meets 4.5:1 minimum ratio
- **Touch Targets**: 44px minimum on mobile
- **Focus States**: Visible ring indicators on all interactive elements
- **Screen Readers**: Proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard support

### Focus Management

```css
.focus\:outline-none:focus {
  outline: 2px solid transparent;
}
.focus\:ring-4:focus {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
}
```

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- Button vs link usage (actions vs navigation)
- Form labels and fieldsets
- Landmark regions (main, nav, section)

---

## 🚀 Performance Guidelines

### Animation Performance

- Use `transform` and `opacity` for animations
- `will-change: transform` for frequently animated elements
- Hardware acceleration with `translateZ(0)`
- Remove `will-change` when animations complete

### Image Optimization

- BookCover component with progressive loading
- Proper `sizes` attribute for responsive images
- WebP format with fallbacks
- Lazy loading for off-screen content

### CSS Architecture

- Utility-first with Tailwind CSS
- Custom components in `@layer components`
- Critical CSS inlined
- Non-critical CSS loaded asynchronously

---

## 📐 Grid & Layout Patterns

### Homepage Layout

```tsx
<div className="mx-auto max-w-7xl space-y-8 sm:space-y-12">
  {/* Hero section - full width */}
  {/* Features - single column mobile, responsive desktop */}
  {/* Bottom grid - 2 columns on large screens */}
</div>
```

### Card Grid Patterns

- Mobile: Single column, full width
- Tablet: 2 columns with gap-8
- Desktop: 2-3 columns with gap-12

---

## 🎯 Implementation Guidelines

### Getting Started (Developers)

1. **Setup**: All design tokens are in `tailwind.config.js`
2. **Components**: Follow atomic design in `src/components/` and `src/features/`
3. **Styling**: Use utility classes, create components for repeating patterns
4. **Animations**: Include `animate-fade-in-up` on all page sections

### Getting Started (Designers)

1. **Colors**: Use the exact hex values provided - they're optimized for accessibility
2. **Typography**: Inter font family, follow the weight/spacing combinations
3. **Layout**: 16px mobile margins, 32px desktop margins, 8px base spacing unit
4. **Components**: Reference the component library before designing new patterns

### Code Quality Standards

- **TypeScript**: All components must be typed
- **Props**: Always include `className?` prop for styling flexibility
- **Accessibility**: Test with screen readers and keyboard navigation
- **Performance**: Use React.memo for expensive components

---

## 🔄 Contributing to the Design System

### Adding New Components

1. **Location**: Place in appropriate atomic design folder
2. **Props**: Include `className?` and proper TypeScript interfaces
3. **Styling**: Use existing design tokens, follow pop-element patterns
4. **Documentation**: Update this file with component specifications

### Design Token Updates

1. **Tailwind Config**: Update `tailwind.config.js`
2. **CSS Variables**: Add to `globals.css` if needed
3. **Documentation**: Update color/spacing sections
4. **Testing**: Verify across all existing components

### Testing Guidelines

- **Visual**: Test on iOS Safari, Chrome mobile, desktop Chrome
- **Accessibility**: Use axe-core browser extension
- **Performance**: Lighthouse scores >90 for all metrics
- **Interaction**: Test all touch states and hover effects

---

## 🎨 Brand Asset Guidelines

### Logo Usage

- **Minimum size**: 24px mobile, 32px desktop
- **Clear space**: Equal to the x-height of "STACKS" on all sides
- **Don't**: Modify spacing, change colors, add effects, rotate

### Iconography

- **Source**: Lucide React icon library
- **Size**: 24px standard, 20px for compact UI
- **Weight**: 2px stroke, 2.5px for active states
- **Color**: Inherit from parent text color

### Photography Style (Future)

- **Mood**: Vibrant, energetic, diverse
- **Treatment**: High contrast, saturated colors
- **Composition**: Dynamic angles, close-ups, lifestyle

---

## 🔧 Development Utilities

### Debugging Tools

```tsx
{
  /* Show design system version */
}
<div className="fixed left-0 top-0 z-[10000] bg-red-600 px-3 py-1 text-xs font-bold text-white">
  v2.0 DEBUG | Components: Active
</div>;
```

### CSS Custom Properties

```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-right: env(safe-area-inset-right);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --safe-area-inset-left: env(safe-area-inset-left);
}
```

### Responsive Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Small tablets and large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

---

## 📋 Component Checklist

When creating new components, ensure they include:

- [ ] TypeScript interface with proper prop types
- [ ] `className?` prop for styling flexibility
- [ ] Mobile-first responsive design
- [ ] Proper touch targets (44px minimum)
- [ ] Accessibility attributes (ARIA labels, roles)
- [ ] Focus states with visible indicators
- [ ] Loading and error states where applicable
- [ ] Pop-element styling where appropriate
- [ ] Touch feedback animations
- [ ] Proper semantic HTML structure

---

**Last Updated**: January 2025  
**Next Review**: March 2025  
**Maintained by**: Design System Team

_"Every pixel should spark joy, every interaction should feel like magic, and every book should feel like a treasure waiting to be discovered."_
