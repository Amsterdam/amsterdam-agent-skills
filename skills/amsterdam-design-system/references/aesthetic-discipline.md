# Aesthetic Discipline — Translating frontend-design Principles into ADS Materials

> Read this **before writing JSX** on any non-trivial UI task. ADS gives you the materials. This file teaches you how to use them so the result is not a wireframe.

## Why this file exists

The vendored Anthropic skill `frontend-design` (at `.agents/skills/frontend-design/SKILL.md` if present in your workspace) teaches *aesthetic discipline*: pick one bold direction and execute it with precision. Its principles — typography hierarchy, dominant color + sharp accent, motion as page-load orchestration, asymmetric composition, atmospheric depth — are sound and apply to every interface.

Its **specific guidance** does not. It says "pick a distinctive font", "break the grid", "use purple gradients on white". In Amsterdam contexts, all three are forbidden: Amsterdam Sans is mandatory, the 4/8/12 grid is mandatory, and the palette is restricted to `--ams-*` tokens.

This file is the translation layer. For each principle, it answers: *what does the principle mean when the materials are fixed?* Use this as the bridge between aesthetic intent and ADS-legal output.

It does **not** override any rule in `SKILL.md`. The mechanical rules — Amsterdam Sans, `--ams-*` tokens, the Grid, BEM custom components — remain mandatory. This file teaches you how to make them sing within those constraints.

---

## The Five Principles (ADS-legal)

### 1. Typography hierarchy — not custom fonts

**frontend-design says:** *"Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter."*

**ADS reality:** Amsterdam Sans is the only font, period. `--ams-typography-font-family` is `'Amsterdam Sans', Arial, sans-serif`. There is no escape valve.

**The legal move:** hierarchy comes from **size jumps**, **weight contrast** (400 body vs 800 headings — no 500/600/700 stops in between), and **uppercase tracking** on small eyebrows. The `level` prop sets semantics; the `size` prop sets visual rank — use them independently to break the default cascade.

```tsx
// ✅ Editorial hero — three distinct typographic ranks in three lines
<Column gap="small">
  <Paragraph
    size="small"
    className="uppercase tracking-[0.15em] text-ams-text-secondary"
  >
    Programma Zuidas — 2026 → 2031
  </Paragraph>
  <Heading level={1}>Een nieuwe entree voor Zuid</Heading>
  <Paragraph size="large">
    Vijf jaar bouwen, vijf jaar leren, één buurt die opnieuw begint.
  </Paragraph>
</Column>
```

```tsx
// ✅ Section rhythm — bump h2 visual rank with size override for the
// most important section, demote following h2s with size="level-3"
<Heading level={2} size="level-1">De vier ingrepen</Heading>
{/* ... section body ... */}
<Heading level={2} size="level-3">Tijdpad</Heading>
```

**Anti-pattern:** every section heading uses default `<Heading level={2}>`, every paragraph uses default `<Paragraph>`. The page reads as a wireframe because there is no visual rhythm — only semantic structure.

**Cheap wins:**
- Use `<Paragraph size="large">` for the lede after an `h1`. It is the only ADS-legal lead-paragraph mechanism.
- Use `text-wrap: balance` (already on `Heading`) for two-line headings. Never let an h1 wrap to a single orphan word.
- Reserve `level={1}` for one element per page. Multiple `h1`s flatten the hierarchy and break screen reader navigation.
- For eyebrows, use `<Paragraph size="small" className="uppercase tracking-[0.12em] text-ams-text-secondary">`. This is the closest legal equivalent to a "distinctive display font".

---

### 2. Color commitment — one dominant, one sharp accent

**frontend-design says:** *"Dominant colors with sharp accents outperform timid, evenly-distributed palettes."*

**ADS reality:** the palette is `--ams-color-*`. The neutrals are fixed (`--ams-color-text` `#202020`, `--ams-color-background` `#ffffff`, `--ams-color-text-secondary` `#767676`, `--ams-color-separator` `#d1d1d1`). The interactive blue is `--ams-color-interactive` `#004699`. The accent palette has exactly seven highlights:

