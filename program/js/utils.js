// 图片压缩
export const compressImage = function (base64Str, name, needSize) {
  return new Promise(resolve => {
    const image = new Image()
    image.src = base64Str
    image.onload = function () {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const imageWidth = image.width / 2
      const imageHeight = image.height / 2
      let data = ''
      canvas.width = imageWidth
      canvas.height = imageHeight
      context.drawImage(image, 0, 0, imageWidth, imageHeight)
      data = canvas.toDataURL('image/jpeg')
      const arr = data.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      if (needSize) {
        resolve({
          newFile: new File(
            [
              new Blob([u8arr], {
                type: mime
              })
            ],
            name + '.jpg',
            {
              type: 'image/jpeg'
            }
          ),
          size: {
            width: imageWidth,
            height: imageHeight
          }
        })
      } else {
        resolve(
          new File(
            [
              new Blob([u8arr], {
                type: mime
              })
            ],
            name + '.jpg',
            {
              type: 'image/jpeg'
            }
          )
        )
      }
    }
  })
}

// 打电话
export const handleCall = function (tel) {
  const a = document.createElement('a')
  a.setAttribute('href', 'tel:' + tel)
  a.click()
}

// 复制
export const handleCopy = message => {
  var input = document.createElement('input')
  input.value = message
  document.body.appendChild(input)
  input.select()
  input.setSelectionRange(0, input.value.length)
  document.execCommand('Copy')
  document.body.removeChild(input)
}

// 文件转换为 base64
export const fileToBase64 = file => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      resolve(this.result)
    }
  })
}

// 通过form的形式下载文件，适用于不用鉴权的请求，如果需要鉴权建议使用fetch(url, obj)，obj.responseType为blob
export const downStreamFile = batchCode => {
  console.log('serverCenter', serverCenter)
  var form = document.createElement('form')
  form.id = 'form'
  form.name = 'form'
  form.enctype = 'application/x-www-form-urlencoded'
  document.body.appendChild(form)
  // 请求方式POST提交时 默认Content-Type就是application/x-www-form-urlencoded
  form.method = 'GET'
  form.action = `${serverCenter}/tradecenter/coupon/downExcel/${batchCode}`
  form.submit()
  document.body.removeChild(form)
}

// 千分隔，用于金额的显示，showHorizontal 是否显示--
export const milliFormat = (num, count = 2, showHorizontal) => {
  // 如果为非0的falsy
  if (!!num === false && num !== 0 && showHorizontal) {
    return '--'
  }
  if (!!num === false) {
    if (count) {
      const num = 0
      return num.toFixed(count)
    }
    return 0
  }
  num = (+num).toFixed(count)
  const [integer, decimal] = num.split('.')
  let value = integer.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  if (decimal) {
    value = `${value}.${decimal}`
  }
  return value
}

// 数字转中文
export const digitalToUppercase = n => {
  n = +n
  if (isNaN(n)) {
    return '-'
  }
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万 ', '亿'],
    ['', '拾', '佰', '仟']
  ]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(+(n * 10 * Math.pow(10, i)).toFixed(2)) % 10] +
      fraction[i]
    ).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  s = s.replace(/undefined/g, 0)
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}

// 将base64转换为文件
export const dataURLtoFile = (dataurl, filename = 'test.png') => {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?)/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime
  })
}

// 加载js
export const loadScript = (src, cb) => {
  const isLoad = [...document.querySelectorAll('script')].some(_ =>
    _.src.includes(src)
  )
  if (isLoad) {
    return cb()
  }
  const scriptFile = document.createElement('script')
  scriptFile.src = src
  document.body.appendChild(scriptFile)
  scriptFile.addEventListener(
    'load',
    () => {
      if (typeof cb === 'function') {
        cb()
      }
    },
    false
  )
}

// 下载流文件，content为接口返回的流文件
export const downLoadFile = function (content, fileName) {
  const blob = new Blob([content])
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  const filename = fileName
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

// 获取一个文件夹下面的所有的图片，并以一个数组的形式返回
export const getImgListFromPath = function (type) {
  // context的第一个参数设置为变量会报错
  let req = ''

  switch (type) {
    case 'deliveryCert':
      req = require.context('@/assets/deliveryCert', false, /\.png$/)
      break
    default:
      break
  }

  let arr = []
  // req.keys返回所有的路径
  req.keys().forEach(url => {
    // 将url传入req，会返回可以直接使用的路径
    arr.push(req(url))
  })
  return arr
}

// 转换换行符，tip是包含textArea中包含换行符的字符串
export const toBr = function (tip) {
  // 首先转换为数组
  let arr = tip.split('')
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].charCodeAt(0) === 10 && arr[i].length === 1) {
      arr[i] = '</br>'
    }
  }
  tip = arr.join('')
  return tip
}

// 将小数点转换为10进制时需要乘的倍数
export const getMulti = value => {
  let multiple = 1
  if (('' + Number(value)).indexOf('.') !== -1) {
    const digit = ('' + Number(value)).split('.')[1]
    if (digit.length) {
      multiple = 10 ** digit.length
    }
  }
  return multiple
}

// a是否是b的整数倍
export const isDigitTimes = (a, b) => {
  a = +a
  b = +b
  const aMulti = getMulti(a)
  const bMulti = getMulti(b)
  const times =
    ((parseInt(a * aMulti) / parseInt(b * bMulti)) * bMulti) / aMulti
  return times % 1 === 0
}
