<template>
  <div class="pw32 pt64 login_page bg_white" flex="dir:top">
    <div flex-box="1">
      <p class="fs24 font_bold">
        欢迎来到<br />
        h5-template
      </p>
      <label flex="dir:top " class="login_cell mt56" for>
        <!-- <span flex="cross:center" class="mb8">手机号</span> -->
        <input
          v-model.trim="phone"
          type="tel"
          maxlength="11"
          class="login_input"
          placeholder="请输入手机号"
        />
      </label>
      <label flex="dir:top " class="login_cell" for>
        <!-- <span flex="cross:center" class="mb8">验证码</span> -->
        <div class="position_r">
          <input
            v-model.trim="password"
            maxlength="6"
            @keyup.enter="submit"
            class="login_input mr16"
            placeholder="请输入验证码"
            type="password"
          />
          <span
            @click="sendCode"
            class="code-text fs14"
            :class="{ 'color-headline': !sendReady || !phone }"
            >{{ sendText }}</span
          >
        </div>
      </label>
      <button
        class="gm-btn gm-btn--primary mt16"
        :disabled="btnDisable"
        @click="submit"
      >
        登录
      </button>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// import Storage from 'good-storage'
import bus from '@bus'
import { err } from '@util'
import { Button } from 'vant'
import { useVerifyCode } from '@/composables/useVerifyCode'
import { checkAccountExistByPhone } from '@/api/login'
export default {
  name: 'Login',
  components: {
    [Button.name]: Button
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const phone = ref('')
    const password = ref('')
    function go2 (path) {
      router.push(path)
    }
    // 登录
    // 重定向
    function replaceRouter () {
      router.replace('/extension')
    }

    function checkPhone () {
      return new Promise((resolve, reject) => {
        checkAccountExistByPhone({
          phone: phone.value
        })
          .then(res => {
            if (res.data) {
              resolve(res)
            } else {
              err('账号不存在')
              reject()
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    }

    async function submit () {
      if (!phone.value) {
        err('手机号')
        return
      }
      if (phone.value?.length !== 11) {
        err('请输入正确的11位手机号')
        return
      }
      if (!password.value) {
        err('请输入验证码')
        return
      }
      // 先检测电话号码是否合格
      checkPhone().then(() => {
        bus.emit('show-custom-loading')
        store
          .dispatch('user/login', {
            phone: phone.value,
            smsVerifyCode: password.value
          })
          .then(() => {
            bus.emit('refresh-user')
            replaceRouter()
            bus.emit('hide-custom-loading')
          })
          .catch(error => {
            bus.emit('hide-custom-loading')
            console.log('loginErr:', error)
          })
      })
    }
    // --block // 验证码
    const { send, sendText, sendReady } = useVerifyCode()
    function sendCode () {
      if (!sendReady.value || !phone.value) {
        return
      }
      checkPhone().then(() => {
        send(phone.value)
      })
    }

    return {
      btnDisable: computed(() => !phone.value || !password.value),
      phone,
      go2,
      password,
      sendCode,
      sendText,
      sendReady,
      submit
    }
  }
}
</script>
<style lang="less" scoped>
.login_cell {
  padding: 0 0 16px;
  font-size: 20 / 16rem;
}
.login_input {
  border-bottom: 1px solid var(--border-color);
  padding: 8px 8px 8px 0;
  border-radius: 0;
  transition: all 0.3s;
  width: 100%;
  &:focus {
    border-color: var(--color-primary);
  }
}
.code-text {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
input:-webkit-autofill {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
</style>
