const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      EXLYTICS_URL: '\'https://exlytics.corybuecker.com\'',
      EXLYTICS_ACCOUNT: '\'c1c35a41-a439-404f-95a6-cdbfd5323b28\''
    })
  ]
});