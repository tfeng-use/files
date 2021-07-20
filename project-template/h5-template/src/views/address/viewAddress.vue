<template>
  import { setTimeout } from 'timers';
  <div class="va-x">
    <div @click="back" class="va-back">
      <i class="iconfont icon-jinru"></i>
    </div>
    <div id="allmap"></div>
    <div class="va-address" v-if="address">
      <span>{{ address }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'viewAddress',
  components: {},
  created () {},
  mounted () {
    setTimeout(() => {
      this.initMapShow({
        lat: this.$route.query.lat,
        lng: this.$route.query.lng
      })
    }, 20)
  },
  data () {
    return {
      map: null,
      currentCity: '',
      pois: '',
      address: ''
    }
  },
  methods: {
    initMapShow ({ lat, lng }) {
      // 高德API功能
      var marker
      var center = [lng, lat]
      var map = new AMap.Map('allmap', {
        resizeEnable: true,
        center: center,
        zoom: 17
      })
      marker = new AMap.Marker({
        map: map,
        position: center,
        // icon: "https://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
      })
      marker.setMap(map)

      this.address = this.$route.query.address
    },
    back () {
      window.history.back()
    }
  },
  props: {}
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
#allmap {
  height: 100%;
}

.va-back {
  position: absolute;
  z-index: 1;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.12);
  width: 36px;
  height: 36px;
  transform: rotate(180deg);
  top: 16px;
  left: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.va-address {
  position: absolute;
  z-index: 160;
  bottom: 0;
  background-color: rgb(255, 255, 255);
  color: #222;
  padding: 16px 16px;
  left: 0;
  right: 0;
}
</style>
