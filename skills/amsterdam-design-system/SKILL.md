---
name: amsterdam-design-system
description: >
  Amsterdam Design System (ADS, designsystem.amsterdam) for Gemeente Amsterdam
  web UI built with React or plain HTML/CSS. Use when building or reviewing
  pages, layouts, forms, dashboards or components for the City of Amsterdam,
  or when code imports @amsterdam/design-system-react, -css, -tokens, -assets
  or -react-icons. Covers components and props, --ams-* design tokens, ams-
  BEM classes, the Amsterdam Sans font, the 4/8/12-column Grid, Spacious,
  Compact and Lo-fi modes, routing links, icons, and a Tailwind v4 bridge.
  For Amsterdam web UI, use this instead of generic libraries such as
  Material UI, shadcn/ui, Chakra or Ant Design. Not for native mobile apps,
  print or non-Amsterdam projects.
---

<!-- ADS-VERSION: tokens=4.4.0 react=4.5.0 css=4.5.0 assets=2.7.0 icons=2.3.0 -->

# Amsterdam Design System

> **Supported versions** (last updated 2026-10-27):
> | Package | Version |
> |---------|---------|
> | `@amsterdam/design-system-tokens` | **v4.4.0** |
> | `@amsterdam/design-system-react` | **v4.5.0** |
> | `@amsterdam/design-system-css` | **v4.5.0** |
> | `@amsterdam/design-system-assets` | **v2.7.0** |
> | `@amsterdam/design-system-react-icons` | **v2.3.0** |

> **Use ADS for all Amsterdam web UI.** Build pages, layouts and visual elements from Amsterdam Design System components and `--ams-*` tokens. Do not mix in Material UI, shadcn/ui, Chakra UI, Ant Design or another component library. Without React, use the ADS CSS classes (`ams-*`) on plain HTML. When scaffolding, install and configure the `@amsterdam/design-system-*` packages first.

Production guidance for building City of Amsterdam digital products using the official design system. Components, tokens, layout patterns, and integration with Tailwind CSS v4.

