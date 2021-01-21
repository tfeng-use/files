<!-- input搜索框 -->
<template>
  <a-input-search
    ref="search"
    v-model="showValue"
    :placeholder="placeholder"
    allowClear
    class="mr8"
    style="width: 230px"
    @change="handleChange"
    @search="handleSearch"
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
      showValue: ''
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    isReset (val) {
      if (val) {
        this.showValue = ''
      }
    }
  },
  // 方法集合
  methods: {
    handleSearch (val) {
      // console.log(val)
      this.$emit('change', val)
    },
    handleChange () {
      this.$emit('change', this.showValue)
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
