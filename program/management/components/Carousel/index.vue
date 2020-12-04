<template>
  <div class="carousel">
    <div class="slot-wrapper" ref="listWrapper" :style="style">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const INITINDEX = 1
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    interval: {
      type: Number,
      default: 2000
    },
    duration: {
      type: Number,
      default: 1000
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentIndex: INITINDEX,
      style: {},
      list: [],
      listLength: 0,
      isReset: false,
      isSlideing: false,
      Timer: null
    }
  },
  mounted () {
    this.setChildren()
    // 初始化标志位
    this.setMark()
    // 初始化移动距离
    this.setTranslateX(true)
    // 开始轮播
    if (this.autoPlay) {
      this.autoSlide()
    }
  },
  methods: {
    // 将slot里面的内容前后各复制一个
    setChildren () {
      let wrapper = this.$refs.listWrapper
      const children = wrapper.children
      this.listLength = children.length
      // children.forEach(child => {
      //   wrapper.appendChild(child.cloneNode(true))
      // })
      // 拷贝第一个元素到children的最后
      wrapper.appendChild(children[0].cloneNode(true))
      // 拷贝最后一个元素到children的最前面
      wrapper.insertBefore(
        children[this.listLength - 1].cloneNode(true),
        children[0]
      )
      wrapper.children.forEach(item => {
        item.style.display = 'inline-block'
        item.style.width = '100%'
        item.style.transition = `all ${this.duration / 1000}s`
      })
    },
    getSingleItemWidth () {
      let wrapper = this.$refs.listWrapper
      let item = wrapper && wrapper.children && wrapper.children[0]
      const width = item && item.offsetWidth
      return width
    },
    // 根据current设置移动距离
    setTranslateX (isInit) {
      const width = this.getSingleItemWidth()
      if (!width || this.listLength === 1) {
        clearInterval(this.Timer)
        return
      }
      if (isInit) {
        this.style = {
          transform: `translateX(${-width * 1}px)`
        }
      } else {
        this.isSlideing = true
        this.style = {
          transition: `all ${this.duration / 1000}s`,
          transform: `translateX(${-width * this.currentIndex}px)`
        }
        // 滚动完毕之后马上判断
        this.isNeedTranslateReset()
      }
    },
    // 3 1 2 3 1
    // 是否需要移动复位
    isNeedTranslateReset () {
      setTimeout(() => {
        // 因为前后各加了 INITINDEX（1）个，所以这儿的判断需要加上 INITINDEX
        if (this.currentIndex === this.listLength + INITINDEX) {
          this.currentIndex = INITINDEX
          // 移动完毕之后重新设置标志
          this.setMark()
          this.isReset = true
          const width = this.getSingleItemWidth()
          this.style = {
            transform: `translateX(${-width * INITINDEX}px)`
          }
        }
        this.isSlideing = false
        if (this.autoPlay) {
          this.autoSlide()
        }
      }, this.duration)
    },
    autoSlide () {
      if (this.Timer) {
        clearInterval(this.Timer)
      }
      this.Timer = setInterval(() => {
        setTimeout(() => {
          this.currentIndex++
        }, 20)
      }, this.duration + this.interval)
    },
    // 设置标志
    setMark () {
      let index = this.currentIndex
      let wrapper = this.$refs.listWrapper
      let children = wrapper && wrapper.children
      if (children) {
        children.forEach(item => {
          item.classList.remove('carousel-current')
          item.classList.remove('carousel-active')
          item.classList.remove('carousel-pre')
          item.classList.remove('carousel-after')
        })
        // 为了避免点击下一页整体滚动时造成的样式不一致，在初始索引距离当前索引中间相差一个的时候设置为active
        if (index > INITINDEX + 1) {
          children[INITINDEX].classList.add('carousel-active')
        }
        // 为了避免点击上一页整体滚动时造成的样式不一致，这儿将原始列表最后一个item在距离当前索引相差一个位置时也设置成active
        if (index < this.listLength - 1) {
          children[this.listLength].classList.add('carousel-active')
        }
        // 设置具有标志性的类
        children[index].classList.add('carousel-current')
        children[index + 1] &&
          children[index + 1].classList.add('carousel-after')
        children[index - 1] && children[index - 1].classList.add('carousel-pre')
      }
    },
    // 去下一页
    goNext () {
      if (this.isSlideing) {
        // 只有在轮播图没有滚动的时候点击才有效
        return
      }
      clearInterval(this.Timer)
      console.log('this.timer', this.Timer)
      this.currentIndex++
    },
    // 去上一页
    goPre () {
      if (this.isSlideing) {
        return
      }
      clearInterval(this.Timer) // 只有在轮播图没有滚动的时候点击才有效
      // 3 1 2 3 1
      this.currentIndex--
    }
  },
  watch: {
    currentIndex (val) {
      if (this.isReset) {
        this.isReset = false
        return
      }
      // 此时需要整体往左移动
      let width = this.getSingleItemWidth()
      if (val < 0) {
        // 这儿必须先滚动，然后再设置 currentIndex 的值
        this.style = {
          transform: `translateX(${-width * this.listLength}px)`
        }
        setTimeout(() => {
          this.currentIndex = this.listLength - 1
        }, 20)
        return
      }
      // 当currentIndex发生变化后，设置pre、after、current
      this.setTranslateX()
      this.setMark()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.carousel {
  overflow: hidden;
  .slot-wrapper {
    white-space: nowrap;
    .carousel-pre {
      background-color: pink;
    }
    .carousel-current,
    .carousel-active {
      background-color: rgb(136, 136, 252);
    }
    .carousel-after {
      background-color: rgb(44, 30, 53);
    }
  }
}
</style>
