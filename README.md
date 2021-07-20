# files

一些文件汇总，包括常用的函数、css、vue 组件 等

## 2020/11/6

增加一些基础函数和常用的组件，js、less 是可以共用的方法和样式；management 里面是管理系统需要的一些文件

## 2020/11/16

增加换行符转换函数

## 2020/11/26

- 增加 util 中判断两个数是否是整数倍的关系
- 增加另外一种打开详情页的方式，可以多级嵌套
- 增加首屏 loading 的功能

## 2020/12/4

- 增加轮播图的组件封装

## 2020/12/29
* 增加 babel 的测试项目 `babelTest`
* 增加 webpack4 的测试项目 `webpackTest`

## 2021/01/07
* 增加project-template

## 2021/01/21
* 增加h5-template，这是一个以vue3为基础的项目模板

## 2021/04/16
* 修改了千分隔的计算规则

## 2021/05/20
* 增加了根据工具进行计算的函数

## 2021/07/20
* 增加了h5样式里面的安全区域
* position.js使用
```javascript
// 引入 nextTick、onActivated、store

function handlegoDetail (item) {
  store.commit('position/SET_POSITION_CACHE', wrapperClass)
  // ....
}

onActivated(() => {
  // 如果是从我的页面和确认页面都进行刷新
  if (
    store.getters.fromRouter.indexOf('/xxx') === -1) {
    init()
  } else {
    nextTick(() => {
      store.commit('position/KEEP_SCROLL', wrapperClass)
    })
  }
})
```