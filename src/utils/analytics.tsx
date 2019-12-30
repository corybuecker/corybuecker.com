const recordPageview = async () => {
  const analyticsUrl = new URL('https://analytics.corybuecker.com')
  const pageUrl = new URL(window.location.toString())

  analyticsUrl.search = `page=${pageUrl.pathname}`

  await fetch(analyticsUrl.toString())
}

export const saveClick = async () => console.log('test')

export default recordPageview
