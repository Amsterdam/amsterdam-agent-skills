---
id: "001"
slug: zuidas-landing-page
name: Zuidas Landing Page
---

# Benchmark 001 — Zuidas Landing Page

> Machine-readable definition (prompt, variants, rubric): see [`benchmark.yaml`](./benchmark.yaml).
> Runnable prototypes for each variant: [`./prototypes/`](./prototypes/).
> Browse interactively in the showcase: `https://amsterdam.github.io/amsterdam-agent-skills/benchmark/zuidas-landing-page/`.

A deliberately vague prompt that an inexperienced developer with no knowledge of Amsterdam standards might type. Tests `amsterdam-design-system` and `amsterdam-stijl`, end-to-end, on a multi-page brief.

## Why this prompt works

- **Vague enough** to let the agent make its own UI/style choices — exposes whether skills guide those choices.
- **Multi-page** — tests whether the agent scaffolds a proper app structure.
- **Dutch text required** — should trigger language style guidance when available.
- **Newsletter form** — tests component knowledge.
- **"Professional style"** — without skills this means generic corporate; with skills it should mean Amsterdam Design System.

## How to run it

From the repo root:

```bash
# Build one variant
cd tools/bench && bun run src/cli.ts run 001 --variant copilot_claude-opus-4.6_amsterdam

# Build the entire matrix defined in benchmark.yaml
bun run src/cli.ts matrix 001

# Score every variant with the LLM judge
bun run src/cli.ts judge 001

# Refresh the showcase manifest
bun run src/cli.ts manifest
```

See `tools/bench/README.md` for the full CLI reference.

## Legacy screenshots

The original handful of screenshots collected before the runner existed are preserved under [`legacy-screenshots/`](./legacy-screenshots/). They were captured by hand in March 2026 against benchmark scenarios that mirror today's variants but did not produce iframable bundles. They remain in the showcase as a *Before* fallback for the Zuidas benchmark and will be retired once the runner has produced fresh prototypes for every documented variant.

| Variant | Original screenshot |
|---|---|
| Copilot · Opus 4.6 · No skills | [`no-skills.png`](./legacy-screenshots/no-skills.png) |
| Copilot · Opus 4.6 · Default skills (pass 1) | [`default-skills-pass1.png`](./legacy-screenshots/default-skills-pass1.png) |
| Copilot · Opus 4.6 · Default skills (pass 2) | [`default-skills-pass2.png`](./legacy-screenshots/default-skills-pass2.png) |
| Copilot · Opus 4.6 · Amsterdam skills | [`amsterdam-skills.png`](./legacy-screenshots/amsterdam-skills.png) |

## Findings from the original manual run (March 2026)

The first manual run of this benchmark (before the runner existed) produced these scores:

| Criterion | No skills | Default skills | Amsterdam skills |
|---|---|---|---|
| Total (/28) | **12** | **10** | **26** |
| One-shot success | yes | no (needed pass 2) | yes |
| Completion time | 4m 21s | 7m 10s+ | 5m 28s |
| Input tokens | 391 K | 1.8 M (2 passes) | 1.8 M |
| Output tokens | 16.8 K | 21 K+ | 15.2 K |

**Three observations from that run that the new pipeline should keep validating:**

1. **Generic skills can make things worse.** Default skills scored *lower* than no-skills, took longest, and needed a second pass. Generic best-practice guidance without domain knowledge is friction without benefit.
2. **Domain skills are the only path to compliance.** Without `amsterdam-design-system` and `amsterdam-stijl`, neither baseline produced anything resembling an official Amsterdam page.
3. **Token cost reflects skill loading, not waste.** The Amsterdam scenario used 1.8 M input tokens (skills loaded as context) but produced the *fewest* output tokens and succeeded on the first attempt. More context in, less rework out.

The runner reproduces these conditions automatically and the showcase will surface live numbers as new prototypes are built.
