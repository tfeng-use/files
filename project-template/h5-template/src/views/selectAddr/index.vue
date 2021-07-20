<template>
  <section class>
    <div
      class="full_wrap bg_f"
      flex="dir:top main:justify"
      v-show="!showSearchPage"
    >
      <!-- <topbar :title="title"></topbar> -->
      <div flex class="addr_wrap">
        <span
          class="selectCitySpan"
          @click="showCitySelect = true"
          flex="cross:center"
        >
          <span>{{ currentCity }}</span>
          <i
            class="iconfont icon-xia fs12"
            style="padding:0 .5em;transform:scale(.5);"
          ></i>
        </span>
        <div flex-box="1" class="showTips" flex="cross:center">
          <div
            class="mint-searchbar-inner"
            flex=""
            style="background:#f2f2f2;"
            @click="showSearchPage = true"
          >
            <i style="margin-right: 12px;" class="mintui mintui-search"></i>
            <div class="rise_input" flex-box="1">
              小区/写字楼/学校等
            </div>
          </div>
        </div>
      </div>
      <div flex-box="1" id="allmap"></div>
      <div class="pois_wrap">
        <ul>
          <li
            v-for="(item, index) in pois"
            :key="index"
            @click="choiceAddr(item)"
          >
            <p>{{ item.name }}</p>
            <p class="second-addr">{{ item.address }}</p>
          </li>
        </ul>
      </div>
    </div>
    <search-address
      :currentCity="currentCity"
      @closeSearchPage="showSearchPage = false"
      @showCitySelect="showCitySelect = true"
      v-if="showSearchPage"
    ></search-address>
    <select-city
      :showCitySelect="showCitySelect"
      @closeCitySelect="closeCitySelect"
    ></select-city>
  </section>
</template>

<style lang="less">
.citys_fleg {
  color: #999;
  position: absolute;
  left: 0;
  top: 15px;
  background: #fff;
}
</style>

<style lang="less" scoped>
@color6: #666;
.showTips {
  position: relative;
  overflow: visible;
  z-index: 1;
  ul {
    position: absolute;
    left: 0;
    right: 0;
    top: 28px;
    border-top: 1px solid #e4e6e7;
    height: 60vh;
    overflow: auto;
    li {
      font-size: 12px;
      color: #666;
      padding: 5px;
      border-bottom: 1px solid #e4e6e7;
      background: #fff;
      background: #fff;
      // &:hover{
      //   background:#ebebeb;
      // }
    }
  }
}
.selectCitySpan {
  font-size: 14px;
  flex-shrink: 0;
}
.rise_input {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 14px;
}

.mint-searchbar-inner .mintui-search {
  color: @color6;
  font-size: 16px;
  margin-top: 4px;
}
.mint-searchbar-core {
  height: 30px;
  background: transparent;
}
.search_cancel {
  padding: 12px 8px;
  color: @color6;
}
.addr_wrap {
  padding: 7px 16px;
}
.addr_text_box {
  padding: 0.5em 16px;
  // backgound:;
}
.pois_wrap {
  height: 50vh;
  overflow: auto;
  li {
    padding: 0.5em 12px;
  }
  .second-addr {
    font-size: 13px;
    color: #888;
  }
}

.anchorBL {
  visibility: hidden;
}
</style>
<script>
import bus from '@bus'
import { err } from '@util'
import SelectCity from '@/views/address/selectCity'
import SearchAddress from '@/views/address/searchAddress'

import { Dialog } from 'vant'
export default {
  name: 'selectAddr',
  created () {
    setTimeout(() => {
      // bus.emit("customizeLoading", true);
      this.init()
    }, 20)
  },
  data () {
    return {
      currentCity: '',
      showCitySelect: false,
      title: '选择地址',
      pois: [],
      tips: [],
      map: {},
      currentpoint: {},
      searchAddr: '',
      addr: '',
      showSearchPage: false
    }
  },
  watch: {},
  components: {
    SelectCity,
    SearchAddress
  },
  methods: {
    // 选择地址
    closeCitySelect (city) {
      if (city) {
        this.currentCity = city
      }
      this.showCitySelect = false
    },
    // 选择详细地址
    choiceAddr (item) {
      Dialog.confirm({
        title: '提醒',
        message: '是否更新展示地址信息',
        confirmButtonText: '更新',
        cancelButtonText: '不更新'
      })
        .then(confirm => {
          bus.emit('choiceAddr', item, confirm)
          // this.$root.goBack()
          window.history.back()
        })
        .catch(cancel => {
          bus.emit('choiceAddr', item, cancel)
          // this.$root.goBack()
          window.history.back()
        })
    },
    init () {
      this.longitudeLatitude = this.$route.query.longitudeLatitude
      if (this.$route.query.city) {
        this.currentCity = this.$route.query.city
      }
      this.initAddress = this.$route.query.address
      this.initGeolocationGaode()
    },
    initGeolocationGaode () {
      if (this.longitudeLatitude) {
        // 是否为编辑地址，编辑地址设定搜索条件
        let latAndLng = this.longitudeLatitude.split(',')
        let currentPoint = {
          lat: latAndLng[1],
          lng: latAndLng[0]
        }
        this.initMapShow(currentPoint)
      } else {
        let that = this
        AMap.plugin('AMap.Geolocation', () => {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：5s
            buttonPosition: 'RB', // 定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
          })
          // this.map.addControl(geolocation);
          geolocation.getCurrentPosition(function (status, result) {
            console.log(123, status, result)
            if (status == 'complete') {
              // let position = {
              //   P: 30.586036,
              //   Q: 104.05673100000001,
              //   lat: 30.586036,
              //   lng: 104.056731
              // }
              let position = result.position
              that.initMapShow(position)
            } else {
              err('获取定位失败')
              that.map = new AMap.Map('allmap', {
                resizeEnable: true
              })
              that.map.setCity('成都市')
              that.currentCity = '成都市'
            }
          })
        })
      }
    },
    initMapShow ({ lat, lng }) {
      // 百度地图API功能
      let map = (this.map = new AMap.Map('allmap', {
        resizeEnable: true
      })) // 创建Map实例
      if (lat) {
        // 编辑地址
        map.setZoomAndCenter(16, [lng, lat]) // 初始化地图,设置中心点坐标和地图级别
        AMap.plugin('AMap.Geocoder', () => {
          let geocoder = new AMap.Geocoder({})
          geocoder.getAddress([lng, lat], (status, result) => {
            if (status === 'complete' && result.regeocode) {
              if (result.regeocode.addressComponent) {
                this.currentCity = result.regeocode.addressComponent.city
              }
            } else {
              log.error('根据经纬度查询地址失败')
            }
          })
        })
        let marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: [lng, lat]
        })
        this.initAddrShow({ lat, lng })
        map.add(marker)
      }
    },
    // 获取附近相关地址
    initAddrShow ({ lat, lng }) {
      AMap.plugin('AMap.PlaceSearch', () => {
        let autoOptions = {
          city: '全国',
          type:
            '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'
        }
        let cpoint = [lng, lat]
        let placeSearch = new AMap.PlaceSearch(autoOptions)
        placeSearch.searchNearBy('', cpoint, 200, (status, result) => {
          this.pois = (result.poiList && result.poiList.pois) || []
        })
      })
    }
  }
}
</script>
