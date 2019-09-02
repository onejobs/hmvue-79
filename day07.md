## DAY07-黑马头条PC

### 01-反馈

| 姓名 | 意见或建议                                                   |
| ---- | ------------------------------------------------------------ |
| ***  | 看上课的素材图片我好怕我会长针眼，闪瞎我的钛合金像素眼。油焖大虾换成清粥小菜蛮好。。。。 |
| ***  | 一天，项羽对虞姬说：“姬，你太美。”虞姬生气地给了项羽一大嘴巴子，说：“你怎么这么恶毒。” |
| ***  | 怎么办啊，自己做一点思路都没有，心好痛 o(╥﹏╥)o              |
| ***  | v-model背后的@input事件中，@input="msg=\$event"， 为什么\$event可以直接给msg赋值啊。不是应该$event.target.value吗 |
| ***  | 害怕吗 要找工作了！！！！                                    |
| ***  | 必须有人浴血奋战，世上才有自由可言                           |
| ***  | 频道封装不理解，this.$emit('input', channelId) 父组件没有给子组件绑定input事件为什么能直接用 |

### 02-回顾

- 频道组件封装
- 素材管理实现
  - 素材列表
  - 素材分页
  - 收藏素材切换
  - 收藏与取消收藏
  - 删除功能
  - 添加素材



###03-发布文章-基础布局

**基础布局：**views/publish/index.vue

```html
<template>
  <div class='container'>
    <el-card>
      <div slot="header">
        <my-bread>发布文章</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          富文本
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 选择封面图按钮 -->
          <div class="btn_img">
            <img src="../../assets/images/default.png" alt="">
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item >
          <el-button type="primary">发表</el-button>
          <el-button>存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articleForm: {
        title: '',
        cover: {
          type: 1
        },
        channel_id: null
      }
    }
  }
}
</script>

<style scoped lang='less'>
.btn_img{
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img{
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>

```

**使用富文本：**

- https://github.com/vuejs/awesome-vue  记录vue技术栈相关的 框架 组件库 插件 文章 博客 教学视频
- 找到：https://github.com/surmon-china/vue-quill-editor  富文本。

安装：npm install vue-quill-editor

挂载：

```js
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入指定成员（富文本组件配置对象）    在封装模块的时候，默认导出，指定导出。
import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  }
}
```

使用：

```html
<quill-editor v-model="content" :options="editorOption"></quill-editor>
```

- options 配置属性  执行的是配置对象 editorOption 。



**配置富文本：**

功能

quill  js插件文档地址  https://quilljs.com/docs/quickstart/

```js
// 富文本配置对象
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      },
```

样式: styles/index.less

```css
#app .ql-editor{
  height: 300px;
}
#app .ql-toolbar.ql-snow{
  padding: 0 8px;
}
```



### 04-发布文章-封面组件-分析功能

- 组件的结构：
  - 图片按钮
  - 对话框
    - 素材库
      - 素材列表
      - 分页
      - 全部收藏切换
      - 选中图片功能
    - 上传图片
      - 上传组件
      - 上传成功后，预览。
  - 确认图片
    - 如果选的是素材库，使用选中的图
    - 如果选的是上传图片，使用上传的图片
    - 做为封面图，在图片按钮显示。
- 支持v-model





### 05-发布文章-封面组件-基础布局

- 图片按钮
- 对话框

定义了一个组件：components/my-image.vue

```html
<template>
  <div class="container">
    <!-- 按钮图片 -->
    <div class="btn_img" @click="openDialog">
      <img src="../assets/images/default.png" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="image">素材库内容</el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">上传图片内容</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'my-image',
  data () {
    return {
      dialogVisible: false,
      // 选项卡name属性的值  选中某一个选项卡，只需要值等于name属性值即可。
      activeName: 'image'
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang='less'>
.btn_img {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer{
  width: 100%;
  display: block;
  text-align: center;
}
</style>

```

组成组件：components/index.js

