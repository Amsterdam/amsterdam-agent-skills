/**
 * `bench judge <id> [--variant <id>] [--model <model>]`
 *
 * Score one or more prototypes against the benchmark's rubric using an LLM
 * via the same `copilot` CLI we use for runs. Cheap and zero new dependencies.
 *
 * The judge process:
 *   1. Takes a Playwright screenshot of the rendered prototype (visual ground truth).
 *   2. Reads the session.md transcript (full source code) or index.html as fallback.
 *   3. Builds a prompt with the rubric, the artifact text, and a reference to
 *      the screenshot file in the copilot workdir.
 *   4. Asks Copilot to score each criterion 0|1|2 with a one-line note,
 *      returning STRICT JSON in a fenced code block. Screenshot is ground truth:
 *      unstyled-but-present components score 1 (partial), not 2 (correct).
 *   5. Parses the JSON, totals it, writes back into meta.json under `score`.
 *
 * Scores are advisory. A human reviewer can override them via PR.
 */

import { spawn } from "node:child_process"
import { mkdtemp, readFile, writeFile, rm, cp } from "node:fs/promises"
import { existsSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createHash } from "node:crypto"
import { parseArgs, getString } from "../args.ts"
import { loadBenchmark } from "../definition.ts"
import { prototypeDir } from "../paths.ts"
import { rebuildManifest } from "./manifest.ts"
import { takeScreenshot } from "../screenshot.ts"
import type {
  PrototypeMeta,
  PrototypeScore,
  RubricCategory,
  CriterionScore,
  BenchmarkDefinition,
} from "../types/manifest.ts"

const DEFAULT_JUDGE_MODEL = "claude-opus-4.6"

export async function judgeCommand(argv: string[]): Promise<number> {
  const args = parseArgs(argv)
  const idOrSlug = args.positional[0]
  if (!idOrSlug) {
    console.error("usage: bench judge <id-or-slug> [--variant <variant-id>] [--model <model>]")
    return 1
  }
  const onlyVariant = getString(args, "variant")
  const judgeModel = getString(args, "model") ?? DEFAULT_JUDGE_MODEL

  const { def } = loadBenchmark(idOrSlug)
  const targets = onlyVariant ? def.variants.filter((v) => v.id === onlyVariant) : def.variants
  if (targets.length === 0) {
    console.error(`No variants matched ${onlyVariant ?? "(any)"}`)
    return 1
  }

  let scored = 0
  let skipped = 0
  for (const variant of targets) {
    const protoPath = prototypeDir(def.slug, variant.id)
    const metaPath = join(protoPath, "meta.json")
    if (!existsSync(metaPath)) {
      console.log(`  - ${variant.id}: no prototype yet, skipping`)
      skipped++
      continue
    }
    console.log(`▶ Scoring ${variant.id} with ${judgeModel}...`)
    const meta = JSON.parse(await readFile(metaPath, "utf8")) as PrototypeMeta

    // Take a screenshot for visual judging (best-effort — skip if Playwright fails).
    let screenshotPath: string | undefined
    try {
      console.log(`  📸 Taking screenshot...`)
      const result = await takeScreenshot({ prototypePath: protoPath })
      screenshotPath = result.path
      console.log(`  📸 Screenshot saved`)
    } catch (err) {
      console.warn(`  ⚠ Screenshot failed (${err instanceof Error ? err.message : err}) — judging from source only`)
    }

    try {
      const score = await scorePrototype({
        benchmark: def,
        prototypePath: protoPath,
        judgeModel,
        screenshotPath,
      })
      meta.score = score
      await writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n")
      console.log(`  ✓ ${variant.id}: ${score.total}/${score.max}`)
      scored++
    } catch (err) {
      console.error(`  ✘ ${variant.id}: ${err instanceof Error ? err.message : err}`)
    }
  }

  if (scored > 0) {
    await rebuildManifest()
    console.log(`Manifest refreshed.`)
  }
  console.log(`\nDone: ${scored} scored, ${skipped} skipped`)
  return 0
}

