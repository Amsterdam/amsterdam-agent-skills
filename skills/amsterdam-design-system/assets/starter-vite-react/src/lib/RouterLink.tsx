import type { AnchorHTMLAttributes } from "react"
import { useHref, useLinkClickHandler } from "react-router-dom"

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>

const isExternal = (href: string) => /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href)

function InternalLink({ href, onClick, target, ...props }: AnchorProps & { href: string }) {
  const resolvedHref = useHref(href)
  const handleClick = useLinkClickHandler<HTMLAnchorElement>(href, { target })

  return (
    <a
      {...props}
      href={resolvedHref}
      onClick={(event) => {
        // Run the caller's handler first; it can opt out with preventDefault().
        onClick?.(event)
        // useLinkClickHandler already lets modifier keys, non-primary buttons and
        // target="_blank" fall through to the browser.
        if (!event.defaultPrevented) handleClick(event)
      }}
      target={target}
    />
  )
}

/**
 * Pass as `linkComponent` (or `logoLinkComponent` on PageHeader) to any ADS
 * link component so it navigates client-side with React Router:
 *
 *   <StandaloneLink href="/meedoen" linkComponent={RouterLink}>Meedoen</StandaloneLink>
 *
 * ADS passes `href` and the other anchor attributes straight through. Defined at
 * module level, so the component type is stable across renders (an inline
 * `linkComponent={(p) => …}` would remount the link on every render).
 * External URLs and downloads render a plain anchor.
 */
export function RouterLink({ href, ...props }: AnchorProps) {
  if (!href || isExternal(href) || props.download !== undefined) {
    return <a href={href} {...props} />
  }

  return <InternalLink href={href} {...props} />
}
