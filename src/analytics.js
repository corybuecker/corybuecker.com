const recordPageview = async () => {
  const analyticsUrl = new URL('https://analytics.corybuecker.com')
  const pageUrl = new URL(window.location.toString())

  analyticsUrl.search = `page=${pageUrl.pathname}`

  await fetch(analyticsUrl.toString())
}
recordPageview()

const formatTimeElement = element => {
  const timeString = element.dateTime
  const dateTime = new Date(timeString)

  element.innerText = dateTime.toLocaleDateString()
}

const timeElements = document.getElementsByTagName('time')

for (let timeElement of timeElements) {
  formatTimeElement(timeElement)
}
