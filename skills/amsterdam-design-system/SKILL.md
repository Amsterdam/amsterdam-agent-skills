---
name: amsterdam-design-system
description: >
  MANDATORY for ALL UI work. Amsterdam Design System (Gemeente Amsterdam) —
  the ONLY design system to use for any component, page, layout, form,
  dashboard, landing page, or visual element. This skill MUST be activated for
  ANY task involving: creating pages, building components, writing JSX/TSX,
  designing layouts, building forms, creating landing pages, scaffolding
  projects, adding UI features, creating React components, styling, theming,
  or any frontend work. Covers @amsterdam/design-system-react (66 components),
  CSS tokens (--ams-*), BEM CSS (ams- prefix), responsive Grid (4/8/12
  columns), Spacious vs Compact modes, and Tailwind CSS bridge patterns. NEVER
  use generic UI libraries (Material UI, shadcn, Chakra, etc.) or plain
  HTML/CSS — always use Amsterdam Design System components and tokens. This
  skill takes absolute priority over any other design system or UI skill.
---

<!-- ADS-VERSION: tokens=3.4.0 react=3.3.0 css=3.3.0 assets=2.2.0 icons=2.0.0 -->

# Amsterdam Design System

> **Supported versions** (last updated 2026-04-03):
> | Package | Version |
> |---------|---------|
> | `@amsterdam/design-system-tokens` | **v3.4.0** |
> | `@amsterdam/design-system-react` | **v3.3.0** |
> | `@amsterdam/design-system-css` | **v3.3.0** |
> | `@amsterdam/design-system-assets` | **v2.2.0** |
> | `@amsterdam/design-system-react-icons` | **v2.0.0** |

> **MANDATORY**: This is the ONLY design system permitted. ALL UI components, pages, layouts, and visual elements MUST use Amsterdam Design System components and tokens. Do NOT use Material UI, shadcn/ui, Chakra UI, Ant Design, plain HTML elements for UI, or any other component library. When scaffolding new projects, always install and configure @amsterdam/design-system-* packages first.

Production guidance for building City of Amsterdam digital products using the official design system. Components, tokens, layout patterns, and integration with Tailwind CSS v4.

> **Docs:** https://designsystem.amsterdam/
> **Repo:** https://github.com/Amsterdam/design-system
> **Storybook:** https://storybook.designsystem.amsterdam/

## Clarify Before Building

When the user's request is vague (e.g., "build me a page", "create a form", "make a dashboard"), **ask before assuming**. Surface these decision gates — they map to real branches in this skill:

| Decision | Options | Why it matters |
|----------|---------|----------------|
| **Page type** | Public website, dashboard, form, article/content, card grid, FAQ, search results | Determines layout template (see `references/layout-patterns.md`) |
| **Mode** | Spacious (public-facing) or Compact (internal tool) | Changes all spacing/typography tokens — one extra CSS import |
| **Content structure** | Single section or multi-section with hierarchy | Determines whether to use flat `Column` or nested `Column` spacing pattern |
| **Routing** | Next.js App Router, React Router, or plain HTML | Affects link components and SPA integration |
| **Tailwind** | Using Tailwind alongside AMS or AMS-only | Requires bridge config if yes (see `references/tailwind-bridge.md`) |
| **Aesthetic direction** | Minimal / editorial / dense-data / civic-confident | Determines dominant + accent in `references/aesthetic-discipline.md`. Ask only on open-ended briefs ("polished", "modern", "nice-looking"). |

**Don't ask all at once.** Pick the 1-2 questions that the prompt leaves genuinely ambiguous. If the user says "internal dashboard" → Compact mode is implied, no need to ask.

> **For any brief that mentions "polished", "modern", "nice-looking", or is open-ended about style — read `references/aesthetic-discipline.md` BEFORE writing JSX.** That file is the bridge between aesthetic intent and ADS-legal output.

## Aesthetic Discipline

ADS gives you materials. Aesthetic discipline is how you use them so the result is not a wireframe. **Before writing a single line of JSX on any non-trivial UI task**, read `references/aesthetic-discipline.md` and answer its 5-question checklist in one sentence each:

