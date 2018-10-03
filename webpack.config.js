const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const outputDirectory = 'dist';

const clientConfig = {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        include: '/public/',
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  // devServer: {
  //   // https: true,
  //   port: 3000,
  //   open: true,
  //   proxy: {
  //     '/api': 'http://localhost:8080',
  //     '/static': 'http://localhost:8080'
  //   }
  // },
  plugins: [
    // new CleanWebpackPlugin([outputDirectory]),
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   favicon: './public/mdsticon.png'
    // }),
    new webpack.DefinePlugin({
      __isBrowser__: 'true'
    })
  ]
};

const serverConfig = {
  entry: './src/server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'server.js'
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin([outputDirectory]),
    // new webpack.DefinePlugin({
    //   __isBrowser__: 'false'
    // })
  ]
};

module.exports = [clientConfig, serverConfig];
