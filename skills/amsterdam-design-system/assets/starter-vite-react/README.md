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
| Bundler | **Vite 6** + `@vitejs/plugin-react-swc` | What real Amsterdam apps use. Faster than Webpack/Next, simpler than Turbopack. |
| Routing | **React Router v7** (`createBrowserRouter`) | What real Amsterdam apps use. Outlet-based layouts compose cleanly with ADS Page. |
| Data | **Tanstack Query v5** | Pre-wired in `src/App.tsx`. Sample query in `src/pages/HomePage.tsx`. |
| Styling | **Tailwind v4** via `@tailwindcss/vite` | Mapped to AMS tokens in `tailwind.config.js`. Preflight disabled — AMS provides its own reset. |
| Mode | **Compact** (`compact.css` imported) | Most Amsterdam apps are internal tools. To switch to Spacious, delete one line — see "Switching to Spacious mode" below. |
| Component variants | **CVA** + `clsx` + `tailwind-merge` | See `src/components/StatCard.tsx` and `src/lib/cn.ts`. |
| Animation | **`tw-animate-css`** + the page-load reveal in `src/styles/reveal.css` | Wired up — apply `.ams-reveal` to top-level Grid cells. |

## File map

```
.
├── index.html                    # Root HTML, <html lang="nl">, <body class="ams-body">
├── package.json
├── tsconfig.json                 # Strict mode, paths alias @/* → src/*
├── vite.config.ts                # SWC + Tailwind plugin + @ alias
├── tailwind.config.js            # Imports compact.json, preflight:false
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

`src/pages/HomePage.tsx` is the worked example from `references/aesthetic-discipline.md`. It deliberately exercises all five principles:

1. **Dominant color** — `--ams-color-background` (white) plus one `<Spotlight color="azure">` hero band.
2. **Sharp accent** — `--ams-color-highlight-magenta` used on exactly three elements: the hero Badge, the first StatCard's left border, and the newsletter CTA Button.
3. **Rhythm** — `paddingVertical="2x-large"` on the hero, `"large"` on the KPI strip and newsletter, `"x-large"` on the body.
4. **Page-load moment** — `.ams-reveal` cascade on the four hero Grid cells (60-80ms stagger, 520ms duration, respects `prefers-reduced-motion`).
5. **Memorable element** — the off-center editorial column at `start={2} span={7}` on wide, plus one `<Breakout>` band.

When you replace HomePage with your own page, **answer those five questions first** (see `references/aesthetic-discipline.md` → "The Discipline Checklist"). If you do not, the result will look like a wireframe.

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

### Radix primitives — for components ADS doesn't cover
ADS does not ship a Popover, DropdownMenu, Tooltip, or ContextMenu. When you need them, use Radix headless primitives and style them with AMS tokens via a CVA wrapper:
```bash
bun add @radix-ui/react-popover @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
```
Never reach for `shadcn/ui` directly — its design tokens conflict with ADS.

### MSAL — for Azure AD authentication
Most Amsterdam internal tools authenticate via Azure AD. The pattern is documented in `references/layout-patterns.md` → "React Router + AppLayout outlet". Add:
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

ADS v3.3.0 only ships a router slot on **two** components: `PageHeader.logoLinkComponent` and `Pagination.linkComponent`. Both expect a `ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>`, not React Router's `Link` directly — so `AppLayout.tsx` defines a tiny `LogoLink` adapter that maps ADS's `href` to React Router's `to`.

Every other link-like component in this starter — `<StandaloneLink>`, `<PageHeader.MenuLink>`, `<PageFooter.MenuLink>`, `<Breadcrumb.Link>`, `<Card.Link>`, `<LinkList.Link>` — renders a plain `<a>` and **triggers a full page reload**. There is no `linkComponent` prop, no `asChild`, no render prop.

You have three options when that reload is unacceptable:

1. **Accept the reload.** Fine for navigation links (header menu, footer, breadcrumbs) on internal tools — the bundle is cached.
2. **Use the adapter** on the two slots that exist (`PageHeader.logoLinkComponent`, `Pagination.linkComponent`).
3. **Build a click interceptor wrapper** around the ADS link, calling `useNavigate()` on left-clicks without modifier keys. Full pattern (with proper modifier/button/target/download guards) is in `references/layout-patterns.md` → "Routing Link integration with React Router v7".

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
- `../../references/components.md` — full props for all 66 ADS components
- `../../references/tokens.md` — complete `--ams-*` token catalog
- `../../references/tailwind-bridge.md` — full Tailwind + AMS integration guide
- `../../references/layout-patterns.md` — page templates for common Amsterdam project types
