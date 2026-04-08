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

import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile, cp, rm, readdir } from "node:fs/promises"
import { join, basename } from "node:path"
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
  const pkgJsonPath = join(workdir, "package.json")
  const hasPkgJson = existsSync(pkgJsonPath)
  const hasIndexHtml = existsSync(join(workdir, "index.html"))

  let kind: PostProcessResult["kind"] = "unknown-built"
  let sourceDir = workdir // what we copy from after build

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
      await runShell("bun", ["install"], workdir, verbose)
      await runShell("bun", ["run", "build"], workdir, verbose)
    } else {
      throw new Error(
        `Detected package.json in ${workdir} but no "build" script. Cannot publish.`,
      )
    }

    // Find which build dir actually exists.
    let foundBuildDir: string | undefined
    for (const candidate of KNOWN_BUILD_DIRS) {
      if (existsSync(join(workdir, candidate))) {
        foundBuildDir = candidate
        break
      }
    }
    if (!foundBuildDir) {
      throw new Error(
        `Build completed but none of ${KNOWN_BUILD_DIRS.join(", ")} were created in ${workdir}`,
      )
    }
    sourceDir = join(workdir, foundBuildDir)
  } else if (hasIndexHtml) {
    kind = "static"
    log(verbose, `→ Detected static HTML output, copying as-is`)
    sourceDir = workdir
  } else {
    throw new Error(
      `Workdir ${workdir} has neither package.json nor index.html — agent produced nothing publishable`,
    )
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
 * Copy a tree but skip noisy stuff: node_modules, .git, source maps, .DS_Store.
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
      if (name === ".cache") return false
      if (name === ".vite") return false
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
