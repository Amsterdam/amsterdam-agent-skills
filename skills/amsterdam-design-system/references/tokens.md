# Amsterdam Design System — Token Catalog

> Covers `@amsterdam/design-system-tokens` **v4.4.0** (October 2026).

Complete `--ams-*` CSS custom property reference for both Spacious (default) and Compact modes.

## Token Architecture

3-layer hierarchy, each layer references the one below:

```
Brand tokens  →  Common tokens  →  Component tokens
(core values)    (shared patterns)  (per-component)
```

**Reference chain example:**
```
Brand:     --ams-color-interactive: #004699
Common:    --ams-links-color: var(--ams-color-interactive)
Component: --ams-link-color: var(--ams-links-color)
```

**Token format:** [Design Token Community Group (DTCG)](https://design-tokens.github.io/community-group/format/) standard.

**CSS output:** Available as `:root` (in `index.css`) or scoped under `.ams-theme` (in `index.theme.css`).

## Colors

### Text

| CSS Custom Property | Value | Usage |
|-------------------|-------|-------|
| `--ams-color-text` | `#202020` | Default body text |
| `--ams-color-text-inverse` | `#ffffff` | Text on dark backgrounds |
| `--ams-color-text-secondary` | `#767676` | Secondary/muted text |

### Background

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-color-background` | `#ffffff` |
| `--ams-color-background-body` | `#ffffff` (Spacious) / `#e8e8e8` (Compact — grey page, white Grid cells) |

### Interactive

| CSS Custom Property | Value | Usage |
|-------------------|-------|-------|
| `--ams-color-interactive` | `#004699` | Links, primary actions |
| `--ams-color-interactive-hover` | `#003677` | Hover state |
| `--ams-color-interactive-contrast` | `#202020` | High contrast variant |
| `--ams-color-interactive-disabled` | `#767676` | Disabled state |
| `--ams-color-interactive-inverse` | `#ffffff` | Interactive on dark bg |
| `--ams-color-interactive-invalid` | `#ec0000` | Invalid form state |
| `--ams-color-interactive-invalid-hover` | `#b70000` | Invalid hover |

### Feedback

| CSS Custom Property | Value | Usage |
|-------------------|-------|-------|
| `--ams-color-feedback-error` | `#ec0000` | Errors, validation |
| `--ams-color-feedback-info` | `#009de6` | Informational messages |
| `--ams-color-feedback-success` | `#00893c` | Success messages |
| `--ams-color-feedback-warning` | `#ff9100` | Warnings |

### Highlight (Accent Palette)

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-color-highlight-azure` | `#009de6` |
| `--ams-color-highlight-green` | `#00893c` |
| `--ams-color-highlight-lime` | `#bed200` |
| `--ams-color-highlight-magenta` | `#e50082` |
| `--ams-color-highlight-orange` | `#ff9100` |
| `--ams-color-highlight-purple` | `#a00078` |
| `--ams-color-highlight-yellow` | `#ffe600` |

### Other

| CSS Custom Property | Value | Usage |
|-------------------|-------|-------|
| `--ams-color-separator` | `#d1d1d1` | Borders, dividers |
| `--ams-color-progress-current` | `#00893c` | Current progress step |
| `--ams-color-progress-completed` | `#00893c` | Completed step |
| `--ams-color-progress-upcoming` | `#767676` | Upcoming step |

## Spacing

All spacing tokens use fluid `clamp()` values that scale with viewport width.

### Spacious Mode (default — public sites)

| Token | CSS Custom Property | Value | ~Min (320px) | ~Max (1600px) |
|-------|-------------------|-------|-------------|--------------|
| xs | `--ams-space-xs` | `clamp(0.25rem, 0.2143rem + 0.1786vw, 0.375rem)` | 4px | 6px |
| s | `--ams-space-s` | `clamp(0.5rem, 0.4286rem + 0.3571vw, 0.75rem)` | 8px | 12px |
| m | `--ams-space-m` | `clamp(1rem, 0.8571rem + 0.7143vw, 1.5rem)` | 16px | 24px |
| l | `--ams-space-l` | `clamp(1.5rem, 1.2857rem + 1.0714vw, 2.25rem)` | 24px | 36px |
| xl | `--ams-space-xl` | `clamp(2.25rem, 1.8214rem + 2.1429vw, 3.75rem)` | 36px | 60px |
| 2xl | `--ams-space-2xl` | `clamp(3rem, 2.25rem + 3.75vw, 5.625rem)` | 48px | 90px |

### Compact Mode (internal tools)

| Token | CSS Custom Property | Value | ~Min | ~Max |
|-------|-------------------|-------|------|------|
| xs | `--ams-space-xs` | `0.25rem` | 4px | 4px (fixed) |
| s | `--ams-space-s` | `0.5rem` | 8px | 8px (fixed) |
| m | `--ams-space-m` | `clamp(0.75rem, 0.6786rem + 0.3571vw, 1rem)` | 12px | 16px |
| l | `--ams-space-l` | `clamp(1rem, 0.8571rem + 0.7143vw, 1.5rem)` | 16px | 24px |
| xl | `--ams-space-xl` | `clamp(1.25rem, 1.0357rem + 1.0714vw, 2rem)` | 20px | 32px |
| 2xl | `--ams-space-2xl` | `clamp(1.5rem, 1.2143rem + 1.4286vw, 2.5rem)` | 24px | 40px |

Compact `xl` and `2xl` dropped by 4 and 8px in tokens v4.2.0.

## Typography

### Font Family

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-typography-font-family` | `'Amsterdam Sans', Arial, sans-serif` |

### Body Text — Spacious

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-typography-body-text-font-size` | `clamp(1.125rem, 1.0893rem + 0.1786vw, 1.25rem)` (~18-20px) |
| `--ams-typography-body-text-font-weight` | `400` |
| `--ams-typography-body-text-line-height` | `1.6` |
| `--ams-typography-body-text-bold-font-weight` | `700` (was 800 before v4.1.0) |
| `--ams-typography-body-text-light-font-weight` | `300` |
| `--ams-typography-body-text-extra-bold-font-weight` | `800` |
| `--ams-typography-body-text-black-font-weight` | `900` |
| `--ams-typography-italic-font-style` | `italic` |
| `--ams-typography-body-text-small-font-size` | `1rem` (16px) |
| `--ams-typography-body-text-small-line-height` | `1.5` |
| `--ams-typography-body-text-large-font-size` | ~21-25px fluid |
| `--ams-typography-body-text-large-line-height` | `1.5` |
| `--ams-typography-body-text-x-large-font-size` | ~24-32px fluid |
| `--ams-typography-body-text-x-large-line-height` | `1.4` |

### Body Text — Compact

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-typography-body-text-font-size` | `1rem` (16px fixed) |
| `--ams-typography-body-text-line-height` | `1.5` |
| `--ams-typography-body-text-small-font-size` | `0.875rem` (14px) |
| `--ams-typography-body-text-small-line-height` | `1.4` |
| `--ams-typography-body-text-large-font-size` | ~18-19px fluid |
| `--ams-typography-body-text-x-large-font-size` | ~20-23px fluid |

### Headings — Spacious

All headings: `font-weight: var(--ams-typography-heading-font-weight)` (`700`), `text-wrap: balance`

| Level | Font Size | Line Height |
|-------|-----------|-------------|
| H1 | `clamp(2rem, 1.7143rem + 1.4286vw, 3rem)` (~32-48px) | `1.2` |
| H2 | Same as `body-text-x-large` (~24-32px) | `1.3` |
| H3 | Same as `body-text-large` (~21-25px) | `1.3` |
| H4 | Same as `body-text` (~18-20px) | `1.4` |
| H5 | Same as `body-text-small` (16px) | `1.4` |

### Headings — Compact

| Level | Font Size |
|-------|-----------|
| H1 | `clamp(1.5rem, ..., 1.75rem)` (~24-28px) |
| H2 | Same as compact body-text-x-large (~20-23px) |
| H3 | Same as compact body-text-large (~18-19px) |
| H4 | Same as compact body-text (16px) |

## Borders

### Spacious Mode

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-border-width-s` | `0.0625rem` (1px) |
| `--ams-border-width-m` | `0.125rem` (2px) |
| `--ams-border-width-l` | `0.1875rem` (3px) |
| `--ams-border-width-xl` | `0.25rem` (4px) |
| `--ams-border-radius` | `0` |

### Compact Mode (thinner)

| Token | Spacious | Compact |
|-------|---------|---------|
| `--ams-border-width-s` | 1px | 1px |
| `--ams-border-width-m` | 2px | 1px |
| `--ams-border-width-l` | 3px | 2px |
| `--ams-border-width-xl` | 4px | 3px |

### Negative Border-Width Tokens

Used internally for shadow offset calculations (DTCG format).

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-border-width-negative-m` | `-0.125rem` (-2px) |
| `--ams-border-width-negative-xl` | `-0.25rem` (-4px) |

### Shadow Tokens (DTCG Format)

As of v3.4.0, shadow tokens use the DTCG object format (`{ offsetX, offsetY, blur, spread, color }`) instead of CSS shorthand strings. This only affects JSON/SCSS token consumers — CSS custom property output is unchanged.

## Focus

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-focus-outline-offset` | `0.25rem` (4px) |

## Cursor

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-cursor-disabled` | `not-allowed` |
| `--ams-cursor-interactive` | `pointer` |

## Aspect Ratio

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-aspect-ratio-9-16` | `9 / 16` |
| `--ams-aspect-ratio-3-4` | `3 / 4` |
| `--ams-aspect-ratio-1-1` | `1 / 1` |
| `--ams-aspect-ratio-4-3` | `4 / 3` |
| `--ams-aspect-ratio-16-9` | `16 / 9` |
| `--ams-aspect-ratio-16-5` | `16 / 5` |

## Common Tokens (Shared Layer)

### Input Tokens

Shared across TextInput, TextArea, Select, DateInput, TimeInput, PasswordInput, FileInput.

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-inputs-background-color` | `#ffffff` |
| `--ams-inputs-border-color` | `currentColor` |
| `--ams-inputs-border-style` | `solid` |
| `--ams-inputs-border-width` | `var(--ams-border-width-m)` |
| `--ams-inputs-color` | `var(--ams-color-text)` |
| `--ams-inputs-font-family` | `var(--ams-typography-font-family)` |
| `--ams-inputs-font-size` | `var(--ams-typography-body-text-font-size)` |
| `--ams-inputs-font-weight` | `400` |
| `--ams-inputs-line-height` | `1.4` |
| `--ams-inputs-padding-block` | `var(--ams-space-s)` |
| `--ams-inputs-padding-inline` | `var(--ams-space-m)` |
| `--ams-inputs-disabled-color` | `var(--ams-color-interactive-disabled)` |
| `--ams-inputs-disabled-background-color` | `#e8e8e8` (v4.3.0+: disabled inputs have a grey fill) |
| `--ams-inputs-invalid-border-color` | `var(--ams-color-interactive-invalid)` |
| `--ams-inputs-placeholder-color` | `var(--ams-color-text-secondary)` |

### Link Tokens

Shared across Link, StandaloneLink, CallToActionLink.

| CSS Custom Property | Value |
|-------------------|-------|
| `--ams-links-color` | `var(--ams-color-interactive)` |
| `--ams-links-text-decoration-thickness` | `0.125rem` (2px) |
| `--ams-links-text-underline-offset` | `0.15625rem` (2.5px) |
| `--ams-links-hover-color` | `var(--ams-color-interactive-hover)` |
| `--ams-links-hover-text-decoration-thickness` | `0.1875rem` (3px) |
| `--ams-links-contrast-color` | `var(--ams-color-interactive-contrast)` |
| `--ams-links-inverse-color` | `var(--ams-color-interactive-inverse)` |

## Component Tokens (Examples)

Each component has its own `--ams-{component}-*` namespace. There are 72+ component token files.

### Button

```
--ams-button-font-size
--ams-button-font-family
--ams-button-font-weight
--ams-button-line-height
--ams-button-gap
--ams-button-padding-block
--ams-button-padding-inline
--ams-button-border-style
--ams-button-border-width
--ams-button-outline-offset
--ams-button-cursor

--ams-button-primary-background-color
--ams-button-primary-border-color
--ams-button-primary-color
--ams-button-primary-hover-background-color
--ams-button-primary-hover-border-color
--ams-button-primary-hover-color
--ams-button-primary-disabled-background-color
--ams-button-primary-disabled-border-color
--ams-button-primary-disabled-color

(same pattern for secondary, tertiary)
```

### Description List

```
--ams-description-list-term-font-size       (references Heading 4 font-size)
--ams-description-list-term-line-height     (references Heading 4 line-height)
```

Terms use Heading 4 typography and `text-wrap: balance` for multi-line readability.

### Grid

```
--ams-grid-column-count                 4
--ams-grid-padding-inline               var(--ams-space-l)    (Compact: --ams-space-m)
--ams-grid-vi-medium-column-count       8
--ams-grid-vi-medium-padding-inline     var(--ams-space-xl)   (Compact: --ams-space-l)
--ams-grid-vi-wide-column-count         12
--ams-grid-vi-wide-padding-inline       var(--ams-space-2xl)  (Compact: --ams-space-xl)
--ams-grid-cell-background-color        initial               (Compact: --ams-color-background)
--ams-grid-cell-padding-block/-inline   initial               (Compact: --ams-space-m)
```

Viewport-dependent component tokens use a `vi-` prefix since v4.0.0 (`*.vi-medium.*`, `*.vi-wide.*`). The old `*.medium.*` / `*.wide.*` names are deprecated aliases. Since v4.5.0, two-value spacing tokens are split into `-start` / `-end` (e.g. `--ams-dialog-header-padding-block-start`); the combined names are deprecated.

## Using Tokens

### In CSS

```css
.custom-element {
  color: var(--ams-color-text);
  background: var(--ams-color-background);
  padding: var(--ams-space-m);
  font-family: var(--ams-typography-font-family);
  border: var(--ams-border-width-s) solid var(--ams-color-separator);
}
```

### In JavaScript/TypeScript

```ts
import tokens from "@amsterdam/design-system-tokens/dist/index.json"
const primaryColor = tokens.ams.color.interactive.default // "#004699"
```

### In SCSS

```scss
@use "@amsterdam/design-system-tokens/dist/index.scss" as *;
```

### Modes

| Mode | `:root` file | `.ams-theme` file + class |
|---|---|---|
| Spacious (default) | `dist/index.css` | `dist/index.theme.css` + `ams-theme` |
| Compact | add `dist/compact.css` | add `dist/compact.theme.css` + `ams-theme--compact` |
| Lo-fi (wireframe) | add `dist/lo-fi.css` + `@amsterdam/design-system-assets/font/lo-fi/index.css` | add `dist/lo-fi.theme.css` + `ams-theme--lo-fi` |

JSON (`index.json`, `compact.json`, `lo-fi.json`), SCSS and ES module (`*.mjs` + `.d.ts`) builds exist for each mode.

### Theme-Scoped (for embedding in non-AMS pages)

```css
@import "@amsterdam/design-system-tokens/dist/index.theme.css";
/* Tokens scoped to .ams-theme instead of :root */
```

```html
<div class="ams-theme">
  <!-- AMS components work here -->
</div>
```
