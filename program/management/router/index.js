/* eslint-disable */
/*
 * @Author: dcg
 * @Date: 2019-12-23 17:35:53
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-16 10:09:56
 *
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import cookie from '@js/cookie'
import bus from '../js/bus'
Vue.use(VueRouter)
// 登录
const login = [
  {
    path: '/login',
    component: () => import('@views/login/login.vue')
  }
]

// 报价管理
const system = [
  {
    path: '/',
    component: () => import('@views/home/home.vue')
  }
]
const order = [
  {
    path: '/order',
    component: () => import('@views/sales/order.vue')
  }
]

const routes = [...system, ...order]
// 主页面-其他功能页都在改页面子路由下面
const homeRoutes = {
  path: '/',
  component: () => import('@views/index.vue'),
  children: routes
}
// 一些需要单独显示的界面
const externalRoutes = [
  ...login,
  {
    path: '/process',
    component: () => import('@views/sales/process.vue')
  }
  // {
  // 比如打印
  // path: '/print',
  // component: () => import('@views/xxx.vue')
  // }
]

const complexRouter = [homeRoutes, ...externalRoutes]
const router = new VueRouter({
  routes: complexRouter
})
router.beforeEach(async (to, from, next) => {
  const jwt = cookie.getItem('accessToken')
  const userCode = cookie.getItem('userCode')

  if (to && to.path && ['/login'].indexOf(to.path) === -1) {
    if (!jwt || !userCode) {
      // eslint-disable-next-line
      // antd.message.error('您还没登录，请先登录')
      bus.$emit('socket_close')
      next('/login')
    } else {
      const arr = routes.map(item => item.path)
      if (arr.indexOf(to.path) !== -1) {
        bus.$emit('refreshLeftMenu', to.path)
      }
      bus.$emit('go2page', {
        key: to.path
      })
      next()
    }
  } else {
    // 如果已经登录并且是在login页，那么就
    if (to.path === '/login' && jwt) {
      next('/')
    } else {
      next()
    }
  }
})
export default router
