const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      EXLYTICS_URL: '\'https://integration-exlytics.corybuecker.com\''
    })
  ]
});