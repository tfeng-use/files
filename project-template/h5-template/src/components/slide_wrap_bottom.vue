<template>
  <transition name="slide_wrap_b">
    <aside
      class="slide_wrap_b"
      @click="insedShow = false"
      :style="slide_style"
      v-if="insedShow"
      ref="slide"
    >
      <div class="slide_wrap_b_content" @click.stop>
        <slot></slot>
      </div>
    </aside>
  </transition>
</template>
<style lang="less">
.dui-slide-bbg {
  transition: all 0.3s ease-out;
  transform-origin: bottom center;
}
.dui-slide-bbg-in {
  transition: all 0.3s ease-out;
  transform: scale(0.96);
}
.slide_wrap_b_cancle {
  position: absolute;
  bottom: 90vh;
  left: 16px;
  color: #eee;
  transition: all 0.3s ease-out;
}
.slide_wrap_b {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: all 0.3s ease-out;
  z-index: 99;
  background: rgba(0, 0, 0, 0.5);
}
.slide_wrap_b_content {
  position: absolute;
  // top: 12vh;
  top: 2em;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  transition: all 0.3s ease-out;
  background: #f2f2f2;
  border-radius: 12px 12px 0 0;
}
.slide_wrap_b-enter-active,
.slide_wrap_b-leave-active {
  will-change: transform;
}
.slide_wrap_b-enter,
.slide_wrap_b-leave-to {
  opacity: 0;
  .slide_wrap_b_cancle {
    transform: translate3d(-3em, 0, 0);
  }
  .slide_wrap_b_content {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
<script>
export default {
  mounted () {
    this.zIndex &&
      (this.slideStyle = `${this.slide_style};z-index:${this.zIndex};`)
    this.insedShow = this.show || this.value
  },
  data () {
    return {
      isBack: false,
      insedShow: false,
      slideStyle: ''
    }
  },
  watch: {
    show (val) {
      this.insedShow = val
    },
    value (val) {
      this.insedShow = val
    },
    insedShow (val) {
      if (val) {
        setTimeout(() => {
          document.getElementById('app').appendChild(this.$refs.slide)
          // ----------
          this.$refs.slide.addEventListener(
            'transitionend',
            e => {
              if (e.target === this.$refs.slide) {
                this.$emit('transitionend')
              }
            },
            false
          )
        }, 20)
        // ----------
        const slideLength = document.querySelectorAll('.slide_wrap_b').length
        if (slideLength > 1 && !this.zIndex) {
          this.slideStyle = `${this.slide_style};z-index:${slideLength + 99};`
        }
        // ----------
        const _this = this
        const nowId = `dui_slide_${Date.now()}`
        this.isBack = false
        history.replaceState({ nowId }, '', '')
        history.pushState(null, '', '')
        window.addEventListener(
          'popstate',
          function backFun (event) {
            if (!event || !event.state || !event.state.nowId) {
              console.log(event)
              return
            }
            if (event.state.nowId === nowId) {
              _this.isBack = true
              window.removeEventListener('popstate', backFun)
              _this.$emit('valueChange', false)
              _this.$emit('back')
              if (typeof _this.callBack === 'function') {
                _this.callBack()
              }
            }
          },
          false
        )
      } else {
        if (!this.isBack) {
          window.history.back()
        }
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    callBack: {
      type: Function,
      required: false
    },
    zIndex: {
      type: null
    },
    slide_style: {
      type: null,
      default: ''
    }
  }
}
</script>