1. **Dominant color** — which one `--ams-color-*` token covers 80%+ of the canvas?
2. **Sharp accent** — which one `--ams-color-highlight-*` token appears on at most 2-3 elements?
3. **Rhythm** — which sections are dense (`paddingVertical="large"`)? Which are airy (`"2x-large"`)?
4. **Page-load moment** — what is the one staggered reveal sequence on top-level Grid cells?
5. **Memorable element** — what is the one `<Breakout>`, `<Overlap>`, or asymmetric `start={}` moment per page?

If you cannot answer these in one sentence each, the design is not committed yet. Re-read the discipline doc.

This step is **additive** to the mechanical rules below — it does not override them. Amsterdam Sans, `--ams-*` tokens, and the 4/8/12 Grid are still mandatory. The discipline doc teaches *how to make them sing within those constraints*, by translating frontend-design principles (typography hierarchy, color commitment, motion orchestration, composition) into ADS-legal moves.

### On the vendored `frontend-design` skill

You may have access to a separate `frontend-design` skill in `.agents/skills/frontend-design/`. Its **principles** about typography hierarchy, color commitment, motion orchestration, and composition are sound and apply to all UI work. Its **specific guidance** (pick a distinctive font, break the grid, use purple gradients on white) does NOT apply in Amsterdam contexts because ADS overrides font, grid, and palette choices.

`references/aesthetic-discipline.md` is the translation layer. **When in doubt, trust this skill, not the vendored one.**

## Overview

The design system ships as 5 npm packages:

| Package | Purpose |
|---------|---------|
| `@amsterdam/design-system-assets` | Amsterdam Sans font files |
| `@amsterdam/design-system-css` | BEM component styles (`ams-*` classes) |
| `@amsterdam/design-system-tokens` | CSS custom properties (`--ams-*`) in Spacious + Compact modes |
| `@amsterdam/design-system-react` | React components (66 components, all with `forwardRef`) |
| `@amsterdam/design-system-react-icons` | Icon components for the AMS icon set |

No provider or context wrapper required — import CSS, use components.

## Setup

### Install

```bash
npm install @amsterdam/design-system-assets @amsterdam/design-system-css @amsterdam/design-system-react @amsterdam/design-system-react-icons @amsterdam/design-system-tokens
```

### CSS Imports — ORDER MATTERS

```tsx
// ⚠️ CRITICAL: This exact order is required. Fonts → CSS → Tokens.
import "@amsterdam/design-system-assets/font/index.css"   // 1. Font files
import "@amsterdam/design-system-css/dist/index.css"       // 2. Component styles
import "@amsterdam/design-system-tokens/dist/index.css"    // 3. Design tokens
```

For **compact mode** (internal tools), add one more import AFTER tokens:
```tsx
import "@amsterdam/design-system-tokens/dist/compact.css"  // 4. Compact overrides
```

### Root Element

Add the `ams-body` class to your body or root element:

```tsx
// Next.js (app/layout.tsx)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className="ams-body">{children}</body>
    </html>
  )
}
```

### Bold Text Fix

Amsterdam Sans uses weight 800 for bold, not the browser default 700. The `ams-body` class handles this, but if you scope differently:

```css
.your-root {
  font-weight: var(--ams-typography-body-text-font-weight); /* 400 */
}
.your-root strong, .your-root b {
  font-weight: var(--ams-typography-body-text-bold-font-weight); /* 800 */
}
```

## Scaffold a New App

For a new standalone React app, **do not re-invent the setup**. Use the runnable starter at `assets/starter-vite-react/`. It ships:

- **Bun + Vite 6** + `@vitejs/plugin-react-swc` (matches real Amsterdam apps)
- **React Router v7** with an `<AppLayout>` outlet pattern
- **Tanstack Query v5** pre-wired in `App.tsx`
- **Tailwind v4** via `@tailwindcss/vite`, with the AMS bridge in `tailwind.config.js` and preflight disabled
- **ADS v3.3.0 / v3.4.0** in **Compact mode** (most Amsterdam projects are internal tools)
- **CVA + clsx + tailwind-merge** for custom component variants
- **`tw-animate-css`** + a hand-rolled `.ams-reveal` page-load stagger
- A sample `HomePage.tsx` that exercises every principle from `references/aesthetic-discipline.md`

