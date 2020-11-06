import query from './query'

const serverCenter = process.env.VUE_APP_SERVER_ECIF
// 普通使用
export function login (data, cb, errCallback) {
  return query(serverCenter, 'user/loginAsCode', data, cb, 'post', errCallback)
}

// 已json类型请求
export const createCoupon = function (data, cb, errCallback) {
  data = Object.assign(data, {
    setHeaders: {
      'Content-Type': 'application/json'
    }
  })
  return query(serverCenter, 'coupon/create', data, cb, 'post', errCallback)
}
