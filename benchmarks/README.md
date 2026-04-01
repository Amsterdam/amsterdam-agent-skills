# Skill Benchmarks

Standardized prompts to evaluate how AI agents perform **with** vs **without** Amsterdam agent skills installed. Each benchmark simulates a realistic developer request and defines what correct output looks like.

## How to Run a Benchmark

1. **Baseline (no skills):** Open a fresh project with no Amsterdam skills installed. Paste the prompt. Screenshot the result.
2. **With skills:** Install skills (`npx skills add amsterdam/amsterdam-agent-skills`), paste the same prompt. Screenshot the result.
3. **Compare** against the evaluation criteria in the benchmark file.

## Benchmarks

| # | Benchmark | Skills Tested | Difficulty |
|---|-----------|--------------|------------|
| 1 | [Zuidas Landing Page](./001-zuidas-landing-page.md) | amsterdam-design-system, amsterdam-stijl | Beginner prompt, multi-page |

## Adding a Benchmark

Create `NNN-slug.md` using the template:

```markdown
---
id: NNN
name: Short Name
skills_tested: [skill-a, skill-b]
difficulty: beginner | intermediate | advanced
persona: Who is the simulated user
---

## Prompt
> The exact text to paste into the agent.

## Expected Behavior (with skills)
What the agent should do — which skills activate, what patterns appear in output.

## Red Flags (without skills)
What typically goes wrong — wrong components, wrong language style, generic UI libraries.

## Evaluation Criteria
Checklist for scoring the output.

## Results
### Agent: [name] — Without Skills
- Screenshot: `results/NNN-agent-without.png`
- Score: X/Y
- Notes:

### Agent: [name] — With Skills
- Screenshot: `results/NNN-agent-with.png`
- Score: X/Y
- Notes:
```

## Results Directory

Screenshots and artifacts go in `benchmarks/results/`. Use naming convention:
```
results/
├── 001-zuidas-claude-without.png
├── 001-zuidas-claude-with.png
├── 001-zuidas-copilot-without.png
└── 001-zuidas-copilot-with.png
```
