---
id: "002"
slug: vergunningen-tracker
name: Vergunningen Tracker
---

# Benchmark 002 — Vergunningen Tracker

> Machine-readable definition: [`benchmark.yaml`](./benchmark.yaml)
> Prototypes: [`./prototypes/`](./prototypes/)
> Showcase: `https://amsterdam.github.io/amsterdam-agent-skills/benchmark/vergunningen-tracker/`

## What this tests

Benchmark 001 used a vague prompt from an inexperienced developer. This benchmark uses the opposite: a **well-structured prompt from a senior engineer** who specifies the tech stack, domain model, and UX patterns — but still relies on the skills for ADS component APIs and Dutch language guidance.

The scenario is an internal permit-tracking tool (vergunningen tracker) with:
- A **multi-step form wizard** (the hardest ADS pattern: ProgressList + FieldSet + Field + validation + InvalidFormAlert)
- A **sortable/filterable data table** (Table + Badge + status workflow)
- A **detail view** (DescriptionList + Badge)
- **Compact mode** (internal tool, not public-facing)
- **Dutch labels in Heldere Taal** (form labels, error messages, status text)

## Why this prompt shape matters

An expert prompt removes the "does the agent even know what ADS is?" variable. The prompt explicitly names `@amsterdam/design-system-react` and Compact mode. The question becomes: **given that the agent knows WHAT to use, does it know HOW to compose the components correctly?**

Without the skill, an agent might:
- Use ADS imports but compose Field/Label/ErrorMessage incorrectly (missing the `invalid` prop cascade)
- Build a wizard without ProgressList (using custom steps instead)
- Use a generic `<table>` instead of ADS Table component
- Get the validation pattern wrong (no InvalidFormAlert, no per-field error IDs)
- Use `font-weight: 700` instead of ADS's `800`

With the skill, the agent has the exact component API reference, the form composition pattern, and the common-mistakes table that catches all of these.

## Variants

4 variants: 2 models × 2 skill modes (dropped "default skills" — benchmark 001 showed it adds noise without insight).

| Variant | Model | Skills | What it tests |
|---|---|---|---|
| Opus 4.6 · No skills | claude-opus-4.6 | none | Can Opus compose ADS correctly from general knowledge alone? |
| Opus 4.6 · Amsterdam | claude-opus-4.6 | amsterdam | Does the skill improve Opus's ADS composition on a complex form? |
| GPT-5.1 (high) · No skills | gpt-5.1 | none | Can GPT-5.1 match Opus on ADS composition without skills? |
| GPT-5.1 (high) · Amsterdam | gpt-5.1 | amsterdam | Does GPT-5.1 + skills reach the same level as Opus + skills? |

## How to run

```bash
# All 4 variants (run from tools/bench/)
cd tools/bench
bun run src/cli.ts matrix 002

# One at a time
bun run src/cli.ts run 002 --variant copilot_claude-opus-4.6_amsterdam
bun run src/cli.ts run 002 --variant copilot_gpt-5.1-high_amsterdam

# Score with the LLM judge (takes Playwright screenshots + sends to model)
bun run src/cli.ts judge 002
```
