<template>
  <div
    class="loading"
    :class="styleProp ? '' : 'default-style'"
    :style="styleProp"
  >
    <van-loading color="var(--color-primary)" class="van-loading-wrapper" />
  </div>
</template>

<script>
import { Loading } from 'vant'

export default {
  name: 'loading',
  components: {
    [Loading.name]: Loading
  },
  props: {
    styleProp: {
      type: Object,
      function () {
        return {
          height: '100vh'
        }
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.loading {
  position: relative;
  font-size: 18px;
  &.default-style {
    height: 100vh;
  }
  // text-align: center;
  // height: 100vh;
  .van-loading-wrapper {
    position: absolute;
    // height: 100%;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
