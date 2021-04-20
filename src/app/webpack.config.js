const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map', //This gives me nice dev tools experience
  entry: {
    index: './src/js/index.js',
    registration: './src/js/registration.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      }
    ],
  },
  // devServer: {
  //   contentBase: path.resolve(__dirname, 'dist'),
  //   watchContentBase: true,
  // },
};