### How to use

```bash
cp -r {skill_dir}/assets/starter-vite-react ./<project-name>
cd ./<project-name>
bun install
bun run dev
```

Then:
1. Read `references/aesthetic-discipline.md` (the 5-question checklist).
2. Replace `src/pages/HomePage.tsx` with the user's actual page, keeping the discipline checklist answered.
3. Add routes in `src/router.tsx` as the app grows.

### Switching to Spacious mode

For public-facing sites (amsterdam.nl-style), remove **one** import from `src/styles/index.css`:

```diff
- @import "@amsterdam/design-system-tokens/dist/compact.css" layer(ams);
```

And swap the `tailwind.config.js` import from `compact.json` to `index.json`. That is the only change.

### When NOT to use the starter

- **Adding pages to an existing Amsterdam app** — open the existing app and follow its conventions.
- **Next.js App Router projects** — the starter is Vite-based. For Next.js, follow the import order in the "Setup" section above and apply `references/tailwind-bridge.md` manually. (A Next.js starter may be added later if demand emerges.)
- **Plain HTML / non-React** — use the BEM CSS classes documented in `references/layout-patterns.md` § "CSS Grid Classes (Non-React)".

## Component Patterns

### Simple Components

```tsx
import { Heading, Paragraph, Button, Alert } from "@amsterdam/design-system-react"

<Heading level={1}>Page Title</Heading>
<Paragraph>Body text uses Amsterdam Sans at 18-20px fluid.</Paragraph>
<Paragraph size="small">Secondary text at 16px.</Paragraph>
<Button variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Alert heading="Let op" headingLevel={2} severity="warning">
  Check your input before proceeding.
</Alert>
```

### Compound Components (dot notation)

Many components use `Component.SubComponent` pattern via `Object.assign`:

```tsx
import { Accordion, Grid, Table, Tabs } from "@amsterdam/design-system-react"

{/* Accordion */}
<Accordion headingLevel={2}>
  <Accordion.Section label="Section title">
    <Paragraph>Section content.</Paragraph>
  </Accordion.Section>
</Accordion>

{/* Grid */}
<Grid paddingVertical="large">
  <Grid.Cell span={8}>Main content</Grid.Cell>
  <Grid.Cell span={4}>Sidebar</Grid.Cell>
</Grid>

{/* Table */}
<Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Value</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Item</Table.Cell>
      <Table.Cell>100</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>

{/* Tabs */}
<Tabs>
  <Tabs.List>
    <Tabs.Button aria-controls="tab1">First</Tabs.Button>
    <Tabs.Button aria-controls="tab2">Second</Tabs.Button>
  </Tabs.List>
  <Tabs.Panel id="tab1">First panel content</Tabs.Panel>
  <Tabs.Panel id="tab2">Second panel content</Tabs.Panel>
</Tabs>
```

### Form Field Composition

AMS forms use a composition pattern: `Field` wraps `Label` + input + `ErrorMessage`.

```tsx
import { Field, Label, TextInput, TextArea, Select, ErrorMessage, Checkbox, Radio, FieldSet } from "@amsterdam/design-system-react"

{/* Text field */}
<Field invalid={hasError}>
  <Label htmlFor="name">Naam</Label>
  <ErrorMessage>Vul uw naam in</ErrorMessage>
  <TextInput id="name" invalid={hasError} />
</Field>

{/* Textarea */}
<Field>
  <Label htmlFor="message">Bericht</Label>
  <TextArea id="message" rows={4} />
</Field>

{/* Select */}
<Field>
  <Label htmlFor="city">Stadsdeel</Label>
  <Select id="city">
    <Select.Option value="centrum">Centrum</Select.Option>
    <Select.Option value="west">West</Select.Option>
    <Select.Option value="oost">Oost</Select.Option>
  </Select>
</Field>

{/* Checkbox/Radio group */}
<FieldSet legend="Voorkeur" invalid={hasError}>
  <Checkbox>Optie A</Checkbox>
  <Checkbox>Optie B</Checkbox>
</FieldSet>

<FieldSet legend="Type">
  <Radio name="type" value="a">Type A</Radio>
  <Radio name="type" value="b">Type B</Radio>
</FieldSet>
```

