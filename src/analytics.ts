const recordPageview = (): boolean => {
  const analyticsUrl = new URL('https://exlytics.corybuecker.com')
  const pageUrl = new URL(window.location.toString())

  analyticsUrl.search = `page=${pageUrl.pathname}`

  return navigator.sendBeacon(analyticsUrl.toString())
}

recordPageview()

const formatTimeElement = (element: HTMLTimeElement): void => {
  const timeString = element.dateTime

  element.innerText = new Date(timeString).toLocaleDateString()
}

const timeElements = document.getElementsByTagName('time')

Array.from(timeElements).forEach(formatTimeElement)

class TrackedAnchor extends HTMLElement {
  constructor() {
    super()
    const anchor: HTMLAnchorElement = this.getElementsByTagName('a')[0]

    anchor.addEventListener('click', this.handleTrackedAnchorClick)
  }

  handleTrackedAnchorClick(event: Event) {
    if (event.currentTarget instanceof HTMLAnchorElement === false) {
      return
    }

    const target = event.currentTarget as HTMLAnchorElement
    const analyticsUrl = new URL('https://exlytics.corybuecker.com')

    analyticsUrl.search = `click_link=${target.href}`

    navigator.sendBeacon(analyticsUrl.toString())
  }
}

customElements.define('tracked-anchor', TrackedAnchor)
