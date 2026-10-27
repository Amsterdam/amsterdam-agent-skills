# Amsterdam Design System — Component API Reference

> Covers `@amsterdam/design-system-react` **v4.5.0** and `@amsterdam/design-system-css` **v4.5.0** (October 2026). For anything not listed here, the [ADS MCP server or docs](https://designsystem.amsterdam/) are the source of truth.

All components from `@amsterdam/design-system-react`. Every component uses `forwardRef` and spreads `...restProps` on its root element.

> **Before writing JSX:** for app scaffolding, copy `assets/starter-vite-react/`. For aesthetic choices (color commitment, rhythm, motion, composition), read `references/aesthetic-discipline.md` first — answer the 5-question checklist there before picking components.

## Layout

### Grid

Responsive CSS grid: 4 columns (narrow) → 8 (medium) → 12 (wide).

```tsx
import { Grid } from "@amsterdam/design-system-react"

<Grid
  as="main"                     // 'article' | 'aside' | 'div' | 'footer' | 'header' | 'main' | 'nav' | 'ol' | 'section' | 'ul'
  gapVertical="large"           // 'none' | 'large' | '2x-large'
  paddingVertical="large"       // 'large' | 'x-large' | '2x-large'
>
  <Grid.Cell
    span={8}                    // 1-12 | 'all' | { narrow?: n, medium?: n, wide?: n }
    start={3}                   // 1-12 | { narrow?: n, medium?: n, wide?: n }
    as="section"                // same tags as Grid
  >
    Content
  </Grid.Cell>
</Grid>
```

Use **either** `paddingVertical` **or** `paddingTop`/`paddingBottom` — the types make them mutually exclusive:

```tsx
<Grid paddingTop="x-large" paddingBottom="2x-large">…</Grid>
```

**Responsive span patterns:**
```tsx
<Grid.Cell span="all" />                                    // Full width
<Grid.Cell span={6} />                                      // 6 cols at all breakpoints
<Grid.Cell span={{ narrow: 4, medium: 4, wide: 8 }} />     // Responsive
<Grid.Cell span={8} start={3} />                            // Offset
<Grid.Cell span={{ narrow: 4, medium: 6, wide: 8 }}
           start={{ narrow: 1, medium: 2, wide: 3 }} />    // Responsive offset
<Grid.Cell span={4} rowSpan={2} rowStart={1} />             // Span or place rows (v4.0.0+ / v4.4.0+)
<Grid.Cell appearance="flush" />                            // Compact Mode: no cell padding ("transparent": no background either)
```

**Subgrid (v4.4.0+)** keeps nested cells on the page columns — use it for a block of cards or results inside a wider layout. A `Grid` or `Grid.Subgrid` with `as="ul"` / `"ol"` renders its cells as list items, so screen readers announce the set as a list:

```tsx
<Grid>
  <Grid.Cell span={{ narrow: 4, medium: 2, wide: 3 }}>Filters</Grid.Cell>
  <Grid.Subgrid as="ul" span={{ narrow: 4, medium: 6, wide: 9 }} gapVertical="large">
    {results.map((r) => (
      <Grid.Cell key={r.id} span={{ narrow: 4, medium: 3, wide: 3 }}>…</Grid.Cell>
    ))}
  </Grid.Subgrid>
</Grid>
```

`Grid.Subgrid` takes `span`, `start`, `rowSpan`, `rowStart`, `as` and `gapVertical` (`'none' | 'large' | 'x-large' | '2x-large'`).

### Column

Vertical flex stack.

```tsx
<Column
  gap="small"              // 'none' | 'x-small' | 'small' | 'large' | 'x-large'
  align="center"           // MainAlign
  alignHorizontal="center" // CrossAlignForColumn
  as="section"             // 'article' | 'div' | 'section'
>
```

### Row

Horizontal flex stack.

```tsx
<Row
  gap="small"              // RowGap
  align="center"           // MainAlign
  alignVertical="center"   // CrossAlign
  as="div"                 // RowTag
  wrap                     // boolean — wrap items
>
```

### Breakout

Grid variant for content that "breaks out" of the standard grid.

```tsx
<Breakout>
  <Breakout.Cell colSpan="all" has="spotlight">
    <Spotlight color="azure">Full-bleed band</Spotlight>
  </Breakout.Cell>
  <Breakout.Cell colSpan={{ narrow: 4, medium: 4, wide: 6 }} colStart={1} rowStart={1} has="figure">
    <Image src="/hero.jpg" alt="" />
  </Breakout.Cell>
</Breakout>
```

`Breakout.Cell` uses `colSpan` / `colStart` / `rowSpan` / `rowStart` (not `span` / `start` like `Grid.Cell`), plus `has="spotlight" | "figure"` for cells that break out of the grid padding. `colSpan="all"` cannot be combined with `colStart`. `Breakout` itself takes the same `as`, `gapVertical` and padding props as `Grid`.

### Overlap

Stacks children visually on top of each other.

```tsx
<Overlap>
  <Image src="/bg.jpg" alt="" />
  <Heading level={1}>Overlay text</Heading>
</Overlap>
```

### Page

Root page wrapper. Provides the page-level layout structure.

```tsx
<Page withMenu>   // boolean — reserves space for a side menu
  {children}
</Page>
```

### Spotlight

Colored background section.

```tsx
<Spotlight
  as="aside"               // 'article' | 'aside' | 'div' | 'footer' | 'section'
  color="azure"            // 'azure' | 'green' | 'lime' | 'magenta' | 'orange' | 'yellow'
>
```

## Page Structure

### PageHeader

Amsterdam branded header with logo, navigation, and responsive menu.

```tsx
<PageHeader
  brandName="Mijn Amsterdam"
  logoAccessibleName="Gemeente Amsterdam"
  logoBrand="amsterdam"            // LogoBrand | LogoBrandConfig
  logoLink="/"
  logoLinkComponent={NextLink}     // Custom link component for SPA routing
  logoLinkTitle="Naar de homepage"
  menuButtonText="Menu"
  menuButtonTextForHide="Sluit menu"
  menuButtonTextForShow="Open menu"
  menuButtonIcon={MenuIcon}
  menuItems={<>...</>}             // ReactNode — menu content
  navigationLabel="Hoofdnavigatie"
  noMenuButtonOnWideWindow         // boolean — hide menu button on wide screens
  brandNameShort="Mijn A'dam"      // shown on narrow windows
  open={menuOpen}                  // controlled mega menu (v4.3.0+) — or defaultOpen
  onOpenChange={setMenuOpen}
>
  <PageHeader.GridCellNarrowWindowOnly>
    {/* Content shown only on narrow viewports */}
  </PageHeader.GridCellNarrowWindowOnly>
  <PageHeader.MenuLink href="/login">Inloggen</PageHeader.MenuLink>
</PageHeader>
```

### PageFooter

```tsx
<PageFooter>
  <PageFooter.Spotlight>
    <Grid paddingVertical="large">
      <Grid.Cell span="all">
        <Heading level={2} color="inverse">Contact</Heading>
      </Grid.Cell>
    </Grid>
  </PageFooter.Spotlight>
  <PageFooter.Menu>
    <PageFooter.MenuLink href="/privacy">Privacy</PageFooter.MenuLink>
    <PageFooter.MenuLink href="/cookies">Cookies</PageFooter.MenuLink>
  </PageFooter.Menu>
</PageFooter>
```

### PageHeading (DEPRECATED)

> **Deprecated:** Use `<Heading level={1}>` instead. The `PageHeading` component is no longer maintained.

| Old (deprecated) | Replacement |
|---|---|
| `<PageHeading>Title</PageHeading>` | `<Heading level={1}>Title</Heading>` |
| `<PageHeading color="inverse">Title</PageHeading>` | `<Heading level={1} color="inverse">Title</Heading>` |

## Typography

### Heading

```tsx
<Heading
  level={1}              // 1 | 2 | 3 | 4 (required — sets HTML element h1-h4)
  size="level-2"         // 'level-1' | ... | 'level-5' (visual size override)
  color="inverse"        // 'inverse' (for dark backgrounds)
>
```

`level` sets the semantic HTML element. `size` overrides the visual size independently.

### Paragraph

```tsx
<Paragraph
  size="small"           // 'small' | 'large'
  color="inverse"        // 'inverse'
>
```

### Blockquote

```tsx
<Blockquote color="inverse">
  <Paragraph>Quoted text here.</Paragraph>
</Blockquote>
```

### Link

Inline link within text.

```tsx
<Link
  href="/page"
  color="contrast"       // 'contrast' | 'inverse'
>
```

### StandaloneLink

Link on its own line, with a chevron icon by default.

```tsx
<StandaloneLink
  href="/page"
  color="contrast"       // 'contrast' | 'inverse'
  icon={ArrowForwardIcon} // default: ChevronForwardIcon
>
```

### CallToActionLink

Prominent link styled as a call-to-action.

```tsx
<CallToActionLink href="/register">Registreer nu</CallToActionLink>
```

### Mark

Highlighted text.

```tsx
<Paragraph>This is <Mark>important</Mark> text.</Paragraph>
```

## Buttons & Actions

### Button

```tsx
<Button
  variant="primary"      // 'primary' | 'secondary' | 'tertiary'
  icon={SearchIcon}      // IconProps['svg']
  iconBefore             // boolean — icon before label (default: after)
  type="submit"          // standard HTML button type
>
```

### IconButton

Button with only an icon (no visible text).

```tsx
<IconButton
  svg={CloseIcon}        // IconProps['svg'] (required)
  label="Sluiten"        // string (required — accessible name)
  size="large"           // IconProps['size']
  color="inverse"        // IconButtonColor
/>
```

### ActionGroup

Wraps buttons in a horizontal group with consistent spacing.

```tsx
<ActionGroup>
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</ActionGroup>
```

## Form Controls

### TextInput

```tsx
<TextInput
  id="name"
  invalid                // boolean — sets aria-invalid
  type="email"           // 'email' | 'tel' | 'text' | 'url'
/>
```

### TextArea

```tsx
<TextArea
  id="message"
  rows={4}
  invalid                // boolean
  resize="vertical"      // 'none' | 'horizontal' | 'vertical'
/>
```

### Select

```tsx
<Select id="city" invalid>
  <Select.Option value="">Kies een stadsdeel</Select.Option>
  <Select.Group label="Amsterdam">
    <Select.Option value="centrum">Centrum</Select.Option>
    <Select.Option value="west">West</Select.Option>
  </Select.Group>
</Select>
```

### Checkbox

```tsx
<Checkbox
  icon={CheckMarkIcon}   // custom icon
  indeterminate          // boolean
  invalid                // boolean
>
  Label text
</Checkbox>
```

### Radio

```tsx
<Radio
  name="choice"
  value="a"
  icon={MyRadioIcon}     // optional custom icon (IconProps['svg'])
  invalid                // boolean
>
  Option A
</Radio>
```

### Switch

Toggle switch (on/off).

```tsx
<Label htmlFor="notifications">Meldingen</Label>
<Switch id="notifications" />
```

Switch renders an `<input>` with an empty visual `<label>` track — it takes **no children**. Its accessible name comes from a `Label` tied to it with `htmlFor`.

### DateInput

```tsx
<DateInput
  id="date"
  invalid                // boolean
  type="date"            // 'date' | 'datetime-local'
/>
```

### TimeInput

```tsx
<TimeInput id="time" invalid />
```

### PasswordInput

```tsx
<PasswordInput id="password" invalid />
```

### FileInput

```tsx
<FileInput id="upload" accept=".pdf,.jpg" />
```

### SearchField

Compound form element for search.

```tsx
<SearchField onSubmit={handleSearch}>
  <SearchField.Input placeholder="Zoeken..." />
  <SearchField.Button />
</SearchField>
```

### FormFieldStatus

Status line below a field (v4.5.0+). Replaces `CharacterCount`, which is deprecated (removal on or after 2027-04-25). When the count passes its limit it says so in words and with a warning icon, not colour alone.

```tsx
<Field>
  <Label htmlFor="bericht">Bericht</Label>
  <TextArea id="bericht" maxLength={1000} value={value} onChange={…} />
  <FormFieldStatus>
    <FormFieldStatus.CharacterCount length={value.length} maxLength={1000} />
  </FormFieldStatus>
</Field>

{/* or plain status text */}
<FormFieldStatus>Uw wachtwoord is sterk genoeg.</FormFieldStatus>
```

`FormFieldStatus.CharacterCount` also takes `formatText` and `formatOverLimitText` for translations.

### KnownDateInput

A date the user already knows (birth date, card expiry) as separate day, month and year fields (v4.5.0+). Put it in a `FieldSet` that provides the question.

```tsx
<FieldSet legend="Wanneer bent u geboren?" aria-describedby="geboren-hint">
  <Paragraph id="geboren-hint">Bijvoorbeeld 1 1 2000.</Paragraph>
  <KnownDateInput autoComplete="birth-date">   {/* 'birth-date' | 'credit-card-expiry-date' */}
    <KnownDateInput.Day name="dag" />
    <KnownDateInput.Month name="maand" />
    <KnownDateInput.Year name="jaar" />
  </KnownDateInput>
</FieldSet>
```

Mark a wrong part with `invalid` on that part, and `invalid` on the `FieldSet`.

### DatePicker

Inline month grid for choosing a date or a range (v4.2.0+) — on the page, not in a form field. For a date the user already knows, use `KnownDateInput`.

```tsx
const [date, setDate] = useState<Date | null>(null)
<DatePicker value={date} onChange={setDate} minDate={new Date()} />

const [range, setRange] = useState<DateRange>({ start: null, end: null })
<DatePicker mode="range" value={range} onChange={setRange} isDateDisabled={(d) => d.getDay() === 0} />
```

Also: `defaultMonth`, `maxDate`, `locale`, and labels/icons for the month and year buttons. Websites for the City must keep the default icons.

## Form Structure

### Field

Wraps a single form control with its label and error message.

```tsx
<Field invalid={hasError}>
  <Label htmlFor="name">Naam</Label>
  <Hint hint="Vul uw volledige naam in" />
  <ErrorMessage>Dit veld is verplicht</ErrorMessage>
  <TextInput id="name" invalid={hasError} />
</Field>
```

**Important:** Set `invalid` on BOTH `Field` AND the input component.

### FieldSet

Groups related form controls under a legend.

```tsx
<FieldSet
  legend="Contactgegevens"        // string (required)
  legendIsPageHeading             // boolean — renders legend at heading level 1 size
  inFieldSet                      // boolean — nested inside another FieldSet
  invalid                         // boolean
>
  <Checkbox>Optie A</Checkbox>
  <Checkbox>Optie B</Checkbox>
</FieldSet>
```

### Label

```tsx
<Label
  htmlFor="name"
  isPageHeading          // boolean — renders label at heading level 1 size
  inFieldSet             // boolean — adjusts styling for fieldset context
>
  Naam
</Label>
```

Label also supports `optional` and `hint` from HintProps.

### Hint

Additional guidance text below a label.

```tsx
<Hint hint="Bijvoorbeeld: Jan de Vries" />
```

### ErrorMessage

Validation error display.

```tsx
<ErrorMessage
  icon={WarningIcon}     // default: WarningIcon
  prefix="Invoerfout"    // string (default: 'Invoerfout')
>
  Vul een geldig e-mailadres in
</ErrorMessage>
```

### InvalidFormAlert

Top-of-form error summary with links to invalid fields.

```tsx
<InvalidFormAlert
  heading="Controleer de volgende velden"
  headingLevel={2}
  errors={[
    { id: "name", label: "Naam" },
    { id: "email", label: "E-mailadres" },
  ]}
  focusOnRender          // boolean — auto-focus when mounted
  errorCountLabel={{
    singular: "veld bevat een fout",
    plural: "velden bevatten fouten",
  }}
/>
```

## Navigation

### Breadcrumb

Renders a hidden `<h2>` that provides an accessible name and is visible without CSS for progressive enhancement.

```tsx
<Breadcrumb
  accessibleName="Kruimelpad"     // string — accessible name (default: "Kruimelpad")
  accessibleNameId="breadcrumb-1" // string — custom id for the internal heading (auto-generated if omitted)
>
  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  <Breadcrumb.Link href="/category">Categorie</Breadcrumb.Link>
  <Breadcrumb.Link>Huidige pagina</Breadcrumb.Link>
</Breadcrumb>
```

### LinkList

Vertical list of links.

```tsx
<LinkList>
  <LinkList.Link href="/a">Link A</LinkList.Link>
  <LinkList.Link href="/b">Link B</LinkList.Link>
</LinkList>
```

### Menu

Navigation menu with accessible label.

```tsx
<Menu accessibleName="Hoofdmenu" inWideWindow>
  <Menu.Link href="/" icon={BarChartFillIcon}>Overzicht</Menu.Link>
  <Menu.Link href="/documenten" icon={DocumentsFillIcon}>Documenten</Menu.Link>
</Menu>
```

`icon` is **required** on `Menu.Link` — use the filled variant.

### Pagination

```tsx
<Pagination
  totalPages={20}                  // number (required)
  page={5}                         // current page
  maxVisiblePages={7}              // number
  linkTemplate={(p) => `/page/${p}`} // (page: number) => string (required)
  linkComponent={NextLink}         // custom link component
  accessibleName="Paginering"
  previousLabel="Vorige"
  nextLabel="Volgende"
  pageAccessibleName="Pagina"                 // v4.4.0+: also currentPageAccessibleName,
  nextAccessibleName="Volgende pagina"        //   previousAccessibleName, accessibleNameId
/>
```

### SkipLink

```tsx
<SkipLink href="#main">Ga naar inhoud</SkipLink>
```

### Tabs

```tsx
<Tabs
  activeTab="tab1"                 // default active tab
  onTabChange={(panelId) => {}}    // callback
>
  <Tabs.List>
    <Tabs.Button aria-controls="tab1">Tab 1</Tabs.Button>
    <Tabs.Button aria-controls="tab2">Tab 2</Tabs.Button>
  </Tabs.List>
  <Tabs.Panel id="tab1">Panel 1 content</Tabs.Panel>
  <Tabs.Panel id="tab2">Panel 2 content</Tabs.Panel>
</Tabs>
```

**Important:** `aria-controls` on `Tabs.Button` must match `id` on `Tabs.Panel`.

### TabNavigation

Navigation between pages that share a context, styled like tabs (v4.0.0+). Each link loads a page — unlike `Tabs`, which switches panels on one page.

```tsx
<TabNavigation accessibleName="Mijn gegevens">   {/* orientation="vertical" for a side navigation */}
  <TabNavigation.List>
    <TabNavigation.Link aria-current="page" href="/gegevens">Gegevens</TabNavigation.Link>
    <TabNavigation.Link href="/aanslagen" linkComponent={RouterLink}>Aanslagen</TabNavigation.Link>
  </TabNavigation.List>
</TabNavigation>
```

### Calendar

Shows a month at a time, for navigating to dates that have something behind them (v4.2.0+). Days with content become links.

```tsx
<Calendar
  accessibleName="Agenda"
  linkTemplate={(date) => (hasEvents(date) ? `/agenda/${toIsoDate(date)}` : undefined)}
  linkComponent={RouterLink}
  locale="nl-NL"
/>
```

### TableOfContents

```tsx
<TableOfContents heading="Inhoud" headingLevel={2} collapsible>   {/* collapsible nested lists: v4.2.0+ */}
  <TableOfContents.List>
    <TableOfContents.Link href="#section1" label="Section 1">
      <TableOfContents.List>
        <TableOfContents.Link href="#section1a" label="Subsection 1a" />
      </TableOfContents.List>
    </TableOfContents.Link>
    <TableOfContents.Link href="#section2" label="Section 2" />
  </TableOfContents.List>
</TableOfContents>
```

The link text is the `label` prop (required); a nested `TableOfContents.List` goes **inside** its parent `Link`. Links with a nested list take `defaultExpanded` / `expanded` / `onToggle` when the table is `collapsible`.

## Data Display

### Accordion

```tsx
<Accordion
  headingLevel={2}                 // 2 | 3 | 4 (required)
  sectionAs="section"              // 'div' | 'section'
>
  <Accordion.Section
    label="Section title"          // string (required)
    defaultExpanded                // boolean — initially expanded (`expanded` is deprecated)
    onToggle={(expanded) => {}}    // v4.3.0+
  >
    <Paragraph>Content</Paragraph>
  </Accordion.Section>
</Accordion>
```

### Card

```tsx
<Card>
  <Card.Image src="/photo.jpg" alt="" />          {/* 16:9 by default (v4.5.0); --ams-card-image-aspect-ratio */}
  <Card.Content>                                  {/* optional: goes horizontal when its container is wide (v4.4.0) */}
    <Card.HeadingGroup>
      <Card.Heading level={3}>
        <Card.Link href="/detail">Title</Card.Link>
      </Card.Heading>
      <Metadata size="small">Nieuws</Metadata>    {/* written after the heading, shown above it */}
    </Card.HeadingGroup>
    <Paragraph>Card description text.</Paragraph>
  </Card.Content>
</Card>
```

The `tagline` prop of `Card.HeadingGroup` is deprecated (v4.4.0, removal on or after 2027-02-08) — add a `<Metadata>` child instead.

### DescriptionList

Terms use Heading 4 typography (larger, bolder) with `text-wrap: balance` for multi-line readability.

```tsx
<DescriptionList
  color="inverse"                  // 'inverse'
  termsWidth="medium"              // 'narrow' | 'medium' | 'wide'
>
  <DescriptionList.Item>
    <DescriptionList.Term>Naam</DescriptionList.Term>
    <DescriptionList.Description>Jan Jansen</DescriptionList.Description>
  </DescriptionList.Item>
</DescriptionList>
```

`DescriptionList.Section` is deprecated (v4.5.0) — use `DescriptionList.Item`. The list switches to side-by-side when its container is wider than 32rem. To show details **with actions** (edit, delete) for one subject, use `DataList`.

### Figure

```tsx
<Figure>
  <Image src="/chart.png" alt="Grafiek" />
  <Figure.Caption>Figuur 1: Beschrijving</Figure.Caption>
</Figure>
```

### Table

```tsx
<Table>
  <Table.Caption>Data overview</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Column A</Table.HeaderCell>
      <Table.HeaderCell>Column B</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Value 1</Table.Cell>
      <Table.Cell align="end">1.250</Table.Cell>   {/* align: v4.1.0+ — right-align numbers */}
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell>Total</Table.Cell>
      <Table.Cell>100</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table>
```

### DataList

Details of one subject, with an action per value where needed (v4.5.0+). Horizontal by default; `orientation` switches it.

```tsx
<DataList>
  <DataList.Item>
    <DataList.Key>Telefoonnummer</DataList.Key>
    <DataList.Value>06 12345678</DataList.Value>
    <DataList.Actions>
      <StandaloneLink href="/telefoon" icon={EditIcon}>
        Wijzigen<span className="ams-visually-hidden"> telefoonnummer</span>
      </StandaloneLink>
    </DataList.Actions>
  </DataList.Item>
</DataList>
```

### Image

```tsx
<Image src="/foto.jpg" alt="Beschrijving" aspectRatio="16:9" />
<Image src="/logo.png" alt="" fit="contain" />   {/* v4.5.0+: show the whole image instead of cropping */}
```

Shows a grey placeholder while loading (v4.4.0+).

### Metadata

Grey text for a date, category or status (v4.4.0+).

```tsx
<Metadata size="small"><time dateTime="2026-10-22">22 oktober 2026</time></Metadata>   {/* color="inverse" on dark */}
```

### ImageSlider

```tsx
<ImageSlider
  images={[
    { src: "/img1.jpg", alt: "Image 1" },
    { src: "/img2.jpg", alt: "Image 2" },
  ]}
  controls                         // boolean — show prev/next
  imageLabel="Afbeelding"
  previousLabel="Vorige"
  nextLabel="Volgende"
/>
```

## Feedback

### Alert

```tsx
<Alert
  heading="Let op"                 // string (required)
  headingLevel={2}                 // 1-4 (required)
  severity="warning"               // 'error' | 'success' | 'warning' | undefined (info)
  closeable                        // boolean — show close button
  closeButtonLabel="Sluiten"
  onClose={() => {}}
>
  <Paragraph>Alert body content.</Paragraph>
</Alert>
```

### Dialog

A small modal window for a short confirmation, a yes/no question or a brief reminder. For anything bigger, use `ModalDialog`.

```tsx
<Button onClick={() => Dialog.open("#my-dialog")}>Verwijderen</Button>

<Dialog
  id="my-dialog"
  heading="Weet u het zeker?"      // string (required)
  closeButtonLabel="Sluiten"
  footer={<Button onClick={Dialog.close}>OK</Button>}
>
  <Paragraph>Dialog content.</Paragraph>
</Dialog>
```

- `Dialog.open(selector)` takes a **CSS selector** — `"#my-dialog"`, not `"my-dialog"`.
- `Dialog.close` is a click handler (it closes the `<dialog>` containing the clicked button). Pass it as `onClick={Dialog.close}`; calling `Dialog.close()` without an event is a type error and crashes.
- Alternatively, put a `<form method="dialog">` inside and give each submit button a `value`.

### ModalDialog

A window for a self-contained task or message that needs full attention — e.g. a form to create or edit something in an application (v4.4.0+). On public websites, give such a task its own page instead.

```tsx
<Button onClick={() => ModalDialog.open("#edit-dialog")}>Bewerken</Button>

<ModalDialog id="edit-dialog" aria-labelledby="edit-dialog-heading">
  <ModalDialog.Header closeButtonAccessibleName="Sluiten">
    <Heading id="edit-dialog-heading" level={1} size="level-3">Adres wijzigen</Heading>
  </ModalDialog.Header>
  <ModalDialog.Body>
    <form id="edit-form" method="dialog">…</form>
  </ModalDialog.Body>
  <ModalDialog.Footer>
    <ActionGroup>
      <Button form="edit-form" type="submit" value="save">Opslaan</Button>
      <Button variant="secondary" onClick={ModalDialog.close}>Annuleren</Button>
    </ActionGroup>
  </ModalDialog.Footer>
</ModalDialog>

{/* Or controlled */}
<ModalDialog open={isOpen} onClose={() => setIsOpen(false)} aria-labelledby="…">…</ModalDialog>
```

- Always give it an accessible name: `aria-labelledby` pointing at the heading in the Header (heading level 1 — the dialog starts a new layer).
- `ModalDialog.open(selector)` takes a CSS selector (`"#edit-dialog"`); `ModalDialog.close` is a click handler.
- `ModalDialog.Header` also takes `closeButtonSize` and (applications only) `closeButtonComponent` / `closeButtonIcon`.

### Badge

```tsx
<Badge
  label="Nieuw"                    // string | number (required)
  color="azure"                    // 'azure' | 'lime' | 'magenta' | 'orange' | 'purple' | 'red' | 'yellow'
  icon={StarIcon}
/>
```

### Avatar

```tsx
<Avatar
  label="Jan Jansen"              // string (required)
  color="azure"                    // 'azure' | 'green' | 'lime' | 'magenta' | 'orange' | 'yellow'
  imageSrc="/avatar.jpg"
/>
```

## Utility

### Icon

```tsx
<Icon
  svg={SearchIcon}                 // icon component, <svg> element, or (props) => <svg> (required)
  size="large"                     // 'small' | 'large' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5'
  color="inverse"                  // 'inverse'
  square                           // boolean — square bounding box
/>
```

### Logo

Amsterdam logo.

```tsx
<Logo brand="amsterdam" />        // LogoBrand | LogoBrandConfig
```

**Available brands:** `'amsterdam'` | `'amsterdam-english'` | `'ggd-amsterdam'` | `'ggd-amsterdam-inspectie'` | `'museum-weesp'` | `'stadsarchief'` | `'stadsbank-van-lening'` | `'vga-verzekeringen'`

For custom logos, pass a `LogoBrandConfig` object: `{ label: string, svg: ComponentType<SVGProps<SVGSVGElement>> }`.

### Skeleton

Placeholder shapes while content loads (v4.3.0+). Hidden from assistive technology — announce loading once on the region instead.

```tsx
<section aria-busy={isLoading}>
  <p className="ams-visually-hidden" role="status">{isLoading ? "Resultaten worden geladen" : `${count} resultaten`}</p>
  {isLoading ? (
    <Skeleton>
      <Skeleton.Image />
      <Skeleton.Heading />
      <Skeleton.Paragraph lines={3} />   {/* also Skeleton.List lines, Skeleton.Table rows/columns */}
    </Skeleton>
  ) : (
    <Results />
  )}
</section>
```

### Lists

```tsx
{/* Ordered list */}
<OrderedList color="inverse" markers size="small">
  <OrderedList.Item>First</OrderedList.Item>
  <OrderedList.Item>Second</OrderedList.Item>
</OrderedList>

{/* Unordered list */}
<UnorderedList markers>
  <UnorderedList.Item>Item A</UnorderedList.Item>
  <UnorderedList.Item>Item B</UnorderedList.Item>
</UnorderedList>

{/* File list — each item takes a File object, not children */}
<FileList>
  <FileList.Item file={file} onDelete={() => removeFile(file)} />
</FileList>
```

### ProgressList

Steps are static by default. Add `collapsible` (v4.0.0+) to turn each step heading into a toggle button; completed steps then start collapsed. All panels force-expand when printing.

```tsx
<ProgressList collapsible headingLevel={2}>
  <ProgressList.Step heading="Stap 1" status="completed">
    {/* Starts collapsed because status="completed" and the list is collapsible */}
    <Paragraph>Completed step.</Paragraph>
  </ProgressList.Step>
  <ProgressList.Step
    heading="Stap 2"
    status="current"
    hasSubsteps
    onToggle={(expanded) => console.log(expanded)}
  >
    <ProgressList.Substeps>
      <ProgressList.Substep>Sub A</ProgressList.Substep>
      <ProgressList.Substep>Sub B</ProgressList.Substep>
    </ProgressList.Substeps>
  </ProgressList.Step>
  <ProgressList.Step heading="Stap 3" defaultExpanded={false}>
    {/* Explicitly collapsed despite no completed status */}
    <Paragraph>Upcoming step.</Paragraph>
  </ProgressList.Step>
</ProgressList>
```

**ProgressList.Step props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | required | Heading text for the step |
| `status` | `'current' \| 'completed'` | — | Progress state |
| `hasSubsteps` | `boolean` | `false` | Whether step contains substeps (for connector lines) |
| `defaultExpanded` | `boolean` | `false` if completed, `true` otherwise | Initial expanded state (uncontrolled) |
| `expanded` | `boolean` | — | Controlled expanded state — pair with `onToggle` |
| `onToggle` | `(expanded: boolean) => void` | — | Callback when step is expanded or collapsed |

`collapsed` and `defaultCollapsed` are deprecated (v4.3.0, removal on or after 2027-01-10) — use `expanded` / `defaultExpanded`, which take the opposite value. These props only have an effect when the `ProgressList` is `collapsible`.

## Components ADS Does Not Ship — Use Radix Primitives

ADS exports 70 components but does not ship every interaction primitive. When you need a Popover, DropdownMenu, Tooltip, ContextMenu, or a Dialog with a custom trigger, **use Radix UI headless primitives** and style them with AMS tokens via a CVA wrapper. **Do not** reach for `shadcn/ui` directly — its design tokens conflict with ADS, and its variant system is opinionated about colors that ADS does not use.

| Need | Radix package | ADS-shipped alternative? |
|---|---|---|
| Popover (anchored floating panel) | `@radix-ui/react-popover` | No |
| Dropdown menu (button → menu of items) | `@radix-ui/react-dropdown-menu` | No (`<Menu>` is for navigation, not actions) |
| Tooltip (hover/focus hint) | `@radix-ui/react-tooltip` | No |
| Context menu (right-click) | `@radix-ui/react-context-menu` | No |
| Dialog with custom trigger / non-modal flows | `@radix-ui/react-dialog` | Yes — use `<Dialog>` from ADS for modal forms; reach for Radix only when you need imperative control or non-modal behavior |

### Pattern: token-styled Radix Popover

```tsx
import * as Popover from "@radix-ui/react-popover"
import { Button } from "@amsterdam/design-system-react"

export function HelpPopover() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="tertiary">Help</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="
            bg-ams-bg
            text-ams-text
            border border-ams-separator
            font-ams
            p-ams-m
            max-w-sm
            shadow-md
          "
        >
          Hier vindt u uitleg over dit onderdeel.
          <Popover.Arrow className="fill-ams-bg" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
```

**Rules:**

1. **Trigger uses an ADS component.** Always wrap an `<ams-button>`, `<ams-icon-button>`, or `<ams-link>` in `<Radix.Trigger asChild>`. Never style a Radix Trigger as a button from scratch.
2. **Content uses AMS tokens.** Background `bg-ams-bg`, text `text-ams-text`, borders `border-ams-separator`, padding `p-ams-m`, font `font-ams`. No hardcoded colors. The Tailwind utilities here come from the bridge in `references/tailwind-bridge.md`.
3. **Portal to body.** Always use `<Radix.Portal>` for overlay primitives so they escape parent `overflow: hidden` containers.
4. **One CVA wrapper per primitive.** If you use a Popover in three places, extract a `<TokenPopover>` component that pre-applies the AMS-styled className. Three loose `Popover.Content` elements with copy-pasted classNames will drift.
5. **Animations are optional.** Radix exposes `data-state="open"` / `data-state="closed"` attributes. If you want a fade-in, add a `data-[state=open]:animate-in fade-in-0` utility from `tw-animate-css`. Match the timing to `aesthetic-discipline.md` § Motion (≤200ms for tooltips, ≤400ms for popovers).

### Pattern: token-styled Radix DropdownMenu

```tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconButton } from "@amsterdam/design-system-react"
import { MenuIcon } from "@amsterdam/design-system-react-icons"

export function ActionMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton svg={MenuIcon} label="Acties" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          className="bg-ams-bg border border-ams-separator min-w-[12rem] py-ams-xs"
        >
          <DropdownMenu.Item className="px-ams-m py-ams-s text-ams-text font-ams data-[highlighted]:bg-ams-azure/10 outline-none cursor-pointer">
            Bewerken
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-ams-m py-ams-s text-ams-text font-ams data-[highlighted]:bg-ams-azure/10 outline-none cursor-pointer">
            Delen
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-ams-separator my-ams-xs" />
          <DropdownMenu.Item className="px-ams-m py-ams-s text-ams-error font-ams data-[highlighted]:bg-ams-error/10 outline-none cursor-pointer">
            Verwijderen
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
```

### What about Tanstack Table?

For sortable/filterable data tables, use `@tanstack/react-table` for **state and logic** while keeping ADS `<Table>` markup for the **rendered output**:

```tsx
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { Table } from "@amsterdam/design-system-react"

export function DataTable({ data, columns }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <Table>
      <Table.Header>
        {table.getHeaderGroups().map((hg) => (
          <Table.Row key={hg.id}>
            {hg.headers.map((header) => (
              <Table.HeaderCell key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
```

This pattern keeps the visual styling (colors, spacing, hover states) under ADS and offloads sort/filter/paginate logic to Tanstack. Never replace `<Table.Cell>` with a styled `<td>` — you'll lose the ADS hover and zebra-stripe styling.
