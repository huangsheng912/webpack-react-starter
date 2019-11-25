const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
// const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
// const WorkboxPlugin = require('workbox-webpack-plugin') // 引入 PWA 插件
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



module.exports = merge(commonConfig, {
  mode: 'production',
  entry: {
    app: [path.resolve(__dirname, '..', 'src/main.js')],
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js',//定义entry文件的打包后文件名称
    chunkFilename: 'js/chunk[id]-[chunkhash].js'  //定义非entry文件的打包后文件名称
    // publicPath: '/_static_/', //最终访问的路径就是：localhost:8882/_static_/js/*.js
  },
  // devtool: '',
  optimization: {
    splitChunks: {
      //chunks: 'async',//默认只作用于异步模块，为`all`时对所有模块生效,`initial`对同步模块有效
      minSize: 30000,  //分割前模块最小体积下限
      minChunks: 2,   //最少被引用次数
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true,
        },
        styles: {
          name: 'styles',
          test: /\.(less|css)$/,
          chunks: 'all',
          enforce: true,
        },
        common: {
          chunks: "async",
          name: "",
          minChunks: 2,
          minSize: 0
        }
      },
    },
    minimizer: [
      new UglifyJsPlugin({  //代码混淆压缩
        cache: true,    //利用缓存
        parallel: true, //并行处理
        uglifyOptions: {
          warnings: true,
          output: {
            comments: false, //删除所有注释
          },
          compress: {
            drop_debugger: true,
            drop_console: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 清除无用 css---生产环境---csstree-shaking
    /*new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, '..', 'src/!*.html'),
        path.resolve(__dirname, '..', 'src/!*.js'),
        path.resolve(__dirname, '..', 'src/!**!/!*.jsx'),
      ])
    }),*/
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
    ]),*/
    new BundleAnalyzerPlugin()
  ]
})