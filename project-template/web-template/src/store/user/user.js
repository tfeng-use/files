import * as actions from './actions' // 根级别actions
import * as getters from './getters' // 根级别getters
import * as mutations from './mutations' // 根级别mutations
export default {
  namespaced: true,
  state: {
    someThing: 'xxx'
  },
  actions,
  getters,
  mutations
}
