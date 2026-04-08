import { defineConfig } from "astro/config"
import { fileURLToPath } from "node:url"

// GitHub Pages serves the site under /<repo-name>/, so the build needs the
// matching base path. Override with SITE_BASE for local previews if needed.
const base = process.env.SITE_BASE ?? "/amsterdam-agent-skills/"
const site = process.env.SITE_URL ?? "https://amsterdam.github.io"

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory",
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
})
