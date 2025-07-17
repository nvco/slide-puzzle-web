# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project Guidelines
Follow all coding rules and guidelines specified in the `.cursor/rules/` folder.
Follow project details and updates in `CONTEXT.md` and in the `context/` folder.
See original project ideas in `discovery/` folder.

## Development Commands

- `npm run dev` - Start development server (auto-generates image manifest)
- `npm run build` - Build for production (includes manifest generation)
- `npm run preview` - Preview production build
- `npm run generate-manifest` - Regenerate image manifest from assets

## Architecture Overview

This is a Vue.js 3 slide puzzle game with a mobile-first design and phone frame mockup. The codebase uses modern Vue patterns with Composition API and follows a component-based architecture.

### Tech Stack
- **Vue 3** with Composition API (`<script setup>`)
- **Pinia** for state management
- **Tailwind CSS** for styling
- **Vite** for build tooling

### Key Architectural Patterns

**State Management**: Centralized in `gameStore.js` using Pinia. All game state, moves, timing, and puzzle logic flows through this store.

**Composables Pattern**: Core game logic extracted into `usePuzzleLogic.js` composable for reusability and testing. Contains solvability checking and puzzle validation algorithms.

**Component Composition**: Small, focused components that compose together:
- `PuzzleBoard.vue` - Main game container with grid layout
- `PuzzlePiece.vue` - Individual puzzle pieces with move validation
- `GameControls.vue` - Game actions and status display

**Error Handling**: Comprehensive error management with `AppError` class, severity levels, and `handleAsync()` wrapper for consistent error boundaries.

**Performance Optimizations**: 
- Throttled user interactions to prevent rapid clicking
- Proper cleanup in `onUnmounted()`
- Mobile-optimized touch handling

## Critical Game Logic

**Solvable Shuffling Algorithm**: The puzzle uses a guaranteed solvable shuffling by making only valid moves from the solved state. This ensures every generated puzzle can be solved.

**Puzzle Solvability**: Uses inversion count algorithm for 3x3 puzzles. The `isSolvable()` method in `usePuzzleLogic.js` validates puzzle states.

**Movement Validation**: Pieces can only move if adjacent to the empty space (position 0). The `movePiece()` action validates adjacency before allowing moves.

**Win Condition**: Puzzle is solved when pieces 1-8 are in order with 0 (empty space) at position 8.

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

**Accessibility**: This codebase follows WCAG 2.1 AA standards:
- Include ARIA labels for screen readers
- Ensure keyboard navigation works
- Use semantic HTML elements
- Maintain proper focus states

## Game State Flow

1. **Initialization**: `gameStore.initializeGame()` loads image manifest
2. **Puzzle Generation**: `generatePuzzle()` creates solvable board state
3. **Scrambling**: `scrambleBoard()` makes valid moves from solved state
4. **Gameplay**: `movePiece()` validates and executes moves
5. **Win Detection**: `isSolved` getter checks completion
6. **Celebration**: Victory triggers confetti animation overlay

## Mobile-First Design

The app uses a phone frame mockup with responsive scaling. Key responsive breakpoints:
- Mobile: 85% scale
- Small mobile: 75% scale  
- Desktop: 120% scale

Touch interactions are optimized with proper touch targets and mobile-friendly gestures.