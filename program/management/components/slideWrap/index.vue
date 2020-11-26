<template>
  <div>
    <transition name="slideWrap" @after-enter="transitionComplete">
      <div v-if="insedShow" class="slide-part" :style="slide_style">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import bus from '@bus'
export default {
  props: {
    show: Boolean,
    item: Object
  },
  data () {
    return {
      insedShow: false,
      slide_style: ''
    }
  },
  mounted () {
    this.insedShow = this.show // 必须要在mounted里面，因为这时transition才会存在
    const arr = document.querySelectorAll('.slide-part')
    if (arr && arr.length) {
      this.slide_style = 100 + `z-index:${arr.length}`
    }
  },
  methods: {
    transitionComplete () {
      this.$emit('transitionend')
      bus.$emit('slideWrapTransitionend', this.item)
    }
  },
  watch: {
    show (val) {
      this.insedShow = val
    }
  }
}
</script>

<style scoped lang="less">
.slide-part {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  z-index: 100;
  background-color: rgb(255, 199, 199);
}
.slideWrap-enter-active,
.slideWrap-leave-active {
  opacity: 1;
  transition: all 0.3s;
}
.slideWrap-enter,
.slideWrap-leave-to {
  transform: translateX(30%);
  opacity: 0;
}
.slideWrap-enter-to,
.slideWrap-leave {
  transform: translateX(0);
  opacity: 1;
}
</style>