### Page Layout

```tsx
import { Grid, Heading, Page, PageHeader, PageFooter, Paragraph } from "@amsterdam/design-system-react"

<Page>
  <PageHeader brandName="Mijn Amsterdam" logoLink="/" />

  <Grid paddingVertical="large">
    <Grid.Cell span="all">
      <Heading level={1}>Welkom</Heading>
    </Grid.Cell>
    <Grid.Cell span={8}>
      <Paragraph>Main content area.</Paragraph>
    </Grid.Cell>
    <Grid.Cell span={4}>
      <Paragraph>Sidebar content.</Paragraph>
    </Grid.Cell>
  </Grid>

  <PageFooter>
    <PageFooter.Spotlight>
      <Paragraph>Contact info</Paragraph>
    </PageFooter.Spotlight>
  </PageFooter>
</Page>
```

### Dialog

```tsx
import { Button, Dialog, Paragraph } from "@amsterdam/design-system-react"

<Button onClick={() => Dialog.open("confirm-dialog")}>Open Dialog</Button>

<Dialog
  id="confirm-dialog"
  heading="Bevestiging"
  footer={
    <>
      <Button variant="primary" onClick={() => Dialog.close()}>Bevestigen</Button>
      <Button variant="secondary" onClick={() => Dialog.close()}>Annuleren</Button>
    </>
  }
>
  <Paragraph>Weet u het zeker?</Paragraph>
</Dialog>
```

## Available Components

> Full props reference: read `references/components.md`

### Layout
`Grid` (`.Cell`) · `Column` · `Row` · `Breakout` (`.Cell`) · `Overlap` · `Page` · `Spotlight`

### Page Structure
`PageHeader` (`.GridCellNarrowWindowOnly`, `.MenuLink`) · `PageFooter` (`.Menu`, `.MenuLink`, `.Spotlight`)

### Typography
`Heading` · `Paragraph` · `Blockquote` · `Link` · `StandaloneLink` · `CallToActionLink` · `Mark`

### Buttons & Actions
`Button` · `IconButton` · `ActionGroup`

### Form Controls
`TextInput` · `TextArea` · `Select` (`.Group`, `.Option`) · `Checkbox` · `Radio` · `Switch` · `DateInput` · `TimeInput` · `PasswordInput` · `FileInput` · `SearchField` (`.Button`, `.Input`) · `CharacterCount`

### Form Structure
`Field` · `FieldSet` · `Label` · `Hint` · `ErrorMessage` · `InvalidFormAlert`

### Navigation
`Breadcrumb` (`.Link`) · `LinkList` (`.Link`) · `Menu` (`.Link`) · `Pagination` · `SkipLink` · `Tabs` (`.Button`, `.List`, `.Panel`) · `TableOfContents` (`.Link`, `.List`)

### Data Display
`Accordion` (`.Section`) · `Card` (`.Heading`, `.HeadingGroup`, `.Image`, `.Link`) · `DescriptionList` (`.Description`, `.Section`, `.Term`) · `Figure` (`.Caption`) · `Table` (`.Body`, `.Caption`, `.Cell`, `.Footer`, `.Header`, `.HeaderCell`, `.Row`) · `ImageSlider`

### Feedback
`Alert` · `Dialog` (`.open()`, `.close()`) · `Badge` · `Avatar`

### Utility
`Icon` · `Logo` · `FileList` (`.Item`) · `OrderedList` (`.Item`) · `UnorderedList` (`.Item`) · `ProgressList` (`.Step`, `.Substep`, `.Substeps`)

## Grid System

The AMS grid is responsive with 3 breakpoints:

| Breakpoint | Columns | Viewport | Padding |
|-----------|---------|----------|---------|
| **Narrow** | 4 | < 576px | `--ams-space-l` (24-36px) |
| **Medium** | 8 | 576px – 1023px | `--ams-space-xl` (36-60px) |
| **Wide** | 12 | ≥ 1024px | `--ams-space-2xl` (48-90px) |

### Grid.Cell `span` prop

