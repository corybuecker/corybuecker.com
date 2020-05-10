const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.js')

module.exports = merge(baseConfig, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      EXLYTICS_URL: "'http://localhost:8080'",
      EXLYTICS_ACCOUNT: "'9e6f52cf-e79d-42aa-b8a4-62811f597a43'"
    })
  ]
})
