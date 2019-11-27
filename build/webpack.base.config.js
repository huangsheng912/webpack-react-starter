const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Happypack = require('happypack');
const os = require('os');
const happyThreadPool = Happypack.ThreadPool({size:os.cpus().length});
const dev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {},
  output: {
    path: path.resolve(__dirname,'../dist'),
  },
  resolve: {
    extensions: ['.jsx', '.js', '.less', '.css', 'json'],//设置引入文件可省略的拓展名
    alias: {
      "src": path.resolve(__dirname,'../src'),  //设置引入路径别名
      "utils": path.resolve(__dirname,'../src/utils'),
    },
    modules: ['node_modules'], //webpack解析模块时应该搜索的目录
  },
  module: {
    rules: [
      // {
      //   loader:'webpack-ant-icon-loader',
      //   enforce: 'pre',
      //   include:[
      //     require.resolve('@ant-design/icons/lib/dist')
      //   ]
      // },
      {
        test: /\.(js|jsx)$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: "happypack/loader?id=js"  //@babel/preset-env （转译 ES6 ~ ES9 的语法）、 @babel/preset-react （转译React )。
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        // exclude: /node_modules/,  //添加后引入三方库样式报错
        use: [
          {
            loader:MiniCssExtractPlugin.loader,
            options: {
              hmr: dev,
              reloadAll: true,
            }
          },
          'css-loader', 'postcss-loader', 'less-loader?javascriptEnabled=true'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10240, //超过限制的自动使用file-loader处理
            name:'images/[name].[hash:8].[ext]',
          }
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader?name=fonts/[name].[hash:8].[ext]',
          },
        ],
      },
    ]
  },
  plugins:[
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
    new MiniCssExtractPlugin({   //hack开发环境同时使用MiniCssExtractPlugin、HMR会有冲突，导致无法自动更新修改的css
      filename: dev ? "[name].css" : "css/[name].[chunkhash:8].css",
      chunkFilename: dev ? "[id].css" : "css/chunk[name]-[chunkhash:8].css"
    }),
    new webpack.DefinePlugin({  //定义全局变量
      'process.env': {
        NULS_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],
  performance: false // 关闭性能提示
};