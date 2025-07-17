# 🧩 Slide Puzzle

A modern, mobile-first slide puzzle game built with Vue.js 3. Features a beautiful phone frame design, smooth animations, and dynamic color themes that make solving puzzles delightful and engaging.

## ✨ Features

- 📱 **Mobile-First Design** - Optimized touch interactions in a phone frame mockup
- 🎯 **Guaranteed Solvable Puzzles** - Smart shuffling algorithm ensures every puzzle can be solved
- ♿ **Accessibility Focused** - WCAG 2.1 AA compliant with keyboard navigation
- ⚡ **Lightning Fast** - Built with Vite for optimal performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

## 🛠️ Tech Stack

- **[Vue.js 3](https://vuejs.org/)** - Progressive JavaScript framework with Composition API
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[Pinia](https://pinia.vuejs.org/)** - State management for Vue

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── PuzzleBoard.vue    # Main game board
│   ├── PuzzlePiece.vue    # Individual puzzle pieces
│   └── GameControls.vue   # Game controls and stats
├── stores/              # Pinia stores
│   └── gameStore.js       # Game state management
├── composables/         # Vue composables
│   └── usePuzzleLogic.js  # Core puzzle algorithms
├── utils/               # Utility functions
└── styles/              # Global styles and CSS variables
```

## 🎯 Core Algorithms

### Solvable Puzzle Generation
The game uses a **guaranteed solvable shuffling algorithm**:
- Starts with the solved state
- Makes only valid moves to scramble the puzzle
- Ensures every generated puzzle has a solution

### Move Validation
- Pieces can only move if adjacent to the empty space
- Touch and click interactions are validated before allowing movement
- Smooth animations provide visual feedback

### Win Detection
- Automatically detects when puzzle is solved (1-8 in order, empty space at position 8)
- Triggers celebration 

## 📱 Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)  
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## 🌟 Acknowledgments

- Inspired by classic sliding puzzle toys
- Built with modern web technologies for a smooth, native-like experience
- Designed with accessibility and mobile-first principles

---

[Play the game live!](https://nvco.github.io/slide-puzzle-web) 