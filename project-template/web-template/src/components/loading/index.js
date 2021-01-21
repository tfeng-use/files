import loading from './loading.vue'
import Vue from 'vue'

const Instance = new Vue({
  render (h) {
    return h(loading)
  }
})
const component = Instance.$mount()
document.body.appendChild(component.$el)
const _loading = Instance.$children[0]

export default {
  showLoading () {
    _loading.show()
  },
  hideLoading () {
    _loading.hide()
  },
  showContent (otherConfig = {}) {
    Vue.prototype.$nextTick(() => {
      const contentLoading = document.body.querySelector('#content-loading')
      component.$el.style.position = 'absolute'
      contentLoading && contentLoading.appendChild(component.$el)
      _loading.show()
    })
  }
}
