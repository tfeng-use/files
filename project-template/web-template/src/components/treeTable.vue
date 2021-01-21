<template>
  <div>
    <a-button v-if="!value" type="dashed" @click="addRelation" icon="plus"
      >点击选择</a-button
    >
    <div class="associated-order" v-else>
      <p>{{ params.length }}笔,净重{{ params.netWeight | milliFormat(3) }}克</p>
      <p>
        预估成色{{ params.averagePredictGoldPurity }}%,预估折足{{
          params.predictFullGoldWeight | milliFormat(3)
        }}克
        <span class="color_info cursor_p ml8 d-ib" @click="addRelation"
          >修改</span
        >
      </p>
    </div>

    <a-modal
      title="提纯单"
      @cancel="handleCancel"
      :visible="visible"
      @ok="handleOK"
      :width="1000"
    >
      <p class="fs14 mb24" style="color:#000">
        已选择：{{ temporary.length }}条，净重
        {{ temporary.netWeight | milliFormat(3) }}克，预估成色{{
          temporary.averagePredictGoldPurity
        }}%，预估折足{{ temporary.predictFullGoldWeight | milliFormat(3) }}克
      </p>
      <a-table
        class="mt16 purification-relation-order-table"
        ref="table"
        :columns="orderColumns"
        :rowKey="rowKey"
        :scroll="{ x: 800 }"
        :params="listParams"
        :dataSource="dataSource"
        @selectChange="selectChange"
        :rowSelection="rowSelection"
        :selectedRowKeysDefault="params.checkedIdArr"
        :tablePagination="{
          showSizeChanger: true,
          size: 'middle',
          showTotal: (total, range) => `总共 ${total} 条`
        }"
      >
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { Modal, Button, Descriptions, Table, Icon } from 'ant-design-vue'
import { getUnPurificationDepositedList } from '@api/assets'
import { milliFormat } from '@util'
import { setTimeout } from 'timers'

