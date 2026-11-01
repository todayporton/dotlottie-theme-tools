# dotLottie Theme Tools

A web application for attaching color themes to Lottie animations and generating `.lottie` files.

**Live site:** https://potkc.github.io/dotlottie-theme-tools/

- [Builder](https://potkc.github.io/dotlottie-theme-tools/)
- [Preview](https://potkc.github.io/dotlottie-theme-tools/preview.html)

## Overview

dotLottie Theme Tools enables designers and developers to:

- Upload Lottie JSON files and automatically extract all color properties
- Assign semantic IDs (SIDs) to colors for theming
- Create custom color themes with visual color pickers
- Build and download `.lottie` files with embedded themes
- Preview `.lottie` files and switch between themes

## Features

### Builder (index.html)

| Feature | Description |
|---------|-------------|
| Color Extraction | Automatically scans Lottie JSON for color properties (`c`, `fc`, `sc`) |
| Color Grouping | Groups identical colors and displays occurrence count |
| SID Assignment | Assign semantic IDs to colors for theme mapping |
| Theme Colors | Set custom theme colors via color picker or hex input |
| dotLottie Export | Generate and download `.lottie` files with embedded themes |
| Execution Log | View timestamped logs with copy/download options |

### Preview (preview.html)

| Feature | Description |
|---------|-------------|
| File Loading | Upload and preview `.lottie` files |
| Theme Switching | Dynamically switch between available themes |
| Background Toggle | Switch between light and dark backgrounds |

## Requirements

- Node.js 18+
- npm / pnpm / yarn

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

- **Builder**: http://localhost:5173/
- **Preview**: http://localhost:5173/preview.html

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

Pushing to `main` builds the site and deploys `dist/` to GitHub Pages through `.github/workflows/deploy.yml`. In the repository settings, set **Pages → Source** to **GitHub Actions**.

## Directory Structure

```
dotlottie-theme-tools/
├── .github/workflows/
│   └── deploy.yml       # GitHub Pages deployment
├── src/
│   ├── main.js          # Builder application logic
│   ├── preview.js       # Preview application logic
│   └── styles.css       # Shared styles
├── partials/
│   ├── header.html      # Shared navigation header (inlined at build time)
│   └── footer.html      # Shared footer (inlined at build time)
├── index.html           # Builder page
├── preview.html         # Preview page
├── vite.config.js       # Vite configuration
└── package.json
```

## Technical Details

### Color Handling

The builder supports multiple Lottie color property formats:

- **Static colors**: `[R, G, B]` or `[R, G, B, A]` arrays (values in 0-1 range)
- **Animated colors**: Keyframe arrays with `s` (start) values

Color properties are identified by these keys:
- `c` - General color
- `fc` - Fill color
- `sc` - Stroke color

### Theme System

1. **SID (Semantic ID)**: A unique identifier assigned to each color for theming purposes
2. **Theme Rules**: Map SIDs to new color values
3. **Scope**: Themes are associated with specific animations within the dotLottie file

Only colors with assigned SIDs are included in the generated theme.

### dotLottie Generation

The build process uses `@dotlottie/dotlottie-js`:

1. `addAnimation()` - Adds the Lottie animation
2. `addTheme()` - Attaches the theme configuration
3. `scopeTheme()` - Associates theme with animation
4. `build()` - Generates the binary dotLottie file

## Dependencies

| Package | Purpose |
|---------|---------|
| `@dotlottie/dotlottie-js` | Building and manipulating dotLottie files |
| `@lottiefiles/dotlottie-web` | Rendering and preview functionality |
| `vite` | Build tool and development server |

The Preview page loads the `dotlottie-web` WebAssembly module from a public CDN at runtime, so it needs network access to jsDelivr or unpkg.

## Usage

### Creating a Themed dotLottie

1. Open the Builder page
2. Upload a Lottie JSON file (drag & drop or click to select)
3. Review extracted colors grouped by unique values
4. For each color you want to theme:
   - Enter a SID (e.g., `primary`, `background`, `accent`)
   - Optionally set a new theme color
5. Click "Build .lottie" to generate and download the file

### Previewing a dotLottie

1. Open the Preview page
2. Upload a `.lottie` file
3. Use the theme dropdown to switch between available themes
4. Toggle background color for better visibility

## License

[MIT](LICENSE)
