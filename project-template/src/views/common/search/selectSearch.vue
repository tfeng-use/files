<!-- 选择搜索框 -->
<template>
  <a-select
    v-model="showValue"
    :getPopupContainer="triggerNode => triggerNode.parentNode"
    :placeholder="placeholder"
    allowClear
    @change="val => handleSearch(val)"
    :style="styles"
  >
    <a-select-option
      v-for="item in typeof selectArray === 'function'
        ? selectArray()
        : selectArray"
      :value="item.value"
      :key="item.value"
      >{{ item.label }}</a-select-option
    >
  </a-select>
</template>

<script>
export default {
  name: 'inputSearch',
  components: {},
  props: {
    placeholder: {
      type: String,
      default: '不限'
    },
    selectArray: [Array, Function],
    isReset: Boolean,
    styles: {
      type: [String, Object],
      default: 'width: 140px'
    },
    item: Object
  },
  data () {
    // 这里存放数据
    return {
      showValue: undefined
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    isReset (val) {
      if (val) {
        this.showValue = this.item.defaultValue
      }
    }
  },
  // 方法集合
  methods: {
    handleSearch (val) {
      this.$emit('change', val)
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    if (this.item && this.item.defaultValue) {
      this.showValue = this.item.defaultValue
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {}
}
</script>
<style lang="less" scoped></style>
