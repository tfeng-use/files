import pako from 'pako'
import bus from '@bus'

let socket
if (!window.WebSocket) {
  bus.$emit('message', 'success', '请更换浏览器，该浏览器不支持WebSocket')
}
const socketObj = {}
window.socketObj = socketObj
const control = {
  init (url, cb) {
    socket = new WebSocket(url)
    let thisSocket = {}
    if (!socketObj[url]) {
      socketObj[url] = {
        open: false,
        closeByMine: false, // 是否是用户主动关闭socket
        ready: false,
        checkOpen () {
          if (this.open === false && this.ready) {
            clearTimeout(thisSocket.timeOut)
            control.init(url)
          }
        },
        initCb () {
          if (typeof cb === 'function') {
            cb()
          }
        },
        close () {
          socket.close()
        }
      }
    }
    thisSocket = socketObj[url]

    thisSocket.ready = false
    socket.onopen = () => {
      console.log('连接成功')
      thisSocket.open = true
      thisSocket.ready = true
      thisSocket.closeByMine = true
      bus.$emit('socket_on', 'open')
      bus.$on('socket_send', (data) => {
        socket.send(JSON.stringify(data))
      })
      bus.$on('socket_close', () => {
        thisSocket.closeByMine = true
        socket.close()
      })
      // thisSocket.pingSetIntervalTimer = setInterval(() => {
      //   socket.send(JSON.stringify({ code: 2 }))
      // }, 10000);
      thisSocket.initCb()
    }
    socket.onmessage = (res) => {
      // bus.$emit('socket_on_msg',JSON.parse(res.data), url)
      try {
        const strData = atob(res.data)
        const charData = strData.split('').map(x => x.charCodeAt(0))
        const binData = new Uint8Array(charData)
        const data = pako.inflate(binData, {
          to: 'string'
        })
        const msg = JSON.parse(data)
        bus.$emit('socket_on_msg', msg, url)
        // if (msg && (msg.code === 103 || msg.code === '103')) {
        //   console.log('\n::msg:: ', msg);
        // }
      } catch (e) {
        console.log(e)
      }
    }
    function handleClose (closeCallback) {
      thisSocket.open = false
      clearTimeout(thisSocket.timeOut)
      // clearInterval(thisSocket.pingSetIntervalTimer)
      bus.$off('socket_send')
      thisSocket.timeOut = setTimeout(() => {
        bus.$emit('socket_on', 'reconnection')
        closeCallback(url)
      }, 3000)
    }
    socket.onerror = () => {
      console.log('连接错误')
      if (!thisSocket.closeByMine) {
        handleClose(control.init)
      }
    }
    socket.onclose = () => {
      console.log('连接已关闭...')
      if (!thisSocket.closeByMine) {
        handleClose(control.init)
      }
    }
  }
}
export default control
