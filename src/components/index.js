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
