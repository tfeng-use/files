/* eslint-disable */
import storage from 'good-storage'
import moment from 'moment'
import 'moment/locale/zh-cn'
import cookie from './cookie'
import * as utils from './utils'
import * as cos from './cos'
import slideWeb from '@components/slide-web.vue'
import Loading from '@components/loading/index'
import stateTag from '@components/stateTag.vue'
const _components = {
  slideWeb,
  stateTag
}
const install = Vue => {
  // 组件
  Object.keys(_components).forEach(key => {
    Vue.component(key, _components[key])
  })
  // 插件
  Vue.prototype.$loading = Loading
}
export default {
  install
}
