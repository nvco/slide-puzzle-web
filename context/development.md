# Development Setup & Workflow

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser for testing

## Initial Setup

```bash
# Clone repository
git clone [repository-url]
cd slide-puzzle-web

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Scripts

```bash
# Development
npm run dev          # Start Vite dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Image Management
npm run generate-manifest  # Regenerate image manifest (runs automatically)
```

## GitHub Pages Deployment

### Automatic Deployment
- **Trigger**: Push to `main` branch automatically deploys
- **Process**: GitHub Actions builds and deploys via `.github/workflows/deploy.yml`
- **Live URL**: https://nvco.github.io/slide-puzzle-web/
- **Build Time**: ~2-3 minutes from push to live

### Manual Deployment
If needed, manually trigger deployment:
1. Go to repository Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

### Configuration Files
- **`vite.config.js`**: Contains `base: '/slide-puzzle-web/'` for GitHub Pages routing
- **`.github/workflows/deploy.yml`**: GitHub Actions workflow for deployment
- **Repository Settings**: Pages source set to "GitHub Actions"

### Deployment Requirements
- Repository must be public (for free GitHub Pages)
- GitHub Actions must be enabled
- Pages must be enabled in repository settings

## Styling Guidelines

### CSS Organization
- **Primary**: Use Tailwind utility classes for all styling
- **Custom CSS**: Avoid inline styles and large custom CSS files
- **Component Styles**: Keep styles close to components, prefer utilities
- **Performance**: Utility-first approach optimizes bundle size

### Styling Rules
- **No Inline Styles**: Use Tailwind classes instead of style attributes
- **Utility-First**: Prefer `bg-blue-500 text-white` over custom CSS
- **Component Extraction**: Only create custom CSS for complex repeated patterns
- **File Size**: Keep any custom CSS files under 100 lines
- **Responsive**: Use Tailwind's responsive prefixes (md:, lg:) for all breakpoints

### Color System
- **Dynamic Colors**: Use CSS custom properties for theme colors
- **Example**: `color-mix(in srgb, var(--current-puzzle-color) 60%, black 30%)`
- **Consistency**: Maintain color relationships using CSS color functions
- **Variables**: Define color relationships in CSS custom properties

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

## Build Process

### Development Build
- Runs image manifest generation
- Starts development server with hot reload
- Enables Vue.js devtools
- Source maps for debugging

### Production Build
- Generates fresh image manifest
- Optimizes and bundles code
- Compresses images
- Outputs to `dist/` folder
- **GitHub Pages**: Automatically configured with correct base path

## Testing Strategy

### Manual Testing Checklist
- [ ] Welcome animation plays on first load
- [ ] Image selection works on mobile and desktop
- [ ] 3D flip animation is smooth
- [ ] Puzzle pieces slide correctly
- [ ] Win condition triggers title change and button pulsing
- [ ] Restart button works with click animation
- [ ] Random selection avoids immediate repeats
- [ ] Responsive design works across screen sizes
- [ ] Keyboard navigation works properly
- [ ] Touch interactions work on mobile devices

### Performance Testing
- Use Lighthouse for mobile performance scores
- Target 90+ for Performance, Accessibility, Best Practices
- Monitor bundle size (target <500KB)
- Test on actual mobile devices

## Debugging Tips

### Common Issues
- **Images not appearing**: Check file paths and restart dev server
- **Manifest not updating**: Verify script runs in package.json hooks
- **Touch not working**: Check touch event handling in components
- **Animation stuttering**: Monitor for performance bottlenecks
- **GitHub Pages 404**: Check base path configuration in vite.config.js

### Development Tools
- Vue.js DevTools browser extension
- Vite DevTools for build analysis
- Mobile device testing with browser dev tools
- GitHub Actions logs for deployment debugging

## Code Style

### Vue.js Conventions
- Use Composition API with `<script setup>`
- Single File Components (.vue files)
- Keep components under 300 lines total
- Extract large logic into composables
- Descriptive component and prop names
- Consistent event naming

### CSS/Tailwind
- Mobile-first responsive design
- Tailwind utility classes preferred over custom CSS
- No inline styles (use Tailwind classes)
- Custom CSS only for complex animations or patterns not covered by Tailwind
- Maintain consistent spacing scale using Tailwind's system

### Component Organization
- **Single responsibility**: One component = one purpose
- **Size limits**: Keep Vue files under 300 lines (template + script + style)
- **Extract composables**: Move reusable logic to `composables/` folder
- **File naming**: Use PascalCase for components, camelCase for composables

## Version Control

### Commit Guidelines
- Clear, descriptive commit messages
- Small, focused commits
- Include manifest updates when adding images
- Test changes before committing

### Documentation Updates
- Update `CONTEXT.md` for project context changes
- Update specific `context/*.md` files for technical documentation:
  - `context/architecture.md` - Technical decisions and architecture
  - `context/development.md` - Development process and guidelines
  - `context/design_system.md` - Design and UI changes
  - `context/project_status.md` - Project progress and milestones
- Important user-facing information can be added to relevant context files

### Branch Strategy
- `main`: Production-ready code that auto-deploys to GitHub Pages
- Feature branches for new functionality
- Test thoroughly before merging to main
- Pull request reviews recommended for major changes

### Push Strategy
- Developers handle `git push` manually to save resources
- Assistant creates commits but doesn't push automatically
- Each push to main triggers automatic GitHub Pages deployment