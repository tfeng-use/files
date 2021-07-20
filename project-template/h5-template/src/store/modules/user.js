import Storage from 'good-storage'
import Cookies from 'js-cookie'
import { login } from '@/api/login'
const state = {
  userCode: Cookies.get('userCode'),
  token: Cookies.get('X-JWT'),
  info: Storage.get('userInfo') || {},
  cacheInfo: null // 对信息进行缓存
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info
    Storage.set('userInfo', info)
    const token = info.token
    const userCode = info.user.userCode
    // token
    Cookies.set('X-JWT', token)
    Cookies.set('x-token', token, { domain: '.huangjinx.com' })
    state.token = token
    // userCode
    Cookies.set('userCode', userCode)
    state.userCode = userCode
  },
  SET_CACHEINFO: (state, info) => {
    state.cacheInfo = info
  }
}
const actions = {
  // 登录
  login ({ commit }, loginInfo) {
    return new Promise((resolve, reject) => {
      login(loginInfo)
        .then(({ data }) => {
          // info
          commit('SET_INFO', data)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 登出
  logout () {
    return new Promise(resolve => {
      Storage.remove('userInfo')
      // 清除需要在退出后清除的storage
      Storage.forEach(key => {
        if (key.includes('clear-')) {
          Storage.remove(key)
        }
      })
      Cookies.remove('X-JWT')
      Cookies.remove('x-token')
      Cookies.remove('userCode')
      resolve()
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
