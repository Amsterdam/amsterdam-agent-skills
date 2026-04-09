/**
 * Post-process a finished agent run into a publishable prototype directory.
 *
 * Steps:
 *
 *   1. Detect what the agent produced. Three cases:
 *      a) Static HTML: workdir contains an index.html and no package.json.
 *         Just copy the workdir as-is, minus dotfiles and the runner's own
 *         logs/sessions.
 *      b) Buildable project: workdir contains a package.json with a "build"
 *         script. Install deps with bun (or npm), run the build, then copy
 *         the resulting dist/ (or build/, out/, etc.) into the prototype dir.
 *      c) Neither: error out — there's nothing to publish.
 *
 *   2. Compute a prompt hash for the meta.json so we can detect drift later.
 *
 *   3. Write meta.json with all the metadata the showcase needs.
 *
 *   4. Return the absolute path to the prototype directory.
 */

import { existsSync, type Dirent } from "node:fs"
import { mkdir, readFile, writeFile, cp, rm, readdir } from "node:fs/promises"
import { join, basename, relative } from "node:path"
import { spawn } from "node:child_process"
import { createHash } from "node:crypto"
import type {
  PrototypeMeta,
  VariantDefinition,
  BenchmarkDefinition,
} from "./types/manifest.ts"
import type { CopilotRunResult } from "./runners/copilot.ts"
import { prototypeDir } from "./paths.ts"

export interface PostProcessOptions {
  workdir: string
  benchmark: BenchmarkDefinition
  variant: VariantDefinition
  runResult: CopilotRunResult
  /** If false, the workdir is left in place after copying for debugging. */
  cleanWorkdir: boolean
  verbose?: boolean
}

export interface PostProcessResult {
  /** Absolute path to the published prototype directory. */
  prototypePath: string
  /** Detected build kind for logging. */
  kind: "static" | "vite" | "next" | "cra" | "unknown-built"
}

const KNOWN_BUILD_DIRS = ["dist", "build", "out", ".output/public", "_site"] as const

