module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    es6: true
  },
  plugins: ['react'],
  extends: ['airbnb', 'plugin:prettier/recommended'],
  // extends: ['airbnb'],
  rules: {
    // 关闭react默认的props-type验证
    'react/prop-types': [0],
    //关闭使用解构赋值的检测
    'react/destructuring-assignment': [0, 'always'],
    // 解决require报错问题
    'import/no-extraneous-dependencies': ['error', { 'devDependencies': true }],
    "linebreak-style": [0 ,"error", "windows"], //解决window、Linux换行差异问题
    "react/jsx-filename-extension":0,  //允许js文件书写jsx
    "react/button-has-type": 0,
    "prefer-rest-params": 0
  }
}
