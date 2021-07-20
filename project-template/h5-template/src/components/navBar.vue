<template>
  <div class="footer">
    <div class="footer-tab" flex="cross:center box:mean">
      <div
        class="footer-tab-item"
        flex="dir:top main:center cross:center"
        :class="{ 'current-tab': current === 0 }"
        @click="changeTab(0)"
      >
        <img
          class="nav-icon"
          v-show="current === 0"
          :src="spreadActiveImg"
          alt=""
        />
        <img class="nav-icon" v-show="current !== 0" :src="spreadImg" alt="" />
        <span>推广</span>
      </div>
      <div
        class="footer-tab-item"
        flex="dir:top main:center cross:center"
        :class="{ 'current-tab': current === 1 }"
        @click="changeTab(1)"
      >
        <img
          class="nav-icon"
          v-show="current === 1"
          :src="customerActiveImg"
          alt=""
        />
        <img
          class="nav-icon"
          v-show="current !== 1"
          :src="customerImg"
          alt=""
        />
        <span>客户</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding-bottom: env(safe-area-inset-bottom);
  background: #f6f7f8;
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
}
.footer-tab {
  height: 50px;
  font-size: 14px;
  color: #969799;
  // background-image: var(--theme-btn-bg);
  .current-tab {
    color: var(--theme-color);
  }
  .footer-tab-item {
    font-size: 10px;
    height: 100%;
    position: relative;
  }
  .footer-tab-item + .footer-tab-item {
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      transform: scaleX(0.5);
      border-left: 1px solid var(--theme-text);
    }
  }
}
.tab-icon {
  font-size: 20px;
}
.nav-icon {
  width: 24px;
}
</style>

<script>
import customer from '@/assets/tabbar_ico_customer@2x.png'
import customerActive from '@/assets/tabbar_ico_customer_active@2x.png'
import spreadActive from '@/assets/tabbar_ico_spread_active@2x.png'
import spread from '@/assets/tabbar_ico_spread@2x.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import bus from '@bus'
const routes = ['/extension', '/customer']

export default {
  setup () {
    const router = useRouter()
    const customerImg = ref(customer)
    const customerActiveImg = ref(customerActive)
    let current = ref(0)
    const spreadActiveImg = ref(spreadActive)
    const spreadImg = ref(spread)
    function setCurrent () {
      let splitIndex = location.href.indexOf('#')
      let path = location.href.slice(splitIndex + 1)
      let index = routes.indexOf(path)
      index = index === -1 ? 0 : index
      current.value = index
    }
    onMounted(() => {
      setCurrent()
    })
    function changeTab (index) {
      // 首页
      if (index !== current.value) {
        router.push(routes[index])
      }
      current.value = index
    }
    bus.off('refreshNav')
    bus.on('refreshNav', () => {
      setCurrent()
    })
    return {
      customerImg,
      customerActiveImg,
      spreadActiveImg,
      spreadImg,
      current,
      changeTab
    }
  }
}
</script>
