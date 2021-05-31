const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: path.resolve(__dirname, './../src/js/index.js'),
    registration: path.resolve(__dirname, './../src/js/registration.js'),
    login: path.resolve(__dirname, './../src/js/login.js'),
    post: path.resolve(__dirname, './../src/js/post.js'),
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  output: {
    path: path.resolve(__dirname, './../dist'),
    filename: '[name].bundle.js',
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
    new CompressionPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './../src/assets'),
          to: path.resolve(__dirname, './../dist/assets'),
        }
      ]
    })
  ],
};