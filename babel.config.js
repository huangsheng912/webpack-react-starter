module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", //按需引入polyfill
        corejs: 2
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    "react-hot-loader/babel", //menu动态import路由+react-hot-loader实现热替换异常，添加后热更新都出问题
    "@babel/plugin-transform-runtime", //配合preset-env，避免polyfill造成污染
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }] //antd按需加载
  ],
  ignore: [/[\/\\]core-js/, /@babel[\/\\]runtime/], //防止babel babeling它自己
  sourceType: "unambiguous" //防止babel弄乱导出
};
