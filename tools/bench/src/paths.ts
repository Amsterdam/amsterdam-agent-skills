/**
 * Single source of truth for filesystem paths.
 *
 * The bench CLI is invoked from various directories — VS Code task, repo root,
 * a CI worker — so all paths are derived from the repo root, which we find by
 * walking upward until we hit a `skills/` directory next to a `benchmarks/` one.
 */

import { existsSync, readdirSync } from "node:fs"
import { resolve, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

function findRepoRoot(start: string): string {
  let dir = start
  while (dir !== dirname(dir)) {
    if (
      existsSync(join(dir, "skills")) &&
      existsSync(join(dir, "benchmarks"))
    ) {
      return dir
    }
    dir = dirname(dir)
  }
  throw new Error(
    `Could not locate repo root above ${start}. Expected to find a directory with both 'skills/' and 'benchmarks/'.`,
  )
}

const here = dirname(fileURLToPath(import.meta.url))
export const repoRoot = findRepoRoot(here)
export const benchmarksDir = join(repoRoot, "benchmarks")
export const skillsDir = join(repoRoot, "skills")
export const manifestPath = join(benchmarksDir, "benchmarks.json")

/**
 * Resolve a benchmark directory by either:
 *   - the bare slug ("zuidas-landing-page"), matching "NNN-zuidas-landing-page"
 *   - the directory name ("001-zuidas-landing-page")
 *   - the numeric id ("001" or "1")
 */
export function benchmarkDir(slugOrIdOrDirName: string): string {
  return resolveBenchmarkPath(slugOrIdOrDirName)
}

export function prototypeDir(slugOrIdOrDirName: string, variantId: string): string {
  return join(benchmarkDir(slugOrIdOrDirName), "prototypes", variantId)
}

export function resolveBenchmarkPath(idOrSlug: string): string {
  // 1. Direct directory name match (e.g. "001-zuidas-landing-page")
  const direct = join(benchmarksDir, idOrSlug)
  if (existsSync(join(direct, "benchmark.yaml"))) return direct

  const dirs = readdirSync(benchmarksDir, { withFileTypes: true }).filter(
    (d) => d.isDirectory() && existsSync(join(benchmarksDir, d.name, "benchmark.yaml")),
  )

  // 2. Numeric id — match the leading "NNN-" prefix.
  if (/^\d+$/.test(idOrSlug)) {
    const padded = idOrSlug.padStart(3, "0")
    const numMatches = dirs
      .filter((d) => d.name.startsWith(`${padded}-`))
      .map((d) => join(benchmarksDir, d.name))
    if (numMatches.length === 1) return resolve(numMatches[0]!)
    if (numMatches.length > 1) {
      throw new Error(`Multiple benchmarks match id '${idOrSlug}': ${numMatches.join(", ")}`)
    }
  }

  // 3. Slug match — strip the "NNN-" prefix from each directory and compare.
  const slugMatches = dirs
    .filter((d) => d.name.replace(/^\d+-/, "") === idOrSlug)
    .map((d) => join(benchmarksDir, d.name))
  if (slugMatches.length === 1) return resolve(slugMatches[0]!)
  if (slugMatches.length > 1) {
    throw new Error(`Multiple benchmarks match slug '${idOrSlug}': ${slugMatches.join(", ")}`)
  }

  throw new Error(`No benchmark matching '${idOrSlug}' found in ${benchmarksDir}`)
}