| Token | Hex | Mood |
|---|---|---|
| `--ams-color-highlight-azure` | `#009de6` | Open, friendly, civic-confident |
| `--ams-color-highlight-green` | `#00893c` | Stable, ecological |
| `--ams-color-highlight-lime` | `#bed200` | Energetic, attention-grabbing |
| `--ams-color-highlight-magenta` | `#e50082` | Bold, editorial, signature Amsterdam |
| `--ams-color-highlight-orange` | `#ff9100` | Warm, alerting, ceremonial |
| `--ams-color-highlight-purple` | `#a00078` | Cultural, refined |
| `--ams-color-highlight-yellow` | `#ffe600` | Maximum attention, sparing use only |

**The legal move:** commit to **one dominant** that fills 80%+ of the canvas, plus **one sharp accent** used on at most 2-3 elements per viewport. Never two accents on the same screen. The dominant is almost always `--ams-color-background` (white) or `--ams-color-interactive` (Amsterdam blue) for hero bands. The sharp accent is one — and only one — `--ams-color-highlight-*`.

```tsx
// ✅ Civic-confident dashboard
//    Dominant: --ams-color-background (white)
//    Sharp accent: --ams-color-highlight-magenta — used on the active tab
//    underline AND the single hero KPI number, nothing else
<Page>
  <PageHeader brandName="Beleid Zuid" />
  <Grid as="main" paddingVertical="large">
    <Grid.Cell span={{ narrow: 4, medium: 8, wide: 12 }}>
      <Column gap="large">
        <Tabs>
          {/* Active underline picks up --ams-color-highlight-magenta via
              a 3px border-bottom on the active tab — see reveal.css */}
          <Tabs.List>
            <Tabs.Button aria-controls="overview">Overzicht</Tabs.Button>
            <Tabs.Button aria-controls="trends">Trends</Tabs.Button>
          </Tabs.List>
        </Tabs>
        <StatCard
          label="Lopende projecten"
          value="47"          {/* this number is the magenta moment */}
          accent="magenta"
        />
      </Column>
    </Grid.Cell>
  </Grid>
</Page>
```

```tsx
// ✅ Editorial landing page
//    Dominant: --ams-color-interactive blue hero band via <Spotlight>
//    Sharp accent: --ams-color-highlight-yellow on ONE CTA icon and ONE Badge
<Page>
  <Spotlight color="azure">  {/* note: Spotlight only ships 6 colors —
                                  azure | green | lime | magenta | orange | yellow.
                                  Pick the one closest to your dominant. */}
    <Grid paddingVertical="x-large">
      <Grid.Cell
        span={{ narrow: 4, medium: 6, wide: 8 }}
        start={{ narrow: 1, medium: 2, wide: 3 }}
      >
        <Column gap="small">
          <Heading level={1} color="inverse">Programma Zuidas</Heading>
          <Paragraph size="large" color="inverse">
            Vijf jaar bouwen aan de entree van Amsterdam.
          </Paragraph>
          <Badge color="yellow" label="Nieuw rapport" />
        </Column>
      </Grid.Cell>
    </Grid>
  </Spotlight>
</Page>
```

**Anti-pattern:** every `Button variant="primary"` uses interactive blue, every `Badge` picks a different highlight color, every section header sits over a different `Spotlight color`. The page becomes palette soup. ADS gives you seven highlights so different *projects* can pick one — not so one *page* can use all seven.

**Cheap wins:**
- Pick the accent **before** writing JSX. Write the token name (e.g. `--ams-color-highlight-magenta`) at the top of the page file as a comment. Refuse to use any other highlight in the same file.
- Treat `--ams-color-text-secondary` `#767676` as a third color, not a fallback. It is the right choice for eyebrows, captions, metadata, breadcrumbs and timestamps. Reserve `--ams-color-text` for body and `--ams-color-text-secondary` for everything supporting.
- Use `--ams-color-separator` for hairline rules between sections. They look more deliberate than `--ams-space-l` of empty space.

---

### 3. Motion — page-load orchestration, not scattered micro-interactions

**frontend-design says:** *"One well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions."*

**ADS reality:** ADS ships no animation primitives. There is no `<Reveal>`, no `<Motion>`, no transition prop on Grid or Column. Tailwind utilities and the `tw-animate-css` package (used in real Amsterdam repos) are the legal vehicles.

**The legal move:** define **one** keyframe stagger as a CSS class, apply it to top-level Grid cells, let `:nth-child` create the cascade. Duration 400-600ms. Stagger 60-80ms. Easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Always wrap in `@media (prefers-reduced-motion: no-preference)`.

