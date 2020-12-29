const base = require('./webpack.config.base')
const webpack = require('webpack')
const { smart } = require('webpack-merge')
const apiMocker = require('mocker-api')
const path = require('path')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()

const config = smart(base, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', // 映射到源代码，用于调试
  devServer: {
    port: '3000', // 默认是8080
    // quiet: false, // 默认不启用，开启后，除了初始启动信息之外的任何内容都不会被打印到控制台
    // inline: true, // 默认开启 inline 模式，如果设置为false,开启 iframe 模式
    // stats: 'errors-only', // 终端仅打印 error
    // overlay: false, // 默认不启用，启动后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的
    // clientLogLevel: 'silent', // 日志等级
    // compress: true, // 是否启用 gzip 压缩
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        pathRewrite: {
          '/api': ''
        }
      }
    },
    before (app) {
      apiMocker(app, path.resolve('./mock/mocker.js'))
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: JSON.stringify('dev'), //字符串
      FLAG: 'true', //FLAG 是个布尔类型
      'typeof window': JSON.stringify('object')
    })
  ]
})

// module.exports = smp.wrap(config)
module.exports = config
