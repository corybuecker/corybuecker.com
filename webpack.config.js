const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: ['./src/analytics.ts', './src/main.scss'],
  mode: 'production',
  plugins: [new MiniCssExtractPlugin()],
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
}