```css
/* src/styles/reveal.css */
@media (prefers-reduced-motion: no-preference) {
  .ams-reveal {
    opacity: 0;
    transform: translateY(0.75rem);
    animation: ams-reveal-in 520ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  .ams-reveal:nth-child(1) { animation-delay:  60ms; }
  .ams-reveal:nth-child(2) { animation-delay: 140ms; }
  .ams-reveal:nth-child(3) { animation-delay: 220ms; }
  .ams-reveal:nth-child(4) { animation-delay: 300ms; }
  .ams-reveal:nth-child(5) { animation-delay: 380ms; }
}

@keyframes ams-reveal-in {
  to { opacity: 1; transform: translateY(0); }
}
```

```tsx
// ✅ One stagger cascade per page, applied to top-level cells
<Grid as="main" paddingVertical="x-large">
  <Grid.Cell span="all" className="ams-reveal">
    <Heading level={1}>Programma Zuidas</Heading>
  </Grid.Cell>
  <Grid.Cell
    span={{ narrow: 4, medium: 6, wide: 8 }}
    start={{ narrow: 1, medium: 2, wide: 3 }}
    className="ams-reveal"
  >
    <Paragraph size="large">…</Paragraph>
  </Grid.Cell>
  <Grid.Cell
    span={{ narrow: 4, medium: 6, wide: 6 }}
    start={{ narrow: 1, medium: 2, wide: 4 }}
    className="ams-reveal"
  >
    <ActionGroup>
      <Button variant="primary">Lees het rapport</Button>
    </ActionGroup>
  </Grid.Cell>
</Grid>
```

**Anti-pattern:** Framer Motion on every button with spring physics; hover bounces on every card; pulse animations on KPI numbers; scroll-triggered fly-ins on every section. Each animation in isolation looks fine; together they look like a slot machine.

**Cheap wins:**
- ADS hover states (Button, Link, Card) already animate via component CSS — do not add `transition-colors duration-200` on top.
- If you need attention on a single element (a fresh notification, a just-arrived data point), animate it once with a one-shot scale or opacity, never a loop.
- Never animate the `<PageHeader>`. It is the trust anchor; instability there reads as broken.
- `prefers-reduced-motion` is not optional. Wrap **every** custom animation in the media query. ADS components already do this internally.

---

### 4. Composition rhythm — within the 4/8/12 grid

**frontend-design says:** *"Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density."*

**ADS reality:** the Grid is non-negotiable. 4 columns at narrow, 8 at medium, 12 at wide. Cells span integers. There is no diagonal flow, no negative-space-by-rotation. But there is plenty of room for asymmetry.

**The legal move:** rhythm comes from three levers, all of which the Grid supports natively.

**Lever 1 — asymmetric spans with `start={}`.** The default safe split is `span={8}` + `span={4}`. The interesting splits are `start={3} span={7}` (off-center editorial column on wide), `start={4} span={6}` (centered narrow), `span={3}` + `span={6}` + `span={3}` (sidebar / main / metric rail), and `start={4} span={9}` (right-weighted).

> **Important on responsive `span` and `start`:** when you pass an object, ADS requires **all three** breakpoint keys (`narrow`, `medium`, `wide`). You cannot pass `{ wide: 7 }` alone — TypeScript will reject it. Always specify a sensible value for narrow (4-col grid) and medium (8-col) too. The pattern below is the canonical "off-center on wide, full-width on smaller" shape.

```tsx
// ✅ Off-center editorial column on wide, full-width on smaller breakpoints
<Grid as="main" paddingVertical="x-large">
  <Grid.Cell
    span={{ narrow: 4, medium: 6, wide: 7 }}
    start={{ narrow: 1, medium: 2, wide: 2 }}
  >
    <Column gap="large">
      <Heading level={1}>Een nieuwe entree voor Zuid</Heading>
      <Paragraph size="large">…lede paragraph…</Paragraph>
      <Paragraph>…body…</Paragraph>
    </Column>
  </Grid.Cell>
</Grid>
```

**Lever 2 — alternate dense and airy `paddingVertical`.** `Grid` accepts `paddingVertical="large" | "x-large" | "2x-large"` plus `paddingTop` and `paddingBottom` overrides. Use `2x-large` on the hero, `large` on dense data sections, `x-large` on body sections. Three different vertical rhythms in one page is *intentionality*; one rhythm is *flatness*.

