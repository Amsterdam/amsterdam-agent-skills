# Amsterdam React Starter

A runnable Vite + React + TypeScript scaffold pre-wired with the Amsterdam Design System (ADS) in **Compact mode**, React Router v7, Tanstack Query v5, and Tailwind v4 + ADS bridge.

This starter is the canonical "new app" shape for Gemeente Amsterdam internal tools. Copy the whole tree, run `bun install`, and adapt `src/pages/HomePage.tsx` to your domain. Do not re-invent the setup — every config file here solves a real footgun.

## Quickstart

```bash
cp -r path/to/this/starter ./my-app
cd ./my-app
bun install
bun run dev
```

Open <http://localhost:5173>.

> **No Bun?** Replace `bun install` with `npm install`, `bun run dev` with `npm run dev`. The scripts in `package.json` use plain `vite` / `tsc` so they work with any package manager. The `packageManager` field is a hint, not a hard requirement.

## What's wired

| Concern | Choice | Why |
|---|---|---|
| Bundler | **Vite 8** + `@vitejs/plugin-react-swc` | Fast dev server and build for a client-side SPA. For a full application with SSR, Next.js is also a recommended stack (see `developers-amsterdam`). |
| Routing | **React Router v7** (`react-router`, `createBrowserRouter`) | Listed in the Amsterdam tech stack for SPAs. Outlet-based layouts compose cleanly with ADS Page. |
| Data | **Tanstack Query v5** | Pre-wired in `src/App.tsx`. Sample query in `src/pages/HomePage.tsx`. |
| Styling | **Tailwind v4** via `@tailwindcss/vite` | Mapped to AMS tokens in `tailwind.config.js`. Preflight left out (only `tailwindcss/theme` + `utilities` imported) — ADS needs no reset. |
| Mode | **Compact** (`compact.css` imported) | ADS's mode for applications and internal tools. For a public website, switch to Spacious by deleting one line — see "Switching to Spacious mode" below. |
| Component variants | **CVA** + `clsx` + `tailwind-merge` | See `src/components/StatCard.tsx` and `src/lib/cn.ts`. |
| Animation | **`tw-animate-css`** + an optional page-load reveal in `src/styles/reveal.css` | House style, not ADS guidance. Apply `.ams-reveal` to top-level Grid cells if you want it; delete it otherwise. |

## File map

```
.
├── index.html                    # Root HTML, <html lang="nl">, <body class="ams-body">
├── package.json
├── tsconfig.json                 # Strict mode, paths alias @/* → src/*
├── vite.config.ts                # SWC + Tailwind plugin + @ alias
├── tailwind.config.js            # Imports compact.json (bridge config)
├── eslint.config.js              # Flat config, React + hooks + refresh
├── bunfig.toml
├── .env.example                  # VITE_PUBLIC_API_URL placeholder
└── src/
    ├── main.tsx                  # createRoot + StrictMode + import styles
    ├── App.tsx                   # RouterProvider + QueryClientProvider
    ├── router.tsx                # createBrowserRouter, AppLayout root, sample route
    ├── query.ts                  # QueryClient with sane defaults
    ├── styles/
    │   ├── index.css             # @layer order + AMS imports + @theme bridge
    │   └── reveal.css             # Page-load stagger from aesthetic-discipline.md
    ├── layouts/
    │   └── AppLayout.tsx         # <Page> + PageHeader + <Outlet/> + PageFooter
    ├── pages/
    │   ├── HomePage.tsx          # Worked example exercising every discipline principle
    │   └── NotFoundPage.tsx
    ├── components/
    │   └── StatCard.tsx          # CVA-based custom component, token-only styling
    └── lib/
        └── cn.ts                 # clsx + tailwind-merge helper
```

## How HomePage.tsx is built

`src/pages/HomePage.tsx` is the worked example from `references/aesthetic-discipline.md` (house style, not ADS guidance). It exercises the four checklist questions plus optional motion:

1. **Dominant color** — `--ams-color-background` (white) plus one `<Spotlight color="azure">` hero band.
2. **Sharp accent** — `--ams-color-highlight-magenta` used on exactly three elements: the hero Badge, the first StatCard's left border, and the newsletter CTA Button.
3. **Rhythm** — `paddingVertical="2x-large"` on the hero, `"large"` on the KPI strip and newsletter, `"x-large"` on the body.
4. **Focal point** — the off-center editorial column at `start={2} span={7}` on wide, plus one `<Breakout>` band.
5. *Optional motion* — `.ams-reveal` cascade on the four hero Grid cells (respects `prefers-reduced-motion`).

