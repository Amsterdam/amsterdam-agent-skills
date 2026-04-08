# Amsterdam Design System — Layout Patterns

Page layout templates for common Amsterdam project types.

## Public Website Page

Standard amsterdam.nl-style page with header, main content, sidebar, and footer.

```tsx
import {
  Breadcrumb,
  Grid,
  Heading,
  Page,
  PageFooter,
  PageHeader,
  Paragraph,
  SkipLink,
  StandaloneLink,
} from "@amsterdam/design-system-react"

function PublicPage() {
  return (
    <>
      <SkipLink href="#main">Ga naar inhoud</SkipLink>

      <Page>
        <PageHeader
          brandName="Amsterdam"
          logoLink="/"
          logoLinkTitle="Naar de homepage"
          menuItems={
            <>
              <PageHeader.MenuLink href="/onderwerpen">Onderwerpen</PageHeader.MenuLink>
              <PageHeader.MenuLink href="/contact">Contact</PageHeader.MenuLink>
            </>
          }
        />

        <Grid as="main" id="main" paddingVertical="large">
          <Grid.Cell span="all">
            <Breadcrumb>
              <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
              <Breadcrumb.Link href="/onderwerpen">Onderwerpen</Breadcrumb.Link>
              <Breadcrumb.Link>Huidige pagina</Breadcrumb.Link>
            </Breadcrumb>
          </Grid.Cell>

          <Grid.Cell span="all">
            <Heading level={1}>Paginatitel</Heading>
          </Grid.Cell>

          <Grid.Cell span={{ narrow: 4, medium: 5, wide: 8 }}>
            <Paragraph>
              Hoofdinhoud van de pagina. Deze kolom is breder en bevat
              de primaire content.
            </Paragraph>
          </Grid.Cell>

          <Grid.Cell span={{ narrow: 4, medium: 3, wide: 4 }}>
            <Heading level={2}>Gerelateerd</Heading>
            <StandaloneLink href="/related">Meer informatie</StandaloneLink>
          </Grid.Cell>
        </Grid>

        <PageFooter>
          <PageFooter.Spotlight>
            <Grid paddingVertical="large">
              <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
                <Heading level={2} color="inverse">Contact</Heading>
                <Paragraph color="inverse">
                  Heeft u een vraag? Bel 14 020.
                </Paragraph>
              </Grid.Cell>
              <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
                <Heading level={2} color="inverse">Volg de gemeente</Heading>
                <Paragraph color="inverse">
                  Blijf op de hoogte via social media.
                </Paragraph>
              </Grid.Cell>
            </Grid>
          </PageFooter.Spotlight>
          <PageFooter.Menu>
            <PageFooter.MenuLink href="/privacy">Privacy</PageFooter.MenuLink>
            <PageFooter.MenuLink href="/cookies">Cookies</PageFooter.MenuLink>
            <PageFooter.MenuLink href="/toegankelijkheid">Toegankelijkheid</PageFooter.MenuLink>
          </PageFooter.Menu>
        </PageFooter>
      </Page>
    </>
  )
}
```

## Dashboard Page (Compact Mode)

Internal tool layout with navigation sidebar and dense data display.

**Note:** This layout uses compact mode tokens. Import `compact.css` after `index.css`. For a runnable version of this shape (with React Router, Tanstack Query, and Tailwind bridge already wired), see `assets/starter-vite-react/`.

