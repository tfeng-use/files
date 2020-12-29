#### 1. 使用webpack命令的三种方式
* 全局安装webpack-cli，然后直接使用
* 局部安装，在package.json的scripts添加执行命令，然后执行`npm run webapck`，此时会进行局部查找
```json
"scripts": {
  "webpack": "webpack --mode=development"
}
```
* 使用 `npx webpack --mode=development`，使用npx会直接查找node_modules/.bin下面的可执行指令

#### 2. loader 中use的使用方法
* use: 'a-loader'
* use: ['a-loader', 'b-loader']
* use: [{
  loader: 'a-loader',
  options: {}
}]
* use: {
  loader: 'a-loader',
  options: {}
}

#### 3. 如果要在设置 mode 之前使用 process.env.NODE_ENV，默认不会有值，可以通过 cross-env 进行设置
```json
"dev": "cross-env NODE_ENV=development webpack",
"build": "cross-env NODE_ENV=production webpack"
```
```
npm install cross-env -D
```

#### 4. 使用 html-webpack-plugin 插件时，可以在index.html里面使用模板语法
```html
// index.html
<title><%= (htmlWebpackPlugin.options.config.title) %></title>
```
```javascript
// webpack.config.js
new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
  config: config // 这儿是配置的对象
})
```

#### 5. style-loader 的作用
* 在处理less的时候，如果没有style-loader，那么转换后的css将不会生效，
* style-loader的作用是将css创建为 <style></style> 标签的内联 CSS，这些转换都是通过js完成的，js先创建style 标签，然后再通过appendChild添加到head中（js代码都在打包生成的js中）。


#### 6. url-loader、file-loader
* 如果图片资源大于limit，则默认使用file-loader进行处理
* `url-loader`依赖于`file-loader`

#### 7. webpack默认配置
`node_modules/webpack/lib/WebpackOptionsDefaulter.js`

#### 8. entry传入数组时代码的注入顺序
`entry: ['./src/polyfills.js', './src/index.js']` 左边引入的代码会注入到最前面

#### 10. 生成tree目录结构
输入指令：tree

#### 11. index直接引入public里面的图片
```html
<img src="<%= require('./a.jpg') %>" alt="">
```

* 如果要想使用 `<img src="./thor.jpeg" />`这种方式，可以使用如下的方式
webpack设置
```javascript
{
  loader: 'url-loader',
  options: {
    ...
    esModule: false,
    ...
  }
}
```
```javascript
{
  test: /.html$/,
  use: 'html-withimg-loader' // 引入 `html-withimg-loader` 插件，使用了这个loader就不能再使用 ejs模板了
}
```
#### 12. index.html引入public里面的js、css
```html
// public/index.html
<script src="./js/base.js"></script>
<script src="./js/other.js"></script>
```
* 使用 copy-webpack-plugin 拷贝静态文件
```javascript
// webpack.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin')

// plugins
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
)
```
#### 13. 自动加载模块，而不必到处 import 或 require
* 使用 webpack 自带的 ProvidePlugin
```javascript
const webpack = require('webpack');
module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react',
            Component: ['react', 'Component'], 
            Vue: ['vue/dist/vue.esm.js', 'default'],
            $: 'jquery',
            _map: ['lodash', 'map']
        })
    ]
}
```
数组的第二个参数引入第一个参数后的值的属性

* 如果配置了 eslint，则需要进行如下配置
```javascript
{
    "globals": {
        "React": true,
        "Vue": true,
    }
}
```
#### 14. 拆分css ，mini-css-extract-plugin
将CSS文件单独打包
* extract-text-webpack-plugin 只支持webpack v1-v3
```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css' // 这个name并不是引入的文件的name，默认情况下为maxin
            //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath 
        })
    ],
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader, //替换之前的 style-loader
                    'css-loader', {
                        loader: 'postcss-loader',
                        options: {
                          //...
                        }
                    }, 'less-loader'
                ],
                exclude: /node_modules/
            }
        ]
    }
}
```

