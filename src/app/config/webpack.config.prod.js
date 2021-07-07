const path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    script: path.resolve(__dirname, './../src/js/script.js'),
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
        },
        // {
        //   from: path.resolve(__dirname, './../sw.js'),
        //   to: path.resolve(__dirname, './../dist/sw.js'),
        // },
      ]
    }),
    new Workbox.InjectManifest({
      swSrc: path.resolve(__dirname, './../sw.js'),
      swDest: 'service-worker.js',
    })
  ],
};