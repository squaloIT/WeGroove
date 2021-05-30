const path = require('path');
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;

module.exports = {
  mode: 'development',
  // devtool: 'inline-source-map', //This gives me nice dev tools experience
  entry: {
    index: path.resolve(__dirname, './../src/js/index.js'),
    registration: path.resolve(__dirname, './../src/js/registration.js'),
    login: path.resolve(__dirname, './../src/js/login.js')
  },
  output: {
    path: path.resolve(__dirname, './../dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, './../src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, './../src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin(),
    // new webpack.DefinePlugin({
    //   PRODUCTION: JSON.stringify(false),
    //   VERSION: JSON.stringify('0.0.1'),
    //   DEBUG: true
    // }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './../src/assets'),
          to: path.resolve(__dirname, './../dist/assets'),
        }
      ]
    }),
    new WatchExternalFilesPlugin({
      files: [
        path.resolve(__dirname, './../../server/templates/views/*'),
      ]
    })
  ],
};