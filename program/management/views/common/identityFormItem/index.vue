<!-- 商家类型 外层要是 form 表单 -->
<template>
  <div class='identity-container'>
    <a-row>
      <a-col :span="24">
        <a-form-item  label="商家类型" :label-col="{ span: 3 }" :wrapper-col="{ span: 21}">
          <a-radio-group :options="identityArray" :disabled="disabled" v-decorator="['identity', { initialValue: identityComp, rules: [{ required: true, message: '请选择商家类型' }]}]" @change="handleIdentityChange"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="business-right_container" v-if="storeRights.length !== 0">
      <a-col :span="24">
        <a-form-item  label="权益预览" :label-col="{ span: 3 }" :wrapper-col="{ span: 21}">
          <div class ="right-preview p16">
            <!-- <h6 style="line-height:16px" class="color_text_minor pb16 fs14 font_bold">权益预览</h6> -->
            <div>
              <div class="right-preview-store mr16">
                <div class="right-item pl16 pr16">商家店铺权益</div>
                <div class="right-item pl16 pr16" v-for="item in storeRights">{{item.label + (item.value ? ':' : '')}}<span class="color_info" v-if="item.value">{{item.value}}</span></div>
              </div>
              <div class="right-preview-store">
                <div class="right-item pl16 pr16">交易权益</div>
                <div class="right-item pl16 pr16" v-for="item in tradeRights">{{item.label + (item.value ? ':' : '')}}<span class="color_info" v-if="item.value">{{item.value}}</span></div>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import honorType from './honerTypes'
export default {
  props: ['identity', 'disabled', 'hasHover'],
  components: {},
  data () {
    // 这里存放数据
    return {
      identityArray: this.$const('userType'),
      identitySelected: 1,
      storeRights: [],
      tradeRights: [],
      honorType,
      identityComp: null
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {
    identityComp (val) {
      const storeRights = this.honorType[Number(val) - 1].storeRights
      const tradeRights = this.honorType[Number(val) - 1].tradeRights
      const arr = []
      const arrTrade = []
      for (const i in storeRights) {
        arr.push({
          label: i,
          value: storeRights[i]
        })
      }
      for (const i in tradeRights) {
        arrTrade.push({
          label: i,
          value: tradeRights[i]
        })
      }
      this.storeRights = arr
      this.tradeRights = arrTrade
    }
  },
  // 方法集合
  methods: {
    handleRadioMouseOver (index) {
      this.identityComp = index + 1
    },
    handleRadioMouseOut () {
      this.identityComp = JSON.parse(JSON.stringify(this.identitySelected))
    },
    handleIdentityChange (e) {
      this.identityComp = e.target.value
      this.identitySelected = e.target.value
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {

  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    const identity = this.identity ? JSON.parse(JSON.stringify(this.identity)) : 1
    this.identityArray.splice(4, 1)
    this.identityComp = identity + ''
    this.identitySelected = identity + ''
    // 添加按钮的鼠标移入移出效果
    if (this.hasHover) {
      document.querySelectorAll('.identity-container .ant-radio-wrapper').forEach((item, index) => {
        item.addEventListener('mouseover', e => {
          e.stopPropagation()
          e.target.style = 'color: #bcbcbc;transition: color 0.3s'
          this.handleRadioMouseOver(index)
        })
        item.addEventListener('mouseout', e => {
          e.stopPropagation()
          e.target.style = ''
          this.handleRadioMouseOut(index)
        })
      })
    }
  }
}
</script>
<style lang='less' scoped>
  .identity-container{
    min-height: 560px;
    .business-right_container {
      .right-preview {
        background-color: #fafafa;
        .right-preview-store {
          border: 1px solid #eee;
          width: 295px;
          display: inline-block;
          vertical-align:top;
        }
      }
      .right-item {
        line-height: 43px;
        height: 43px;
        border-bottom: 1px solid #eee;
        font-size:12px;
        color:#222;
        span{
          padding-left: 4px;
        }
        &:first-child {
          font-weight: 600;
        }
        &:nth-child(odd) {
          background-color:#fff;
        }
        &:last-child {
          border-bottom: none
        }
      }
      .ant-form-item-label{
        opacity: 0;
      }
    }
  }
</style>