```tsx
import {
  Column,
  Grid,
  Heading,
  LinkList,
  Page,
  PageHeader,
  Paragraph,
  Row,
  Table,
  Tabs,
} from "@amsterdam/design-system-react"

function DashboardPage() {
  return (
    <Page>
      <PageHeader
        brandName="Intern Dashboard"
        logoLink="/"
        noMenuButtonOnWideWindow
        menuItems={
          <>
            <PageHeader.MenuLink href="/profile">Profiel</PageHeader.MenuLink>
            <PageHeader.MenuLink href="/logout">Uitloggen</PageHeader.MenuLink>
          </>
        }
      />

      <Grid as="main" paddingVertical="large">
        {/* Sidebar navigation */}
        <Grid.Cell span={{ narrow: 4, medium: 2, wide: 3 }}>
          <Column gap="small">
            <Heading level={2} size="level-4">Navigatie</Heading>
            <LinkList>
              <LinkList.Link href="/dashboard">Overzicht</LinkList.Link>
              <LinkList.Link href="/dashboard/users">Gebruikers</LinkList.Link>
              <LinkList.Link href="/dashboard/reports">Rapporten</LinkList.Link>
              <LinkList.Link href="/dashboard/settings">Instellingen</LinkList.Link>
            </LinkList>
          </Column>
        </Grid.Cell>

        {/* Main content area */}
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 9 }}>
          <Column gap="small">
            <Heading level={1} size="level-2">Overzicht</Heading>

            {/* Summary cards row */}
            <Row gap="small" wrap>
              <DashboardCard title="Totaal" value="1.234" />
              <DashboardCard title="Actief" value="567" />
              <DashboardCard title="In behandeling" value="89" />
            </Row>

            {/* Tabbed content */}
            <Tabs>
              <Tabs.List>
                <Tabs.Button aria-controls="recent">Recent</Tabs.Button>
                <Tabs.Button aria-controls="all">Alles</Tabs.Button>
              </Tabs.List>
              <Tabs.Panel id="recent">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>Naam</Table.HeaderCell>
                      <Table.HeaderCell>Status</Table.HeaderCell>
                      <Table.HeaderCell>Datum</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>001</Table.Cell>
                      <Table.Cell>Item A</Table.Cell>
                      <Table.Cell>Actief</Table.Cell>
                      <Table.Cell>2024-01-15</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Tabs.Panel>
              <Tabs.Panel id="all">
                <Paragraph>All items view.</Paragraph>
              </Tabs.Panel>
            </Tabs>
          </Column>
        </Grid.Cell>
      </Grid>
    </Page>
  )
}
```

## Form Page

Multi-section form with validation.

