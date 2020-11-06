// 根级别mutations
export const UPDATE_BREADCRUMB = function (
  state,
  { item, type = 'push', index = 0 }
) {
  if (type === 'push') {
    // 添加
    state.breadcrumb.push(item)
  } else if (type === 'replace') {
    // 替换
    state.breadcrumb.splice(index)
    state.breadcrumb.push(item)
  } else if (type === 'back') {
    // 返回
    state.breadcrumb.splice(-1)
  } else if (type === 'goTo') {
    state.breadcrumb.splice(index + 1)
  } else if (type === 'current') {
    state.currentCrumb = item
    return
  }

  // 当length>1展开弹窗
  const lenfth = state.breadcrumb.length
  if (lenfth > 1) {
    const breadcrumbItem = state.breadcrumb[lenfth - 1]
    state.currentCrumb = breadcrumbItem // 设置面包屑最后一个为当前页
    state.slideComponent = breadcrumbItem.slideComponent || null // 显示什么控件
  } else {
    state.slideComponent = ''
    state.currentCrumb = null
  }
}

export const UPDATE_CURRENT_CRUMB = function (state, value) {
  state.currentCrumb = value
}
export const UPDATE_SLIDE_COMPONENT = function (state, value) {
  state.slideComponent = value
}
export const UPDATE_CURRENT_MENU = function (state, value) {
  state.currentMenu = value
}
export const UPDATE_LEFT_MENU = function (state, value) {
  state.leftMenu = value
}
export const UPDATE_ISOPENSALE = function (state, value) {
  state.isOpenSale = value
}
// 清空重置store
export const CLEAR_STORE = function (state, value) {
  state.breadcrumb = []
  state.currentCrumb = null
  state.slideComponent = ''
  state.currentMenu = {}
}

// 更新用户信息
export const UPDATE_USER_INFO = function (state, value) {
  state.userInfo = value
}
