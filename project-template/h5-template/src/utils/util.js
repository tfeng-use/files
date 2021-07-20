import { Toast } from 'vant'
import throttle from 'lodash/throttle' // lodash按需加载
import areaList from './area'

export const getURLBase64 = url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function () {
      if (this.status === 200) {
        var blob = this.response
        var fileReader = new FileReader()
        fileReader.onloadend = function (e) {
          var result = e.target.result
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      }
    }
    xhr.onerror = function (e) {
      reject(e)
    }
    xhr.send()
  })
}

// 失败提示弹窗
export const err = throttle(msg => Toast.fail(msg), 3000, { trailing: false })
export const success = throttle(msg => Toast.success(msg), 3000, {
  trailing: false
})

// 格式化时间
export function formatDate (date, format) {
  if (!date) {
    return ''
  }
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    date = new Date(date.replace(/-/g, '/'))
  }
  var paddNum = function (num) {
    num += ''
    return num.replace(/^(\d)$/, '0$1')
  }
  // 指定格式字符
  var cfg = {
    yyyy: date.getFullYear(), // 年 : 4位
    yy: date
      .getFullYear()
      .toString()
      .substring(2), // 年 : 2位
    M: date.getMonth() + 1, // 月 : 如果1位的时候不补0
    MM: paddNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
    d: date.getDate(), // 日 : 如果1位的时候不补0
    dd: paddNum(date.getDate()), // 日 : 如果1位的时候补0
    h: date.getHours(), // 时
    hh: paddNum(date.getHours()), // 时
    mm: paddNum(date.getMinutes()), // 分
    ss: paddNum(date.getSeconds()) // 秒
  }
  format || (format = 'yyyy-MM-dd hh:mm:ss')
  return format.replace(/([a-z])(\1)*/gi, function (m) {
    return cfg[m]
  })
}

// 下载图片
export const downImg = url => {
  let a = document.createElement('a')
  let clickEvent = document.createEvent('MouseEvents')
  a.setAttribute('href', url)
  a.setAttribute('download', 'codeImg')
  a.setAttribute('target', '_blank')
  clickEvent.initEvent('click', true, true)
  a.dispatchEvent(clickEvent)
}

export const formatIdcard = (idcard, hideStart = 3, hideLength = 13) => {
  let arr = idcard.split('')
  let temp = new Array(hideLength).fill('*')
  arr.splice(hideStart, hideLength, ...temp)
  return arr.join('')
}

// base64转file
export function dataURLtoFile (dataurl, filename) {
  var arr = dataurl.split(',')
  var bstr = atob(arr.pop())

  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: 'image/jpg' })
}

export function getIOSVersion () {
  var version = 0
  var u = navigator.userAgent
  var isiOS = !!u.match(/\(i[^]+( U)? CPU.+Mac OS X/) // ios终端
  if (isiOS) {
    version = u.toLowerCase().match(/cpu iphone os (.*?) like mac os/)
    version = version && version[1].replace(/_/g, '.')
  }
  return version || 0
}

export function str2json (str) {
  if (!str) {
    return {}
  }
  if (typeof str === 'object') {
    return str
  }
  try {
    return JSON.parse(str)
  } catch (e) {
    console.log(e)
    return {}
  }
}

// 转换图片
export function transformImg (imgStr) {
  if (!imgStr) {
    return []
  }
  if (imgStr.includes(',') && !imgStr.includes('[')) {
    return imgStr.split(',')
  }
  const imgList = str2json(imgStr)
  if (Array.isArray(imgList)) {
    return imgList
  } else {
    return [imgStr]
  }
}

export function translateArea (area) {
  // 如果已经分开，直接返回
  if (!area || area.indexOf('-') > -1) {
    return area
  }
  let province = Object.values(areaList.province_list)
  let result
  province.every(item => {
    if (area.indexOf(item) === 0) {
      let length = item.length
      result = area.slice(0, length) + '-' + area.slice(length)
      return false
    } else if (area.indexOf(item.slice(0, -1)) === 0) {
      let length = item.length - 1
      result = area.slice(0, length) + '-' + area.slice(length)
      return false
    }
    return true
  })
  return result
}

export const calcFormula = (str, ...params) => {
  const arr = str.split('')
  let index = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 'x') {
      arr[i] = params[index] + ''
      index++
    }
  }
  str = arr.join('')
  return eval(str)
}
