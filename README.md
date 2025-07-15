# Slide Puzzle Website

A modern, kid-friendly slide puzzle website that mimics the look and feel of classic plastic slide puzzles. Built with Vue.js and designed for mobile-first interaction.

## 🎯 Project Overview

Users select from a curated collection of images to create puzzles and solve them in an engaging, toy-like interface. The experience includes welcome animations, 3D flip transitions, and celebration sequences that make the digital puzzle feel like a physical toy.

## 🚀 Quick Start

See Development Setup: `readme/development.md` for complete installation and setup instructions.

## 📱 Target Audience

- **Primary**: Children (ages 4-12)
- **Secondary**: Parents and educators
- **Usage**: Primarily mobile devices, responsive for all screen sizes

## 🎮 User Experience

1. **Welcome Animation**: Puzzle demos sliding movements and shows greeting
2. **Image Selection**: Choose from curated image gallery
3. **Preview**: See the completed puzzle before starting
4. **3D Flip**: Dramatic transition when ready to play
5. **Gameplay**: Touch/click to slide pieces
6. **Victory**: Celebration with confetti animation and victory message

## 🧩 Puzzle Mechanics

### Solvable Shuffling Algorithm
The puzzle uses a **solvable shuffling algorithm** that ensures every generated puzzle can be solved:

- **Valid Move Generation**: Starts with the solved state and makes random valid moves
- **Guaranteed Solvability**: Only uses moves that maintain puzzle solvability
- **Proper Scrambling**: Makes 50+ random valid moves to ensure good scrambling
- **Fallback Safety**: Includes a safe shuffle method if the main algorithm fails

### Solvability Check
For 3x3 puzzles, the algorithm uses the **inversion count method**:
- Counts inversions (pairs where a larger number comes before a smaller number)
- A 3x3 puzzle is solvable if the inversion count is even
- Larger puzzles are always solvable when using valid moves

### Celebration System
When the puzzle is solved:
- **Confetti Animation**: 50 colorful confetti pieces fall from the top
- **Victory Message**: Displays completion stats (moves and time)
- **Action Buttons**: Options to play again or choose a new image
- **Smooth Transitions**: Fade-in overlay with bounce-in animation

## 🛠 Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Pinia
- **Image Management**: Build-time manifest generation

## 📚 Documentation

- **Game Design Concept**: `slide-puzzle-initial-context.md` - Core creative vision and magical user experience flow
- Architecture & Technical Details: `readme/architecture.md`
- Development Setup & Workflow: `readme/development.md`
- Design System & UI Guidelines: `readme/design-system.md`
- Project Status & Todos: `readme/project-status.md`

## 🎨 Design Philosophy

Playful, engaging interface with bright colors, smooth animations, and tactile feel that mimics physical slide puzzles. Mobile-first design with accessibility compliance and clean, semantic HTML structure.

## 📝 Current Status

**Phase 1**: Core functionality development ✅
- [x] Project setup and base components
- [x] Image manifest system
- [x] Puzzle mechanics and game logic
- [x] Mobile-responsive layout
- [x] Solvable shuffling algorithm
- [x] Celebration system with confetti animation

**Phase 2**: Accessibility and UX improvements ✅
- [x] Focus states and keyboard navigation
- [x] ARIA labels and semantic HTML
- [x] Touch target sizing for mobile
- [x] Error handling and validation

**Phase 3**: Code organization and performance ✅
- [x] Component extraction and refactoring
- [x] Composable logic separation
- [x] Performance optimizations
- [x] JavaScript best practices

## 🚧 TODO

- [ ] **Create proper favicon**: Design and implement a custom favicon for the slide puzzle app (currently using placeholder `favicon.svg`)

## 🤝 Contributing

This project uses build-time image manifest generation. To add new puzzle images:
1. Add image files to `/src/assets/puzzle-images/[category]/`
2. Restart development server
3. Images automatically appear in the application

### Key Technical Notes
- **Shuffling**: Always use the solvable shuffling algorithm in `gameStore.scrambleBoard()`
- **Validation**: The `isSolvable()` function in `usePuzzleLogic` checks puzzle solvability
- **Celebration**: Triggered via game state watching in `PuzzleBoard.vue`

---

*For detailed documentation, see the readme/ folder. Update project status regularly in `readme/project-status.md`.*