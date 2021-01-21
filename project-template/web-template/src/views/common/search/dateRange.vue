<template>
  <div flex="cross:center" class="date-range">
    <a-date-picker v-model="start" @change="onChangeStart" style="width: 120px" class="mr8" :placeholder="startHolder"/>
    <a-date-picker v-model="end" @change="onChangeEnd" style="width: 120px" :placeholder="endHolder"/>
  </div>
</template>

<script>
export default {
  name: 'dateRange',
  components: {},
  created () {
  },
  mounted () {
  },
  data () {
    return {
      start: null,
      end: null
    }
  },
  methods: {
    onChangeStart () {
      const start = (this.start && this.$moment(this.start).format('YYYY-MM-DD')) || ''
      const end = (this.end && this.$moment(this.end).format('YYYY-MM-DD')) || ''
      this.$emit('change', `${start}~${end}`)
    },
    onChangeEnd () {
      const start = (this.start && this.$moment(this.start).format('YYYY-MM-DD')) || ''
      const end = (this.end && this.$moment(this.end).format('YYYY-MM-DD')) || ''
      this.$emit('change', `${start}~${end}`)
    }
  },
  props: {
    startHolder: {
      type: String,
      default: '开始时间'
    },
    endHolder: {
      type: String,
      default: '结束时间'
    },
    isReset: Boolean
  },
  watch: {
    isReset (val) {
      if (val) {
        this.start = null
        this.end = null
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .date-range {
    display: inline-block;
  }
</style>
