<template>
  <div class="table_page bg_white pb24" flex="dir:top" ref="table_page">
    <div class="flex1 table_wrap" ref="table_wrap">
      <a-table
        v-bind="{ ...$attrs }"
        :bordered="bordered"
        :columns="columns"
        :rowKey="rowKey"
        :loading="loading"
        :dataSource="querySelf ? data : dataSource"
        :pagination="false"
        :size="size"
        :scroll="{ x: scrollX, y: scrollY }"
        :customRow="rowClick"
        :rowSelection="showSelect ? rowSelection : null"
        @change="handleTableChange"
        :class="{ 'table-cursor': rowCanClick }"
      >
        <template #title v-if="$slots.title">
          <slot name="title"></slot>
        </template>
        <template
          #[item.scopedSlots.customRender]="text,record,index"
          v-for="item in slots"
        >
          <slot
            :name="item.scopedSlots.customRender"
            :text="text"
            :record="record"
            :index="index"
          ></slot>
        </template>
        <template #footer v-if="$slots.footer">
          <slot name="footer"></slot>
        </template>
      </a-table>
    </div>
    <div
      v-if="pagination && paginationDefault.total && showPagination"
      ref="pagination"
      flex="cross:center main:justify"
      class="pt16 text-r pagination"
    >
      <div>
        <!-- <a-checkbox
          v-if="data.length && showSelect"
          v-model="checked"
          @change="handleSelectAllChange"
          style="margin-left:22px"
        >全选</a-checkbox>-->
        <!-- <span class="">共 {{ dataLength }} 条</span> -->
      </div>
      <a-pagination
        :pageSizeOptions="paginationDefault.pageSizeOptions"
        :total="+paginationDefault.total"
        showSizeChanger
        :showTotal="(total, range) => `总共 ${total} 条`"
        :pageSize="paginationDefault.pageSize"
        v-model="paginationDefault.current"
        @change="onPaginationChange"
        @showSizeChange="onShowSizeChange"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value !== '100000'">{{ props.value }}条/页</span>
          <!-- <span v-if="props.value === '100000'">全部</span> -->
        </template>
      </a-pagination>
    </div>
  </div>
</template>

