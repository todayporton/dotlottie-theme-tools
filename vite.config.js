import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const headerPath = fileURLToPath(new URL("./partials/header.html", import.meta.url));
const footerPath = fileURLToPath(new URL("./partials/footer.html", import.meta.url));
const i18nHeadPath = fileURLToPath(new URL("./partials/i18n-head.html", import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "inject-header-partial",
      transformIndexHtml(html) {
        const header = readFileSync(headerPath, "utf-8");
        const footer = readFileSync(footerPath, "utf-8");
        const i18nHead = readFileSync(i18nHeadPath, "utf-8");
        const marker = '<div id="site-header"></div>';
        const footerMarker = '<div id="site-footer"></div>';
        return html
          .replace("<!-- i18n-head -->", i18nHead)
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
