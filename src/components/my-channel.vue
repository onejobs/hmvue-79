<template>
  <el-select :value="value" @change="fn" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
// 基础功能：结构  数据  获取
export default {
  name: 'my-channel',
  // value 数据 仅读
  props: ['value'],
  data () {
    return {
      // 当前选择频道ID
      // value: null,
      // 频道选项数据
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    fn (channelId) {
      // channelId 当你清空操作 值是空字符串  改成null
      if (channelId === '') channelId = null
      // 提交父组件
      this.$emit('input', channelId)
    },
    async getChannelOptions () {
      // const {
      //   data: { data }
      // } = await this.$http.get('channels')
      const data = { channels: [{ id: 1, name: 'java' }, { id: 2, name: '前端' }] }
      this.channelOptions = data.channels
    }
  }
}
</script>

<style scoped lang='less'></style>