```js
import MyImage from '@/components/my-image'
// .... 
Vue.component(MyImage.name, MyImage)
```

使用组件：vies/publish/index.vue

```html
<!-- 封面选择组件 -->
<my-image></my-image>
```





### 06-发布文章-封面组件-素材列表与分页

结构：

```html
<el-tab-pane label="素材库" name="image">
          <!-- 单选按钮 -->
          <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 图片列表 -->
          <div class="img_list">
            <div class="img_item" v-for="item in images" :key="item.id">
              <img :src="item.url" alt />
            </div>
          </div>
          <!-- 分页 -->
          <el-pagination
            style="text-align:center"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="changePager"
            hide-on-single-page
          ></el-pagination>
        </el-tab-pane>
```

数据：

```js
// 素材列表请求参数对象
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      // 素材列表数据
      images: [],
      // 素材总图片数量
      total: 0
```

函数：

```js
async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 设置总条数
      this.total = data.total_count
    },
    // 分页切换
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 全部与收藏切换
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    }
```

获取列表的时机：

```diff
openDialog () {
      this.dialogVisible = true
      // 获取素材列表数据
+      this.getImages()
    },
```



###07-发布文章-封面组件-选中素材效果

- 点击图片
  - 选中当前图片
  - 其他图片不选中
  - 怎么选中：
    - 需要容器（遮罩，打钩图片，居中显示）

思考1：怎么才代表选中？

- 需要一个数据，标识当前图片是否选中，值布尔类型。
- 怎么得到数据的值，记录当前点击的图片唯一标识，和当前所有图片的ID进行比对，如果一致代表选中，反之不选中。
- 加上了 selected 类选中了。

```html
 <div class="img_item" :class="{selected:item.url===selectedImageUrl}" @click="selectedImage(item.url)" 
```

```js
// 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
      // 在遍历图片的时候，比对记录的URL
      // 如果一致  选中  不一致 不选中
    },
```

```js
// 记录点击图片的唯一标识（图片地址）
      selectedImageUrl: null
```

思考2：选中效果怎么实现？

怎么通过一个类，能够实现一个容器（元素）的效果？答案：（伪元素选择器）

```less
&.selected{
      &::after{
        // .img_item.selected::after{} 解析后选择器
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,0.2) url(../assets/images/selected.png) no-repeat center / 50px
      }
    }
```






###08-发布文章-封面组件-上传图片功能

```html
<!-- 上传组件 -->
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            name="image"
            :show-file-list="false"
            :on-success="handleSuccess">
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
```

数据：

```js
// 上传图片请求头
      headers: {
        Authorization: 'Bearer ' + store.getUser().token
      },
      // 上传成功后的预览图地址
      uploadImageUrl: null
```

函数：

```js
 // 上传图片成功
    handleSuccess (res) {
      this.$message.success('上传图片成功')
      // 预览
      this.uploadImageUrl = res.data.url
    },
```

补充：再次打开对话框的时候，重置数据。

```js
openDialog () {
      this.dialogVisible = true
      // 清除之前对话框的操作数据
      this.activeName = 'image'
      this.selectedImageUrl = null
      this.uploadImageUrl = null
      // 获取素材列表数据
      this.getImages()
    },
```







###09-发布文章-封面组件-确认图片

- 点击确认按钮：
  - 如果当前选中的是素材库，校验 selectedImageUrl是否有数据
  - 如果当前选中的是上传图片，校验 uploadImageUrl是否有数据
  - 如果没有：提示
  - 如果有：使用对应的图片地址即可 关闭对话框。

```html
<el-button type="primary" @click="confirmImage">确 定</el-button>
```

```js
// 确认后的图片地址
confirmSrc: '../assets/images/default.png'
```

