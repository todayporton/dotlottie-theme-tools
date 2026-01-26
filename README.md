# dotLottie Theme Builder (local)

Local web app to attach a theme to an existing Lottie JSON and build a .lottie file.

## Requirements

- Node.js 18+
- npm / pnpm / yarn

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## Preview

Open `http://localhost:5173/preview.html` to preview a `.lottie` file and switch themes.

## Notes

- The app extracts color properties (`c`, `fc`, `sc`) and groups them by color.
- Assign a SID and optional theme color per unique color; theme JSON file is not required.

## Build

```bash
npm run build
npm run preview
```
