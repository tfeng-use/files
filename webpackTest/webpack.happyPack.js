const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development' // 这儿是在设置mode之前使用，默认不会有值，可以通过 cross-env 进行设置
const config = require('./public/config')[isDev ? 'dev' : 'build']
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const Happypack = require('happypack')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()

const webPackconfig = {
  mode: isDev ? 'development' : 'production',
  devtool: 'cheap-module-eval-source-map', // 映射到源代码，用于调试
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  // entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: '[name].[hash:6].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'Happypack/loader?id=js',
        exclude: /node_modules/ //排除 node_modules 目录
      },
      {
        test: /\.(le|c)ss$/,
        use: 'Happypack/loader?id=css',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, //10K
              esModule: false,
              name: '[name]_[hash:6].[ext]',
              outputPath: 'assets'
            }
          }
        ],
        exclude: /node_modules/
      }
      // {
      //   test: /.html$/,
      //   use: 'html-withimg-loader'
      // }
    ]
  },
  resolve: {
    modules: ['./src/components', 'node_modules'], //从左到右依次查找
    alias: {
      dialog_alias: 'dialog'
    },
    mainFields: ['style', 'main']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件名
      // minify: {
      //   removeAttributeQuotes: false, //是否删除属性的双引号
      //   collapseWhitespace: false //是否折叠空白
      // },
      config: config.template,
      chunks: ['index']
      // hash: true //是否加上hash，默认是 false
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', //打包后的文件名
      chunks: ['login']
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(
      [
        // 拷贝静态文件js、css
        {
          from: 'public/js/*.js',
          to: path.resolve(__dirname, 'dist', 'js'),
          flatten: true // 只拷贝js里面的内容，不包括它的的目录
        }
      ],
      {
        ignore: ['other.js'] // 不拷贝的文件
      }
    ),
    new webpack.ProvidePlugin({
      _: 'lodash'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
      //个人习惯将css文件放在单独目录下
      //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
    }),
    new OptimizeCssPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new Happypack({
      id: 'js',
      use: ['babel-loader']
    }),
    new Happypack({
      id: 'css',
      use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
    })
  ],
  devServer: {
    port: '3000', // 默认是8080
    // quiet: false, // 默认不启用，开启后，除了初始启动信息之外的任何内容都不会被打印到控制台
    // inline: true, // 默认开启 inline 模式，如果设置为false,开启 iframe 模式
    // stats: 'errors-only', // 终端仅打印 error
    // overlay: false, // 默认不启用，启动后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的
    // clientLogLevel: 'silent', // 日志等级
    // compress: true, // 是否启用 gzip 压缩
    hot: true
  }
}
module.exports = smp.wrap(webPackconfig)
