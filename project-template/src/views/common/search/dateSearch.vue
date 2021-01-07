<!-- 日期搜索框 -->
<template>
  <a-month-picker
    v-model="showValue"
    @change="val => handleSearch(val ? $moment(val).format('YYYY-MM') : '')"
    format="YYYY-MM"
    :placeholder="placeholder"
    style="width: 200px"
  />
</template>

<script>

export default {
  components: {},
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    isReset: Boolean
  },
  data () {
    // 这里存放数据
    return {
      showValue: null
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    isReset (val) {
      if (val) {
        this.showValue = null
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

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {

  }
}
</script>
<style lang='less' scoped>
</style>