const orderColumns = [
  {
    title: '订单号',
    width: 240,
    key: 'depositedRecordCode',
    customRender: record => {
      if (record.itemCode) {
        return '--'
      } else {
        return record.depositedRecordCode
      }
    }
  },
  {
    title: '客户',
    key: 'userName',
    customRender: record => {
      if (record.itemCode) {
        return '--'
      } else {
        return record.userName
      }
    }
  },
  {
    title: '品类',
    key: 'categoryName',
    dataIndex: 'categoryName'
  },
  {
    title: '净重重量(克)',
    key: 'inspectWeight',
    align: 'right',
    // customRender: text => `${milliFormat(text, 3)}`
    customRender: record => {
      if (record.itemCode) {
        return milliFormat(record.weight, 3)
      } else {
        return milliFormat(record.inspectWeight, 3)
      }
    }
  },
  {
    title: '价格(元/克)',
    dataIndex: 'price',
    align: 'right',
    customRender: text => `${milliFormat(text)}`
  },
  {
    title: '预估成色',
    dataIndex: 'purity',
    align: 'right',
    customRender: text => (text ? `${+text}%` : '100%')
  },
  {
    // 占位
    title: '',
    width: 48
  },
  {
    title: '下单时间',
    key: 'createTime',
    // dataIndex: 'createTime',
    width: 180,
    customRender: record => {
      if (record.itemCode) {
        return '--'
      } else {
        return record.createTime
      }
    }
  }
]
const KEY = 'id'
export default {
  name: 'RelationOrder',
  components: {
    [Button.name]: Button,
    [Modal.name]: Modal,
    [Descriptions.name]: Descriptions,
    [Descriptions.Item.name]: Descriptions.Item,
    [Table.name]: Table,
    [Icon.name]: Icon
    // Table: Table
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: false,
      isSelected: false,
      dataSource: [],
      listParams: {
        category: '',
        pageNum: 1,
        pageSize: 1000
      },
      temporary: {
        checkedIdArr: [], // 选中idArr
        netWeight: 0, // 总重
        length: 0, // 选中条数
        averagePredictGoldPurity: 0, // 加权预估成色
        predictFullGoldWeight: 0 // 折足净重
      },
      params: {
        checkedIdArr: [], // 选中idArr
        netWeight: 0, // 总重
        length: 0, // 选中条数
        averagePredictGoldPurity: 0, // 加权预估成色
        predictFullGoldWeight: 0 // 折足净重
      },
      dataMap: {}, // 所有数据
      flatData: {}, // 打平itmes
      orderColumns,
      rowKey: KEY,
      selectedRowKeys: [],
      selectedRowKeysCopy: [],
      selectData: [], // 最终生成的数据
      cacheSelectedIncludeWrapOrder: {}, // 通过cache的方式存储选中的项，包含外层order的KEY，在生成列表数据的时候回用到，特别是只选择了item，没有选择order的情况
      isSelectToChange: false, // 是否是单个选择改变造成的change事件
      configPurity: 0 // 配置的百分比
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.$refs.table) {
          // 没办法只有直接改值了 打开的时候
          this.$refs.table.selectedRowKeys = this.params.checkedIdArr
        }
        if (this.isSelect) {
          this.selectedRowKeys = [...this.selectedRowKeysCopy]
        }
        this.temporary = { ...this.params }
      }
    },
    category (val) {
      this.initialValue()
    }
  },
  created () {
    console.log('this.$store.state.goods', this.$store.state.goods)
  },
  computed: {
    rowSelection () {
      return {
        type: 'checkbox',
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onChange,
        onSelect: this.onSelect
      }
    }
  },
  methods: {
    getUnPurificationDepositedList () {
      getUnPurificationDepositedList(this.listParams, ({ data }) => {
        this.dataSource = data.data

        this.dataSource.forEach(item => {
          if (item.items.length === 0) {
            item.items = null
          } else {
            // 防止items的id和外层id重复
            item.items.forEach(subItem => {
              subItem.id = 'item_' + subItem.id
            })
          }
          item.children = item.items
          this.dataMap[item.depositedRecordCode] = item
          this.flatData[item[KEY]] = item
          if (this.flatData[item[KEY]].items) {
            this.flatData[item[KEY]].items.forEach(child => {
              this.flatData[child[KEY]] = child
            })
          }
        })
      })
    },
    addRelation () {
      if (!this.category) {
        this.$message.error('请选择品类')
        return
      }

      this.listParams.category = this.category
      this.getUnPurificationDepositedList()
      this.visible = true
    },
    isSelect (key) {
      return this.selectedRowKeys.includes(key)
    },
    handleOK () {
      this.isSelected = true
      this.params = { ...this.temporary }
      this.selectedRowKeysCopy = [...this.selectedRowKeys]
      this.$emit('input', this.params.length)

      this.visible = false
    },
    handleCancel () {
      this.selectedRowKeys = []
      this.visible = false
    },
    // 生成选中的列表
    generateSelectList () {
      // console.log('this.flatData', this.flatData)
      this.cacheSelectedIncludeWrapOrder = {}
      this.selectedRowKeys.forEach(key => {
        this.cacheSelectedIncludeWrapOrder[key] = true
        if (this.flatData[key].itemCode) {
          // 如果对应的item，那么也将它的父order对应的KEY也加入cacheSelectedIncludeWrapOrder
          const depositedRecordCode = this.flatData[key].depositedRecordCode
          this.cacheSelectedIncludeWrapOrder[
            this.dataMap[depositedRecordCode][KEY]
          ] = true
        }
      })
      // console.log('cacheSelectedIncludeWrapOrder', this.cacheSelectedIncludeWrapOrder)
      const data = JSON.parse(JSON.stringify(this.dataMap))
      const dataKeys = Object.keys(data)
      const result = []
      // 遍历this.dataMap，过滤出选中的内容
      dataKeys.every(key => {
        const order = data[key]
        if (Object.keys(this.cacheSelectedIncludeWrapOrder).length === 0) {
          return false
        }
        if (this.cacheSelectedIncludeWrapOrder[order[KEY]]) {
          // 如果是选中状态
          const items = []
          if (order.items) {
            order.items.forEach(item => {
              if (this.cacheSelectedIncludeWrapOrder[item[KEY]]) {
                // 如果item是选中状态
                items.push(item)
              }
            })
          }
          order.items = items
          result.push(order)
          delete this.cacheSelectedIncludeWrapOrder[order[KEY]]
        }
        return true
      })
      this.selectData = result
    },
    // 生成弹窗要显示的统计数据
    getTemporary () {
      // 总重
      let netWeight = 0
      // 折足重量
      let predictFullGoldWeight = 0

      this.selectData.forEach(order => {
        if (order.items && order.items.length) {
          // 如果选择item，那么结果就是item之和
          order.items.forEach(item => {
            netWeight = +netWeight + item.weight
            const purity = this.generatePurity(item.category, item.purity)
            predictFullGoldWeight += ((+purity ?? 100) * item.weight) / 100
          })
        } else {
          netWeight = +netWeight + order.inspectWeight
          const purity = this.generatePurity(order.category, order.purity)
          predictFullGoldWeight +=
            ((+purity ?? 100) * order.inspectWeight) / 100
        }
      })

      // 净重
      this.temporary.netWeight = netWeight
      // 预估折足
      this.temporary.predictFullGoldWeight = predictFullGoldWeight

      // 预估成色
      let averagePredictGoldPurity = (predictFullGoldWeight / netWeight) * 100
      averagePredictGoldPurity =
        averagePredictGoldPurity > this.configPurity
          ? this.configPurity
          : averagePredictGoldPurity
      averagePredictGoldPurity = averagePredictGoldPurity.toFixed(2)

      this.temporary.averagePredictGoldPurity = isNaN(averagePredictGoldPurity)
        ? 0
        : averagePredictGoldPurity

      this.temporary.length = this.selectData.length
    },
    // 根据规范生成新的成色
    generatePurity (category, checkedGoldPurity) {
      // 在同一个类型下，配置的purity是一致的，比如黄金全是一样、白银也全是一样的
      this.configPurity = this.$store.state.goods?.goodsCategoryItem[
        category
      ]?.purity

      return checkedGoldPurity >= this.configPurity ? 100 : checkedGoldPurity
    },
    // 判断当前单是否有item被选中
    isCurrentOrderHasSomeSelect (record, dom) {
      const order = this.dataMap[record.depositedRecordCode]
      let flag = false
      order.items.every(item => {
        if (this.selectedRowKeys.indexOf(item[KEY]) > -1) {
          flag = true
          return false
        }
        return true
      })
      // 如果没有选中项，那么就应该清除掉单的半选中状态
      if (!flag) {
        this.setStatusFromSelectItem(dom, true)
      } else {
        // 如果有选中项，还是要讲对应的单设置为半选中状态
        this.setStatusFromSelectItem(dom)
      }
    },
    onSelect (record, selected, selectedRows, nativeEvent) {
      // 如果是选中的件&&是选中状态，那么就需要设置单的半选中状态
      if (record.itemCode && selected) {
        // 为了避免与全选冲突，延时一段时间执行
        setTimeout(() => {
          this.setStatusFromSelectItem(nativeEvent.target)
        }, 50)
      }
      this.isSelectToChange = true
      // 如果点击是item，那么判断该单下的每一件是否选中
      if (record.itemCode) {
        if (selected) {
          // 如果只选中
          let flag = true
          const items = this.dataMap[record.depositedRecordCode].items
          items &&
            items.every(item => {
              if (!this.isSelect(item[KEY])) {
                flag = false
                return false
              }
              return true
            })
          // 此时说明全部选中，那么将该单选中
          if (flag) {
            // console.log('这儿是全部选中了')
            const orderKEY = this.dataMap[record.depositedRecordCode][KEY]
            if (!this.isSelect(orderKEY)) {
              this.selectedRowKeys.push(orderKEY)
            }
          }
        } else {
          // 此时是取消
          // 如果该单是选中状态，那么就取消单的选中
          const orderKEY = this.dataMap[record.depositedRecordCode][KEY]
          if (this.isSelect(orderKEY)) {
            const index = this.selectedRowKeys.indexOf(orderKEY)
            this.selectedRowKeys.splice(index, 1)
          }
        }
      } else {
        // 此时说明选中的单，那么将下面的item都选中
        if (selected) {
          const items = this.dataMap[record.depositedRecordCode].items
          // 如果是选中单
          if (items) {
            items.forEach(item => {
              if (!this.selectedRowKeys.includes(item[KEY])) {
                this.selectedRowKeys.push(item[KEY])
              }
            })
          }
        } else {
          // 如果是取消单，将下面的item想都取消
          const items = this.dataMap[record.depositedRecordCode].items
          if (items) {
            items.forEach(item => {
              const index = this.selectedRowKeys.indexOf(item[KEY])
              if (index > -1) {
                this.selectedRowKeys.splice(index, 1)
              }
            })
          }
        }
      }
      this.generateSelectList()
      this.getTemporary()
      // 如果是选中的件&&!选中状态，那么就需要设置单的半选中状态
      if (record.itemCode && !selected) {
        // 为了避免与单取消冲突，延时一段时间执行
        setTimeout(() => {
          this.isCurrentOrderHasSomeSelect(record, nativeEvent.target)
        }, 50)
      }
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      // console.log('selectedRowKeys', selectedRowKeys)
      // 由于普通操作也会触发这个时间，所以这儿针对全选的情况进行特殊处理（通过标志位的方式）
      setTimeout(() => {
        if (this.isSelectToChange) {
          this.isSelectToChange = false
          return false
        } else {
          this.generateSelectList()
          this.getTemporary()
        }
      }, 20)
    },
    // 选中item时设置单的半选中状态
    setStatusFromSelectItem (target, isRemoveIndeterminate) {
      let current = target
      // 找到当前行
      while (!current.classList.contains('ant-table-row-level-1')) {
        current = current.parentNode
      }
      // 找到件对应的单
      while (!current.classList.contains('ant-table-row-level-0')) {
        current = current.previousSibling
      }
      // 找到对应的checkbox
      const checkbox = current.querySelector(
        '.ant-table-selection-column .ant-checkbox'
      )
      if (isRemoveIndeterminate) {
        checkbox.classList.remove('ant-checkbox-indeterminate')
      } else if (!checkbox.classList.contains('ant-checkbox-checked')) {
        // 如果没有选中，说明不是全选状态，将其设置为半选中状态
        checkbox.classList.add('ant-checkbox-indeterminate')
      }
    },
    selectChange (val) {
      this.selectedRowKeys = val

      const checkedIdArr = val
      this.temporary.checkedIdArr = checkedIdArr
    },
    // table数据更新后储存在map里
    initialValue () {
      this.dataMap = {}
      this.checkedIdArr = []
      this.params = {
        checkedIdArr: [], // 选中idArr
        netWeight: 0, // 总重
        averagePredictGoldPurity: 0, // 加权预估成色
        predictFullGoldWeight: 0 // 折足净重
      }

      this.$refs.table.refreshQuery('add')

      this.$emit('input', undefined)
    }
  }
}
</script>

<style lang="less">
@expandDisabledBg: #eee;
.purification-add-inner-table {
  .ant-table-thead {
    display: none;
  }
}
.expand-icon-disabled {
  cursor: not-allowed;
  background-color: @expandDisabledBg;
  color: #aaa;
  &:hover {
    border-color: @expandDisabledBg;
    color: #aaa;
  }
}
</style>

<style lang="less" scoped>
.associated-order {
  line-height: 24px;
}
</style>
