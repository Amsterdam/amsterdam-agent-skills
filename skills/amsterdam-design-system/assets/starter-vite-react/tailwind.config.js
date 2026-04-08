import compactTokens from "@amsterdam/design-system-tokens/dist/compact.json"

const { ams } = compactTokens

/**
 * Tailwind v4 config used via the `@config` directive in src/styles/index.css.
 *
 * Two important details:
 *   1. `corePlugins.preflight: false` — Tailwind's CSS reset conflicts with
 *      AMS base styles (`ams-body`, component CSS). AMS provides its own reset.
 *   2. `theme.extend.spacing` spreads `ams.space` from compact.json so utilities
 *      like `p-ams-m` resolve to the exact compact-mode value, not via CSS vars.
 *
 * For Spacious mode, swap the import to `@amsterdam/design-system-tokens/dist/index.json`.
 */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      spacing: {
        ...ams.space,
        "ams-xs": "var(--ams-space-xs)",
        "ams-s": "var(--ams-space-s)",
        "ams-m": "var(--ams-space-m)",
        "ams-l": "var(--ams-space-l)",
        "ams-xl": "var(--ams-space-xl)",
        "ams-2xl": "var(--ams-space-2xl)",
      },
      colors: {
        "ams-text": "var(--ams-color-text)",
        "ams-text-secondary": "var(--ams-color-text-secondary)",
        "ams-text-inverse": "var(--ams-color-text-inverse)",
        "ams-bg": "var(--ams-color-background)",
        "ams-interactive": "var(--ams-color-interactive)",
        "ams-interactive-hover": "var(--ams-color-interactive-hover)",
        "ams-separator": "var(--ams-color-separator)",
        "ams-error": "var(--ams-color-feedback-error)",
        "ams-success": "var(--ams-color-feedback-success)",
        "ams-warning": "var(--ams-color-feedback-warning)",
        "ams-info": "var(--ams-color-feedback-info)",
        "ams-azure": "var(--ams-color-highlight-azure)",
        "ams-green": "var(--ams-color-highlight-green)",
        "ams-lime": "var(--ams-color-highlight-lime)",
        "ams-magenta": "var(--ams-color-highlight-magenta)",
        "ams-orange": "var(--ams-color-highlight-orange)",
        "ams-purple": "var(--ams-color-highlight-purple)",
        "ams-yellow": "var(--ams-color-highlight-yellow)",
      },
      borderColor: {
        "ams-separator": "var(--ams-color-separator)",
      },
      fontFamily: {
        ams: "var(--ams-typography-font-family)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
}
