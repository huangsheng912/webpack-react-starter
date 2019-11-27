

//.babel文件是用来dynamic插件但是无效，babel.config.js可以
module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 2
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties",{ "loose" : true}],
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
  ],
  "ignore": [/[\/\\]core-js/, /@babel[\/\\]runtime/],//防止babel babeling它自己
  "sourceType": 'unambiguous'//防止babel弄乱导出
}