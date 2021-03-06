const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    content: './src/content.ts',
    popup: './src/popup.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
      new CopyPlugin([
          {
              from: 'manifest.json',
          },
          {
              from: 'src/fabricconfig.js',
          },
          {
              from: 'page_action_icon.svg',
          },
          {
            from: 'node_modules/@uifabric/icons/fonts/fabric-icons-*.woff',
            ignore: ['node_modules/@uifabric/icons/fonts/fabric-icons-*-*.woff'],
            to: 'fonts/[name].[ext]',
          },
      ]),
      new HtmlWebpackPlugin({
        title: 'Popup',
        filename: 'popup.html',
        chunks: ['popup'],
        template: 'assets/popup.html',
      }),
  ],
  devtool: 'inline-source-map',
  mode: 'development'
};