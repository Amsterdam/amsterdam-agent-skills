/**
 * Tiny inline arg parser. Subset of yargs/commander semantics, zero deps.
 *
 * Supports: positional args, --flag, --flag=value, --flag value, repeatable flags.
 * Long flags only — short flags would conflict with the various --foo options.
 */

export interface ParsedArgs {
  positional: string[]
  flags: Record<string, string | boolean | string[]>
}

export function parseArgs(argv: string[]): ParsedArgs {
  const positional: string[] = []
  const flags: Record<string, string | boolean | string[]> = {}

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!
    if (arg.startsWith("--")) {
      const eqIdx = arg.indexOf("=")
      let name: string
      let value: string | boolean
      if (eqIdx >= 0) {
        name = arg.slice(2, eqIdx)
        value = arg.slice(eqIdx + 1)
      } else {
        name = arg.slice(2)
        const next = argv[i + 1]
        if (next !== undefined && !next.startsWith("--")) {
          value = next
          i++
        } else {
          value = true
        }
      }
      const existing = flags[name]
      if (existing === undefined) {
        flags[name] = value
      } else if (Array.isArray(existing)) {
        if (typeof value === "string") existing.push(value)
      } else if (typeof existing === "string" && typeof value === "string") {
        flags[name] = [existing, value]
      } else {
        flags[name] = value
      }
    } else {
      positional.push(arg)
    }
  }

  return { positional, flags }
}

export function getString(args: ParsedArgs, name: string): string | undefined {
  const v = args.flags[name]
  return typeof v === "string" ? v : undefined
}

export function getBool(args: ParsedArgs, name: string): boolean {
  return args.flags[name] === true
}

export function getList(args: ParsedArgs, name: string): string[] {
  const v = args.flags[name]
  if (v === undefined) return []
  if (Array.isArray(v)) return v
  if (typeof v === "string") return [v]
  return []
}
