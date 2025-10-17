# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup and Dependencies
- `yarn` - Install all dependencies using Yarn (required: Node.js, Yarn, Gulp installed globally)

### Development Workflow  
- `yarn dev` - Start development mode with live reload (runs Gulp default task: builds CSS/JS + watches for changes)
- `yarn test` - Validate theme using GScan for Ghost compatibility
- `yarn zip` - Create distribution package in `dist/solo.zip` for Ghost upload

### Individual Build Tasks
- `gulp css` - Compile CSS only (assets/css/screen.css → assets/built/screen.css via PostCSS)
- `gulp js` - Compile JS only (concat and minify to assets/built/main.min.js)
- `gulp build` - Run both CSS and JS builds without watching

## Architecture Overview

Solo is a minimal Ghost theme built with Handlebars templates and a Gulp/PostCSS build pipeline. It focuses on showcasing individual writers with extensive customization options.

### Immersive Index Feature

The theme now includes an optional immersive index layout that transforms your homepage into a full-screen slideshow experience. This feature creates a visual-first homepage using your latest posts as slides with their feature images as backgrounds.

### Template Structure
- **Core templates**: `default.hbs` (base layout), `index.hbs` (homepage), `post.hbs`, `page.hbs`, `author.hbs`, `tag.hbs`
- **Partials directory**: Reusable components including `loop.hbs` (post listings), `content-cta.hbs`, `pswp.hbs` (photo gallery), and `icons/` directory
- **Template inheritance**: Most templates extend `default.hbs` using `{{!< default}}`

### Build Pipeline
- **CSS**: `assets/css/screen.css` → `assets/built/screen.css` via PostCSS (easy-import, autoprefixer, cssnano)
- **JavaScript**: Concatenates Ghost shared theme assets + custom `assets/js/main.js` → `assets/built/main.min.js`
- **Live reload**: Watches `.hbs`, CSS, and JS files during development

### Customization System
- **Theme settings**: Defined in `package.json` → `config.custom` object
- **Available options**: Background color, navigation layout (left/middle/stacked), typography (sans/serif/mono), header section layouts, post feed layouts
- **Dynamic styling**: CSS custom properties set via `--background-color` with JavaScript color contrast calculation

### Ghost Integration
- **Requirements**: Ghost >=5.0.0
- **Validation**: Uses GScan to ensure Ghost compatibility
- **Distribution**: Packaged via `yarn zip` for upload to Ghost admin

## Immersive Index Layout

### Overview
The immersive index feature provides a full-screen slideshow experience for your homepage, perfect for visual portfolios, photography, or content-focused sites. Each slide uses a post's feature image as a full-screen background with navigation at the bottom.

### Enabling the Immersive Layout
1. Go to **Settings → Design** in Ghost Admin
2. Under **Homepage** settings, toggle **"Use immersive index layout"** to `true`
3. Configure additional settings as needed
4. Save changes

### Configuration Options
All settings are available in **Settings → Design → Homepage**:

- **Use immersive index layout**: Toggle the immersive layout on/off
- **Immersive: number of slides**: Choose how many recent posts to show (3-10)
- **Immersive: overlay darkness**: Adjust background overlay opacity (0.1-0.5)
- **Immersive: background blur (px)**: Set background blur intensity (0-20px)
- **Immersive: auto-advance slides**: Enable automatic slideshow
- **Immersive: auto-advance interval (ms)**: Set time between auto-advances (3-10 seconds)

### Navigation & Interaction
- **Click anywhere**: Advance to next slide
- **Bottom navigation**: Click any title to jump to that slide
- **Keyboard shortcuts**:
  - `Space` or `→`: Next slide
  - `←`: Previous slide
  - `H`: Toggle help overlay
  - `Escape`: Close help overlay
- **Mobile**: Swipe gestures supported
- **Accessibility**: Full keyboard navigation and screen reader support

### Technical Implementation
- **Template files**: `partials/immersive/` directory contains modular components
- **Standalone template**: `index-immersive.hbs` available for custom routing
- **CSS**: `assets/css/components/immersive.css` with responsive design
- **JavaScript**: Integrated into `assets/js/main.js` with progressive enhancement
- **Performance**: Preloads next slide images, respects `prefers-reduced-motion`

### Fallbacks & Requirements
- Posts without feature images show gradient backgrounds
- Gracefully falls back to standard layout if disabled
- Requires at least 1 published post
- Works best with high-quality landscape feature images