export async function postProcess(opts: PostProcessOptions): Promise<PostProcessResult> {
  const { workdir, benchmark, variant, runResult, cleanWorkdir, verbose } = opts

  const protoPath = prototypeDir(benchmark.slug, variant.id)
  // Wipe any prior prototype dir so we never end up with stale files.
  await rm(protoPath, { recursive: true, force: true })
  await mkdir(protoPath, { recursive: true })

  // ── Detect the project shape ────────────────────────────────────────────
  //
  // Agents don't always write to the workdir root. The original benchmark 001
  // run dropped a full 3-page static site into `site/`. So we walk the tree
  // looking for (in order of preference):
  //   1. The shallowest package.json  → buildable project
  //   2. The shallowest index.html    → static site
  //
  // The walk skips the usual noise (node_modules, .git, logs, runner output).
  const detected = await detectProjectRoot(workdir)
  if (!detected) {
    throw new Error(
      `Workdir ${workdir} has neither package.json nor index.html anywhere in the tree — agent produced nothing publishable`,
    )
  }

  let kind: PostProcessResult["kind"] = "unknown-built"
  let sourceDir = detected.root // what we copy from after build
  const hasPkgJson = detected.type === "package"
  const hasIndexHtml = detected.type === "static"

  if (detected.root !== workdir) {
    log(
      verbose,
      `→ Detected ${detected.type} project in subdirectory: ${relative(workdir, detected.root) || "."}`,
    )
  }

  const pkgJsonPath = join(detected.root, "package.json")

  if (hasPkgJson) {
    const pkg = JSON.parse(await readFile(pkgJsonPath, "utf8")) as {
      scripts?: Record<string, string>
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
    if ("vite" in allDeps) kind = "vite"
    else if ("next" in allDeps) kind = "next"
    else if ("react-scripts" in allDeps) kind = "cra"
    else kind = "unknown-built"

    if (pkg.scripts?.["build"]) {
      log(verbose, `→ Detected ${kind} project, running build...`)
      // Run `bun install --ignore-scripts` to avoid executing arbitrary
      // preinstall/postinstall hooks from LLM-generated package.json, then
      // `bun run build` which only runs the explicit build script.
      await runShell("bun", ["install", "--ignore-scripts"], detected.root, verbose)
      await runShell("bun", ["run", "build"], detected.root, verbose)
    } else {
      throw new Error(
        `Detected package.json in ${detected.root} but no "build" script. Cannot publish.`,
      )
    }

    // Find which build dir actually exists (relative to the project root).
    let foundBuildDir: string | undefined
    for (const candidate of KNOWN_BUILD_DIRS) {
      if (existsSync(join(detected.root, candidate))) {
        foundBuildDir = candidate
        break
      }
    }
    if (!foundBuildDir) {
      throw new Error(
        `Build completed but none of ${KNOWN_BUILD_DIRS.join(", ")} were created in ${detected.root}`,
      )
    }
    sourceDir = join(detected.root, foundBuildDir)
  } else if (hasIndexHtml) {
    kind = "static"
    log(verbose, `→ Detected static HTML output in ${detected.root}, copying as-is`)
    sourceDir = detected.root
  }

  // ── Copy the built artifact into the prototype dir ──────────────────────
  await copyTreeFiltered(sourceDir, protoPath)

  // ── Copy the session transcript next to the bundle (if present) ─────────
  if (existsSync(runResult.sessionTranscript)) {
    await cp(runResult.sessionTranscript, join(protoPath, "session.md"))
  }

  // ── Verify there's an index.html the iframe can hit ─────────────────────
  if (!existsSync(join(protoPath, "index.html"))) {
    const files = await readdir(protoPath)
    throw new Error(
      `Published prototype at ${protoPath} has no index.html. Files present: ${files.join(", ")}`,
    )
  }

  // ── Make Vite/Next/CRA builds iframe-portable ───────────────────────────
  // Bundlers default to `base: "/"` which bakes absolute paths into HTML
  // (/assets/foo.js) and CSS (url(/assets/font.woff2)). Rewrite them to
  // relative so the iframe loads them correctly at its nested URL.
  const rewritten = await rewriteAbsolutePathsInPrototype(protoPath)
  if (rewritten > 0) {
    log(verbose, `→ Rewrote absolute asset paths in ${rewritten} file(s)`)
  }

  // ── SPA fallback ───────────────────────────────────────────────────────
  // If this looks like a single-page app (React/Vue/Next client router),
  // inject a tiny script that resets the router's URL perception so it
  // matches the root route "/" instead of the iframe's deep nested URL.
  const spaInjected = await injectSpaFallbackIfNeeded(protoPath)
  if (spaInjected) {
    log(verbose, `→ Injected SPA iframe fallback script`)
  }

  // ── Write meta.json ─────────────────────────────────────────────────────
  const meta: PrototypeMeta = {
    benchmarkId: benchmark.id,
    benchmarkSlug: benchmark.slug,
    variantId: variant.id,
    variantLabel: variant.label,
    agent: variant.agent,
    model: variant.model,
    skills: variant.skills,
    promptHash: hashPrompt(benchmark.prompt),
    builtAt: new Date().toISOString(),
    durationMs: runResult.durationMs,
    tokens: runResult.tokens,
    usage: runResult.usage,
    oneShot: runResult.oneShot,
    sessionTranscript: existsSync(join(protoPath, "session.md")) ? "session.md" : undefined,
    entry: "index.html",
    extra: {
      kind,
      copilotExitCode: runResult.exitCode,
      copilotToolCallCount: runResult.toolCallCount,
    },
  }
  await writeFile(join(protoPath, "meta.json"), JSON.stringify(meta, null, 2) + "\n")

  // ── Optional cleanup ────────────────────────────────────────────────────
  if (cleanWorkdir) {
    await rm(workdir, { recursive: true, force: true })
  }

  return { prototypePath: protoPath, kind }
}

/**
 * Copy a tree but skip noisy stuff: node_modules, .git, .github (runner-
 * injected skill instructions), source maps, .DS_Store, copilot capture files.
 * The published bundle should be just what an iframe needs to render.
 */
async function copyTreeFiltered(src: string, dest: string): Promise<void> {
  await cp(src, dest, {
    recursive: true,
    force: true,
    filter: (source: string) => {
      const name = basename(source)
      if (name === "node_modules") return false
      if (name === ".git") return false
      if (name === ".github") return false // runner injects skill instructions here
      if (name === ".cache") return false
      if (name === ".vite") return false
      if (name === ".astro") return false
      if (name === "logs") return false
      if (name === "copilot-stdout.jsonl") return false
      if (name === "copilot-stderr.log") return false
      if (name === "copilot-session.md") return false // we copy this separately as session.md
      if (name === ".DS_Store") return false
      if (name.endsWith(".map")) return false
      return true
    },
  })
}

/**
 * Rewrite absolute asset paths to relative in all HTML and CSS files under
 * the prototype directory. This makes Vite/Next/CRA builds — which default
 * to `base: "/"` — work when iframed at a deeper URL like
 * `/amsterdam-agent-skills/prototypes/{slug}/prototypes/{variant}/`.
 *
 * DEPTH-AWARE: CSS files inside subdirectories (e.g. `assets/index.css`)
 * get different treatment than root-level HTML. A CSS file at `assets/`
 * referencing `url(/assets/font.woff2)` must become `url(./font.woff2)`
 * (sibling reference), NOT `url(./assets/font.woff2)` (which would double
 * the path to `assets/assets/font.woff2`).
 *
 * Returns the number of files modified. Exported so `bench repair` can call
 * it on existing prototypes without a rebuild.
 */
export function rewriteAbsoluteAssetPathsInText(
  content: string,
  options?: { cssInSubdir?: boolean },
): string {
  if (options?.cssInSubdir) {
    // CSS files inside a subdirectory (e.g. assets/) — strip the directory
    // prefix so siblings resolve correctly:
    //   url(/assets/font.woff2)    → url(./font.woff2)    (absolute → relative)
    //   url(./assets/font.woff2)   → url(./font.woff2)    (fix double-path from prior repair)
    //   url("./assets/font.woff2") → url("./font.woff2")
    return content
      .replace(/url\(\s*\/assets\//g, "url(./")
      .replace(/url\(\s*"\/assets\//g, 'url("./')
      .replace(/url\(\s*'\/assets\//g, "url('./")
      // Also fix the double-path from a prior naive repair:
      .replace(/url\(\s*\.\/assets\//g, "url(./")
      .replace(/url\(\s*"\.\/assets\//g, 'url("./')
      .replace(/url\(\s*'\.\/assets\//g, "url('./")
  }
  // Root-level files (HTML, root CSS) — standard relative rewrite:
  //   href="/assets/foo.css" → href="./assets/foo.css"
  //   url(/assets/foo)       → url(./assets/foo)
  return content
    .replace(/(\s(?:src|href))="\/(?!\/)/g, '$1="./')
    .replace(/(\s(?:src|href))='\/(?!\/)/g, "$1='./")
    .replace(/url\(\s*\/(?!\/)/g, "url(./")
    .replace(/url\(\s*"\/(?!\/)/g, 'url("./')
    .replace(/url\(\s*'\/(?!\/)/g, "url('./")
}

export async function rewriteAbsolutePathsInPrototype(protoPath: string): Promise<number> {
  const files = await walkFiles(protoPath, (p) => /\.(html|css)$/i.test(p))
  let changed = 0
  for (const file of files) {
    const content = await readFile(file, "utf8")
    // Determine if the file is inside a subdirectory of the prototype root.
    // CSS files in assets/ need the "strip prefix" rewrite, not "prepend ./assets/".
    const relPath = relative(protoPath, file)
    const depth = relPath.split("/").length - 1
    const cssInSubdir = file.endsWith(".css") && depth > 0
    const rewritten = rewriteAbsoluteAssetPathsInText(content, { cssInSubdir })
    if (rewritten !== content) {
      await writeFile(file, rewritten)
      changed++
    }
  }
  return changed
}

/**
 * Remove any `.github/` directory at the root of a published prototype. The
 * runner uses `<workdir>/.github/instructions/` to inject skill files into
 * Copilot's custom-instructions path before the run; these should never end
 * up in the published prototype. Newer runs are filtered during copy; this
 * helper exists for the `bench repair` command so pre-fix prototypes get
 * cleaned without a rebuild.
 */
export async function stripLeakedGitHubDir(protoPath: string): Promise<boolean> {
  const ghPath = join(protoPath, ".github")
  if (!existsSync(ghPath)) return false
  await rm(ghPath, { recursive: true, force: true })
  return true
}

/**
 * Detect if a prototype is a single-page app (React/Vue/Next client router)
 * and inject a fallback script so the router matches "/" in an iframe.
 *
 * Detection: the prototype has one index.html containing a mount div
 * (id="root"|"app"|"__next"), no other .html files (excluding meta files),
 * and at least one .js file in an assets/ directory.
 *
 * The injected script only fires inside iframes (`window.self !== window.top`)
 * so the prototype still works when opened in a new tab.
 */
export async function injectSpaFallbackIfNeeded(protoPath: string): Promise<boolean> {
  const indexPath = join(protoPath, "index.html")
  if (!existsSync(indexPath)) return false

  const html = await readFile(indexPath, "utf8")

  // Check for SPA mount points
  const hasMountDiv = /id="(root|app|__next)"/.test(html)
  if (!hasMountDiv) return false

  // Check no other .html files (session.md is .md, meta.json is .json)
  const htmlFiles = await walkFiles(protoPath, (p) =>
    p.endsWith(".html") && basename(p) !== "index.html",
  )
  if (htmlFiles.length > 0) return false

  // Check there's a JS bundle in assets/
  const assetsDir = join(protoPath, "assets")
  if (!existsSync(assetsDir)) return false
  const jsFiles = await walkFiles(assetsDir, (p) => p.endsWith(".js"))
  if (jsFiles.length === 0) return false

  // Idempotency: skip if already injected
  const MARKER = "SPA iframe fallback"
  if (html.includes(MARKER)) return false

  // Two-part injection:
  //
  //   1. <base href="./"> — pins CSS/JS/font relative URL resolution to the
  //      original page directory, permanently. Without this, the replaceState
  //      in step 2 changes document.baseURI to "/" and breaks all relative
  //      asset references (./assets/foo.css resolves to /assets/foo.css → 404).
  //
  //   2. <script> history.replaceState → "/" — makes React Router (and other
  //      client-side routers) see window.location.pathname as "/" so the root
  //      route matches. Only fires in iframes.
  //
  // The <base> tag does NOT affect absolute URLs ("/foo") or programmatic
  // navigation, so React Router's <Link to="/page"> still works normally.
  const fallback = [
    `<base href="./">`,
    `<script>/* ${MARKER} */if(window.self!==window.top)history.replaceState(null,"","/");</script>`,
  ].join("\n")
  const injected = html.replace(/<head>/i, `<head>\n${fallback}`)
  if (injected === html) return false // no <head> found — unlikely but safe

  await writeFile(indexPath, injected)
  return true
}

async function walkFiles(
  root: string,
  predicate: (path: string) => boolean,
): Promise<string[]> {
  const results: string[] = []
  const stack = [root]
  while (stack.length > 0) {
    const current = stack.pop()!
    let entries: Dirent[]
    try {
      entries = (await readdir(current, { withFileTypes: true })) as Dirent[]
    } catch {
      continue
    }
    for (const entry of entries) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(full)
      } else if (entry.isFile() && predicate(full)) {
        results.push(full)
      }
    }
  }
  return results
}

function hashPrompt(prompt: string): string {
  return createHash("sha256").update(prompt.trim()).digest("hex").slice(0, 16)
}

async function runShell(
  cmd: string,
  args: string[],
  cwd: string,
  verbose?: boolean,
): Promise<void> {
  await new Promise<void>((res, rej) => {
    const proc = spawn(cmd, args, {
      cwd,
      stdio: verbose ? "inherit" : ["ignore", "ignore", "pipe"],
    })
    let stderr = ""
    if (proc.stderr) {
      proc.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString("utf8")
      })
    }
    proc.on("error", (err) => rej(err))
    proc.on("close", (code) => {
      if (code === 0) res()
      else rej(new Error(`${cmd} ${args.join(" ")} exited with code ${code}\n${stderr}`))
    })
  })
}

function log(verbose: boolean | undefined, msg: string): void {
  if (verbose) console.log(msg)
}

interface DetectedProject {
  /** Absolute path to the project root. May be the workdir itself. */
  root: string
  /** "package" if package.json was found (buildable), "static" if just index.html. */
  type: "package" | "static"
}

/**
 * Walk the workdir (breadth-first) and return the shallowest project we can
 * publish. Prefers package.json over index.html because a package.json run
 * through `bun run build` produces a cleaner artifact than raw files.
 *
 * Skips node_modules, .git, .github (runner-injected), logs, and the runner's
 * own capture files (copilot-*) so we don't accidentally pick noise.
 */
async function detectProjectRoot(workdir: string): Promise<DetectedProject | undefined> {
  const SKIP_DIRS = new Set([
    "node_modules",
    ".git",
    ".github",
    "logs",
    ".cache",
    ".vite",
    ".astro",
  ])
  const SKIP_FILES = new Set([
    "copilot-stdout.jsonl",
    "copilot-stderr.log",
    "copilot-session.md",
    ".DS_Store",
  ])

  // BFS, tracking depth so we can return the shallowest hit.
  const queue: Array<{ dir: string; depth: number }> = [{ dir: workdir, depth: 0 }]
  let bestPackage: { dir: string; depth: number } | undefined
  let bestStatic: { dir: string; depth: number } | undefined

  while (queue.length > 0) {
    const { dir, depth } = queue.shift()!
    // If we've already found a package.json at a shallower depth, we're done.
    if (bestPackage && depth > bestPackage.depth) break

    let entries: Dirent[]
    try {
      entries = (await readdir(dir, { withFileTypes: true })) as Dirent[]
    } catch {
      continue
    }

    // Check the files in THIS directory first.
    const fileNames = new Set(entries.filter((e) => e.isFile()).map((e) => e.name))
    if (fileNames.has("package.json") && !SKIP_FILES.has("package.json")) {
      if (!bestPackage || depth < bestPackage.depth) {
        bestPackage = { dir, depth }
      }
    }
    if (fileNames.has("index.html") && (!bestStatic || depth < bestStatic.depth)) {
      bestStatic = { dir, depth }
    }

    // Enqueue child directories unless we already have a package.json at a
    // shallower depth (in which case there's no point going deeper).
    if (!bestPackage || depth + 1 <= bestPackage.depth) {
      for (const entry of entries) {
        if (!entry.isDirectory()) continue
        if (SKIP_DIRS.has(entry.name)) continue
        queue.push({ dir: join(dir, entry.name), depth: depth + 1 })
      }
    }
  }

  // Prefer package.json over index.html at any depth — it's a richer project
  // shape. A static index.html inside e.g. a Vite public/ would be a false
  // positive, but the package.json at the root would shadow it.
  if (bestPackage) return { root: bestPackage.dir, type: "package" }
  if (bestStatic) return { root: bestStatic.dir, type: "static" }
  return undefined
}
