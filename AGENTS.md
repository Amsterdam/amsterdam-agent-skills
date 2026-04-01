# AGENTS.md

> Instructions for AI agents working on this repository.

## Project

Open-source agent skills by the Innovation team at the Municipality of Amsterdam. Skills are knowledge modules that give AI coding assistants context-aware expertise — activated automatically when relevant to the task at hand.

**Owner:** Innovation team, Gemeente Amsterdam
**License:** EU-PL v1.2
**Consumers:** Claude Code, GitHub Copilot, Cursor, and other AI coding tools that support skill/instruction files

## Repository Structure

```
skills/
├── amsterdam-design-system/    # React components, CSS tokens, layout patterns
│   ├── SKILL.md                # Main skill file (always required)
│   └── references/             # Detailed API docs, token catalogs, templates
├── amsterdam-stijl/            # Dutch writing style & tone of voice
│   ├── SKILL.md
│   └── references/
├── developers-amsterdam/       # Engineering standards (developers.amsterdam)
│   ├── SKILL.md
│   └── references/             # Tech stack, Git, testing, security, project setup
└── [new-skill]/
    ├── SKILL.md                # Required — the skill entry point
    └── references/             # Optional — supporting detail files
```

## Skill Format

Every skill lives in `skills/<skill-name>/` and **must** have a `SKILL.md` at its root.

### SKILL.md Frontmatter

```yaml
---
name: skill-name                # Kebab-case, matches directory name
description: >                  # Multi-line description used for activation matching.
  What the skill does, when to activate it, what triggers it.
  Be specific — this text determines whether the skill gets loaded.
triggers:                       # Optional — explicit trigger keywords
  - keyword1
  - keyword2
---
```

**Description rules:**
- Write for machines — the description is used by AI tools to decide when to load the skill
- Include: what it covers, when to use it, what packages/tools it relates to
- Include negative triggers if needed ("This skill takes priority over X")
- Keep it under 200 words

### SKILL.md Body

The body is the instruction payload. Structure it as:

1. **Title & one-liner** — what this skill is
2. **Links** — docs, repos, relevant URLs
3. **Setup** — install commands, config steps
4. **Core patterns** — the most common usage patterns with code examples
5. **Reference pointers** — `read references/foo.md` for deep-dive content
6. **Common mistakes** — table of wrong vs. right patterns

**Writing guidelines:**
- Optimize for token efficiency — agents pay per token
- Use tables over prose for lookup-style content
- Code examples should be copy-paste ready
- Prefer showing over telling — patterns > explanations
- Keep the main SKILL.md under 700 lines; move detailed catalogs to `references/`

### Reference Files

Put detailed content in `references/*.md`:
- Component API catalogs
- Token/variable listings
- Templates and boilerplate
- Extended examples
- Word lists, translation tables

Reference files are loaded on-demand (`read references/foo.md`), so they can be longer.

## Adding a New Skill

1. Create `skills/<skill-name>/SKILL.md` with frontmatter and instructions
2. Add `references/` directory if the skill needs supporting detail files
3. Update the Skills table in `README.md`

### Naming Conventions

- **Skill directory:** kebab-case, descriptive (`amsterdam-design-system`, not `ads`)
- **Reference files:** kebab-case, topic-based (`layout-patterns.md`, not `ref1.md`)

## Modifying Existing Skills

- **SKILL.md is the source of truth** — keep it accurate and current
- When updating code examples, verify they work with the latest version of the referenced library
- When adding content, check if it belongs in the main SKILL.md or a reference file (rule of thumb: if it's >50 lines of catalog/listing data, it goes in references)
- Preserve frontmatter format — `name` and `description` fields are required
- Don't break existing reference file paths — other skills or external configs may point to them

## Quality Standards

- [ ] Skill has valid YAML frontmatter with `name` and `description`
- [ ] Description is specific enough for accurate activation matching
- [ ] Code examples are correct and copy-paste ready
- [ ] No hardcoded user-specific paths or credentials
- [ ] Tables used for lookup-style content instead of long prose
- [ ] Main SKILL.md is under 700 lines
- [ ] README.md skills table is up to date

## Language

- Skill content: match the language of the target audience (e.g., `amsterdam-stijl` is in Dutch because it's about Dutch writing)
- Meta content (README, AGENTS.md, frontmatter descriptions): English
- Code examples and variable names: English

## Dependencies

This repo has no build step or runtime dependencies. Skills are plain Markdown files consumed by AI tools.
