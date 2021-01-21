// 根级别actions
export const updateBreadcrumb = ({ commit }, value) => {
  commit('UPDATE_BREADCRUMB', value)
}
export const updateIsOpenSale = ({ commit }, value) => {
  commit('UPDATE_ISOPENSALE', value)
}
export const updateCurrentCrumb = ({ commit }, value) => {
  commit('UPDATE_CURRENT_CRUMB', value)
}
export const updateSlideComponent = ({ commit }, value) => {
  commit('UPDATE_SLIDE_COMPONENT', value)
}
export const updateCurrentMenu = ({ commit }, value) => {
  commit('UPDATE_CURRENT_MENU', value)
}
export const updateLeftMenu = ({ commit }, value) => {
  commit('UPDATE_LEFT_MENU', value)
}
export const clearStore = ({ commit }, value) => {
  commit('CLEAR_STORE', value)
}

export const updateUserInfo = ({ commit }, value) => {
  commit('UPDATE_USER_INFO', value)
}
