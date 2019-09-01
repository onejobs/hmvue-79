<template>
  <div class='container'>
      COM-B
      <button @click="fn1()">提交数据给父组件</button>
      <button @click="fn2()">提交数据给COM-A组件</button>
    </div>
</template>

<script>
import eventBus from './eventBus'
export default {
  data () {
    return {
      msg: 'COM-B的数据'
    }
  },
  methods: {
    fn1 () {
      // 提交数据给父组件
      this.$emit('abc', this.msg)
    },
    fn2 () {
      // 传递数据给A组件
      eventBus.$emit('b2a', this.msg)
    }
  }
}
</script>

<style scoped lang='less'></style>
