import type { AnchorHTMLAttributes, ComponentType } from "react"
import { Outlet, Link } from "react-router-dom"
import {
  Page,
  PageHeader,
  PageFooter,
  SkipLink,
} from "@amsterdam/design-system-react"

/**
 * Adapter that converts ADS's `ComponentType<AnchorHTMLAttributes>` shape
 * into a React Router <Link>. Needed because RR's Link requires `to`, not `href`.
 *
 * Use ONLY for `PageHeader.logoLinkComponent` — other ADS link components
 * (StandaloneLink, PageHeader.MenuLink, Breadcrumb.Link) do NOT accept a
 * linkComponent prop. See README "Customizing the navigation" for the workaround.
 */
const LogoLink: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  children,
  ...rest
}) => (
  <Link to={href ?? "/"} {...rest}>
    {children}
  </Link>
)

/**
 * Root layout — wraps every route in a Page + PageHeader + PageFooter shell.
 *
 * Note on navigation: PageHeader.MenuLink and StandaloneLink in ADS v3.3.0 do
 * NOT route through React Router. They are plain anchors and trigger full page
 * reloads. For internal apps where this matters, intercept clicks at a parent
 * level or wrap each link manually with a custom component. The logo link is
 * the only one with a built-in adapter (`logoLinkComponent` above).
 */
export function AppLayout() {
  return (
    <>
      <SkipLink href="#main">Ga naar inhoud</SkipLink>
      <Page>
        <PageHeader
          brandName="Amsterdam"
          logoLink="/"
          logoLinkComponent={LogoLink}
          logoLinkTitle="Naar de homepage"
          menuItems={
            <PageHeader.MenuLink href="/">Home</PageHeader.MenuLink>
          }
        />

        <Outlet />

        <PageFooter>
          <PageFooter.Menu>
            <PageFooter.MenuLink href="/privacy">Privacy</PageFooter.MenuLink>
            <PageFooter.MenuLink href="/toegankelijkheid">
              Toegankelijkheid
            </PageFooter.MenuLink>
          </PageFooter.Menu>
        </PageFooter>
      </Page>
    </>
  )
}
