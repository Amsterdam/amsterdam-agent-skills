/**
 * Skill loader — populates `<workdir>/.github/instructions/` so the GitHub
 * Copilot CLI picks up the right custom instructions for the requested skill mode.
 *
 * Three modes:
 *
 *   - none      No instructions file is written. The runner ALSO passes
 *               --no-custom-instructions to copilot as a double-safety against
 *               any user-level AGENTS.md leaking into the run.
 *
 *   - default   Writes a documented set of generic best-practice skills (the
 *               same baseline used in the original benchmark 001 manual run).
 *               These are deliberately NOT amsterdam-specific.
 *
 *   - amsterdam Writes the LOCAL amsterdam-design-system + amsterdam-stijl
 *               skill files from skills/ directly into the workdir. This
 *               tests whatever is committed (or uncommitted!) at HEAD, not
 *               whatever happens to be published on npm.
 *
 * Why copy locally instead of `npx skills add ...`?
 *
 *   1. Tests the current state of the repo, not a published version.
 *   2. No network dependency in CI.
 *   3. Faster — no clone, no install.
 *   4. Works offline.
 *
 * Format: each skill becomes a single .instructions.md file under
 * `.github/instructions/`. We concatenate the SKILL.md plus all reference files
 * with clear separators so the agent gets the full skill body in one place.
 */

import { mkdir, writeFile, readFile, readdir, stat } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join, basename } from "node:path"
import type { SkillsMode } from "./types/manifest.ts"
import { skillsDir } from "./paths.ts"

const AMSTERDAM_SKILLS = ["amsterdam-design-system", "amsterdam-stijl"] as const

/**
 * The "default" baseline mirrors the skills installed in the original manual
 * benchmark 001 default-skills scenario. They are *generic* best-practice
 * skills with no Amsterdam knowledge — the comparison point that exposes the
 * gap between generic guidance and domain-specific guidance.
 *
 * We don't ship these in this repo; they have to be authored as instruction
 * files inline. This stub describes the intent. Replace with actual content
 * once a stable set of "default skills" is curated.
 */
const DEFAULT_BASELINE_INSTRUCTIONS = `# Default best-practice skills (baseline)

You are a senior software engineer. Follow these general best practices:

- Prefer TypeScript over JavaScript.
- Use a modern frontend framework (React, Vue, or Svelte).
- Style with Tailwind CSS unless the project already has a design system.
- Build forms with proper validation, ARIA labels, and error states.
- Write semantic HTML.
- Use modern CSS (custom properties, flexbox, grid).

This baseline intentionally contains NO organization-specific knowledge.
`

export async function loadSkills(workdir: string, mode: SkillsMode): Promise<void> {
  const instructionsDir = join(workdir, ".github", "instructions")
  await mkdir(instructionsDir, { recursive: true })

  if (mode === "none") {
    // Nothing to write. The runner additionally passes --no-custom-instructions
    // to copilot when mode === "none" — see runners/copilot.ts.
    return
  }

  if (mode === "default") {
    await writeFile(
      join(instructionsDir, "default-baseline.instructions.md"),
      DEFAULT_BASELINE_INSTRUCTIONS,
      "utf8",
    )
    return
  }

  if (mode === "amsterdam") {
    for (const skillName of AMSTERDAM_SKILLS) {
      const skillRoot = join(skillsDir, skillName)
      if (!existsSync(skillRoot)) {
        throw new Error(
          `Cannot load skill '${skillName}': ${skillRoot} does not exist`,
        )
      }
      const body = await assembleSkillBody(skillRoot)
      await writeFile(
        join(instructionsDir, `${skillName}.instructions.md`),
        body,
        "utf8",
      )
    }
    return
  }

  // Exhaustiveness check.
  const _exhaustive: never = mode
  throw new Error(`Unknown skills mode: ${_exhaustive as string}`)
}

/**
 * Concatenate a skill's SKILL.md and any references/*.md into a single
 * instructions file. Section headers preserve the file boundaries so the
 * agent can navigate between them.
 */
async function assembleSkillBody(skillRoot: string): Promise<string> {
  const parts: string[] = []
  const skillName = basename(skillRoot)
  parts.push(`# Skill: ${skillName}\n`)
  parts.push(
    `> Loaded into Copilot via .github/instructions/ by tools/bench. ` +
      `Source: skills/${skillName}/.\n`,
  )

  const skillMdPath = join(skillRoot, "SKILL.md")
  if (existsSync(skillMdPath)) {
    parts.push("## SKILL.md\n")
    parts.push(await readFile(skillMdPath, "utf8"))
    parts.push("\n")
  }

  const refsDir = join(skillRoot, "references")
  if (existsSync(refsDir) && (await stat(refsDir)).isDirectory()) {
    const files = (await readdir(refsDir)).filter((f) => f.endsWith(".md")).sort()
    for (const file of files) {
      parts.push(`## references/${file}\n`)
      parts.push(await readFile(join(refsDir, file), "utf8"))
      parts.push("\n")
    }
  }

  return parts.join("\n")
}
