/**
 * `bench repair <id> [--variant <variant-id>]`
 *
 * Fix existing published prototypes in-place without re-running Copilot:
 *
 *   1. Remove `.github/` directories that leaked from the runner's skill
 *      injection into the published output. (Fixed in copyTreeFiltered for
 *      new runs; this repairs older prototypes.)
 *
 *   2. Rewrite absolute asset paths to relative in HTML and CSS so Vite/
 *      Next/CRA builds work when iframed at a nested URL.
 *
 * No Copilot tokens spent. Instant fix.
 */

import { readdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { parseArgs, getString } from "../args.ts"
import { loadBenchmark } from "../definition.ts"
import { prototypeDir } from "../paths.ts"
import {
  rewriteAbsolutePathsInPrototype,
  stripLeakedGitHubDir,
  injectSpaFallbackIfNeeded,
} from "../postprocess.ts"
import { rebuildManifest } from "./manifest.ts"

export async function repairCommand(argv: string[]): Promise<number> {
  const args = parseArgs(argv)
  const idOrSlug = args.positional[0]
  if (!idOrSlug) {
    console.error("usage: bench repair <id-or-slug> [--variant <variant-id>]")
    return 1
  }
  const onlyVariant = getString(args, "variant")

  const { def } = loadBenchmark(idOrSlug)
  const targets = onlyVariant ? def.variants.filter((v) => v.id === onlyVariant) : def.variants

  let repaired = 0
  let skipped = 0
  for (const variant of targets) {
    const protoPath = prototypeDir(def.slug, variant.id)
    if (!existsSync(join(protoPath, "meta.json"))) {
      skipped++
      continue
    }

    let changed = false

    // 1. Strip leaked .github/
    const stripped = await stripLeakedGitHubDir(protoPath)
    if (stripped) {
      console.log(`  ✓ ${variant.id}: removed leaked .github/`)
      changed = true
    }

    // 2. Rewrite absolute → relative in HTML + CSS (depth-aware for assets/)
    const filesRewritten = await rewriteAbsolutePathsInPrototype(protoPath)
    if (filesRewritten > 0) {
      console.log(`  ✓ ${variant.id}: rewrote asset paths in ${filesRewritten} file(s)`)
      changed = true
    }

    // 3. Inject SPA fallback for React Router / client-side router apps
    const spaInjected = await injectSpaFallbackIfNeeded(protoPath)
    if (spaInjected) {
      console.log(`  ✓ ${variant.id}: injected SPA iframe fallback`)
      changed = true
    }

    if (changed) {
      repaired++
    } else {
      console.log(`  · ${variant.id}: already clean`)
    }
  }

  if (repaired > 0) {
    await rebuildManifest()
    console.log(`\nManifest refreshed. Rebuild the site to see the fix:`)
    console.log(`  cd ../../site && bun run build && bun run preview`)
  }
  console.log(`\nDone: ${repaired} repaired, ${skipped} skipped (no prototype)`)
  return 0
}