```tsx
{/* Fixed span across all breakpoints */}
<Grid.Cell span={6}>Half width on wide</Grid.Cell>

{/* Full width */}
<Grid.Cell span="all">Full width row</Grid.Cell>

{/* Responsive spans: { narrow, medium, wide } */}
<Grid.Cell span={{ narrow: 4, medium: 4, wide: 8 }}>
  Responsive content
</Grid.Cell>

{/* Start position */}
<Grid.Cell span={6} start={4}>Offset cell</Grid.Cell>
<Grid.Cell span={{ narrow: 4, medium: 6, wide: 8 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
  Responsive offset
</Grid.Cell>
```

### Grid props

```tsx
<Grid
  as="main"                          // Semantic element
  paddingVertical="large"            // Vertical padding: 'large' | 'x-large' | '2x-large'
  gapVertical="large"               // Row gap: 'none' | 'large' | '2x-large'
>
```

## Content Spacing Patterns

Heading and Paragraph have no built-in margins. Spacing is controlled by parent containers.

### Uniform spacing
Use `Column` for equal gaps between all children:
```tsx
<Column gap="small">
  <Heading level={2}>Title</Heading>
  <Paragraph>First paragraph.</Paragraph>
  <Paragraph>Second paragraph.</Paragraph>
</Column>
```

### Article content with visual hierarchy
For mixed content where sections need more separation than elements within a section, nest `Column` components:

```tsx
<Column gap="large">
  <Column gap="small">
    <Heading level={1}>Page Title</Heading>
    <Paragraph>Intro paragraph.</Paragraph>
  </Column>

  <Column gap="small">
    <Heading level={2}>Section Title</Heading>
    <Paragraph>Section content.</Paragraph>
    <Paragraph>More content.</Paragraph>
  </Column>

  <Column gap="small">
    <Heading level={2}>Another Section</Heading>
    <Paragraph>Content here.</Paragraph>
  </Column>
</Column>
```

Outer `Column gap="large"` separates sections. Inner `Column gap="small"` keeps heading-to-paragraph spacing tight.

## Design Tokens

> Full token catalog: read `references/tokens.md`

The token system uses a 3-layer hierarchy. All tokens are CSS custom properties prefixed with `--ams-`.

```
Brand tokens  →  Common tokens  →  Component tokens
(core values)    (shared patterns)  (per-component)
```

**Reference chain example:**
```
Brand:     --ams-color-interactive-default: #004699
Common:    --ams-links-color: var(--ams-color-interactive-default)
Component: --ams-link-color: var(--ams-links-color)
```

### Key Token Categories

| Category | Prefix | Examples |
|----------|--------|---------|
| **Colors** | `--ams-color-` | `text`, `text-inverse`, `text-secondary`, `background`, `interactive`, `interactive-hover`, `feedback-error`, `feedback-success`, `separator` |
| **Spacing** | `--ams-space-` | `xs` (4-6px), `s` (8-12px), `m` (16-24px), `l` (24-36px), `xl` (36-60px), `2xl` (48-90px) — all fluid `clamp()` |
| **Typography** | `--ams-typography-` | `font-family` ('Amsterdam Sans', Arial, sans-serif), `body-text-font-size`, `body-text-line-height`, heading sizes per level |
| **Borders** | `--ams-border-width-` | `s` (1px), `m` (2px), `l` (3px), `xl` (4px) |
| **Focus** | `--ams-focus-` | `outline-offset` (4px) |

### Using Tokens in CSS

```css
.my-component {
  color: var(--ams-color-text);
  background: var(--ams-color-background);
  padding: var(--ams-space-m);
  font-family: var(--ams-typography-font-family);
  border: var(--ams-border-width-s) solid var(--ams-color-separator);
}
```

### Using Tokens in JS

```ts
import tokens from "@amsterdam/design-system-tokens/dist/index.json"
const primaryColor = tokens.ams.color.interactive.default // "#004699"
```

## Spacious vs Compact

