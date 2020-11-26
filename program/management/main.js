/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@style/app.less'
import SvgIcon from '@/components/svgIcon/index.vue'
import VConsole from 'vconsole' // 在移动端进行调试

const u = navigator.userAgent
window.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
window.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
window.isWeb = !window.isAndroid && !window.isIOS
Vue.component('svg-icon', SvgIcon)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
  mounted () {
    document.dispatchEvent(new Event('render-event'))
    document.querySelector('.app-loading').classList.add('close')
  }
}).$mount('#app')