#### 15. 压缩css，optimize-css-assets-webpack-plugin
```javascript
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    //....
    plugins: [
        new OptimizeCssPlugin()
    ],
}
```

#### 16. 按需加载
* 依赖 `@babel/plugin-syntax-dynamic-import`，`@babel/preset-env` 预设已经包含了
```javascript
document.getElementById('btn').onclick = function() {
    import(/* webpackChunkName: "handle" */ './handle').then(fn => fn.default());
}
```
* 以 `./handle` 为入口新生成一个 Chunk
* `/* webpackChunkName: "js/handle" */` 自定义生成的 `chunk` 名字，在 `js` 文件夹下生成名为 `handle` 的文件夹

#### 17. 热更新
* 首先配置plugins、devServer
```javascript
module.exports = {
    //....
    devServer: {
        // ...
        hot: true // 设置为true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin() //热更新插件
    ]
}
```
* 如果使用的是老版本的 `mini-css-extract-plugin`，比如 0.9.0
```javascript
{
    loader: MiniCssExtractPlugin.loader,
    options: {
        hmr: isDev, // 这两个属性加了，css才能实现热更新
        reloadAll: true,
    }
}

new MiniCssExtractPlugin({
    filename: 'css/[name].css' // 这儿的name不能使用hash，否则热更新不会成功
}),
```
* 要想js的热更新成功，在入口文件新增
```
if (module && module.hot) {
  module.hot.accept()
}
```

#### 18. 多页面打包
* 配置多个 HtmlWebpackPlugin，为了使用chunks属性设置引入的js，entry 最好使用对象的形式, output 最好引入 `[name]`
```javascript
module.exports = {
  entry: {
    index: './src/index.js',
    login: './src/login.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: '[name].[hash:6].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件名
      config: config.template,
      chunks: ['index'] // 需要引入的chunkName
    }),
    new HtmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html', //打包后的文件名
      chunks: ['login']
    }),
  ]
}
```
#### 19. resolve
* `modules` 指定webpack到哪些目录下寻找第三方模块
```javascript
module.exports = {
    //....
    resolve: {
        modules: ['./src/components', 'node_modules'] //从左到右依次查找，先去src/components中寻找，再去node_modules中寻找
    }
}
```

* `alias` 指定别名
```javascript
//webpack.config.js
module.exports = {
    //....
    resolve: {
        alias: {
            'react-native': '@my/react-native-web' //这个包名是我随便写的哈
        }
    }
}
```
* `extensions` 指定扩展名
```javascript
module.exports = {
  //...
  resolve: {
      extensions: ['.jsx', '.js'] // 引入文件不带后缀时，默认先找.jsx，然后再找.js
  }
}
```
* `mainFields` 引入第三方文件时，查找 package.json 属性的顺序
默认配置是 ['browser', 'main']，即首先找对应依赖 package.json 中的 brower 字段，如果没有，找 main 字段
```javascript
// webpack.config.js
module.exports = {
    //....
    resolve: {
        mainFields: ['style', 'main']// 首先查找package的style属性，然后是main属性
    }
}
```
#### 20. webpack.DefinePlugin 定义环境变量
```javascript
plugins: [
    new webpack.DefinePlugin({
        DEV: JSON.stringify('dev'), //字符串
        FLAG: 'true', //FLAG 是个布尔类型
        'typeof window': JSON.stringify('object'),
    })
]
```
下面是一些注意事项
* 如果这个值是一个字符串，它会被当作一个代码片段来使用。
* 如果这个值不是字符串，它会被转化为字符串(包括函数)，也就是 stringify。
* 如果这个值是一个对象，它所有的 key 会被同样的方式定义。
* 如果在一个 key 前面加了 typeof,它会被定义为 typeof 调用

```javascript
console.log('typeof window', typeof window) // object
```

#### 21. 利用webpack解决跨域问题
```javascript
//webpack.config.js
module.exports = {
    //...
    devServer: {
        proxy: {
            "/api": "http://localhost:4000"
        }
    }
}
```

