<template>
  <section class>
    <div
      class="full_wrap bg_f"
      style="z-index: 1"
      flex="dir:top"
      @click="closeSearchPage"
    >
      <!-- <topbar :title="title"></topbar> -->
      <div flex="cross:center" class="addr_wrap">
        <span
          v-show="locationOver"
          class="selectCitySpan"
          @click.stop="showCitySelect"
          flex="cross:center"
        >
          <span>{{ currentCity }}</span>
          <i
            class="iconfont icon-xia fs12"
            style="padding:0 .5em;transform:scale(.5);"
          ></i>
        </span>
        <div
          v-show="locationOver"
          flex-box="1"
          class="showTips"
          flex="cross:center"
          @click.stop
        >
          <div class="mint-searchbar-inner" flex="" style="background:#f2f2f2;">
            <i style="margin-right: 12px;" class="mintui mintui-search"></i>
            <label class="rise_input" flex-box="1">
              <input
                @input="searchTips"
                ref="searchContent"
                v-model="searchAddr"
                placeholder="搜索地点"
                @keyup.enter="searchTips"
              />
            </label>
            <i
              v-show="searchAddr !== ''"
              @click.stop="searchAddr = ''"
              class="search_cancel iconfont icon-quxiao"
            ></i>
          </div>
        </div>
        <span class="cancle">取消</span>
      </div>
      <div class="main-content" flex-box="1" v-show="searchEnd">
        <ul class="searchList" v-if="pois.length">
          <li
            v-for="(item, index) in pois"
            :key="index"
            @click.stop="chooseConfirm(item)"
          >
            <h3>{{ item.name }}</h3>
            <p>{{ item.address }}</p>
          </li>
        </ul>
        <div class="noResult" v-else>
          <h2>找不到地址？</h2>
          <p>请尝试只输入小区、写字楼或学校名，</p>
          <p>详细信息（如门牌号）可稍后输入</p>
        </div>
      </div>
      <div class="main-content" flex-box="1" v-show="!searchEnd">
        <div class="searchHistoryListWrapper" v-if="historyList.length">
          <div class="title">
            <span>历史搜索</span>
            <i class="iconfont icon-shanchu1" @click.stop="clearHistory"></i>
          </div>
          <ul class="searchHistoryList">
            <li
              v-for="(item, index) in historyList"
              :key="index"
              @click.stop="chooseConfirm(item)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="noResult" v-else>
          <h2>暂无搜索历史</h2>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="less" scoped>
@import '~@/styles/custom.less';
.addr_wrap {
  padding: 7px 16px;
  .selectCitySpan {
    font-size: 14px;
    flex-shrink: 0;
  }
  .showTips {
    position: relative;
    overflow: visible;
    z-index: 1;
    .mint-searchbar-inner .mintui-search {
      color: @color6;
      font-size: 16px;
      margin-top: 4px;
    }
    .rise_input {
      display: flex;
      align-items: center;
      input {
        width: 100%;
        background: transparent;
        height: 21px;
        line-height: 21px;
        font-size: 14px;
        &::placeholder {
          font-size: 14px;
        }
      }
    }
    .search_cancel {
      padding: 12px 8px;
      color: @color6;
    }
  }
  .cancle {
    padding-left: 5px;
    font-size: 14px;
    color: @color6;
  }
}
.main-content {
  display: flex;
}
.noResult {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding-top: 100px;
  color: @color6;
  h2 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  p {
    font-size: 12px;
    line-height: 20px;
  }
}
.searchHistoryListWrapper {
  width: 100%;
  padding: 0 16px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    span {
      font-size: 14px;
      color: @color6;
    }
    i {
      padding: 5px;
    }
  }
  .searchHistoryList {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    li {
      padding: 4px 12px;
      background: #f6f6f6;
      margin: 0 10px 10px 0;
      font-size: 14px;
      margin-right: 12px;
    }
  }
}
.searchList {
  padding-left: 10px;
  flex: 1;
  overflow: auto;
  li {
    font-size: 12px;
    color: #666;
    padding: 5px;
    border-bottom: 1px solid @borderColor;
    background: #fff;
    h3 {
      font-size: 14px;
      color: @color1;
      font-weight: bold;
    }
  }
}
</style>
<script>
import bus from '@bus'
import Storage from 'good-storage'
import { Dialog } from 'vant'
export default {
  name: 'selectAddr',
  created () {
    setTimeout(() => {
      this.init()
    }, 20)
  },
  data () {
    return {
      locationOver: true,
      title: '选择地址',
      pois: [],
      searchAddr: '',
      searchEnd: false,
      historyList: [],
      currentCityChoose: ''
    }
  },
  props: {
    currentCity: {
      type: String,
      default: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.searchContent.focus()
    }, 20)
  },
  watch: {},
  components: {},
  methods: {
    closeSearchPage () {
      this.$emit('closeSearchPage')
    },
    showCitySelect () {
      this.$emit('showCitySelect')
    },
    clearHistory () {
      bus.emit('showConfirm', {
        text: '确定删除历史搜索？',
        done: confirm => {
          if (!confirm) return
          this.historyList = []
          Storage.remove('addressHistory')
        }
      })
    },
    getHistory () {
      this.historyList = Storage.get('addressHistory', [])
    },
    // 选择地址
    closeCitySelect (city) {
      if (city) {
        this.currentCityChoose = city
      }
      this.showCitySelect = false
    },
    // 地址选择处理一下是否更新展示地址
    chooseConfirm (item) {
      Dialog.confirm({
        title: '提醒',
        message: '是否更新展示地址信息',
        confirmButtonText: '更新',
        cancelButtonText: '不更新'
      })
        .then(confirm => {
          this.choiceSearchAddr(item, confirm)
        })
        .catch(cancel => {
          this.choiceSearchAddr(item, cancel)
        })
    },
    // 选择提示地址
    choiceSearchAddr (address, type) {
      let index = this.historyList.findIndex(item => {
        return item.id === address.id
      })
      if (index !== -1) {
        this.historyList.splice(index, 1)
      }
      this.historyList.unshift(address)
      Storage.set('addressHistory', this.historyList)
      console.log('发送了')
      bus.emit('choiceAddr', address, type)
      window.history.back()
    },
    init () {
      this.getHistory()
    },
    // 节流防止请求次数过多
    searchTips () {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.requestAddr()
      }, 500)
    },
    requestAddr () {
      this.searchEnd = false
      AMap.plugin('AMap.Autocomplete', () => {
        var autoOptions = {
          city: this.currentCity,
          citylimit: true
        }
        var autoComplete = new AMap.Autocomplete(autoOptions)
        autoComplete.search(this.searchAddr, (status, result) => {
          this.searchEnd = true
          this.pois = result.tips || []
        })
      })
    }
  }
}
</script>
