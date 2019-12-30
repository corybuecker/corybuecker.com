import React, { FunctionComponent } from 'react'
import Link from 'next/link'

type TrackedLinkProps = {
  href: string
  as: string
}

const trackClick = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
  const target = e.currentTarget
  const analyticsUrl = new URL('https://analytics.corybuecker.com')

  analyticsUrl.search = `click_link=${target.href}`

  fetch(analyticsUrl.toString())
}

const TrackedLink: FunctionComponent<TrackedLinkProps> = ({
  href,
  as,
  children
}) => {
  return (
    <Link href={href} as={as}>
      <a href={as} onClick={trackClick}>
        {children}
      </a>
    </Link>
  )
}

export default TrackedLink
