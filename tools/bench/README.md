# bench — Amsterdam agent skill benchmark runner

A Bun CLI that wraps the [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) to execute benchmark prompts across model + skill matrices, build the agent's output into iframable static bundles, and produce a manifest the [Astro showcase site](../../site/) reads.

## Why Copilot CLI?

GitHub Copilot CLI is the official AI coding tool the City of Amsterdam uses. Building the runner around it means our benchmarks measure exactly what our developers experience in production — same agent, same model routing, same skill loading mechanism — instead of what some other client would do.

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.3
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) ≥ 1.0.21, authenticated with `copilot login`
- The repo cloned and `tools/bench` deps installed (`cd tools/bench && bun install`)

## Commands

All commands run from `tools/bench/` (or use `bun run --cwd tools/bench src/cli.ts`).

### `bench list`

List every benchmark on disk and its declared variants. Marks variants that already have a built prototype with `✓`.

```bash
bun run src/cli.ts list
```

### `bench run <id-or-slug> --variant <variant-id>`

Build one prototype:

```bash
bun run src/cli.ts run 001 --variant copilot_claude-opus-4-6_amsterdam
```

Steps:

1. Resolve the benchmark by id (`001`) or slug (`zuidas-landing-page`).
2. Pick the variant from `benchmark.yaml`.
3. Create a fresh scratch workdir under the OS temp dir.
4. Populate `<workdir>/.github/instructions/` with the requested skill set:
   - `none` → empty + `--no-custom-instructions` flag
   - `default` → a documented generic best-practice baseline
   - `amsterdam` → the local `skills/amsterdam-*` files concatenated into instructions files
5. Invoke `copilot -p "<prompt>" --model <model> --yolo --no-ask-user --autopilot --output-format json --share session.md --log-dir logs/`
6. Parse the JSONL stream for tokens, tool calls, and the final message.
7. If the agent scaffolded a Vite/Next/CRA project, run `bun install && bun run build` and copy the `dist/` (or `build/`/`out/`) into the prototype directory. If it produced static HTML, copy that directly.
8. Write `meta.json` with model, tokens, duration, prompt hash, and score (empty until `bench judge` or a human fills it).
9. Refresh `benchmarks/benchmarks.json` so the showcase picks the new prototype up immediately.

Flags:

| Flag | Effect |
|---|---|
| `--variant <id>` | **Required.** Variant id from `benchmark.yaml`. |
| `--workdir <path>` | Use a specific scratch directory instead of `mktemp`. |
| `--keep-workdir` | Don't delete the scratch dir after a successful run. |
| `--dry-run` | Print what would happen without invoking copilot. |
| `--verbose` | Stream copilot stdout/stderr live. |

### `bench matrix <id-or-slug>`

Build every variant declared in `benchmark.yaml`, sequentially. Sequential by design — Copilot runs are token-expensive and fan-out can hit rate limits.

```bash
bun run src/cli.ts matrix 001
bun run src/cli.ts matrix 001 --skip copilot_claude-opus-4-6_default
bun run src/cli.ts matrix 001 --only copilot_claude-opus-4-6_amsterdam
```

### `bench judge <id-or-slug> [--variant <variant-id>]`

Score one or more built prototypes against the benchmark's rubric using the same `copilot` CLI in JSON-output mode. Advisory — humans can override scores via PR.

```bash
# Score every built variant of benchmark 001
bun run src/cli.ts judge 001

# Score one variant only
bun run src/cli.ts judge 001 --variant copilot_claude-opus-4-6_amsterdam

# Use a different judge model
bun run src/cli.ts judge 001 --model claude-sonnet-4-6
```

The judge prompt embeds the rubric, the original prompt, and (a truncated form of) the prototype's `index.html`. It asks for STRICT JSON in a fenced code block, parses it, aggregates by category, and writes back into `meta.json` under `score` with `source: "llm"`.

### `bench manifest`

Walk every benchmark on disk and rebuild `benchmarks/benchmarks.json` — the single source of truth the Astro showcase reads at build time. The `run` and `judge` commands do this automatically; you only need to call this directly if you've manually edited `meta.json` files.

```bash
bun run src/cli.ts manifest
```

## Repo layout

```
tools/bench/
├── package.json
├── tsconfig.json
└── src/
    ├── cli.ts                  # entry point + dispatch
    ├── args.ts                 # tiny inline arg parser, zero deps
    ├── paths.ts                # repo-root locator + path helpers
    ├── definition.ts           # load + validate benchmark.yaml
    ├── skills.ts               # populate .github/instructions/
    ├── postprocess.ts          # detect build kind, run build, copy artifact
    ├── runners/
    │   └── copilot.ts          # spawn copilot CLI, parse JSONL stream
    ├── commands/
    │   ├── run.ts
    │   ├── matrix.ts
    │   ├── judge.ts
    │   ├── list.ts
    │   └── manifest.ts
    └── types/
        └── manifest.ts         # shared types — also imported by site/
```

The `src/types/manifest.ts` file is intentionally dependency-free. The Astro site at `site/` imports it via a relative path so the runner and the showcase share one source of truth for the prototype shape.

## Skill loading details

The runner does **not** call `npx skills add ...`. Instead it copies the local skill files directly out of `skills/<name>/` into the workdir's `.github/instructions/`. Reasons:

- Tests the current state of the repo (including uncommitted changes), not whatever happens to be published on npm.
- No network dependency in CI.
- Faster — no clone, no install.
- Works offline.

For each loaded skill, the runner concatenates `SKILL.md` plus every `references/*.md` into a single `<skill-name>.instructions.md` file with section headers preserving file boundaries. Copilot picks these up via its custom-instructions feature.

For `--skills none`, the runner additionally passes `--no-custom-instructions` to copilot as a double-safety against any user-level `AGENTS.md` leaking into the run.

## Reproducibility

Every prototype carries a `promptHash` in its `meta.json` — a SHA-256 of the trimmed prompt that was actually fed to the agent. If `benchmark.yaml`'s prompt changes, the hash drifts and the prototype is considered stale. The showcase will surface a "stale" indicator (TODO) and a `bench refresh` command will rebuild.

## Adding a new agent runner

The runner is intentionally Copilot-only for now. To add another agent (e.g. Claude Code, Cursor agent), drop a new file in `src/runners/` that exports a function with the same shape as `runCopilot()` and dispatch on `variant.agent` in `commands/run.ts`. The post-processor and skill loader are agent-agnostic.

## Troubleshooting

**`Failed to spawn 'copilot'`** — install GitHub Copilot CLI and authenticate with `copilot login`.

**`copilot exited with code 1`** — the runner leaves the workdir intact on failure. Check `<workdir>/copilot-stdout.jsonl` and `<workdir>/logs/` for the full session.

**`Build completed but none of dist, build, out, .output/public, _site were created`** — the agent scaffolded a project the post-processor doesn't recognize. Add the build directory to `KNOWN_BUILD_DIRS` in `src/postprocess.ts`.

**`Could not find a JSON block in judge output`** — the LLM judge didn't return a fenced code block. Re-run with a different `--model` or check that the rubric prompt is well-formed. The raw output is logged on failure.
