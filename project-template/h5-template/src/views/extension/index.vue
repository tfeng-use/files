<template>
  <div class="extension" :class="{ needAddBottom: needAddBottom }">
    <van-loading class="middle-center" v-if="!loaded" type="spinner" />
    <template v-else>
      <div class="poster-wrap">
        这儿是海报部分
      </div>
    </template>
    <div class="generate-img-wrap" v-if="showGenerateImg">
      <p style="margin-top: 3px; color: #fff">请长按图片，保存到相册</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import html2canvas from 'html2canvas'
import { generateQrcode } from '@/api/extension'
import { getURLBase64 } from '@/utils/util'
import avatar from '@/assets/avatar.png'
import downLoadArrow from '@/assets/banner_ico_download@2x.png'
import jcLogo from '@/assets/jc_logo_banner@2x.png'
import hideMask from '@/assets/close_mask@2x.png'
import logo from '@/assets/logo.png'
import bus from '@bus'
import { GENRATE_QRCODE_PARAM } from '@const'
import { Loading } from 'vant'
import Storage from 'good-storage'
const QRCode = require('qrcode')

export default {
  setup () {
    // console.log('这儿是extension')
    const bgImg = ref(jcImgBanner)
    const downLoadIcon = ref(downLoadArrow)
    const qrcodeImg = ref('')
    const hideMaskIcon = ref(hideMask)
    const card = ref(null)
    const loaded = ref(true)
    const show = ref(false)
    const showGenerateImg = ref(false) // 显示生成的图片
    let generateImg = ref('') // 生成的图片
    const store = useStore()
    const simiTop = ref('0')
    const avatarImg = ref(avatar)
    const needAddBottom = ref(false) // 是否需要增加bottom的距离
    let info = store.getters.userInfo?.user

    const userInfo = reactive({
      headPic: info.headPic,
      name: info.name || info.nickName,
      position: info.extensionMap?.agent_role
    })
    // 将头像转换为base64
    getURLBase64(info.headPic).then(res => {
      avatarImg.value = res
    })
    getURLBase64(jcImgBanner).then(res => {
      bgImg.value = res
    })
    onMounted(() => {
      bus.emit('refreshNav') //  避免navBar偶尔无法正确定位
      setSimiTop()
    })
    // 设置半圆的top
    function setSimiTop () {
      let top = document.querySelector('.line').getBoundingClientRect().top
      simiTop.value = top - 24 + 'px'
    }
    function handleDownload () {
      if (generateImg.value && window.isWeixin) {
        showGenerateImg.value = true
        return
      }
      bus.emit('show-custom-loading')
      html2canvas(document.querySelector('.poster'))
        .then(canvas => {
          // 转成图片，生成图片地址
          const imgUrl = canvas.toDataURL('image/png')
          generateImg.value = imgUrl
          showGenerateImg.value = true
          bus.emit('hide-custom-loading')
        })
        .catch(() => {
          bus.emit('hide-custom-loading')
        })
    }
    // todo 比较卡片高度和屏幕高度
    function judgeScreenHeightAndCardHeight () {
      setTimeout(() => {
        const screenHeight = document.documentElement.clientHeight
        const cardHeight = document.querySelector('.poster').offsetHeight
        if (screenHeight - cardHeight < 100) {
          needAddBottom.value = true
        }
      }, 20)
    }
    function bgImgLoad () {
      setSimiTop()
      judgeScreenHeightAndCardHeight()
    }
    // 隐藏遮罩
    function handleHide () {
      showGenerateImg.value = false
    }
    function generateQrcodeFn () {
      if (Storage.get('qrcode_' + info.userCode)) {
        qrcodeImg.value = Storage.get('qrcode_' + info.userCode)
        return
      }
      // 生成中间的二维码
      generateQrcode({
        promoUid: info.userCode,
        nickName: info.nickName,
        configCode: GENRATE_QRCODE_PARAM.configCode
      }).then(res => {
        QRCode.toDataURL(res.data.url, (err, url) => {
          if (!err) {
            qrcodeImg.value = url
            Storage.set('qrcode_' + info.userCode, url) // 缓存到storage里面
          }
        })
      })
    }
    generateQrcodeFn()
    return {
      bgImg,
      downLoadIcon,
      userInfo,
      qrcodeImg,
      card,
      handleDownload,
      generateImg,
      loaded,
      hideMaskIcon,
      showGenerateImg,
      handleHide,
      simiTop,
      show,
      bgImgLoad,
      needAddBottom,
      avatarImg
    }
  },

  components: {
    [Loading.name]: Loading
  }
}
</script>

<style lang="less" scoped>
.bg-img {
  width: 100%;
}
.extension {
  // margin-bottom: 20px;
  // overflow-y: auto;
  position: relative;
  width: 100%;
  overflow: hidden;
  &.needAddBottom {
    overflow: auto;
    margin-bottom: 50px;
  }
  .download-poster {
    position: absolute;
    z-index: 100;
    padding: 6px 12px;
    right: 40px;
    top: 40px;
    border-radius: 15px;
    color: #fff;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.5);
    .download-icon {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      line-height: 16px;
      vertical-align: middle;
    }
  }
}
.poster-wrap {
  position: relative;
  overflow: hidden;
  margin: 24px;
  border-radius: 8px;
  background-color: transparent;
  .left-simi-round,
  .right-simi-round {
    // top: 55.07vw;
    position: absolute;
    z-index: 100;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #f5f5f5;
  }
  .left-simi-round {
    left: 0;
    transform: translate(-50%, -50%);
  }
  .right-simi-round {
    right: 0;
    transform: translate(50%, -50%);
  }
}
.poster {
  position: relative;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  background-color: #fff;
  &.filter {
    user-select: none;
    filter: blur(5px);
  }
  .user-info {
    margin: -20px 24px 0;
    padding-bottom: 15px;
    .avatar {
      position: relative;
      // z-index: 100;
      margin-right: 16px;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #ffffff;
      img {
        width: 72px;
        height: 72px;
        // object-fit: cover;
      }
    }
    .right {
      .name {
        margin-bottom: 8px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        line-height: 20px;
        color: #000000;
      }
    }
    .position {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #969799;
      line-height: 18px;
    }
  }
  .line {
    width: calc(100% - 48px);
    position: relative;
    margin: 0 24px;
    border-bottom: dashed 1px #fee;
  }
  .qrcode-part {
    margin-top: 16px;
    text-align: center;
    position: relative;
    .title {
      margin-bottom: 4px;
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 24px;
      .red {
        color: #c3252d;
      }
    }
    .desc {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
    .qrcode {
      font-size: 0;
      position: relative;
      height: 176px;
      img {
        width: 176px;
        height: 176px;
      }
      .qr-logo {
        position: absolute;
        width: 32px;
        height: 32px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 4px;
        border: solid 1px #eee;
      }
    }
    .scan {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
    .jc-logo-wrap {
      margin-top: 7px;
      height: 40px;
      .jc-logo {
        width: 141px;
      }
      background-color: var(--theme-color);
    }
  }
}
.generate-img-wrap {
  position: fixed;
  width: 100%;
  padding-top: 72px;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  z-index: 150;
  user-select: none;
  .generate-img {
    width: 80%;
  }
  .hide-mask-icon {
    position: absolute;
    top: 32px;
    right: 44px;
    width: 24px;
    height: 24px;
  }
}
</style>
