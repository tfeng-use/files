const serverCenter = process.env.VUE_APP_BASE_URL

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

// 保留小数位
export const formatDecimal = (num, digit = 2, carry = 5) => {
  if (typeof num === 'string') {
    num = +num
  }
  // 将num转换为str，并保证有足够的0，同时避免 0.0000000000000001 默认解析为指数形式
  let str = num.toFixed(18)
  console.log('str', str)
  let arr = str.split('.')

  console.log('arr', arr)
  let decimal = arr[1].slice(0, digit + 1)
  console.log('decimal', decimal)

  let lastNum = decimal.slice(-1)
  console.log('lastNum', lastNum)

  // let tempNum = +(arr[0] + decimal.slice(0, digit))
  // 这儿做所以用1加上，是为了避免小数位为 00001时，把前面的0给去掉了
  let tempNum = +(1 + decimal.slice(0, digit))
  // console.log('tempNum', tempNum)

  // 处理进位
  if (lastNum >= carry) {
    tempNum = tempNum + 1
  }
  tempNum = tempNum + ''
  let integer = arr[0]
  if (tempNum[0] > 1) {
    // 说明进位到整数位
    integer = Math.abs(+integer) + 1 + ''
  }
  // 获取小数位，并补全
  decimal = tempNum.slice(1).padEnd(0, digit)

  tempNum = tempNum + ''
  if (digit === 0) {
    // 特殊处理digit为0的情况
    return integer
  }
  return `${integer}.${decimal}`
}

// 千分隔，用于金额的显示，showHorizontal 是否显示--
export const milliFormat = (num, count = 2, { empty = '--' } = {}) => {
  if (isNaN(num) || num === null) {
    if (typeof num === 'string') {
      // 如果是已经格式化的就直接返回
      if (!isNaN(+num.replace(/,/g, ''))) {
        return num
      }
    }
    if (empty === 0) {
      // 如果空用0表示
      num = 0
      return num.toFixed(count)
    }
    return empty
  }

  num = formatDecimal(num, count)
  let [integer, decimal] = num.split('.')
  integer = integer.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  if (decimal) {
    if (+integer === 0 && +decimal === 0) {
      return `${+integer}.${decimal}`
    }
    return `${integer}.${decimal}`
  } else {
    return integer
  }
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
  const req = ''

  switch (type) {
    case 'deliveryCert':
      // req = require.context('@/assets/deliveryCert', false, /\.png$/)
      break
    default:
      break
  }

  const arr = []
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
  const arr = tip.split('')
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

// 通过角色判断是否是管理员
export const isManagerFn = (roles = []) => {
  let isManager = false
  roles.every(item => {
    if (item.roleCode === '2578639920687104' || item.name === '系统管理员') {
      isManager = true
      return false
    }
    return true
  })
  return isManager
}
