require('dotenv/config');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';
const prodMode = !devMode;

const filename = (ext) =>
  devMode ? `[name].${ext}` : `[name].[contenthash].${ext}`;

module.exports = {
  target: 'web',
  context: path.resolve(__dirname, './src'),
  mode: 'development',

  entry: {
    app: path.join(__dirname, './src/index.js'),
    styles: path.join(__dirname, './src/styles/index.scss'),
  },

  devtool: prodMode ? 'source-map' : 'eval-cheap-module-source-map',
  output: {
    publicPath: '',
    filename: `${filename('js')}`,
    path: path.join(__dirname, './build'),
  },

  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, './build'),
    open: true,
    compress: true,
    hot: true,
    port: 3000,
    writeToDisk: true,
    // openPage: 'meeting-planning-calendar',
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL || ''),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SYSTEM': JSON.stringify(process.env.SYSTEM),
      'process.env.ENTITY_EVENTS': JSON.stringify(process.env.ENTITY_EVENTS),
      'process.env.ENTITY_USERS': JSON.stringify(process.env.ENTITY_USERS),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: prodMode,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, './src/assets'),
          to: path.join(__dirname, './build'),
        },
      ],
    }),
  ],

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(?:|gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `${filename('[ext]')}`,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
              name: `${filename('[ext]')}`,
            },
          },
        ],
      },
    ],
  },
};
