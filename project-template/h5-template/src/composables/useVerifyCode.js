// 用于发送验证码
import { ref } from 'vue'
import { sendVerifyCode } from '@/api/login'
export function useVerifyCode ({
  text = '获取验证码',
  loadingText = '已发送 ',
  second = 30
} = {}) {
  const sendReady = ref(true)
  const sendText = ref(text)
  function send (phone) {
    let secondNumber = second
    sendVerifyCode({
      phone
    }).then(() => {
      sendReady.value = false
      changeSendText()
      function changeSendText () {
        if (secondNumber > 0) {
          sendText.value = `${loadingText}${secondNumber}s`
          setTimeout(() => {
            secondNumber--
            changeSendText()
          }, 1000)
        } else {
          sendReady.value = true
          sendText.value = text
        }
      }
    })
  }
  return {
    send,
    sendText,
    sendReady
  }
}