```tsx
<Page>
  <Grid as="header" paddingVertical="2x-large">  {/* hero — airy */}
    {/* … */}
  </Grid>
  <Grid as="section" paddingVertical="large">     {/* dense data */}
    {/* … */}
  </Grid>
  <Grid as="section" paddingVertical="x-large">   {/* body — middle */}
    {/* … */}
  </Grid>
</Page>
```

**Lever 3 — one `<Breakout>` or `<Overlap>` moment per page.** `Breakout` lets a single element span beyond the Grid's padding (full-bleed image, edge-to-edge color band). `Overlap` stacks children visually (image + heading on top). Use exactly one per page. Two compete; three is chaos.

```tsx
// ✅ One full-bleed hero image — the page's "memorable element"
// Note: Breakout.Cell uses `colSpan` (not `span`) — different prop name from Grid.Cell.
<Breakout>
  <Breakout.Cell colSpan="all">
    <Image src="/zuidas-render.jpg" alt="" aspectRatio="16-5" />
  </Breakout.Cell>
</Breakout>
```

**Anti-pattern:** every section uses `<Grid.Cell span="all">` with `paddingVertical="large"`. The Grid is doing nothing — you might as well be writing `<div>`s. Or: three `<Breakout>` sections back-to-back, each fighting for the page's one memorable moment.

**Cheap wins:**
- On wide breakpoints, prefer `start={}` over `span={"all"}`. An off-center column always reads more deliberate than a full-bleed centered one.
- Vary `gap` inside `<Column>`. Outer column `gap="large"` for section separation, inner column `gap="small"` for heading-to-paragraph cohesion. This is already in `references/layout-patterns.md` — apply it.
- If a page has 5+ sections with the same span, you have not committed to a layout. Pick one section to be the off-center one, one to be `<Breakout>`, and let the rest be uniform.

---

### 5. Backgrounds and depth — atmosphere from tokens

**frontend-design says:** *"Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures."*

**ADS reality:** there is no `--ams-color-background-subtle`, no shadow palette beyond what components ship. Every drop shadow you add is a token violation. But ADS gives you `<Spotlight>`, hairline `--ams-border-width-s` separators on `--ams-color-separator`, and the freedom to layer Grid sections with alternating backgrounds.

**The legal move:** depth comes from **layered Spotlight bands**, **hairline separators**, and (sparingly) **one SVG noise overlay** behind a hero. Never add box-shadows to cards beyond the ones ADS already provides.

```tsx
// ✅ Three-layer page — spotlight hero, white body, spotlight footer
<Page>
  {/* Layer 1: dark hero band */}
  <Spotlight color="azure">
    <Grid paddingVertical="2x-large">
      <Grid.Cell
        span={{ narrow: 4, medium: 6, wide: 8 }}
        start={{ narrow: 1, medium: 2, wide: 3 }}
      >
        <Heading level={1} color="inverse">…</Heading>
      </Grid.Cell>
    </Grid>
  </Spotlight>

  {/* Layer 2: white body — separated by the spotlight edge, no shadow needed */}
  <Grid as="main" paddingVertical="x-large">
    {/* … */}
  </Grid>

  {/* Layer 3: footer spotlight (built into PageFooter) */}
  <PageFooter>
    <PageFooter.Spotlight>{/* … */}</PageFooter.Spotlight>
    <PageFooter.Menu>{/* … */}</PageFooter.Menu>
  </PageFooter>
</Page>
```

```css
/* ✅ Optional grain overlay — one page hero, never the whole site */
.ams-grain::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
```

**Anti-pattern:** flat white page with a single purple gradient hero. (Verbatim what `frontend-design` warns against — and it is doubly forbidden in ADS because purple gradients are not in the palette.) Or: drop shadows on every Card "to add depth", which just creates visual noise that competes with `<Spotlight>` bands.

**Cheap wins:**
- Use `<PageFooter.Spotlight>` for the footer — it is free atmospheric depth and a visual anchor for the bottom of the page.
- Hairline `border-block-start: var(--ams-border-width-s) solid var(--ams-color-separator)` between `<Grid>` sections is more deliberate than empty space.
- For a "weighted" feel without extra color, set the body background on `<Grid as="section">` to no override and the next section to a `<Spotlight color="lime">` (or your dominant accent). Two layers, zero shadows.

---

