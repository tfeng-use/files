<template lang="html">
    <div class="yui-loading-warpper" v-show="showLoader" :style="styleConfig">
      <a-icon class="yui-loading-icon" :style="{ fontSize: '30px', color: '#08c' }"  type="loading"></a-icon>
    </div>
</template>

<script>
export default {
  data () {
    return {
      showLoader: false,
      styleConfig: {}
    }
  },
  methods: {
    show (config) {
      config && (this.styleConfig = config)
      this.showLoader = true
    },
    hide () {
      this.showLoader = false
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .yui-loading-warpper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        background-size: 30px 30px;
        z-index: 10;
    }
  .yui-loading-icon {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
</style>
