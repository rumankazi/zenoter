# Animation System

Zenoter prioritizes smooth, delightful animations that make the app feel responsive and modern.

## Animation Philosophy

> Every interaction should be animated, but animations should never slow down the user.

## Core Principles

1. **Performance First**: All animations run at 60fps
2. **Natural Motion**: Spring physics for organic movement
3. **Accessibility**: Respect `prefers-reduced-motion`
4. **Consistency**: Reusable animation presets

## Animation Stack

```typescript
// Framer Motion for complex animations
import { motion, AnimatePresence } from 'framer-motion';

// Lottie for micro-interactions
import Lottie from 'lottie-react';

// CSS transitions for simple hover states
import { css } from '@emotion/react';
```

## Animation Presets

### Fade In

```typescript
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
};
```

### Slide In

```typescript
export const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 40,
  },
};
```

### Scale & Fade

```typescript
export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};
```

## Component Animations

### File Tree

- **Folder Expand**: Spring animation with stagger
- **Drag & Drop**: Scale and shadow on drag
- **Hover**: Subtle glow effect

### Editor

- **Cursor Blink**: Smooth fade animation
- **Line Highlight**: Gentle fade transition
- **Scroll**: Momentum scrolling

### Modals

- **Open**: Scale from center with backdrop fade
- **Close**: Reverse scale with spring

## Performance Optimization

### GPU Acceleration

```css
.animated-element {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}
```

### Debouncing

```typescript
const debouncedAnimation = useMemo(
  () => debounce(animationFn, 16), // 60fps
  [animationFn]
);
```

### Lazy Loading

```typescript
const AnimatedComponent = lazy(() => import('./AnimatedComponent'));
```

## Accessibility

### Reduced Motion

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animation = prefersReducedMotion ? reducedMotion : fullMotion;
```

### Focus Indicators

```css
.interactive-element:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  animation: pulse 2s infinite;
}
```

## Best Practices

### DO ✅

- Use spring animations for natural motion
- Stagger list animations
- Keep animations under 300ms
- Test on low-end devices
- Provide immediate feedback

### DON'T ❌

- Block user interaction
- Animate too many elements at once
- Use linear easing (looks robotic)
- Ignore performance metrics
- Override system preferences

## Animation Debugging

### Performance Monitor

```typescript
if (process.env.NODE_ENV === 'development') {
  // Show FPS counter
  import('stats.js').then((Stats) => {
    const stats = new Stats.default();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  });
}
```

### Chrome DevTools

1. Open Performance tab
2. Record while interacting
3. Check for dropped frames
4. Optimize problem areas

## Examples

### Animated Button

```typescript
const AnimatedButton = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400 }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);
```

### Page Transition

```typescript
const PageTransition = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
```

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Performance](https://web.dev/animations/)
- [Spring Physics Visualizer](https://www.framer.com/motion/examples/)