```tsx
import {
  ActionGroup,
  Alert,
  Button,
  Checkbox,
  Column,
  ErrorMessage,
  Field,
  FieldSet,
  Grid,
  Heading,
  InvalidFormAlert,
  Label,
  Page,
  PageHeader,
  Paragraph,
  Radio,
  Select,
  TextArea,
  TextInput,
} from "@amsterdam/design-system-react"

function FormPage() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  return (
    <Page>
      <PageHeader brandName="Amsterdam" logoLink="/" />

      <Grid as="main" paddingVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 8 }}>
          <Column gap="small">
            <Heading level={1}>Contactformulier</Heading>
            <Paragraph>
              Vul het formulier in om contact op te nemen met de gemeente.
            </Paragraph>

            {submitted && Object.keys(errors).length > 0 && (
              <InvalidFormAlert
                heading="Controleer de volgende velden"
                headingLevel={2}
                errors={Object.entries(errors).map(([id, label]) => ({
                  id,
                  label,
                }))}
                focusOnRender
              />
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Column gap="small">
                {/* Personal info section */}
                <Heading level={2}>Persoonsgegevens</Heading>

                <Field invalid={!!errors.name}>
                  <Label htmlFor="name">Naam</Label>
                  {errors.name && (
                    <ErrorMessage id="name-error">{errors.name}</ErrorMessage>
                  )}
                  <TextInput
                    id="name"
                    invalid={!!errors.name}
                    aria-errormessage={errors.name ? "name-error" : undefined}
                    required
                  />
                </Field>

                <Field invalid={!!errors.email}>
                  <Label htmlFor="email">E-mailadres</Label>
                  {errors.email && (
                    <ErrorMessage id="email-error">{errors.email}</ErrorMessage>
                  )}
                  <TextInput
                    id="email"
                    type="email"
                    invalid={!!errors.email}
                    aria-errormessage={errors.email ? "email-error" : undefined}
                    required
                  />
                </Field>

                <Field>
                  <Label htmlFor="phone">Telefoonnummer</Label>
                  <TextInput id="phone" type="tel" />
                </Field>

                {/* Subject section */}
                <Heading level={2}>Uw vraag</Heading>

                <Field>
                  <Label htmlFor="subject">Onderwerp</Label>
                  <Select id="subject">
                    <Select.Option value="">Kies een onderwerp</Select.Option>
                    <Select.Option value="vraag">Algemene vraag</Select.Option>
                    <Select.Option value="klacht">Klacht</Select.Option>
                    <Select.Option value="suggestie">Suggestie</Select.Option>
                  </Select>
                </Field>

                <Field invalid={!!errors.message}>
                  <Label htmlFor="message">Bericht</Label>
                  {errors.message && (
                    <ErrorMessage id="message-error">{errors.message}</ErrorMessage>
                  )}
                  <TextArea
                    id="message"
                    rows={6}
                    invalid={!!errors.message}
                    aria-errormessage={errors.message ? "message-error" : undefined}
                    required
                  />
                </Field>

                {/* Preferences */}
                <FieldSet legend="Hoe wilt u antwoord ontvangen?">
                  <Radio name="response" value="email">Per e-mail</Radio>
                  <Radio name="response" value="phone">Telefonisch</Radio>
                  <Radio name="response" value="post">Per post</Radio>
                </FieldSet>

                <FieldSet legend="Voorwaarden">
                  <Checkbox required>
                    Ik ga akkoord met de privacyverklaring
                  </Checkbox>
                </FieldSet>

                {/* Actions */}
                <ActionGroup>
                  <Button variant="primary" type="submit">Versturen</Button>
                  <Button variant="secondary" type="reset">Wissen</Button>
                </ActionGroup>
              </Column>
            </form>
          </Column>
        </Grid.Cell>

        {/* Sidebar */}
        <Grid.Cell span={{ narrow: 4, medium: 2, wide: 4 }}>
          <Column gap="small">
            <Alert heading="Tip" headingLevel={2}>
              <Paragraph>
                U kunt ons ook bellen op 14 020, bereikbaar op werkdagen
                van 08:00 tot 18:00 uur.
              </Paragraph>
            </Alert>
          </Column>
        </Grid.Cell>
      </Column>
      </Grid>
    </Page>
  )
}
```

## React Router + AppLayout Outlet

The most common shape for an Amsterdam internal tool: a single `<AppLayout>` route at the root, an `<Outlet>` for nested routes, and an optional `<AuthGate>` outlet wrapper for authenticated sections. This is what real Amsterdam projects (e.g. `srdo-2945`) use.

```tsx
// src/router.tsx
import { createBrowserRouter, Outlet, Navigate, useLocation } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { LoginPage } from "@/pages/LoginPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

function AuthGate() {
  const isAuthed = useIsAuthenticated()  // your auth hook
  const loc = useLocation()

  if (!isAuthed) {
    const from = `${loc.pathname}${loc.search}${loc.hash}`
    return <Navigate to="/login" state={{ from }} replace />
  }

  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,           // <Page> + <PageHeader> + <Outlet/> + <PageFooter>
    errorElement: <NotFoundPage />,
    children: [
      { path: "/login", element: <LoginPage /> },
      {
        element: <AuthGate />,         // protected sub-tree
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
```

```tsx
// src/layouts/AppLayout.tsx
import type { AnchorHTMLAttributes, ComponentType } from "react"
import { Outlet, Link } from "react-router-dom"
import { Page, PageHeader, PageFooter, SkipLink } from "@amsterdam/design-system-react"

// Adapter — React Router's <Link> needs `to`, ADS's logoLinkComponent expects `href`
const LogoLink: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href, children, ...rest
}) => (
  <Link to={href ?? "/"} {...rest}>{children}</Link>
)

export function AppLayout() {
  return (
    <>
      <SkipLink href="#main">Ga naar inhoud</SkipLink>
      <Page>
        <PageHeader
          brandName="Amsterdam"
          logoLink="/"
          logoLinkComponent={LogoLink}   // ← ONLY component with built-in routing slot
          menuItems={
            <PageHeader.MenuLink href="/dashboard">Dashboard</PageHeader.MenuLink>
          }
        />

        <Outlet />                       {/* ← all child routes render here */}

        <PageFooter>
          <PageFooter.Menu>
            <PageFooter.MenuLink href="/privacy">Privacy</PageFooter.MenuLink>
          </PageFooter.Menu>
        </PageFooter>
      </Page>
    </>
  )
}
```