| Aspect | Spacious (default) | Compact |
|--------|-------------------|---------|
| **Use for** | Public websites | Internal tools, dashboards |
| **Body text** | 18-20px fluid | 16px fixed |
| **H1** | 32-48px fluid | 24-28px fluid |
| **Line height** | 1.6 | 1.5 |
| **Space m** | 16-24px fluid | 12-16px fluid |
| **Space 2xl** | 48-90px fluid | 32-48px fluid |
| **Borders** | Thicker (m=2px, xl=4px) | Thinner (m=1px, xl=3px) |

**Decision rule:** Public-facing site → Spacious. Back-office/admin/dashboard → Compact.

**Setup difference — one extra import:**
```tsx
// Spacious (default)
import "@amsterdam/design-system-tokens/dist/index.css"

// Compact (add after tokens)
import "@amsterdam/design-system-tokens/dist/index.css"
import "@amsterdam/design-system-tokens/dist/compact.css"
```

Compact overrides the same CSS custom properties with smaller values. No code changes needed — components adapt automatically.

## Router Integration

AMS Link components render `<a>` by default. For SPA routing, use polymorphic rendering:

### Next.js (App Router)

```tsx
import NextLink from "next/link"
import { Link, Breadcrumb, Pagination } from "@amsterdam/design-system-react"

{/* Regular link */}
<Link href="/about" legacyBehavior passHref>
  <NextLink>Over ons</NextLink>
</Link>

{/* Or simpler: just use Next.js Link with AMS classes */}
<NextLink href="/about" className="ams-link">Over ons</NextLink>

{/* Pagination with router links */}
<Pagination
  totalPages={10}
  page={currentPage}
  linkTemplate={(page) => `/results?page=${page}`}
  linkComponent={NextLink}
/>

{/* PageHeader logo */}
<PageHeader
  brandName="Mijn Amsterdam"
  logoLink="/"
  logoLinkComponent={NextLink}
/>
```

### React Router

```tsx
import { Link as RouterLink } from "react-router-dom"
import { Link } from "@amsterdam/design-system-react"

<RouterLink to="/about" className="ams-link">Over ons</RouterLink>
```

## Tailwind v4 Integration

> Full bridge config: read `references/tailwind-bridge.md`

When using Tailwind CSS v4 alongside AMS, map AMS tokens to Tailwind's `@theme` so utilities use the design system values:

```css
/* app.css */
@import "tailwindcss";
@import "@amsterdam/design-system-assets/font/index.css";
@import "@amsterdam/design-system-css/dist/index.css";
@import "@amsterdam/design-system-tokens/dist/index.css";

/* Disable Tailwind's preflight — AMS CSS handles base styles */
@layer base {
  /* AMS body styles take precedence */
}

@theme {
  /* Map AMS spacing */
  --spacing-ams-xs: var(--ams-space-xs);
  --spacing-ams-s: var(--ams-space-s);
  --spacing-ams-m: var(--ams-space-m);
  --spacing-ams-l: var(--ams-space-l);
  --spacing-ams-xl: var(--ams-space-xl);
  --spacing-ams-2xl: var(--ams-space-2xl);

  /* Map AMS colors */
  --color-ams-text: var(--ams-color-text);
  --color-ams-text-secondary: var(--ams-color-text-secondary);
  --color-ams-text-inverse: var(--ams-color-text-inverse);
  --color-ams-bg: var(--ams-color-background);
  --color-ams-interactive: var(--ams-color-interactive);
  --color-ams-interactive-hover: var(--ams-color-interactive-hover);
  --color-ams-error: var(--ams-color-feedback-error);
  --color-ams-success: var(--ams-color-feedback-success);
  --color-ams-warning: var(--ams-color-feedback-warning);
  --color-ams-info: var(--ams-color-feedback-info);
  --color-ams-separator: var(--ams-color-separator);

  /* Map AMS font */
  --font-ams: var(--ams-typography-font-family);
}
```

**Usage rule:** Use AMS React components for all standard UI (buttons, forms, headings, grids, etc.). Use Tailwind utilities only for custom layout (flex, positioning) and one-off spacing that AMS components don't cover.

```tsx
{/* AMS component — always preferred */}
<Button variant="primary">Submit</Button>

{/* Tailwind for custom layout around AMS components */}
<div className="flex items-center gap-ams-m">
  <Icon svg={SearchIcon} />
  <Paragraph>Search results</Paragraph>
</div>
```

