const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const output = process.env.NODE_ENV === 'production' ? 'output' : 'out'

module.exports = {
  entry: {
    analytics: './src/analytics.ts',
    prism: './src/prism.js',
    styles: './src/styles.scss'
  },
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin(),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: path.resolve(__dirname, output)
      }
    ])
  ],
  output: {
    path: path.resolve(__dirname, output),
    filename: '[name].js'
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
