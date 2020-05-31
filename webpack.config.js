const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');

const output = process.env.NODE_ENV === 'production' ? 'output' : 'out'

module.exports = {
  entry: './src',
  mode: 'development',
  plugins: [
    new MiniCssExtractPlugin(),
    new CompressionPlugin(),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'static'),
        to: path.resolve(__dirname, output)
      }]
    })
  ],
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, output),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
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
