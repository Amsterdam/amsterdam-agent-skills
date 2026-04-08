#!/usr/bin/env bun
/**
 * bench — reproducible benchmark runner for Amsterdam agent skills.
 *
 * Subcommands:
 *   bench run <id> --variant <variant-id>  Build one prototype
 *   bench matrix <id>                       Build every variant in benchmark.yaml
 *   bench judge <id> [--variant <id>]       Score prototypes with the LLM judge
 *   bench manifest                          Regenerate benchmarks/benchmarks.json
 *   bench list                              List all benchmarks and their variants
 *
 * All commands operate on a benchmark identified by either its numeric id
 * ("001") or its slug ("zuidas-landing-page"). The dispatch is deliberately
 * tiny — argument parsing lives inline so the CLI has zero runtime deps
 * beyond `yaml`.
 */

import { runCommand } from "./commands/run.ts"
import { matrixCommand } from "./commands/matrix.ts"
import { judgeCommand } from "./commands/judge.ts"
import { manifestCommand } from "./commands/manifest.ts"
import { listCommand } from "./commands/list.ts"

const HELP = `bench — Amsterdam agent skill benchmark runner

USAGE
  bench <command> [options]

COMMANDS
  run <id>                Build one prototype for a benchmark
    --variant <id>          Variant id from benchmark.yaml (required)
    --workdir <path>        Override scratch directory (default: tmp)
    --keep-workdir          Don't delete the scratch dir on success
    --dry-run               Print what would happen without invoking copilot

  matrix <id>             Build every variant declared in benchmark.yaml
    --skip <variant-id>     Skip a specific variant (can repeat)
    --only <variant-id>     Only run a specific variant (can repeat)

  judge <id>              Score prototypes with the LLM judge
    --variant <id>          Score one variant only (default: all)
    --model <model>         Override the model used for scoring

  manifest                Regenerate benchmarks/benchmarks.json from disk

  list                    List all benchmarks and their declared variants

GLOBAL OPTIONS
  -h, --help              Show this help and exit
  -v, --version           Print version and exit

EXAMPLES
  bench run 001 --variant copilot_claude-opus-4-6_amsterdam
  bench matrix 001 --skip copilot_claude-opus-4-6_default
  bench judge 001
  bench manifest
`

async function main(): Promise<number> {
  const argv = Bun.argv.slice(2)
  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
    console.log(HELP)
    return 0
  }
  if (argv[0] === "-v" || argv[0] === "--version") {
    const pkg = await import("../package.json", { with: { type: "json" } })
    console.log(`bench ${pkg.default.version}`)
    return 0
  }

  const [command, ...rest] = argv
  switch (command) {
    case "run":
      return runCommand(rest)
    case "matrix":
      return matrixCommand(rest)
    case "judge":
      return judgeCommand(rest)
    case "manifest":
      return manifestCommand(rest)
    case "list":
      return listCommand(rest)
    default:
      console.error(`Unknown command: ${command}\n`)
      console.error(HELP)
      return 1
  }
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    console.error("Error:", err instanceof Error ? err.message : err)
    if (err instanceof Error && err.stack && process.env.DEBUG) {
      console.error(err.stack)
    }
    process.exit(1)
  })
