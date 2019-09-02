## 黑马头条后台管理项目-DAY04

### 01-反馈

| 姓名 | 意见或建议                                                   |
| ---- | ------------------------------------------------------------ |
| ***  | 不学就别叫唤不会                                             |
| ***  | 最后一个视频不太懂 json-server怎么来                         |
| ***  | 不知道上课大家一起吃榴莲糖，是不是就不困了ლ(´ڡ`ლ)好吃的.     |
| ***  | 不知道什么时候自己也变成南郭先生了！！！                     |
| ***  | 太乱                                                         |
| ***  | score.setUser(res.data.data)貌似是用户的所有相关信息，为什么不直接找到token的值直接设置 |
| ***  | 一讲就会，一做就懵圈                                         |
| ***  | 守卫和拦截不是很清楚 还有叔叔,那个store念"死到"不是"死到瑞"  |
| ***  | 疏疏，讲得很好                                               |
| ***  | 真没懂，很绕，真没理解，看代码都不知道什么意思，             |
| ***  | 老师可以简单说一下那个手机验证码中的 极验吗？想了解一下      |
| ***  | 蜀黍,知识模块的代码逻辑希望讲一下 实现什么效果 需要怎么实现 用到什么知识 思路流程是怎样的 ,这些功能代码为什么放到这个文件夹而不是另一个文件夹,按着老师代码敲没有思路,感觉效果不明显 |
| ***  | 可能基础没打好 好多听不懂 太多了                             |
| ***  | 啥也不想说，就想喊你一声 蜀黍 ！多亲切，是不？周淑刚先生！   |
| ***  | In every lost soul, the bones of the miracle                 |
| ***  | 叔叔，你有药吗？每天上你的课都很兴奋，给吃了摇头丸一样！！！好兴奋哟！！！ |

### 02-回顾

- json-server   基于node命令工具
  - npm i json-server -g   任何目录使用
  - 根据json文件快速生成接口
  - json格式  必须是一个对象 {"a":"数据"}
  - 一个接口：http://localhost:3000/a

- 回顾
  - 保存用户信息
    - sessionStorage
  - 根据是否存储用户信息，控制页面的访问权限。
    - 前置导航守卫
  - 需要在每次请求头追加 token
    - axios请求拦截器
  - 当token实习的时候，根据401状态码跳转到登录
    - axios响应拦截器
  - async await 使用，让异步写法更加简单。



### 03-登录-async&await使用

```js
// 使用 async await 发请求

// 解构赋值
// 得到 用户 信息  res.data.data  res = {data:{data:'用户信息',message:'提示'}}
// 以前获取对象中的属性值：res.data ={data:'用户信息'}
// ES6提供解构赋值语法：{data:{data:data}}

// 捕获异常
// 使用 try{ //当代码可能发生错误 }catch(err){ //触发catch函数 捕获到异常（报错） }
// await接受成功的结果，那么失败怎么办？
try {
    const { data: { data } } = await this.$http.post('authorizations', this.loginForm)
    store.setUser(data)
    this.$router.push('/')
} catch (e) {
    // 提示
    this.$message.error('手机号或验证码错误')
}
```

- 解构赋值
- 捕获异常



### 04-首页-用户信息

```diff
  data () {
    return {
      isCollapse: false,
+      name: '',
+      photo: ''
    }
  },
```

```js
import store from '@/store'
```

```js
  created () {
    const user = store.getUser()
    this.name = user.name
    this.photo = user.photo
  },
```

修改html:

```html
  <!-- 头像 用户名称 -->
            <img class="avatar" :src="photo" alt />
            <span class="username"> {{name}}</span>
```



### 05-首页-退出登录

- 绑定点击事件：

```html
            <el-dropdown-item icon="el-icon-setting" @click.native="setting()">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" @click.native="logout()">退出登录</el-dropdown-item>
```

- 实现函数内逻辑

```js
    // el-dropdown-item 绑定事件  不支持click
    // 当你给组件绑定事件的时候，如果组件没有支持这个事件，当然不会触发。
    // click是原生dom拥有的事件，目的给组件渲染后的dom绑定事件
    // 事件修饰符，例如 @click.prevent="函数"  阻止默认行为  @click.native 把原生事件绑定在组件上
    // https://cn.vuejs.org/v2/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6

    // 去设置页面
    setting () {
      this.$router.push('/setting')
    },
    // 退出登录
    logout () {
      // 清除存储用户信息
      store.delUser()
      // 跳转到登录
      this.$router.push('/login')
    },
```







### 06-内容管理-组件与路由

```html
<template>
  <div class='container'>Article</div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'></style>

```

路由规则：

```diff
{
      path: '/',
      component: Home,
      children: [
        // 欢迎页面  如果子路由有名字  父级路由需要删除
        { path: '/', name: 'welcome', component: Welcome },
+        { path: '/article', name: 'article', component: Article }
      ]
    },
```



### 07-内容管理-激活导航菜单

```diff
 <!-- 导航菜单 -->
      <!-- default-active="/" 根据当路径来设置 this.$route.path -->
      <!-- this.$route 获取路由数据  this.$router 调用路由函数 -->
      <!-- 获取地址栏传参：user?id=100  this.$route.query.id  /user/100 this.$route.params.id  -->
      <el-menu
+        :default-active="$route.path"
        class="el-menu-vertical-demo"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
```



### 07-内容管理-筛选条件布局

```html
<!-- 筛选项 -->
    <el-card>
      <!-- 头部 -->
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态：">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <el-select v-model="reqParams.channel_id" placeholder="请选择">
            <el-option
              v-for="item in channelOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
```

依赖数据：

```js
data () {
    return {
      // 提交后台参数  值为null的时候  字段是不会发送给后台的。
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      // 日期数据  0索引 起始时间 1索引  结束时间
      dateArr: [],
      // 频道选项数据
      channelOptions: [{ id: 100, name: 'java' }]
    }
  }
```



### 08-内容管理-vue插槽

- 当你使用一个组件的时候，想额外插入不同的内容，使用插槽。

- 默认插槽

```html
<!-- 当使用组件的时候  内容默认会插入slot标签内 -->
<slot></slot>
```

- 备用内容

```html
<!-- 默认在插槽显示的内容：备用内容 -->
<slot>content</slot>
```

- 具名插槽（当你需要往组件内容插入多处内容）

```html
<!-- 申明具名插槽（封装组件） -->
<slot name="content">content</slot>
```

```html
<!-- 使用具名插槽（使用组件） -->
<div slot="content">con1</div>
```

- 作用域插槽（当使用组件的时候，获取组件内部的数据，来渲染插槽的内容）

```html
<slot name="content" :abc="msg" def="100">content</slot>
```

```html
<!-- slot-scope 获取组件内容给插槽传递的数据  scope是收集了当前插槽上所有绑定的数据  -->
<div slot="content" slot-scope="scope">con1 {{scope.abc}}</div>
```

- 补充作用域插槽（以上写法是vue2.6.0之前写法，已经淘汰，保留功能）

```html
<!-- 新写法使用 v-slot 指令  v-slot:插槽名称="作用域数据对象" -->
<template v-slot:content="scope">con1 {{scope.abc}}</template>
```

**帮助封装组件，看懂element-ui的组件使用方法。**



### 09-内容管理-面包屑组件封装

封装组件：components/my-bread.vue

```html
<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><slot></slot></el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {}
</script>

<style scoped lang='less'></style>

```

使用组件：views/article/index.vue

```js
import MyBread from '@/components/my-bread'
export default {
  components: { MyBread },
```

```html
<!-- 头部 -->
<div slot="header">
    <my-bread>内容管理</my-bread>
</div>
```



### 10-内容管理-vue插件封装

- 目的：封装一个插件，内部把components下所有组件，注册成全局组件。
  - 插件
  - 注册全局组件

componnets/index.js 封装插件

```js
// 定义成一个插件
// 规则：模块向外暴露一个对象，对象中选项install，指向的是函数，函数传参Vue 。
// 功能：函数内去实现 插件逻辑业务。
import MyBread from '@/components/my-bread'
export default {
  install (Vue) {
    // Vue 是 import Vue from 'vue' 对象
    // 是个插件 怎么使用插件  main.js 使用 Vue.use(插件) 调用install函数传入 Vue 对象
    // 把 components 下的组件  注册成全局组件
    // Vue.component('组件名称', '组件配置对象')
    Vue.component(MyBread.name, MyBread)
  }
}

```

main.js 使用插件

```js
import myPlugin from '@/components'
Vue.use(myPlugin)
```



### 11-内容管理-查询结果布局

分析：表格

```html
<!-- 表格容器 :data="tableData" [{date:'2018-10-10',name:'',address:''},...] 表格数据   -->
<el-table
      :data="tableData">
      <!-- el-table-column  列组件-->	
      <!-- prop 指定列显示数据（通过字段名称指定） -->
      <!-- label="日期"  当前列数据的描述 -->
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
```

自己代码：

```html
<!-- 表格 -->
      <el-table :data="articles">
        <el-table-column prop="title" label="标题"></el-table-column>
      </el-table>
```

```js
// 文章列表数据
 articles: [{ title: '文章标题xxxxx' }, { title: '文章标题xxxxx' }]
```

分页：

```html
<!-- 分页 -->
      <el-pagination class="pager" background layout="prev, pager, next, total" :total="1000"></el-pagination>

```





