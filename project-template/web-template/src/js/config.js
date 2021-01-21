// 是否是测试环境
export const isTest = process.env.VUE_APP_SERVER_ENV === 'test'
export const isDev = process.env.VUE_APP_SERVER_ENV === 'development'
export const isProd = process.env.VUE_APP_SERVER_ENV === 'production'

// socket 地址
export let SOCKET_URL = 'wss://api.jjh9999.com/websocket/'

if (isTest) {
  SOCKET_URL = 'wss://test-stws.jjh9999.com/'
} else if (isDev) {
  // SOCKET_URL = 'ws://118.126.102.142:8003'
  SOCKET_URL = 'wss://test-stws.jjh9999.com/'
}
export const ENV = process.env.VUE_APP_ENV
const domainPrefix = ENV !== 'production' ? `${ENV}-` : ''
const jjhApiDomain = `https://${domainPrefix}public-api.jjh9999.com`
export const J_BASE_URL = `${jjhApiDomain}/bm-base`
// 对象存储配置
export const mycloudInfo = {
  // todo
  bucket: 'test-invest-1255882558',
  region: 'ap-guangzhou'
}
export const ECIF = 'ecif'