## Irreducible conflicts — do this instead

When `frontend-design`'s literal advice conflicts with ADS, use this table.

| frontend-design says | ADS does not allow | Instead do |
|---|---|---|
| "Pick a distinctive display font" | Amsterdam Sans only | Weight contrast (400 vs 800), size jumps via `Heading size="level-1"`, uppercase tracking on small eyebrows |
| "Avoid Inter, Roboto, Arial" | Arial is the system fallback for Amsterdam Sans | Already covered — Amsterdam Sans is none of those. If the font fails to load, Arial appears, but that is a network failure, not a design choice |
| "Break the grid, diagonal flow" | 4/8/12 is mandatory; no rotation | Asymmetric spans with `start={}`, varied `paddingVertical` per section, one `<Breakout>` per page |
| "Dominant purple gradient on white" | No gradients in tokens; no purple-to-white | Dominant `--ams-color-interactive` (Amsterdam blue) or one `<Spotlight color="…">`, with one `--ams-color-highlight-*` accent |
| "Custom shadows, elaborate effects" | Token-based shadows only (DTCG format, fixed) | Use `<Spotlight>`, layered Grid sections with alternating backgrounds, hairline `--ams-color-separator` rules |
| "Custom cursors" | Only `--ams-cursor-interactive` and `--ams-cursor-disabled` | Skip. Spend the budget on motion or composition instead |
| "Dark mode by default" | ADS does not yet ship a dark theme | Use `<Spotlight color="…">` with `color="inverse"` typography for dark *sections*. Do not invent a dark theme |
| "Brutalist raw HTML" | Custom components must follow BEM + tokens checklist | Use `<Spotlight color="lime">` and `--ams-border-width-xl` for "raw" feel. Stay legal |

---

## The Discipline Checklist

Before writing a single line of JSX on any non-trivial UI task, answer these five questions in **one sentence each**. If you cannot, the design is not committed yet — re-read the principle above and try again.

1. **Dominant color.** Which one token covers 80%+ of the canvas?
   *Example: `--ams-color-background` (white) for the body; `--ams-color-interactive` for hero bands.*

2. **Sharp accent.** Which one `--ams-color-highlight-*` token appears on at most 2-3 elements?
   *Example: `--ams-color-highlight-magenta` on the active Tab underline and the hero KPI number.*

3. **Rhythm.** Which section is dense (`paddingVertical="large"`)? Which is airy (`paddingVertical="2x-large"`)?
   *Example: hero is 2x-large, KPI strip is large, body is x-large.*

4. **Page-load moment.** What is the one staggered reveal sequence? How many top-level cells does it animate?
   *Example: `.ams-reveal` on the four hero cells, 60-80ms stagger, 520ms duration.*

5. **Memorable element.** What is the one `<Breakout>`, `<Overlap>`, or asymmetric `start={}` moment per page?
   *Example: `<Breakout>` full-bleed hero image with `aspect-ratio: 16-5`.*

If three or more of your answers are "default", the page will look like a wireframe. Pick one to invest in.

---

## Worked example — Zuidas landing page

The brief from `benchmarks/001-zuidas-landing-page.md`:

> Build a landing page for the Amsterdam Zuidas area, focused on construction and developments over the next 5 years. Three pages, five paragraphs of real Dutch text per page, a newsletter signup form. Professional style.

### Discipline answers

1. **Dominant.** `--ams-color-background` (white body) with one `<Spotlight color="azure">` hero band.
2. **Sharp accent.** `--ams-color-highlight-magenta` — used on (a) the newsletter form's CTA, (b) the active item in the page navigation, (c) the "Nieuw rapport" Badge. Three uses, no more.
3. **Rhythm.** Hero `paddingVertical="2x-large"`, lede + body `paddingVertical="x-large"`, related-pages strip `paddingVertical="large"`.
4. **Page-load moment.** `.ams-reveal` cascade on the four hero cells (eyebrow, h1, lede, CTA group). 520ms / 60ms stagger.
5. **Memorable element.** `<Breakout>` full-bleed `<Image>` of the Zuidas masterplan render at `aspect-ratio: 16-5`, immediately under the hero spotlight.

### Sketch