**Key pattern:** `<Page>` is the outer wrapper that contains both header and outlet. The `Outlet` renders inside `<Page>` but outside any `<Grid>` — let each page define its own `<Grid as="main">` root so different routes can have different padding rhythms.

For a runnable version of this exact pattern, see `assets/starter-vite-react/src/layouts/AppLayout.tsx` and `src/router.tsx`.

### Routing Link integration with React Router v7 — be honest about the limitation

**ADS v3.3.0 only ships a `linkComponent` slot on TWO components:**

| Component | Prop | Slot type |
|---|---|---|
| `PageHeader` | `logoLinkComponent` | `ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>` |
| `Pagination` | `linkComponent` | `ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>` |

Everything else — `StandaloneLink`, `PageHeader.MenuLink`, `Breadcrumb.Link`, `Card.Link`, `LinkList.Link`, `Link` — is a plain `<a>` and **will trigger a full page reload** when clicked. There is no `linkComponent`, no `asChild`, no render prop.

Both slot props use the `AnchorHTMLAttributes<HTMLAnchorElement>` shape, which means React Router's `Link` (which requires `to`, not `href`) is **not directly assignable**. You need a small adapter:

```tsx
import type { AnchorHTMLAttributes, ComponentType } from "react"
import { Link } from "react-router-dom"

const RouterAdapter: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href, children, ...rest
}) => (
  <Link to={href ?? "#"} {...rest}>{children}</Link>
)

// Use it on the two slots that exist:
<PageHeader logoLinkComponent={RouterAdapter} logoLink="/" /* … */ />
<Pagination linkComponent={RouterAdapter} linkTemplate={(p) => `/page/${p}`} /* … */ />
```