interface ScoreOptions {
  benchmark: BenchmarkDefinition
  prototypePath: string
  judgeModel: string
  screenshotPath?: string
}

async function scorePrototype(opts: ScoreOptions): Promise<PrototypeScore> {
  const { benchmark, prototypePath, judgeModel, screenshotPath } = opts

  // For SPA builds (React/Vue/Next), index.html is just `<div id="root">`
  // with no visible content — useless for scoring. The session transcript
  // (session.md) contains the FULL unminified source code the agent wrote,
  // which is what a human reviewer would actually look at. Use session.md
  // as the primary scoring artifact, with index.html as a fallback for
  // static HTML prototypes.
  const sessionPath = join(prototypePath, "session.md")
  const indexPath = join(prototypePath, "index.html")

  let artifactContent: string
  let artifactLabel: string
  if (existsSync(sessionPath)) {
    artifactContent = await readFile(sessionPath, "utf8")
    artifactLabel = "Agent session transcript (contains all source code written)"
  } else if (existsSync(indexPath)) {
    artifactContent = await readFile(indexPath, "utf8")
    artifactLabel = "Rendered HTML"
  } else {
    throw new Error(`No session.md or index.html at ${prototypePath}`)
  }

  // Build the rubric prompt.
  const rubricLines: string[] = []
  for (const [catId, cat] of Object.entries(benchmark.rubric)) {
    rubricLines.push(`### ${cat.label} (max ${cat.max})`)
    for (const c of cat.criteria) {
      rubricLines.push(`- [${catId}.${c.id}] ${c.label}  (max ${c.max})`)
    }
  }
  const rubricBlock = rubricLines.join("\n")

  // Build the visual scoring instruction if we have a screenshot.
  const visualBlock = screenshotPath
    ? [
        ``,
        `## IMPORTANT: Visual screenshot`,
        `There is a file called screenshot.png in your current directory.`,
        `Use your view/read tool to look at it. This is the ACTUAL rendered`,
        `output of the prototype in a browser. Score based on what you SEE`,
        `in the screenshot — not just what the source code INTENDS to do.`,
        `If the screenshot shows a broken layout, missing styles, or errors,`,
        `score accordingly even if the source code looks correct.`,
        ``,
      ]
    : []

  const promptText = [
    `You are an expert frontend reviewer for Gemeente Amsterdam. Score the agent's output against a rubric.`,
    `Each criterion is scored 0, 1, or 2:`,
    `  0 = missing entirely — the element/feature does not exist at all`,
    `  1 = partial — the element exists in code but is VISUALLY BROKEN in the screenshot (unstyled, no CSS, broken layout, missing fonts, wrong colors, elements overlapping, no spacing)`,
    `  2 = correct — the element exists AND looks visually correct in the screenshot (proper Amsterdam Design System styling, correct fonts, appropriate spacing, working layout)`,
    ``,
    `CRITICAL: The screenshot is the GROUND TRUTH. If the source code imports Amsterdam Design System components but the screenshot shows unstyled HTML (no borders on tables, no colored badges, no Amsterdam Sans font, raw text without formatting), score those criteria as 1 (partial), NOT 2. A component that renders without its CSS is not "correct".`,
    ``,
    `## Benchmark`,
    `Name: ${benchmark.name}`,
    `Difficulty: ${benchmark.difficulty}`,
    ...visualBlock,
    ``,
    `## Original prompt the agent received`,
    "```",
    benchmark.prompt.trim(),
    "```",
    ``,
    `## Rubric`,
    rubricBlock,
    ``,
    `## ${artifactLabel}`,
    "```",
    truncate(artifactContent, 80000),
    "```",
    ``,
    `## Output format`,
    `Return ONLY a single fenced JSON code block in this exact shape, no extra text:`,
    "```json",
    `{`,
    `  "criteria": [`,
    `    { "criterionId": "designSystem.ds-react", "score": 0, "notes": "..." }`,
    `  ]`,
    `}`,
    "```",
    `Use the dotted criterionId form (categoryKey.criterionId).`,
    `Score every criterion. Notes must be one short sentence each.`,
  ].join("\n")

  // Spawn copilot with the prompt; capture stdout.
  // Copy the screenshot into the temp workdir so copilot's view tool can read it.
  const tempDir = await mkdtemp(join(tmpdir(), `bench-judge-`))
  if (screenshotPath && existsSync(screenshotPath)) {
    await cp(screenshotPath, join(tempDir, "screenshot.png"))
  }
  try {
    const { stdout, stderr, exitCode } = await spawnCopilot([
      "-p",
      promptText,
      "--model",
      judgeModel,
      "--yolo",
      "--no-ask-user",
      "--no-custom-instructions",
      "--autopilot",
    ], tempDir)

    if (exitCode !== 0) {
      const stderrSnippet = stderr.trim().slice(-300)
      throw new Error(
        `copilot judge exited with code ${exitCode}` +
          (stderrSnippet ? `\nstderr (last 300 chars):\n${stderrSnippet}` : ""),
      )
    }
    const json = extractJsonBlock(stdout)
    if (!json) {
      throw new Error(`Could not find a JSON block in judge output. Raw output:\n${stdout.slice(0, 500)}...`)
    }
    const parsed = JSON.parse(json) as { criteria: CriterionScore[] }
    return aggregateScore(parsed.criteria, benchmark.rubric, judgeModel, promptText)
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

function aggregateScore(
  criteria: CriterionScore[],
  rubric: Record<string, RubricCategory>,
  judgeModel: string,
  promptText: string,
): PrototypeScore {
  let total = 0
  let max = 0
  const byCategory: PrototypeScore["byCategory"] = {}
  for (const [catKey, cat] of Object.entries(rubric)) {
    let catScore = 0
    for (const c of cat.criteria) {
      const dotted = `${catKey}.${c.id}`
      const found = criteria.find(
        (x) => x.criterionId === dotted || x.criterionId === c.id,
      )
      const v = clamp(found?.score ?? 0, 0, c.max)
      catScore += v
    }
    byCategory[catKey] = { score: catScore, max: cat.max }
    total += catScore
    max += cat.max
  }
  return {
    total,
    max,
    byCategory,
    criteria,
    source: "llm",
    scoredAt: new Date().toISOString(),
    llmModel: judgeModel,
    llmPromptHash: createHash("sha256").update(promptText).digest("hex").slice(0, 16),
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.round(n)))
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return s.slice(0, max) + `\n<!-- truncated, ${s.length - max} chars omitted -->`
}

function extractJsonBlock(text: string): string | undefined {
  // Try ```json ... ``` first
  const fenced = text.match(/```json\s*([\s\S]*?)```/)
  if (fenced && fenced[1]) return fenced[1].trim()
  // Then any ``` ... ``` containing what looks like JSON
  const anyFenced = text.match(/```\s*([\s\S]*?)```/)
  if (anyFenced && anyFenced[1] && anyFenced[1].trim().startsWith("{")) {
    return anyFenced[1].trim()
  }
  // Then a bare JSON object
  const bare = text.match(/\{[\s\S]*\}/)
  if (bare) return bare[0]
  return undefined
}

interface CopilotResult {
  stdout: string
  stderr: string
  exitCode: number
}

async function spawnCopilot(args: string[], cwd: string): Promise<CopilotResult> {
  return new Promise((resolveProc, rejectProc) => {
    const proc = spawn("copilot", args, {
      cwd,
      env: { ...process.env, COPILOT_DISABLE_TELEMETRY: "1", CI: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""
    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8")
    })
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8")
    })
    proc.on("error", (err) => rejectProc(err))
    proc.on("close", (code) =>
      resolveProc({ stdout, stderr, exitCode: code ?? 1 }),
    )
  })
}
