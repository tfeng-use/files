const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development' // 这儿是在设置mode之前使用，默认不会有值，可以通过 cross-env 进行设置
const config = require('./public/config')[isDev ? 'dev' : 'build']
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: 'cheap-module-eval-source-map', // 映射到源代码，用于调试
  entry: {
    './js/index': './src/index.js',
    './js/login': './src/login.js'
  },
  // entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: '[name].[hash:6].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['thread-loader', 'babel-loader'],
        exclude: /node_modules/ //排除 node_modules 目录
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [require('autoprefixer')()]
              }
            }
          },
          'less-loader'
        ],
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
    ],
    noParse: /jquery|lodash/
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
      config: config.template,
      chunks: ['index', 'vendor', 'manifest']
      // hash: true //是否加上hash，默认是 false
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', //打包后的文件名
      chunks: ['login', 'vendor']
    }),
    // new webpack.DllReferencePlugin({
    //   manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
    // }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**']
    }),
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
    // new webpack.ProvidePlugin({
    //   _: 'lodash'
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
      //个人习惯将css文件放在单独目录下
      //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
    }),
    new webpack.HotModuleReplacementPlugin()
    // new HardSourceWebpackPlugin(),
  ],
  optimization: {
    splitChunks: {
      //分割代码块
      maxInitialRequests: 6,
      cacheGroups: {
        vendor: {
          //第三方依赖
          priority: 1, //设置优先级，首先抽离第三方模块
          name: 'vendor',
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //最少引入了1次
        },
        lodash: {
          name: './js/lodash', // 单独将 react-lottie 拆包
          priority: 5, // 权重需大于`vendor`
          test: /[\\/]node_modules[\\/]lodash/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //重复引入了几次
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)/,
          priority: 5,
          name: './js/react',
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //重复引入了几次
        },
        vue: {
          test: /[\\/]node_modules[\\/](vue)/,
          priority: 5,
          name: './js/vue',
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //重复引入了几次
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
  externals: {
    jquery: 'jQuery'
  }
}