```tsx
import {
  Badge, Breakout, Button, Column, Grid, Heading, Image, Page,
  PageFooter, PageHeader, Paragraph, Spotlight, StandaloneLink,
} from "@amsterdam/design-system-react"

export function ZuidasLanding() {
  return (
    <Page>
      <PageHeader brandName="Zuidas" logoLink="/" />

      {/* Hero — dominant Spotlight, staggered reveal */}
      <Spotlight color="azure">
        <Grid paddingVertical="2x-large">
          <Grid.Cell
            span={{ narrow: 4, medium: 6, wide: 8 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Paragraph
              size="small"
              color="inverse"
              className="uppercase tracking-[0.15em]"
            >
              Programma Zuidas — 2026 → 2031
            </Paragraph>
          </Grid.Cell>
          <Grid.Cell
            span={{ narrow: 4, medium: 6, wide: 8 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Heading level={1} color="inverse">
              Een nieuwe entree voor Amsterdam Zuid
            </Heading>
          </Grid.Cell>
          <Grid.Cell
            span={{ narrow: 4, medium: 5, wide: 6 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Paragraph size="large" color="inverse">
              Vijf jaar bouwen aan de poort van de stad. Nieuwe sporen,
              nieuwe pleinen, nieuwe verbindingen — voor wie hier woont,
              werkt en aankomt.
            </Paragraph>
          </Grid.Cell>
          <Grid.Cell
            span={{ narrow: 4, medium: 6, wide: 6 }}
            start={{ narrow: 1, medium: 2, wide: 3 }}
            className="ams-reveal"
          >
            <Badge color="magenta" label="Nieuw rapport: voortgang Q1" />
          </Grid.Cell>
        </Grid>
      </Spotlight>

      {/* Memorable element — one full-bleed Breakout */}
      {/* Note: Breakout.Cell uses `colSpan` (not `span`). */}
      <Breakout>
        <Breakout.Cell colSpan="all">
          <Image src="/zuidas-masterplan.jpg" alt="" aspectRatio="16-5" />
        </Breakout.Cell>
      </Breakout>

      {/* Body — off-center editorial column */}
      <Grid as="main" paddingVertical="x-large">
        <Grid.Cell
          span={{ narrow: 4, medium: 6, wide: 7 }}
          start={{ narrow: 1, medium: 2, wide: 2 }}
        >
          <Column gap="large">
            <Column gap="small">
              <Heading level={2}>De vier ingrepen</Heading>
              <Paragraph>
                Het Programma Zuidas bestaat uit vier samenhangende projecten…
              </Paragraph>
            </Column>
            {/* …four sections, varied internal Column gaps… */}
          </Column>
        </Grid.Cell>
      </Grid>

      {/* Newsletter — dense paddingVertical, the ONE magenta CTA */}
      <Grid as="section" paddingVertical="large">
        <Grid.Cell
          span={{ narrow: 4, medium: 6, wide: 6 }}
          start={{ narrow: 1, medium: 2, wide: 4 }}
        >
          <Column gap="small">
            <Heading level={2}>Blijf op de hoogte</Heading>
            <Paragraph>
              Eens per maand een korte update over de bouwwerkzaamheden.
            </Paragraph>
            {/* Field + TextInput + Button — Button uses magenta accent
                via a custom CVA wrapper, see components/MagentaButton.tsx */}
          </Column>
        </Grid.Cell>
      </Grid>

      <PageFooter>
        <PageFooter.Spotlight>{/* … */}</PageFooter.Spotlight>
        <PageFooter.Menu>{/* … */}</PageFooter.Menu>
      </PageFooter>
    </Page>
  )
}
```

Notice what is *not* there: no purple gradient, no custom font import, no `transition: all 200ms` on every element, no shadow stack. The page is committed to one color, one rhythm, one reveal, one memorable element — and built entirely from ADS components.

---

## Cross-links

- For mechanical rules (component props, token catalog, grid mechanics), see `SKILL.md` and the other files in `references/`.
- For the framework-agnostic principles this file translates, see `.agents/skills/frontend-design/SKILL.md` if it is present in your workspace. **Trust this file's principles, not its specific font/color/grid advice — those do not apply in Amsterdam contexts.**
- For text content (button labels, error messages, eyebrows), use the `amsterdam-stijl` skill. Aesthetic discipline without Heldere Taal is a polished form with poorly chosen words.
- For a runnable starter that already implements `.ams-reveal`, the asymmetric Grid layout, and the magenta-accent pattern shown in the worked example, see `assets/starter-vite-react/`.
