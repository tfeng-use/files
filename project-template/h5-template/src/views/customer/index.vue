<template>
  <div class="customer">
    <loading v-if="isLoading" />
    <template v-else>
      <WaitDeal
        v-if="todoList.length > 0"
        :list="todoList"
        style="margin-bottom: 24px"
      />
      <MyCustomer
        v-if="customer.length"
        :list="customer"
        @handlegoDetail="handlegoDetail"
      />
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import WaitDeal from './components/waitDeal.vue'
import MyCustomer from './components/myCustomer.vue'
import { customerList } from '@/api/customer.js'
import Storage from 'good-storage'
import bus from '@bus'
import { APPCODE, COMPANY_CODE } from '@const'
import { useRouter } from 'vue-router'

export default {
  name: 'Customer',
  props: {
    msg: String
  },
  components: {
    WaitDeal,
    MyCustomer
  },
  setup () {
    let todoList = ref([])
    let customer = ref([])
    let isLoading = ref(true)
    // bus.emit('show-custom-loading')
    const router = useRouter()
    function handlegoDetail (item) {
      router.push({
        path: '/customerDetail',
        query: {
          userCode: item.userCode
        }
      })
    }
    onMounted(() => {
      bus.emit('refreshNav') //  避免navBar偶尔无法正确定位
    })
    customerList({
      userCode: Storage.get('userInfo')?.user?.userCode,
      companyCode: COMPANY_CODE,
      appCode: APPCODE
    })
      .then(res => {
        bus.emit('hide-custom-loading')
        isLoading.value = false
        todoList.value = res.data.todoList
        customer.value = [
          {
            title: '全部',
            type: 'allList',
            list: res.data.allList
          },
          {
            title: '未认证',
            type: 'unAuthList',
            list: res.data.unAuthList
          },
          {
            title: '审核中',
            type: 'auditList',
            list: res.data.auditList
          }
        ]
      })
      .catch(() => {
        bus.emit('hide-custom-loading')
        isLoading.value = false
      })
    return {
      todoList,
      customer,
      handlegoDetail,
      isLoading
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.customer {
  padding: 16px;
  // padding-bottom: 500px;
  padding-bottom: 50px;
  width: 100%;
}
</style>
