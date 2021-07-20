const path = require('path')
// 是否为线上环境
const __PROD__ = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, dir)
}

// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {},
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    'https://imgcdn2.huangjinx.com/bjh-lite/js/cos-js-sdk-v5.min.js',
    'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
  ]
}
module.exports = {
  publicPath: './',
  indexPath: 'index.html',
  devServer: {
    port: 8081
  },
  productionSourceMap: !__PROD__,
  css: {
    loaderOptions: {
      less: {
        sourceMap: !__PROD__
        // javascriptEnabled: true
      }
    }
  },

  configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    config.externals = cdn.externals
    // 别名配置
    config.resolve.alias = {
      '@': resolve('src'),
      '@const': resolve('src/utils/const'),
      '@util': resolve('src/utils/util'),
      '@config': resolve('src/utils/config'),
      '@bus': resolve('src/utils/bus.js')
    }
  },

  chainWebpack: config => {
    // 注入cdn
    config.plugin('html').tap(args => {
      args[0].cdn = {}
      // cdn css 无论在本地还是生产，都会注入
      if (cdn.css.length) args[0].cdn.css = cdn.css
      // 注入cdn
      args[0].cdn = cdn
      return args
    })
  }
}
