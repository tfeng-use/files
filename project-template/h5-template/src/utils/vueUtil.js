import BScroll from 'better-scroll'
import { getIOSVersion } from './util'
const scrollObj = {}
window.scrollObj = scrollObj
export function setVueUtil (app) {
  app.config.globalProperties.$scrollObj = scrollObj
  app.directive('bscroll', {
    beforeMount (el) {
      let option = {
        // 下拉刷新
        // pullDownRefresh: {
        //   threshold: 50,
        //   stop: 20
        // },
        // //上拉加载
        // pullUpLoad: {
        //   threshold: 0,
        // },
        // 鼠标滚动
        mouseWheel: true,
        // 派发scroll事件
        probeType: 3,
        // 派发tap事件
        tap: true,
        click: true
      }
      // ios 13.4 bounce回弹有问题
      if (getIOSVersion().toString() >= '13.4') {
        option.useTransition = false
        // option.bounce = false
      }
      if (el.getAttribute('option')) {
        try {
          let opt = JSON.parse(el.getAttribute('option').replace(/'/gi, '"'))
          option = { ...option, ...opt }
        } catch (e) {
          console.warn('bscroll-option-error')
        }
      }
      const scroll = new BScroll(el, option)
      scrollObj[el.getAttribute('data')] = scroll
      setTimeout(() => {
        scroll.refresh()
      }, 20)
    },
    updated (el, binding) {
      const scroll = scrollObj[el.getAttribute('data')]
      if (binding.oldValue !== binding.value) {
        console.log('update -------- ')
        scroll.refresh()
      }
      if (binding.value.scrollBottem || binding.value.scrollBottem === 0) {
        if (binding.value.time) {
          scroll.scrollTo(
            0,
            binding.value.scrollBottem || scroll.maxScrollY,
            binding.value.time
          )
        } else {
          scroll.scrollTo(0, -binding.value.scrollBottem)
        }
        scroll.refresh()
      }
    }
  })
}
