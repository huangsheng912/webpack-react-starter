const path = require("path");
const merge = require('webpack-merge')
const commonConfig = require('./webpack.base.config.js')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = merge(commonConfig, {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    app:[
      "react-hot-loader/patch",
      path.resolve(__dirname, '../src/main.js')
    ]
  },
  output: {
    filename:"[name].js",
    chunkFilename: '[name].js'
  },
  devServer: {
    hot: true,
    // contentBase: path.resolve(__dirname, "../dist"), //告诉服务(dev server)在哪里查找文件，默认不指定会在是当期项目根目录
    port: 8882,
    progress: true,
    // color: true,//只能在cli中添加
    historyApiFallback: true, //将所有的404都连接到index.html,react使用historyRouter时必须设置，上线后需在服务器配置把非/的请求rewrite到/去
    overlay: {    //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true
    },
    open: true, //编译完成自动打开页面
    proxy: {
      // 代理到后端的服务地址
      "/api": {
        target: "http://localhost:8888",
        pathRewrite :{'^/api': ''}
      }
    }
  },
  plugins: [
    //开启HMR(热替换功能,替换更新部分,不重载页面！) devServer中设置hot后该插件自动开启
    // new webpack.HotModuleReplacementPlugin(),
  ],
});