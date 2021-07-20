import { createStore } from 'vuex'
import getters from './getters'
// import goods from './modules/goods'
import user from './modules/user'
import Storage from 'good-storage'
import position from './modules/position'
export default createStore({
  modules: {
    // goods,
    user,
    position
  },
  state: {
    fromRouter: '' // 来着哪个路由
  },
  mutations: {
    SET_FROM_ROUTER: (state, fromRouter) => {
      state.fromRouter = fromRouter
    }
  },
  actions: {},
  getters
})
