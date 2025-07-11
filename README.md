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
6. **Victory**: Celebration and options to continue

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

**Phase 1**: Core functionality development
- [ ] Project setup and base components
- [ ] Image manifest system
- [ ] Puzzle mechanics and game logic
- [ ] Mobile-responsive layout

## 🤝 Contributing

This project uses build-time image manifest generation. To add new puzzle images:
1. Add image files to `/src/assets/puzzle-images/[category]/`
2. Restart development server
3. Images automatically appear in the application

---

*For detailed documentation, see the readme/ folder. Update project status regularly in `readme/project-status.md`.*