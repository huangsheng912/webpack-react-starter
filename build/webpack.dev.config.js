const path = require("path");
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')
const webpack = require("webpack");

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    app:[
      "react-hot-loader/patch",
      path.resolve(__dirname, '../src/index.js')
    ]
  },
  output: {
    filename:"[name].js",
    chunkFilename: '[name].js'
  },
  module:{
    rules: [
      {
        test: /\.(less|css)$/,
        exclude: /node_modules/,
        use: [ 'style-loader','css-loader', 'postcss-loader', 'less-loader'],
      },
    ]
  },
  devServer: {
    host: 'localhost',
    hot: true,
    // contentBase: path.resolve(__dirname, "../dist"),
    port: 8882,
    historyApiFallback: true,
    //  该选项的作用所有的404都连接到index.html,
    // react使用historyRouter时必须设置，上线后需在服务器配置把非/的请求rewrite到/去
    overlay: {    //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true
    },
    open: true, //编译完成自动打开页面
    proxy: {
      // 代理到后端的服务地址
      "/api": "http://localhost:8888"
    }
  },
  plugins: [
    //开启HMR(热替换功能,替换更新部分,不重载页面！) 相当于在命令行加 --hot
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({  //定义全局变量
      'process.env': {
        BASE_URL: '/ttt'
      }
    })
  ],
});