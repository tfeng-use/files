const { smart } = require('webpack-merge')
const base = require('./webpack.config.base')
const webpack = require('webpack')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const smp = new SpeedMeasurePlugin()

const config = smart(base, {
  mode: 'production',
  devtool: 'source-map', // 映射到源代码，用于调试
  plugins: [
    new OptimizeCssPlugin(),
    new webpack.DefinePlugin({
      PROD: JSON.stringify('prod'), //字符串
      FLAG: 'true' //FLAG 是个布尔类型
    }),
    new BundleAnalyzerPlugin()
  ]
})

// module.exports = config
module.exports = smp.wrap(config)
