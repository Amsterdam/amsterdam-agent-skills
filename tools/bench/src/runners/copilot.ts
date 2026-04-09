/**
 * GitHub Copilot CLI runner.
 *
 * Wraps `copilot -p "<prompt>" --model <model> --yolo --no-ask-user
 * --autopilot --output-format json --share session.md --log-dir logs/`
 * inside a fresh workdir, captures the JSONL stream, and returns a
 * structured RunResult ready for the post-processor to consume.
 *
 * Why these flags?
 *
 *   -p / --prompt          Non-interactive mode — copilot exits when done.
 *   --model                Pin the model so the run is reproducible.
 *   --yolo                 Allow all tools, paths, urls without prompting.
 *                          Required for any non-interactive run.
 *   --no-ask-user          Forbid the agent from asking clarifying questions
 *                          mid-run, which would hang the script.
 *   --autopilot            Allow the agent to continue autonomously across
 *                          multiple turns without intermediate prompts.
 *   --output-format json   JSONL stream — one JSON object per line — that we
 *                          parse for tool calls, tokens, and timing.
 *   --share <path>         Save a markdown transcript for human review and
 *                          for the showcase to link to.
 *   --log-dir <dir>        Capture full debug logs in case the run misbehaves.
 *   --no-custom-instructions
 *                          Added ONLY for skills mode "none" — prevents any
 *                          user-level AGENTS.md from leaking into the run.
 *   --disable-builtin-mcps Always passed. Kills the built-in github-mcp-server,
 *                          which adds latency and non-determinism.
 *   --disable-mcp-server <name>
 *                          Passed once per user MCP server discovered in
 *                          ~/.copilot/mcp-config.json. Same reason — we want
 *                          a clean environment.
 *
 * The runner does NOT handle skill loading. That happens in skills.ts before
 * the runner is invoked. The runner just shells out and parses output.
 */

