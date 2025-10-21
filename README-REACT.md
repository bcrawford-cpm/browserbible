# Browser Bible - React Refactor

This is a modernized version of the Browser Bible application, refactored from jQuery to React with modern build tools.

## What Changed

### Technology Stack
- **From**: jQuery, vanilla JavaScript, manual HTML files
- **To**: React 18, Vite, ES6 modules, React Router

### Build System
- **From**: No build system, direct HTML files
- **To**: Vite for fast development and optimized production builds

### Project Structure
```
/
├── src/                    # React source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components (Landing, Desktop, Reader)
│   ├── data/              # Bible data (converted to ES6 modules)
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   └── assets/            # Static assets
├── public/                # Static files served as-is
│   └── app/              # Original app files (Bible content, images, etc.)
├── dist/                  # Production build output
└── index.html            # Main HTML entry point
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
This starts the Vite development server at http://localhost:3000

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Features

### Landing Page
- Clean, modern interface
- Choose between Reader and Desktop modes
- Matches original design aesthetic

### Reader Mode
- Mobile-optimized Bible reading experience
- Chapter-by-chapter navigation
- Multiple version comparison
- Smooth scrolling
- Touch-friendly interface

### Desktop Mode
- Multi-pane Bible study interface
- Side-by-side version comparison
- Add/remove document panes
- Linked scrolling between panes
- Responsive layout

## Architecture

### Component-Based Design
The application is built using React components for better:
- **Reusability**: Components can be reused across different parts of the app
- **Maintainability**: Easier to update and debug individual components
- **Testability**: Components can be tested in isolation

### State Management
- Uses React hooks (useState, useEffect) for local state
- No external state management library needed for current scope
- Can easily integrate Redux/Zustand if needed in the future

### Routing
- Uses React Router for client-side routing
- Three main routes:
  - `/` - Landing page
  - `/reader` - Reader mode
  - `/desktop` - Desktop mode

### Data Layer
- Bible data converted to ES6 modules
- Async loading of Bible chapters
- Supports multiple Bible versions
- Extensible for additional content types

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- No IE11 support (can be added with polyfills if needed)

## Performance
- Fast development with Vite HMR (Hot Module Replacement)
- Optimized production builds with code splitting
- Lazy loading of Bible chapters
- Minimal bundle size

## Migration from Original

### What Stayed the Same
- Core Bible data structure
- CSS styling approach (with improvements)
- Bible content format and loading
- Overall UI/UX design

### What's Different
- Modern JavaScript (ES6+)
- Component-based architecture
- Build system for optimization
- Better code organization
- Improved developer experience

## Future Enhancements
- [ ] Add search functionality
- [ ] Implement notes system
- [ ] Add bookmarks
- [ ] Integrate lexicon popups
- [ ] Add audio player integration
- [ ] Implement highlighting
- [ ] Add user preferences persistence (localStorage)
- [ ] Progressive Web App (PWA) features
- [ ] Offline support with Service Workers

## Development Notes

### Adding New Bible Versions
1. Place Bible HTML files in `public/app/content/bibles/{version_id}/`
2. Files should be named `{BookOSIS}_{Chapter}.html`
3. Update `versions.json` if needed

### Extending Components
All components are in `src/components/` and `src/pages/`
- Follow existing patterns
- Use functional components with hooks
- Keep components focused and small
- Add PropTypes or TypeScript for type safety

### Styling
- CSS modules can be used for component-specific styles
- Global styles in `src/index.css`
- Original CSS files preserved in `public/app/css/`

## License
Same as original: GPLv2/MIT

## Credits
- Original code by John Dyer and Digital Bible Society
- React refactor: Modernization project 2025
