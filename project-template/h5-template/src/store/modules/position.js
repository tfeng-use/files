const state = {
  cachePosition: {}
}
const mutations = {
  // 保存页面滚动的高度
  SET_POSITION_CACHE (state, className) {
    if (className[0] !== '.') {
      className = '.' + className
    }
    const prop = className.slice(1)

    const dom = document.querySelector(className)
    state.cachePosition[prop] = {
      top: dom?.scrollTop,
      dom
    }
    console.log('state.cachePosition', state.cachePosition)
  },
  // 保持到存储的位置
  KEEP_SCROLL (state, className) {
    if (className[0] !== '.') {
      className = '.' + className
    }
    const prop = className.slice(1)
    if (state.cachePosition[prop] && state.cachePosition[prop].dom) {
      state.cachePosition[prop].dom.scrollTop = state.cachePosition[prop].top
    }
  },
  // 将存储位置重置
  INIT_WRAPPER (state, className) {
    if (className[0] !== '.') {
      className = '.' + className
    }
    const prop = className.slice(1)
    if (state.cachePosition[prop].dom) {
      state.cachePosition[prop].dom.scrollTop = 0
    }
    state.cachePosition[prop].top = 0
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