For Next.js App Router, swap `Link from "react-router-dom"` for `next/link` and adjust the adapter to map `href` straight through (Next's Link uses `href`, not `to`).

**For everything else, you have three options:**

1. **Accept the full reload.** Acceptable for low-traffic public sites and footer links. The browser scroll position resets but the bundle is cached.

2. **Wrap with React Router's `<Link>` as a parent.** This nests an `<a>` inside an `<a>`, which is invalid HTML — do NOT do this.

3. **Build a custom click interceptor.** Wrap the ADS component in a custom component that uses `useNavigate()` and an `onClick` handler to call `navigate(href)` and `event.preventDefault()`. Example:

   ```tsx
   import { useNavigate } from "react-router-dom"
   import { StandaloneLink, type StandaloneLinkProps } from "@amsterdam/design-system-react"

   export function RouterStandaloneLink({ href, onClick, ...rest }: StandaloneLinkProps) {
     const navigate = useNavigate()
     return (
       <StandaloneLink
         href={href}
         onClick={(e) => {
           // Let cmd/ctrl-click and external links pass through
           if (e.metaKey || e.ctrlKey || !href || href.startsWith("http")) return
           e.preventDefault()
           navigate(href)
           onClick?.(e)
         }}
         {...rest}
       />
     )
   }
   ```

   Apply the same pattern for `Breadcrumb.Link`, `Card.Link`, `PageHeader.MenuLink`, etc. as needed. This is more code than the built-in slot, but it preserves SPA behavior cleanly.

**Pragmatic recommendation:** for an internal Amsterdam tool, accept the full reload on `PageHeader.MenuLink`, `PageFooter.MenuLink`, and `Breadcrumb.Link` (they're navigation, not in-page transitions). Use the click interceptor only on `StandaloneLink` and `Card.Link` inside the main content area, where in-app navigation is more frequent and the reload is jarring.

## Article / Content Page

Long-form content with visual hierarchy using nested `Column` components for section spacing.

```tsx
import {
  Column,
  Grid,
  Heading,
  Page,
  PageHeader,
  PageFooter,
  Paragraph,
  StandaloneLink,
} from "@amsterdam/design-system-react"

function ArticlePage() {
  return (
    <Page>
      <PageHeader brandName="Amsterdam" logoLink="/" />

      <Grid as="main" paddingVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 8 }}>
          <Column gap="large">
            <Column gap="small">
              <Heading level={1}>Afvalinzameling in Amsterdam</Heading>
              <Paragraph>
                De gemeente Amsterdam zamelt afval in op vaste dagen. Hieronder
                leest u hoe de afvalinzameling werkt en wat u kunt doen om
                afval te scheiden.
              </Paragraph>
            </Column>

            <Column gap="small">
              <Heading level={2}>Wanneer wordt mijn afval opgehaald?</Heading>
              <Paragraph>
                De ophaaldagen zijn afhankelijk van uw stadsdeel. U kunt uw
                ophaaldag vinden via de afvalwijzer op amsterdam.nl.
              </Paragraph>
              <Paragraph>
                Zet uw afval op de ophaaldag voor 07:30 uur buiten. Gebruik
                hiervoor de juiste container of afvalzak.
              </Paragraph>
            </Column>

            <Column gap="small">
              <Heading level={2}>Afval scheiden</Heading>
              <Paragraph>
                Amsterdam wil in 2030 een circulaire stad zijn. Door afval te
                scheiden draagt u bij aan hergebruik van grondstoffen.
              </Paragraph>
              <Paragraph>
                Papier, glas, textiel en plastic kunt u apart inleveren bij
                de ondergrondse containers in uw buurt.
              </Paragraph>
            </Column>

            <Column gap="small">
              <Heading level={2}>Grofvuil</Heading>
              <Paragraph>
                Grofvuil kunt u gratis laten ophalen door de gemeente. Maak
                hiervoor een afspraak via amsterdam.nl of bel 14 020.
              </Paragraph>
              <StandaloneLink href="/grofvuil">
                Grofvuil ophalen aanvragen
              </StandaloneLink>
            </Column>
          </Column>
        </Grid.Cell>

        <Grid.Cell span={{ narrow: 4, medium: 2, wide: 4 }}>
          <Column gap="small">
            <Heading level={2} size="level-4">Handige links</Heading>
            <StandaloneLink href="/afvalwijzer">Afvalwijzer</StandaloneLink>
            <StandaloneLink href="/recyclepunten">Recyclepunten</StandaloneLink>
          </Column>
        </Grid.Cell>
      </Grid>

      <PageFooter>
        <PageFooter.Menu>
          <PageFooter.MenuLink href="/privacy">Privacy</PageFooter.MenuLink>
          <PageFooter.MenuLink href="/toegankelijkheid">Toegankelijkheid</PageFooter.MenuLink>
        </PageFooter.Menu>
      </PageFooter>
    </Page>
  )
}
```

**Key pattern:** Outer `Column gap="large"` separates sections. Inner `Column gap="small"` keeps heading-to-paragraph spacing tight within each section.

## Card Grid Layout

Grid of linked cards for topic overview pages.

```tsx
import {
  Card,
  Grid,
  Heading,
  Page,
  PageHeader,
  Paragraph,
} from "@amsterdam/design-system-react"

function TopicsPage() {
  const topics = [
    { title: "Parkeren", description: "Parkeervergunning aanvragen", href: "/parkeren", image: "/parkeren.jpg" },
    { title: "Afval", description: "Afvalinzameling en recycling", href: "/afval", image: "/afval.jpg" },
    { title: "Verhuizen", description: "Verhuizing doorgeven", href: "/verhuizen", image: "/verhuizen.jpg" },
    // ...more topics
  ]

  return (
    <Page>
      <PageHeader brandName="Amsterdam" logoLink="/" />

      <Grid as="main" paddingVertical="large">
        <Grid.Cell span="all">
          <Heading level={1}>Onderwerpen</Heading>
        </Grid.Cell>

        {topics.map((topic) => (
          <Grid.Cell key={topic.href} span={{ narrow: 4, medium: 4, wide: 4 }}>
            <Card>
              <Card.Image src={topic.image} alt="" />
              <Card.HeadingGroup>
                <Card.Heading level={2}>{topic.title}</Card.Heading>
              </Card.HeadingGroup>
              <Paragraph>{topic.description}</Paragraph>
              <Card.Link href={topic.href}>Meer informatie</Card.Link>
            </Card>
          </Grid.Cell>
        ))}
      </Grid>
    </Page>
  )
}
```

## Accordion FAQ Page

```tsx
import {
  Accordion,
  Grid,
  Heading,
  Page,
  PageHeader,
  Paragraph,
} from "@amsterdam/design-system-react"

function FaqPage() {
  return (
    <Page>
      <PageHeader brandName="Amsterdam" logoLink="/" />

      <Grid as="main" paddingVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 8 }}>
          <Heading level={1}>Veelgestelde vragen</Heading>

          <Accordion headingLevel={2}>
            <Accordion.Section label="Hoe vraag ik een vergunning aan?">
              <Paragraph>
                U kunt een vergunning aanvragen via het online formulier...
              </Paragraph>
            </Accordion.Section>
            <Accordion.Section label="Wat zijn de kosten?">
              <Paragraph>
                De kosten zijn afhankelijk van het type vergunning...
              </Paragraph>
            </Accordion.Section>
            <Accordion.Section label="Hoe lang duurt de behandeling?">
              <Paragraph>
                De behandeltijd is gemiddeld 8 weken...
              </Paragraph>
            </Accordion.Section>
          </Accordion>
        </Grid.Cell>
      </Grid>
    </Page>
  )
}
```

## Search Results Page

```tsx
import {
  Grid,
  Heading,
  LinkList,
  Page,
  PageHeader,
  Pagination,
  Paragraph,
  SearchField,
} from "@amsterdam/design-system-react"

function SearchResultsPage({ results, totalPages, currentPage }) {
  return (
    <Page>
      <PageHeader brandName="Amsterdam" logoLink="/" />

      <Grid as="main" paddingVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 8 }}>
          <Heading level={1}>Zoekresultaten</Heading>

          <SearchField onSubmit={handleSearch}>
            <SearchField.Input defaultValue={query} placeholder="Zoeken..." />
            <SearchField.Button />
          </SearchField>

          <Paragraph size="small">
            {results.length} resultaten gevonden
          </Paragraph>

          <LinkList>
            {results.map((result) => (
              <LinkList.Link key={result.id} href={result.url}>
                {result.title}
              </LinkList.Link>
            ))}
          </LinkList>

          <Pagination
            totalPages={totalPages}
            page={currentPage}
            linkTemplate={(page) => `/search?q=${query}&page=${page}`}
          />
        </Grid.Cell>
      </Grid>
    </Page>
  )
}
```

## CSS Grid Classes (Non-React)

For non-React contexts (plain HTML, server-rendered):

```html
<div class="ams-page">
  <header class="ams-page-header">
    <!-- header content -->
  </header>

  <main class="ams-grid ams-grid--padding-vertical-large">
    <div class="ams-grid__cell--span-all">
      <h1 class="ams-heading ams-heading--level-1">Title</h1>
    </div>
    <div class="ams-grid__cell--span-8-wide ams-grid__cell--span-5-medium">
      <p class="ams-paragraph">Main content</p>
    </div>
    <div class="ams-grid__cell--span-4-wide ams-grid__cell--span-3-medium">
      <p class="ams-paragraph">Sidebar</p>
    </div>
  </main>

  <footer class="ams-page-footer">
    <!-- footer content -->
  </footer>
</div>
```
