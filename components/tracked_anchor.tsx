import React, { FunctionComponent } from 'react'

type TrackedAnchorProps = {
  href: string
}

const trackClick = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
  e.preventDefault()
  e.stopPropagation()

  const target = e.currentTarget
  const analyticsUrl = new URL('https://analytics.corybuecker.com')

  analyticsUrl.search = `click_link=${target.href}`

  fetch(analyticsUrl.toString()).finally(
    () => (window.location.href = target.href)
  )
}

const TrackedAnchor: FunctionComponent<TrackedAnchorProps> = ({
  href,
  children
}) => {
  return (
    <a href={href} onClick={trackClick}>
      {children}
    </a>
  )
}

export default TrackedAnchor
