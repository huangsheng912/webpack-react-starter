const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Happypack = require('happypack');
const os = require('os');
const happyThreadPool = Happypack.ThreadPool({size:os.cpus().length});

module.exports = {
  entry: {},
  output: {
    path: path.resolve(__dirname,'../dist'),
  },
  resolve: {
    extensions: ['.jsx', '.js', '.less', '.css'],//设置引入文件可省略的拓展名
    alias: {
      "@src": path.resolve(__dirname,'../src'),  //设置引入路径别名
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "happypack/loader?id=js"  //@babel/preset-env （转译 ES6 ~ ES9 的语法）、 @babel/preset-react （转译React )。
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10240,
            // outputPath: "images/", // 图片输出的路径
            name:'images/[name]-[hash:8].[ext]',
          }
        }
      },
    ]
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html", // 最终创建的文件名
      template: path.resolve(__dirname, "../src/index.html"), // 指定模板路径
    }),
    new Happypack({
      //用id来标识 happypack处理那里类文件
      id: 'js',
      //如何处理  用法和loader 的配置一样
      loaders: [ 'babel-loader?cacheDirectory=true'],
      //共享进程池threadPool: HappyThreadPool 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      verbose: true,//是否允许happypack输出日志，默认true
    }),
   /* new Happypack({
      id: 'css',
      loaders: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
      threadPool: happyThreadPool,
      verbose: true,
    }),*/
    // css单独提取
    /*new MiniCssExtractPlugin({   //开发环境同时使用MiniCssExtractPlugin、react-hot-loader会有冲突，导致无法自动更新修改的css
      filename: "[name].css",
      chunkFilename: "[id].css"
    })*/
  ],
  performance: false // 关闭性能提示
};