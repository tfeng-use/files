<template>
  <div class="login">
    <div class="login-content" flex="main:center cross:center">
      <div>
        <h1 class="login-h1">欢迎登录投资金条管理后台</h1>
        <div class="login-body">
          <a-form
            class="mt16"
            :form="messageForm"
            @submit="handleSubmit($event, 'messageForm')"
          >
            <label>手机号</label>
            <a-form-item class="mt8">
              <a-input
                addonBefore="+86"
                :max-length="11"
                size="large"
                placeholder="请输入手机号"
                v-decorator="[
                  'account',
                  {
                    rules: [
                      { validator: $utils.checkPhone },
                      { required: true, message: '请输入手机号' }
                    ]
                  }
                ]"
              />
            </a-form-item>

            <label>验证码</label>
            <a-form-item class="mt8 form-code">
              <a-input
                :max-length="6"
                placeholder="请输入6位验证码"
                v-decorator="[
                  'verificationCode',
                  { rules: [{ required: true, message: '请输入6位验证码' }] }
                ]"
                @search="sendSMS"
                size="large"
              ></a-input>
              <span @click="sendSMS" class="code-btn">{{ btnText }}</span>
            </a-form-item>

            <a-button
              :loading="btnLoading"
              type="primary"
              size="large"
              class="body-submit"
              html-type="submit"
              >登录</a-button
            >
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cookie from '@js/cookie'
import { mapActions } from 'vuex'
import { login, sendSMS } from '@api/account'
export default {
  name: 'login',
  data () {
    return {
      messageForm: this.$form.createForm(this), // 短信表单
      time: 0, // 获取验证码时间
      btnLoading: false,
      maxAge: 604800 // 登录态为7天
    }
  },
  computed: {
    btnText () {
      const time = this.time
      return time <= 0 ? '获取验证码' : '重新获取' + time + 'S'
    }
  },
  created () {},
  methods: {
    ...mapActions({
      updateUserInfo: 'updateUserInfo'
    }),
    // 点击登录
    handleSubmit (e, key) {
      e.preventDefault()
      this[key].validateFields((err, values) => {
        if (!err) {
          this.btnLoading = true
          login(
            {
              phone: values.account.replace(/\s/g, ''),
              code: values.verificationCode
            },
            ({ data }) => {
              this.btnLoading = false
              const { userInfo, token, company, permissions, roles } = data
              // vuex储存用户信息
              this.updateUserInfo({
                ...userInfo,
                isManager: this.$utils.isManagerFn(roles)
              })
              this.$storage.set('investUser', data)
              // cookie储存token
              cookie.setItem(
                'companyCode',
                company.companyCode || '',
                this.maxAge
              )
              cookie.setItem('accessToken', token || '', this.maxAge)
              cookie.setItem(
                'x-token',
                token || '',
                this.maxAge,
                '',
                'xxxxx.com'
              )
              cookie.setItem('userCode', userInfo.userCode || '', this.maxAge)
              // 没有用vue-router 是为了 刷新页面 菜单页能正常选中和展开
              // location.href = '/'
              this.$router.replace(permissions[0].router)
            },
            ({ msg }) => {
              this.btnLoading = false
            }
          )
        }
      })
    },
    // 获取短信验证码
    sendSMS () {
      this.messageForm.validateFields(['account'], (err, values) => {
        if (!err && this.time <= 0) {
          // 发送验证码
          sendSMS({ phone: values.account, type: 4 }, res => {
            console.log(res)
            this.$message.success('验证码发送成功')
            this.time = 60
            var timer = setInterval(() => {
              // 当时间<=0时清除定时器
              if (this.time <= 0) {
                clearInterval(timer)
              }
              this.time -= 1
            }, 1000)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url('~@assets/illustrate-bg.png') no-repeat;
  background-size: cover;
  .login-content {
    width: 976px;
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    background: #fff;
    .login-h1 {
      font-size: 24px;
      text-align: center;
    }
  }
  .login-body {
    margin-top: 40px;
    width: 404px;
    background: #fff;
    padding: 40px;
    box-shadow: 0 0 16px 0 rgba(27, 83, 143, 0.1);
    .body-logo {
      img {
        height: 35px;
      }
      margin-bottom: 24px;
    }
    .form-code {
      position: relative;
      .code-btn {
        position: absolute;
        right: 12px;
        z-index: 10;
        font-size: 14px;
        color: var(--color-info);
        cursor: pointer;
        &::before {
          content: '|';
          color: #999;
          display: inline-block;
        }
      }
    }
    .body-submit {
      width: 100%;
      margin-top: 24px;
    }
    .forget-password {
      cursor: pointer;
      &:hover {
        color: var(--color-info);
      }
    }
  }
}
</style>
