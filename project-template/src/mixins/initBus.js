import bus from '@bus'
// 初始化的bus函数
export default {
  created () {
    console.log('初始化公用bus函数')
    this.initBus()
  },
  methods: {
    initBus () {
      // 错误提示
      bus.$on('error', (msg) => {
        this.$message.error(msg)
      })
    }
  }
}
