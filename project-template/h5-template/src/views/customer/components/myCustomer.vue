<template>
  <div class="myCustomer">
    <div class="title">我的客户</div>
    <div class="list">
      <van-tabs v-model="active" sticky class="my-customer-tab">
        <van-tab
          v-for="(customer, index) in list"
          :key="index"
          :title="`${customer.title} ${customer.list.length}`"
        >
          <EmptyCus v-if="customer.list.length === 0" />
          <div v-else class="list">
            <div
              v-for="(item, index) in customer.list"
              :key="index"
              class="item"
              @click="handleGoDetail(item)"
            >
              <div class="item-title" flex="main:justify cross:center">
                <div class="time">{{ item.createTime }} {{ item.source }}</div>
                <div
                  class="state"
                  :class="{
                    authed: item.authState == 5
                  }"
                >
                  {{ customerAuthState[item.authState] }}
                </div>
              </div>
              <div class="item-content" flex="main:left cross:center">
                <div class="headPic">
                  <img :src="item.headPic || defaultAvatar" alt="" />
                </div>
                <div class="base-msg">
                  <div class="name">{{ item.name }}({{ item.phone }})</div>
                  <div v-if="item.infoFillState === 1" class="desc showPoint">
                    {{ item.companyName }} |
                    {{ item.address }}
                  </div>
                  <div v-else class="desc">
                    未完善门店信息
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Tab, Tabs, Empty, Button } from 'vant'
import EmptyCus from './emptyCus'
import { CUSTOMER_AUTH_STATE } from '@const'
import avatar from '@/assets/avatar.png'

export default {
  name: 'myCustomer',
  props: {
    list: Array
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Empty.name]: Empty,
    [Button.name]: Button,
    EmptyCus
  },
  setup (props, { emit }) {
    const active = ref(0)
    const defaultAvatar = ref(avatar)
    const customerAuthState = ref(CUSTOMER_AUTH_STATE)
    function handleGoDetail (item) {
      emit('handlegoDetail', item)
    }
    return {
      active,
      customerAuthState,
      handleGoDetail,
      defaultAvatar
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.my-customer-tab {
  .van-tabs__nav {
    position: relative;
    width: auto;
    display: block;
    background-color: transparent;
    justify-content: flex-start;
    .van-tab {
      display: inline-block;
      line-height: 44px;
      margin-right: 24px;
      padding: 0;
      &.van-tab--active {
        font-weight: 700;
      }
    }
    .van-tabs__line {
      background: var(--theme-color);
      border-radius: 2px;
    }
  }
  .van-tabs__content {
    margin-top: 16px;
  }
  .van-sticky--fixed {
    padding-left: 32px;
    background-color: #fff;
  }
}
</style>

<style lang="less" scoped>
.myCustomer {
  position: relative;
  .title {
    font-size: 16px;
    font-weight: 700;
    color: #323233;
    border-bottom: solid 1px #f5f5f5;
  }
  .list {
    .item {
      padding: 12px 16px;
      margin-bottom: 8px;
      background-color: #fff;
      border-radius: 8px;
      .item-title {
        .time {
          font-size: 12px;
          font-weight: 400;
          color: #969799;
          line-height: 1em;
        }
        .state {
          font-size: 12px;
          line-height: 1em;
          color: var(--theme-color);
          &.authed {
            color: #969799;
          }
        }
      }
      .item-content {
        margin-top: 12px;
        .headPic {
          margin-right: 8px;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          overflow: hidden;
          background: #ebedf0;
          img {
            object-fit: cover;
            width: 48px;
            height: 48px;
          }
        }
        .base-msg {
          height: 48px;
          max-width: 100%;
          .name {
            font-size: 16px;
            font-weight: 400;
            color: #323233;
            line-height: 20px;
          }
          .desc {
            margin-top: 6px;
            font-size: 14px;
            font-weight: 400;
            color: #969799;
            line-height: 16px;
          }
        }
      }
    }
  }
  p {
    line-height: 40px;
  }
}
</style>
