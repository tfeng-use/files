<template>
  <div class="empty-cus">
    <img :src="defaultCusImg" alt="" />
    <p class="tip">暂无客户，立即去推广吧</p>
    <van-button
      round
      type="danger"
      style="padding: 6px 24px"
      size="small"
      color="#C3252D"
      @click="handleExtension"
      >去推广</van-button
    >
  </div>
</template>

<script>
import { Button } from 'vant'
import { ref } from 'vue'
import defaultCus from '@/assets/default_img_cus@2x.png'
import { useRouter } from 'vue-router'

export default {
  name: 'emptyCus',
  setup () {
    const defaultCusImg = ref(defaultCus)
    const router = useRouter()
    function handleExtension () {
      router.push({
        path: '/extension'
      })
    }
    return {
      defaultCusImg,
      handleExtension
    }
  },
  components: {
    [Button.name]: Button
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.empty-cus {
  padding-bottom: 66px;
  margin-top: 64px;
  text-align: center;
  .tip {
    margin: 16px 0;
    font-size: 14px;
    font-weight: 400;
    color: #969799;
    line-height: 20px;
  }
  img {
    width: 311px;
  }
}
</style>
