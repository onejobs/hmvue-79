<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <!-- 表单 -->
          <el-form label-width="120px">
            <el-form-item label="编号：">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机号：">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称：">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：">
              <el-input v-model="userInfo.intro" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="upload"
          >
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center;font-size:14px">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from '@/components/eventBus'
import store from '@/store'
export default {
  data () {
    return {
      userInfo: {
        name: '',
        intro: '',
        email: '',
        photo: ''
      }
      // imageUrl: null
    }
  },
  created () {
    // 获取个人信息
    this.getUserInfo()
  },
  methods: {
    // 当你选择了图片后触发  有传参
    async upload (result) {
      // console.log(result.file) 就是选中的图片
      // 通过axios和formdata提交图片
      const formData = new FormData()
      // 往formData追加图片
      formData.append('photo', result.file)
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      // 上传成功
      this.$message.success('修改头像成功')
      // 预览
      this.userInfo.photo = data.photo
      // 更新本地存储的头像
      const user = store.getUser()
      user.photo = data.photo
      store.setUser(user)
      // 更新Home组件的头像
      eventBus.$emit('updatePhoto', data.photo)
    },
    async save () {
      const { name, intro, email } = this.userInfo
      await this.$http.patch('user/profile', { name, intro, email })
      // 成功
      this.$message.success('修改用户信息成功')
      // 更新本地存储的用户名称
      const user = store.getUser()
      user.name = name
      store.setUser(user)
      // 更新HOME组件的用户名称
      eventBus.$emit('updateName', name)
    },
    async getUserInfo () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userInfo = data
    }
  }
}
</script>

<style scoped lang='less'></style>
