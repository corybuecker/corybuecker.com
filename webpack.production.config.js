const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      EXLYTICS_URL: '\'https://exlytics.corybuecker.com\''
    })
  ]
});