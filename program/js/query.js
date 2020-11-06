/* eslint-disable */
// import Loading from '@components/loading/index'
import bus from '@bus'
import cookie from '@js/cookie'
import router from '../../router'
let baseUrlOrigin = process.env.VUE_APP_BASE_URL
const SUCCESS_CODE = [200]
export default function query (
  serviceName,
  functionName,
  data = {},
  callback = () => {},
  method = 'post',
  callbackErr = () => {}
) {
  let baseUrl
  if (data.baseUrl) {
    baseUrl = data.baseUrl
    delete data.baseUrl
  } else {
    baseUrl = baseUrlOrigin
  }
  let isBlob = false
  if (data.isBlob) {
    delete data.isBlob
    isBlob = true
  }

  let url = `${baseUrl}/${functionName}`
  if (serviceName) {
    url = `${baseUrl}/${serviceName}/${functionName}`
  }
  const headers = new Headers()
  let headerContentType = ''
  // 有些接口需要其他类型的header
  if (data.setHeaders) {
    Object.keys(data.setHeaders).forEach(hkey => {
      headers.append(hkey, data.setHeaders[hkey])
      headerContentType = data.setHeaders[hkey]
    })
    delete data.setHeaders
    data = JSON.stringify(data)
  } else {
    headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=UTF-8'
    )
  }
  // 添加header公用参数
  headers.append('X-JWT', cookie.getItem('accessToken') || '')

  // 如果请求的参数里面有需要转换的参数
  const params = data
  // 检查是否有undefined
  for (const key in params) {
    if (params[key] === undefined || params[key] === 'undefined') {
      params[key] = ''
    }
  }
  let body = ''
  if (headerContentType === 'application/json') {
    body = params
  } else {
    body = Object.keys(params)
      .map(
        key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join('&')
  }

  const fetchObj = {
    headers,
    method,
    credentials: 'omit'
  }

  if (isBlob) {
    fetchObj.responseType = 'blob'
  }
  if (method === 'get' || method === 'head') {
    // get和head方法不能有body
    url = `${url}?${body}`
  } else {
    fetchObj.body = body
  }
  window
    .fetch(url, fetchObj)
    .then(res => {
      try {
        let response
        if (fetchObj.responseType === 'blob') {
          response = res.blob()
        } else {
          response = res.json()
        }
        return response
      } catch (e) {
        console.log(e)
        return false
      }
    })
    .catch(error => {
      console.log(error)
    })
    .then(response => {
      if (response && SUCCESS_CODE.includes(Number(response.code))) {
        callback(response)
      } else if (fetchObj.responseType === 'blob') {
        callback(response)
      } else {
        const msg = (response && response.msg) || '服务器异常，请稍后重试'
        bus.$emit('error', msg)
        callbackErr(
          response || {
            msg
          }
        )
      }
      // 如果是接口返回未登录 则跳登录页面
      if (response && response.code === 80000001) {
        cookie.removeItem('companyCode')
        cookie.removeItem('accessToken')
        cookie.removeItem('token')
        cookie.removeItem('userCode')
        bus.$emit('socket_close')
        router.replace({
          path: '/login'
        })
      }
    })
}
