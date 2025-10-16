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