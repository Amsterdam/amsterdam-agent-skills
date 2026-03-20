# Amsterdam Design System — Tailwind CSS v4 Bridge

Integration guide for using Tailwind CSS v4 alongside the Amsterdam Design System.

## Principle

**AMS components first, Tailwind fills gaps.** Use AMS React components for all standard UI elements. Use Tailwind utilities only for custom layout, positioning, and one-off spacing that AMS components don't cover.

## Setup

### Import Order

```css
/* app.css */
@import "tailwindcss";

/* AMS imports — AFTER Tailwind */
@import "@amsterdam/design-system-assets/font/index.css";
@import "@amsterdam/design-system-css/dist/index.css";
@import "@amsterdam/design-system-tokens/dist/index.css";

/* For compact mode (internal tools), add: */
/* @import "@amsterdam/design-system-tokens/dist/compact.css"; */
```

### Preflight Considerations

Tailwind's preflight (CSS reset) may conflict with AMS base styles. If you see styling issues:

```css
/* Option 1: Disable Tailwind preflight entirely */
@import "tailwindcss" layer(utilities);
/* Then rely on AMS CSS for base styles */

/* Option 2: Keep preflight but let AMS override */
/* AMS imports after Tailwind handle most conflicts */
```

## Theme Mapping

Map AMS design tokens to Tailwind's `@theme` so Tailwind utilities use AMS values:

```css
@theme {
  /* ── Spacing ── */
  --spacing-ams-xs: var(--ams-space-xs);
  --spacing-ams-s: var(--ams-space-s);
  --spacing-ams-m: var(--ams-space-m);
  --spacing-ams-l: var(--ams-space-l);
  --spacing-ams-xl: var(--ams-space-xl);
  --spacing-ams-2xl: var(--ams-space-2xl);

  /* ── Colors ── */
  /* Text */
  --color-ams-text: var(--ams-color-text);
  --color-ams-text-secondary: var(--ams-color-text-secondary);
  --color-ams-text-inverse: var(--ams-color-text-inverse);

  /* Background */
  --color-ams-bg: var(--ams-color-background);

  /* Interactive */
  --color-ams-interactive: var(--ams-color-interactive);
  --color-ams-interactive-hover: var(--ams-color-interactive-hover);
  --color-ams-interactive-contrast: var(--ams-color-interactive-contrast);
  --color-ams-interactive-disabled: var(--ams-color-interactive-disabled);

  /* Feedback */
  --color-ams-error: var(--ams-color-feedback-error);
  --color-ams-success: var(--ams-color-feedback-success);
  --color-ams-warning: var(--ams-color-feedback-warning);
  --color-ams-info: var(--ams-color-feedback-info);

  /* UI */
  --color-ams-separator: var(--ams-color-separator);

  /* Highlight (accent) */
  --color-ams-azure: var(--ams-color-highlight-azure);
  --color-ams-green: var(--ams-color-highlight-green);
  --color-ams-lime: var(--ams-color-highlight-lime);
  --color-ams-magenta: var(--ams-color-highlight-magenta);
  --color-ams-orange: var(--ams-color-highlight-orange);
  --color-ams-purple: var(--ams-color-highlight-purple);
  --color-ams-yellow: var(--ams-color-highlight-yellow);

  /* ── Typography ── */
  --font-ams: var(--ams-typography-font-family);

  /* ── Borders ── */
  --border-width-ams-s: var(--ams-border-width-s);
  --border-width-ams-m: var(--ams-border-width-m);
  --border-width-ams-l: var(--ams-border-width-l);
  --border-width-ams-xl: var(--ams-border-width-xl);
}
```

## Utility Classes Available After Mapping

### Spacing

```html
<!-- Padding -->
<div class="p-ams-m">                <!-- padding: var(--ams-space-m) -->
<div class="px-ams-l py-ams-s">     <!-- padding-inline: l, padding-block: s -->

<!-- Margin -->
<div class="mt-ams-xl mb-ams-m">    <!-- margin-top: xl, margin-bottom: m -->

<!-- Gap -->
<div class="flex gap-ams-s">        <!-- flex with AMS small gap -->
```

### Colors

```html
<!-- Text colors -->
<span class="text-ams-text">           <!-- default text -->
<span class="text-ams-text-secondary"> <!-- muted text -->
<span class="text-ams-error">          <!-- error text -->

<!-- Background colors -->
<div class="bg-ams-bg">               <!-- default background -->
<div class="bg-ams-azure">            <!-- azure highlight -->
<div class="bg-ams-success">          <!-- success background -->

<!-- Border colors -->
<div class="border border-ams-separator"> <!-- standard border -->
```

