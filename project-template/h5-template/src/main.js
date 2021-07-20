import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/app.less'
import VConsole from 'vconsole'
import { setVueUtil } from './utils/vueUtil.js'
import Loading from '@/components/loading'
const app = createApp(App)
setVueUtil(app)
if (
  location.href.indexOf('192.168') > -1 ||
  location.href.indexOf('showVconsole') > -1
) {
  var vConsole = new VConsole()
  console.log('vConsole', vConsole)
}
let u = navigator.userAgent
window.isWeixin = /micromessenger/.test(navigator.userAgent.toLowerCase())
window.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
app.component('loading', Loading) // 注册全局组件
app.use(router).use(store)
app.mount('#app')
