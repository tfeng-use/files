import Vuex from 'vuex'
import user from '@store/user/user' // 用户模块的
import * as actions from '@store/actions' // 根级别actions
import * as getters from '@store/getters' // 根级别getters
import * as mutations from '@store/mutations' // 根级别mutations
const state = {
  userInfo: {}, // 用户信息
  isOpenSale: false, // 是否开市
  breadcrumb: [],
  currentCrumb: null, // 用于展示滑动
  slideComponent: '', // 滑动组件
  currentMenu: {
    roleList: []
  }, // 当前选中的目录
  leftMenu: [] // 左侧菜单数组
} // 根级别 state
const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    user: user
  }
})

export default store
