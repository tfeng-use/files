import query from './query'
import { ECIF } from '@js/config.js'

const serverCenter = ECIF
// 登录
export function login (data, cb, errCallback) {
  return query(serverCenter, 'user/loginAsCode', data, cb, 'post', errCallback)
}

// 获取验证码
export function sendSMS (data, cb, errCallback) {
  return query(
    serverCenter,
    'user/sendVerifyCode',
    data,
    cb,
    'post',
    errCallback
  )
}
