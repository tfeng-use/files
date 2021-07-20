import request from '@/api/request'
// 获取微信config配置
export function getWxConfig (params) {
  let timestamp = +new Date() / 1000
  timestamp = timestamp.toFixed(0)
  const data = {
    timestamp,
    wx_app_name: params.wxAppName || '',
    url: params.url,
    isBase: true
  }
  return request('nodebase/v1/wechat/getJsapiTicketSignature', data)
}
