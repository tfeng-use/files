<template>
  <div class="waitDeal">
    <img :src="paperclipImg" alt="" class="paper-clip" />
    <div class="title">待办 ({{ list.length }})</div>
    <div class="list" v-if="list.length">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        flex="main:justify cross:center"
      >
        <div class="left">
          <div class="name">{{ item.name }}</div>
          <div class="desc showPoint">
            {{ item.companyName }} {{ item.phone }}
          </div>
        </div>
        <van-button
          plain
          hairline
          round
          type="info"
          color="#C3252D"
          size="mini"
          style="padding: 0 12px"
          @click="handleToPerfect(item)"
          >完善信息</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import paperclip from '@/assets/client_ico_paperclip@2x.png'
export default {
  name: 'waitDeal',
  props: {
    list: Array
  },
  components: {
    [Button.name]: Button
  },
  setup () {
    const paperclipImg = ref(paperclip)
    const router = useRouter()
    function handleToPerfect (item) {
      router.push({
        path: '/perfectDetail',
        query: {
          userCode: item.userCode
        }
      })
    }
    return {
      paperclipImg,
      handleToPerfect
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.waitDeal {
  position: relative;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  background-color: #fff;
  .paper-clip {
    position: absolute;
    right: 16px;
    top: -6px;
    width: 32px;
  }
  .title {
    height: 48px;
    line-height: 48px;
    padding-left: 16px;
    font-size: 16px;
    font-weight: 700;
    color: #323233;
    border-bottom: solid 1px #f5f5f5;
  }
  .list {
    padding: 0 16px;
    .item {
      padding: 11px 0;
      border-bottom: solid 1px #f5f5f5;
      .left {
        max-width: calc(100% - 102px);
        .name {
          font-size: 16px;
          font-weight: 400;
          color: #323233;
          line-height: 20px;
        }
        .desc {
          margin-top: 4px;
          font-size: 14px;
          font-weight: 400;
          color: #969799;
          line-height: 16px;
        }
      }
    }
  }
}
</style>