import { spawn } from "node:child_process"
import { mkdir, readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { createWriteStream } from "node:fs"
import type { SkillsMode } from "../types/manifest.ts"

export interface CopilotRunOptions {
  workdir: string
  prompt: string
  model: string
  skills: SkillsMode
  /** Reasoning effort level — passed as `--effort <level>` to copilot. */
  effort?: string
  /** Bubble subprocess stdout/stderr to the parent for live progress. */
  verbose?: boolean
}

export interface CopilotRunResult {
  /** ISO timestamp when the run started. */
  startedAt: string
  /** Wall-clock duration of the entire copilot invocation. */
  durationMs: number
  /** Exit code of the copilot subprocess. 0 = success. */
  exitCode: number
  /** Path to the session.md transcript inside the workdir. */
  sessionTranscript: string
  /** Path to the log directory inside the workdir. */
  logDir: string
  /** Token usage parsed from the JSONL stream, if reported (rarely populated for Copilot). */
  tokens?: {
    input?: number
    output?: number
    total?: number
  }
  /** Copilot-specific usage stats parsed from the final `result` event. */
  usage?: {
    premiumRequests?: number
    apiDurationMs?: number
    sessionDurationMs?: number
    linesAdded?: number
    linesRemoved?: number
    filesModified?: number
  }
  /** Number of tool calls observed in the stream. */
  toolCallCount: number
  /** Final task summary from `session.task_complete`, if present. */
  finalMessage: string
  /** True if exit code is 0 AND no fatal errors appeared in the stream. */
  oneShot: boolean
}

/**
 * Read ~/.copilot/mcp-config.json (if it exists) and return the names of
 * every user-configured MCP server. The runner passes a `--disable-mcp-server`
 * flag for each so the agent runs in a clean environment.
 *
 * Returns an empty array if the file doesn't exist or fails to parse.
 */
async function discoverUserMcpServers(): Promise<string[]> {
  const configPath = join(homedir(), ".copilot", "mcp-config.json")
  if (!existsSync(configPath)) return []
  try {
    const raw = await readFile(configPath, "utf8")
    const parsed = JSON.parse(raw) as { mcpServers?: Record<string, unknown> }
    return parsed.mcpServers ? Object.keys(parsed.mcpServers) : []
  } catch {
    return []
  }
}

/**
 * Run copilot non-interactively in workdir and parse its JSONL output.
 * The caller is responsible for creating the workdir and pre-populating
 * `.github/instructions/` (via skills.ts) before calling this.
 */
export async function runCopilot(opts: CopilotRunOptions): Promise<CopilotRunResult> {
  const { workdir, prompt, model, skills, effort, verbose = false } = opts
  const sessionTranscript = join(workdir, "copilot-session.md")
  const logDir = join(workdir, "logs")
  await mkdir(logDir, { recursive: true })

  const userMcps = await discoverUserMcpServers()

  const args = [
    "-p",
    prompt,
    "--model",
    model,
    "--yolo",
    "--no-ask-user",
    "--autopilot",
    "--output-format",
    "json",
    "--share",
    sessionTranscript,
    "--log-dir",
    logDir,
    "--disable-builtin-mcps",
  ]
  for (const name of userMcps) {
    args.push("--disable-mcp-server", name)
  }
  if (effort) {
    args.push("--effort", effort)
  }
  if (skills === "none") {
    args.push("--no-custom-instructions")
  }

  const startedAt = new Date()
  const stdoutPath = join(workdir, "copilot-stdout.jsonl")
  const stderrPath = join(workdir, "copilot-stderr.log")
  const stdoutStream = createWriteStream(stdoutPath)
  const stderrStream = createWriteStream(stderrPath)

  let toolCallCount = 0
  let finalMessage = ""
  let tokens: CopilotRunResult["tokens"]
  let usage: CopilotRunResult["usage"]
  let sawFatalError = false
  let stdoutBuffer = ""

  const exitCode: number = await new Promise((resolveProc, rejectProc) => {
    const proc = spawn("copilot", args, {
      cwd: workdir,
      env: {
        ...process.env,
        // Force telemetry off and prevent CLI auto-update mid-run.
        COPILOT_DISABLE_TELEMETRY: "1",
        CI: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    })

    proc.stdout.on("data", (chunk: Buffer) => {
      const text = chunk.toString("utf8")
      stdoutStream.write(chunk)
      if (verbose) process.stdout.write(text)
      stdoutBuffer += text
      // Process complete lines.
      let newlineIdx: number
      while ((newlineIdx = stdoutBuffer.indexOf("\n")) >= 0) {
        const line = stdoutBuffer.slice(0, newlineIdx).trim()
        stdoutBuffer = stdoutBuffer.slice(newlineIdx + 1)
        if (!line) continue
        try {
          const event = JSON.parse(line) as Record<string, unknown>
          handleEvent(event, {
            onToolCall: () => toolCallCount++,
            onTaskComplete: (summary) => {
              if (summary) finalMessage = summary
            },
            onResult: (result) => {
              const u = result.usage as Record<string, unknown> | undefined
              if (u) {
                const partial: NonNullable<CopilotRunResult["usage"]> = {}
                const premiumRequests = pickNumber(u, ["premiumRequests"])
                const apiDurationMs = pickNumber(u, ["totalApiDurationMs", "apiDurationMs"])
                const sessionDurationMs = pickNumber(u, ["sessionDurationMs"])
                if (premiumRequests !== undefined) partial.premiumRequests = premiumRequests
                if (apiDurationMs !== undefined) partial.apiDurationMs = apiDurationMs
                if (sessionDurationMs !== undefined) partial.sessionDurationMs = sessionDurationMs
                const codeChanges = u["codeChanges"] as Record<string, unknown> | undefined
                if (codeChanges) {
                  const linesAdded = pickNumber(codeChanges, ["linesAdded"])
                  const linesRemoved = pickNumber(codeChanges, ["linesRemoved"])
                  const fm = codeChanges["filesModified"]
                  if (linesAdded !== undefined) partial.linesAdded = linesAdded
                  if (linesRemoved !== undefined) partial.linesRemoved = linesRemoved
                  if (Array.isArray(fm)) partial.filesModified = fm.length
                }
                if (Object.keys(partial).length > 0) usage = partial
              }
              // Some clients DO emit token counts in the result.usage object.
              const tIn = u && pickNumber(u, ["input_tokens", "promptTokens"])
              const tOut = u && pickNumber(u, ["output_tokens", "completionTokens"])
              if (tIn !== undefined || tOut !== undefined) {
                tokens = {
                  ...(tokens ?? {}),
                  ...(tIn !== undefined && { input: tIn }),
                  ...(tOut !== undefined && { output: tOut }),
                }
                if (tIn !== undefined && tOut !== undefined) {
                  tokens.total = tIn + tOut
                }
              }
            },
            onError: () => {
              sawFatalError = true
            },
          })
        } catch {
          // Non-JSON line — ignore. The CLI sometimes prints status text.
        }
      }
    })
    proc.stderr.on("data", (chunk: Buffer) => {
      stderrStream.write(chunk)
      if (verbose) process.stderr.write(chunk)
    })

    proc.on("error", (err) => {
      stdoutStream.end()
      stderrStream.end()
      rejectProc(
        new Error(
          `Failed to spawn 'copilot' (is it installed and on PATH?): ${err.message}`,
        ),
      )
    })
    proc.on("close", (code) => {
      stdoutStream.end()
      stderrStream.end()
      resolveProc(code ?? 1)
    })
  })

  const finishedAt = new Date()
  return {
    startedAt: startedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    exitCode,
    sessionTranscript,
    logDir,
    tokens,
    usage,
    toolCallCount,
    finalMessage,
    oneShot: exitCode === 0 && !sawFatalError,
  }
}

interface EventHandlers {
  onToolCall: () => void
  onTaskComplete: (summary: string | undefined) => void
  onResult: (result: Record<string, unknown>) => void
  onError: () => void
}

/**
 * Dispatch a single parsed JSONL event to the appropriate handler.
 *
 * The Copilot CLI 1.0.21 emits events with `type` strings like:
 *   tool.execution_start         when a tool call begins
 *   tool.execution_complete      when a tool call finishes
 *   session.task_complete        when the agent decides it's done
 *   assistant.turn_end           end of an assistant turn
 *   result                       FINAL event — contains usage stats
 *   error                        fatal error
 *   session.mcp_*                MCP lifecycle (ignored)
 *
 * We check both the documented Copilot 1.0.21 names AND a few generic
 * fallbacks (tool_use, usage) so the runner is forward-compatible.
 */
function handleEvent(event: Record<string, unknown>, handlers: EventHandlers): void {
  const type = (event["type"] as string | undefined) ?? (event["event"] as string | undefined)
  if (!type) {
    // The `result` event might not have a `type` field, only an `exitCode` + `usage`.
    if ("exitCode" in event && "usage" in event) {
      handlers.onResult(event)
    }
    return
  }

  if (type === "tool.execution_start" || type === "tool_use" || type === "tool_call") {
    handlers.onToolCall()
    return
  }
  if (type === "session.task_complete") {
    const data = event["data"] as Record<string, unknown> | undefined
    const summary = (data?.["summary"] ?? event["summary"]) as string | undefined
    handlers.onTaskComplete(summary)
    return
  }
  if (type === "result") {
    handlers.onResult(event)
    return
  }
  if (type === "error" || type === "fatal") {
    handlers.onError()
    return
  }
}

function pickNumber(
  obj: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const v = obj[key]
    if (typeof v === "number" && Number.isFinite(v)) return v
  }
  return undefined
}
