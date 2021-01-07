import Vue from 'vue'
import App from './App.vue'
import initBus from '@/mixins/initBus'
import router from './router'
import '@style/app.less'
import vueUtil from '@js/vueUtil'
import store from '@store'

Vue.config.productionTip = false
Vue.use(vueUtil)
window.vm = new Vue({
  data: {
    socketToken: 'b:junit:test', // big junit:test  small b:junit:test
    socketUserId: '15469165441104', // 这是放的TXY的
    gPriceNow: '', // 实时金价
    byPriceNow: '' // 回购实时金价
  },
  store,
  router,
  mixins: [initBus], // 初始化公用bus函数
  render: h => h(App),
  created () {
    this.initConfig()
  },
  methods: {
    initConfig () {
      document.querySelector('.app-loading').classList.add('close')
    }
  }
}).$mount('#app')