> **Docs (Storybook):** https://designsystem.amsterdam/
> **Release notes:** https://designsystem.amsterdam/?path=/docs/docs-release-notes--docs
> **Repo:** https://github.com/Amsterdam/design-system
> **MCP server:** `https://main--68db9df886b46f139748c074.chromatic.com/mcp` (Streamable HTTP, public). Exposes the real components, props, stories and docs of the current release. If your tool has it connected, query it (`list-all-documentation`, `get-documentation`) before guessing a prop. See the [AI assistance guide](https://designsystem.amsterdam/?path=/docs/docs-guidelines-ai-assistance--docs).

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

> For briefs that are open-ended about style ("polished", "modern"), see the house-style notes in `references/aesthetic-discipline.md` before writing JSX.

## Aesthetic Discipline (house style, not ADS guidance)

ADS gives you the materials; `references/aesthetic-discipline.md` is this skill's own guidance on using them so a page does not look like a wireframe. It is **opinion, not ADS documentation** — follow ADS docs where they differ. For open-ended briefs ("polished", "modern"), answer in one sentence each before writing JSX:

1. **Dominant color** — which `--ams-color-*` token covers most of the canvas?
2. **Accent** — which `--ams-color-highlight-*` token, used on a few elements only?
3. **Rhythm** — which sections are dense (`paddingVertical="large"`), which airy (`"2x-large"`)?
4. **Focal point** — is there one element (a `<Breakout>`, `<Overlap>` or asymmetric `start={}`) that anchors the page?

Amsterdam Sans, `--ams-*` tokens and the 4/8/12 Grid stay mandatory. If a separate `frontend-design` skill is installed (this repo vendors it via `skills-lock.json`), its principles apply but its font, grid and palette advice does not.

## Overview

The design system ships as 5 npm packages:

| Package | Purpose |
|---------|---------|
| `@amsterdam/design-system-assets` | Amsterdam Sans font files |
| `@amsterdam/design-system-css` | BEM component styles (`ams-*` classes) |
| `@amsterdam/design-system-tokens` | CSS custom properties (`--ams-*`) in Spacious + Compact modes |
| `@amsterdam/design-system-react` | React components (70 exported, all with `forwardRef`) |
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

Add the `ams-body` class to your body or root element, and declare the viewport with `viewport-fit=cover` so Grid, PageHeader, PageFooter and Menu keep clear of a display cutout (never add `maximum-scale` or `user-scalable=no`):

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

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

### Font Weights

Body text is weight 400; bold text and headings are weight 700 (Amsterdam Sans Bold, since tokens v4.1.0). Use the tokens rather than numbers:

```css
.your-root {
  font-weight: var(--ams-typography-body-text-font-weight); /* 400 */
}
.your-root strong, .your-root b {
  font-weight: var(--ams-typography-body-text-bold-font-weight); /* 700 */
}
```

Other weights have their own tokens: `--ams-typography-body-text-light-font-weight` (300), `-extra-bold-font-weight` (800), `-black-font-weight` (900). Headings use `--ams-typography-heading-font-weight` (700).

## Scaffold a New App

For a new standalone React app, **do not re-invent the setup**. Use the runnable starter at `assets/starter-vite-react/`. It ships:

- **Vite 8** + `@vitejs/plugin-react-swc` (Bun scripts, but `npm` works the same)
- **React Router v7** with an `<AppLayout>` outlet pattern
- **Tanstack Query v5** pre-wired in `App.tsx`
- **Tailwind v4** via `@tailwindcss/vite`, with the AMS bridge in `tailwind.config.js` and preflight left out (only `tailwindcss/theme` + `tailwindcss/utilities` are imported)
- **ADS React/CSS v4.5.0, tokens v4.4.0** in **Compact mode** (switch to Spacious for public sites, see below)
- **CVA + clsx + tailwind-merge** for custom component variants
- **`tw-animate-css`** + an optional `.ams-reveal` page-load animation (house style, not ADS)
- A sample `HomePage.tsx` that exercises every principle from `references/aesthetic-discipline.md`

### How to use

```bash
# <skill-dir> = the directory containing this SKILL.md
cp -r <skill-dir>/assets/starter-vite-react ./<project-name>
cd ./<project-name>
bun install && bun run dev    # or: npm install && npm run dev
```

Then:
1. Replace `src/pages/HomePage.tsx` with the user's actual page.
2. Pass `RouterLink` (`src/lib/RouterLink.tsx`) as `linkComponent` on internal links.
3. Add routes in `src/router.tsx` as the app grows.

### Switching to Spacious mode

For public-facing sites (amsterdam.nl-style), remove **one** import from `src/styles/index.css`:

```diff
- @import "@amsterdam/design-system-tokens/dist/compact.css" layer(ams);
```

And swap the `tailwind.config.js` import from `compact.json` to `index.json`. That is the only change.

### When NOT to use the starter

- **Adding pages to an existing Amsterdam app** — open the existing app and follow its conventions.
- **Next.js projects** — the starter is a Vite SPA. Next.js is a recommended stack for full applications (see the `developers-amsterdam` skill); follow the import order in "Setup" above, pass `NextLink` as `linkComponent`, and apply `references/tailwind-bridge.md` if you use Tailwind.
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
import { ActionGroup, Button, Dialog, Paragraph } from "@amsterdam/design-system-react"

{/* open() takes a CSS selector — include the # */}
<Button onClick={() => Dialog.open("#confirm-dialog")}>Open Dialog</Button>

<Dialog
  id="confirm-dialog"
  heading="Bevestiging"
  footer={
    <ActionGroup>
      {/* close is a click handler: pass it, don't call it */}
      <Button variant="primary" onClick={Dialog.close}>Bevestigen</Button>
      <Button variant="secondary" onClick={Dialog.close}>Annuleren</Button>
    </ActionGroup>
  }
>
  <Paragraph>Weet u het zeker?</Paragraph>
</Dialog>
```

`Dialog` is for short confirmations, yes/no questions and brief reminders. For a task with several fields or longer content, use `ModalDialog` in an application, or a page of its own on a public website (see `references/components.md` § ModalDialog).

## Available Components

> Full props reference: read `references/components.md`

### Layout
`Grid` (`.Cell`, `.Subgrid`) · `Column` · `Row` · `Breakout` (`.Cell`) · `Overlap` · `Page` · `Spotlight`

### Page Structure
`PageHeader` (`.GridCellNarrowWindowOnly`, `.MenuLink`) · `PageFooter` (`.Menu`, `.MenuLink`, `.Spotlight`)

### Typography
`Heading` · `Paragraph` · `Blockquote` · `Link` · `StandaloneLink` · `CallToActionLink` · `Mark` · `Metadata`

### Buttons & Actions
`Button` · `IconButton` · `ActionGroup`

### Form Controls
`TextInput` · `TextArea` · `Select` (`.Group`, `.Option`) · `Checkbox` · `Radio` · `Switch` · `DateInput` · `KnownDateInput` (`.Day`, `.Month`, `.Year`) · `DatePicker` · `TimeInput` · `PasswordInput` · `FileInput` · `SearchField` (`.Button`, `.Input`) · `FormFieldStatus` (`.CharacterCount`) · ~~`CharacterCount`~~ (deprecated)

### Form Structure
`Field` · `FieldSet` · `Label` · `Hint` · `ErrorMessage` · `InvalidFormAlert`

### Navigation
`Breadcrumb` (`.Link`) · `LinkList` (`.Link`) · `Menu` (`.Link`) · `Pagination` · `SkipLink` · `Tabs` (`.Button`, `.List`, `.Panel`) · `TabNavigation` (`.List`, `.Link`) · `TableOfContents` (`.Link`, `.List`) · `Calendar`

### Data Display
`Accordion` (`.Section`) · `Card` (`.Content`, `.Heading`, `.HeadingGroup`, `.Image`, `.Link`) · `DataList` (`.Item`, `.Key`, `.Value`, `.Actions`) · `DescriptionList` (`.Item`, `.Term`, `.Description`) · `Figure` (`.Caption`) · `Image` · `Table` (`.Body`, `.Caption`, `.Cell`, `.Footer`, `.Header`, `.HeaderCell`, `.Row`) · `ImageSlider`

### Feedback
`Alert` · `Dialog` (`.open()`, `.close()`) · `ModalDialog` (`.Header`, `.Body`, `.Footer`, `.open()`, `.close()`) · `Badge` · `Avatar` · `Skeleton` (`.Heading`, `.Paragraph`, `.List`, `.Image`, `.Table`)

### Utility
`Icon` · `Logo` · `FileList` (`.Item`) · `OrderedList` (`.Item`) · `UnorderedList` (`.Item`) · `ProgressList` (`.Step`, `.Substep`, `.Substeps`)

## Grid System

| Breakpoint | Columns | Viewport | Padding (Spacious) |
|-----------|---------|----------|---------|
| **Narrow** | 4 | < 600px (37.5rem) | `--ams-space-l` (24-36px) |
| **Medium** | 8 | 600px – 1159px | `--ams-space-xl` (36-60px) |
| **Wide** | 12 | ≥ 1160px (72.5rem) | `--ams-space-2xl` (48-90px) |

```tsx
<Grid as="main" paddingVertical="large" gapVertical="large">    {/* or paddingTop / paddingBottom, not both */}
  <Grid.Cell span="all">Full width</Grid.Cell>
  <Grid.Cell span={{ narrow: 4, medium: 6, wide: 8 }} start={{ narrow: 1, medium: 2, wide: 3 }}>Responsive offset</Grid.Cell>
</Grid>
```

`paddingVertical`: `'large' | 'x-large' | '2x-large'` · `gapVertical`: `'none' | 'large' | '2x-large'`. Row placement, `appearance`, `Grid.Subgrid` and list grids (`as="ul"`): `references/components.md` § Grid.

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

All tokens are CSS custom properties prefixed `--ams-`, in three layers: brand (`--ams-color-interactive: #004699`) → common (`--ams-links-color`) → component (`--ams-link-color`). Key brand families: `--ams-color-*` (`text`, `text-secondary`, `background`, `interactive`, `feedback-*`, `highlight-*`, `separator`), `--ams-space-xs…2xl` (fluid `clamp()`), `--ams-typography-*`, `--ams-border-width-s…xl`, `--ams-focus-outline-offset`.

```css
.my-component {
  color: var(--ams-color-text);
  padding: var(--ams-space-m);
  font-family: var(--ams-typography-font-family);
  border: var(--ams-border-width-s) solid var(--ams-color-separator);
}
```

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
| **Space xl** | 36-60px fluid | 20-32px fluid |
| **Space 2xl** | 48-90px fluid | 24-40px fluid |
| **Borders** | Thicker (m=2px, xl=4px) | Thinner (m=1px, xl=3px) |
| **Page background** | White | Grey (`--ams-color-background-body`, #e8e8e8); `Grid.Cell`s are white with `--ams-space-m` padding (`appearance="flush"` drops the padding, `"transparent"` also the background) |

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

### Lo-fi Mode

Lo-fi Mode (CSS v4.4.0+) strips a page to a wireframe — for discussing structure before styling. Import it after the tokens, plus its font:

```tsx
import "@amsterdam/design-system-tokens/dist/index.css"
import "@amsterdam/design-system-tokens/dist/lo-fi.css"
import "@amsterdam/design-system-assets/font/lo-fi/index.css"
```

Using the `.ams-theme` class instead of `:root`? Pair `index.theme.css` with `compact.theme.css` or `lo-fi.theme.css`, and add `ams-theme--compact` or `ams-theme--lo-fi` to the element that carries `ams-theme`.

## Router Integration

AMS Link components render `<a>` by default. For SPA routing, use polymorphic rendering:

### Next.js (App Router)

```tsx
import NextLink from "next/link"
import { Link, Breadcrumb, Pagination } from "@amsterdam/design-system-react"

{/* Every ADS link component accepts a linkComponent (React v4.2.0+) */}
<Link href="/about" linkComponent={NextLink}>Over ons</Link>

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

React Router's `Link` takes `to`, not `href`, so pass a small adapter built on `useHref` + `useLinkClickHandler` from `react-router` (v7). Copy `assets/starter-vite-react/src/lib/RouterLink.tsx`:

```tsx
import { Link, StandaloneLink } from "@amsterdam/design-system-react"
import { RouterLink } from "@/lib/RouterLink"

<Link href="/about" linkComponent={RouterLink}>Over ons</Link>
<StandaloneLink href="/meedoen" linkComponent={RouterLink}>Meedoen</StandaloneLink>
```

Define the `linkComponent` at module level (or with `useCallback`) — an inline arrow remounts the link on every render. Full pattern: `references/layout-patterns.md` § "Routing links".

## Tailwind v4 Integration

> Full bridge config (imports, `@theme` / JS mapping, compact tokens, motion): read `references/tailwind-bridge.md`

- Import `tailwindcss/theme` and `tailwindcss/utilities` separately — **not** `@import "tailwindcss"`, which pulls in preflight and fights ADS base styles. (`corePlugins.preflight` does nothing in v4.)
- Map `--ams-*` tokens to Tailwind (`--spacing-ams-m: var(--ams-space-m)`, `--color-ams-interactive: var(--ams-color-interactive)`, …) so utilities like `gap-ams-m` and `bg-ams-interactive` stay on-token.
- Use ADS components for standard UI; use Tailwind only for custom layout (flex, positioning) and one-off spacing around them.

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
- [ ] BEM classes with `ams-` prefix **— OR — token-mapped Tailwind utilities (see Tailwind-bridge alternative below)**
- [ ] All styling via `--ams-*` tokens (no hardcoded values)
- [ ] Sets `displayName`

### Tailwind-bridge alternative (when `tailwind-bridge.md` is in use)

When the project ships with the Tailwind + ADS bridge configured (see `references/tailwind-bridge.md` and the starter at `assets/starter-vite-react/`), the BEM-class root is **optional**. You may instead compose the same `--ams-*` tokens through CVA variants and Tailwind utilities mapped in `tailwind.config.js`. The token-only rule still holds — only `--ams-*`-backed utilities are allowed, never raw hex/px.

The runnable example is `assets/starter-vite-react/src/components/StatCard.tsx`: a `forwardRef` component that uses `cva()` for the variant matrix and `cn()` (clsx + tailwind-merge) for class composition, with every color/spacing utility (`bg-ams-bg`, `border-ams-separator`, `p-ams-m`, `border-l-ams-magenta`, …) backed by an `--ams-*` token in `tailwind.config.js`. Pick this path when you want a CVA variant API; pick the BEM/CSS path when you need shared styles outside React or want a hand-written stylesheet to reason about.

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
| Hardcoding a font weight (`800`, `bold`) | Use `var(--ams-typography-body-text-bold-font-weight)` (700) or `--ams-typography-heading-font-weight` |
| Setting `font-size: 62.5%` on html | Don't — AMS uses rem values calibrated to 16px base |
| Missing `invalid` prop on both Field and input | Both `<Field invalid>` and `<TextInput invalid>` need it |
| Using `<h1>` instead of `<Heading level={1}>` | Always use AMS Heading component |
| Missing `aria-controls` on `Tabs.Button` | Required prop — must match `Tabs.Panel` id |
| Using Tailwind `bg-blue-500` instead of AMS tokens | Use `bg-ams-interactive` or AMS component |
| Using `PageHeading` | Removed in v4.0.0 — use `<Heading level={1}>` |
| Heading and paragraph with same spacing | Wrap content sections in nested `Column` — `gap="large"` between sections, `gap="small"` within |
| `Dialog` for a form or long content | Use `ModalDialog` (applications) or a separate page (public websites) |
| `Dialog.open("my-id")` / `onClick={() => Dialog.close()}` | `Dialog.open("#my-id")` / `onClick={Dialog.close}` |
| Inline `linkComponent={(p) => <a {...p} />}` | Use a module-level component (e.g. the starter's `RouterLink`) |
| Guessing an icon or prop name | Check `references/icons.md` / `references/components.md`, or the ADS MCP server |
| Reaching for `shadcn/ui` for a Popover/DropdownMenu/Tooltip | ADS does not ship those. If you must add one, a headless library styled with `--ams-*` tokens conflicts least (see `references/components.md` § "Components ADS Does Not Ship") |

## Icon Usage

> Full catalogue (generated from the package), props, deprecated names and guidelines: read `references/icons.md`

```tsx
import { Button, Icon, IconButton } from "@amsterdam/design-system-react"
import { CloseIcon, SearchIcon } from "@amsterdam/design-system-react-icons"

<Icon svg={SearchIcon} size="heading-3" />          {/* decorative: the Icon span is hidden from assistive tech */}
<Button icon={SearchIcon} iconBefore>Zoeken</Button>
<IconButton svg={CloseIcon} label="Sluiten" />      {/* icon-only: label is required */}
```

Only use icon names from `references/icons.md` — do not guess. Deprecated names (`BellIcon`, `CogwheelIcon`, `PencilIcon`, …) still export; use their replacements.

## Reference Files

For detailed API docs, token catalogs, and templates, read the reference files in `references/`:

- **`aesthetic-discipline.md`** — House-style guidance (not ADS documentation) on typography hierarchy, colour commitment, motion and composition within ADS constraints
- **`components.md`** — Full props and code examples for each component, plus the Radix primitives section for components ADS does not ship
- **`tokens.md`** — Complete `--ams-*` token catalog with values for both modes
- **`layout-patterns.md`** — Page layout templates (public site, dashboard, form page, React Router + AppLayout outlet)
- **`tailwind-bridge.md`** — Complete Tailwind v4 + AMS integration guide (Vite plugin, compact tokens, motion)
- **`icons.md`** — Icon usage, props and the generated catalogue from `@amsterdam/design-system-react-icons`

**Assets:**

- **`assets/starter-vite-react/`** — Runnable Bun + Vite + React + TS starter with ADS pre-configured in Compact mode. See the "Scaffold a New App" section above.
