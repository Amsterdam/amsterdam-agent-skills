/**
 * Read benchmarks/benchmarks.json at build time and expose typed helpers
 * for the Astro pages.
 *
 * Imports the type definitions DIRECTLY from tools/bench/src/types/manifest.ts
 * so the site and the runner share one source of truth.
 */

import { readFileSync, existsSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import type {
  Manifest,
  ManifestBenchmark,
  PrototypeMeta,
  RatingBand,
  VariantDefinition,
} from "../../../tools/bench/src/types/manifest.ts"

export type {
  Manifest,
  ManifestBenchmark,
  PrototypeMeta,
  RatingBand,
} from "../../../tools/bench/src/types/manifest.ts"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, "..", "..", "..")
const manifestPath = join(repoRoot, "benchmarks", "benchmarks.json")

let _manifest: Manifest | undefined

export function loadManifest(): Manifest {
  if (_manifest) return _manifest
  if (!existsSync(manifestPath)) {
    throw new Error(
      `Manifest not found at ${manifestPath}.\n` +
        `Run 'cd tools/bench && bun run src/cli.ts manifest' to generate it.`,
    )
  }
  _manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Manifest
  return _manifest
}

export function getBenchmark(slug: string): ManifestBenchmark {
  const m = loadManifest()
  const found = m.benchmarks.find((b) => b.definition.slug === slug)
  if (!found) throw new Error(`Benchmark '${slug}' not found in manifest`)
  return found
}

export function getAllBenchmarks(): ManifestBenchmark[] {
  return loadManifest().benchmarks
}

/**
 * Combine real prototypes and legacy screenshots into a single ordered list
 * of "displayables" the toolbar can cycle through. Real prototypes always
 * come first, in the order declared in benchmark.yaml.
 */
export interface DisplayItem {
  /** Stable identifier — used in URLs and as the cycle key. */
  id: string
  label: string
  /** "prototype" → iframable; "screenshot" → static image. */
  kind: "prototype" | "screenshot"
  /** URL relative to the base path, ready to drop into <iframe src> or <img src>. */
  url: string
  /** Best-available metadata. May be very sparse for legacy screenshots. */
  meta: PrototypeMeta | undefined
  /** Score color band, computed from the rubric ratings. May be undefined. */
  rating?: RatingBand
}

export function getDisplayItems(b: ManifestBenchmark): DisplayItem[] {
  const items: DisplayItem[] = []
  const slug = b.definition.slug

  for (const proto of b.prototypes) {
    items.push({
      id: proto.variantId,
      label: proto.variantLabel,
      kind: "prototype",
      url: `prototypes/${slug}/prototypes/${proto.variantId}/${proto.entry}`,
      meta: proto,
      rating: proto.score
        ? findRating(proto.score.total, b.definition.ratings)
        : undefined,
    })
  }

  if (b.legacyScreenshots) {
    for (const s of b.legacyScreenshots) {
      items.push({
        id: `legacy-${s.path.replace(/[^a-z0-9]/gi, "-")}`,
        label: `${s.variantLabel} (legacy screenshot)`,
        kind: "screenshot",
        url: `prototypes/${slug}/${s.path}`,
        meta: undefined,
      })
    }
  }

  return items
}

function findRating(total: number, ratings: RatingBand[]): RatingBand | undefined {
  return ratings.find((r) => total >= r.min && total <= r.max)
}

/**
 * Build a `prev` / `next` map for cycling within a single benchmark.
 * Wraps around at the ends.
 */
export interface CycleNeighbors {
  prev: DisplayItem
  next: DisplayItem
}

export function neighborsFor(
  items: DisplayItem[],
  currentId: string,
): CycleNeighbors {
  if (items.length === 0) throw new Error("No items to cycle through")
  const idx = items.findIndex((i) => i.id === currentId)
  if (idx === -1) throw new Error(`Item '${currentId}' not found`)
  const prevIdx = (idx - 1 + items.length) % items.length
  const nextIdx = (idx + 1) % items.length
  return { prev: items[prevIdx]!, next: items[nextIdx]! }
}
