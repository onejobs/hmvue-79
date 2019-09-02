## DAY06-黑马头条PC

### 01-反馈

| 姓名 | 意见或建议                                                   |
| ---- | ------------------------------------------------------------ |
| ***  | 叔叔 标签上绑定事件的时候 什么时候加括号比如 @click="serch()" 什么时候不加括号 @click="serch" 什么时候要加@click.native="serch" native是组件不支持这个事件的时候才加 是吧 |
| ***  | 叔叔，这个Vue项目东西怎么那么多啊                            |
| ***  | 听的dei劲，敲de费劲                                          |
| ***  | 大家好我叫陈银凤！下面我给大家唱首歌: 大河向东流 ，天上的星星...............不会了！！！！！ |
| ***  | 之前的老师的确没讲过的知识，某些同学总是不止一次说讲过。结果呢老师还是看出来大家不会，老师没讲过，又重新讲。你梦里周公给你讲的吧。不知道的请闭嘴，别瞎喝可以吗？讲过就是讲过，没讲过就说不知道没啥丢人的。瞎喝可耻。。。 |
| ***  | vue中添加事件绑定有的只有函数名，有的是函数名后边加括号。只有函数名代表函数本身？后边加括号代表调用这个函数？他们的区别是在传参的时候吗？或者是说在运用第三方组件上面？他们的区别是什么？希望老师解惑--！ |
| ***  | 频道组件封装和那个子传父和搜索这几块没太听懂，               |
| ***  | 自己练习的时候还是思路不清晰，错误百出。。                   |
| ***  | 长空令下，余孽不存                                           |
| ***  | 为什么只有13911111111的账号可以显示文章                      |

- 事件绑定函数的时候，() 什么时候加？
  - 如果是自己来传参数，你需要加上  fn(‘数据’)
  - 如果是组件给的默认传参，不加。
- native使用场景：组件不支持事件，当给组件绑定原生的dom事件。

### 02-回顾

- 内容管理
  - 频道下拉
  - 列表渲染
  - 分页功能
  - 筛选功能
    - 修改时间
  - 删除功能
    - js最大安全值  json-bigint
    - 无响应内容   易出错代码最好使用try{}catch(){}
  - 编辑功能
    - query传参

### 03-频道组件封装-准备知识

- 父传子
  - 在子组件使用 props 选项接收父组件的数据。

```html
<!-- 父组件 -->
<template>
	<div><com-child :value="父组件数据"></com-child></div>
</template>
```

```html
<!-- 子组件 -->
<template> 
    <div>
    	{{value}}
    </div>
</template>
<script>
    export default {
        // 父传子数据特点  只读
        props:['value']
    }
</script>
```

- 子传父
  - 首先：在父组件，使用子组件的位置，给子组件绑定一个自定义事件
  - 然后：在子组件，触发这个事件，触发同时给这个事件绑定的函数传参
  - 最后：事件绑定的函数在父组件，接收到传参后意味得到了子组件的数据

```html
<!-- 父组件 -->
<template>
	<div><com-child @input="fn"></com-child></div>
</template>
```

```html
<!-- 子组件 -->
<template> 
    <div>
        <button @click="submit()"></button>
    </div>
</template>
<script>
    export default {
        methods:{
            submit () {
                this.$emit('input','子组件数据')
            }    
        }
    }
</script>
```

```js
// 父组件代码
 methods:{
     fn (data) {
         // 获取子组件提交的数据  data
         // 怎么使用data和你的业务有关系
     }    
 }
```

- v-model语法糖
  - 双向数据绑定指令，实现：赋值，修改值。
  - 假设数据：data(){return{msg:'hi vue'}}
  - 赋值： `<input :value="msg"  />`
  - 改值： `<input @input="msg=当前表单元素的值" >`
  - v-model的本质：绑定的value属性和绑定了一个input事件。



### 04-频道组件封装-实现

- 内部功能的实现  components/my-channel.vue 组件

