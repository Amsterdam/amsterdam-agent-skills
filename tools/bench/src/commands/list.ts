/**
 * `bench list` — list all benchmarks and their variants.
 *
 * Reads disk (not the manifest) so newly-added benchmarks show up immediately
 * without needing a manifest rebuild.
 */

import { readdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { benchmarksDir, prototypeDir } from "../paths.ts"
import { loadBenchmark } from "../definition.ts"

export async function listCommand(_argv: string[]): Promise<number> {
  const entries = await readdir(benchmarksDir, { withFileTypes: true })
  const benchmarkDirs = entries
    .filter((e) => e.isDirectory() && existsSync(join(benchmarksDir, e.name, "benchmark.yaml")))
    .map((e) => e.name)
    .sort()

  if (benchmarkDirs.length === 0) {
    console.log("No benchmarks found.")
    return 0
  }

  for (const dir of benchmarkDirs) {
    const { def } = loadBenchmark(dir)
    console.log(`\n${def.id}  ${def.name}  (${def.difficulty})`)
    console.log(`     slug: ${def.slug}`)
    console.log(`     skills tested: ${def.skillsTested.join(", ")}`)
    console.log(`     variants:`)
    for (const v of def.variants) {
      const built = existsSync(join(prototypeDir(def.slug, v.id), "meta.json"))
      const marker = built ? "✓" : " "
      console.log(`       ${marker} ${v.id.padEnd(40)}  ${v.label}`)
    }
  }
  console.log("\n(✓ = prototype built; run with `bench run <id> --variant <variant-id>`)")
  return 0
}
