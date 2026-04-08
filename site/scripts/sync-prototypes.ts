#!/usr/bin/env bun
/**
 * Sync prototype bundles + legacy screenshots from benchmarks/ into
 * site/public/prototypes/ so Astro can serve them.
 *
 * IMPORTANT: source directories follow the "NNN-slug" convention on disk
 * (e.g. benchmarks/001-zuidas-landing-page/) but the manifest exposes URLs
 * by bare slug (zuidas-landing-page). This script writes to the SLUG path
 * so iframe URLs match the manifest.
 *
 * Run automatically before `astro build` and `astro dev` via the prebuild step
 * in package.json. Idempotent — wipes the public/prototypes/ directory each time
 * so removed prototypes don't linger.
 *
 * Layout produced:
 *
 *   site/public/prototypes/
 *   ├── zuidas-landing-page/                       <- bare slug, NOT 001-zuidas-landing-page
 *   │   ├── prototypes/
 *   │   │   ├── copilot_claude-opus-4-6_amsterdam/
 *   │   │   │   ├── index.html
 *   │   │   │   ├── assets/...
 *   │   │   │   └── meta.json
 *   │   │   └── ...
 *   │   └── legacy-screenshots/
 *   │       ├── no-skills.png
 *   │       └── ...
 *   └── ...
 *
 * The Astro pages reference these as /prototypes/{slug}/prototypes/{variant}/
 * and /prototypes/{slug}/legacy-screenshots/{file}.
 */

import { rm, mkdir, cp, readdir, readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "yaml"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, "..", "..")
const benchmarksDir = join(repoRoot, "benchmarks")
const targetRoot = join(repoRoot, "site", "public", "prototypes")

async function main(): Promise<void> {
  if (!existsSync(benchmarksDir)) {
    console.error(`benchmarks/ not found at ${benchmarksDir}`)
    process.exit(1)
  }

  console.log(`→ Wiping ${targetRoot}`)
  await rm(targetRoot, { recursive: true, force: true })
  await mkdir(targetRoot, { recursive: true })

  const benchmarkDirs = (await readdir(benchmarksDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory() && existsSync(join(benchmarksDir, e.name, "benchmark.yaml")))
    .map((e) => e.name)

  let prototypes = 0
  let screenshots = 0
  for (const dirName of benchmarkDirs) {
    const sourceDir = join(benchmarksDir, dirName)
    // Read the benchmark.yaml to get the bare slug — the destination uses
    // slug, not directory name, so URLs match the manifest.
    const yamlPath = join(sourceDir, "benchmark.yaml")
    const def = parse(await readFile(yamlPath, "utf8")) as { slug?: string }
    const slug = def.slug
    if (!slug) {
      console.warn(`  ! ${dirName}/benchmark.yaml has no slug field — skipping`)
      continue
    }
    const targetDir = join(targetRoot, slug)

    // Copy prototypes/
    const protosSrc = join(sourceDir, "prototypes")
    if (existsSync(protosSrc)) {
      const protosDest = join(targetDir, "prototypes")
      await mkdir(protosDest, { recursive: true })
      await cp(protosSrc, protosDest, { recursive: true, force: true })
      const variantCount = (await readdir(protosSrc, { withFileTypes: true })).filter((e) =>
        e.isDirectory(),
      ).length
      prototypes += variantCount
    }

    // Copy legacy-screenshots/
    const legacySrc = join(sourceDir, "legacy-screenshots")
    if (existsSync(legacySrc)) {
      const legacyDest = join(targetDir, "legacy-screenshots")
      await mkdir(legacyDest, { recursive: true })
      await cp(legacySrc, legacyDest, { recursive: true, force: true })
      const fileCount = (await readdir(legacySrc)).length
      screenshots += fileCount
    }
  }

  console.log(`✓ Synced ${prototypes} prototype(s) and ${screenshots} legacy screenshot(s) into ${targetRoot}`)
}

main().catch((err) => {
  console.error("sync-prototypes failed:", err)
  process.exit(1)
})
