const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.info,
  cacheInfo: state => state.user.cacheInfo,
  cachePosition: state => state.position.cachePosition,
  fromRouter: state => state.fromRouter // 来着哪儿的路由
}

export default getters
