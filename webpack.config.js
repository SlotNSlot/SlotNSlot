const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './app/javascripts/app.jsx'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    allowedHosts: [
      '.lvh.me',
      'localhost',
    ],
    compress: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['raw-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: "svg-inline-loader",
        options: {
          classPrefix: true
        }
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              minimize: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins () {
                return [
                  require('precss'),
                  require('autoprefixer'),
                  require('postcss-flexbugs-fixes')
                ];
              },
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: [/\.js?$/, /\.jsx?$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './app/index.ejs',
      inject: false,
      NODE_ENV: 'development',
    }),
  ],
};
