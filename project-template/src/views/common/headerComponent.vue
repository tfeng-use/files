<!-- 自定义页头 通常用在列表页面 -->
<template>
  <h1 class="header-list_container" flex="cross:center main:justify">
    <div>
      <span>{{title}}</span>
    </div>
    <slot></slot>
  </h1>
</template>

<script>

export default {
  name: 'RHeader',
  props: ['title'],
  components: {},
  data () {
    // 这里存放数据
    return {

    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {

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
  .header-list_container{
    font-size: 20px;
  }
</style>