```html
<template>
  <el-select v-model="value" placeholder="请选择" clearable>
    <el-option v-for="item in channelOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
// 基础功能：结构  数据  获取
export default {
  name: 'my-channel',
  data () {
    return {
      // 当前选择频道ID
      value: null,
      // 频道选项数据
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
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

```

全局注册：components/index.js

```diff
import MyBread from '@/components/my-bread'
+import MyChannel from '@/components/my-channel'
export default {
  install (Vue) {
    Vue.component(MyBread.name, MyBread)
+    Vue.component(MyChannel.name, MyChannel)
  }
}

```



- v-model指令功能
  - 父传子：`:value`
  - 子传父：`@input`

父组件：

```html
<!-- 封装的组件 :value="reqParams.channel_id"  @input="reqParams.channel_id=接受数据" -->
<my-channel v-model="reqParams.channel_id"></my-channel>
```

子组件：

接受父组件数据

```js
// value 数据 仅读
props: ['value'],
```

```html
<el-select :value="value" 
```

选择过频道数据后，把频道ID提交父组件

```html
<el-select @change="fn"
```

```js
fn (channelId) {
    // channelId 当你清空操作 值是空字符串  改成null
    if (channelId === '') channelId = null
    // 提交父组件
    this.$emit('input', channelId)
},
```



###05-素材管理-基础布局

路由：router/index.js

```js
import Image from '@/views/image' 
{ path: '/image', name: 'image', component: Image }
```

组件：views/image/index.vue

```html
<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <!-- 按钮盒子 -->
      <div class="btn_box">
        <el-radio-group v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button style="float:right" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 图片列表 -->
      <div class="img_list">
        <div class="img_item" v-for="item in 10" :key="item">
          <img src="../../assets/images/avatar.jpg" alt />
          <div class="option">
            <span class="el-icon-star-off" :class="{red:item===3}"></span>
            <span class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination style="text-align:center" background layout="prev, pager, next" :total="1000"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reqParams: {
        // false 全部  true 收藏
        collect: false,
        page: 1,
        per_page: 10
      }
    }
  }
}
</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 160px;
    height: 160px;
    border: 1px dashed #ddd;
    position: relative;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .option {
      width: 100%;
      height: 30px;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 0;
      bottom: 0;
      color: #fff;
      text-align: center;
      line-height: 30px;
      span {
        margin: 0 30px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>

```

###06-素材管理-图片列表渲染

- 当组件初始化完毕
  - 发获取素材列表请求
  - 得到数据后赋值 images
  - 渲染列表

```html
<!-- 图片列表 -->
      <div class="img_list">
        <div class="img_item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="option">
            <span class="el-icon-star-off" :class="{red:item.is_collected}"></span>
            <span class="el-icon-delete"></span>
          </div>
        </div>
      </div>
```

```js
 // 列表数据
 images: []
```

```js
created () {
    this.getImages()
  },
  methods: {
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
    }
  }
```

### 07-素材管理-分页功能实现

el-pagination 组件属性或事件

- total 总条数
- page-size 一页的条数
- current-page 选中页码
- @current-change  页码改变后事件

```html
<!-- 分页 -->
      <el-pagination
      style="text-align:center"
      background layout="prev, pager, next"
      :total="total"
      :page-size="reqParams.per_page"
      :current-page="reqParams.page"
      @current-change="changePager"
      ></el-pagination>
```

```js
// 总条数
total: 0
```

```js
 changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
```



###08-素材管理-全部与收藏切换

- 监听用户的切换行为（radio组件的值改变事件）
  - 看事件的名称：change
  - 传参：选中的label的值  （v-model反馈 reqParams.collect）
  - 当筛选条件改变后：页码设置第一页
  - 重新查询即可

```html
<el-radio-group @change="changeCollect"
```

```js
// 切换了全部收藏
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
```

分页小于2页，隐藏分页组件：