### Typography

```html
<div class="font-ams">  <!-- font-family: Amsterdam Sans -->
```

### Borders

```html
<div class="border-ams-s">  <!-- border-width: 1px -->
<div class="border-ams-m">  <!-- border-width: 2px -->
```

## When to Use Tailwind vs AMS Components

| Scenario | Use |
|----------|-----|
| Button, link, heading, paragraph | **AMS component** |
| Form field with label + validation | **AMS component** (`Field`, `Label`, `TextInput`) |
| Page grid layout | **AMS component** (`Grid`, `Grid.Cell`) |
| Table, accordion, tabs | **AMS component** |
| Custom flex/grid layout between AMS components | **Tailwind** (`flex`, `gap-ams-m`, `items-center`) |
| One-off positioning (absolute, sticky) | **Tailwind** (`absolute`, `sticky`, `top-0`) |
| Responsive visibility | **Tailwind** (`hidden md:block`) |
| Custom decorative element | **Tailwind** with AMS color tokens (`bg-ams-azure`, `rounded`) |
| Animation/transition | **Tailwind** (`transition-colors`, `duration-200`) |
| Hover/focus utilities for custom elements | **Tailwind** (`hover:bg-ams-interactive-hover`) |

## Example: Mixed AMS + Tailwind

```tsx
import { Button, Heading, Paragraph } from "@amsterdam/design-system-react"
import { SearchIcon } from "@amsterdam/design-system-react-icons"

function FeatureCard({ title, description, href }) {
  return (
    // Tailwind for custom card layout, AMS tokens for values
    <div className="flex flex-col gap-ams-s p-ams-m border border-ams-separator rounded-sm">
      {/* AMS component for heading */}
      <Heading level={3} size="level-4">{title}</Heading>

      {/* AMS component for text */}
      <Paragraph size="small">{description}</Paragraph>

      {/* Tailwind for push-to-bottom layout */}
      <div className="mt-auto">
        {/* AMS component for button */}
        <Button variant="secondary" icon={SearchIcon}>
          Bekijk details
        </Button>
      </div>
    </div>
  )
}
```

## Example: Dashboard Stat Card (Compact Mode)

```tsx
function StatCard({ label, value, trend }) {
  return (
    <div className="flex flex-col gap-ams-xs p-ams-s bg-ams-bg border border-ams-separator">
      <span className="text-ams-text-secondary text-sm font-ams">{label}</span>
      <span className="text-2xl font-extrabold font-ams text-ams-text">{value}</span>
      {trend && (
        <span className={clsx(
          "text-sm font-ams",
          trend > 0 ? "text-ams-success" : "text-ams-error"
        )}>
          {trend > 0 ? "+" : ""}{trend}%
        </span>
      )}
    </div>
  )
}
```

## Breakpoint Alignment

AMS grid breakpoints don't map 1:1 to Tailwind's defaults. If you need Tailwind breakpoints to align with AMS:

```css
@theme {
  /* Override Tailwind breakpoints to match AMS grid */
  --breakpoint-sm: 37.5rem;   /* 600px — AMS medium */
  --breakpoint-md: 37.5rem;   /* same as sm for AMS alignment */
  --breakpoint-lg: 72.5rem;   /* 1160px — AMS wide */
  --breakpoint-xl: 72.5rem;   /* same as lg */
  --breakpoint-2xl: 90rem;    /* 1440px — optional max-width */
}
```

Or use custom breakpoints:

```css
@theme {
  --breakpoint-ams-medium: 37.5rem;  /* 600px */
  --breakpoint-ams-wide: 72.5rem;    /* 1160px */
}
```

```html
<div class="hidden ams-medium:block">Visible from medium breakpoint</div>
```

## Tips

1. **Never override AMS component styles with Tailwind.** If `ams-button` needs different padding, use AMS component tokens, not `p-4`.
2. **Use AMS Grid for page-level layout.** Use Tailwind flex/grid for micro-layout within components.
3. **Don't duplicate AMS colors in Tailwind config.** Always reference via `var(--ams-*)`.
4. **Compact mode works automatically.** The `@theme` mapping uses CSS variables, so importing `compact.css` adjusts all Tailwind utilities too.
