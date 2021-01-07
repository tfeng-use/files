<template>
  <a-locale-provider :locale="locale">
    <div id="app" class="color_text">
      <router-view></router-view>
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'app',
  created () {
    this.refreshUserInfo()
  },
  data () {
    return {
      locale: zhCN
    }
  },
  methods: {
    refreshUserInfo () {
      // 这儿处理因为刷新造成的vuex里面内容丢失的问题
      const data = this.$storage.get('investUser')
      if (data && !(this.userInfo && this.userInfo.userCode)) {
        const { userInfo } = data
        this.updateUserInfo({
          ...userInfo
        })
      }
    },
    ...mapActions({
      updateUserInfo: 'updateUserInfo'
    })
  },
  computed: {
    ...mapGetters(['userInfo'])
  }
}
</script>
<style lang="less">
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
</style>
