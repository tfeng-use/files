<!-- 搜索父组件 -->
<template>
  <section flex="cross:center wrap:wrap" class="search_container">
    <template v-for="item in searchComp">
      <div class="mr16 mt8" v-if="item.show">
        <span class="pr8">{{ item.label }}</span>
        <component
          :is="item.component"
          :item="item"
          :styles="item.styles"
          :is-reset="isReset"
          :placeholder="item.placeholder"
          :selectArray="item.array"
          @change="val => handleDataChange(item.key, val)"
        ></component>
      </div>
    </template>
    <div class="mr16 mt8">
      <a-button class="mr8" type="primary" @click.stop="handleSearch">{{
        searchText
      }}</a-button>
      <a-button @click.stop="reset">{{ resetText }}</a-button>
    </div>
  </section>
</template>

<script>
import inputSearch from './inputSearch'
import selectSearch from './selectSearch'
import dateSearch from './dateSearch'
import dateRange from './dateRange'
export default {
  name: 'RSearch',
  props: {
    searchComp: {
      type: Array,
      default () {
        return [
          {
            show: false,
            array: [], // 如果是select 下拉数据
            label: '', // label名字
            key: '', // 数据key
            component: '', // 组件名
            placeholder: '' // 占位文案
          }
        ]
      }
    },
    searchText: {
      type: String,
      default: '查询'
    },
    resetText: {
      type: String,
      default: '重置'
    }
  },
  components: {
    inputSearch,
    selectSearch,
    dateSearch,
    dateRange
  },
  data () {
    // 这里存放数据
    return {
      params: {},
      isReset: false
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 子组件数据收集
    handleDataChange (key, val) {
      this.$emit(
        'search',
        Object.assign(this.params, {
          [key]: val
        })
      )
    },
    handleSearch () {
      this.isReset = false
      this.$emit('on-click-search', this.params)
    },
    reset () {
      this.isReset = true
      this.searchComp.forEach(item => {
        Object.assign(this.params, {
          [item.key]: ''
        })
      })
      const timer = setTimeout(() => {
        this.isReset = false
        clearTimeout(timer)
      }, 100)

      this.$emit('on-reset', this.params)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    this.searchComp.forEach(item => {
      Object.assign(this.params, {
        [item.key]: ''
      })
    })
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {}
}
</script>
<style lang="less" scoped></style>
