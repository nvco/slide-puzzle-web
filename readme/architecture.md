# Architecture & Technical Details

## Tech Stack Rationale

### Vue.js 3 with Composition API
- Excellent mobile performance and smaller bundle size
- Simple, intuitive syntax perfect for interactive games
- Great reactivity system for puzzle state management
- Built-in animation system for smooth piece movements

### Tailwind CSS
- Utility-first approach perfect for responsive design
- Excellent for creating custom toy-like components
- Mobile-first development workflow

### Vite Build Tool
- Ultra-fast development and build times
- Excellent Vue.js integration and mobile testing capabilities
- Perfect for image processing and optimization

### Pinia State Management
- Vue's recommended store for game state
- Lightweight and intuitive for tracking puzzle state and image history

## File Structure

```
/src
  /components
    - PuzzleBoard.vue
    - PuzzlePiece.vue
    - ImageGallery.vue
    - DifficultySelector.vue
    - GameControls.vue
  /utils
    - puzzleGenerator.js
    - imageProcessor.js
    - gameLogic.js
    - imageLoader.js
  /styles
    - globals.css
    - components.css
  /assets
    - puzzle-images/
      - animals/
      - landscapes/
      - cartoons/
    - sound-effects/
  /data
    - images-manifest.json
  /stores
    - gameStore.js (Pinia store for game state and image tracking)
/public
  - favicon.ico
  - manifest.json
/scripts
  - generate-image-manifest.js
/readme
  - architecture.md
  - development.md
  - design-system.md
  - project-status.md
README.md
```

## Image Management Strategy

### Build-Time Manifest Generation
**When**: Generated automatically during build process  
**How**: Build script scans image folders and creates manifest before compilation

**Process Overview**:
- Node.js script scans `/src/assets/puzzle-images/` directory structure
- Automatically generates JSON manifest with image metadata
- Script runs before every build and development start
- Alt text generated from filenames for accessibility
- Supports nested category folders (animals, landscapes, cartoons, etc.)

**Package.json Integration**:
- Prebuild and predev hooks ensure manifest is always current
- No manual JSON file maintenance required
- Images automatically discovered when added to folders

**Generated Manifest Structure**:
- Categories object with arrays of image metadata
- Each image includes: id, path, alt text, and category
- JSON file imported directly into Vue components
- Build-time generation ensures zero runtime performance cost

**Developer Workflow**:
- Add images to appropriate category folders
- Restart development server
- Images automatically appear in application
- No manual configuration needed

## Random Selection Strategy

The app tracks which images have already been shown to ensure variety. When "random" is selected, it chooses from images not yet displayed in the current session. Once all available images have been shown, the tracking resets and the cycle begins again, guaranteeing users see all available puzzles before any repeats.

## Key Algorithms Needed

- **Puzzle Scrambling**: Ensure solvable initial state
- **Move Validation**: Check if piece can slide
- **Win Condition**: Detect when puzzle is solved
- **Image Discovery**: Load and catalog available puzzle images
- **Random Selection with Memory**: Track shown images to ensure variety before repeats
- **Touch Handling**: Swipe detection and piece movement

## Performance Targets

- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds
- **Bundle Size**: < 500KB initial load
- **Mobile Performance**: 90+ Lighthouse score

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile**: iOS Safari, Android Chrome
- **Progressive Enhancement**: Basic functionality without JavaScript

## Technical Considerations

- **Image Optimization**: WebP format with fallbacks, auto-generated during build
- **Manifest Generation**: Automatic image discovery and metadata creation
- **Touch Events**: Prevent default scrolling during gameplay
- **Memory Management**: Efficient canvas operations
- **Offline Capability**: Service worker for core functionality
- **SEO**: Meta tags and structured data despite SPA architecture