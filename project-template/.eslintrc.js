module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'vue/no-unused-components': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'template-curly-spacing': 'off',
    'indent': 'off',
    'no-new-func':0
  }
}
