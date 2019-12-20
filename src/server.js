const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 8080
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const compression = require('compression')
const csp = require('express-csp-header')

app.prepare().then(() => {
  const server = express()

  server.use(compression())
  server.use(
    csp({
      policies: {
        'default-src': [csp.NONE],
        'font-src': [csp.NONE],
        'object-src': [csp.NONE],
        'img-src': [csp.SELF],
        'script-src': [csp.SELF],
        'style-src': [csp.SELF],
        'connect-src': ['https://analytics.corybuecker.com'],
        'frame-ancestors': [csp.NONE]
      }
    })
  )

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
