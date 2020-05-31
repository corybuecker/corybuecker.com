const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      EXLYTICS_URL: '\'https://integration-exlytics.corybuecker.com\'',
      EXLYTICS_ACCOUNT: '\'d444f24c-1829-4f73-b7c1-76ffaf6f1687\''
    })
  ]
});