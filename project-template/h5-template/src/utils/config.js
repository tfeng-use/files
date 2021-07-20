export const VUE_APP_NODE_ENV = process.env.VUE_APP_NODE_ENV
export const __DEV__ = VUE_APP_NODE_ENV === 'dev'
export const __PROD__ = VUE_APP_NODE_ENV === 'prod'
// 是否是本地
export const __LOCAL__ = process.env.VUE_APP_IS_LOCAL === 'local'
// 是否是微信环境
export const __WX__ = /micromessenger/.test(navigator.userAgent.toLowerCase())
//
const BASE_DOMAIN = 'public-api.jjh9999.com'
export const BASE_URL = __PROD__
  ? `https://${BASE_DOMAIN}`
  : `https://${VUE_APP_NODE_ENV}-${BASE_DOMAIN}`
export const SOCKET_URL = 'wss://stws.jjh9999.com'

// 业务API-DOMAIN
const API_DOMAIN_BASE = 'opcenter-api.huangjinx.com/opcenter'

const API_DOMAIN = __PROD__
  ? API_DOMAIN_BASE
  : `${VUE_APP_NODE_ENV}-${API_DOMAIN_BASE}`

// 业务API地址
// export const API_URL = `https://${API_DOMAIN}/gm-itrade`
export const API_URL = `https://${API_DOMAIN}`

// socket地址
export const SOCKET_URL_BUSINESS = `wss://${API_DOMAIN}/websocket`
// 行情数据源socket地址
export const SOCKET_URL_PEICR = 'wss://stws.jjh9999.com/'
export const SOCKET_TOKEN = 'junit:test'
// 获取code跳转地址
export const IGNORE_PATH = 'auth4'
// 文件上传
export const uploadConfig = {
  appCode: 'GM_ITRADE',
  queryUrl: `${BASE_URL}/bm-base/objectStorage/getTempCredential`,
  projectName: __PROD__ ? 'gm-itrade-h5' : 'gm-itrade-h5_test' // 项目名称
}
