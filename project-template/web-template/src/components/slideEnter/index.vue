<template>
  <div class="slideWrap">
    <template v-for="module in moduleList">
      <slide-wrap :show="module.show" :key="module.key" :item="module">
        <component :is="module.name" @close="handleClose(module)"></component>
      </slide-wrap>
    </template>
  </div>
</template>

<script>
// slideEnter与SlideWrap是一个组合
import SlideWrap from '../slideWrap/index.vue'
// import PageA from '../pageA/index.vue'
// import PageB from '../pageB/index.vue'
import bus from '@bus'
export default {
  components: {
    SlideWrap
    // 这儿是详情页面
    // PageA,
    // PageB
  },
  data () {
    return {
      moduleList: []
      // module: {}
    }
  },
  created () {
    bus.$on('updateSlide', obj => {
      this.showSlide(obj)
      // this.module = obj
    })
  },
  methods: {
    showSlide (obj) {
      this.moduleList.push({
        ...obj,
        show: true,
        key: Date.now() + '-' + obj.name
      })
    },
    handleClose (module) {
      // 如果有回调
      if (typeof module.close === 'function') {
        module.close()
      }
      module.show = false
      const index = this.moduleList.findIndex(item => {
        return item.key === module.key
      })
      setTimeout(() => {
        this.moduleList.splice(index, 1)
      }, 500)
    },
    close () {
      // this.moduleList.splice(index, 1)
    }
  },
  watch: {
    moduleList () {}
  }
}
</script>

<style scoped lang="less"></style>
