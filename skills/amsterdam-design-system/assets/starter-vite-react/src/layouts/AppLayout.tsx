import { Outlet } from "react-router-dom"
import {
  Page,
  PageHeader,
  PageFooter,
  SkipLink,
} from "@amsterdam/design-system-react"

import { RouterLink } from "@/lib/RouterLink"

/**
 * Root layout — wraps every route in a Page + PageHeader + PageFooter shell.
 *
 * Every ADS link component accepts a router link (ADS React v4.2.0+):
 * `linkComponent` on links, `logoLinkComponent` on PageHeader. Pass the shared
 * `RouterLink` so navigation stays client-side.
 */
export function AppLayout() {
  return (
    <>
      <SkipLink href="#main">Ga naar inhoud</SkipLink>
      <Page>
        <PageHeader
          brandName="Amsterdam"
          logoLink="/"
          logoLinkComponent={RouterLink}
          logoLinkTitle="Naar de homepage"
          menuItems={
            <PageHeader.MenuLink href="/" linkComponent={RouterLink}>
              Home
            </PageHeader.MenuLink>
          }
        />

        <Outlet />

        <PageFooter>
          <PageFooter.Menu>
            <PageFooter.MenuLink href="/privacy" linkComponent={RouterLink}>Privacy</PageFooter.MenuLink>
            <PageFooter.MenuLink href="/toegankelijkheid" linkComponent={RouterLink}>
              Toegankelijkheid
            </PageFooter.MenuLink>
          </PageFooter.Menu>
        </PageFooter>
      </Page>
    </>
  )
}
