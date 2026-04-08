/**
 * `bench manifest` — regenerate benchmarks/benchmarks.json from disk.
 *
 * The manifest is the single source of truth the Astro showcase reads at
 * build time. We rebuild it from the on-disk state every time so the showcase
 * never drifts from reality.
 *
 * Walks every benchmark directory, reads its benchmark.yaml, then collects
 * all prototype meta.json files plus any legacy screenshot files.
 */

import { readFile, writeFile, readdir, stat } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { benchmarksDir, manifestPath, prototypeDir } from "../paths.ts"
import { loadBenchmark } from "../definition.ts"
import type {
  Manifest,
  ManifestBenchmark,
  PrototypeMeta,
  LegacyScreenshot,
} from "../types/manifest.ts"

const SCREENSHOT_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"]

export async function manifestCommand(_argv: string[]): Promise<number> {
  const result = await rebuildManifest()
  console.log(`✓ Wrote ${manifestPath}`)
  console.log(
    `  ${result.benchmarks.length} benchmark(s), ` +
      `${result.benchmarks.reduce((n, b) => n + b.prototypes.length, 0)} prototype(s)`,
  )
  return 0
}

/**
 * Programmatic API for the run command and other callers — rebuilds the
 * manifest and returns it without printing.
 */
export async function rebuildManifest(): Promise<Manifest> {
  const benchmarkDirNames = (await readdir(benchmarksDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && existsSync(join(benchmarksDir, e.name, "benchmark.yaml")))
    .map((e) => e.name)
    .sort()

  const benchmarks: ManifestBenchmark[] = []
  for (const dirName of benchmarkDirNames) {
    const { def } = loadBenchmark(dirName)

    // Collect prototypes (each subdir under prototypes/ with a meta.json)
    const protosRoot = join(benchmarksDir, dirName, "prototypes")
    const prototypes: PrototypeMeta[] = []
    if (existsSync(protosRoot)) {
      const variantDirs = (await readdir(protosRoot, { withFileTypes: true })).filter((e) =>
        e.isDirectory(),
      )
      for (const vd of variantDirs) {
        const metaPath = join(protosRoot, vd.name, "meta.json")
        if (!existsSync(metaPath)) continue
        try {
          const meta = JSON.parse(await readFile(metaPath, "utf8")) as PrototypeMeta
          prototypes.push(meta)
        } catch (err) {
          console.warn(
            `  ! Failed to parse ${metaPath}: ${err instanceof Error ? err.message : err}`,
          )
        }
      }
      // Stable order: match the order variants are declared in benchmark.yaml,
      // then anything unknown sorted alphabetically.
      const variantIndex = new Map(def.variants.map((v, i) => [v.id, i]))
      prototypes.sort((a, b) => {
        const ai = variantIndex.get(a.variantId) ?? Infinity
        const bi = variantIndex.get(b.variantId) ?? Infinity
        if (ai !== bi) return ai - bi
        return a.variantId.localeCompare(b.variantId)
      })
    }

    // Collect legacy screenshots
    const legacyDir = join(benchmarksDir, dirName, "legacy-screenshots")
    let legacyScreenshots: LegacyScreenshot[] | undefined
    if (existsSync(legacyDir) && (await stat(legacyDir)).isDirectory()) {
      const files = await readdir(legacyDir)
      const matches = files
        .filter((f) => SCREENSHOT_EXTS.some((ext) => f.toLowerCase().endsWith(ext)))
        .sort()
      if (matches.length > 0) {
        legacyScreenshots = matches.map((f) => ({
          variantLabel: prettifyScreenshotName(f),
          path: `legacy-screenshots/${f}`,
        }))
      }
    }

    benchmarks.push({
      definition: def,
      prototypes,
      legacyScreenshots,
    })
  }

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    version: 1,
    benchmarks,
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  return manifest
}

function prettifyScreenshotName(filename: string): string {
  // "amsterdam-skills.png" → "Amsterdam skills"
  // "default-skills-pass2.png" → "Default skills (pass 2)"
  const stem = filename.replace(/\.[^.]+$/, "")
  const cleaned = stem.replace(/-pass(\d+)/, " (pass $1)").replace(/-/g, " ")
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}
