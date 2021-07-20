<template>
  <slide-wrapb
    :value="currentShowCity"
    @valueChange="currentShowCity = value"
    class="city_wrap "
  >
    <div
      class="full_wrap bg_f padding_item fs14 color3"
      flex="dir:top"
      @touchstart="refreshScroll"
    >
      <header class="cancle">
        <span @click="closeCitySelect">取消</span>
      </header>
      <section flex-box="1" v-bscroll="initListScroll" data="addr_mainlist">
        <div>
          <div v-if="cityHistory.length">
            <p class="citys_title fs12">历史访问地址</p>
            <ul class="citys_top_wrap">
              <li
                v-for="(item, index) in cityHistory"
                :key="index"
                @click="choiceCity(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <div>
            <p class="citys_title fs12">热门城市</p>
            <ul class="citys_top_wrap">
              <li
                v-for="(item, index) in hotCity"
                :key="index"
                @click="choiceCity(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <ul class="citys_list_wrap">
            <li
              v-for="(item, index) in citys"
              :key="index"
              :class="item.fleg ? 'city_fleg_wrap' : ''"
              @click="choiceCity(item.name)"
            >
              <span
                :class="`citys_fleg city_fleg_${item.fleg}`"
                v-if="item.fleg"
                >{{ item.fleg }}</span
              >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </section>
    </div>
    <ul
      @touchmove.stop="slideFlegs($event)"
      class="citys_silde_wrap js_citys_slide fs12 color9 text_c"
    >
      <li @click="clickFlege(item)" v-for="item in citysFlegs" :key="item.name">
        {{ item }}
      </li>
    </ul>
  </slide-wrapb>
</template>
<style lang="less">
@import '@/styles/custom.less';
.cancle {
  padding: 10px 0;
  span {
    display: inline-block;
  }
}

.padding_item {
  padding-left: 16px;
  padding-right: 16px;
}
.city_wrap {
  background: #fff;
  z-index: 200;
  // height: 100vh;
}
.citys_title {
  color: @color6;
  padding: 1em 0;
}
.citys_top_wrap {
  display: flex;
  flex-wrap: wrap;
  margin-left: 12px;
  > li {
    display: inline-block;
    width: 30%;
    padding: 0.5em 0;
    margin: 0 3.3% 3% 0%;
    text-align: center;
    background: #f6f6f6;
  }
}
.citys_list_wrap {
  margin-top: 2em;
  li {
    padding: 0.7em 0 0.7em 12px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: -16px;
      height: 1px;
      background: @borderColor;
      transform: scaleY(0.5);
    }
  }
  .city_fleg_wrap {
    padding-top: 50px;
  }
}
.citys_silde_wrap {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  > li {
    padding: 0.1em 2px 0.1em 10px;
  }
}
</style>
<script>
import citys from '@/utils/city.js'
import Storage from 'good-storage'
import slideWrapBottom from '@/components/slide_wrap_bottom.vue'
import { setTimeout } from 'timers'
export default {
  name: 'selectCity',
  created () {
    // document.querySelector("#skeleton_page").classList.add("hide");
    // this.$nextTick(() => {
    //   bus.emit("customizeLoading", true);
    this.init()
    // });
  },
  components: {
    slideWrapb: slideWrapBottom
  },
  props: {
    showCitySelect: Boolean
  },
  data () {
    return {
      citys,
      citysFlegs: [],
      initListScroll: false,
      cityHistory: [],
      hotCity: ['深圳市', '成都市'],
      currentShowCity: this.showCitySelect
    }
  },
  watch: {
    showCitySelect (val) {
      this.currentShowCity = val
    },
    currentShowCity () {
      this.getCityHistory()
      this.refreshScroll()
    }
  },
  methods: {
    getCityHistory () {
      this.cityHistory = Storage.get('cityHistory') || []
      console.log(this.cityHistory)
    },
    changeHistory (name) {
      let city = Storage.get('cityHistory') || []
      city.unshift(name)
      city = Array.from(new Set(city))
      Storage.set('cityHistory', city)
    },
    choiceCity (name) {
      this.$emit('closeCitySelect', name)
      this.changeHistory(name)
    },
    init () {
      this.citys.forEach(element => {
        if (element.fleg) {
          this.citysFlegs.push(element.fleg)
        }
      })
    },
    closeCitySelect () {
      this.$emit('closeCitySelect')
    },
    clickFlege (fleg) {
      this.$scrollObj.addr_mainlist.scrollToElement(
        `.city_fleg_${fleg}`,
        0,
        0,
        0
      )
    },
    slideFlegs (e) {
      const wrap = document.querySelector('.js_citys_slide')
      const wrapHeight = wrap.clientHeight
      const wrapTop = wrap.getBoundingClientRect().top

      const itemLength = this.citysFlegs.length
      const itemHeight = Math.round(wrapHeight / itemLength)

      const touchY = e.touches[0].pageY
      const wrapTouchY = touchY - wrapTop

      const targetIndex = Math.ceil(wrapTouchY / itemHeight)
      const fleg = this.citysFlegs[targetIndex - 1]
      if (fleg) {
        this.$scrollObj.addr_mainlist.scrollToElement(
          `.city_fleg_${fleg}`,
          0,
          0,
          0
        )
      } else {
        if (touchY < wrapTop) {
          this.$scrollObj.addr_mainlist.scrollTo(0, 0)
        } else {
          this.$scrollObj.addr_mainlist.scrollTo(
            0,
            this.$scrollObj.addr_mainlist.maxScrollY
          )
        }
      }
    },
    search () {
      // let content = this.searchAddr
      this.mapGetLan(this.searchAddr)
      // this.addr
    },
    refreshScroll () {
      setTimeout(() => {
        this.initListScroll = !this.initListScroll
      }, 20)
    }
  }
}
</script>
