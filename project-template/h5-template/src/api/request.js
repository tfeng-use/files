import axios from 'axios'
import bus from '@bus'
import { err } from '@util'
import { API_URL, BASE_URL } from '@/utils/config'
import Cookies from 'js-cookie'
// Cookies.get('foo', { domain: 'sub.example.com' })
const timeOut = 1000 * 15
function request (functionName, data = {}, { httpType = 'post', cb } = {}) {
  let queryUrl = `${API_URL}/${functionName}`
  if (data._queryUrl) {
    // 如果是外部接口
    queryUrl = data._queryUrl
    delete data._queryUrl
  }

  const isBase = data.isBase
  if (isBase) {
    queryUrl = `${BASE_URL}/${functionName}`
    delete data.isBase
  }

  if (data.noLoading) {
    delete data.noLoading
  } else {
    bus.emit('show-loading')
  }
  let contentType = 'application/json;charset=UTF-8'
  if (data.contentType === 'formData') {
    delete data.contentType
    contentType = 'application/x-www-form-urlencoded;charset=UTF-8'
    data = Object.keys(data)
      .map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
      })
      .join('&')
  }
  const option = {
    data,
    method: httpType,
    url: queryUrl,
    timeout: timeOut,
    headers: {
      'Content-Type': contentType
    }
  }
  if (Cookies.get('merchantCompanyCode') && !isBase) {
    option.headers.merchantCompanyCode = Cookies.get('merchantCompanyCode')
  }
  if (!data.noToken && Cookies.get('X-JWT')) {
    option.headers['X-JWT'] = Cookies.get('X-JWT')
  } else {
    delete data.noToken
  }
  if (data.setHeaders) {
    option.headers = Object.assign(option.headers, data.setHeaders)
  }

  if (httpType === 'get') {
    // get和head方法不能有body
    const body = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&')
    option.url = `${queryUrl}?${body}`
  }
  return axios(option)
    .then(res => {
      bus.emit('hide-custom-loading')
      if (!res || !res.data || res.data.code !== 200) {
        // 登出
        if ([-10001, 80000001].includes(res.data.code)) {
          err('为了您的账户安全，请重新登录！')
          setTimeout(() => {
            bus.emit('login-out')
          }, 1500)
          return
        }
        if (res.data.state === '501') {
          err('服务器重启中，请稍后')
          return
        }
        if (!data.noError) {
          err(res.data.code === 500 ? '服务器维护中...' : res.data.msg)
        }
        return Promise.reject(res.data)
      } else {
        if (typeof cb === 'function') {
          cb(res.data)
        } else {
          return Promise.resolve(res.data)
        }
      }
    })
    .catch(res => {
      bus.emit('hide-custom-loading')
      console.log('queryCatch::', res)
      // err('服务器未响应，请稍后再试。')
      return Promise.reject(res)
    })
}
export default request
