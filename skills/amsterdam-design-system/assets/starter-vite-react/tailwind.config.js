import compactTokens from "@amsterdam/design-system-tokens/dist/compact.json"

const { ams } = compactTokens

/**
 * Tailwind v4 config used via the `@config` directive in src/styles/index.css.
 *
 * Preflight (Tailwind's reset) is left out in src/styles/index.css by importing
 * only `tailwindcss/theme` and `tailwindcss/utilities`. Tailwind v4 does not read
 * `corePlugins` from a JS config, so there is no `preflight: false` here.
 *
 * `theme.extend.spacing` spreads `ams.space` from compact.json, which adds
 * `p-m`, `gap-xl`, … with literal compact values. The `ams-*` keys (`p-ams-m`)
 * go through the CSS variables and follow the loaded mode — prefer those.
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
}
