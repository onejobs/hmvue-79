## DAY02-黑马头条PC

### 01-反馈

| 姓名 | 意见或建议                                                   |
| ---- | ------------------------------------------------------------ |
| ***  | 单看老师的笔记，不清楚具体的下一步、往哪写，视屏里讲的很详细，但是一停下来找视屏去看感觉断断续续还费时间，老师可不可以笔记再记得详细一点，不知道其他同学感觉如何(╯﹏╰)b |
| ***  | 今天的课程我都懂了！你信吗？？？                             |
| ***  | 希望可以在代码上多写点注释，各个代码的功能，以便于理解       |
| ***  | 老师以后能把预习的笔记和项目大概的步骤发一下吗？敲完了还可以往后自己预习预习 |
| ***  | Vue基础没有讲完，后边还给补充吗                              |
| ***  | 讲师讲的很棒!继续加油。                                      |
| ***  | 老师讲的真棒                                                 |
| ***  | 叔叔,那个github第一步创建的 带网址的 是分支还是项目啊        |

### 02-回顾

- 介绍项目
- 回忆知识
- element-ui
  - 适合做后台管理系统项目
- vue-router
- src目录
- 登录模块
  - 创建分支 切换该分支
  - 开发代码，已小功能为节点，进行提交。
  - 切换master合并登录模块

- 根据需求找组件
  - 找示例
    - 找到对应
      - 参考示例代码
      - 分析代码
    - 没有找到
      - 看文档

### 03-登录模块-添加校验

- 信息1：el-form 标签上 属性  rules = "约定的验证规则"
- 信息2：el-form-item 标签上 属性  prop="字段名称"   是model绑定对象字段名称



**使用校验的步骤：**

```html
<el-form :model="loginForm" :rules="loginRules">
```

```js
data () {
    return {
      // 表单数据对象
      loginForm: {
        mobile: '',
        code: ''
      },
      // 校验规则对象
      loginRules: {
        // 定义字段对应的校验规则(多种)
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
          // 手机格式校验  没有提供默认的校验规则
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入6位数字', trigger: 'blur' }
        ]
      }
    }
  }
```

```html
<el-form-item prop="mobile">
```

```html
<el-form-item prop="code">
```



**自定义校验规则：**

```js
// 定义校验函数  先申明 (在return数据之前)
// 1. 三个参数
// 2. rule 校验规则对象  value 当前字段值 callback 校验后回调函数
// 3. callback() 成功  callback(new Error('显示错误提示信息'))
const checkMobile = (rule, value, callback) => {
    // 自己校验逻辑   必须是手机号格式：第一个数字 1 第二个数字 3-9  最后其它9个数字
    if (!/^1[3-9]\d{9}$/.test(value)) {
        // 格式不对
        return callback(new Error('手机号格式不对'))
    }
    callback()
}
```

```diff
mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // 手机格式校验  没有提供默认的校验规则  change 值改变触发
+          { validator: checkMobile, trigger: 'change' }
        ],
```



### 04-登录模块-整体校验

- 点击登录按钮的时候：
  - 对整个表单进行校验
  - 表单组件 提供了函数 validate(fn(valid))
  - 怎么调用其他组件的函数  
    - 获取到组件的实例  调用其函数
    - ref="loginForm"  ===> this.$refs.loginForm
    -  this.$refs.loginForm.validate()

```html
<el-form ref="loginForm" :model="loginForm" :rules="loginRules" status-icon>
```

```html
<el-button type="primary" @click="login()" style="width:100%">登 录</el-button>
```

```js
methods: {
    login () {
      // 对整个表单进行校验
      // 1. 给表单组件加ref属性   ref="loginForm"
      // 2. 获取组件实例（dom对象）
      // 3. 调用校验函数
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 进行登录即可
          console.log('ok')
        }
      })
    }
  }
```

### 05-登录模块-进行登录

简单配置axios    main.js

```js
// 简单配置axios
import axios from 'axios'
Vue.prototype.$http = axios
```

登录逻辑    views/login/index.vue

```html
<el-form-item>
          <el-button type="primary" @click="login()" style="width:100%">登 录</el-button>
        </el-form-item>
```

```js
methods: {
    login () {
      // 对整个表单进行校验
      // 1. 给表单组件加ref属性   ref="loginForm"
      // 2. 获取组件实例（dom对象）
      // 3. 调用校验函数
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 进行登录即可
          // 调用接口，简单配置axios
          // 需要接口文档  信息： 地址 请求方式  传参 返回数据
          // 成功 跳转到首页
          // 失败 提示错误
          this.$http
            .post(
              'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
              this.loginForm
            )
            .then(res => {
              // 成功
              this.$router.push('/')
            })
            .catch(() => {
              // 失败
              this.$message.error('手机号或验证码错误')
            })
        }
      })
    }
  }
```



###06-登录模块-怎么注册

测试帐号：13911111111

万能验证码：246810

但是：不建议大家使用测试帐号，很多同时使用一个帐号测试结果不准确。



- 注册：
  - 使用手机，下载一个  黑马头条 APP （IOS不支持） 浏览器搜索。
  - 登录（注册），输入你的手机号（不一定自己的），验证码246810 进行登录（注册）
  - PC系统进行登录



### 07-首页模块-路由与组件

组件：views/home/index.vue

```html
<template>
  <div class='container'>Home</div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'></style>

```

路由：router/index.js