When you replace HomePage with your own page, the checklist in `references/aesthetic-discipline.md` → "The Discipline Checklist" can help on open-ended briefs.

## Switching to Spacious mode

For public-facing sites (amsterdam.nl-style pages), remove the compact override:

```diff
  // src/styles/index.css
  @import "@amsterdam/design-system-tokens/dist/index.css" layer(ams);
- @import "@amsterdam/design-system-tokens/dist/compact.css" layer(ams);
```

Also swap the compact tokens import in `tailwind.config.js`:

```diff
- import compactTokens from "@amsterdam/design-system-tokens/dist/compact.json"
- const { ams } = compactTokens
+ import tokens from "@amsterdam/design-system-tokens/dist/index.json"
+ const { ams } = tokens
```

That's it. Spacing, typography, and borders all scale up automatically.

## Adding optional dependencies

The starter is minimal on purpose. Add these only when you need them:

### Tanstack Table — for sortable/filterable data tables
```bash
bun add @tanstack/react-table
```
See `references/components.md` → "Components ADS does not ship — use Radix primitives" for the wrapping pattern. Wrap rows in ADS `<Table>` markup; let Tanstack handle state.

### Headless primitives — for components ADS doesn't cover (suggestion, not ADS guidance)
ADS does not ship a Popover, DropdownMenu, Tooltip, or ContextMenu. Check first whether an ADS pattern covers the need (see `references/components.md` → "Components ADS Does Not Ship"). If not, a headless library such as Radix, styled with AMS tokens, conflicts least:
```bash
bun add @radix-ui/react-popover @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
```
Never reach for `shadcn/ui` directly — its design tokens conflict with ADS.

### MSAL — for Azure AD authentication
If your internal tool signs users in with Azure AD (Entra ID): The pattern is documented in `references/layout-patterns.md` → "React Router + AppLayout outlet". Add:
```bash
bun add @azure/msal-browser @azure/msal-react
```
Then wrap the `RouterProvider` in `<MsalProvider>` inside `src/App.tsx`, and add an `AuthGate` outlet wrapper in `src/router.tsx`.

### Application Insights — for telemetry
```bash
bun add @microsoft/applicationinsights-web @microsoft/applicationinsights-react-js
```
See the `appinsights-instrumentation` skill for setup.

## Customizing the navigation

Every ADS link component takes a router link (ADS React v4.2.0+): `linkComponent` on `Link`, `StandaloneLink`, `Breadcrumb.Link`, `Card.Link`, `LinkList.Link`, `Menu.Link`, `PageHeader.MenuLink`, `PageFooter.MenuLink`, `TabNavigation.Link`, `TableOfContents.Link`, `CallToActionLink`, `SkipLink` and `Pagination`, and `logoLinkComponent` on `PageHeader`.

ADS passes `href` and other anchor attributes straight through, so the starter ships one shared adapter, `src/lib/RouterLink.tsx`, built on React Router's `useHref` + `useLinkClickHandler` (the pattern from the [ADS routing guide](https://designsystem.amsterdam/?path=/docs/docs-guidelines-routing-libraries--docs)). Use it on every internal link:

```tsx
<StandaloneLink href="/meedoen" linkComponent={RouterLink}>Bekijk de agenda</StandaloneLink>
```

Keep the `linkComponent` stable: import the module-level `RouterLink`, never write `linkComponent={(p) => <a {...p} />}` inline — that remounts the link on every render. Refs are only forwarded to a plain anchor, not to a custom `linkComponent`.

## Verification

Before committing:

```bash
bun run typecheck   # tsc --noEmit
bun run lint        # eslint .
bun run build       # tsc + vite build
```

The build should succeed and `dist/index.html` should reference Amsterdam Sans.

## Cross-references

- `../../SKILL.md` — mechanical rules, component overview, common mistakes
- `../../references/aesthetic-discipline.md` — translate frontend-design principles into ADS materials
- `../../references/components.md` — full props for the ADS components (React v4.5.0)
- `../../references/tokens.md` — complete `--ams-*` token catalog
- `../../references/tailwind-bridge.md` — full Tailwind + AMS integration guide
- `../../references/layout-patterns.md` — page templates for common Amsterdam project types
