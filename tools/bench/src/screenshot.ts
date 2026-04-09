/**
 * Take a full-page screenshot of a prototype directory using Playwright.
 *
 * Flow:
 *   1. Start a tiny Bun static file server pointing at the prototype dir
 *   2. Launch headless Chromium via Playwright
 *   3. Navigate to index.html, wait for network idle
 *   4. Take a full-page screenshot → save as screenshot.png in the prototype dir
 *   5. Tear down browser + server
 *
 * The screenshot is used by the LLM judge for visual scoring — the copilot
 * agent's `view` tool can read PNG files natively.
 */

import { chromium } from "playwright"
import { join } from "node:path"
import { existsSync, statSync, readFileSync } from "node:fs"

/** MIME types for common static assets. */
const MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".eot": "application/vnd.ms-fontobject",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
}

function getMime(path: string): string {
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase()
  return MIME[ext] ?? "application/octet-stream"
}

export interface ScreenshotOptions {
  /** Absolute path to the prototype directory (must contain index.html). */
  prototypePath: string
  /** Viewport width. Default: 1280. */
  width?: number
  /** Viewport height. Default: 900. */
  height?: number
  /** Max ms to wait for network idle after navigation. Default: 5000. */
  timeout?: number
}

export interface ScreenshotResult {
  /** Absolute path to the saved screenshot. */
  path: string
  /** Width × height. */
  dimensions: { width: number; height: number }
}

export async function takeScreenshot(
  opts: ScreenshotOptions,
): Promise<ScreenshotResult> {
  const {
    prototypePath,
    width = 1280,
    height = 900,
    timeout = 5000,
  } = opts

  const indexPath = join(prototypePath, "index.html")
  if (!existsSync(indexPath)) {
    throw new Error(`No index.html in ${prototypePath}`)
  }

  // 1. Start a tiny static file server.
  const server = Bun.serve({
    port: 0, // random available port
    fetch(req) {
      const url = new URL(req.url)
      let filePath = join(prototypePath, decodeURIComponent(url.pathname))

      // Directory → index.html
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, "index.html")
      }

      if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        return new Response("Not Found", { status: 404 })
      }

      return new Response(readFileSync(filePath), {
        headers: { "Content-Type": getMime(filePath) },
      })
    },
  })

  const baseUrl = `http://localhost:${server.port}`
  const screenshotPath = join(prototypePath, "screenshot.png")

  try {
    // 2. Launch headless browser.
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({ viewport: { width, height } })

    // 3. Navigate and wait for the page to settle.
    // Use "/" not "/index.html" — SPA routers (React Router, Vue Router)
    // check window.location.pathname. If it's "/index.html" no route matches
    // and the page renders blank. "/" matches the root route correctly.
    // The static server resolves "/" → index.html automatically.
    await page.goto(`${baseUrl}/`, {
      waitUntil: "networkidle",
      timeout,
    })

    // Give SPAs an extra beat to hydrate after network idle.
    // ADS fonts + React hydration + data rendering can take 2-3s.
    await page.waitForTimeout(3000)

    // 4. Screenshot.
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    })

    await browser.close()

    return {
      path: screenshotPath,
      dimensions: { width, height },
    }
  } finally {
    server.stop()
  }
}
