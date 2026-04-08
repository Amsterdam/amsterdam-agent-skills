/**
 * `bench matrix <id>` — run every variant declared in benchmark.yaml.
 *
 * Sequential by design — Copilot runs are token-expensive and can hit
 * rate limits when fanned out in parallel. Bumps to parallelism (with a
 * --concurrency flag) can be added later if it ever becomes worth it.
 */

import { parseArgs, getList } from "../args.ts"
import { loadBenchmark } from "../definition.ts"
import { runCommand } from "./run.ts"

export async function matrixCommand(argv: string[]): Promise<number> {
  const args = parseArgs(argv)
  const idOrSlug = args.positional[0]
  if (!idOrSlug) {
    console.error("usage: bench matrix <id-or-slug> [--skip <variant-id>...] [--only <variant-id>...]")
    return 1
  }

  const { def } = loadBenchmark(idOrSlug)
  const skip = new Set(getList(args, "skip"))
  const only = new Set(getList(args, "only"))

  const variants = def.variants.filter((v) => {
    if (only.size > 0 && !only.has(v.id)) return false
    if (skip.has(v.id)) return false
    return true
  })

  if (variants.length === 0) {
    console.error("No variants matched. Use 'bench list' to see all variants.")
    return 1
  }

  console.log(`▶ Matrix run for ${def.id} — ${def.name}: ${variants.length} variant(s)\n`)

  let failures = 0
  for (const variant of variants) {
    console.log("─".repeat(72))
    const code = await runCommand([idOrSlug, "--variant", variant.id, ...passthrough(args)])
    if (code !== 0) failures++
    console.log("")
  }

  console.log("─".repeat(72))
  console.log(`Matrix complete: ${variants.length - failures}/${variants.length} succeeded`)
  return failures === 0 ? 0 : 1
}

function passthrough(args: ReturnType<typeof parseArgs>): string[] {
  // Forward --verbose / --keep-workdir to each individual run.
  const out: string[] = []
  if (args.flags["verbose"] === true) out.push("--verbose")
  if (args.flags["keep-workdir"] === true) out.push("--keep-workdir")
  return out
}
