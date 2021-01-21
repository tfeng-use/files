const isDev = process.env.NODE_ENV !== 'production'
const path = require('path')
// 代码压缩
const TerserPlugin = require('terser-webpack-plugin')
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'
// cdn链接
const cdn = {
  // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'ant-design-vue': 'antd',
    moment: 'moment'
  },
  // cdn的css链接
  css: ['https://cdn.jsdelivr.net/npm/ant-design-vue@1.5.0/dist/antd.min.css'],
  // cdn的js链接
  js: [
    `https://cdn.staticfile.org/vue/2.6.10/vue${isDev ? '' : '.min'}.js`,
    'https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js',
    'https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js',
    'https://cdn.bootcss.com/moment.js/2.24.0/locale/zh-cn.js',
    'https://cdn.jsdelivr.net/npm/ant-design-vue@1.5.0/dist/antd.min.js',
    'https://imgcdn2.huangjinx.com/public/js/jjh/cos-js-sdk-v5.js'
  ]
}

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  productionSourceMap: false,

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#2D8CF0'
          // 'link-color': '#1DA57A',
          // 'border-radius-base': '2px',
        },
        sourceMap: true,
        javascriptEnabled: true
      }
    }
  },

  configureWebpack: config => {
    // 用cdn方式引入
    config.externals = cdn.externals
    // 别名配置
    config.resolve.alias = {
      '@': resolve('src'),
      '@config': resolve('src/js/config.js'),
      '@views': resolve('src/views'),
      '@js': resolve('src/js'),
      '@api': resolve('src/js/api'),
      '@bus': resolve('src/js/bus.js'),
      '@style': resolve('src/style'),
      '@store': resolve('src/store'),
      '@assets': resolve('src/assets'),
      '@components': resolve('src/components')
    }
    // 生产环境相关配置
    if (isProduction) {
      // 代码压缩
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          }
        })
      )

      // gzip压缩
      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
    }
  },

  chainWebpack: config => {
    // 注入cdn
    config.plugin('html').tap(args => {
      // 注入cdn
      args[0].cdn = cdn
      return args
    })
    // 删除默认配置中处理svg
    config.module.rules.delete('svg')
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/svgs')) // 处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve('src/assets/svgs'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  },

  devServer: {
    proxy: {
      '/': {
        target: 'https://dev-invest-api.jjh9999.com',
        // target: 'http://192.168.0.73:8084',
        changeOrigin: true
      }
    }
  }
}