## Custom Components

When building components not in the AMS library, follow these conventions:

### BEM Naming

```css
/* Block: ams-status-badge */
.ams-status-badge { }
.ams-status-badge--active { }
.ams-status-badge__icon { }
.ams-status-badge__label { }
```

### Token-Only Styling

```css
.ams-status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--ams-space-xs);
  padding-block: var(--ams-space-xs);
  padding-inline: var(--ams-space-s);
  font-family: var(--ams-typography-font-family);
  font-size: var(--ams-typography-body-text-small-font-size);
  line-height: var(--ams-typography-body-text-small-line-height);
  border: var(--ams-border-width-s) solid var(--ams-color-separator);
  /* NO hardcoded colors, sizes, or spacing */
}
```

### Component Pattern

```tsx
import { forwardRef } from "react"
import clsx from "clsx"

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "active" | "inactive" | "pending"
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, className, children, ...restProps }, ref) => (
    <span
      ref={ref}
      className={clsx("ams-status-badge", `ams-status-badge--${status}`, className)}
      {...restProps}
    >
      {children}
    </span>
  )
)

StatusBadge.displayName = "StatusBadge"
```

### Checklist for Custom Components

- [ ] Uses `forwardRef`
- [ ] Extends relevant HTML element attributes
- [ ] Uses `clsx` for className composition
- [ ] Spreads `...restProps` on root element
- [ ] BEM classes with `ams-` prefix
- [ ] All styling via `--ams-*` tokens (no hardcoded values)
- [ ] Sets `displayName`

## TypeScript Patterns

### Prop Types

```tsx
// Intersect with HTML attributes
interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: "primary" | "secondary"
}

// For form elements
interface MyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}
```

### Compound Component Export

```tsx
// Following AMS pattern with Object.assign
const ListRoot = forwardRef<HTMLUListElement, ListProps>(/* ... */)
const ListItem = forwardRef<HTMLLIElement, ListItemProps>(/* ... */)

export const List = Object.assign(ListRoot, { Item: ListItem })
// Usage: <List><List.Item>...</List.Item></List>
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong import order | Fonts → CSS → Tokens (always) |
| Missing `ams-body` class | Add to `<body>` or root element |
| Hardcoded colors (`#004699`) | Use `var(--ams-color-interactive)` |
| Hardcoded spacing (`16px`) | Use `var(--ams-space-m)` |
| Using `font-weight: 700` for bold | Use `800` or `var(--ams-typography-body-text-bold-font-weight)` |
| Setting `font-size: 62.5%` on html | Don't — AMS uses rem values calibrated to 16px base |
| Missing `invalid` prop on both Field and input | Both `<Field invalid>` and `<TextInput invalid>` need it |
| Using `<h1>` instead of `<Heading level={1}>` | Always use AMS Heading component |
| Missing `aria-controls` on `Tabs.Button` | Required prop — must match `Tabs.Panel` id |
| Using Tailwind `bg-blue-500` instead of AMS tokens | Use `bg-ams-interactive` or AMS component |
| Using deprecated `PageHeading` | Use `<Heading level={1}>` — PageHeading is deprecated |
| Heading and paragraph with same spacing | Wrap content sections in nested `Column` — `gap="large"` between sections, `gap="small"` within |
| Output looks like a wireframe | Read `references/aesthetic-discipline.md`, commit to a dominant + one accent token before writing JSX |
| Every section has the same `paddingVertical` and `span` | Vary rhythm — alternate dense (`large`) and airy (`x-large`/`2x-large`); use asymmetric spans with `start={}` |
| Scaffolding from scratch with Next.js or vanilla Vite | Use `assets/starter-vite-react/` — Bun + Vite + React Router + Tanstack Query is the real-world target |
| Reaching for `shadcn/ui` for a Popover/DropdownMenu/Tooltip | ADS does not ship those — use `@radix-ui/react-*` headless primitives styled with AMS tokens (see `references/components.md` § "Components ADS Does Not Ship") |

## Icon Usage

> Full icon catalog and naming conventions: read `references/icons.md`

