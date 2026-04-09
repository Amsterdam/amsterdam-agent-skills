# Amsterdam Agent Skills

Open-source agent skills by the Municipality of Amsterdam. Skills are knowledge modules that give AI coding assistants context-aware expertise — automatically activated when relevant to the task at hand.

Compatible with Claude Code, GitHub Copilot, and other tools that support skill/instruction files.

## Quick Install

Install skills with [`npx skills`](https://github.com/vercel-labs/skills):

```bash
# Install all skills from this repo
npx skills add amsterdam/amsterdam-agent-skills

# Install a specific skill
npx skills add amsterdam/amsterdam-agent-skills --skill amsterdam-design-system

# Install for a specific agent
npx skills add amsterdam/amsterdam-agent-skills -a github-copilot

# Preview available skills without installing
npx skills add amsterdam/amsterdam-agent-skills --list
```

## Manual Setup

Each skill lives in `skills/<name>/SKILL.md`. How you load them depends on your tool:

| Tool | Setup |
|------|-------|
| GitHub Copilot | Reference in `.github/copilot-instructions.md` |
| Claude Code | Symlink into `~/.claude/skills/` |

**GitHub Copilot example:**

```bash
# Copy skill files into .github/instructions/
for skill in skills/*/; do
  cp "$skill/SKILL.md" ".github/instructions/$(basename "$skill").instructions.md"
done
```

## Skills

| Skill | Description | Updated |
|-------|-------------|---------|
| [amsterdam-design-system](skills/amsterdam-design-system/) | Gemeente Amsterdam design system — React components, `--ams-*` tokens, Grid layout, Spacious/Compact modes, Tailwind v4 bridge | 2026-04-03 |
| [amsterdam-stijl](skills/amsterdam-stijl/) | Amsterdam municipality writing style — Heldere Taal (B1), Eenvoudige Taal (A2), inclusive language, tone of voice, word choice, text templates | 2026-04-01 |
| [developers-amsterdam](skills/developers-amsterdam/) | Gemeente Amsterdam engineering standards — approved tech stacks, Git workflow, testing requirements, security-by-design, documentation standards, EU-PL v1.2, WCAG 2.1 AA | 2026-04-01 |

## Benchmarks

> **[Live showcase →](https://amsterdam.github.io/amsterdam-agent-skills/)** — interactive gallery with side-by-side prototype comparisons, visual scoring, and agent session transcripts.

Two benchmarks test the skills across models (Claude Opus 4.6 + GPT-5.1) and skill modes (none vs amsterdam):

### 001 — Zuidas Landing Page (vague prompt, beginner)

A deliberately vague brief from an inexperienced developer. Tests whether skills **activate at all** on an ambiguous prompt.

| | No Skills | Amsterdam Skills |
|--|-----------|-----------------|
| **Opus 4.6** | 17/28 | **28/28** |
| **GPT-5.1 (high)** | 17/28 | **27/28** |

Skills add **+10-11 points** on vague prompts.

### 002 — Vergunningen Tracker (expert prompt, advanced)

A senior engineer's structured brief: multi-step form wizard, sortable data table, 3 React Router routes, Compact mode. Tests whether skills guide **correct component composition** when the engineer already names the stack.

| | No Skills | Amsterdam Skills |
|--|-----------|-----------------|
| **Opus 4.6** | 23/34 | **33/34** |
| **GPT-5.1 (high)** | 26/34 | **26/34** |

Opus gains **+10 points** with skills on the expert prompt. GPT-5.1 holds steady — the skill context doesn't help it further on a well-specified brief.

### Running benchmarks

The runner wraps the GitHub Copilot CLI. Benchmarks are fully reproducible:

```bash
cd tools/bench && bun install

# List all benchmarks and variants
bun run src/cli.ts list

# Build one variant
bun run src/cli.ts run 001 --variant copilot_claude-opus-4.6_amsterdam

# Build the entire matrix
bun run src/cli.ts matrix 002

# Score with the visual LLM judge (Playwright screenshots)
bun run src/cli.ts judge 002
```

Full CLI reference: [`tools/bench/README.md`](tools/bench/README.md).

## Structure

```
skills/                         # The skills themselves
├── amsterdam-design-system/    # AMS React + tokens + layout
├── amsterdam-stijl/            # Writing style, tone, language guidelines
└── developers-amsterdam/       # Engineering standards (developers.amsterdam)

benchmarks/                     # Reproducible benchmark definitions + outputs
├── 001-zuidas-landing-page/    # Vague prompt, beginner
├── 002-vergunningen-tracker/   # Expert prompt, advanced
└── benchmarks.json             # Manifest the showcase reads (generated)

tools/bench/                    # Bun CLI runner (wraps the Copilot CLI)
site/                           # Astro showcase (deployed to GH Pages)
```

## Adding a New Skill

1. Create `skills/my-skill/SKILL.md` with a clear description and instructions
2. Add reference files in `skills/my-skill/references/` if needed
3. Update this README table

## License

Licensed under the [European Union Public Licence v1.2](LICENSE) (EU-PL v1.2).
