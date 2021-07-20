<template>
  <div></div>
</template>

<script>
export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let query = vm.$route.query
      const path = query.path
      delete query.path
      vm.$router.push({
        path: path,
        query
      })
    })
  }
}
</script>
