<template>
  <div class='container'>
    <div>header</div>
    <div><slot name="content" :abc="msg" def="100">content</slot></div>
    <div><slot name="footer">footer</slot></div>

    {{msg}}
  </div>
</template>

<script>
import eventBus from './eventBus'
export default {
  data () {
    return {
      msg: '组件内部数据COM-A'
    }
  },
  created () {
    eventBus.$on('b2a', (data) => {
      this.msg = data
    })
  }
}
</script>

<style scoped lang='less'></style>