#### 22. mock数据
```javascript
const apiMocker = require('mocker-api')

module.exports = smart(base, {
  devServer: {
    // ...
    before (app) {
      apiMocker(app, path.resolve('./mock/mocker.js'))
    }
  }
})

// mocker.js
module.exports = {
  'GET /user': { name: '刘小夕12345', age: 18 }, // get请求
  'POST /login/account': (req, res) => { // post请求
    const { password, username } = req.body
    if (password === '888888' && username === 'admin') {
      return res.send({
        status: 'ok',
        code: 0,
        token: '1234567890',
        data: { id: 1, name: '刘小夕123456' }
      })
    } else {
      return res.send({ status: 'error', code: 403 })
    }
  }
}
```
* 使用 mock 的时候不要与 server.js 里面提供的接口重复了

### webpack优化
#### 23. cache-loader 将结果缓存到磁盘中
安装
```
npm install cache-loader -D
```
使用
```javascript
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['cache-loader','babel-loader']
            }
        ]
    }
}
```
#### 23. happypack 创建多个子进程，子进程处理完后再把结果发送给主进程
* 安装
```
npm install happypack -D
```

* 配置
```javascript
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                use: 'Happypack/loader?id=js',
            },
            {
                test: /\.css$/,
                use: 'Happypack/loader?id=css',
            }
        ]
    },
    plugins: [
        new Happypack({
            id: 'js', //和rule中的id=js对应
            //将之前 rule 中的 loader 在此配置
            use: ['babel-loader'] //必须是数组
        }),
        new Happypack({
            id: 'css',//和rule中的id=css对应
            use: ['style-loader', 'css-loader','postcss-loader'],
        })
    ]
}
```
* 当 postcss-loader 配置在 Happypack 中，必须要在项目中创建 postcss.config.js
```javascript
//postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')()
    ]
}
```
* 当项目不是很复杂时，不需要配置 happypack，因为进程的分配和管理也需要时间，并不能有效提升构建速度，甚至会变慢。

#### 24. thread-loader 使用多工作池（每个worker都是一个单独的node.js进程）
* 安装
```
npm install thread-loader -D
```

* 配置，通常用到 `babel-loader` 中
```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['thread-loader', 'cache-loader', 'babel-loader']
            }
        ]
    }
}
```
* 限制
（1）这些 loader 不能产生新的文件。   
（2）这些 loader 不能使用定制的 loader API（也就是说，通过插件）。   
（3）这些 loader 无法获取 webpack 的选项设置。   

* 与HappPack相同，小项目中别使用

#### 25. 开启 JS 多进程压缩
默认开启，使用的是 `TerserWebpackPlugin`，构建时，可以看到 `terser` 的缓存文件 `node_modules/.cache/terser-webpack-plugin`

#### 26. HardSourceWebpackPlugin
为模块提供中间缓存，缓存默认的存放路径是: `node_modules/.cache/hard-source`。 从第二次开始构建效果良好

安装
```
npm install hard-source-webpack-plugin -D
```

配置
```javascript
//webpack.config.js
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
    //...
    plugins: [
        new HardSourceWebpackPlugin()
    ]
}
```

#### 27. noParse 设置不需要转换和解析的包
```javascript
//webpack.config.js
module.exports = {
    //...
    module: {
        noParse: /jquery|lodash/
    }
}
```

#### 27. externals
将jS文件存储在 CDN 上，通过script引入，并且可以使用 import 进行引用
```html
<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
```

```javascript
//webpack.config.js
module.exports = {
    //...
    externals: {
        //jquery通过script引入之后，全局中即有了 jQuery 变量
        'jquery': 'jQuery'
    }
}

// main.js 可以这样使用
import $ from 'jquery'
```