<script>
import { hedgeSale, hedgePurchase } from '@js/dealData.js'
export default {
  name: 'RTable',
  props: {
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    // 是否可以点击行
    rowCanClick: {
      type: Boolean,
      default: false
    },
    // 是否有多选
    showSelect: {
      type: Boolean,
      default: false
    },
    // 是否显示loading
    showLoading: {
      type: Boolean,
      default: false
    },
    // 是否展示外边框和列边框
    bordered: {
      type: Boolean,
      default: false
    },
    showPagination: {
      // 是否显示分页
      type: Boolean,
      default: true
    },
    // 修改固定列的
    scrollX: {
      type: Number,
      default: 0
    },
    // 固定头的
    showScrollY: {
      type: Boolean,
      default: false
    },
    // 修改大小用的
    size: {
      type: String,
      default: 'middle'
    },
    // 如果要在table里面请求接口
    queryFunction: {
      default: ''
    },
    dataSource: {
      type: Array,
      default () {
        return []
      }
    },
    pagination: {
      type: null,
      default () {
        return {}
      }
    },
    // 万一请求里面有什么需要加的参数
    params: {
      type: Object,
      default () {
        return {}
      }
    },
    fnName: {
      type: String
    },
    // 页的名称
    startPageName: {
      type: String,
      default: 'pageNum'
    },
    // 标记，可以通过这个标记，处理结果
    mark: {
      type: String
    }
  },
  watch: {
    showLoading (val) {
      this.loading = val
    },
    params: {
      deep: true,
      handler () {
        this.initQuery()
      }
    },
    pagination: {
      deep: true,
      handler (pagination) {
        Object.assign(this.paginationDefault, pagination)
      }
    },
    dataSource () {
      this.initSlotAndScroll()
    }
  },
  created () {
    if (this.pagination) {
      Object.assign(this.paginationDefault, this.pagination)
    }
    this.loading = this.showLoading
    if (this.queryFunction) {
      this.querySelf = true
      // 这儿延时一会儿请求，为了避免请求造成的动画卡顿
      setTimeout(() => {
        this.query()
      }, 200)
    } else {
      // 自带数据
      this.initSlotAndScroll()
    }
  },
  data () {
    return {
      data: [],
      slots: [],
      scrollY: 0,
      querySelf: false,
      selectedRowKeys: [],
      dataLength: 0,
      // checked: false,
      loading: false,
      mouseEnterX: 0,
      mouseEnterY: 0,
      paginationDefault: {
        pageSizeOptions: ['5', '10', '20', '30', '40', '100000'],
        current: 1,
        showSizeChanger: true,
        pageSize: 10
      },
      result: {}
    }
  },
  computed: {
    // 多选
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    initQuery () {
      // 重置选择框
      if (this.selectedRowKeys.length !== 0) {
        this.selectedRowKeys = []
        // this.checked = false
        this.$emit('selectChange', this.selectedRowKeys)
      }
      this.paginationDefault.current = 1
      this.query()
    },
    initSlotAndScroll () {
      this.scrollY = 0
      this.initSlots()
      this.$nextTick(() => {
        this.initScrollHeight()
      })
    },
    query ({
      pageNum = this.paginationDefault.current,
      pageSize = this.paginationDefault.pageSize
    } = {}) {
      return new Promise(resolve => {
        if (!this.queryFunction) {
          return
        }
        this.loading = true
        const obj = {
          ...this.params,
          [this.startPageName]: pageNum,
          pageSize
        }
        // console.log('这儿是请求的数据', obj)
        this.queryFunction(
          obj,
          res => {
            // console.log('这儿是获取的数据', res)
            this.data = res.data.data || res.data
            this.result = res.code ? res : res.data
            // 交易套保中的销售
            if (this.mark == 'hedgeSale') {
              this.data = hedgeSale(res.data.orderList)
            } else if (this.mark == 'hedgePurchase') {
              this.data = hedgePurchase(this.data)
            }
            this.loading = false
            this.dataLength = res.total
            Object.assign(this.paginationDefault, {
              total: res.total || res.data.total || this.data.length
            })
            if (this.mark == 'hedgeSale') {
              this.paginationDefault.total = res.data.orderListTotal
            }

            this.emitData()
            // 数据获取完成后 才能初始化插槽 否则插槽可能无效
            this.initSlotAndScroll()
            resolve()
          },
          ({ msg }) => {
            this.loading = false
          }
        )
      })
    },
    resetListShowPop () {
      this.data.forEach(item => {
        this.$set(item, 'showPop', false)
      })
    },
    // 初始滚动区域高顿
    initScrollHeight () {
      if (!this.showScrollY) {
        return
      }
      let tableTitleHeight = 0 // header高度（如果没有就是0）
      let tableFooterHeight = 0 // header高度（如果没有就是0）
      const tableHeadHeight = 46 // 头部高度
      const tablePageClient = this.$refs.table_wrap // 滚动容器
      if (!tablePageClient) {
        return
      }
      if (this.$slots.title) {
        const tableTitle = tablePageClient.querySelector('.ant-table-title') // header高度
        tableTitleHeight = tableTitle.getClientRects()[0].height // header高度
      }
      if (this.$slots.footer) {
        const tableFooter = tablePageClient.querySelector('.ant-table-footer') // header高度
        tableFooterHeight = tableFooter.getClientRects()[0].height // header高度
      }
      this.scrollY =
        tablePageClient.clientHeight -
        tableHeadHeight -
        tableTitleHeight -
        tableFooterHeight // 中间可滚动区域
      window.onresize = this.$utils.throttle(e => {
        const clientHeight =
          tablePageClient.clientHeight -
          tableHeadHeight -
          tableTitleHeight -
          tableFooterHeight
        if (this.scrollY !== clientHeight) {
          this.scrollY = clientHeight
        }
      }, 500)
    },
    // 初始slot插槽
    initSlots () {
      // 插槽数组 根据clumns 中的 scopedSlots.customRender
      this.slots = this.columns.filter(item => item.scopedSlots)
    },
    emitData () {
      const data = this[this.querySelf ? 'data' : 'dataSource']
      this.$emit('dataRefresh', JSON.parse(JSON.stringify(data)), this.result)
    },
    // 临时修改下数据，比如表格内编辑那种
    // interimChangeData (data) {
    //   this[this.querySelf ? 'data' : 'dataSource'] = data
    // },
    // 刷新table列表方法
    refreshQuery (type) {
      // 删除操作  且当前页只有当前一条
      if (type === 'del' && this.data.length === 1) {
        let current = this.paginationDefault.current
        current -= 1
        // 防止当前页为第0页
        this.paginationDefault.current = current <= 0 ? 1 : current
      } else if (type === 'add') {
        // 新增保存 返回第一页
        this.paginationDefault.current = 1
      }
      this.query()
    },
    // 设置当前列表中其中一项的值
    setList (index, obj) {
      this.data[index] = {
        ...this.data[index],
        ...obj
      }
      setTimeout(() => {
        this.data = JSON.parse(JSON.stringify(this.data))
        this.emitData()
      }, 200)
    },
    // 点击行
    rowClick (record, index) {
      return {
        on: {
          click: event => {
            const e = event || window.event
            if (
              Math.abs(e.x - this.mouseEnterX) > 6 ||
              Math.abs(e.x - this.mouseEnterY) > 6
            ) {
              return false
            }
            this.$emit('rowClick', { record, index })
          },
          mousedown: event => {
            const e = event || window.event
            this.mouseEnterX = e.x
            this.mouseEnterY = e.Y
          }
        }
      }
    },
    // 点击全选
    handleSelectAllChange ({ target: { checked } }) {
      if (checked) {
        // this.queryFunction(
        //   Object.assign(
        //     {
        //       page: 1,
        //       rows: 10000000
        //     },
        //     this.params
        //   ),
        //   ({ data }) => {
        //     // console.log(data);
        //     this.dataLength = data.records
        //     this.selectedRowKeys = data.rows.map(item => item.id)
        //     this.$emit('selectChange', this.selectedRowKeys)
        //   }
        // )
      } else {
        this.selectedRowKeys = []
        this.$emit('selectChange', this.selectedRowKeys)
      }
    },
    // 排序筛选
    handleTableChange (pagination, filters, sorter) {
      // this.selectedRowKeys = []
      // this.$emit('selectChange', this.selectedRowKeys)
      // if (!Object.keys(sorter).length) {
      //   Object.assign(this.params, {
      //     orderByKeywords: '',
      //     orderByType: ''
      //   })
      // } else {
      //   Object.assign(this.params, {
      //     orderByKeywords: sorter.column.orderByKeywords,
      //     orderByType: sorter.order === 'ascend' ? 'ASC' : 'DESC'
      //   })
      // }
      // this.query().then(() => {
      //   this.$emit('sortSuccess',
      //     { orderByKeywords: this.params.orderByKeywords, orderByType: this.params.orderByType })
      // })
    },
    // 在表格中点选择
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      // this.checked = this.selectedRowKeys.length === this.dataLength
      this.$emit('selectChange', this.selectedRowKeys)
    },
    onPaginationChange (page) {
      this.paginationDefault.current = page
      this.query()
      this.$emit('paginationChange', page)
    },
    onShowSizeChange (current, pageSize) {
      this.paginationDefault.pageSize = pageSize
      this.paginationDefault.current = 1
      this.query()
      this.$emit('showSizeChange', pageSize)
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  /*&.is_windows{*/
  /*.table_page{*/
  /*!*定义滚动条宽高及背景，宽高分别对应横竖滚动条的尺寸*!*/
  /*::-webkit-scrollbar {*/
  /*width: 0px;*/
  /*height: 10px;*/
  /*}*/
  /*.ant-table-scroll .ant-table-header {*/
  /*margin-bottom: -10px !important;*/
  /*}*/
  /*}*/
  /*}*/
}
.flex1 {
  flex: 1;
}
.table_page {
  // height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.table_wrap {
  overflow: hidden;
}
.table-cursor .ant-table-tbody {
  cursor: pointer;
}
.pagination {
  // margin-top: 14px;
  min-height: 48px;
}
</style>
