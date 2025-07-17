# Styling Rules & Guidelines

## Core Styling Principles

### No Inline Styles
- **Never use inline styles** - Always use CSS classes or Tailwind utilities
- **Use Tailwind utilities** instead of `style="color: red;"` → use `text-red-500`
- **Dynamic styles**: Use CSS custom properties and utility classes, not inline styles
- **Conditional styling**: Use Vue's class binding with utility classes

### Utility-First Approach (Tailwind CSS)
- **Primary method**: Use Tailwind utility classes for 95% of styling
- **Component classes**: Only create custom CSS for complex patterns not covered by Tailwind
- **File size limit**: Keep custom CSS files under 100 lines
- **Performance**: Utility-first approach optimizes bundle size with JIT compilation

### Vue Component Styling
- **Component size**: Keep Vue files under 300 lines total (template + script + style)
- **Style location**: Prefer utility classes in template over `<style>` blocks
- **Scoped styles**: Use `<style scoped>` only for complex animations
- **Extract large styles**: Move repeated utility patterns to composables or parent components

## CSS Organization Rules

### File Structure
```
src/
  styles/
    globals.css          # Global styles, CSS custom properties
  components/
    Component.vue        # Minimal <style> blocks, mostly utilities
```

### Custom CSS Guidelines
- **When to write custom CSS**: Only when Tailwind utilities cannot achieve the result
- **File size**: Maximum 100 lines per custom CSS file
- **Organization**: Use logical sections with clear comments
- **Performance**: Prefer CSS transforms over JavaScript for animations

### CSS Custom Properties
- **Theme variables**: Use CSS custom properties for dynamic colors
- **Example**: `color: color-mix(in srgb, var(--current-puzzle-color) 60%, black 30%)`
- **Consistency**: Define color relationships using CSS functions
- **Scope**: Define custom properties at appropriate component levels

## Component Styling Patterns

### Utility Class Organization
```vue
<template>
  <!-- Group related utilities logically -->
  <div class="
    w-full h-auto aspect-square
    bg-white border border-gray-200 rounded-lg
    shadow-sm hover:shadow-md
    transition-shadow duration-200
  ">
    <!-- Content -->
  </div>
</template>
```

### Dynamic Styling
```vue
<template>
  <!-- Use Vue class binding with utilities -->
  <button :class="[
    'px-4 py-2 rounded-lg transition-opacity',
    isPuzzleSolved ? 'animate-pulse' : '',
    isClicked ? 'opacity-30' : 'opacity-100'
  ]">
    <!-- Content -->
  </button>
</template>
```

### State-Based Styling
- **Use computed classes**: Combine utilities based on reactive state
- **Avoid inline conditions**: Extract complex class logic to computed properties
- **Clear naming**: Use descriptive names for dynamic class combinations

## Animation & Interaction Rules

### CSS Animations
- **Prefer CSS over JavaScript**: Use CSS transforms and transitions
- **Performance**: Animate only transform and opacity properties
- **Duration**: Keep animations under 500ms for UI feedback
- **Easing**: Use CSS easing functions, avoid linear animations

### Interaction States
- **Touch-first**: Design for mobile, enhance for desktop
- **No hover-only functionality**: Ensure touch users can access everything
- **Clear feedback**: Provide visual response to user interactions
- **Accessibility**: Maintain proper focus indicators

### Animation Examples
```css
/* Simple click animation */
.click-animation {
  transition: opacity 200ms ease-in-out;
}

/* Victory pulsing */
@keyframes pulse-icon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.pulse-when-won {
  animation: pulse-icon 1.5s ease-in-out infinite;
}
```

## Responsive Design Rules

### Mobile-First Approach
- **Base styles**: Write for mobile first (no prefix)
- **Progressive enhancement**: Add responsive prefixes (md:, lg:, xl:)
- **Touch targets**: Minimum 44px for interactive elements
- **Viewport units**: Use vh/vw sparingly, prefer container-based sizing

### Breakpoint Usage
```vue
<template>
  <!-- Mobile-first responsive classes -->
  <div class="
    w-full
    md:w-auto md:max-w-md
    lg:max-w-lg
  ">
    <!-- Content adapts across breakpoints -->
  </div>
</template>
```

## Color System Rules

### Dynamic Color Management
- **CSS custom properties**: Use for theme-based colors
- **Color mixing**: Use `color-mix()` for consistent relationships
- **Accessibility**: Maintain WCAG 2.1 AA contrast ratios
- **Consistency**: Use same color relationship patterns throughout app

### Implementation Pattern
```css
:root {
  --current-puzzle-color: #3b82f6; /* Dynamic value */
}

.theme-button {
  color: color-mix(in srgb, var(--current-puzzle-color) 60%, black 30%);
}
```

## Performance Guidelines

### Bundle Optimization
- **Utility purging**: Tailwind JIT removes unused utilities automatically
- **Custom CSS minimization**: Keep custom styles minimal
- **Component extraction**: Share utility patterns via composition, not CSS

### Runtime Performance
- **Transform-only animations**: Avoid animating layout properties
- **CSS over JavaScript**: Use CSS transforms for smooth animations
- **Minimal DOM manipulation**: Use Vue's reactive classes instead of direct DOM styling

## Anti-Patterns to Avoid

### Don't Do This
```vue
<!-- BAD: Inline styles -->
<div style="color: red; margin: 10px;">

<!-- BAD: Large custom CSS blocks -->
<style scoped>
.component {
  /* 50+ lines of custom styles */
}
</style>

<!-- BAD: JavaScript for simple styling -->
<script>
function setElementColor(el, color) {
  el.style.color = color; // Use CSS custom properties instead
}
</script>
```

### Do This Instead
```vue
<!-- GOOD: Utility classes -->
<div class="text-red-500 m-2.5">

<!-- GOOD: CSS custom properties for dynamic values -->
<div :style="{ '--current-color': puzzleColor }" class="text-[color:var(--current-color)]">

<!-- GOOD: Minimal, focused custom CSS -->
<style scoped>
@keyframes custom-animation {
  /* Only for animations not available in Tailwind */
}
</style>
```

## Documentation Standards

### CSS Comments
- **Purpose over implementation**: Explain why, not what
- **Animation descriptions**: Document timing and easing choices
- **Color relationships**: Explain color mixing rationale

### Component Documentation
- **Style dependencies**: Document any required global styles
- **Custom properties**: List expected CSS variables
- **Responsive behavior**: Document breakpoint-specific behaviors

---

**Summary**: These styling rules ensure consistent, performant, and maintainable styles throughout the application. The utility-first approach with Tailwind CSS provides excellent developer experience while the minimal custom CSS keeps the bundle size optimal and the codebase maintainable. 