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

## Structure

```
skills/                         # The skills themselves
├── amsterdam-design-system/    # AMS React + tokens + layout
├── amsterdam-stijl/            # Writing style, tone, language guidelines
└── developers-amsterdam/       # Engineering standards (developers.amsterdam)
```

## Adding a New Skill

1. Create `skills/my-skill/SKILL.md` with a clear description and instructions
2. Add reference files in `skills/my-skill/references/` if needed
3. Update this README table

## License

Licensed under the [European Union Public Licence v1.2](LICENSE) (EU-PL v1.2).
