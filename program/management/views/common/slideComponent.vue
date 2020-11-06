<template>
  <component class="slide-component" :is="slideComponent" v-if="slideComponent"></component>
</template>

<script>
import { mapGetters } from 'vuex'
import orderAdd from '@views/sales/component/add'
import orderDetail from '@views/sales/orderDetail'
import orderRepoDetail from '@views/buy/orderRepoDetail'
// import userAudit from '@views/user/user/userAudit'
// import roleDetail from '@views/system/role/roleDetail'
// import customerDetail from '@views/customer/customer/customerDetail'
export default {
  name: 'SlideComponent',
  components: {
    orderDetail,
    orderRepoDetail,
    orderAdd
    // roleDetail,
    // userAudit,
    // customerDetail
  },
  computed: {
    ...mapGetters({
      slideComponent: 'slideComponent'
    })
  }
}
</script>

<style scoped>
.slide-component {
  padding: 0 24px 0px 24px;
  overflow: auto;
}
</style>
