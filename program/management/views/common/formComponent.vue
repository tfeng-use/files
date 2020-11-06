<!-- form表单通用 通常用在新增编辑页面 -->
<template>
  <a-form class="form-container w100" flex-box="1" :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 14}" style="overflow:auto">
    <template v-for="(item, index) in list">
      <section v-if="!item.hide" class="detail_section" :key="index">
      <h2 class="section-title" v-if="item.title">{{item.title}}</h2>
      <div v-if="(typeof item.slots !== 'string')" class="section-content" flex="wrap:wrap">
        <template v-for="inner in item.slots">
          <div :style="{width: 100*inner.span/24 + '%'}">
            <a-form-item :label="inner.label">
              <slot :name="inner.slot"></slot>
            </a-form-item>
          </div>
        </template>
      </div>
      <template v-else>
        <slot :name="item.slots"></slot>
      </template>
    </section>
    </template>
  </a-form>
</template>

<script>

export default {
  props: {
    form: null,
    list: Array
  },
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
  created () {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    this.$emit('update:form', this.$form.createForm(this))
  }
}
</script>
<style lang='less' scoped>
  .section-title{
    font-size: 16px;
    margin-bottom: 8px;
    height:32px;
    line-height:32px;
  }
  .section-content{
    width: 100%;
  }
</style>