Icons are visual symbols for quick communication. They must always be wrapped in the `Icon` component for consistent sizing and alignment. The icon set ships in `@amsterdam/design-system-react-icons` (345+ icons, v2.0.0+).

### Basic Usage

```tsx
import { Icon, Button, IconButton } from "@amsterdam/design-system-react"
import { SearchIcon, CloseIcon, NotificationIcon } from "@amsterdam/design-system-react-icons"

{/* Standalone decorative icon — hidden from assistive tech by default */}
<Icon svg={SearchIcon} />

{/* Sized to match text */}
<Icon svg={SearchIcon} size="large" />          {/* matches large body text */}
<Icon svg={SearchIcon} size="heading-3" />       {/* matches heading level 3 */}

{/* Inverse color for dark backgrounds */}
<Icon svg={SearchIcon} color="inverse" />

{/* Square bounding box (useful for alignment in grids) */}
<Icon svg={SearchIcon} square />

{/* Button with icon (icon appears after text by default) */}
<Button icon={SearchIcon}>Zoeken</Button>
<Button icon={SearchIcon} iconBefore>Zoeken</Button>

{/* Icon-only button — label is REQUIRED for accessibility */}
<IconButton svg={CloseIcon} label="Sluiten" />
```

### Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `svg` | `Function \| ReactNode` | required | Icon component from the icon package or custom SVG |
| `size` | `'small' \| 'large' \| 'heading-1' \| 'heading-2' \| 'heading-3' \| 'heading-4' \| 'heading-5'` | — | Size aligned to text line heights |
| `color` | `'inverse'` | — | White icon for dark backgrounds |
| `square` | `boolean` | `false` | Square bounding box |

### Icons With Other Components

```tsx
import { StandaloneLink, Badge } from "@amsterdam/design-system-react"
import { SearchIcon, StarIcon } from "@amsterdam/design-system-react-icons"

<StandaloneLink href="/search" icon={SearchIcon}>Zoek op de website</StandaloneLink>
<Badge label="Nieuw" icon={StarIcon} color="azure" />
```

### v2.0.0 Renames (Breaking)

These icons were renamed in v2.0.0 — use the new names:

| Old name | New name |
|----------|----------|
| `BellIcon` / `BellFillIcon` | `NotificationIcon` / `NotificationFillIcon` |
| `PersonCircleIcon` / `PersonCircleFillIcon` | `UserAccountIcon` / `UserAccountFillIcon` |
| `TrashBinIcon` | `DeleteIcon` |
| `CogwheelIcon` | `SettingsIcon` |
| `CheckMarkCircleIcon` | `SuccessIcon` |

### Custom SVGs

```tsx
{/* Must use viewBox="0 0 24 24" and fill="currentColor" */}
<Icon svg={
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
} />
```

### Guidelines

- Icons accompany text in buttons and links — standalone icons only for universal conventions (hamburger menu, search, playback controls)
- Default color: black/white matching container. Interactive state: blue. Disabled: grey
- Icons align left of text, vertically centered to the first line
- The `Icon` component sets `hidden` on the `<span>` — icons are decorative by default. For meaningful icons, use `IconButton` with a `label` prop
- WCAG contrast requirements apply to icons same as typography

## Reference Files

For detailed API docs, token catalogs, and templates, read the reference files in `references/`:

- **`aesthetic-discipline.md`** — How to apply frontend-design principles (typography hierarchy, color commitment, motion, composition, depth) within ADS constraints. **Read this before writing JSX on any non-trivial UI task.**
- **`components.md`** — Full props and code examples for each component, plus the Radix primitives section for components ADS does not ship
- **`tokens.md`** — Complete `--ams-*` token catalog with values for both modes
- **`layout-patterns.md`** — Page layout templates (public site, dashboard, form page, React Router + AppLayout outlet)
- **`tailwind-bridge.md`** — Complete Tailwind v4 + AMS integration guide (Vite plugin, compact tokens, motion)
- **`icons.md`** — Icon catalog from `@amsterdam/design-system-react-icons`

**Assets:**

- **`assets/starter-vite-react/`** — Runnable Bun + Vite + React + TS starter with ADS pre-configured in Compact mode. See the "Scaffold a New App" section above.
