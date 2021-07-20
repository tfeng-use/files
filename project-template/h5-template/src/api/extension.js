import request from './request'

// 生成二维码
export function generateQrcode (data) {
  return request('', {
    wx_app_name: 'WXMP_REPURCHASE',
    timestamp: '1234567890',
    message: {
      action_name: 'QR_LIMIT_STR_SCENE',
      action_info: {
        scene: {
          scene_str: `promoUid=${data.promoUid}&configCode=${data.configCode}&nick=${data.nickName}`
        }
      }
    },
    noToken: true,
    _queryUrl: '...'
  })
}
