<template>
  <div class="state_tag_container">
    <div v-if="text" flex="cross:center main:center" :class="containerClass" style="padding:0 16px">
      <div :class="circleClass"></div>
      <div>{{text}}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'StateTag',
  components: {},
  created () {
    this.initColor()
  },
  props: {
    type: {
      type: String,
      default: 'success'
    },
    text: {
      type: String,
      default: ''
    }
  },
  watch: {
    text () {
      this.initColor()
    }
  },
  data () {
    return {
      containerClass: {
        state_tag: true,
        fs14: true
      },
      circleClass: {
        circle: true,
        mr8: true
      }
    }
  },
  methods: {
    initColor () {
      this.containerClass = {
        state_tag: true,
        fs14: true
      }
      this.circleClass = {
        circle: true,
        mr8: true
      }
      switch (this.type) {
        case 'success':
          Object.assign(this.containerClass, {
            color_green: true,
            color_green_bg_light: true
          })
          Object.assign(this.circleClass, {
            color_green_bg: true
          })
          break
        case 'error':
          Object.assign(this.containerClass, {
            color_red: true,
            color_red_bg_light: true
          })
          Object.assign(this.circleClass, {
            color_red_bg: true
          })
          break
        case 'warning':
          Object.assign(this.containerClass, {
            color_warning: true,
            color_warning_bg_light: true
          })
          Object.assign(this.circleClass, {
            color_warning_bg: true
          })
          break
        case 'info':
          Object.assign(this.containerClass, {
            color_info: true,
            color_info_bg_light: true
          })
          Object.assign(this.circleClass, {
            color_info_bg: true
          })
          break
        default: break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.state_tag {
  border-radius: 12px;
  border-radius: 12px;
  height: 24px;
  line-height: 24px;
}
.circle {
  height: 7px;
  width: 7px;
  border-radius: 50%;
}
</style>