```diff
 <el-pagination
      style="text-align:center"
      background layout="prev, pager, next"
      :total="total"
      :page-size="reqParams.per_page"
      :current-page="reqParams.page"
      @current-change="changePager"
+      hide-on-single-page
      ></el-pagination>
```



###09-素材管理-收藏素材

- 点击收藏图标
  - 如果，状态是未收藏，操作：添加收藏
  - 反之，取消收藏
  - 发请求
    - 成功：图片的状态是 收藏 图标红色  取消收藏  图标白色

```html
<span @click="toggleCollect(item)" class="el-icon-star-off" :class="{red:item.is_collected}"></span>
```

```js
// 切换图片状态
    async toggleCollect (item) {
      // 提交给后台的状态  说白就是当状态的取反
      const { data: { data } } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 操作成功（取消收藏成功  添加收藏成功）
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
      // 更新列表（重新获取后台数据进行更新） 后端有排序 收藏的图片靠前排序
      // 更新当前图片的数据 数据驱动视图 更新图标颜色
      item.is_collected = data.collect
    },
```





###10-素材管理-删除素材

- 点击删除图标
  - 获取当前图片的ID
  - 发送删除请求
  - 成功：提示+更新列表

```html
<span @click="delImage(item.id)" class="el-icon-delete"></span>
```

```js
 // 删除图片
    delImage (id) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`user/images/${id}`)
        // 成功
        this.$message.success('删除图片成功')
        this.getImages()
      }).catch(() => {
      })
    },
```



###11-素材管理-添加素材

- 点击添加素材时候
  - 显示对话框组件（上传图片组件）
  - 点击上传图片
    - 选择图片，确认选择之后，上传图片给后台
    - 响应图片的地址给前端，进行预览（提示上传成功）
    - 2s之后，自动关闭对话框，回到第一页更新列表。

准备对话框：

```html
 <!-- 对话框 -->
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <!-- 上传组件 -->
      上传组件
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
```

```js
 // 控制对话框的显示与隐藏
 dialogVisible: false
```

```html
<el-button @click="openDialog()" style="float:right" type="success" size="small">添加素材
```

```js
// 打开对话框
openDialog () {
    this.dialogVisible = true
    // 完成其他业务
},
```

准备上传组件：

- 需要把样式写在 styles/index.less

- action  上传图片的地址
  - 上传请求是el-upload组件发送，需要使用完整地址。
- headers   在头部携带token
  - Authorization :  'Bearer ' + store.getUser().token
- on-success 上传成功的钩子函数（回调函数）
  - 绑定上传图片成功的处理函数
- 数据：imageUrl
  - 有值，进行图片预览
  - 没值，显示上传图标
- 上传图片的字段名称默认的是file
  - 根据接口的需要去修改（image）
  - el-upload的属性  name

```html
<!-- 上传组件 -->
<el-upload
           class="avatar-uploader"
           action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
           :headers="headers"
           name="image"
           :show-file-list="false"
           :on-success="handleSuccess">
    <img v-if="imageUrl" :src="imageUrl" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
```

```js
// 上传图片的请求头配置
      headers: {
        Authorization: 'Bearer ' + store.getUser().token
      },
      // 预览图片的地址
      imageUrl: null
```

```js
// 上传图片成功
    handleSuccess () {

    },
```



上传成功业务逻辑：

- 预览图片 且  有成功提示
- 2s后，关闭对话框 且 第一页更新列表

```js
 // 上传图片成功
    handleSuccess (res) {
      // 提示 与 预览
      this.$message.success('上传素材成功')
      // res 是后台的响应主体  预览地址res.data.url
      this.imageUrl = res.data.url
      // 2s后   关闭对话框 更新列表
      window.setTimeout(() => {
        this.dialogVisible = false
        this.reqParams.page = 1
        this.getImages()
      }, 2000)
    },
    // 打开对话框
    openDialog () {
      this.dialogVisible = true
      // 完成其他业务  清空预览图
      this.imageUrl = null
    },
```





### 12-前后端分离并行开发

> 当开发的过程中，接口未开发。

- json-server

- mock平台

