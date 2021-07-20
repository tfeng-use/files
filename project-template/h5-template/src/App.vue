<template>
  <router-view v-if="ready" v-slot="{ Component }">
    <transition :name="transitionName">
      <component class="component-page" :is="Component" />
    </transition>
  </router-view>

  <!-- 
    vue3里面的keepAlive使用
    <transition :name="transitionName" @after-leave="afterLeave">
      <keep-alive>
        <component
          class="component-page"
          :is="Component"
          v-if="$route.meta.keepAlive"
          :key="$route.path"
        />
      </keep-alive>
    </transition>

    <transition :name="transitionName" @after-leave="afterLeave">
      <component
        class="component-page"
        v-if="!$route.meta.keepAlive"
        :is="Component"
        :key="$route.path"
      />
    </transition> -->

  <div
    v-if="showCustomLoading"
    class="loading-wrap"
    flex="main:center cross:center"
  >
    <van-loading color="var(--color-primary)" />
  </div>
  <NavBar v-if="showNavBar" ref="navBar" />
</template>

<script>
import NavBar from '@/components/navBar'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { ref } from 'vue'
import { Loading, Dialog } from 'vant'
import bus from '@bus'
import { setTimeout } from 'timers'
import { initWxConfig } from '@/utils/weixin.js'
// import { setTimeout } from 'timers'
// import Storage from 'good-storage'
// import { setTimeout } from 'timers'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    NavBar,
    [Loading.name]: Loading
  },
  data () {
    return {
      showNavBar: false
    }
  },
  setup () {
    initWxConfig()
    // const store = useStore()
    // const showNavBar = computed(
    //   () => store.getters.token && Storage.get('userInfo')
    // )
    // function addAMapJs () {
    //   let script = document.createElement('script')
    //   script.src =
    //     'https://webapi.amap.com/maps?v=1.4.14&key=1d23863a9a4ff772f1f2fe4ae866bdca'
    //   document.body.appendChild(script)
    // }
    // addAMapJs()

    const ready = ref(true)
    const router = useRouter()
    const showCustomLoading = ref(false)
    // 如果需要单独的loading,上面那个接口返回后会设置为false
    bus.on('show-custom-loading', () => {
      showCustomLoading.value = true
    })
    bus.on('hide-custom-loading', () => {
      showCustomLoading.value = false
    })
    bus.on('showConfirm', option => {
      Dialog.confirm({
        message: option.text
      }).then(() => {
        option.done(true)
      })
    })
    bus.on('login-out', () => {
      loginOut()
    })
    function loginOut () {
      store.dispatch('user/logout').then(() => {
        router.replace('/login')
      })
    }
    // --block 切换路由-动画
    const transitionName = ref('')
    router.beforeEach(async (to, from, next) => {
      const fromIndex = from.meta?.index
      const toIndex = to.meta?.index
      // navBar.value.$forceUpdate()
      if (fromIndex < toIndex) {
        transitionName.value = 'right2l'
      } else if (fromIndex > toIndex) {
        transitionName.value = 'right2lback'
      } else {
        transitionName.value = ''
      }
      // console.log('transitionName.value ', transitionName.value)
      if (from.path !== to.path) {
        bus.emit('close-slide-wrap')
      }
      next()
    })

    return {
      ready,
      transitionName,
      showCustomLoading
    }
  },
  methods: {
    updateNav (showNav) {
      if (showNav) {
        this.showNavBar = true
        setTimeout(() => {
          bus.emit('refreshNav')
        }, 20)
      } else {
        this.showNavBar = false
      }
    }
  },
  mounted () {
    this.updateNav(this.$route.meta.showNav)
  },
  watch: {
    $route (to, from) {
      // 跳转地图需要保持填写信息的路由
      let cacheInfoPathArr = ['/selectAddr', '/perfectDetail']
      if (
        cacheInfoPathArr.indexOf(to.path) === -1 ||
        cacheInfoPathArr.indexOf(from.path) === -1
      ) {
        this.$store.commit('user/SET_CACHEINFO', null)
      }
      if (to.path !== '/redirectPage') {
        setTimeout(() => {
          this.updateNav(to.meta.showNav)
        }, 200)
      }
    }
  }
}
</script>

<style>
#app {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 14 / 16rem;
  /* background: var(--disabled-color-bg); */
  background: #f5f5f5;

  overflow: auto;
  -webkit-text-size-adjust: none;
}
.component-page {
  height: 100%;
  overflow-y: auto;
  /* display: inline-block; */
}
.loading-wrap {
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
