/**
 * `bench run <id> --variant <variant-id>` — build a single prototype.
 *
 * 1. Load benchmark.yaml + pick the variant.
 * 2. Create a fresh scratch workdir under the OS temp dir (or --workdir).
 * 3. Populate .github/instructions/ via skills.ts.
 * 4. Invoke copilot via runCopilot().
 * 5. Hand off to postProcess() to publish the prototype + meta.json.
 */

import { mkdir, mkdtemp, rm, readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { parseArgs, getString, getBool } from "../args.ts"
import { loadBenchmark, pickVariant } from "../definition.ts"
import { loadSkills } from "../skills.ts"
import { runCopilot } from "../runners/copilot.ts"
import { postProcess } from "../postprocess.ts"

/** Print the last N lines of a log file, indented, if it has any content. */
async function printLogTail(label: string, path: string, lines = 8): Promise<void> {
  if (!existsSync(path)) return
  try {
    const content = await readFile(path, "utf8")
    const trimmed = content.trim()
    if (!trimmed) return
    const tail = trimmed.split("\n").slice(-lines).join("\n")
    console.error(`  ── ${label} (${path}) ──`)
    for (const line of tail.split("\n")) {
      console.error(`     ${line}`)
    }
  } catch {
    // Best-effort — never crash the runner over a log read.
  }
}

export async function runCommand(argv: string[]): Promise<number> {
  const args = parseArgs(argv)
  const idOrSlug = args.positional[0]
  if (!idOrSlug) {
    console.error("usage: bench run <id-or-slug> --variant <variant-id> [--workdir <path>] [--keep-workdir] [--dry-run] [--verbose]")
    return 1
  }
  const variantId = getString(args, "variant")
  if (!variantId) {
    console.error("error: --variant is required")
    console.error("       (use 'bench list' to see all variants for this benchmark)")
    return 1
  }
  const customWorkdir = getString(args, "workdir")
  const keepWorkdir = getBool(args, "keep-workdir")
  const dryRun = getBool(args, "dry-run")
  const verbose = getBool(args, "verbose")

  const { def } = loadBenchmark(idOrSlug)
  const variant = pickVariant(def, variantId)

  console.log(`▶ Benchmark   ${def.id} — ${def.name}`)
  console.log(`  Variant     ${variant.id}`)
  console.log(`  Agent       ${variant.agent} · model ${variant.model} · skills ${variant.skills}`)

  if (dryRun) {
    console.log("  (dry-run — would invoke copilot here)")
    return 0
  }

  // Create the scratch workdir.
  let workdir: string
  if (customWorkdir) {
    workdir = resolve(customWorkdir)
    await mkdir(workdir, { recursive: true })
  } else {
    workdir = await mkdtemp(join(tmpdir(), `bench-${def.slug}-${variant.id}-`))
  }
  console.log(`  Workdir     ${workdir}`)

  let cleanup = !keepWorkdir
  try {
    // 1. Skills → .github/instructions/
    await loadSkills(workdir, variant.skills)

    // 2. Copilot
    // Wrap the benchmark prompt with a short runner instruction that ensures
    // the agent creates real files instead of outputting code blocks in its
    // response. This is NOT part of the benchmark prompt (which stays vague);
    // it's the runner's job to ensure all models produce comparable artifacts.
    const wrappedPrompt = [
      "IMPORTANT: You MUST create real files in this directory using your file editing and writing tools.",
      "Do NOT just output code blocks in your response — actually write the files to disk.",
      "Build a complete, runnable project that can be opened in a browser.",
      "",
      "---",
      "",
      def.prompt,
    ].join("\n")

    console.log(`  Invoking copilot...`)
    const runResult = await runCopilot({
      workdir,
      prompt: wrappedPrompt,
      model: variant.model,
      skills: variant.skills,
      effort: variant.effort,
      verbose,
    })
    console.log(
      `  copilot exited ${runResult.exitCode} after ${(runResult.durationMs / 1000).toFixed(1)}s` +
        (runResult.tokens?.total ? ` (${runResult.tokens.total} tokens)` : ""),
    )
    if (runResult.exitCode !== 0) {
      console.error("  ✘ copilot failed — leaving workdir for inspection")
      // Surface stderr and the last few JSONL events automatically so you
      // don't have to go fishing through the workdir on every failure.
      await printLogTail("stderr", join(workdir, "copilot-stderr.log"))
      await printLogTail("stdout (last events)", join(workdir, "copilot-stdout.jsonl"), 4)
      cleanup = false
      return runResult.exitCode
    }

    // 3. Post-process → benchmarks/{slug}/prototypes/{variant.id}/
    const post = await postProcess({
      workdir,
      benchmark: def,
      variant,
      runResult,
      cleanWorkdir: false, // we handle cleanup at the end
      verbose,
    })
    console.log(`  ✓ Prototype  ${post.prototypePath}`)
    console.log(`    Build kind ${post.kind}`)

    // Refresh the manifest so the showcase picks this up immediately.
    const { rebuildManifest } = await import("./manifest.ts")
    await rebuildManifest()
    console.log(`    Manifest refreshed.`)
    return 0
  } catch (err) {
    cleanup = false // keep workdir on error for debugging
    if (err instanceof Error) console.error(`  ✘ ${err.message}`)
    else console.error(`  ✘ ${String(err)}`)
    return 1
  } finally {
    if (cleanup && !customWorkdir && existsSync(workdir)) {
      await rm(workdir, { recursive: true, force: true })
    } else if (!cleanup) {
      console.log(`  (workdir preserved at ${workdir})`)
    }
  }
}
