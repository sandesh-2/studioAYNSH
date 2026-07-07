# Animation System - Studio AYNSH

## Overview

Premium 3D/4D animation system tailored for luxury photography brand aesthetic. All animations are sophisticated, balanced, and purposeful—designed to enhance the user experience without overwhelming it.

## Design Philosophy

- **Elegant**: Smooth transitions with easing curves that feel natural
- **Purposeful**: Every animation serves a functional or aesthetic purpose
- **Performant**: GPU-accelerated transforms for 60fps rendering
- **Accessible**: Respects `prefers-reduced-motion` user preferences
- **On-brand**: Matches Studio AYNSH's premium photography identity

## Animation Library

Location: `/lib/animations.ts`

### Categories

1. **Entrance Animations**
   - fadeInUp, fadeInDown, fadeInLeft, fadeInRight
   - Blur-in effects for premium feel
   - 3D perspective entrances

2. **Hover Animations**
   - Scale, lift, and slide effects
   - Button press feedback
   - Image zoom on hover

3. **3D Transforms**
   - Perspective rotations (rotateX, rotateY)
   - Sophisticated depth effects
   - Card flips and reveals

4. **Stagger Animations**
   - Sequential item reveals
   - Delayed children for grouped content
   - Word-by-word text reveals

5. **Specialty Effects**
   - Circular reveals
   - Diagonal slides
   - Float animations
   - Shimmer effects

## Implementation Examples

### Hero Section
```tsx
<motion.h1
  initial={{ opacity: 0, y: 40, rotateX: 20, perspective: 1000 }}
  animate={{ opacity: 1, y: 0, rotateX: 0 }}
  transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
>
  We Capture The Untold Story
</motion.h1>
```

**Effect**: 3D perspective entrance with rotation
**Duration**: 0.9s
**Easing**: Custom bezier for smooth deceleration
**Purpose**: Creates depth and premium entrance feel

### Portfolio Images
```tsx
<motion.div
  initial={{ opacity: 0, y: 50, rotateY: -15, perspective: 1000 }}
  animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
  whileHover={{ y: -8, rotateY: 5 }}
  transition={{ duration: 0.8, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
>
```

**Effect**: 3D rotation entrance with hover lift
**Stagger**: 0.12s per image
**Purpose**: Creates gallery flow and interactive depth

### CTA Buttons
```tsx
<motion.div
  whileHover={{ y: -6, scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.2 }}
>
  <Link href="/booking">Book Your Session</Link>
</motion.div>
```

**Effect**: Lift on hover, press on tap
**Duration**: 0.2s for instant feedback
**Purpose**: Premium interactive feel

### Service Items
```tsx
<motion.div
  initial={{ opacity: 0, y: 30, rotateZ: -1 }}
  animate={inView ? { opacity: 1, y: 0, rotateZ: 0 } : {}}
  whileHover={{ x: 8 }}
  transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
>
```

**Effect**: Subtle rotation entrance, horizontal slide on hover
**Stagger**: 0.08s per item
**Purpose**: Draws attention to each service smoothly

### Blur-In Effect
```tsx
initial={{ opacity: 0, filter: 'blur(8px)' }}
animate={{ opacity: 1, filter: 'blur(0px)' }}
transition={{ duration: 0.7, delay: 0.1 }}
```

**Effect**: Premium photography-style focus reveal
**Purpose**: Mimics camera focus for brand alignment

## Performance Optimization

### GPU Acceleration
```tsx
// Use transform properties (accelerated)
{ y: -8, scale: 1.03, rotateY: 5 }

// Avoid (not accelerated)
{ marginTop: -8, width: '103%' }
```

### Will-Change Hint
```tsx
<motion.div
  style={{ y: imageY }}
  className="will-change-transform"
>
```

### Perspective Setup
```tsx
// For 3D transforms, always set perspective
initial={{ rotateX: 20, perspective: 1000 }}
```

## Timing & Easing

