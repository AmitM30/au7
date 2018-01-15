const webpack = require('webpack');
const path = require('path');
const AureliaWebPackPlugin = require('aurelia-webpack-plugin');

const aurelia = require('@easy-webpack/config-aurelia');
const babel = require('@easy-webpack/config-babel');
// import { generateConfig, get, stripMetadata, EasyWebpackConfig } from '@easy-webpack/core'
const generateConfig = require('@easy-webpack/core').generateConfig;
const stripMetadata = require('@easy-webpack/core').stripMetadata;
const globalRegenerator = require('@easy-webpack/config-global-regenerator');
const uglify = require('@easy-webpack/config-uglify');

process.env.BABEL_ENV = 'webpack';
const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = 'development');
const APP_NAME = process.env.APP_ENV && process.env.APP_ENV.toLowerCase() || 'apps';

const title     = 'Wadi.com';
const baseUrl   = '/';
const rootDir   = path.resolve();
const srcDir    = path.resolve('source');

// Variables set by npm scripts in package.json
const isProduction = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = 'development');
const platform = 'default' // 'default' by default

const coreBundles = {
  bootstrap: [
    'aurelia-bootstrapper-webpack',
    'aurelia-polyfills',
    'aurelia-pal',
    'aurelia-pal-browser',
    'regenerator-runtime',
    'isomorphic-fetch'
  ]
}

let config = generateConfig({
  

    entry: {
      main: [
        './source/main.js'
      ]
    },
    // entry: {
    //   app: ['./src' + (APP_NAME ? '/' + APP_NAME : '') + '/main' /* this is filled by the aurelia-webpack-plugin */],
    //   'aurelia-bootstrap': coreBundles.bootstrap
    // },
    output: {
      path: path.join(__dirname, 'www/dist'),
      publicPath: 'dist/',
      filename: 'bundle.js'
    },
    node: {
      dns: 'mock',
      net: 'mock'
    },
    module: {
      rules: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/ },
        { test: /\.html$/, loader: 'html-loader' },
        { test: /\.css$/, use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' }
          ]
        },
        { test: /(\.scss|\.css)$/, loader: 'ignore-loader' },
        // { test: /\.html$/, loader: 'ignore-loader' },
        { test: /\.(png|gif|jpg)$/, loader: 'url-loader', options: { limit: '25000' } },
        { test: /\.(ttf|eot|svg)$/, loader: 'file-loader' }
      ]
    },

    plugins: [
      // new AureliaWebPackPlugin(),
      new webpack.DefinePlugin({
        // Allows these constants to be accessed by the aurelia app
        PRODUCTION: JSON.stringify(isProduction),
        PLATFORM: JSON.stringify(platform)
      })
    ],
    devServer: {
      port: 3000
    }
  },
  aurelia({ root: rootDir, src: srcDir, title: title, baseUrl: baseUrl }),
  babel({ options: { /* uses settings from .babelrc */ } }),
  globalRegenerator(),

  ENV === 'live' ?
    uglify({ debug: false, mangle: { except: ['cb', '__webpack_require__'] } }) : {}
)

module.exports = stripMetadata(config)
