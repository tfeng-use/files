<template> </template>

<script>
import bus from '@bus'
import socket from '@js/socket.js'
export default {
  initSocket () {
    socket.init(SOCKET_URL, () => {
      bus.$emit('socket_send', {
        id: xxx,
        code: 1,
        token: 'junit:test',
        type: 1
      })
    })
    bus.$on('socket_on_msg', res => {})
  }
}
</script>
