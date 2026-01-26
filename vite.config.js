import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const headerPath = fileURLToPath(new URL("./public/header.html", import.meta.url));
const footerPath = fileURLToPath(new URL("./public/footer.html", import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "inject-header-partial",
      transformIndexHtml(html) {
        const header = readFileSync(headerPath, "utf-8");
        const footer = readFileSync(footerPath, "utf-8");
        const marker = '<div id="site-header"></div>';
        const footerMarker = '<div id="site-footer"></div>';
        return html
          .replace(marker, `<div id="site-header">${header}</div>`)
          .replace(footerMarker, footer);
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        preview: resolve(rootDir, "preview.html")
      }
    }
  }
});
