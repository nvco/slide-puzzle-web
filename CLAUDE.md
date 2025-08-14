# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Status
**Status**: ✅ Complete and deployed to production  
**Live URL**: https://nvco.github.io/slide-puzzle-web/  
**Deployment**: Automatic via GitHub Actions on push to main

## Project Guidelines
Follow all coding rules and guidelines specified in the `.cursor/rules/` folder.
Follow project details and updates in `CONTEXT.md` and in the `context/` folder.
See original project ideas in `discovery/` folder.

## Development Commands

- `npm run dev` - Start development server (auto-generates image manifest)
- `npm run build` - Build for production (includes manifest generation)
- `npm run preview` - Preview production build
- `npm run generate-manifest` - Regenerate image manifest from assets

## Deployment

**GitHub Pages**: Automatically deploys on push to main branch
- Workflow: `.github/workflows/deploy.yml`
- Vite config: `base: '/slide-puzzle-web/'` for GitHub Pages routing
- Live site: https://nvco.github.io/slide-puzzle-web/

## Architecture Overview

This is a Vue.js 3 slide puzzle game with a mobile-first design and clean, focused UI. The codebase uses modern Vue patterns with Composition API and follows a component-based architecture with simplified interactions.

### Tech Stack
- **Vue 3** with Composition API (`<script setup>`)
- **Pinia** for state management
- **Tailwind CSS** for utility-first styling
- **Lucide Vue** for consistent iconography
- **Vite** for build tooling and GitHub Pages deployment

### Key Architectural Patterns

**State Management**: Centralized in `gameStore.js` using Pinia. All game state, moves, timing, and puzzle logic flows through this store.

**Composables Pattern**: Core game logic extracted into `usePuzzleLogic.js` composable for reusability and testing. Contains solvability checking and puzzle validation algorithms.

**Component Composition**: Small, focused components that compose together:
- `PuzzleBoard.vue` - Main game container with grid layout
- `PuzzlePiece.vue` - Individual puzzle pieces with move validation
- `GameControls.vue` - Icon-based restart button with click animation
- `WelcomeScreen.vue` - Initial welcome animation and image selection

**Error Handling**: Comprehensive error management with `AppError` class, severity levels, and `handleAsync()` wrapper for consistent error boundaries.

**Performance Optimizations**: 
- Throttled user interactions to prevent rapid clicking
- Proper cleanup in `onUnmounted()`
- Mobile-optimized touch handling
- Simplified animations for better performance

## Critical Game Logic

**Solvable Shuffling Algorithm**: The puzzle uses a guaranteed solvable shuffling by making only valid moves from the solved state. This ensures every generated puzzle can be solved.

**Puzzle Solvability**: Uses inversion count algorithm for 3x3 puzzles. The `isSolvable()` method in `usePuzzleLogic.js` validates puzzle states.

**Movement Validation**: Pieces can only move if adjacent to the empty space (position 0). The `movePiece()` action validates adjacency before allowing moves.

**Win Condition**: Puzzle is solved when pieces 1-8 are in order with 0 (empty space) at position 8.

## UI Design Philosophy

**Simplified Approach**: Clean, focused interface without distracting animations
- **Title System**: "You can do it !" → "Told ya !" on completion
- **Icon-Based Controls**: RotateCcw icon for restart functionality
- **No Celebrations**: Removed confetti/particle animations for cleaner experience
- **Static Interactions**: No hover effects, simplified touch-first design

**Victory Feedback**:
- Title changes immediately when puzzle is solved
- Restart button pulses continuously until game restart
- Clean, minimal approach prioritizing accessibility and performance

## Styling Guidelines

**Utility-First CSS**: 
- **No inline styles** - Always use Tailwind utility classes
- **Component size limit**: Keep Vue files under 300 lines
- **Custom CSS limit**: Maximum 100 lines per custom CSS file
- **Dynamic theming**: Use CSS custom properties with `color-mix()`

**Responsive Design**: Mobile-first with Tailwind responsive prefixes
**Touch Targets**: Minimum 44px for accessibility
**Cursor Management**: `cursor-grab` only on moveable puzzle pieces

## Asset Management

**Image Manifest System**: The build process automatically scans `src/assets/puzzle-images/` and generates `images-manifest.json`. To add new images:
1. Add images to category folders in `src/assets/puzzle-images/`
2. Restart dev server or run `npm run generate-manifest`
3. Images are auto-discovered and categorized

## Development Patterns

**Composition API**: Always use `<script setup>` syntax for new components.

**Error Handling**: Wrap async operations in `handleAsync()` utility:
```javascript
handleAsync(
  async () => { /* async operation */ },
  'Operation description',
  (error) => { /* error handler */ }
)
```

**Performance**: Use `throttle()` utility for rapid user interactions:
```javascript
import { throttle } from '@/utils/performance'
const throttledFunction = throttle(originalFunction, 100)
```

**Styling**: Follow utility-first approach:
```vue
<!-- GOOD: Utility classes -->
<div class="w-full h-auto aspect-square bg-white border rounded-lg">

<!-- BAD: Inline styles -->
<div style="width: 100%; background: white;">
```

**Accessibility**: This codebase follows WCAG 2.1 AA standards:
- Include ARIA labels for screen readers
- Ensure keyboard navigation works
- Use semantic HTML elements
- Maintain proper focus states
- Provide cursor feedback only where appropriate

## Game State Flow

1. **Initialization**: `gameStore.initializeGame()` loads image manifest
2. **Puzzle Generation**: `generatePuzzle()` creates solvable board state
3. **Scrambling**: `scrambleBoard()` makes valid moves from solved state
4. **Gameplay**: `movePiece()` validates and executes moves
5. **Win Detection**: `isSolved` getter checks completion
6. **Victory Feedback**: Title changes and restart button pulses

## Mobile-First Design

The app uses a phone frame mockup with responsive scaling. Key responsive breakpoints:
- Mobile: 85% scale
- Small mobile: 75% scale  
- Desktop: 120% scale

Touch interactions are optimized with proper touch targets and mobile-friendly gestures. No hover-dependent functionality ensures full touch device compatibility.

## Version Control & Deployment

**Git Workflow**:
- Developers handle `git push` manually
- Assistant creates commits but doesn't push automatically
- Each push to main triggers GitHub Pages deployment
- 2-3 minute deployment time from push to live

**Documentation**: Keep context files updated with any architectural changes or new patterns.