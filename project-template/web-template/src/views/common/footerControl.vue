<!-- 自定义页脚 通常用在新增编辑页面 -->
<template>
    <section
    flex="cross:center main:right"
    class="footer-control_container pt8 pb8 pl24 pr24 bg_white w100">
      <slot></slot>
    </section>
</template>

<script>

export default {
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
  .footer-control_container{
    bottom:0px;
    width: calc(100% + 48px);
    z-index:999;position: sticky;
    box-shadow: 0 -2px 5px -4px #ccc;
    transform: translateX(-24px);
  }
</style>
