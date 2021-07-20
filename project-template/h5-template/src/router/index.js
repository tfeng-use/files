import { createRouter, createWebHashHistory } from 'vue-router'
import Cookies from 'js-cookie'
import Storage from 'good-storage'
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/extension'
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录', index: 0, ignoreLogin: true },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/login/index.vue')
  },
  {
    path: '/extension',
    name: 'Extension',
    meta: { title: '推广', index: 1, keepAlive: true, showNav: true },
    component: () =>
      import(/* webpackChunkName: "extension" */ '../views/extension/index.vue')
  },
  {
    path: '/customer',
    name: 'Customer',
    meta: {
      title: '客户',
      index: 1,
      keepAlive: true,
      ignoreLogin: true,
      showNav: true
    },
    component: () =>
      import(/* webpackChunkName: "customer" */ '../views/customer/index.vue')
  },
  {
    path: '/perfectDetail',
    name: 'perfectDetail',
    meta: {
      title: '完善详细信息',
      index: 3
    },
    component: () =>
      import(
        /* webpackChunkName: "perfectDetail" */ '../views/customerDetail/perfectDetail.vue'
      )
  },
  {
    path: '/selectAddr',
    component: () =>
      import(/* selectAddr: "perfectDetail" */ '../views/selectAddr/index.vue'),
    name: 'selectAddr',
    meta: {
      title: '获取地理位置',
      index: 4
    }
  },
  // 重定向页面
  {
    path: '/redirectPage',
    name: 'redirectPage',
    component: () => import('../views/redirect/index.vue'),
    meta: {
      title: '',
      ignoreLogin: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach(async (to, from, next) => {
  store.commit('SET_FROM_ROUTER', from.path)
  document.title = to.meta.title
  // 给ios产生历史页面，让页面底部出现导航栏，否则会影响后面的布局
  // console.log('window.isIOS', window.isIOS)
  // console.log('router.hasHistory', router.hasHistory)
  if (!router.hasHistory && window.isIOS && window.history.length < 2) {
    router.hasHistory = true
    next({
      path: '/redirectPage',
      query: {
        path: to.path,
        ...to.query
      }
    })
  } else {
    if (!Cookies.get('X-JWT') || !Storage.get('userInfo')) {
      if (to.meta.ignoreLogin) {
        next()
      } else {
        next('/login')
      }
    } else {
      next()
    }
  }
})
export default router
