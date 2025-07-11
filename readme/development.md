# Development Setup & Workflow

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser for testing

## Initial Setup

Project setup instructions will be provided when development begins.

## Development Scripts

Development scripts and commands will be configured during project setup.

## Image Management Workflow

### Adding New Puzzle Images

1. **Prepare Images**
   - Optimize for web (WebP preferred, PNG/JPEG acceptable)
   - Square aspect ratio works best for puzzles
   - Descriptive filenames (e.g., `cute-cat-playing.webp`)

2. **Add to Project**
   ```bash
   # Add to appropriate category folder
   src/assets/puzzle-images/animals/cute-cat-playing.webp
   src/assets/puzzle-images/landscapes/mountain-sunset.webp
   ```

3. **Automatic Processing**
   - Restart development server
   - Manifest regenerates automatically
   - Images appear in application immediately

### Supported Image Formats
- **WebP**: Preferred for best compression and quality
- **PNG**: For images requiring transparency
- **JPEG**: For photographic content
- **File Naming**: Use descriptive, kebab-case names

### Image Categories
Current categories (add folders as needed):
- `animals/` - Pets, wildlife, cute creatures
- `landscapes/` - Nature scenes, outdoor views
- `cartoons/` - Kid-friendly illustrations, characters

## Build Process

Build process and commands will be configured during project setup.

### Development Build
- Runs image manifest generation
- Starts development server with hot reload
- Enables Vue.js devtools
- Source maps for debugging

### Production Build
- Generates fresh image manifest
- Optimizes and bundles code
- Compresses images
- Outputs to distribution folder

## Testing Strategy

### Manual Testing Checklist
- [ ] Welcome animation plays on first load
- [ ] Image selection works on mobile and desktop
- [ ] 3D flip animation is smooth
- [ ] Puzzle pieces slide correctly
- [ ] Win condition triggers celebration
- [ ] Random selection avoids immediate repeats
- [ ] Responsive design works across screen sizes

### Performance Testing
- Use Lighthouse for mobile performance scores
- Target 90+ for Performance, Accessibility, Best Practices
- Monitor bundle size (target <500KB)

## Debugging Tips

### Common Issues
- **Images not appearing**: Check file paths and restart dev server
- **Manifest not updating**: Verify script runs in package.json hooks
- **Touch not working**: Check touch event handling in components
- **Animation stuttering**: Monitor for performance bottlenecks

### Development Tools
- Vue.js DevTools browser extension
- Vite DevTools for build analysis
- Mobile device testing with browser dev tools

## Deployment

Deployment configuration and instructions will be added during project setup.

## Code Style

### Vue.js Conventions
- Use Composition API with `<script setup>`
- Single File Components (.vue files)
- Descriptive component and prop names
- Consistent event naming

### CSS/Tailwind
- Mobile-first responsive design
- Tailwind utility classes preferred
- Custom CSS only when necessary
- Maintain consistent spacing scale

## Version Control

### Commit Guidelines
- Clear, descriptive commit messages
- Small, focused commits
- Include manifest updates when adding images

### Branch Strategy
- `main`: Production-ready code
- Feature branches for new functionality
- Test thoroughly before merging