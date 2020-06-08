const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Happypack = require("happypack");
const os = require("os");
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length });
const dev = process.env.NODE_ENV === "development";
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");

module.exports = {
  entry: {},
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/" //静态页面文件调用的路径，/asset/=> localhost:8080/asset/home
  },
  resolve: {
    extensions: [".jsx", ".js", ".less", ".css", "json"], //设置引入文件可省略的拓展名
    alias: {
      src: path.resolve(__dirname, "../src"), //设置引入路径别名
      page: path.resolve(__dirname, "../src/pages"),
      utils: path.resolve(__dirname, "../src/utils"),
      components: path.resolve(__dirname, "../src/components"),
      // "react-dom": "@hot-loader/react-dom" //menu 通过map动态import路由+react-hot-loader实现热替换异常，添加后热更新都出问题
    },
    modules: ["node_modules"] //webpack解析模块时应该搜索的目录
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
        exclude: /node_modules/,
        loader: "eslint-loader",
        enforce: "pre",
        options: {
          fix: true //每次保存是自动修复
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "happypack/loader?id=js" //@babel/preset-env （转译 ES6 ~ ES9 的语法）、 @babel/preset-react （转译React )。
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        // exclude: /node_modules/,  //添加后引入三方库样式报错
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: dev,
              reloadAll: true
            }
          },
          "css-loader",
          "postcss-loader",
          "less-loader?javascriptEnabled=true"
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10240, //超过限制的自动使用file-loader处理
            name: "images/[name].[hash:8].[ext]"
          }
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "file-loader?name=fonts/[name].[hash:8].[ext]"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html", // 最终创建的文件名
      template: path.resolve(__dirname, "../src/index.html") // 指定模板路径
      // favicon: path.resolve(__dirname,'../src/images/favicon.ico') //favicon.ico文件路径
    }),
    new Happypack({
      //用id来标识 happypack处理那里类文件
      id: "js",
      //如何处理  用法和loader 的配置一样
      loaders: ["babel-loader?cacheDirectory=true"],
      //共享进程池threadPool: HappyThreadPool 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      threadPool: happyThreadPool,
      verbose: true //是否允许happypack输出日志，默认true
    }),
    new MiniCssExtractPlugin({
      //hack开发环境同时使用MiniCssExtractPlugin、HMR会有冲突，导致无法自动更新修改的css
      filename: dev ? "[name].css" : "css/[name].[chunkhash:8].css",
      chunkFilename: dev ? "[id].css" : "css/chunk[name]-[chunkhash:8].css",
      ignoreOrder: true //忽略引入顺序造成的警告
    }),
    new webpack.DefinePlugin({
      //定义全局变量
      "process.env": {
        NULS_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new AntdDayjsWebpackPlugin() //使用day.js代替moment，减少打包体积
  ],
  performance: false // 关闭性能提示
};