### Duration Guidelines
- **Micro interactions**: 0.2-0.3s (buttons, hovers)
- **Entrance animations**: 0.6-0.9s (text, images)
- **Page transitions**: 0.8-1.2s (major content shifts)
- **Ambient effects**: 2-4s (floats, pulses)

### Easing Curves
```ts
// Smooth deceleration (most common)
ease: [0.25, 0.46, 0.45, 0.94]

// Snappy with bounce
ease: [0.34, 1.56, 0.64, 1]

// Elegant slow-start
ease: [0.4, 0, 0.2, 1]
```

## Scroll-Triggered Animations

### Setup
```tsx
const ref = useRef<HTMLElement>(null)
const inView = useInView(ref, { once: true, margin: '-80px' })

<section ref={ref}>
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
  >
```

**Margin**: `-80px` triggers 80px before entering viewport
**Once**: `true` prevents re-triggering on scroll back

## Component-Specific Patterns

### Hero Section
- Parallax background image (subtle)
- 3D perspective headline entrance
- Staggered CTA buttons with blur-in
- Lift animations on hover

### Portfolio Showcase
- 3D rotation entrance per image
- Staggered reveal (0.12s between items)
- Scale and rotation on hover
- Category label slide-up on hover

### Services Preview
- 3D perspective header entrance
- Blur-in effect for eyebrow text
- Horizontal slide on service item hover
- Staggered list reveal (0.08s per item)

### CTA Section
- 3D headline entrance with rotateX
- Blur-in effect for subheading
- Button lift and scale on hover
- Animated statistics counters

## Accessibility

### Reduced Motion Support
All animations automatically disabled for users with `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semantic HTML
Animations never interfere with screen readers or keyboard navigation.

## Best Practices

### Do's
✅ Use GPU-accelerated properties (transform, opacity)
✅ Set perspective for 3D transforms
✅ Stagger group animations (0.08-0.12s)
✅ Add blur-in for premium photography feel
✅ Lift buttons on hover for tactile feedback
✅ Keep durations under 1s for entrances
✅ Use scroll-triggered animations sparingly

### Don'ts
❌ Animate layout properties (width, height, margin)
❌ Overuse 3D rotations (causes dizziness)
❌ Chain too many effects simultaneously
❌ Ignore reduced-motion preferences
❌ Animate during scroll events (use IntersectionObserver)
❌ Use easeInOut for everything (varies by context)

## Animation Checklist

Before deploying a new animation:

- [ ] Does it serve a purpose (feedback, hierarchy, delight)?
- [ ] Is the duration appropriate (0.2-0.9s for most cases)?
- [ ] Does it use GPU-accelerated properties?
- [ ] Is perspective set for 3D transforms?
- [ ] Does it respect reduced-motion preferences?
- [ ] Is it consistent with existing animations?
- [ ] Does it maintain 60fps on mid-range devices?
- [ ] Is the easing curve appropriate for the motion?

## Files Modified

### Components Enhanced
- `/components/home/hero-section.tsx` - 3D perspective headline, blur-in effects, button lifts
- `/components/home/showcase-section.tsx` - 3D portfolio image reveals, hover rotations
- `/components/home/services-preview.tsx` - 3D header entrance, staggered service items
- `/components/home/cta-section.tsx` - 3D headline entrance, animated buttons and stats

### Utilities Created
- `/lib/animations.ts` - Complete animation variant library

## Performance Metrics

**Target Performance:**
- 60fps during animations
- No layout shift (CLS < 0.1)
- GPU utilization < 30%
- Animation completion < 1s

**Tested on:**
- Chrome/Edge (Chromium)
- Safari (WebKit)
- Firefox (Gecko)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Future Enhancements

Potential additions (not yet implemented):

1. **Magnetic Cursor** - Interactive cursor following elements
2. **Page Transitions** - View transition API integration
3. **SVG Path Animations** - Animated line drawings
4. **Text Scramble** - Cyberpunk-style text reveals
5. **Particle Effects** - Subtle ambient particles

Only add if they serve the luxury photography brand aesthetic.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready  
