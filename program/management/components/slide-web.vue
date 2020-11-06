<template>
  <transition :name="transitionName" mode="out-in">
    <div
      class="slide-web"
      flex="dir:top"
      :class="{
        wth100: isMobile || wth100,
        'from-parent': fromParent,
        'slide-bottom': slideBottom
      }"
      :style="slideStyleInner"
      v-if="isShow"
      ref="slide"
    >
      <template v-if="need">
        <h1 class="slide-web_header" flex="cross:center">
          <a-icon
            @click.stop="cancel"
            type="left"
            class="back-btn"
            style="color: #999; font-size: 16px; padding-right: 8px"
          ></a-icon>
          <span class="slide-web_title">{{ currentCrumb.name }}</span>
          <stateTag
            class="ml8"
            v-if="currentCrumb.tagType"
            :type="currentCrumb.tagType"
            :text="currentCrumb.tagText"
          />

          <div flex-box="1" class="slide-web_btn">
            <a-button
              @click.stop="generateBarcode"
              v-if="currentCrumb.barcode"
              >{{ currentCrumb.barcode }}</a-button
            >
            <a-button
              v-if="currentCrumb.btnText"
              type="primary"
              @click.stop="handleClick"
              >{{ currentCrumb.btnText }}</a-button
            >
            <!-- 立即处理 -->
            <a-button
              v-if="currentCrumb.quick"
              @click.stop="handlePurchaseClick(PURCHASE_TYPE.quick)"
              >{{ currentCrumb.quick }}</a-button
            >
          </div>
        </h1>
      </template>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { PURCHASE_TYPE } from '@js/table'
import bus from '@bus'
export default {
  name: 'slide-left-web',
  created () {
    this.isShow = this.value
    this.slideStyleInner = this.slideStyle
  },
  mounted () {},
  data () {
    return {
      isShow: false,
      slideStyleInner: '',
      isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(
        navigator.userAgent
      ),
      PURCHASE_TYPE
    }
  },
  methods: {
    cancel () {
      this.$emit('back')
    },
    handleClick () {
      bus.$emit('on-btn-click')
    },
    generateBarcode () {
      bus.$emit('on-generate')
    },
    // 回购按钮点击
    handlePurchaseClick (type) {
      bus.$emit('on-btn-purchase', type)
    }
  },
  props: {
    value: Boolean,
    slideStyle: String,
    zIndex: Number,
    cancelStyle: String,
    wth100: Boolean,
    backIcon: {
      type: Boolean,
      default: false
    },
    need: {
      type: Boolean,
      default: true
    },
    transitionName: {
      type: String,
      default: 'slideLeft'
    },
    fromParent: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    slideBottom () {
      return this.transitionName === 'slideBottom'
    },
    ...mapGetters({
      currentCrumb: 'currentCrumb'
    })
  },
  watch: {
    value (val) {
      this.isShow = val
    },
    isShow (val) {
      if (val) {
        this.$nextTick(() => {
          if (
            window.parent &&
            window.parent.frameElement &&
            window.parent.frameElement.tagName === 'IFRAME'
          ) {
            window.parent.document.body.appendChild(this.$refs.slide)
          } else {
            // 从那个位置滑动出来
            if (this.fromParent) {
              const layout = document.querySelector('.ant-layout-content')
              layout && layout.appendChild(this.$refs.slide)
            } else {
              document.body.appendChild(this.$refs.slide)
            }
          }
          let slideLength = document.querySelectorAll('.slideLeft').length
          // 哪个层级
          if (slideLength > 1) {
            if (this.zIndex) {
              slideLength += this.zIndex
            }
            this.slideStyleInner += `;z-index:${slideLength + 1};`
          }
        })
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.wth100 {
  width: 100%;
}
.slide-web {
  position: fixed;
  top: 49px;
  bottom: 0;
  right: 0;
  left: 24px;
  z-index: 10;
  background: #fff;
  .slide-web_header {
    padding: 24px;
    font-size: 0;
    .back-btn:hover {
      color: var(--color-info);
    }
    .slide-web_title {
      font-size: 20px;
      line-height: 32px;
    }
  }
  &.from-parent {
    position: absolute;
  }
  &.slide-bottom {
    width: auto;
    left: 24px;
    right: 24px;
    top: 49px;
    bottom: 0;
  }
  .cancel {
    position: absolute;
    z-index: 12;
    right: 10px;
    top: 10px;
    font-size: 18px;
    cursor: pointer;
  }
}
.slide-web_btn {
  text-align: right;
  button + button {
    margin-left: 8px;
  }
}
// 左滑
.slideLeft-enter-active,
.slideLeft-leave-active {
  opacity: 1;
  transition: all 0.3s ease;
}
.slideLeft-enter,
.slideLeft-leave-to {
  opacity: 0;
  transform: translate3d(30%, 0, 0);
}
// 下滑
.slideBottom-enter-active,
.slideBottom-leave-active {
  opacity: 1;
  transition: all 0.3s ease;
}
.slideBottom-enter,
.slideBottom-leave-to {
  opacity: 0;
  transform: translate3d(0, 30%, 0);
}
</style>
