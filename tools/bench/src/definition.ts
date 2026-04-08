/**
 * Load and validate benchmark.yaml files.
 *
 * Validation is lightweight (shape + required fields) — full schema validation
 * is the runner's contract with the YAML, not a generic JSON-schema dance.
 */

import { readFileSync } from "node:fs"
import { join, basename } from "node:path"
import { parse } from "yaml"
import type { BenchmarkDefinition, VariantDefinition } from "./types/manifest.ts"
import { resolveBenchmarkPath } from "./paths.ts"

export interface LoadedBenchmark {
  /** Absolute path to the benchmark directory. */
  dir: string
  /** Definition parsed from benchmark.yaml. */
  def: BenchmarkDefinition
}

export function loadBenchmark(idOrSlug: string): LoadedBenchmark {
  const dir = resolveBenchmarkPath(idOrSlug)
  const yamlPath = join(dir, "benchmark.yaml")
  const raw = readFileSync(yamlPath, "utf8")
  const def = parse(raw) as BenchmarkDefinition

  if (!def || typeof def !== "object") {
    throw new Error(`benchmark.yaml at ${yamlPath} is not a valid object`)
  }
  for (const required of ["id", "slug", "name", "prompt", "variants", "rubric"] as const) {
    if (!(required in def)) {
      throw new Error(`benchmark.yaml at ${yamlPath} is missing required field '${required}'`)
    }
  }
  // Directory naming convention: "NNN-slug" (e.g. "001-zuidas-landing-page").
  // The slug in benchmark.yaml is the part after the numeric prefix.
  const dirName = basename(dir)
  const expectedSlug = dirName.replace(/^\d+-/, "")
  if (def.slug !== expectedSlug) {
    throw new Error(
      `benchmark.yaml slug '${def.slug}' does not match expected slug '${expectedSlug}' (from directory '${dirName}')`,
    )
  }
  if (!Array.isArray(def.variants) || def.variants.length === 0) {
    throw new Error(`benchmark.yaml at ${yamlPath} must declare at least one variant`)
  }

  return { dir, def }
}

/** Find a variant by id, throwing a helpful error listing all known ids. */
export function pickVariant(
  def: BenchmarkDefinition,
  variantId: string,
): VariantDefinition {
  const found = def.variants.find((v) => v.id === variantId)
  if (!found) {
    const known = def.variants.map((v) => v.id).join("\n  - ")
    throw new Error(
      `Variant '${variantId}' not found in benchmark '${def.slug}'.\nKnown variants:\n  - ${known}`,
    )
  }
  return found
}