```js
 // 确认图片
    confirmImage () {
      // 校验是否  选中   上传图片  数据
      // 判断的是 用户选中的tab是谁？
      let url = null
      if (this.activeName === 'image') {
        if (!this.selectedImageUrl) return this.$message.info('请选中一张图片')
        url = this.selectedImageUrl
      } else {
        if (!this.uploadImageUrl) return this.$message.info('请上传一张图片')
        url = this.uploadImageUrl
      }
      // 给图片按钮的src赋值  看到你选择的封面图片
      this.confirmSrc = url
      this.dialogVisible = false
    },
```

```html
<img :src="confirmSrc" alt />
```



问题：默认图丢失了。

- 原来的地址写在：img标签上
  - 不用渲染
- 现在的地址写在：数据中
  - 渲染后才在你的标签中

导致：基于vue-cli 3.0的项目，基于webpack搭建，是一个打包工具，把项目依赖的所有资源，合并到一起（目录下）。

依赖的所有资源（import  src  url  href）依赖资源都会打包。渲染后的地址不会打包。

结论：图片没有打包在你运行的项目中。

方案：自己主动的去导入图片数据即可

```js
import defaultImage from '../assets/images/default.png'
```

```js
// 确认后的图片地址
confirmSrc: defaultImage
```



### 10-发布文章-封面组件-双向绑定

- 双向绑定的数据：v-model="articleForm.cover.images[0]"



父给子

```js
  props: ['value'],
```

```html
<img :src="value||defaultImage" alt />
```

```js
// data申明一个默认图数据
defaultImage
```

子给父

```js
 // 给图片按钮的src赋值  看到你选择的封面图片
// this.confirmSrc = url
// 把你确认的图片地址 提交给父组件
this.$emit('input', url)
```





### 11-发布文章-封面组件-使用组件

组件内部

```css
.img-container{
  display: inline-block;
  margin-right: 20px;
}
```

使用组件：

```html
<!-- 封面选择组件 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type===3">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
            <my-image v-model="articleForm.cover.images[1]"></my-image>
            <my-image v-model="articleForm.cover.images[2]"></my-image>
          </div>
```

重置数据：

```html
 <el-radio-group @change="changeType"
```

````js
changeType () {
    // 选择过封面类型的时候 重置数据
      this.articleForm.cover.images = []
    }
````



###12-发布文章-发表&存入草稿

- 点击发表，点击存入草稿
  - 把文章数据提交给后台
  - 成功：提示+跳转内容管理

```html
<el-button type="primary" @click="submit(false)">发表</el-button>
<el-button @click="submit(true)">存入草稿</el-button>
```

```js
async submit (draft) {
      // 省去了校验
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      this.$router.push('/article')
    }
```



###13-发布文章-合并修改文章业务

- 在内容管理页面，点击编辑的时候，携带ID跳转过来。
  - 所以，根据地址栏是否有ID来判断当前的页面是什么。
- 如果是编辑业务：
  - 获取当前文章信息，组件初始化的时候。
  - 更新界面，面包屑文字，底部操作按钮替换。
  - 修改请求。

更新表单

```js
// 当前文章Id
      articleId: null
```

```js
created () {
    this.articleId = this.$route.query.id
    // 如果是编辑
    // this.articleId && this.getArticle()
    if (this.articleId) {
      this.getArticle()
    }
  },
```

```js
// 获取文章数据
    async getArticle () {
      const { data: { data } } = await this.$http.get(`articles/${this.articleId}`)
      // 填充表单
      this.articleForm = data
    },
```

面包屑

```html
<my-bread>{{articleId?'修改':'发布'}}文章</my-bread>
```

底部按钮

```html
 <el-form-item v-if="!articleId">
          <el-button type="primary" @click="submit(false)">发表</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="success" @click="update(false)">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
```

```js
 async update (draft) {
      // 地址栏多了ID  方式put
      await this.$http.put(`articles/${this.articleId}?draft=${draft}`, this.articleForm)
      // 成功
      this.$message.success(draft ? '修改时存入草稿成功' : '修改成功')
      this.$router.push('/article')
    }
```





问题：在编辑文章的时候，点击发布文章，组件不更新。





