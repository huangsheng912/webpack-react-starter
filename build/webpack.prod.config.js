const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
// const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
// const WorkboxPlugin = require('workbox-webpack-plugin') // 引入 PWA 插件
// const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = merge(commonConfig, {
  mode: 'production',
  entry: {
    app: [path.resolve(__dirname, '..', 'src/index.js')],
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  output: {
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
      },
    ]
  },
  // devtool: '',
  optimization: {
    usedExports: true,
    splitChunks: {
      minChunks: 3,
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            // warnings: false,
            drop_debugger: true,
            drop_console: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    // 清除无用 css---生产环境---csstree-shaking
    /*new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, '..', 'src/!*.html'),
        path.resolve(__dirname, '..', 'src/!*.js'),
        path.resolve(__dirname, '..', 'src/!**!/!*.jsx'),
      ])
    }),*/
    new MiniCssExtractPlugin({   //开发环境同时使用MiniCssExtractPlugin、react-hot-loader会有冲突，导致无法自动更新修改的css
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
    // PWA配置，生产环境才需要
    /*new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),*/
    /*new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '..', 'dll/jquery-manifest.json')
    })*/
    /*new AddAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, '../dll/jquery.dll.js') // 对应的 dll 文件路径
    }),*/
    /*new CopyWebpackPlugin([  //将未经过webpack处理又要用于生产环境的文件copy到打包目录下
      { from: 'src/file.txt', to: 'build/file.txt', }, // 顾名思义，from 配置来源，to 配置目标路径
      { from: 'src/!*.ico', to: 'build/!*.ico' }, // 配置项可以使用 glob
      // 可以配置很多项复制规则
    ])*/
  ]
})