#### 28. DllPlugin 和 DLLReferencePlugin 实现拆分 bundles
* DllPlugin 拆分 bundles
这个插件时单独使用的，需要创建一个额外的`webpack`设置
```javascript
// webpack.config.dll.js
module.exports = {
  entry: {
    react: ['react', 'react-dom'] // 把所有的第三方都放在这个属性里面，测试的时候使用多个属性，映射关系无法进入 manifest.json
  },
  mode: 'production',
  output: {
    filename: '[name].dll.[hash:6].js',
    path: path.resolve(__dirname, 'dist', 'dll'),
    library: '[name]_dll' //暴露给外部使用
    //libraryTarget 指定如何暴露内容，缺省时就是 var
  },
  plugins: [
    new webpack.DllPlugin({
      //name和library一致
      name: '[name]_dll',
      path: path.resolve(__dirname, 'dist', 'dll', 'manifest.json') //manifest.json的生成路径
    })
  ]
}
```
在scripts里面添加
```javascript
"scripts": {
    "build:dll": "webpack --config webpack.config.dll.js"
}
```
然后使用 `npm run build:dll` 构建出 `react.dll.js` 和 `manifest.json`

* DLLReferencePlugin 引用拆分的 bundles
```javascript
plugins: [
  // ...
  new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json') // 映射 manifest.json
  }),
  new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录
  }),
]
```
然后在 `public/index.html` 中引入 `react.dll.js`
```html
<script src="/dll/react.dll.9dcd9d.js"></script>
```

#### 29. optimization.splitChunks 抽离公共代码
```javascript
module.exports = {
  optimization: {
    splitChunks: {//分割代码块
      cacheGroups: {
        vendor: {
          //第三方依赖
          priority: 1, //设置优先级，首先抽离第三方模块
          name: 'vendor', // 打包出来的名字
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //最少引入了1次
        },
        //缓存组
        common: {
          //公共模块
          chunks: 'initial',
          name: 'common',
          minSize: 100, //大小超过100个字节
          minChunks: 3 //最少引入了3次
        }
      }
    }
  }
}
```
* 打包出来`vendor.js`要想在`html`自动引入，还必须加入`HtmlWebpackPlugin`中
```javascript
new HtmlWebpackPlugin({
    //...
  chunks: ['index', 'vendor', 'manifest'] // manifest 是通过runtimeChunk抽离出来的映射
})
```
* runtimeChunk，包含 chunk 映射关系的列表从 index.js 中抽离出来
```javascript
module.exports = {
    //...
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        }
    }
}
```
最终会生成一个 manifest.js
* splitChunks 打包到vendor里面的内容，有些会因为使用了`DllPlugin`而无法打包进 vendor，比如测试用的react、lodash，而vue会被打包进 vendor

#### 29. 查看打包文件大小
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = merge(baseWebpackConfig, {
    //....
    plugins: [
        //...
        new BundleAnalyzerPlugin(),
    ]
})
```
#### 30. 进一步拆分vendor
```javascript
module.exports = merge(baseWebpackConfig, {
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
          name: 'lodash', // 单独将 lodash 拆包
          priority: 5, // 权重需大于`vendor`
          test: /[\\/]node_modules[\\/]lodash/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //重复引入了几次
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  }
})
```
#### 31. 将js打包到指定文件夹
entry的属性使用相对路劲
```javascript
module.exports = {
  entry: {
    './js/index': './src/index.js',
    './js/login': './src/login.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: '[name].[hash:6].js' // 根据entry的属性，将打包到js文件夹下
  },
  optimization: {
    splitChunks: {
      //分割代码块
      maxInitialRequests: 6,
      cacheGroups: {
        vendor: {
          // ...
          name: './js/vendor', // vendor 将打包到js文件夹下
        },
      }
    },
    runtimeChunk: {
      name: 'manifest'
    }
  },
}
```
#### 32. tree-shaking
webpack4自身的优化，基于ES6的import语法，那么在生产环境下，会自动移除没有使用到的代码。
```javascript
//math.js
const add = (a, b) => {
    console.log('aaaaaa')
    return a + b;
}

const minus = (a, b) => {
    console.log('bbbbbb')
    return a - b;
}

export {
    add,
    minus
}
```

```javascript
//index.js
import {add, minus} from './math';
add(2,3);
```
打包出来的代码，minus将不会包含进去