```diff
  // 路由规则
  routes: [
    // name: 'login' 给当前路由取名
    // 跳转使用：$router.push('/login') 或者 $router.push({name:'login'})
    { path: '/login', name: 'login', component: Login },
+    { path: '/', name: 'home', component: Home }
  ]
```



### 08-首页模块-基础布局

```html
<template>
  <el-container class="home-container">
    <el-aside width="200px">Aside</el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>

<style scoped lang='less'>
// FE  front end  前端工程师
// el-container 自定义标签是一个组件  渲染后的结构div span section  默认在标签上架上一个和组件名称一致的类名
.home-container{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .el-aside{
    background: #002033;
  }
  .el-header{
    border-bottom: 1px solid #ddd;
  }
}
</style>

```





###09-首页模块-头部内容

结构

```html
<el-header>
        <span class="icon el-icon-s-fold"></span>
        <span class="text">江苏传智播客科技教育有限公司</span>
        <el-dropdown class="my-dropdown">
          <span class="el-dropdown-link">
            <!-- 头像 用户名称 -->
            <img class="avatar" src="../../assets/images/avatar.jpg" alt="">
            <span class="username"> 用户名字</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <!--  slot="dropdown" 插槽 -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
```

样式

```less
.el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 24px;
      vertical-align: middle;
      padding-right: 10px;
    }
    .text {
      vertical-align: middle;
    }
    .my-dropdown{
      float: right;
      .avatar{
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .username{
        font-weight: bold;
        color: #333;
        vertical-align: middle;
      }
    }
  }
```





### 10-首页模块-分析导航菜单组件

```html
<!-- el-menu 菜单容器 -->
<!-- default-active="2" 默认激活的菜单 通过菜单的index属性来指定-->
<!-- background-color="#545c64"  背景颜色 -->
<!-- text-color="#545c64"  文字颜色 -->
<!-- active-text-color="#ffd04b#545c64"  激活菜单颜色 -->
<el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <!-- el-submenu 拥有子菜单的菜单项 el-menu-item 是没有子菜单的选项-->
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
    </el-menu>
```





###11-首页模块-绘制导航菜单

结构：

```html
<el-aside width="200px">
      <!-- logo -->
      <div class="logo"></div>
      <!-- 导航菜单 -->
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="7">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
```

样式：

```less
.el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/images/logo_admin.png) no-repeat
        center / 140px auto;
    }
    .el-menu{
      border-right: none;
    }
  }
```



###12-首页模块-导航菜单折叠效果

- 导航菜单折叠
  - logo的切换
    - 需要把 大图 换成 小图
    - 操作样式：绑定style属性  绑定class属性
  - 侧边栏宽度切换
    - 绑定width属性
  - 导航菜单组件（展开与收起）切换
    - collapse 属性  属于 el-menu
    - 值  true 的时候    收起
    - 值  false 的时候    展开   默认值

绑定事件，改变数据的状态：

```html
 <el-header>
        <span @click="toggleMenu()" class="icon el-icon-s-fold"></span>
```

```js
methods: {
    toggleMenu () {
      // 切换侧边栏展开与收起
      // 数据 isCollapse 默认值false 展开意思
      // 通过这个数据的状态去切换 侧边栏展开与收起 状态
      this.isCollapse = !this.isCollapse
    }
  }
```

```js
data () {
    return {
      isCollapse: false
    }
  },
```

三个地方，依赖数据：

```html
<!-- logo -->
<div class="logo" :class="{miniLogo:isCollapse}"></div>
```

样式：

```less
// 后面样式覆盖前面
    .miniLogo{
      background-image: url(../../assets/images/logo_admin_01.png);
      background-size: 36px auto;
    }
```

```html
<el-aside :width="isCollapse?'64px':'200px'">
```

```diff
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
+        :collapse="isCollapse"
+        :collapse-transition="false"
      >
```



### 13-首页模块-欢迎页面

- 欢迎页面 属于 二级路由 对应的组件   views/welcome/index.vue

```html
<template>
  <div class='container' style="text-align:center">
    <img src="../../assets/images/welcome.jpg" alt="">
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'></style>

```

路由规则配置：router/index.js

```js
{
      path: '/',
      component: Home,
      children: [
        // 欢迎页面  如果子路由有名字  父级路由需要删除
        { path: '/', name: 'welcome', component: Welcome }
      ]
    }
```





###14-首页模块-导航菜单路由功能

- 点击菜单后  地址需要切换
  - el-menu  router   加上属性默认就是true的值
  - 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转

```html
 <el-menu
        default-active="/"
        class="el-menu-vertical-demo"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
```



### 15-首页模块-404页面

- 404的意义
  - 根据用户输入的地址，无法找到对应的资源（组件）
  - 判断输入地址，没有对应的（路由）组件处理，默认显示一个404组件。
  - 当地址去匹配 所有的路由规则后  都不满足，用一个通配的规则，匹配过来，显示404组件。

404组件：views/404/index.vue

```html
<template>
  <div class='container'></div>
</template>

<script>
export default {}
</script>

<style scoped lang='less'>
.container{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url(../../assets/images/404.png) no-repeat center / cover
}
</style>

```

404的路由规则：router/index.js

```js
const router = new VueRouter({
  // 路由规则
  routes: [
    // ... 省略很多路由
    // 404 处理  通配   一定写在所有路由规则的最后
    { path: '*', name: '404', component: NotFound }
  ]
})
```




